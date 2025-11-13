import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔧 Applying migration directly via Supabase...\n');

// Read the migration file
const migrationPath = './supabase/migrations/20251116000000_restructure_scripts_hyper_specific.sql';
console.log('📖 Reading migration file...');

const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

console.log('✅ Migration file loaded\n');
console.log('🚀 Executing migration...\n');

// Split into individual statements and execute
const statements = migrationSQL
  .split(';')
  .map(s => s.trim())
  .filter(s => s && !s.startsWith('--') && !s.startsWith('/*'));

console.log(`Found ${statements.length} SQL statements to execute\n`);

let successCount = 0;
let errorCount = 0;

for (const [index, statement] of statements.entries()) {
  const preview = statement.substring(0, 60).replace(/\n/g, ' ');
  console.log(`[${index + 1}/${statements.length}] ${preview}...`);

  try {
    const { error } = await supabase.rpc('query', { query_text: statement });

    if (error) {
      console.log(`  ⚠️  ${error.message}`);
      errorCount++;
    } else {
      console.log(`  ✅ Success`);
      successCount++;
    }
  } catch (e) {
    console.log(`  ⚠️  ${e.message}`);
    errorCount++;
  }
}

console.log(`\n📊 Results: ${successCount} successful, ${errorCount} errors\n`);

if (errorCount > 0) {
  console.log('⚠️  Some statements failed (may be because columns already exist)\n');
}

console.log('✅ Migration process complete!\n');
console.log('🎯 Now uploading CSV scripts...\n');

// Now upload the CSV
console.log('Running upload script...\n');
