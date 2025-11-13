#!/usr/bin/env node

/**
 * Check Applied Migrations
 * Queries the actual database to see which migrations have been applied
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'https://iogceaotdodvugrmogpp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODcwODQsImV4cCI6MjA3NjQ2MzA4NH0.uMAT-RZLc0jh1E03UiDrQ1gnpxfZulZ16OxQpypAGJo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAppliedMigrations() {
  console.log('='.repeat(80));
  console.log('CHECKING APPLIED MIGRATIONS');
  console.log('='.repeat(80) + '\n');

  // Try to query the migrations table
  const { data, error } = await supabase
    .from('supabase_migrations')
    .select('*')
    .order('version', { ascending: true });

  if (error) {
    console.log('⚠ Cannot access supabase_migrations table');
    console.log('Error:', error.message);
    console.log('\nThis likely means migrations are NOT being tracked properly.\n');
    return null;
  }

  console.log(`✓ Found ${data.length} applied migrations:\n`);

  data.forEach((migration, index) => {
    console.log(`${index + 1}. ${migration.version} - ${migration.name || '(no name)'}`);
  });

  return data;
}

async function getLocalMigrations() {
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log('\n' + '='.repeat(80));
  console.log('LOCAL MIGRATION FILES');
  console.log('='.repeat(80) + '\n');
  console.log(`Found ${files.length} migration files:\n`);

  files.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });

  return files;
}

async function compareMigrations() {
  const applied = await checkAppliedMigrations();
  const local = await getLocalMigrations();

  if (!applied) {
    console.log('\n' + '='.repeat(80));
    console.log('ANALYSIS: MIGRATIONS NOT TRACKED');
    console.log('='.repeat(80) + '\n');
    console.log('The database does not appear to track migrations.');
    console.log('This could mean:');
    console.log('  1. Migrations were run manually (SQL executed directly)');
    console.log('  2. Database was created without Supabase CLI');
    console.log('  3. Migration tracking system is not set up\n');
    return;
  }

  console.log('\n' + '='.repeat(80));
  console.log('MIGRATION COMPARISON');
  console.log('='.repeat(80) + '\n');

  const appliedVersions = new Set(applied.map(m => m.version));
  const localVersions = new Set(local.map(f => f.split('_')[0]));

  console.log('UNAPPLIED MIGRATIONS (local files not in database):\n');
  const unapplied = local.filter(f => {
    const version = f.split('_')[0];
    return !appliedVersions.has(version);
  });

  if (unapplied.length === 0) {
    console.log('  ✓ All local migrations have been applied\n');
  } else {
    unapplied.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file}`);
    });
    console.log('');
  }

  console.log('APPLIED MIGRATIONS NOT IN LOCAL FILES:\n');
  const missing = applied.filter(m => {
    return !local.some(f => f.startsWith(m.version));
  });

  if (missing.length === 0) {
    console.log('  ✓ All applied migrations have corresponding files\n');
  } else {
    missing.forEach((m, index) => {
      console.log(`  ${index + 1}. ${m.version} - ${m.name || '(no name)'}`);
    });
    console.log('');
  }
}

async function main() {
  await compareMigrations();
}

main().catch(console.error);
