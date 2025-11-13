import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

const script = {
  title: "Starting homework but drifting off mid-problem",
  profile: 'DISTRACTED',
  category: 'Homework',
  situation_trigger: 'Homework time. Child starts problem, gets halfway through, then stares into space, doodles on page, or starts playing with eraser. Not refusing - genuinely losing focus mid-task.',

  phrase_1: "Your brain wandered away from the problem.",
  phrase_1_action: "CONNECTION",

  phrase_2: "You started it, AND somewhere in the middle it got boring.",
  phrase_2_action: "VALIDATION",

  phrase_3: "Finish this one problem with me watching, then 2-minute break. No break until it's done.",
  phrase_3_action: "COMMAND",

  wrong_way: "FOCUS! You were just DOING it! Why did you stop?! Stop doodling and FINISH! You're making this take forever!",

  neurological_tip: "DISTRACTED kids lose focus mid-task because sustained attention depletes fast - they can start with focus, but it burns out partway through, especially on repetitive work. The drift isn't willful; their executive function literally runs out of juice. Yelling doesn't refuel it. Naming it ('brain wandered away') externalizes the struggle. The structure (finish ONE with supervision, then break) chunks the task and provides external accountability. The break isn't reward; it's necessary reset for their attention system to recharge before the next problem.",

  parent_state: ['calm', 'patient', 'present'],
  location_type: ['home'],
  emergency_suitable: false,
  success_speed: 'Medium (5-10min)',
  expected_time_seconds: 360,
  age_min: 6,
  age_max: 13,
};

console.log('✅ Adding missing DISTRACTED/Homework script\n');

const { error } = await supabase.from('scripts').insert([script]);

if (error) {
  console.error(`❌ ${error.message}`);
} else {
  console.log(`✅ SUCCESS: "${script.title}"`);
}

// Check coverage
const { data } = await supabase.from('scripts').select('profile, category');

const matrix = {};
data.forEach(s => {
  if (!matrix[s.profile]) matrix[s.profile] = {};
  if (!matrix[s.profile][s.category]) matrix[s.profile][s.category] = 0;
  matrix[s.profile][s.category]++;
});

const allCategories = ['Bedtime', 'Emotional_Regulation', 'Homework', 'Hygiene', 'Mealtime', 'Morning_Routines', 'Problem_Solving', 'Screens', 'Social', 'Tantrums', 'Transitions'];

const covered = allCategories.filter(cat =>
  ['INTENSE', 'DISTRACTED', 'DEFIANT'].every(prof => matrix[prof]?.[cat] > 0)
).length;

console.log(`\n📊 Database: ${data.length} scripts`);
console.log(`✅ Full coverage: ${covered}/11 categories`);

if (covered === 11) {
  console.log('\n🎉 100% CATEGORY COVERAGE ACHIEVED!\n');
  console.log('All 3 profiles now have at least 1 script in all 11 categories.');
  console.log('\nNext phase: Add more scripts to reach 4 per category (132 total).\n');
}
