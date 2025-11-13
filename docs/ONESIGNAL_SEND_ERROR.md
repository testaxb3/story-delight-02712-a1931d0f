# Guia de Diagnóstico: Erro ao Enviar Notificações pelo Admin

## Problema Relatado
Não consigo enviar notificações pelo painel Admin. Possíveis sintomas:
- Mensagem de erro aparece
- Sou redirecionado para página de login (AUTH)
- Notificação não chega nos usuários

## Como Diagnosticar

### Passo 1: Abra o Console do Navegador

1. Abra o app no navegador
2. Aperte **F12** para abrir o DevTools
3. Vá na aba **Console**
4. **IMPORTANTE:** Clique no ícone de "limpar" 🗑️ para limpar o console

### Passo 2: Tente Enviar uma Notificação

1. Vá em **Admin → Notifications**
2. Preencha:
   - **Title:** Teste
   - **Message:** Mensagem de teste
3. Clique em **"Send to All Subscribed Users"**
4. **AGUARDE** e observe o console

### Passo 3: Copie os Logs

Você verá logs assim no console. **COPIE TUDO** e me envie:

#### ✅ Exemplo de SUCESSO:
```
[OneSignal] sendNotificationToAll called
[OneSignal] Title: Teste
[OneSignal] Message: Mensagem de teste
[OneSignal] App ID configured: true
[OneSignal] REST API Key configured: true
[OneSignal] App ID length: 36
[OneSignal] App ID preview: a1b2c3d4...
[OneSignal] REST API Key length: 48
[OneSignal] REST API Key preview: ZGFhMzJl...
[OneSignal] Request payload: { ... }
[OneSignal] Response status: 200
[OneSignal] Response statusText: OK
[OneSignal] Notification sent successfully!
[OneSignal] Notification ID: abc123...
[OneSignal] Recipients: 5
```

#### ❌ Exemplo de ERRO - Credenciais não configuradas:
```
[OneSignal] sendNotificationToAll called
[OneSignal] App ID configured: false
[OneSignal] REST API Key configured: false
[OneSignal] OneSignal credentials not configured
```

**SOLUÇÃO:** As variáveis de ambiente não estão configuradas no Vercel. Veja "Passo 4" abaixo.

#### ❌ Exemplo de ERRO - REST API Key inválida:
```
[OneSignal] Response status: 401
[OneSignal] Response statusText: Unauthorized
[OneSignal] API Error: Invalid or missing Authorization header
```

**SOLUÇÃO:** A REST API Key está errada. Veja "Passo 4" abaixo.

#### ❌ Exemplo de ERRO - App ID inválido:
```
[OneSignal] Response status: 404
[OneSignal] Response statusText: Not Found
[OneSignal] API Error: App not found
```

**SOLUÇÃO:** O App ID está errado. Veja "Passo 4" abaixo.

#### ❌ Exemplo de ERRO - Formato incorreto:
```
[OneSignal] Response status: 400
[OneSignal] Response statusText: Bad Request
[OneSignal] API Error: Invalid included_segments
```

**SOLUÇÃO:** Problema no formato da requisição (isso seria bug do código, não das suas credenciais).

## Passo 4: Como Configurar Corretamente no Vercel

Se os logs mostrarem que as credenciais não estão configuradas ou estão inválidas:

### 1. Pegue as Credenciais Corretas do OneSignal

1. Acesse: https://app.onesignal.com
2. Faça login
3. Selecione seu app **"NEP System"** (ou o nome que você deu)
4. Vá em: **Settings** (⚙️) → **Keys & IDs**
5. Copie (certifique-se de copiar TUDO):
   - **OneSignal App ID**: Algo como `a1b2c3d4-e5f6-7890-abcd-ef1234567890` (36 caracteres)
   - **REST API Key**: Clique em **"Show"** e copie. Algo como `ZGFhMzJlODctOWRkYi00ZDk5LWE3MWYtNzEwMjY5YjVjMjRl` (48 caracteres, ou mais)

### 2. Configure no Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em: **Settings** → **Environment Variables**
4. **REMOVA** as variáveis antigas do OneSignal (se existirem)
5. **ADICIONE** novamente, com MUITO CUIDADO:

#### Variável 1:
```
Name: VITE_ONESIGNAL_APP_ID
Value: [cole aqui o App ID que você copiou]
Environment: Production, Preview, Development (marque TODOS)
```

#### Variável 2:
```
Name: VITE_ONESIGNAL_REST_API_KEY
Value: [cole aqui a REST API Key que você copiou]
Environment: Production, Preview, Development (marque TODOS)
```

**⚠️ ATENÇÃO:**
- **NÃO** adicione espaços no começo ou fim
- **NÃO** adicione aspas ("") ao redor do valor
- **NÃO** adicione ponto-e-vírgula (;) no final
- Copie e cole EXATAMENTE como aparece no OneSignal

### 3. Redesploy

Depois de salvar as variáveis:

1. Vá em: **Deployments**
2. Clique nos **três pontos (...)** do deploy mais recente
3. Clique em **"Redeploy"**
4. **Marque** a opção **"Use existing Build Cache"** (NÃO)
5. Clique em **"Redeploy"**
6. Aguarde 2-3 minutos

### 4. Teste Novamente

Após o deploy:

1. **Limpe o cache do navegador:** Ctrl + Shift + Delete
2. **Feche e abra** o navegador novamente
3. Acesse o app
4. Abra o console (F12)
5. Vá em Admin → Notifications
6. Tente enviar novamente
7. **Copie os logs** e me envie

## Checklist de Verificação

Use essa lista para verificar tudo:

- [ ] Abri o OneSignal e copiei o App ID correto
- [ ] Abri o OneSignal e copiei a REST API Key correta (cliquei em "Show")
- [ ] Abri o Vercel → Settings → Environment Variables
- [ ] Removi as variáveis antigas do OneSignal
- [ ] Adicionei VITE_ONESIGNAL_APP_ID com o valor correto
- [ ] Adicionei VITE_ONESIGNAL_REST_API_KEY com o valor correto
- [ ] Marquei todos os ambientes (Production, Preview, Development)
- [ ] Fiz Redeploy no Vercel
- [ ] Aguardei o deploy completar
- [ ] Limpei o cache do navegador
- [ ] Testei novamente e copiei os logs do console

## Problemas Comuns

### "App ID configured: false"
**Problema:** A variável VITE_ONESIGNAL_APP_ID não está no Vercel ou tem nome errado.

**Solução:**
- Verifique se o nome está EXATAMENTE: `VITE_ONESIGNAL_APP_ID`
- Verifique se marcou todos os ambientes
- Faça Redeploy

### "REST API Key configured: false"
**Problema:** A variável VITE_ONESIGNAL_REST_API_KEY não está no Vercel ou tem nome errado.

**Solução:**
- Verifique se o nome está EXATAMENTE: `VITE_ONESIGNAL_REST_API_KEY`
- Verifique se marcou todos os ambientes
- Faça Redeploy

### "Response status: 401 - Unauthorized"
**Problema:** A REST API Key está incorreta ou no formato errado.

**Solução:**
- Volte no OneSignal e copie novamente a REST API Key
- Clique em "Show" para ver o valor completo
- Atualize no Vercel
- Faça Redeploy

### "Response status: 404 - Not Found"
**Problema:** O App ID está incorreto.

**Solução:**
- Volte no OneSignal e copie novamente o App ID
- Certifique-se de copiar o App ID do app correto
- Atualize no Vercel
- Faça Redeploy

### "Sou redirecionado para AUTH"
**Problema:** Pode ser um erro de rede ou timeout que está invalidando a sessão.

**Solução:**
- Verifique sua conexão de internet
- Veja se o erro 400 do Supabase persiste no console
- Tente fazer logout e login novamente

## O Que Fazer Depois

Depois de seguir todos os passos:

1. **Copie TODOS os logs do console** quando tentar enviar
2. Me envie os logs
3. Se ainda não funcionar, tire screenshots:
   - Do console com os logs
   - Da tela de Environment Variables no Vercel (pode esconder os valores)
   - Do painel OneSignal Debug (Admin → Notifications)

Aí eu consigo te ajudar melhor!

---

**Última Atualização:** 2025-10-21
**Arquivo de Código:** `src/lib/onesignal.ts` (função `sendNotificationToAll`)
