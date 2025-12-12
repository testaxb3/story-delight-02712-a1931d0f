#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import process from 'node:process';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

console.log('\n🚀 Executando Migrações Supabase');
console.log('═'.repeat(70));

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log('❌ Erro: Variáveis de ambiente não encontradas\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runMigrations() {
  const migrationsDir = path.join(rootDir, 'supabase', 'migrations');

  // Lista de migrações para executar (apenas as novas)
  const migrations = [
    '20251021000000_add_tracker_metrics.sql',
    '20251021000100_normalize_child_profiles.sql',
    '20251212001000_fix_lesson_4_content.sql',
  ];

  for (const migration of migrations) {
    const migrationPath = path.join(migrationsDir, migration);

    try {
      console.log(`\n📄 Executando: ${migration}`);
      const sql = await fs.readFile(migrationPath, 'utf-8');

      const { error } = await supabase.rpc('exec_sql', { sql_string: sql });

      if (error) {
        console.error(`❌ Erro ao executar ${migration}:`, error);

        // Se a função exec_sql não existir, precisamos usar outra abordagem
        if (error.message?.includes('exec_sql')) {
          console.log('\n⚠️  A função exec_sql não está disponível.');
          console.log('📋 Por favor, execute manualmente as seguintes migrações no Supabase Dashboard:');
          console.log(`   1. ${migrations[0]}`);
          console.log(`   2. ${migrations[1]}`);
          console.log('\n💡 Acesse: https://supabase.com/dashboard/project/iogceaotdodvugrmogpp/sql');
          process.exit(1);
        }
      } else {
        console.log(`✅ ${migration} executada com sucesso!`);
      }
    } catch (err) {
      console.error(`❌ Erro ao ler arquivo ${migration}:`, err);
    }
  }

  console.log('\n✨ Todas as migrações foram executadas!');
}

runMigrations().catch(console.error);
