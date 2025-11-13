import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeDatabaseStructure() {
  console.log('🔍 Analisando estrutura da database...\n');

  try {
    // 1. Listar todas as tabelas públicas
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) {
      console.error('Erro ao buscar tabelas:', tablesError);

      // Fallback: tentar listar tabelas usando RPC
      console.log('\n📋 Tentando método alternativo...\n');
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_tables');

      if (rpcError) {
        console.log('⚠️  Usando lista de tabelas conhecidas do projeto...\n');
        await analyzeKnownTables();
        return;
      }
    }

    console.log(`📊 Total de tabelas encontradas: ${tables?.length || 0}\n`);

    if (tables && tables.length > 0) {
      for (const table of tables) {
        await analyzeTable(table.table_name);
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n⚠️  Usando método alternativo para análise...\n');
    await analyzeKnownTables();
  }
}

async function analyzeKnownTables() {
  // Lista de tabelas conhecidas baseada no projeto
  const knownTables = [
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
    'course_progress'
  ];

  for (const tableName of knownTables) {
    await analyzeTableData(tableName);
  }
}

async function analyzeTable(tableName) {
  console.log(`\n📋 Tabela: ${tableName}`);
  console.log('─'.repeat(60));

  try {
    // Buscar colunas da tabela
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', tableName)
      .eq('table_schema', 'public')
      .order('ordinal_position');

    if (!columnsError && columns) {
      console.log('\n  Colunas:');
      columns.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? '(nullable)' : '(NOT NULL)';
        const defaultVal = col.column_default ? `default: ${col.column_default}` : '';
        console.log(`    • ${col.column_name}: ${col.data_type} ${nullable} ${defaultVal}`);
      });
    }

    // Contar registros
    await analyzeTableData(tableName);

  } catch (error) {
    console.log(`    ⚠️  Não foi possível analisar estrutura`);
  }
}

async function analyzeTableData(tableName) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (!error) {
      console.log(`\n  📊 Total de registros: ${count}`);

      // Se houver dados, mostrar um exemplo
      if (count > 0) {
        const { data: sample, error: sampleError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (!sampleError && sample && sample.length > 0) {
          console.log(`  📝 Colunas disponíveis: ${Object.keys(sample[0]).join(', ')}`);
        }
      }
    } else {
      console.log(`    ⚠️  Erro ao contar registros: ${error.message}`);
    }
  } catch (error) {
    console.log(`    ⚠️  Tabela pode não existir ou não ter permissão de acesso`);
  }
}

// Executar análise
analyzeDatabaseStructure().then(() => {
  console.log('\n✅ Análise concluída!');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Erro fatal:', error);
  process.exit(1);
});
