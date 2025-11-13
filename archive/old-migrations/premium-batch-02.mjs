import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

const premiumScripts = [
  // ============================================
  // INTENSE #3 - Homework perfectionism
  // ============================================
  {
    title: "Erasing the same answer over and over",
    profile: 'INTENSE',
    category: 'Homework',
    situation_trigger: 'Child doing homework, erases same answer 3+ times, getting increasingly frustrated. The answer is correct but "doesn\'t look right" to them. Paper might have a hole in it from erasing.',

    phrase_1: "The answer is right, but it doesn't feel right.",
    phrase_1_action: "CONNECTION",

    phrase_2: "Your brain knows the answer, AND your hand won't make it look perfect enough.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Leave it messy or skip this one. But no more erasing - the paper is done. Pick.",
    phrase_3_action: "COMMAND",

    wrong_way: "STOP ERASING! It's fine! Your teacher doesn't care if it's messy! You're wasting time! Just move ON already!",

    neurological_tip: "INTENSE kids experience visceral discomfort when their output doesn't match their internal standard - it's not about the teacher's opinion, it's about their own. The erasing is trying to resolve the discomfort by 'fixing' it. The problem: their standard is unreachable, so they erase infinitely. Naming the disconnect ('right but doesn't feel right') validates the real experience. The boundary (paper is done) forces them to accept imperfection while giving them agency (leave it or skip it).",

    parent_state: ['calm', 'firm', 'empathetic'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
    age_min: 6,
    age_max: 12,
  },

  // ============================================
  // INTENSE #4 - Screen time comparison
  // ============================================
  {
    title: "Upset sibling got more screen time",
    profile: 'INTENSE',
    category: 'Screens',
    situation_trigger: 'Child notices sibling had screens longer, or got to play a different game, or "that\'s not fair" comparison. Genuine distress about inequality, not manipulation.',

    phrase_1: "It feels unfair. You're counting minutes.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You want everything exactly equal, AND different ages get different rules.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Use your time or spend it arguing - arguing time counts as screen time. Your call.",
    phrase_3_action: "COMMAND",

    wrong_way: "Life's not fair! Get over it! They're older/younger so they get different rules! Stop comparing and just be grateful for what YOU got!",

    neurological_tip: "INTENSE kids have hyperactive fairness monitoring - their brain constantly scans for inequality as a threat to their worth. The comparison isn't petty; it feels like evidence they're valued less. Acknowledging the counting ('you're counting minutes') validates the real behavior without agreeing. The boundary (different ages = different rules) is non-negotiable, but the consequence (arguing eats screen time) makes the cost of protest immediate and concrete.",

    parent_state: ['firm', 'calm', 'neutral'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 5,
    age_max: 11,
  },

  // ============================================
  // DISTRACTED #3 - Public meltdown
  // ============================================
  {
    title: "Melting down in middle of grocery store",
    profile: 'DISTRACTED',
    category: 'Tantrums',
    situation_trigger: 'In store/public place, child suddenly starts crying, dropping to floor, or tantrum. No obvious trigger - just sensory overload from lights, noise, people, time spent shopping.',

    phrase_1: "Too much. Your brain is full.",
    phrase_1_action: "CONNECTION",

    phrase_2: "Everything is loud and bright and too much, AND we need to get you out right now.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Cover your ears and close your eyes. I'm carrying you to the car. Go limp, I've got you.",
    phrase_3_action: "COMMAND",

    wrong_way: "Stop it! Everyone is staring! We're almost done! You were FINE five minutes ago! Stand up right NOW or no treats ever!",

    neurological_tip: "DISTRACTED kids hit sensory overload suddenly - their system doesn't gradually warn them, it just crashes. By the time you see the meltdown, they're already past the point of verbal reasoning. They aren't choosing this. Naming 'brain is full' gives them permission to shut down without shame. Immediate exit + sensory blocking (cover ears/close eyes) reduces input. Saying 'go limp, I've got you' tells them to stop trying to regulate and let you take over.",

    parent_state: ['protective', 'calm', 'urgent'],
    location_type: ['public', 'store'],
    emergency_suitable: true,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
    age_min: 2,
    age_max: 7,
  },

  // ============================================
  // DISTRACTED #4 - Hygiene avoidance
  // ============================================
  {
    title: "Resisting toothbrushing - sensory issue",
    profile: 'DISTRACTED',
    category: 'Hygiene',
    situation_trigger: 'Bedtime, child avoiding bathroom or running away when you mention teeth brushing. Not defiance - genuine aversion to the sensation of bristles, toothpaste taste, or the whole process.',

    phrase_1: "Brushing feels bad in your mouth.",
    phrase_1_action: "CONNECTION",

    phrase_2: "The bristles hurt or the taste is too strong, AND your teeth still need cleaning.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Pick: your toothbrush or mine, your toothpaste or just water. But two minutes happens.",
    phrase_3_action: "COMMAND",

    wrong_way: "You brush your teeth EVERY night! Stop being difficult! It takes 30 seconds! Everyone has to do this! Open your MOUTH!",

    neurological_tip: "DISTRACTED kids often have oral sensitivity - textures and tastes that others barely notice feel genuinely painful to them. The avoidance is sensory, not behavioral. Forcing makes it worse because their nervous system associates tooth brushing with threat. Naming the sensory experience ('feels bad in your mouth') validates it's real. Offering choices (different brush, different paste, or just water) reduces sensory assault while maintaining the non-negotiable outcome (two minutes of cleaning).",

    parent_state: ['calm', 'patient', 'firm'],
    location_type: ['home', 'bathroom'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 300,
    age_min: 3,
    age_max: 9,
  },

  // ============================================
  // DEFIANT #3 - Bedtime boundary test
  // ============================================
  {
    title: "Coming out of room after bedtime",
    profile: 'DEFIANT',
    category: 'Bedtime',
    situation_trigger: 'Bedtime happened, child is in bed. Five minutes later they come out with excuse: "I need water" "I forgot to tell you something" "I\'m not tired" - testing if bedtime is real.',

    phrase_1: "You want to decide when you sleep.",
    phrase_1_action: "CONNECTION",

    phrase_2: "Your body wants to stay up, AND bedtime already happened.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Back in bed now, or I take a book/stuffy. Count of three. One...",
    phrase_3_action: "COMMAND",

    wrong_way: "BED MEANS BED! I don't care if you're thirsty! You should have thought of that before! Get back in there RIGHT NOW or you're losing screen time tomorrow!",

    neurological_tip: "DEFIANT kids test bedtime boundaries every night because sleep feels like the ultimate loss of control - they have to surrender consciousness. Each excuse ('I need water') is testing if the boundary is negotiable. If you engage with the excuse, they learn bedtime is a starting position for bargaining. Naming their autonomy drive ('you want to decide') validates the feeling. The forced choice (bed now OR lose comfort item) makes the cost of testing immediate. Counting creates urgency. If you reach three, you MUST remove the item - inconsistency teaches them to ignore the count.",

    parent_state: ['firm', 'calm', 'authoritative'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60,
    age_min: 3,
    age_max: 9,
  },

  // ============================================
  // DEFIANT #4 - Emotional escalation
  // ============================================
  {
    title: "Yelling 'I hate you' during conflict",
    profile: 'DEFIANT',
    category: 'Emotional_Regulation',
    situation_trigger: 'You set a boundary or said no to something. Child escalates: yelling, saying "I hate you," "You\'re the worst parent," or similar. Testing if extreme words will make you cave.',

    phrase_1: "You're furious at me right now.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You want me to change my answer, AND I'm not changing it.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Scream into a pillow or punch your bed. But the answer stays no.",
    phrase_3_action: "COMMAND",

    wrong_way: "Don't you DARE talk to me that way! Apologize RIGHT NOW! I do everything for you and THIS is how you treat me?! Go to your ROOM!",

    neurological_tip: "DEFIANT kids escalate to extreme words when boundaries feel like threats to their autonomy. They're testing: if I say the worst thing possible, will you fold? Your reaction determines what they learn. If you engage with the emotional content ('how dare you'), they learn escalation gets attention. If you punish the words, they feel misunderstood. Naming the feeling ('you're furious at me') validates the emotion without changing the boundary. Offering physical discharge (pillow, bed) gives them a release valve. The key phrase: 'the answer stays no' - immovable, unemotional, final.",

    parent_state: ['calm', 'firm', 'grounded'],
    location_type: ['home', 'anywhere'],
    emergency_suitable: true,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 360,
    age_min: 4,
    age_max: 12,
  },
];

console.log('🌟 PREMIUM BATCH 02 - 6 High-Quality Scripts\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

for (const script of premiumScripts) {
  console.log(`📝 ${script.title}`);
  console.log(`   Profile: ${script.profile} | Category: ${script.category}`);
  console.log(`   Ages: ${script.age_min}-${script.age_max} | Speed: ${script.success_speed}`);

  const { error } = await supabase
    .from('scripts')
    .insert([script]);

  if (error) {
    console.error(`   ❌ Error: ${error.message}\n`);
  } else {
    console.log(`   ✅ Inserted successfully\n`);
  }
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✨ Batch complete!\n');

// Show distribution
const { data } = await supabase
  .from('scripts')
  .select('profile, category')
  .order('profile');

const matrix = {};
data.forEach(s => {
  if (!matrix[s.profile]) matrix[s.profile] = {};
  matrix[s.profile][s.category] = (matrix[s.profile][s.category] || 0) + 1;
});

console.log('Current distribution:\n');
['INTENSE', 'DISTRACTED', 'DEFIANT'].forEach(profile => {
  console.log(`${profile}:`);
  Object.entries(matrix[profile] || {})
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
  const total = Object.values(matrix[profile] || {}).reduce((a, b) => a + b, 0);
  console.log(`  TOTAL: ${total}\n`);
});

console.log(`📊 Total scripts in database: ${data.length}`);
