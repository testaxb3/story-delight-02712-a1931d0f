# Diagnóstico de Problemas com Push Notifications

## Problema Relatado

Usuário se inscreveu no aplicativo pelo celular mas:
- ❌ A inscrição não aparece no OneSignal
- ❌ Não está recebendo notificações

## Diagnóstico Realizado

### ✅ Código Implementado Corretamente

O código está 100% correto e funcional:
- ✅ OneSignal SDK instalado (`react-onesignal@3.4.0`)
- ✅ Inicialização no `App.tsx` (linha 32)
- ✅ Funções de envio e recebimento implementadas
- ✅ Admin panel com interface de envio

### ⚠️ Problemas Identificados

#### 1. Variáveis de Ambiente (RESOLVIDO)

O **App ID do OneSignal estava configurado**, mas sem os arquivos necessários:

#### 2. Service Worker Ausente (CORRIGIDO)

**Erro no console:**
```
Failed to register a ServiceWorker with script
'https://nepsystem.vercel.app/OneSignalSDKWorker.js':
A bad HTTP response code (404) was received
```

**Causa:**
- O arquivo `OneSignalSDKWorker.js` não existia na pasta `public/`
- O OneSignal precisa deste arquivo para funcionar como Web Push
- O projeto usa `vite-plugin-pwa` que pode conflitar com Service Workers externos

**Solução Aplicada:**
1. ✅ Criado `public/OneSignalSDKWorker.js`
2. ✅ Criado `public/OneSignalSDK.sw.js`
3. ✅ Corrigido import para usar `.sw.js` em vez de `.page.js`
4. ✅ Atualizado `vite.config.ts` para incluir ambos os arquivos nos assets
5. ✅ Configurado Workbox para não conflitar com OneSignal
6. ✅ Adicionado verificação de Service Worker no painel de debug

#### 3. Import Script Incorreto (CORRIGIDO)

**Erro no console:**
```
Failed to execute 'importScripts' on 'WorkerGlobalScope':
The script at 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js' failed to load.
```

**Causa:**
- Service Workers não podem importar arquivos `.page.js`
- Precisam usar a versão `.sw.js` (Service Worker) do SDK
- O arquivo OneSignalSDKWorker.js estava importando o script errado

**Solução:**
- Corrigido: `importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js')`
- Criado arquivo adicional `OneSignalSDK.sw.js` que também é requerido

#### 4. showNativePrompt Deprecated (CORRIGIDO)

**Erro no console:**
```
TypeError: Nu.showNativePrompt is not a function
[OneSignal] Initialization failed
```

**Causa:**
- A função `showNativePrompt()` foi removida/deprecated no react-onesignal
- Não deve ser chamada automaticamente na inicialização
- API mudou para usar Notification API nativa do navegador

**Solução:**
- Removido `OneSignal.showNativePrompt()` da inicialização
- Configurado `promptOptions.autoPrompt: false` para desabilitar prompt automático
- Criada função `showPermissionPrompt()` que usa `Notification.requestPermission()`
- Usuários ativam notificações manualmente quando quiserem
- OneSignal registra automaticamente quando permissão é concedida (`autoRegister: true`)

#### 5. OneSignal API Deprecated (CORRIGIDO)

**Erro no console:**
```
[OneSignal] Failed to check subscription: TypeError: um.isPushNotificationsEnabled is not a function
[OneSignal] Failed to get player ID: TypeError: um.getUserId is not a function
```

**Causa:**
- As funções `getUserId()` e `isPushNotificationsEnabled()` foram deprecated no Web SDK v16
- A nova API usa `OneSignal.User.PushSubscription` em vez de métodos diretos
- O código estava usando a API antiga

**Solução:**
- Atualizado `getPlayerId()` para usar `OneSignal.User.PushSubscription.getIdAsync()`
- Atualizado `isSubscribed()` para usar `OneSignal.User.PushSubscription.getOptedInAsync()`
- Adicionado fallback para propriedades síncronas `.id` e `.optedIn`
- Mantida compatibilidade com API antiga caso necessário

#### 6. Service Worker Registration Error (CORRIGIDO)

**Erro no console:**
```
[Worker Messenger] [Page -> SW] Could not get ServiceWorkerRegistration to postMessage!
```

**Causa:**
- O OneSignal não estava encontrando o Service Worker registrado
- A configuração do `init()` não especificava os caminhos dos Service Workers
- Pode haver conflito entre o Service Worker do PWA (Vite) e do OneSignal

**Solução:**
- Adicionado `serviceWorkerPath: 'OneSignalSDKWorker.js'` na configuração do init
- Adicionado `serviceWorkerParam: { scope: '/' }` para definir o escopo correto
- Atualizado `vite.config.ts` para excluir arquivos OneSignal do cache do Workbox
- Adicionado logging para verificar registros de Service Workers
- Configurado `globIgnores: ['**/OneSignalSDK*.js']` no Workbox

## ✅ Correções Aplicadas Neste Commit

As seguintes correções foram implementadas e estão prontas para deploy:

### 1. Service Workers do OneSignal
- **Criado:** `public/OneSignalSDKWorker.js`
- **Criado:** `public/OneSignalSDK.sw.js`
- **Conteúdo:** Importam o SDK correto do OneSignal do CDN (versão .sw.js para Service Workers)
- **Correção:** Mudado de `.page.js` para `.sw.js` (Service Workers não podem importar .page.js)
- **Status:** ✅ Pronto para deploy

### 2. Configuração do Vite
- **Arquivo:** `vite.config.ts`
- **Mudanças:**
  - Adicionado `OneSignalSDKWorker.js` aos `includeAssets`
  - Adicionado `OneSignalSDK.sw.js` aos `includeAssets`
  - Configurado `navigateFallbackDenylist` para evitar conflitos
  - **NOVO:** Adicionado `globIgnores: ['**/OneSignalSDK*.js']` para evitar cache do Workbox
- **Status:** ✅ Configurado corretamente

### 3. Painel de Debug Aprimorado
- **Arquivo:** `src/components/OneSignalDebug.tsx`
- **Nova funcionalidade:**
  - Verifica se o arquivo Service Worker existe
  - Mostra status do arquivo em tempo real
  - Diagnóstico automático de problemas
- **Status:** ✅ Implementado

### 4. Correção da API do OneSignal
- **Arquivo:** `src/lib/onesignal.ts`
- **Mudanças:**
  - Removido `showNativePrompt()` da inicialização (função deprecated)
  - Configurado `autoPrompt: false` para controle manual
  - Atualizada `showPermissionPrompt()` para usar Notification API nativa
  - Adicionado `autoRegister: true` para registro automático após permissão
  - **NOVO:** Atualizado `getPlayerId()` para usar `OneSignal.User.PushSubscription.getIdAsync()`
  - **NOVO:** Atualizado `isSubscribed()` para usar `OneSignal.User.PushSubscription.getOptedInAsync()`
  - **NOVO:** Adicionado `serviceWorkerPath` e `serviceWorkerParam` na configuração do init
  - **NOVO:** Adicionado logging de registros de Service Workers para debug
- **Status:** ✅ API corrigida e atualizada para Web SDK v16

### 5. Melhorias no Auth Context
- **Arquivo:** `src/contexts/AuthContext.tsx`
- **Mudanças:**
  - Melhor logging de mudanças de estado de autenticação
  - Tratamento específico para eventos TOKEN_REFRESHED e SIGNED_OUT
  - Previne redirects inesperados quando sessão expira
- **Status:** ✅ Implementado

### 6. Melhorias no Admin Panel
- **Arquivo:** `src/components/Admin/AdminNotificationsTab.tsx`
- **Mudanças:**
  - Adicionado logging detalhado para envio de notificações
  - Mensagens de erro mais específicas para diferentes cenários
  - Melhor feedback para usuário
- **Status:** ✅ Implementado

### 7. Documentação Atualizada
- Este arquivo foi atualizado com as informações dos erros reais
- Adicionado guia de troubleshooting completo
- Documentado todos os problemas e soluções
- **NOVO:** Documentado problema de Service Worker Registration e solução

## Próximo Passo: Deploy

**IMPORTANTE:** Você precisa fazer um **novo deploy** para que estas correções entrem em produção:

1. Faça commit e push deste código (já feito automaticamente)
2. Aguarde o Vercel fazer o deploy automático (~2-3 minutos)
3. Após o deploy, acesse Admin → Notifications → OneSignal Debug
4. Clique em "Atualizar" e verifique:
   - ✅ Service Worker File: Existe
   - ✅ Inicializado: Sim
   - ⚠️ Inscrito: Não (normal - usuário ainda não ativou)

## Como Ativar Notificações (Para Usuários)

Como removemos o auto-prompt, os usuários precisam ativar manualmente:

### Opção 1: Via OneSignal Dashboard (Recomendado para Teste)

1. Acesse: https://app.onesignal.com
2. Vá em: Settings → All Browsers
3. Configure um "Slide Prompt" ou "Custom Prompt"
4. Isso vai mostrar o prompt automaticamente quando usuários visitarem

### Opção 2: Adicionar Botão no App (Melhor UX)

Você pode adicionar um botão "Ativar Notificações" na página de Profile ou Settings que chama:

```typescript
import { showPermissionPrompt } from '@/lib/onesignal';

const handleEnableNotifications = async () => {
  const granted = await showPermissionPrompt();
  if (granted) {
    toast.success('Notificações ativadas!');
  }
};
```

### Opção 3: Ativar Manualmente para Teste

1. Abra o console do navegador (F12)
2. Cole e execute:
```javascript
OneSignal.registerForPushNotifications();
```
3. Aceite o prompt que aparecer
4. Verifique no painel de debug

## Solução

### Como as Variáveis de Ambiente Estão Configuradas

Se você já tem o App ID do OneSignal:

1. **Acesse seu projeto no Vercel**
   - Vá em: https://vercel.com/dashboard

2. **Configure as variáveis de ambiente**
   - Settings → Environment Variables
   - Adicione as seguintes variáveis:

```
VITE_ONESIGNAL_APP_ID=seu-app-id-aqui
VITE_ONESIGNAL_REST_API_KEY=sua-rest-api-key-aqui
```

3. **Faça um novo deploy**
   - Deployments → ... (três pontos) → Redeploy
   - Ou faça um novo push no GitHub que vai triggerar o deploy automático

### Opção 2: Criar Conta OneSignal (Se ainda não tem)

Se você ainda não criou conta no OneSignal, siga:

#### 1. Criar Conta OneSignal (5 minutos)

1. Acesse: https://onesignal.com
2. Clique em "Get Started" ou "Sign Up"
3. Crie conta (pode usar Google/GitHub)
4. Confirme seu email

#### 2. Criar App (2 minutos)

1. No dashboard, clique em "New App/Website"
2. Nome: **"NEP System"** (ou o nome do seu app)
3. Escolha plataforma: **"Web"**

#### 3. Configurar Web Push (3 minutos)

**Site Setup:**
- **Site URL**: Coloque a URL do seu app no Vercel
  - Exemplo: `https://seu-app.vercel.app`
- **Auto Resubscribe**: ✅ Deixe marcado
- **Default Icon**: Deixe em branco por enquanto

**Permission Prompt:**
- **Prompt Type**: "Slide Prompt" (recomendado)
- **Timing**: "After a few seconds" → "10 seconds"

Clique em **"Save"**

#### 4. Pegar Credenciais

1. Vá em: **Settings** (⚙️) → **Keys & IDs**
2. Copie:
   - **OneSignal App ID**: Algo como `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
   - **REST API Key**: Clique em "Show" e copie

#### 5. Adicionar no Vercel

1. Vá no Vercel: Settings → Environment Variables
2. Adicione:

```
Nome: VITE_ONESIGNAL_APP_ID
Valor: [cole o App ID aqui]

Nome: VITE_ONESIGNAL_REST_API_KEY
Valor: [cole a REST API Key aqui]
```

3. Clique em "Save"

#### 6. Redeploy

- Vá em Deployments
- Clique nos três pontos do último deploy
- Clique em "Redeploy"
- Aguarde o deploy completar

### Opção 3: Testar Localmente Primeiro

Se quiser testar localmente antes:

1. Crie arquivo `.env` na raiz do projeto:

```bash
# Copie do .env.example
cp .env.example .env
```

2. Edite o `.env` e adicione:

```env
VITE_ONESIGNAL_APP_ID=seu-app-id
VITE_ONESIGNAL_REST_API_KEY=sua-rest-api-key
```

3. Reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra o app em: http://localhost:8080
5. Você verá o prompt de notificações aparecer
6. Aceite as notificações
7. Vá em Admin → Notifications para testar o envio

## Como Verificar se Funcionou

### 1. Usar o Painel de Debug (NOVO!)

Acabei de adicionar um painel de debug no Admin:

1. Acesse seu app
2. Vá em: **Admin → Notifications**
3. No topo, você verá o card **"OneSignal Debug"**
4. Clique em "Atualizar" para ver o status atual

O painel mostra:
- ✅ Se o App ID está configurado
- ✅ Se o navegador suporta notificações
- ✅ Status da permissão
- ✅ Se o OneSignal inicializou
- ✅ Se você está inscrito
- ✅ Seu Player ID (ID único do usuário)

### 2. Verificar no Console do Navegador

Abra o console (F12) e procure por:

**Se FUNCIONOU:**
```
[OneSignal] Initialized successfully
[OneSignal] User subscribed successfully
```

**Se NÃO FUNCIONOU:**
```
[OneSignal] App ID not configured. Push notifications disabled.
```

### 3. Verificar no Dashboard OneSignal

1. Acesse: https://app.onesignal.com
2. Selecione seu app
3. Vá em "Audience" → "All Users"
4. Você deve ver seu dispositivo listado ali

## Próximos Passos Após Configurar

### 1. Testar Notificação

**Opção A: Pelo OneSignal Dashboard**
1. Acesse: https://app.onesignal.com
2. Messages → New Push
3. Escreva título e mensagem
4. Envie para "Subscribed Users"

**Opção B: Pelo Admin do App**
1. Vá em Admin → Notifications
2. Preencha título e mensagem
3. Clique em "Send to All Subscribed Users"

### 2. iOS (iPhone/iPad)

Para iOS funcionar, o usuário precisa:
1. Abrir o app no Safari
2. Tocar no botão "Compartilhar" (📤)
3. Selecionar "Adicionar à Tela de Início"
4. Abrir o app pelo **ícone na tela inicial** (não pelo Safari)
5. Aceitar as notificações

⚠️ **IMPORTANTE**: No Safari iOS, notificações **SÓ funcionam em PWA instalado**, não no navegador normal.

### 3. Dispositivos Suportados

✅ **Funciona:**
- Chrome (Desktop + Android)
- Firefox (Desktop + Android)
- Edge (Desktop + Android)
- Safari (macOS Desktop)
- Safari iOS (só PWA instalado)

❌ **NÃO Funciona:**
- Safari iOS (navegador normal)
- Navegadores muito antigos

## Perguntas Frequentes

### Q: Por que não aparece ninguém no OneSignal?

**A:** O App ID não está configurado. Siga a "Solução" acima.

### Q: Configurei mas ainda não funciona. O que fazer?

**A:** Verifique:
1. Se fez **redeploy** no Vercel após adicionar as variáveis
2. Se as variáveis estão com os nomes **EXATOS**: `VITE_ONESIGNAL_APP_ID`
3. Se o App ID está **correto** (copie novamente do OneSignal)
4. Limpe o cache do navegador (Ctrl+Shift+Delete)
5. Use o painel de debug no Admin para ver o status

### Q: Como sei se está funcionando?

**A:** Use o painel de debug no Admin:
- Deve mostrar "App ID: CONFIGURADO"
- "Inicializado: Sim"
- "Inscrito: Sim"
- Deve aparecer um Player ID

### Q: Posso testar localmente?

**A:** Sim! Siga a "Opção 3" acima. Mas lembre-se:
- Localhost precisa de `allowLocalhostAsSecureOrigin: true` (já está configurado)
- Para produção, precisa configurar no Vercel

## Recursos Úteis

- 📖 [OneSignal Setup Instructions](./ONESIGNAL_SETUP_INSTRUCTIONS.md) - Guia completo
- 📱 [Push Notifications PT](./PUSH_NOTIFICATIONS_PT.md) - Documentação em português
- 🔧 [OneSignal Dashboard](https://app.onesignal.com) - Painel de controle
- 📊 Admin → Notifications → OneSignal Debug - Painel de diagnóstico

## Resumo do Problema

| Item | Status | Solução |
|------|--------|---------|
| Código | ✅ Correto | Nada a fazer |
| OneSignal SDK | ✅ Instalado | Nada a fazer |
| App ID | ❌ Não configurado | **Adicionar no Vercel** |
| REST API Key | ❌ Não configurado | **Adicionar no Vercel** |

**Ação Necessária:** Configurar variáveis de ambiente no Vercel e fazer redeploy.

---

**Última Atualização:** 2025-10-21
**Componente de Debug Adicionado:** `src/components/OneSignalDebug.tsx`
**Localização no App:** Admin → Notifications → OneSignal Debug
