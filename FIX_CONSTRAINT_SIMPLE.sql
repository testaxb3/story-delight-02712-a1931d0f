-- Remover constraint diretamente (versão simples)
ALTER TABLE tracker_days DROP CONSTRAINT IF EXISTS tracker_days_meltdown_count_check;

-- Garantir que a coluna é TEXT
ALTER TABLE tracker_days ALTER COLUMN meltdown_count TYPE TEXT;

-- Verificar se funcionou (deve retornar 0 linhas)
SELECT
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'tracker_days'::regclass
  AND conname LIKE '%meltdown%';
