import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('Reading migration file...');

  const migrationSQL = fs.readFileSync(
    'supabase/migrations/20251116000000_create_bonuses_table.sql',
    'utf-8'
  );

  console.log('Applying migration to Supabase...');

  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      // Try direct approach if RPC doesn't work
      console.log('RPC method failed, trying direct SQL execution...');

      // Split by statement and execute one by one
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const statement of statements) {
        const { error: stmtError } = await supabase.from('_migration_temp').select('*');
        if (stmtError) {
          console.error('Error executing statement:', statement.substring(0, 100) + '...');
          console.error(stmtError);
        }
      }

      console.log('\n⚠️  Direct SQL execution not available with anon key.');
      console.log('Please apply the migration manually:');
      console.log('\n1. Go to: https://supabase.com/dashboard');
      console.log('2. Select your project');
      console.log('3. Go to SQL Editor');
      console.log('4. Click "New Query"');
      console.log('5. Copy and paste the content from:');
      console.log('   supabase/migrations/20251116000000_create_bonuses_table.sql');
      console.log('6. Click "Run"\n');
    } else {
      console.log('Migration applied successfully!');
    }
  } catch (error) {
    console.error('Error applying migration:', error);
    console.log('\n⚠️  Automatic migration failed.');
    console.log('Please apply the migration manually via Supabase Dashboard:');
    console.log('\n1. Go to: https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Click "New Query"');
    console.log('5. Copy and paste the content from:');
    console.log('   supabase/migrations/20251116000000_create_bonuses_table.sql');
    console.log('6. Click "Run"\n');
  }
}

applyMigration();
