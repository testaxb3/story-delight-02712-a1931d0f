import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Lista de tabelas conhecidas do projeto
const TABLES = [
  'profiles',
  'scripts',
  'user_progress',
  'badges',
  'user_badges',
  'posts',
  'comments',
  'reactions',
  'videos',
  'user_videos',
  'expert_sessions',
  'session_bookings',
  'courses',
  'course_progress',
  'script_feedback'
];

async function inspectDatabase() {
  console.log('═'.repeat(80));
  console.log('🔍 INSPEÇÃO COMPLETA DA DATABASE - BRAINY CHILD GUIDE');
  console.log('═'.repeat(80));
  console.log(`📅 ${new Date().toLocaleString('pt-BR')}\n`);

  let totalRecords = 0;
  const tablesSummary = [];

  for (const tableName of TABLES) {
    console.log('\n' + '─'.repeat(80));
    console.log(`📋 TABELA: ${tableName.toUpperCase()}`);
    console.log('─'.repeat(80));

    try {
      // Contar registros
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.log(`  ⚠️  Tabela não existe ou erro: ${countError.message}`);
        continue;
      }

      const recordCount = count || 0;
      totalRecords += recordCount;

      console.log(`  📊 Total de registros: ${recordCount}`);

      // Buscar estrutura (sample)
      if (recordCount > 0) {
        const { data: sample, error: sampleError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
          .single();

        if (!sampleError && sample) {
          const columns = Object.keys(sample);
          console.log(`\n  📝 Colunas (${columns.length}):`);

          columns.forEach(col => {
            const value = sample[col];
            const type = value === null ? 'null' : typeof value;
            const valuePreview = value === null ? 'NULL' :
                                value === undefined ? 'undefined' :
                                typeof value === 'object' ? JSON.stringify(value).substring(0, 50) + '...' :
                                String(value).substring(0, 50);

            console.log(`    • ${col.padEnd(30)} [${type.padEnd(10)}] Exemplo: ${valuePreview}`);
          });

          tablesSummary.push({
            table: tableName,
            records: recordCount,
            columns: columns.length
          });
        }
      } else {
        console.log('  📝 Tabela vazia (sem dados para análise de estrutura)');
        tablesSummary.push({
          table: tableName,
          records: 0,
          columns: '-'
        });
      }

      // Análise específica por tabela
      await analyzeTableSpecifics(tableName, recordCount);

    } catch (error) {
      console.log(`  ❌ Erro ao analisar tabela: ${error.message}`);
    }
  }

  // Resumo final
  console.log('\n' + '═'.repeat(80));
  console.log('📊 RESUMO GERAL DA DATABASE');
  console.log('═'.repeat(80) + '\n');

  console.log('┌─────────────────────────────┬──────────────┬──────────────┐');
  console.log('│ Tabela                      │   Registros  │   Colunas    │');
  console.log('├─────────────────────────────┼──────────────┼──────────────┤');

  tablesSummary.forEach(t => {
    const tableName = t.table.padEnd(27);
    const records = String(t.records).padStart(10);
    const columns = String(t.columns).padStart(10);
    console.log(`│ ${tableName} │   ${records} │   ${columns} │`);
  });

  console.log('└─────────────────────────────┴──────────────┴──────────────┘');
  console.log(`\n  🎯 Total de registros na database: ${totalRecords}`);
  console.log(`  📚 Total de tabelas analisadas: ${tablesSummary.length}`);
}

async function analyzeTableSpecifics(tableName, count) {
  if (count === 0) return;

  try {
    switch (tableName) {
      case 'scripts':
        const { data: scriptStats } = await supabase
          .from('scripts')
          .select('category, profile, difficulty_level');

        if (scriptStats) {
          const categories = [...new Set(scriptStats.map(s => s.category).filter(Boolean))];
          const profiles = [...new Set(scriptStats.map(s => s.profile).filter(Boolean))];
          const difficulties = [...new Set(scriptStats.map(s => s.difficulty_level).filter(Boolean))];

          console.log(`\n  📊 Categorias: ${categories.join(', ') || 'N/A'}`);
          console.log(`  🧠 Perfis: ${profiles.join(', ') || 'N/A'}`);
          console.log(`  ⭐ Dificuldades: ${difficulties.join(', ') || 'N/A'}`);
        }
        break;

      case 'profiles':
        const { data: profileStats } = await supabase
          .from('profiles')
          .select('premium, is_admin, quiz_completed, welcome_modal_shown');

        if (profileStats) {
          const premiumCount = profileStats.filter(p => p.premium).length;
          const adminCount = profileStats.filter(p => p.is_admin).length;
          const quizCount = profileStats.filter(p => p.quiz_completed).length;
          const welcomeShown = profileStats.filter(p => p.welcome_modal_shown).length;

          console.log(`\n  👑 Usuários premium: ${premiumCount}/${count}`);
          console.log(`  🔧 Administradores: ${adminCount}/${count}`);
          console.log(`  📝 Quiz completado: ${quizCount}/${count}`);
          console.log(`  👋 Welcome modal visto: ${welcomeShown}/${count}`);
        }
        break;

      case 'videos':
        const { data: videoStats } = await supabase
          .from('videos')
          .select('section, premium_only, locked');

        if (videoStats) {
          const sections = [...new Set(videoStats.map(v => v.section).filter(Boolean))];
          const premiumVideos = videoStats.filter(v => v.premium_only).length;
          const lockedVideos = videoStats.filter(v => v.locked).length;

          console.log(`\n  📺 Seções: ${sections.join(', ') || 'N/A'}`);
          console.log(`  👑 Vídeos premium: ${premiumVideos}/${count}`);
          console.log(`  🔒 Vídeos bloqueados: ${lockedVideos}/${count}`);
        }
        break;
    }
  } catch (error) {
    // Silenciar erros de análise específica
  }
}

inspectDatabase().then(() => {
  console.log('\n✅ Inspeção completa!\n');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Erro fatal:', error);
  process.exit(1);
});
