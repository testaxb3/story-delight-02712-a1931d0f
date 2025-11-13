# Como Limpar COMPLETAMENTE o Cache do PWA

**IMPORTANTE:** Você DEVE limpar o cache após cada deploy para que as mudanças sejam aplicadas!

## 🖥️ Desktop (Chrome/Edge)

### Método 1: DevTools (RECOMENDADO)

1. **Abra o site** no navegador normal (não o PWA)
2. **Pressione F12** para abrir DevTools
3. **Vá para Application** (aba superior)
4. **Storage** (menu lateral esquerdo)
5. **Clear storage** (submenu)
6. **Marque TODAS as opções:**
   - ✅ Unregister service workers
   - ✅ Local and session storage
   - ✅ IndexedDB
   - ✅ Web SQL
   - ✅ Cookies
   - ✅ Cache storage
7. **Clique em "Clear site data"**
8. **Feche e reabra o navegador**
9. **Reinstale o PWA**

### Método 2: Configurações do Chrome

1. **Chrome Settings** → Privacy and security
2. **Clear browsing data**
3. **Advanced**
4. Selecione:
   - ✅ Cached images and files
   - ✅ Cookies and site data
5. **Time range:** All time
6. **Clear data**

## 📱 Mobile (Android)

### Opção 1: Desinstalar e Reinstalar PWA

1. **Segure o ícone** do PWA
2. **Desinstalar** / Uninstall
3. **Abra o Chrome**
4. **Vá para** https://nepsystem.vercel.app
5. **Menu** → Install app
6. **Pronto!**

### Opção 2: Limpar Cache do Chrome

1. **Chrome** → ⋮ (3 pontos)
2. **Settings** → Privacy
3. **Clear browsing data**
4. Marque:
   - ✅ Cached images
   - ✅ Cookies
5. **All time**
6. **Clear data**
7. **Reinstale o PWA**

## 📱 Mobile (iOS/Safari)

1. **Settings** (iOS)
2. **Safari**
3. **Advanced**
4. **Website Data**
5. **Remove All Website Data**
6. **Abra Safari**
7. **Vá para** https://nepsystem.vercel.app
8. **Share** → Add to Home Screen
9. **Pronto!**

## 🔍 Como Verificar se Funcionou

Após limpar o cache e reinstalar o PWA:

1. **Abra o PWA**
2. **Abra o console** (F12 no desktop)
3. **Vá para Videos**
4. **Abra um vídeo**
5. **Procure no console:**
   ```
   [PWA Polyfill] Loading v2.1 - Extension compatibility and error suppression
   [VideoPlayer] Player config: {origin: "https://nepsystem.vercel.app", ...}
   [VideoPlayer] Player ready
   [VideoPlayer] Origin configured: https://nepsystem.vercel.app
   ```

Se você ver essas mensagens, o cache foi limpo com sucesso!

## ⚠️ Problemas Comuns

### "Ainda vejo erros antigos"
→ O cache NÃO foi limpo completamente. Tente o Método 1 (DevTools).

### "O vídeo ainda não carrega"
→ Verifique se o origin no console está correto:
```javascript
// No console, execute:
console.log(window.location.origin)
// Deve mostrar: https://nepsystem.vercel.app
```

### "Nada mudou"
→ Certifique-se de:
1. Fazer deploy do código atualizado
2. Limpar cache ANTES de testar
3. Reinstalar o PWA (não apenas atualizar)

## 💡 Dica Pro

Para evitar problemas de cache durante desenvolvimento:

1. **Chrome DevTools** → Application → Service Workers
2. **Marque:** ☑️ Update on reload
3. **Marque:** ☑️ Bypass for network

Isso força o Chrome a sempre buscar a versão mais recente.

---

**Última atualização:** 2025-10-23
