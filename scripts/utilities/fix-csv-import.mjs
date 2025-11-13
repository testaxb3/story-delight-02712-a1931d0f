import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Fix the what_to_expect data for the first script
const whatToExpectData1 = {
  "first_30_seconds": "May not even look up when you set the timer. That's okay - they'll see it when they glance at the screen. At the 2-minute warning, expect them to say 'Okay' without really processing. At 30 seconds, they might start to realize it's really ending and get tense.",
  "by_90_seconds": "When timer beeps, expect confusion, protest, or 'But I didn't hear you!' They're not lying - they genuinely might not remember the warnings. Some kids hand it over sadly. Some melt down. Both are normal. Stay calm, take it, validate the difficulty.",
  "dont_expect": [
    "Cheerful compliance when time's up - stopping hyperfocus is neurologically painful",
    "Remembering the warnings afterward - their brain wasn't recording during hyperfocus",
    "No meltdowns - some kids will cry or tantrum, especially first few times",
    "Instant learning - takes 10-15 repetitions before their brain anticipates the pattern"
  ],
  "this_is_success": "The tablet got turned off at the agreed time without you exploding or them experiencing it as a betrayal. Even if they cried? Win. Even if they insisted they 'never heard you'? Win. Even if you had to physically take it? Still a win. You're teaching their brain that time limits exist and you enforce them calmly."
};

const whatToExpectData2 = {
  "first_30_seconds": "They'll sit down, might take a few bites if reminded immediately. Will likely drift within 60 seconds - staring, talking, playing. When you redirect, expect quick compliance (one bite) then immediate drift again. This is normal.",
  "by_3_minutes": "With consistent redirects every 60-90 seconds, they'll take bites when reminded. Between reminders, expect drifting. Won't finish meal quickly - this approach makes eating slower but ensures they actually eat. Expect to redirect 8-12 times in a 20-minute meal.",
  "dont_expect": [
    "Independent eating without reminders - they need external scaffolding for months",
    "Fast meals - this takes longer than if you spoon-fed them, AND they're learning focus",
    "Zero drifting - their brain will always get pulled away; you're teaching them to come back",
    "Perfect focus - expect 50% attention even with support; that's progress"
  ],
  "this_is_success": "They ate a reasonable amount with your support. Even if you had to redirect 15 times? Win. Even if it took the full 20 minutes? Win. Even if they drifted constantly? Still a win - because you stayed calm and they learned meals have structure. You're building neural pathways for sustained attention. Speed comes later."
};

async function updateScripts() {
  console.log('\n🔧 Fixing what_to_expect for 2 scripts...\n');

  // Update first script
  const { data: script1, error: error1 } = await supabase
    .from('scripts')
    .update({ what_to_expect: whatToExpectData1 })
    .eq('title', 'Agrees to turn off tablet - genuinely forgets 30 seconds later')
    .select();

  if (error1) {
    console.error('❌ Error updating script 1:', error1);
  } else {
    console.log('✅ Updated: "Agrees to turn off tablet - genuinely forgets 30 seconds later"');
    console.log('   Added what_to_expect with first_30_seconds + by_90_seconds');
  }

  // Update second script
  const { data: script2, error: error2 } = await supabase
    .from('scripts')
    .update({ what_to_expect: whatToExpectData2 })
    .eq('title', 'Sits down to eat - forgets to actually eat')
    .select();

  if (error2) {
    console.error('❌ Error updating script 2:', error2);
  } else {
    console.log('✅ Updated: "Sits down to eat - forgets to actually eat"');
    console.log('   Added what_to_expect with first_30_seconds + by_3_minutes');
  }

  console.log('\n✅ Done! Both scripts now have proper what_to_expect data.\n');
}

updateScripts();
