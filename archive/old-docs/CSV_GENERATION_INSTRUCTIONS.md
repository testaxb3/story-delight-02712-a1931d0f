# 📋 Instruções para Gerar Scripts - CSV Template

## 🎯 Objetivo
Use este template para gerar scripts completos com todos os campos de guidance necessários.

---

## 📊 Estrutura do CSV

### CAMPOS OBRIGATÓRIOS

#### 1. **title** (string)
Formato: `"Categoria - Nome do Problema"`
- Exemplo: `"Hygiene - Hair Brushing Battle"`
- Exemplo: `"Bedtime - Won't Go to Sleep"`
- Exemplo: `"Mealtime - Picky Eating"`

#### 2. **category** (string)
Opções: `Bedtime`, `Screens`, `Mealtime`, `Transitions`, `Tantrums`, `Morning_Routines`, `Social`, `Hygiene`

#### 3. **profile** (string)
Tipo de cérebro NEP:
- `INTENSE` - Crianças altamente sensíveis, emocionalmente intensas
- `DISTRACTED` - Crianças curiosas mas facilmente distraídas
- `DEFIANT` - Crianças com forte vontade, autônomas

#### 4. **difficulty_level** (enum)
- `Easy` - Scripts simples, alta taxa de sucesso
- `Moderate` - Requer prática, resultados variáveis
- `Hard` - Situações desafiadoras, requer consistência

#### 5. **age_range** (string)
Formato: `"X-Y"` onde X e Y são idades
- Exemplo: `"3-8"`
- Exemplo: `"2-5"`
- Exemplo: `"5-10"`

#### 6. **duration_minutes** (integer)
Tempo estimado em minutos: `5`, `10`, ou `15`

---

### NEP SYSTEM - WRONG WAY

#### 7. **wrong_way** (string)
O que NÃO fazer - exemplo de abordagem incorreta
- Use aspas duplas para todo o texto
- Seja específico e realista
- Exemplo: `"Forcing the brush through tangled hair while saying 'Hold still! This wouldn't hurt if you just stayed calm!'"`

---

### NEP SYSTEM - 3 PHRASES

#### STEP 1: CONNECTION

**8. phrase_1** (string)
A frase exata que o pai deve dizer
- Foco: Conexão emocional, validação
- Exemplo: `"I see this is hard for you. Your head says 'Ouch,' and I'm listening."`

**9. phrase_1_action** (string)
Tipo de ação: sempre `Connection`

**10. say_it_like_this_step1** (string)
Guidance POSITIVO - como entregar a frase
- Tom de voz, linguagem corporal, contexto
- Exemplo: `"Get down to eye level, speak softly, and acknowledge the physical sensation without dismissing it"`

**11. avoid_step1** (string)
O que NÃO fazer ao entregar a frase
- Erros comuns
- Exemplo: `"Saying 'it doesn't hurt' or 'stop being dramatic'"`

---

#### STEP 2: VALIDATION

**12. phrase_2** (string)
A frase exata que o pai deve dizer
- Foco: Validação, oferecer escolhas limitadas
- Exemplo: `"We can solve this together. Brush now and pick tomorrow's toothpaste flavor, or brush in 5 minutes but I pick the flavor. Your call."`

**13. phrase_2_action** (string)
Tipo de ação: sempre `Validation`

**14. say_it_like_this_step2** (string)
Guidance POSITIVO
- Exemplo: `"Offer choices calmly, present all options equally without preference"`

**15. avoid_step2** (string)
O que evitar
- Exemplo: `"Forcing your preferred solution or showing impatience"`

---

#### STEP 3: NEUROLOGICAL COMMAND

**16. phrase_3** (string)
A frase exata que o pai deve dizer
- Foco: Comando claro, gamificação, autonomia
- Exemplo: `"Your hair, your job. Can you do it in under 2 minutes? I'll time you. Ready... set... GO! Beat your record."`

**17. phrase_3_action** (string)
Tipo de ação: sempre `Neurological Command`

**18. say_it_like_this_step3** (string)
Guidance POSITIVO
- Exemplo: `"Hand them the brush gently, step back, let them lead completely"`

**19. avoid_step3** (string)
O que evitar
- Exemplo: `"Grabbing the brush back or correcting their technique immediately"`

---

### NEUROLOGICAL TIP

**20. neurological_tip** (string)
Explicação científica curta - POR QUE funciona
- 1-2 frases
- Foco: neurociência, psicologia infantil
- Exemplo: `"Validates resistance. Limited choice maintains boundary. Gamification increases compliance."`

---

### WHAT TO EXPECT

**21. what_to_expect_1** (string)
Primeira expectativa realista
- Exemplo: `"May take 2-3 tries before they fully trust the process"`

**22. what_to_expect_2** (string)
Segunda expectativa realista
- Exemplo: `"Works best when child is calm, not mid-tantrum"`

**23. what_to_expect_3** (string)
Terceira expectativa realista
- Exemplo: `"Adapt the exact words to match your natural speaking style"`

---

### METADATA

**24. tags** (string)
Tags separadas por `|` (pipe)
- 3-5 tags relevantes
- Exemplo: `"hygiene|resistance|autonomy|defiant"`

**25. related_script_ids** (string)
IDs de scripts relacionados separados por `|`
- **DEIXAR VAZIO** por enquanto: `""`
- Será preenchido depois no banco

---

## 🎨 REGRAS DE FORMATAÇÃO

1. **Aspas duplas**: Use `"` para envolver TODOS os campos de texto
2. **Quebras de linha**: Evite. Mantenha tudo em uma linha por script
3. **Vírgulas**: Se precisar usar vírgula DENTRO de um campo, certifique-se de que o campo está entre aspas
4. **Apóstrofos**: Use `'` normalmente dentro dos campos (ex: "don't", "it's")

---

## 📝 EXEMPLO COMPLETO

```csv
title,category,profile,difficulty_level,age_range,duration_minutes,wrong_way,phrase_1,phrase_1_action,say_it_like_this_step1,avoid_step1,phrase_2,phrase_2_action,say_it_like_this_step2,avoid_step2,phrase_3,phrase_3_action,say_it_like_this_step3,avoid_step3,neurological_tip,what_to_expect_1,what_to_expect_2,what_to_expect_3,tags,related_script_ids
"Hygiene - Hair Brushing Battle",Hygiene,DEFIANT,Moderate,3-8,5,"Forcing the brush through tangled hair while saying 'Hold still! This wouldn't hurt if you just stayed calm!'","I see this is hard for you. Your head says 'Ouch,' and I'm listening.",Connection,"Get down to eye level, speak softly, and acknowledge the physical sensation without dismissing it","Saying 'it doesn't hurt' or 'stop being dramatic'","We can solve this together. Brush now and pick tomorrow's toothpaste flavor, or brush in 5 minutes but I pick the flavor. Your call.",Validation,"Offer choices calmly, present all options equally without preference","Forcing your preferred solution or showing impatience","Your hair, your job. Can you do it in under 2 minutes? I'll time you. Ready... set... GO! Beat your record.",Neurological Command,"Hand them the brush gently, step back, let them lead completely","Grabbing the brush back or correcting their technique immediately","Validates resistance. Limited choice maintains boundary. Gamification increases compliance.","May take 2-3 tries before they fully trust the process","Works best when child is calm, not mid-tantrum","Adapt the exact words to match your natural speaking style","hygiene|resistance|autonomy|defiant",""
```

---

## 🤖 PROMPT PARA IA GERADORA

Use este prompt ao pedir para IA gerar os scripts:

```
Gere scripts de parenting seguindo o sistema NEP (Neurological Empowerment Parenting) no formato CSV.

ESTRUTURA:
- 3 frases (Connection → Validation → Neurological Command)
- Para cada frase: guidance positivo (Say it like this) e negativo (Avoid)
- Wrong Way: exemplo de abordagem INCORRETA
- Neurological Tip: explicação científica curta
- What to Expect: 3 expectativas realistas

PERFIS DE CÉREBRO:
- INTENSE: Crianças altamente sensíveis, emocionalmente intensas
- DISTRACTED: Crianças curiosas mas facilmente distraídas
- DEFIANT: Crianças com forte vontade, autônomas

CATEGORIAS:
Bedtime, Screens, Mealtime, Transitions, Tantrums, Morning_Routines, Social, Hygiene

DIFICULDADE:
- Easy: Scripts simples, alta taxa de sucesso
- Moderate: Requer prática, resultados variáveis
- Hard: Situações desafiadoras, requer consistência

FORMATO:
Siga EXATAMENTE o template CSV fornecido.
Use aspas duplas em todos os campos de texto.
Mantenha cada script em UMA linha.

QUANTIDADE:
Gere [X] scripts variando categorias, perfis e dificuldades.
```

---

## ✅ CHECKLIST ANTES DE IMPORTAR

- [ ] Arquivo tem header (primeira linha com nomes das colunas)
- [ ] Todos os campos obrigatórios preenchidos
- [ ] Aspas duplas em todos os campos de texto
- [ ] Sem quebras de linha dentro dos campos
- [ ] Tags separadas por `|`
- [ ] related_script_ids vazio (`""`)
- [ ] Age range no formato `"X-Y"`
- [ ] Duration_minutes é número (5, 10, ou 15)
- [ ] Profile é um de: INTENSE, DISTRACTED, DEFIANT
- [ ] Category é uma das 8 categorias válidas
- [ ] Difficulty_level é: Easy, Moderate, ou Hard

---

## 🚀 COMO USAR

1. **Envie este template + instruções** para a IA geradora
2. **IA gera** múltiplos scripts no formato CSV
3. **Salve** como `scripts_bulk_upload.csv`
4. **Importe** usando o admin panel ou SQL

---

## 💡 DICAS

- **Tone de voz**: Natural, empático, não robótico
- **Frases realistas**: Como pais reais falariam
- **Guidance específico**: Detalhes práticos (tom, postura, timing)
- **What to Expect honesto**: Não prometa milagres
- **Neurological Tip científico**: Baseado em evidências

---

**Boa sorte com a geração! 🎉**
