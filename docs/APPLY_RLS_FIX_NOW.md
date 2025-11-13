# ⚠️ AÇÃO NECESSÁRIA: Aplicar Fix de RLS Agora

## O erro continua porque a migration NÃO foi aplicada ainda!

A migration está apenas no código. Você precisa executá-la no Supabase **AGORA**.

---

## 🚀 PASSO-A-PASSO (Escolha UMA opção)

### OPÇÃO 1: Supabase Dashboard (MAIS FÁCIL) ✅

1. **Abra o Supabase Dashboard**
   - Vá para: https://app.supabase.com
   - Faça login

2. **Selecione seu projeto**
   - Clique no projeto "brainy-child-guide"

3. **Abra o SQL Editor**
   - No menu lateral esquerdo, clique em **"SQL Editor"**
   - Ou acesse diretamente: https://app.supabase.com/project/_/sql

4. **Execute este SQL** (copie e cole TUDO):

```sql
-- Fix RLS policies for scripts table to allow batch inserts
-- Drop existing admin policies
DROP POLICY IF EXISTS "Admins can manage scripts" ON public.scripts;
DROP POLICY IF EXISTS "Admins can insert scripts" ON public.scripts;

-- Create a single comprehensive admin policy with both USING and WITH CHECK
CREATE POLICY "Admins can manage scripts"
ON public.scripts
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
```

5. **Clique em RUN (ou pressione Ctrl+Enter)**

6. **Você deve ver**: `Success. No rows returned`

---

### OPÇÃO 2: Supabase CLI (Se você tem instalado)

```bash
# No terminal, execute:
supabase db push
```

---

## ✅ VERIFICAÇÃO

Após executar, teste novamente:

1. Faça logout e login novamente no sistema
2. Vá para Admin → Scripts
3. Tente fazer upload do arquivo com os 200 scripts
4. **NÃO deve mais dar erro de RLS!**

---

## 🔍 Se AINDA der erro

Pode ser que você não tenha a role de admin. Vamos verificar:

### Verifique se você é admin no Supabase:

1. No Supabase Dashboard, vá em **SQL Editor**
2. Execute este SQL (troque `SEU_EMAIL_AQUI` pelo email que você usa para login):

```sql
-- Verificar se você tem role de admin
SELECT
  p.email,
  ur.role,
  ur.user_id
FROM auth.users au
JOIN public.profiles p ON p.id = au.id
LEFT JOIN public.user_roles ur ON ur.user_id = au.id
WHERE p.email = 'SEU_EMAIL_AQUI';
```

3. **Se NÃO aparecer nada ou se role não for 'admin'**, execute isto:

```sql
-- Adicionar role de admin (troque SEU_EMAIL_AQUI)
INSERT INTO public.user_roles (user_id, role)
SELECT
  au.id,
  'admin'::app_role
FROM auth.users au
JOIN public.profiles p ON p.id = au.id
WHERE p.email = 'SEU_EMAIL_AQUI'
ON CONFLICT (user_id, role) DO NOTHING;
```

---

## 📞 Ainda com problemas?

Me avise qual opção você tentou e qual mensagem de erro apareceu (com print se possível).
