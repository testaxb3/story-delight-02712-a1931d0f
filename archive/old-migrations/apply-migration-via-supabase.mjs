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

async function applyMigration() {
  try {
    console.log('📄 Reading migration file...');
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20251114000000_enhance_scripts_structure.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('✅ Migration file loaded\n');

    console.log('🚀 Applying migration via Supabase RPC...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Try to execute the SQL via RPC
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: migrationSQL
    });

    if (error) {
      // If RPC doesn't exist, we'll manually execute key parts
      console.log('⚠️  RPC method not available, applying manually...\n');

      // Split migration into individual statements and execute
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        if (stmt.length > 0) {
          console.log(`Executing statement ${i + 1}/${statements.length}...`);

          // Use the query method for DDL statements
          const { error: stmtError } = await supabase.rpc('exec', { sql: stmt + ';' });

          if (stmtError) {
            console.log(`⚠️  Statement ${i + 1} error:`, stmtError.message);
          }
        }
      }
    } else {
      console.log('✅ Migration applied successfully!');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 Verifying columns...\n');

    // Verify by trying to select from scripts with new columns
    const { data: testData, error: testError } = await supabase
      .from('scripts')
      .select('id, situation_trigger, emergency_suitable, parent_state, location_type')
      .limit(1);

    if (testError) {
      console.log('⚠️  Verification error:', testError.message);
      console.log('\n📝 You may need to apply the migration manually via Supabase Dashboard');
      console.log('   Go to: SQL Editor > Paste migration content > Run\n');
    } else {
      console.log('✅ New columns verified! Sample data structure:');
      console.log(JSON.stringify(testData, null, 2));
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎉 Enhanced Scripts structure is ready!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nFull error:', error);

    console.log('\n📝 MANUAL APPLICATION NEEDED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Please apply the migration manually:');
    console.log('1. Go to: https://supabase.com/dashboard/project/iogceaotdodvugrmogpp/editor');
    console.log('2. Click "SQL Editor"');
    console.log('3. Open: supabase/migrations/20251114000000_enhance_scripts_structure.sql');
    console.log('4. Copy entire contents');
    console.log('5. Paste into SQL Editor');
    console.log('6. Click "Run"\n');
  }
}

applyMigration();
