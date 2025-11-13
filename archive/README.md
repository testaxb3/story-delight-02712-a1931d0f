# Archive - Arquivos Obsoletos

Este diretório contém arquivos antigos que não são mais necessários para o funcionamento do projeto, mas foram preservados para referência histórica.

## Estrutura

### `old-migrations/` (~40 arquivos .mjs)
Scripts Node.js usados para migrações antigas de dados:
- Scripts de upload de CSV (upload-*.mjs)
- Scripts de correção de dados (fix-*.mjs, update-*.mjs)
- Scripts de análise (analyze-*.mjs, check-*.mjs)
- Batches de inserção premium (premium-batch-*.mjs)
- Scripts de revisão (revise-batch-*.mjs)

### `old-sql/` (~25 arquivos .sql e .html)
Migrações SQL antigas e interfaces HTML para execução:
- Arquivos APPLY_*.sql/html - migrações antigas
- Scripts STEP1/2/3_*.sql - processo de seed antigo
- Arquivos de verificação (check_*.sql, verify_*.sql)
- Arquivos FIX_*.sql - correções aplicadas

### `old-docs/` (~20 arquivos .md)
Documentação obsoleta:
- Instruções de migração antigas
- Status reports de uploads
- Documentação de processos antigos
- Guias de como fazer que foram substituídos

## Por que foram arquivados?

Esses arquivos foram substituídos pelo novo sistema de:
1. **Admin Page com CSV Upload** - Interface visual para upload de scripts
2. **Estrutura Hyper-Specific** - Novo formato de 6 seções para scripts
3. **Migrações do Supabase** - Gerenciadas em `supabase/migrations/`

## Quando deletar?

Esses arquivos podem ser deletados com segurança após algumas semanas de verificação que o novo sistema está funcionando perfeitamente.
