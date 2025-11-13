import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Verifying uploaded scripts...\n');

const scriptIds = [
  '2bd14f0a-4765-4dcc-9c07-7c6c092e16e5',
  'f10dc1fa-1e47-4273-bdbd-81fd55ae2c12',
  '921e68a7-799d-40bd-ab84-8b2c26ba2b3e'
];

for (const id of scriptIds) {
  const { data, error } = await supabase
    .from('scripts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`❌ Error fetching script ${id}:`, error.message);
  } else if (data) {
    console.log(`✅ Script found: "${data.title}"`);
    console.log(`   Category: ${data.category}`);
    console.log(`   Profile: ${data.profile}`);
    console.log(`   Has the_situation: ${!!data.the_situation}`);
    console.log(`   Has what_doesnt_work: ${!!data.what_doesnt_work}`);
    console.log(`   Has strategy_steps: ${!!data.strategy_steps}`);
    console.log(`   Has why_this_works: ${!!data.why_this_works}`);
    console.log(`   Has what_to_expect: ${!!data.what_to_expect}`);
    console.log(`   Has common_variations: ${!!data.common_variations}`);
    console.log('');
  } else {
    console.log(`⚠️  Script ${id} not found`);
  }
}

console.log('📊 Checking total INTENSE Hygiene scripts...');
const { data: allScripts, error: countError } = await supabase
  .from('scripts')
  .select('id, title, profile, category')
  .eq('profile', 'INTENSE')
  .eq('category', 'Hygiene');

if (countError) {
  console.error('❌ Error counting scripts:', countError.message);
} else {
  console.log(`✅ Total INTENSE Hygiene scripts: ${allScripts.length}`);
  allScripts.forEach((s, i) => {
    console.log(`   ${i + 1}. ${s.title}`);
  });
}

console.log('\n🎉 Verification complete!');
