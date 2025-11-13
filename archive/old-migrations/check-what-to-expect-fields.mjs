import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Checking what_to_expect field structure...\n');

const { data, error } = await supabase
  .from('scripts')
  .select('what_to_expect')
  .eq('id', '2bd14f0a-4765-4dcc-9c07-7c6c092e16e5')
  .single();

if (error) {
  console.error('❌ Error:', error);
} else {
  console.log('📄 what_to_expect data:');
  console.log(JSON.stringify(data.what_to_expect, null, 2));

  console.log('\n🔑 Field names in what_to_expect:');
  if (data.what_to_expect) {
    Object.keys(data.what_to_expect).forEach(key => {
      console.log(`   - ${key}`);
    });
  }
}
