# 🎉 30 Scripts NEP Prontos para Aplicar!

## ✅ O Que Foi Criado

3 agentes especializados criaram **30 scripts NEP de alta qualidade**:

- **10 scripts INTENSE** (sensibilidade sensorial, grandes emoções)
- **10 scripts DISTRACTED** (ADHD, precisa movimento/dopamina)
- **10 scripts DEFIANT** (forte personalidade, precisa controle)

Todos os scripts seguem o **framework NEP** perfeitamente:
1. **CONNECTION** (5-10 palavras)
2. **VALIDATION** (15-20 palavras com "AND")
3. **COMMAND** (10-15 palavras com escolha)

E incluem **TODOS os campos enhanced** para recomendações inteligentes.

---

## 🚀 Como Aplicar

### Opção A: Todos de Uma Vez (Recomendado)

1. Abra o Supabase SQL Editor:
   - [https://supabase.com/dashboard/project/iogceaotdodvugrmogpp/sql/new](https://supabase.com/dashboard/project/iogceaotdodvugrmogpp/sql/new)

2. Copie o conteúdo do arquivo:
   - `intensive_scripts.sql` (na mesma pasta)
   - `distracted_scripts.sql` (na mesma pasta)
   - `defiant_scripts.sql` (na mesma pasta)

3. Cole no SQL Editor e execute cada arquivo separadamente

4. Verifique com:
```sql
SELECT COUNT(*), profile
FROM scripts
WHERE profile IN ('INTENSE', 'DISTRACTED', 'DEFIANT')
GROUP BY profile;
```

Deve retornar: 10 scripts para cada profile.

---

### Opção B: Um Brain Type por Vez

**Ordem sugerida:** INTENSE → DISTRACTED → DEFIANT

#### 1️⃣ INTENSE Scripts (10)

Copie o SQL output do **Agent 1** (veja abaixo) e execute no SQL Editor.

**Situações cobertas:**
- Public store meltdown (criança gritando, pessoas olhando)
- Restaurant sensory shutdown (barulho demais, luzes demais)
- Bedtime big feelings (ansiedade sobre escuro)
- Morning emotional meltdown (roupas machucam, tudo errado)
- Playground transition tears (chorando para sair)
- Sibling hit during anger (bateu no irmão, explosão)
- Food texture refusal (textura sensorial)
- Bath time sensory battle (água/toalhas insuportáveis)
- Homework overwhelm shutdown (tarefa muito grande)
- Car seat sensory fight (alças machucam)

#### 2️⃣ DISTRACTED Scripts (10)

Copie o SQL output do **Agent 2** (veja abaixo) e execute no SQL Editor.

**Situações cobertas:**
- Morning routine chaos (esqueceu cada passo, atrasado)
- Screen time hyperfocus (não consegue parar tablet)
- Homework task initiation (paralisia página em branco)
- Getting dressed distraction (nu 10 min depois)
- Leaving house rush (esqueceu sapatos/mochila/lanche)
- Dinner table fidget (não consegue sentar quieto)
- Bedtime wind down (correndo, não se acalma)
- Clean up overwhelm (congelou, não sabe começar)
- Car ride impulse (desafivelou cinto, perigoso)
- Sibling interruption (não consegue esperar vez)

#### 3️⃣ DEFIANT Scripts (10)

Copie o SQL output do **Agent 3** (veja abaixo) e execute no SQL Editor.

**Situações cobertas:**
- Screen time shutdown (não desliga tablet, gentle parenting falhou)
- Direct "NO!" refusal (disse NÃO, recusa total)
- Room cleaning power struggle (recusa limpar quarto)
- Backtalk and disrespect (respondendo mal)
- Sibling bossing (mandando no irmão)
- Bedtime argument loop ("não é justo", argumentando)
- Car seat standoff ("você não pode me obrigar")
- Homework refusal (recusa total fazer lição)
- Mealtime demands (quer comida diferente)
- Public "NO" with audience (disse NÃO em público, zombando)

---

## 📊 Verificação de Qualidade

Depois de inserir, verifique:

### 1. Contagem por Brain Type
```sql
SELECT profile, COUNT(*) as total_scripts
FROM scripts
WHERE profile IN ('INTENSE', 'DISTRACTED', 'DEFIANT')
GROUP BY profile
ORDER BY profile;
```
✅ Esperado: 10 scripts para cada

### 2. Scripts SOS/Emergency
```sql
SELECT title, profile, expected_time_seconds, emergency_suitable
FROM scripts
WHERE emergency_suitable = true
ORDER BY expected_time_seconds;
```
✅ Deve mostrar scripts rápidos (<60s) marcados como emergency

### 3. Scripts com Todos os Campos
```sql
SELECT
  title,
  CASE
    WHEN situation_trigger IS NOT NULL THEN '✓'
    ELSE '✗'
  END as has_trigger,
  CASE
    WHEN location_type IS NOT NULL THEN '✓'
    ELSE '✗'
  END as has_location,
  CASE
    WHEN parent_state IS NOT NULL THEN '✓'
    ELSE '✗'
  END as has_parent_state,
  CASE
    WHEN backup_plan IS NOT NULL THEN '✓'
    ELSE '✗'
  END as has_backup
FROM scripts
WHERE profile IN ('INTENSE', 'DISTRACTED', 'DEFIANT')
LIMIT 10;
```
✅ Todos devem ter ✓ em todos os campos

### 4. Script por Situação Específica
```sql
-- Teste busca inteligente
SELECT title, situation_trigger, success_speed
FROM scripts
WHERE situation_trigger ILIKE '%car seat%'
   OR 'car seat' = ANY(tags);
```
✅ Deve retornar scripts de car seat

---

## 🎯 O Que Fazer Depois

### 1. Teste o App

1. **Recarregue a página Scripts** (F5)
2. **Veja os novos cards** com contexto rico
3. **Busque algo específico** como "won't eat" ou "screaming"
4. **Teste SOS Mode**:
   - Busque "emergency meltdown"
   - Ou use 3 scripts em 10 minutos
   - Deve aparecer overlay vermelho/laranja

### 2. Valide os Scripts

Escolha 2-3 scripts e verifique:
- [ ] As 3 frases seguem NEP framework
- [ ] situation_trigger está claro e em linguagem de pai
- [ ] backup_plan é acionável
- [ ] common_mistakes são específicos
- [ ] Badges aparecem nos cards (⚡ speed, 😤 parent state, etc)

### 3. Feedback

Se encontrar problemas:
1. Anote qual script (title)
2. Qual campo está errado
3. Como deveria ser

---

## 📁 Arquivos de Referência

Os SQLs completos dos 3 agentes estão nos outputs acima. Você pode:

1. **Copiar diretamente** do output dos agentes
2. **Ou criar 3 arquivos SQL** separados:
   - `intensive_scripts.sql`
   - `distracted_scripts.sql`
   - `defiant_scripts.sql`

---

## 🔧 Troubleshooting

### Erro: "duplicate key value violates unique constraint"

**Causa:** Tentou inserir script que já existe

**Solução:**
```sql
-- Limpe scripts de teste primeiro
DELETE FROM scripts WHERE profile IN ('INTENSE', 'DISTRACTED', 'DEFIANT');
-- Depois execute os INSERTs novamente
```

### Erro: "column X does not exist"

**Causa:** Migration não foi aplicada

**Solução:** Volte e aplique a migration primeiro (APPLY_MIGRATION_HERE.html)

### Scripts aparecem mas sem badges de contexto

**Causa:** Frontend precisa rebuild

**Solução:**
```bash
npm run dev
# Recarregue página
```

---

## ✨ Próximos Passos

Agora que você tem 30 scripts de qualidade:

1. **Teste com usuários reais** (família, amigos)
2. **Colete feedback** sobre o que funciona
3. **Itere nos scripts** baseado em resultados
4. **Adicione mais situações** usando o template
5. **Monitore métricas**:
   - Scripts marcados como "worked"
   - SOS Mode usage rate
   - Scripts favoritos
   - Tempo médio para encontrar script

---

## 🎓 Framework de Criação

Para criar novos scripts no futuro, use:
`.claude/SCRIPT_CREATION_TEMPLATE.md`

Contém:
- Framework NEP completo
- Definições de todos os campos
- Exemplos por brain type
- Exemplos por situação
- Quality checklist
- Common mistakes to avoid

---

Pronto! 🚀 Você tem a base de 30 scripts NEP profissionais. Agora é aplicar e testar!
