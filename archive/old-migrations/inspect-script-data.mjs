import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Inspecting first uploaded script in detail...\n');

const { data, error } = await supabase
  .from('scripts')
  .select('*')
  .eq('id', '2bd14f0a-4765-4dcc-9c07-7c6c092e16e5')
  .single();

if (error) {
  console.error('❌ Error:', error);
} else {
  console.log('📄 Full script data:\n');
  console.log(JSON.stringify(data, null, 2));
}
