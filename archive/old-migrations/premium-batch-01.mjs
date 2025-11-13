import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

// BATCH 01 - PREMIUM QUALITY SCRIPTS
// 6 scripts total (2 per profile)
// Focus: Real situations, specific insights, tested NEP phrases

const premiumScripts = [
  // ============================================
  // INTENSE #1 - Bedtime rumination
  // ============================================
  {
    title: "Can't sleep - replaying something from today",
    profile: 'INTENSE',
    category: 'Bedtime',
    situation_trigger: 'Child lying in bed, clearly awake, ruminating about something that happened today (fight with friend, mistake at school, criticism from teacher). Not asking for help, just stewing in it.',

    phrase_1: "Your brain won't let go of today.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You keep replaying what happened, AND your body needs rest to handle tomorrow better.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Tell me the one sentence version, or write it down and close the notebook. You pick, two minutes.",
    phrase_3_action: "COMMAND",

    wrong_way: "Stop thinking about it! It's over! There's nothing you can do now! Just close your eyes and sleep!",

    neurological_tip: "INTENSE kids' brains replay events on a loop, especially anything tied to performance or relationships. It's not a choice - their brain literally won't stop reviewing. Externalizing the thought (speaking it or writing it) breaks the loop because it moves from endless internal replay to one concrete statement. Once it's out, the brain can finally let go.",

    parent_state: ['calm', 'patient', 'empathetic'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 480,
    age_min: 5,
    age_max: 12,
  },

  // ============================================
  // INTENSE #2 - Creative destruction
  // ============================================
  {
    title: "Destroying own art/build because it's not perfect",
    profile: 'INTENSE',
    category: 'Tantrums',
    situation_trigger: 'Child has been working on drawing, Lego build, craft project. Suddenly starts ripping/smashing it because "it looks wrong" or "it\'s not how I wanted it." Genuine distress, not manipulation.',

    phrase_1: "The picture in your head doesn't match what you made.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You can see exactly how it should look, AND your hands couldn't make it happen.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Rip it or save it broken. But destroying ends the project - no restart today. Count of three.",
    phrase_3_action: "COMMAND",

    wrong_way: "Stop it! It looks great! You're being ridiculous! Do you know how long you worked on that?! Why are you breaking your own stuff?!",

    neurological_tip: "INTENSE kids see the 'perfect version' in their mind with unusual clarity. When their hands can't create what they visualize, it feels like genuine failure - not 'close enough,' but wrong. Destroying it erases the evidence. Naming what they see in their head ('the picture in your head') validates that the vision was real. The boundary (no restart today) stops this from becoming a reset pattern while giving them control over what happens to the imperfect version.",

    parent_state: ['calm', 'firm', 'empathetic'],
    location_type: ['home', 'anywhere'],
    emergency_suitable: true,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 360,
    age_min: 4,
    age_max: 10,
  },

  // ============================================
  // DISTRACTED #1 - Morning freeze
  // ============================================
  {
    title: "Frozen mid-task getting dressed",
    profile: 'DISTRACTED',
    category: 'Morning_Routines',
    situation_trigger: 'Child is standing still, holding a shirt or shoe, staring into space. Not refusing, not playing - genuinely stuck. You\'ve already told them what to do, but they haven\'t moved.',

    phrase_1: "You forgot what comes next.",
    phrase_1_action: "CONNECTION",

    phrase_2: "Your brain started the list, AND somewhere it got erased.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Shirt on or shoes on. Just one. I'll tell you the next step after.",
    phrase_3_action: "COMMAND",

    wrong_way: "HELLO?! Earth to [child]! What are you DOING?! I just told you to get dressed! We do this EVERY morning! Move!",

    neurological_tip: "DISTRACTED kids can hold 'get dressed' as a concept, but their working memory can't maintain the sequence (underwear → pants → shirt → shoes). When the mental list drops, they freeze - it's not defiance, it's genuine 'what was I doing?' blankness. Yelling adds more to process, making it worse. Reducing it to ONE step ('shirt on') reloads their memory. After one step completes, their brain can load the next.",

    parent_state: ['calm', 'neutral', 'matter-of-fact'],
    location_type: ['home', 'bedroom', 'bathroom'],
    emergency_suitable: true,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 3,
    age_max: 8,
  },

  // ============================================
  // DISTRACTED #2 - Body-first emotion
  // ============================================
  {
    title: "Crying but can't explain why",
    profile: 'DISTRACTED',
    category: 'Emotional_Regulation',
    situation_trigger: 'Child is crying, clearly upset, but when you ask what\'s wrong they say "I don\'t know" - and they genuinely don\'t. No obvious trigger, just sudden emotional flood.',

    phrase_1: "Your body is crying before your brain knows why.",
    phrase_1_action: "CONNECTION",

    phrase_2: "Something feels wrong inside, AND the words haven't shown up yet.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Squeeze my hands hard, or go jump on your bed. Move first, words maybe later.",
    phrase_3_action: "COMMAND",

    wrong_way: "Why are you crying?! What happened?! Use your words! I can't help you if you won't tell me what's wrong! Stop crying and TALK to me!",

    neurological_tip: "DISTRACTED kids often feel emotions in their body before their brain knows why. Their nervous system reacts to overwhelm (noise, hunger, temperature, too much input) before they can identify what's wrong. The tears are real - the 'why' is still processing. Demanding words adds more to process when they're already overloaded. Physical movement (squeezing hands, jumping) helps their nervous system settle so their thinking brain can come back online and maybe find the reason.",

    parent_state: ['calm', 'gentle', 'patient'],
    location_type: ['home', 'anywhere'],
    emergency_suitable: true,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 180,
    age_min: 3,
    age_max: 9,
  },

  // ============================================
  // DEFIANT #1 - Food autonomy test
  // ============================================
  {
    title: "Refusing dinner as control test",
    profile: 'DEFIANT',
    category: 'Mealtime',
    situation_trigger: 'You made dinner. Child takes one look and says "I\'m not eating that" or "I don\'t like it" - even if it\'s something they\'ve eaten before. This is about power, not taste.',

    phrase_1: "You don't want to be told what to eat.",
    phrase_1_action: "CONNECTION",

    phrase_2: "Your body belongs to you, AND this is dinner until breakfast.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Eat it, don't eat it. Kitchen closes in 20 minutes. Your call.",
    phrase_3_action: "COMMAND",

    wrong_way: "Yes you ARE eating it! I didn't cook for an hour so you could waste it! You WILL sit here until you eat! Open your mouth!",

    neurological_tip: "DEFIANT kids are constantly scanning for 'who controls my body?' Food is the ultimate control battleground because it literally goes inside them. Forcing them to eat triggers threat response and entrenches refusal. Naming their autonomy need ('your body belongs to you') validates the real drive. The boundary (this is dinner, kitchen closes) is non-negotiable, but the choice (eat it or don't) gives them control over their body. Most will eat once the power struggle is removed.",

    parent_state: ['calm', 'firm', 'neutral'],
    location_type: ['home', 'kitchen'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 3,
    age_max: 10,
  },

  // ============================================
  // DEFIANT #2 - Screen time boundary test
  // ============================================
  {
    title: "Negotiating after screen time ends",
    profile: 'DEFIANT',
    category: 'Screens',
    situation_trigger: 'Timer goes off for screen time. Child immediately starts bargaining: "Just 5 more minutes!" "I\'m almost done with this level!" "That\'s not fair, I just started!" Testing if the boundary is real.',

    phrase_1: "You want to decide when you're done.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You want control over your time, AND the timer already decided.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Hand it to me, or I take it and you lose tomorrow. Count of three. One...",
    phrase_3_action: "COMMAND",

    wrong_way: "I SAID TIME'S UP! No means NO! Give me that iPad RIGHT NOW or you're losing it for a WEEK! I'm so sick of this fight every single day!",

    neurological_tip: "DEFIANT kids test every boundary to see if it's real or negotiable. Every time negotiation works ('okay, 5 more minutes'), their brain learns that rules are just starting positions for bargaining. The boundary must be immovable. Naming their autonomy need ('you want to decide') validates the feeling without changing the outcome. The forced choice (hand it over OR I take it + lose tomorrow) puts control in their hands while maintaining your authority. Counting creates urgency without emotion. If you reach three, you MUST follow through - hesitation teaches them the count doesn't matter.",

    parent_state: ['firm', 'calm', 'authoritative'],
    location_type: ['home', 'anywhere'],
    emergency_suitable: true,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60,
    age_min: 4,
    age_max: 12,
  },
];

console.log('🌟 PREMIUM BATCH 01 - 6 High-Quality Scripts\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

for (const script of premiumScripts) {
  console.log(`📝 ${script.title}`);
  console.log(`   Profile: ${script.profile} | Category: ${script.category}`);
  console.log(`   Ages: ${script.age_range_min}-${script.age_range_max} | Speed: ${script.success_speed}`);

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
console.log('✨ Batch complete! Ready for quality review.\n');

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
  console.log('');
});

console.log(`\n📊 Total scripts in database: ${data.length}`);
