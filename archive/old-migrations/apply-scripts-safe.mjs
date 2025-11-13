import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase credentials
const SUPABASE_URL = 'https://iogceaotdodvugrmogpp.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function applyScripts() {
  try {
    console.log('🔍 Verificando estrutura da tabela scripts...\n');

    // Check if enhanced columns exist
    const { data: columns, error: colError } = await supabase
      .from('scripts')
      .select('situation_trigger, emergency_suitable')
      .limit(1);

    if (colError) {
      console.error('❌ ERRO: As colunas enhanced não existem!');
      console.error('Você precisa aplicar a migration primeiro.');
      console.error('Abra: APPLY_MIGRATION_HERE.html\n');
      return;
    }

    console.log('✅ Colunas enhanced existem. Estrutura OK.\n');

    // Count existing scripts by profile
    console.log('📊 Scripts atuais no banco:\n');
    const { data: stats } = await supabase
      .from('scripts')
      .select('profile')
      .in('profile', ['INTENSE', 'DISTRACTED', 'DEFIANT']);

    const counts = {
      INTENSE: stats?.filter(s => s.profile === 'INTENSE').length || 0,
      DISTRACTED: stats?.filter(s => s.profile === 'DISTRACTED').length || 0,
      DEFIANT: stats?.filter(s => s.profile === 'DEFIANT').length || 0
    };

    console.log(`   INTENSE: ${counts.INTENSE} scripts`);
    console.log(`   DISTRACTED: ${counts.DISTRACTED} scripts`);
    console.log(`   DEFIANT: ${counts.DEFIANT} scripts\n`);

    if (counts.INTENSE > 0 || counts.DISTRACTED > 0 || counts.DEFIANT > 0) {
      console.log('⚠️  AVISO: Já existem scripts desses brain types no banco.');
      console.log('Para evitar duplicatas, você tem 2 opções:\n');
      console.log('1. DELETAR scripts existentes antes de inserir:');
      console.log('   DELETE FROM scripts WHERE profile IN (\'INTENSE\', \'DISTRACTED\', \'DEFIANT\');\n');
      console.log('2. RENOMEAR os títulos dos novos scripts para evitar conflito.\n');
      console.log('Como você quer proceder?');
      console.log('a) Deletar existentes e inserir novos');
      console.log('b) Manter existentes e pular duplicatas\n');
      return;
    }

    console.log('✅ Nenhum script desses brain types encontrado. Pronto para inserir.\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 PRÓXIMOS PASSOS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('1. Abra o arquivo: 30_NEP_SCRIPTS_READY.sql');
    console.log('2. O arquivo tem os 10 scripts INTENSE completos');
    console.log('3. Adicione os 20 scripts DISTRACTED e DEFIANT');
    console.log('4. Copie TODO o conteúdo');
    console.log('5. Vá para: https://supabase.com/dashboard/project/iogceaotdodvugrmogpp/sql/new');
    console.log('6. Cole e execute\n');
    console.log('Ou me mostre o erro que apareceu para eu ajudar!\n');

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
    console.error('\nStack trace:', error.stack);
  }
}

applyScripts();
