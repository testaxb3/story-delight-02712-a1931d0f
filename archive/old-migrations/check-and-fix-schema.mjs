import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Checking current database schema...\n');

// Query to check if columns exist
const { data: columns, error } = await supabase
  .from('scripts')
  .select('*')
  .limit(1);

if (error) {
  console.error('❌ Error querying scripts:', error);
  process.exit(1);
}

const existingColumns = columns && columns.length > 0 ? Object.keys(columns[0]) : [];

console.log('📊 Existing columns in scripts table:');
console.log(existingColumns.join(', '));
console.log('');

const neededColumns = [
  'the_situation',
  'what_doesnt_work',
  'strategy_steps',
  'why_this_works',
  'what_to_expect',
  'common_variations',
  'parent_state_needed',
  'difficulty',
  'duration_minutes'
];

const missingColumns = neededColumns.filter(col => !existingColumns.includes(col));

if (missingColumns.length === 0) {
  console.log('✅ All required columns exist!\n');
  console.log('Now running CSV upload...\n');
} else {
  console.log('❌ Missing columns:', missingColumns.join(', '));
  console.log('\n⚠️  You need to apply the migration in Supabase Dashboard\n');
  console.log('Go to: https://supabase.com/dashboard/project/iogceaotdodvugrmogpp/sql/new');
  console.log('\nPaste this SQL:\n');
  console.log('```sql');
  console.log('ALTER TABLE scripts');
  missingColumns.forEach((col, i) => {
    const comma = i < missingColumns.length - 1 ? ',' : ';';
    if (col === 'strategy_steps' || col === 'what_to_expect' || col === 'common_variations') {
      console.log(`ADD COLUMN IF NOT EXISTS ${col} JSONB${comma}`);
    } else if (col === 'duration_minutes') {
      console.log(`ADD COLUMN IF NOT EXISTS ${col} INTEGER${comma}`);
    } else {
      console.log(`ADD COLUMN IF NOT EXISTS ${col} TEXT${comma}`);
    }
  });
  console.log('```\n');
}
