# Fix: Script Batch Upload RLS Error

## Problema

Ao fazer upload em batch de scripts (ex: 200 scripts) na página de admin, aparece o erro:
```
Batch 1: new row violates row-level security policy for table "scripts"
```

## Causa Raiz

As políticas RLS (Row-Level Security) da tabela `scripts` tinham uma configuração incorreta:

1. **Política "Admins can manage scripts" (FOR ALL)**: Tinha apenas cláusula `USING`, mas não `WITH CHECK`
2. **Política "Admins can insert scripts" (FOR INSERT)**: Tinha `WITH CHECK`, mas criava conflito

Para operações de INSERT, o PostgreSQL requer a cláusula `WITH CHECK` para validar os dados inseridos. A política `FOR ALL` não tinha essa cláusula, causando a falha nas operações de batch insert.

## Solução

A migration `20251122000000_fix_scripts_rls_for_batch_insert.sql` corrige o problema:

1. Remove as duas políticas conflitantes
2. Cria uma única política abrangente com **ambas** as cláusulas:
   - `USING`: Para validar permissões de leitura/atualização/exclusão
   - `WITH CHECK`: Para validar permissões de inserção

```sql
CREATE POLICY "Admins can manage scripts"
ON public.scripts
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
```

## Como Aplicar a Migration

### Opção 1: Supabase Dashboard
1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Vá para seu projeto
3. Navegue até **SQL Editor**
4. Abra e execute o arquivo: `supabase/migrations/20251122000000_fix_scripts_rls_for_batch_insert.sql`

### Opção 2: Supabase CLI (se disponível)
```bash
supabase db push
```

### Opção 3: Aplicação Manual
Execute o seguinte SQL diretamente no Supabase:

```sql
-- Remove políticas existentes
DROP POLICY IF EXISTS "Admins can manage scripts" ON public.scripts;
DROP POLICY IF EXISTS "Admins can insert scripts" ON public.scripts;

-- Cria política corrigida
CREATE POLICY "Admins can manage scripts"
ON public.scripts
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
```

## Verificação

Após aplicar a migration, teste o upload em batch:

1. Acesse a página de Admin
2. Vá para a aba "Scripts"
3. Clique em "Import Scripts"
4. Faça upload de um arquivo com múltiplos scripts (CSV ou JSON)
5. Verifique se o batch insert funciona sem erros

## Detalhes Técnicos

- **Arquivo da migration**: `supabase/migrations/20251122000000_fix_scripts_rls_for_batch_insert.sql`
- **Tabela afetada**: `public.scripts`
- **Tamanho do batch**: 15 scripts por vez (configurado em `AdminScriptsTab.tsx:78`)
- **Função de validação**: `has_role(auth.uid(), 'admin'::app_role)`

## Arquivos Relacionados

- `/src/components/Admin/AdminScriptsTab.tsx` - Interface de upload em batch
- `/supabase/migrations/20251018144231_312ca694-7fc8-4187-94d4-0b4e6440e203.sql` - Migration original com o problema
- `/supabase/migrations/20251122000000_fix_scripts_rls_for_batch_insert.sql` - Migration de correção
