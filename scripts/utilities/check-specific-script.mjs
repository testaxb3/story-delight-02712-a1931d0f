import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkScript() {
  console.log('\n🔍 Checking script: "Agrees to turn off tablet - genuinely forgets 30 seconds later"\n');

  const { data: scripts, error } = await supabase
    .from('scripts')
    .select('*')
    .ilike('title', '%Agrees to turn off tablet%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (!scripts || scripts.length === 0) {
    console.log('❌ Script not found!');
    return;
  }

  const script = scripts[0];
  console.log('✅ Script found!\n');
  console.log('ID:', script.id);
  console.log('Title:', script.title);
  console.log('Profile:', script.profile);
  console.log('Category:', script.category);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('📋 FIELD CHECK:\n');

  console.log('✅ the_situation:', script.the_situation ? 'EXISTS' : '❌ MISSING');
  console.log('✅ what_doesnt_work:', script.what_doesnt_work ? 'EXISTS' : '❌ MISSING');
  console.log('✅ strategy_steps:', script.strategy_steps ? 'EXISTS' : '❌ MISSING');
  console.log('✅ why_this_works:', script.why_this_works ? 'EXISTS' : '❌ MISSING');
  console.log('✅ what_to_expect:', script.what_to_expect ? 'EXISTS' : '❌ MISSING');
  console.log('✅ common_variations:', script.common_variations ? 'EXISTS' : '❌ MISSING');
  console.log('✅ parent_state_needed:', script.parent_state_needed ? 'EXISTS' : '❌ MISSING');

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (script.what_to_expect) {
    console.log('📊 what_to_expect DATA:\n');
    console.log(JSON.stringify(script.what_to_expect, null, 2));
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🔍 FIELDS IN what_to_expect:\n');
    const wte = script.what_to_expect;
    console.log('- first_30_seconds:', wte.first_30_seconds ? '✅' : '❌');
    console.log('- first_5_minutes:', wte.first_5_minutes ? '✅' : '❌');
    console.log('- first_few_days:', wte.first_few_days ? '✅' : '❌');
    console.log('- first_week:', wte.first_week ? '✅' : '❌');
    console.log('- first_few_weeks:', wte.first_few_weeks ? '✅' : '❌');
    console.log('');
    console.log('- by_90_seconds:', wte.by_90_seconds ? '✅' : '❌');
    console.log('- by_2_minutes:', wte.by_2_minutes ? '✅' : '❌');
    console.log('- by_3_minutes:', wte.by_3_minutes ? '✅' : '❌');
    console.log('- by_10_minutes:', wte.by_10_minutes ? '✅' : '❌');
    console.log('- by_week_2:', wte.by_week_2 ? '✅' : '❌');
    console.log('- by_week_3:', wte.by_week_3 ? '✅' : '❌');
    console.log('- by_2_months:', wte.by_2_months ? '✅' : '❌');
    console.log('- by_x_weeks:', wte.by_x_weeks ? '✅' : '❌');
    console.log('');
    console.log('- dont_expect:', wte.dont_expect ? '✅' : '❌');
    console.log('- this_is_success:', wte.this_is_success ? '✅' : '❌');
  } else {
    console.log('❌ what_to_expect is NULL or empty in the database!');
    console.log('\nThis script needs to be regenerated with proper what_to_expect data.');
  }
}

checkScript();
