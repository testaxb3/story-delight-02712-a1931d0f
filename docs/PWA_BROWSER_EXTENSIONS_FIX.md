# PWA Browser Extensions Compatibility Fix

## Problema

Quando o aplicativo é acessado como PWA (Progressive Web App) instalado, ocorrem erros relacionados a extensões do navegador:

```
myContent.js:1 Uncaught ReferenceError: browser is not defined
pagehelper.js:1 Uncaught ReferenceError: browser is not defined
Unchecked runtime.lastError: The message port closed before a response was received
```

### Causas

1. **Extensões do navegador injetam scripts** como:
   - `myContent.js` - Geralmente de tradutores (Google Translate, etc.)
   - `pagehelper.js` - Geralmente de assistentes de página
   - Outros scripts de ad blockers, password managers, etc.

2. **API `browser` não disponível no PWA standalone**: Quando o app está rodando como PWA instalado (modo standalone), as extensões do navegador não funcionam corretamente e tentam acessar APIs que não existem nesse contexto.

3. **Service Worker conflicts**: Mensagens de erro sobre "message port closed" indicam tentativas de comunicação com service workers de extensões que não estão mais disponíveis.

## Solução Implementada

### 1. Polyfill de Compatibilidade (`/public/browser-polyfill-pwa.js`)

Criamos um script que:
- ✅ Detecta se está rodando em modo PWA standalone
- ✅ Cria stubs (implementações vazias) para as APIs `browser` e `chrome.runtime`
- ✅ Suprime erros de console relacionados a extensões
- ✅ Previne crashes por erros de extensões
- ✅ Captura e suprime promise rejections de extensões

**Arquivos afetados:**
- `/public/browser-polyfill-pwa.js` (novo arquivo criado)
- `/index.html` (carrega o polyfill antes de tudo)
- `/vite.config.ts` (inclui o polyfill nos assets do PWA)

### 2. Melhorias no VideoPlayer

Adicionamos tratamento específico de erros relacionados a extensões:

```typescript
// Ignore errors from browser extensions in PWA mode
if (error?.message && (
  error.message.includes('browser is not defined') ||
  error.message.includes('chrome.runtime') ||
  error.message.includes('message port closed')
)) {
  console.warn('[VideoPlayer] Ignoring extension-related error in PWA mode');
  return;
}
```

**Arquivo:** `/src/components/VideoPlayer/OptimizedYouTubePlayer.tsx`

### 3. Permissions Policy

Adicionamos meta tag para controlar políticas de permissões e suprimir warnings do YouTube player:

```html
<meta http-equiv="Permissions-Policy" content="accelerometer=(), gyroscope=(), picture-in-picture=(self), fullscreen=(self)">
```

**Arquivo:** `/index.html`

## Como Funciona

### Detecção de PWA

```javascript
const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
              window.navigator.standalone === true ||
              document.referrer.includes('android-app://');
```

### Stub da API Browser

```javascript
window.browser = {
  runtime: {
    sendMessage: () => Promise.resolve(null),
    onMessage: { addListener: () => {}, ... }
  },
  // ... outras APIs
};
```

### Supressão de Erros

```javascript
console.error = function(...args) {
  const message = args.join(' ');

  // Filter out known extension errors
  if (message.includes('browser is not defined') || ...) {
    console.warn('[PWA] Suppressed extension error:', message);
    return;
  }

  // Call original console.error for other errors
  originalError.apply(console, args);
};
```

## Benefícios

1. ✅ **PWA funciona sem erros** mesmo com extensões instaladas
2. ✅ **Console limpo** - erros de extensões são filtrados
3. ✅ **Não quebra extensões no browser normal** - só afeta PWA standalone
4. ✅ **Melhor UX** - usuários não veem errors assustadores
5. ✅ **Player de vídeo mais estável** - ignora erros de extensões

## Testando

### No Navegador Normal
1. Abra o app normalmente no Chrome/Edge
2. Extensões devem funcionar normalmente
3. Console pode mostrar alguns warnings filtrados

### No PWA Instalado
1. Instale o PWA (botão + na barra de endereços)
2. Abra o PWA instalado
3. Navegue até a página de vídeos
4. Console deve estar limpo (ou com warnings, não errors)
5. Vídeos devem carregar e reproduzir normalmente

## Extensões Comuns que Causam Problemas

- 🌐 Google Translate
- 🛡️ Ad Blockers (uBlock Origin, AdBlock Plus)
- 🔑 Password Managers (LastPass, 1Password)
- 📝 Grammar checkers (Grammarly)
- 🎨 Dark mode extensions
- 🔍 Page analyzers

## Troubleshooting

### Se ainda houver erros:

1. **Verifique se o polyfill está carregando:**
   ```javascript
   // No console do PWA
   console.log(window.browser); // Deve retornar um objeto
   ```

2. **Limpe o cache do PWA:**
   - Chrome DevTools → Application → Clear Storage
   - Ou siga: `/docs/PWA_CACHE_CLEAR_INSTRUCTIONS.md`

3. **Reinstale o PWA:**
   - Desinstale o PWA
   - Limpe cache do navegador
   - Reinstale o PWA

4. **Verifique o console para novos tipos de erros:**
   - Se aparecerem novos erros de extensões, adicione-os ao filtro em `browser-polyfill-pwa.js`

## Update 2: YouTube CSP e Service Worker Fix

### Novos Problemas Encontrados

Após o primeiro fix, apareceram novos erros relacionados ao YouTube:

```
❌ Refused to connect to 'https://www.youtube.com/iframe_api' (CSP violation)
❌ Failed to execute 'postMessage' - origin mismatch
❌ Permissions policy violations: accelerometer, gyroscope
```

### Soluções Adicionais Implementadas

**1. Content Security Policy Expandido**
- Adicionado `https://www.youtube.com` e `https://www.youtube-nocookie.com` ao `connect-src`
- Adicionado `https://*.googlevideo.com` para vídeos
- Adicionado `https://i.ytimg.com` para thumbnails

**2. Workbox Configuration**
- Configurado para NÃO cachear `iframe_api` e `www-widgetapi` do YouTube
- Esses scripts precisam ser sempre frescos para evitar problemas de CSP
- Adicionado timeout de rede para evitar travamentos

**3. YouTube Player Origin Fix**
- Adicionado `origin: window.location.origin` nas configurações do player
- Previne erros de `postMessage` entre iframe e página

**4. Polyfill Melhorado**
- Agora suprime também `console.warn` para warnings de Permissions Policy
- Filtra erros de `postMessage` do YouTube
- Mais robusto na detecção e supressão de erros

## Arquivos Modificados

```
✅ /public/browser-polyfill-pwa.js (NOVO - atualizado v2)
✅ /index.html (CSP expandido)
✅ /vite.config.ts (Workbox configurado)
✅ /src/components/VideoPlayer/OptimizedYouTubePlayer.tsx (origin fix)
✅ /docs/PWA_BROWSER_EXTENSIONS_FIX.md (NOVO - atualizado)
```

## Referências

- [Web Extensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API)
- [PWA Display Modes](https://developer.mozilla.org/en-US/docs/Web/Manifest/display)
- [Permissions Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

**Data:** 2025-10-23
**Issue:** Browser extension errors in PWA standalone mode
**Status:** ✅ Resolvido
