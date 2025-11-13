# OneSignal Setup - Instruções Passo a Passo

## ✅ Você Escolheu OneSignal!

Ótima escolha! Agora você precisa criar uma conta gratuita e configurar o app. Leva apenas **5 minutos**.

---

## 📝 **PASSO 1: Criar Conta OneSignal**

1. Acesse: **https://onesignal.com**
2. Clique em **"Get Started"** ou **"Sign Up"**
3. Escolha **"Sign up with Email"** ou use Google/GitHub
4. Preencha seus dados e crie a conta
5. Confirme seu email (verifique a caixa de entrada)

---

## 🎯 **PASSO 2: Criar Novo App**

1. Após login, clique em **"New App/Website"**
2. Digite o nome: **"NEP System"** (ou o nome que preferir)
3. Clique em **"Create App"**

---

## 🌐 **PASSO 3: Configurar Web Push**

1. Na tela de plataformas, escolha **"Web"** (ícone do globo 🌐)
2. Você verá "Web Push Configuration"

### **Site Setup:**
- **Site URL**: Cole a URL do seu site (ex: `https://seu-dominio.com`)
  - Se ainda não tem domínio, use: `http://localhost:8080`
- **Auto Resubscribe**: ✅ Deixe marcado
- **Default Notification Icon URL**:
  - Use: `https://seu-dominio.com/icon-192x192.png`
  - Ou deixe em branco por enquanto

### **Permission Prompt Setup:**
- **Prompt Type**: Escolha **"Slide Prompt"** (recomendado)
- **Timing**: Escolha **"After a few seconds"** → **"10 seconds"**

3. Clique em **"Save"**

---

## 🔑 **PASSO 4: Pegar o App ID** ⭐ IMPORTANTE

1. No dashboard do OneSignal, vá em **"Settings"** (⚙️ no menu lateral)
2. Clique em **"Keys & IDs"**
3. **COPIE** o **"OneSignal App ID"**
   - Vai ser algo como: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

### **Me passe este App ID aqui no chat:**
```
Copie e cole o App ID aqui
```

---

## 🎨 **PASSO 5: Configurar Ícone (Opcional)**

Se quiser usar o ícone do seu app nas notificações:

1. Faça upload de uma imagem 192x192px em **Settings → Configuration → Chrome**
2. Ou use o ícone padrão do OneSignal

---

## ✅ **Pronto!**

Depois que você me passar o **App ID**, eu vou:

1. ✅ Instalar OneSignal SDK no projeto
2. ✅ Integrar no código
3. ✅ Atualizar Admin panel para usar OneSignal
4. ✅ Testar tudo

**Tempo:** ~15 minutos de implementação

---

## 📱 **Como Vai Funcionar Depois:**

### **Para Usuários:**
1. Entram no app
2. Aparece popup pedindo permissão para notificações
3. Aceitam
4. **Pronto!** Cadastrados automaticamente

### **Para Você (Admin):**
Pode enviar notificações de **2 formas**:

**Opção 1: Painel OneSignal** (mais fácil)
- Entra em https://onesignal.com
- Dashboard → Messages → New Push
- Escreve título e mensagem
- Envia para todos

**Opção 2: Admin Panel do App**
- Admin → Notifications
- Preenche título e mensagem
- Clica "Send Notification"
- Envia automaticamente via API OneSignal

---

## 🆓 **Plano Gratuito:**

- ✅ Até **10.000 subscribers** (usuários)
- ✅ **Unlimited notifications** (notificações ilimitadas)
- ✅ Analytics básico
- ✅ Segmentação de usuários
- ✅ Scheduling (agendar notificações)

Se passar de 10k usuários, tem planos pagos a partir de $9/mês.

---

## 🤔 **Dúvidas?**

Se tiver qualquer dúvida durante o setup, me avisa! Posso te ajudar.

---

## 🚀 **Próximo Passo:**

**Me passe o App ID do OneSignal aqui:**
```
Cole aqui: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

Assim que você colar, eu implemento tudo! ⚡
