import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Checking column types in scripts table...\n');

// Query information_schema to get actual column types
const { data, error } = await supabase
  .rpc('exec', {
    sql: `
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'scripts'
        AND column_name IN (
          'what_to_expect',
          'strategy_steps',
          'common_variations',
          'the_situation',
          'what_doesnt_work',
          'why_this_works',
          'parent_state_needed',
          'difficulty',
          'duration_minutes'
        )
      ORDER BY column_name;
    `
  });

if (error) {
  console.error('❌ Error querying schema:', error.message);
  console.log('\n⚠️  The exec RPC function may not exist. Let me try a different approach...\n');

  // Alternative: Query pg_catalog directly
  const { data: pgData, error: pgError } = await supabase
    .from('scripts')
    .select('*')
    .limit(0);

  if (pgError) {
    console.error('❌ Alternative query failed:', pgError);
  } else {
    console.log('✅ Table exists, but cannot introspect types via RPC');
    console.log('📋 Please check these columns in Supabase Dashboard > Table Editor');
  }
} else {
  console.log('📊 Column types:');
  console.table(data);
}
