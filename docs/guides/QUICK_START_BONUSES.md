# Quick Start - Bonuses CRUD Fix

## Problema Resolvido

- Admin não conseguia adicionar novos bonuses
- Bonuses criados não apareciam na lista
- Sistema estava usando localStorage ao invés de banco de dados
- Sem sincronização entre Admin e página do usuário

## Solução Implementada

Sistema completo de CRUD integrado com Supabase:
- Tabela `bonuses` no banco de dados
- Hooks React Query para todas operações
- RLS policies para segurança
- Cache inteligente e updates em tempo real

## Passos para Ativar

### 1. Aplicar Migration (OBRIGATÓRIO)

**Opção A - Supabase Dashboard (RECOMENDADO):**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Clique em "SQL Editor" no menu lateral
4. Clique em "+ New Query"
5. Abra o arquivo: `supabase/migrations/20251116000000_create_bonuses_table.sql`
6. Copie TODO o conteúdo
7. Cole no SQL Editor
8. Clique em "Run" (ou Ctrl+Enter)
9. Aguarde: "Success. No rows returned"

**Opção B - Script Automático:**
```bash
node apply-bonuses-migration.mjs
```
(Se falhar, use a Opção A)

### 2. Popular Banco de Dados (OPCIONAL)

```bash
node seed-bonuses.mjs
```

Isso irá adicionar 17 bonuses de exemplo (vídeos, PDFs, tools, etc.)

**Pular este passo se:**
- Você já tem bonuses
- Quer começar do zero

### 3. Testar

**No Admin:**
```
1. Acesse: http://localhost:5173/admin
2. Clique na aba "Bonuses"
3. Clique em "Add New Bonus"
4. Preencha:
   - Title: "Meu Primeiro Vídeo"
   - Description: "Teste de vídeo"
   - Category: "video"
   - View URL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
5. Clique em "Create Bonus"
6. Verifique se aparece na lista
```

**Na Página do Usuário:**
```
1. Acesse: http://localhost:5173/bonuses
2. Verifique se o bonus criado aparece
3. Teste filtros e busca
```

## Verificação de Problemas

### Migration não aplicou?

**Teste:**
```sql
SELECT * FROM bonuses LIMIT 1;
```

**Se retornar erro "table does not exist":**
- Migration não foi aplicada
- Volte ao Passo 1

**Se retornar "Success" (mesmo sem linhas):**
- Migration OK ✓

### Bonuses não aparecem no Admin?

1. **Verifique se você é admin:**
```sql
SELECT * FROM user_roles
WHERE user_id = auth.uid()
AND role = 'admin';
```

Se retornar vazio, você não é admin. Execute:
```sql
INSERT INTO user_roles (user_id, role)
VALUES (auth.uid(), 'admin');
```

2. **Verifique console do navegador (F12):**
- Procure por erros em vermelho
- Mensagens começando com "Error fetching bonuses"

### Erro "Failed to create bonus"?

**Causas comuns:**
- Campos obrigatórios vazios (title, description, category)
- Você não é admin
- RLS policies não aplicadas

**Solução:**
```sql
-- Verifique RLS policies
SELECT * FROM pg_policies WHERE tablename = 'bonuses';
```

Deve retornar 4 policies (select, insert, update, delete)

### Bonuses aparecem no Admin mas não na página?

**Teste policy de leitura:**
```sql
-- Deve funcionar sem erro
SELECT * FROM bonuses;
```

Se retornar erro, RLS policy de SELECT não foi aplicada.

## Estrutura dos Dados

### Campos Obrigatórios
- `title` (string)
- `description` (string)
- `category` (video | ebook | pdf | tool | template | session)

### Campos Opcionais
- `thumbnail` (URL da imagem)
- `duration` (ex: "18 min")
- `file_size` (ex: "2.5 MB")
- `locked` (boolean, default: false)
- `completed` (boolean, default: false)
- `progress` (0-100, default: 0)
- `is_new` (boolean, default: true)
- `tags` (array de strings)
- `view_url` (URL para visualizar)
- `download_url` (URL para download)
- `unlock_requirement` (texto, se locked=true)

### Exemplo de Bonus Completo

```json
{
  "title": "NEP Foundation Video",
  "description": "Master class on neuroscience",
  "category": "video",
  "thumbnail": "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg",
  "duration": "18 min",
  "locked": false,
  "is_new": true,
  "tags": ["Fundamentals", "Neuroscience"],
  "view_url": "https://youtube.com/watch?v=VIDEO_ID"
}
```

## Features Implementadas

### Admin Panel
- ✅ Criar novo bonus
- ✅ Editar bonus existente
- ✅ Deletar bonus
- ✅ Deletar múltiplos (bulk)
- ✅ Toggle lock/unlock
- ✅ Duplicar bonus
- ✅ Export para JSON
- ✅ Import de JSON
- ✅ Filtros e busca
- ✅ Ordenação
- ✅ Preview em tempo real
- ✅ Auto-thumbnail do YouTube
- ✅ Estatísticas no dashboard

### Página do Usuário
- ✅ Lista todos os bonuses
- ✅ Filtros por categoria
- ✅ Busca por título/descrição/tags
- ✅ Ordenação
- ✅ Bonuses locked/unlocked separados
- ✅ In-progress tracking
- ✅ Loading states
- ✅ Error handling

## Dicas de Uso

### YouTube Auto-Thumbnail
Ao criar vídeo:
1. Escolha category: "video"
2. Cole URL do YouTube no campo "View URL"
3. Thumbnail será extraído automaticamente
4. Aguarde ícone verde "Thumbnail loaded from YouTube"

### Bulk Operations
Para deletar vários bonuses:
1. Marque checkboxes dos bonuses
2. Clique em "Delete Selected (X)"
3. Confirme

### Export/Import
**Export:**
1. Clique em "Export"
2. Salva arquivo JSON com todos os bonuses

**Import:**
1. Clique em "Import"
2. Cole JSON no campo
3. Clique em "Import"
4. Bonuses serão criados (IDs novos)

## Comandos Úteis

```bash
# Aplicar migration
node apply-bonuses-migration.mjs

# Popular banco
node seed-bonuses.mjs

# Ver migration SQL
cat supabase/migrations/20251116000000_create_bonuses_table.sql

# Iniciar dev server
npm run dev
```

## Documentação Completa

Para mais detalhes, veja: `BONUSES_CRUD_FIX.md`

## Suporte

Se encontrar problemas:
1. Verifique console do navegador (F12)
2. Verifique console do terminal (npm run dev)
3. Teste queries SQL manualmente no Supabase Dashboard
4. Veja "Verificação de Problemas" acima
