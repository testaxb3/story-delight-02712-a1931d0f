import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.SUPABASE_DB_URL
});

async function analyzeDatabase() {
  await client.connect();
  console.log('✅ Conectado à database!\n');

  try {
    // 1. Listar todas as tabelas
    console.log('═'.repeat(80));
    console.log('📊 TABELAS NA DATABASE');
    console.log('═'.repeat(80));

    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;

    const { rows: tables } = await client.query(tablesQuery);
    console.log(`\nTotal de tabelas: ${tables.length}\n`);

    for (const table of tables) {
      await analyzeTable(table.table_name);
    }

    // 2. Listar Foreign Keys (relacionamentos)
    console.log('\n' + '═'.repeat(80));
    console.log('🔗 RELACIONAMENTOS (Foreign Keys)');
    console.log('═'.repeat(80) + '\n');

    const fkQuery = `
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        tc.constraint_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name;
    `;

    const { rows: foreignKeys } = await client.query(fkQuery);
    foreignKeys.forEach(fk => {
      console.log(`  ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    });

    // 3. Listar índices
    console.log('\n' + '═'.repeat(80));
    console.log('📇 ÍNDICES');
    console.log('═'.repeat(80) + '\n');

    const indexQuery = `
      SELECT
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `;

    const { rows: indexes } = await client.query(indexQuery);
    let currentTable = '';
    indexes.forEach(idx => {
      if (idx.tablename !== currentTable) {
        console.log(`\n  📋 ${idx.tablename}:`);
        currentTable = idx.tablename;
      }
      console.log(`    • ${idx.indexname}`);
    });

    // 4. Listar funções e triggers
    console.log('\n' + '═'.repeat(80));
    console.log('⚡ TRIGGERS');
    console.log('═'.repeat(80) + '\n');

    const triggerQuery = `
      SELECT
        event_object_table AS table_name,
        trigger_name,
        action_timing,
        event_manipulation
      FROM information_schema.triggers
      WHERE trigger_schema = 'public'
      ORDER BY event_object_table, trigger_name;
    `;

    const { rows: triggers } = await client.query(triggerQuery);
    if (triggers.length === 0) {
      console.log('  (Nenhum trigger encontrado)');
    } else {
      triggers.forEach(trg => {
        console.log(`  ${trg.table_name}: ${trg.trigger_name} (${trg.action_timing} ${trg.event_manipulation})`);
      });
    }

    // 5. Storage buckets
    console.log('\n' + '═'.repeat(80));
    console.log('🗄️  STORAGE BUCKETS');
    console.log('═'.repeat(80) + '\n');

    const bucketsQuery = `SELECT * FROM storage.buckets ORDER BY name;`;
    const { rows: buckets } = await client.query(bucketsQuery);
    if (buckets.length === 0) {
      console.log('  (Nenhum bucket encontrado)');
    } else {
      buckets.forEach(bucket => {
        console.log(`  📦 ${bucket.name} (public: ${bucket.public})`);
      });
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

async function analyzeTable(tableName) {
  console.log('\n┌' + '─'.repeat(78) + '┐');
  console.log(`│ 📋 ${tableName.toUpperCase().padEnd(75)} │`);
  console.log('└' + '─'.repeat(78) + '┘');

  // Estrutura da tabela
  const columnsQuery = `
    SELECT
      column_name,
      data_type,
      character_maximum_length,
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_name = $1
      AND table_schema = 'public'
    ORDER BY ordinal_position;
  `;

  const { rows: columns } = await client.query(columnsQuery, [tableName]);

  console.log('\n  Colunas:');
  columns.forEach(col => {
    const type = col.character_maximum_length
      ? `${col.data_type}(${col.character_maximum_length})`
      : col.data_type;
    const nullable = col.is_nullable === 'YES' ? '✓ NULL' : '✗ NOT NULL';
    const defaultVal = col.column_default ? `[default: ${col.column_default.substring(0, 30)}...]` : '';

    console.log(`    • ${col.column_name.padEnd(30)} ${type.padEnd(20)} ${nullable.padEnd(10)} ${defaultVal}`);
  });

  // Contar registros
  const countQuery = `SELECT COUNT(*) as count FROM "${tableName}";`;
  const { rows: countResult } = await client.query(countQuery);
  console.log(`\n  📊 Total de registros: ${countResult[0].count}`);

  // Primary key
  const pkQuery = `
    SELECT kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'PRIMARY KEY'
      AND tc.table_name = $1
      AND tc.table_schema = 'public';
  `;

  const { rows: pks } = await client.query(pkQuery, [tableName]);
  if (pks.length > 0) {
    console.log(`  🔑 Primary Key: ${pks.map(pk => pk.column_name).join(', ')}`);
  }
}

analyzeDatabase().then(() => {
  console.log('\n\n✅ Análise completa!\n');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Erro fatal:', error);
  process.exit(1);
});
