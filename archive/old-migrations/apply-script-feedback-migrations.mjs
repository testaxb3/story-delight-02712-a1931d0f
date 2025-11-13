import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'https://iogceaotdodvugrmogpp.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function applyMigrations() {
  console.log('🔧 Aplicando migrations script_feedback...\n');

  // Check if table exists
  const { data: existingTable } = await supabase
    .from('script_feedback')
    .select('id')
    .limit(1);

  if (existingTable !== null) {
    console.log('✅ Tabela script_feedback já existe.\n');
    console.log('Verificando se precisa aplicar fix...\n');

    // Try to select with child_id to see if migration is needed
    const { error } = await supabase
      .from('script_feedback')
      .select('child_id')
      .limit(1);

    if (error && error.message.includes('child_id')) {
      console.log('❌ Coluna child_id não encontrada. Precisa aplicar migrations.\n');
      console.log('AÇÃO NECESSÁRIA:');
      console.log('1. Vá para: https://supabase.com/dashboard/project/iogceaotdodvugrmogpp/sql/new');
      console.log('2. Execute a migration 1:');
      console.log('   Arquivo: supabase/migrations/20251113120000_create_script_feedback_table.sql\n');
      console.log('3. Execute a migration 2:');
      console.log('   Arquivo: supabase/migrations/20251113120001_fix_script_feedback_child_id.sql\n');
    } else {
      console.log('✅ Coluna child_id existe! Tabela está correta.\n');
    }
  } else {
    console.log('ℹ️ Tabela script_feedback não existe.\n');
    console.log('AÇÃO NECESSÁRIA:');
    console.log('Aplicar migrations no Supabase Dashboard:');
    console.log('1. Vá para: https://supabase.com/dashboard/project/iogceaotdodvugrmogpp/sql/new');
    console.log('2. Execute a migration 1:');
    console.log('   Arquivo: supabase/migrations/20251113120000_create_script_feedback_table.sql\n');
    console.log('3. Execute a migration 2:');
    console.log('   Arquivo: supabase/migrations/20251113120001_fix_script_feedback_child_id.sql\n');
  }
}

applyMigrations();
