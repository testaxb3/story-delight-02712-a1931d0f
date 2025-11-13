import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

const premiumScripts = [
  // ============================================
  // INTENSE #5 - Mealtime texture issue
  // ============================================
  {
    title: "Food touching on plate causes shutdown",
    profile: 'INTENSE',
    category: 'Mealtime',
    situation_trigger: 'You serve dinner, foods are touching on the plate. Child sees it and refuses to eat - not being picky, but genuinely distressed by mixed foods/sauces touching.',

    phrase_1: "The foods are touching and it's wrong.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You need them separated, AND I already plated it.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Get a new plate and move them yourself, or eat it this way. Two minutes to pick.",
    phrase_3_action: "COMMAND",

    wrong_way: "They're not even touching! Food goes in your stomach mixed up anyway! Stop being so difficult! Everyone else is eating just fine!",

    neurological_tip: "INTENSE kids often have strong sensory boundaries around food - mixed textures or contaminated foods trigger genuine disgust, not preference. Their internal rules about food are rigid and violation feels wrong at a deep level. Fighting it triggers power struggle AND sensory distress. Naming the boundary ('foods are touching and it's wrong') validates their system. The choice (fix it yourself OR accept it) maintains your boundary (I'm not re-plating) while giving them agency. Time limit prevents infinite deliberation.",

    parent_state: ['calm', 'firm', 'neutral'],
    location_type: ['home', 'kitchen'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
    age_min: 4,
    age_max: 11,
  },

  // ============================================
  // INTENSE #6 - Emotional intensity
  // ============================================
  {
    title: "Inconsolable crying over minor disappointment",
    profile: 'INTENSE',
    category: 'Emotional_Regulation',
    situation_trigger: 'Small disappointment happens (snack you wanted is gone, show is over, friend can\'t play). Child response is HUGE: sobbing, inconsolable, "worst day ever" level grief.',

    phrase_1: "This feels huge to you right now.",
    phrase_1_action: "CONNECTION",

    phrase_2: "It's a small thing, AND your feelings are gigantic.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Cry it out for 5 minutes, or tell me the worst part in one sentence. You pick.",
    phrase_3_action: "COMMAND",

    wrong_way: "It's not a BIG DEAL! You're acting like someone died! It's just a snack/show/friend! You need to get control of yourself! STOP CRYING!",

    neurological_tip: "INTENSE kids have emotional amplification - their limbic system responds to disappointment with the same intensity others reserve for real loss. To them, it IS huge - their brain doesn't have a 'small disappointment' setting. Telling them it's not a big deal invalidates their actual experience. Naming the discrepancy ('small thing, gigantic feelings') acknowledges both truths. Offering structured release (timed crying OR verbalize) gives them a path through the emotion without suppressing it.",

    parent_state: ['empathetic', 'calm', 'patient'],
    location_type: ['home', 'anywhere'],
    emergency_suitable: true,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 420,
    age_min: 3,
    age_max: 10,
  },

  // ============================================
  // DISTRACTED #5 - Bedtime stalling
  // ============================================
  {
    title: "Can't settle - body is still awake",
    profile: 'DISTRACTED',
    category: 'Bedtime',
    situation_trigger: 'Bedtime routine done, child is in bed, but can\'t lie still - legs moving, rolling around, can\'t settle. Not refusing, just physically unable to calm down.',

    phrase_1: "Your body won't turn off yet.",
    phrase_1_action: "CONNECTION",

    phrase_2: "Your brain is tired, AND your muscles still want to move.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Squeeze your pillow 10 times or push your hands into the mattress hard. Pick one, then stillness.",
    phrase_3_action: "COMMAND",

    wrong_way: "STOP MOVING! You need to SLEEP! Lie still RIGHT NOW! Why can't you just settle down like a normal kid?!",

    neurological_tip: "DISTRACTED kids often have alerting nervous systems - even when cognitively tired, their proprioceptive system is still online and seeking input. They can't 'decide' to be still - their body won't comply. Yelling adds stress, which increases arousal. Naming the disconnect ('brain tired, muscles want to move') validates it's not defiance. Offering proprioceptive input (squeezing pillow, pushing into mattress) satisfies the system's need so it can settle. After discharge, stillness becomes possible.",

    parent_state: ['calm', 'patient', 'gentle'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 300,
    age_min: 3,
    age_max: 9,
  },

  // ============================================
  // DISTRACTED #6 - Screen transition
  // ============================================
  {
    title: "Can't remember what to do after screen time",
    profile: 'DISTRACTED',
    category: 'Screens',
    situation_trigger: 'Screen time ends. Child turns off device but then stands there, staring into space, lost. You\'ve told them what to do next but they forgot immediately.',

    phrase_1: "The screen turned off and your brain is blank.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You were just in the game, AND now you don't remember what's next.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Shoes or backpack. Just one thing. I'll tell you the next step after.",
    phrase_3_action: "COMMAND",

    wrong_way: "I JUST TOLD YOU what to do! Were you even listening?! Get your shoes on and get in the car! We do this EVERY DAY! MOVE!",

    neurological_tip: "DISTRACTED kids experience screen transition like waking from deep sleep - their brain was fully absorbed in the virtual environment, and switching back to physical reality takes time. Their working memory was holding game info; when that dumps, the real-world task list dumps too. It's not selective hearing - it's genuine blankness. Naming it ('brain is blank') validates the experience. Reducing to ONE concrete step ('shoes') reloads their executive function. After completing one task, their brain can load the next.",

    parent_state: ['calm', 'patient', 'matter-of-fact'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 4,
    age_max: 11,
  },

  // ============================================
  // DEFIANT #5 - Tantrum as power play
  // ============================================
  {
    title: "Tantrum when told no - testing your resolve",
    profile: 'DEFIANT',
    category: 'Tantrums',
    situation_trigger: 'You said no to something (candy, toy, staying longer, etc). Child immediately escalates to tantrum: screaming, throwing self down, kicking. Testing if no becomes yes.',

    phrase_1: "You're trying to make me change my answer.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You want the tantrum to work, AND the answer is still no.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Tantrum here or in your room. But the answer doesn't change. You pick the location.",
    phrase_3_action: "COMMAND",

    wrong_way: "STOP IT! You're embarrassing me! Everyone is watching! FINE, you can have it! But this is the LAST TIME I'm taking you anywhere!",

    neurological_tip: "DEFIANT kids use tantrums as negotiation tools - they've learned that big emotions sometimes flip no to yes. Every time tantrum works, their brain reinforces: escalation = getting what I want. The key is immovability. Naming their strategy ('trying to make me change my answer') shows you see the pattern. The phrase 'the answer is still no' must be unshakeable - if you cave, you teach them to tantrum harder next time. Offering location control (here or room) gives them choice without giving them the outcome. If public, you must be willing to tolerate stares - other people's judgment is less important than teaching this boundary.",

    parent_state: ['firm', 'calm', 'grounded'],
    location_type: ['public', 'home', 'anywhere'],
    emergency_suitable: true,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 360,
    age_min: 2,
    age_max: 8,
  },

  // ============================================
  // DEFIANT #6 - Homework refusal
  // ============================================
  {
    title: "Refusing to start homework - control battle",
    profile: 'DEFIANT',
    category: 'Homework',
    situation_trigger: 'Homework time. Child says "I\'m not doing it," "I don\'t want to," or just sits there staring at you. This is about not being told what to do, not about the homework difficulty.',

    phrase_1: "You don't want someone deciding your time.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You want to choose what you do right now, AND homework has to happen before bed.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Do it now or do it later, but bedtime doesn't move. If it's not done, you wake up early. Your call.",
    phrase_3_action: "COMMAND",

    wrong_way: "You WILL do your homework! I don't care if you don't want to! It's YOUR responsibility! Sit down RIGHT NOW or you're losing everything!",

    neurological_tip: "DEFIANT kids resist homework because being told 'do it now' triggers their autonomy alarm. It's not about the work - it's about control over their time and body. Fighting about starting creates a power struggle where homework becomes the symbol of submission. Naming their drive ('don't want someone deciding your time') validates the real feeling. The boundary (homework happens before bed) is immovable, but WHEN is their choice. The natural consequence (wake early if not done) makes the cost of delay concrete without you being the enforcer. Most will do it when the power struggle is removed.",

    parent_state: ['calm', 'firm', 'neutral'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
    age_min: 6,
    age_max: 13,
  },
];

console.log('🌟 PREMIUM BATCH 03 - 6 High-Quality Scripts\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

for (const script of premiumScripts) {
  console.log(`📝 ${script.title}`);
  console.log(`   ${script.profile} / ${script.category} | ${script.age_min}-${script.age_max} yrs`);

  const { error } = await supabase
    .from('scripts')
    .insert([script]);

  if (error) {
    console.error(`   ❌ ${error.message}\n`);
  } else {
    console.log(`   ✅ Success\n`);
  }
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const { data } = await supabase.from('scripts').select('profile, category');
const matrix = {};
data.forEach(s => {
  if (!matrix[s.profile]) matrix[s.profile] = {};
  matrix[s.profile][s.category] = (matrix[s.profile][s.category] || 0) + 1;
});

console.log('\n📊 Current Coverage:\n');
['INTENSE', 'DISTRACTED', 'DEFIANT'].forEach(profile => {
  const total = Object.values(matrix[profile] || {}).reduce((a, b) => a + b, 0);
  console.log(`${profile}: ${total} scripts`);
});

console.log(`\nTotal: ${data.length} scripts\n`);
