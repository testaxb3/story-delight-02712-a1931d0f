# 🎭 Como Adicionar Posts Fake na Comunidade

## Passo a Passo (3 etapas simples)

### 📝 STEP 1: Adicionar Colunas

1. Abra **Supabase Dashboard** → **SQL Editor** → **New Query**
2. Abra o arquivo: `STEP1_ADD_COLUMNS.sql`
3. Copie TODO o conteúdo
4. Cole no SQL Editor
5. Clique em **RUN** ▶️
6. ✅ Você deve ver 4 colunas listadas no resultado

---

### 🔑 STEP 2: Pegar seu User ID

1. No SQL Editor, crie **New Query**
2. Abra o arquivo: `STEP2_GET_USER_ID.sql`
3. Copie e cole no editor
4. Clique em **RUN** ▶️
5. 📋 **COPIE o ID retornado** (algo como: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

---

### 🎉 STEP 3: Inserir Posts Fake

1. Abra o arquivo: `STEP3_INSERT_POSTS.sql`
2. **IMPORTANTE:** Use Find & Replace (Ctrl+H):
   - Find: `YOUR_USER_ID_HERE`
   - Replace: `[COLE SEU ID DO STEP 2 AQUI]`
   - Replace All
3. Copie TODO o SQL modificado
4. Cole no SQL Editor (New Query)
5. Clique em **RUN** ▶️
6. 🎊 Você deve ver a mensagem de sucesso e os 13 posts listados!

---

## ✅ Verificação

Abra seu app e vá para **Community**. Você deve ver:

- Sarah Martinez (INTENSE) - "Won't Eat Breakfast WIN" 🎉
- Jessica Park (DEFIANT) - "Bedtime Resistance WIN" 🛏️
- Emma Thompson (DISTRACTED) - "Screen Time WIN" 📱
- Rachel Chen (DISTRACTED) - "Homework WIN" 📚
- Amanda Silva (INTENSE) - "Hair Brushing WIN" ✨
- Lauren Davis (DISTRACTED) - "Morning Routine WIN" ☀️
- Lisa Johnson (DEFIANT) - "Shoes question" ❓
- Maria Rodriguez (INTENSE) - "Sensory socks question" 🧦
- Sophie Williams (DISTRACTED) - "Homework focus question" 🤔
- Jennifer Lee (DEFIANT) - "Script rotation question" 🔄
- Catherine Moore (INTENSE) - "70/30 rule lesson" 🧠
- Nicole Taylor (DEFIANT) - "Morning peace lesson" 💜
- Ashley Brown (DISTRACTED) - "Micro-pauses lesson" 🐢

---

## 🔧 Para Desativar Depois

Quando tiver ~100+ usuários reais:

```sql
UPDATE community_posts
SET is_seed_post = false
WHERE is_seed_post = true;
```

Ou simplesmente delete:

```sql
DELETE FROM community_posts
WHERE is_seed_post = true;
```

---

## ❓ Troubleshooting

**Erro: "column post_type does not exist"**
→ Execute o STEP 1 primeiro!

**Erro: "invalid input syntax for type uuid"**
→ Você esqueceu de substituir YOUR_USER_ID_HERE pelo seu ID real!

**Nenhum post aparece no app**
→ Verifique se você está logado com testa@gmail.com
→ Dê refresh no app (F5)
→ Veja os logs do console (F12)
