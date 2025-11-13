import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Checking "Why This Works" field...\n');

const { data, error } = await supabase
  .from('scripts')
  .select('id, title, why_this_works')
  .ilike('title', '%hair%')
  .single();

if (error) {
  console.error('❌ Error:', error);
} else {
  console.log(`📝 Script: "${data.title}"`);
  console.log(`📌 ID: ${data.id}\n`);
  console.log('📄 why_this_works:');
  console.log(data.why_this_works);
  console.log(`\n📏 Length: ${data.why_this_works?.length || 0} characters`);
}
