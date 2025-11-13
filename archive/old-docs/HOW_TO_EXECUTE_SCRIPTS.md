# Como Executar a Inserção dos 83 Scripts

## ✅ Arquivos Criados

1. **RESET_AND_INSERT_ALL_SCRIPTS.sql** - Arquivo COMPLETO (USE ESTE!)
   - Deleta todos os scripts existentes
   - Insere todos os 83 novos scripts
   - Inclui verificações antes/depois

2. **INSERT_ALL_SCRIPTS.sql** - Apenas os INSERTs (sem DELETE)

## 📋 Passo-a-Passo

### 1️⃣ Acesse o Supabase SQL Editor

1. Vá para https://app.supabase.com
2. Selecione seu projeto
3. No menu lateral, clique em **"SQL Editor"**

### 2️⃣ Execute o SQL Completo

1. Abra o arquivo `RESET_AND_INSERT_ALL_SCRIPTS.sql` no seu editor local
2. **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)
3. **Cole no SQL Editor** do Supabase
4. Clique em **RUN** (ou Ctrl+Enter)

### 3️⃣ Verifique os Resultados

Você deve ver várias respostas:

```
step          | total_scripts
--------------|--------------
BEFORE DELETE | X (quantidade atual)
AFTER DELETE  | 0
AFTER INSERT  | 83
```

E uma lista com 10 scripts de exemplo.

## ✅ Resultado Esperado

- **Scripts deletados**: Todos os existentes
- **Scripts inseridos**: 83 novos scripts

### Breakdown por Categoria:
- Bedtime: 16 scripts
- Screens: 14 scripts
- Tantrums: 14 scripts
- Mealtime: 10 scripts
- Homework: 11 scripts
- Transitions: 9 scripts
- Hygiene: 6 scripts
- Social: 3 scripts

### Breakdown por Perfil:
- DISTRACTED: 37 scripts
- INTENSE: 29 scripts
- DEFIANT: 17 scripts

## 🔍 Verificação Manual

Se quiser verificar manualmente depois:

```sql
-- Ver total de scripts
SELECT COUNT(*) FROM public.scripts;

-- Ver scripts por categoria
SELECT category, COUNT(*) as total
FROM public.scripts
GROUP BY category
ORDER BY category;

-- Ver scripts por perfil
SELECT profile, COUNT(*) as total
FROM public.scripts
GROUP BY profile
ORDER BY profile;
```

## ⚠️ Importante

- Este SQL **DELETA TODOS** os scripts existentes primeiro
- Se você tem scripts que quer manter, **NÃO execute este arquivo**
- Depois de executar, você pode testar o upload na interface admin

## 📝 Próximos Passos

Após executar o SQL:

1. ✅ Acesse seu sistema
2. ✅ Vá para Admin → Scripts
3. ✅ Verifique se aparecem 83 scripts
4. ✅ Teste criar, editar, deletar scripts individualmente

## 🚨 Se der erro

Se aparecer erro durante a execução:

1. Copie a mensagem de erro completa
2. Me envie o erro
3. Verifique se as políticas RLS estão corretas (arquivo `FIX_FINAL_RLS_PROFILES.sql`)

## ✅ Status

- ✅ CSV processado (83 scripts)
- ✅ SQL gerado e validado
- ✅ Aspas simples escapadas corretamente
- ✅ Pronto para executar no Supabase
