import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

const premiumScripts = [
  // INTENSE - Transitions
  {
    title: "Meltdown when activity ends - emotional whiplash",
    profile: 'INTENSE',
    category: 'Transitions',
    situation_trigger: 'Fun activity ends (playdate, park, screen time). Child goes from happy to full meltdown in seconds: crying, anger, "I don\'t want to leave!" Genuine grief, not manipulation.',

    phrase_1: "Going from fun to over feels impossible.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You were happy 10 seconds ago, AND now you have to stop.",
    phrase_2_action: "VALIDATION",

    phrase_3: "One goodbye or I carry you out. Count of five. Five, four...",
    phrase_3_action: "COMMAND",

    wrong_way: "You were JUST having fun! Why are you RUINING it by crying?! We'll come back another time! Stop being so dramatic!",

    neurological_tip: "INTENSE kids experience emotional whiplash at transitions - they don't gradually wind down from high to neutral, they crash from peak joy to grief in seconds. The intensity of the fun makes the ending feel like loss. Their nervous system can't modulate; it's all or nothing. Yelling at the crash punishes their emotional intensity. Naming the whiplash ('fun to over feels impossible') validates the jarring experience. The forced choice (one goodbye OR carry out) maintains the boundary while giving them agency. Count creates structure when their emotions are dysregulated.",

    parent_state: ['calm', 'firm', 'empathetic'],
    location_type: ['public', 'anywhere'],
    emergency_suitable: true,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
    age_min: 3,
    age_max: 9,
  },

  // DEFIANT - Transitions
  {
    title: "Refusing to leave friend's house",
    profile: 'DEFIANT',
    category: 'Transitions',
    situation_trigger: 'At friend\'s house or playdate. Time to go. Child says "No, I\'m not leaving" or "Five more minutes" or just ignores you. Testing if departure time is negotiable.',

    phrase_1: "You don't want someone else ending your fun.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You want to decide when to leave, AND it's time to go now.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Walk to the car or I carry you. Count of three. One, two...",
    phrase_3_action: "COMMAND",

    wrong_way: "We're LEAVING! I don't care if you don't want to! Say thank you and get in the CAR! You're embarrassing me! We'll NEVER come back if you act like this!",

    neurological_tip: "DEFIANT kids resist transitions because leaving = someone else controlling their experience. Being told 'time to go' triggers autonomy alarm. Every time negotiation works ('okay, 5 more minutes'), they learn departure time is bargainable. The key is immovability. Naming their drive ('don't want someone else ending your fun') validates the autonomy need. The phrase 'time to go now' is non-negotiable. Forced choice (walk OR carry) puts method in their control. If you reach three, you MUST carry them out - hesitation teaches them the count is meaningless. Do this once with follow-through, pattern usually stops.",

    parent_state: ['firm', 'calm', 'authoritative'],
    location_type: ['public', 'friend-house'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 3,
    age_max: 10,
  },

  // INTENSE - Extra Transitions
  {
    title: "Panicking about upcoming change",
    profile: 'INTENSE',
    category: 'Transitions',
    situation_trigger: 'Something is changing tomorrow or soon (new teacher, moving, starting camp, family trip). Child is spiraling with anxiety, asking repetitive questions, catastrophizing.',

    phrase_1: "The unknown feels dangerous to your brain.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You want to know exactly what will happen, AND we can't know everything ahead.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Ask me 3 questions and I'll answer what I know, or write down your worries. Pick one.",
    phrase_3_action: "COMMAND",

    wrong_way: "Stop worrying about it! It'll be FINE! You always do this! You're going to make yourself sick! Just wait and see!",

    neurological_tip: "INTENSE kids experience anticipatory anxiety as genuine threat - their brain treats uncertainty as danger. The unknown activates fear response because they can't prepare. Repetitive questions are attempts to map the territory and feel in control. Shutting down questions increases anxiety. Naming it ('unknown feels dangerous to your brain') validates their system. Limiting questions (3 specific ones) gives structure while preventing spiral. Offering externalization (write worries) provides outlet. Answer honestly - false reassurance ('it'll be fine') breaks trust.",

    parent_state: ['calm', 'patient', 'honest'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 420,
    age_min: 5,
    age_max: 12,
  },

  // DISTRACTED - Extra Transitions
  {
    title: "Lost during transition - forgot where we're going",
    profile: 'DISTRACTED',
    category: 'Transitions',
    situation_trigger: 'In the car or walking somewhere. Child asks "Where are we going?" - you just told them 2 minutes ago. Genuinely forgot, not testing you.',

    phrase_1: "You already forgot where we're going.",
    phrase_1_action: "CONNECTION",

    phrase_2: "I just told you, AND it didn't stick.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Dentist. Say it back to me three times right now.",
    phrase_3_action: "COMMAND",

    wrong_way: "I JUST TOLD YOU! Were you even LISTENING?! How can you forget in 2 MINUTES?! You need to pay ATTENTION!",

    neurological_tip: "DISTRACTED kids have working memory deficits - information you just said can genuinely vanish within minutes, especially during transitions when their attention is split. It's not selective memory or disrespect; the encoding never happened. Yelling doesn't fix the neurology. Naming it ('already forgot') states fact without judgment. Acknowledging it didn't stick validates the experience. Repetition technique (say it back 3 times) forces encoding through active rehearsal instead of passive hearing. Some kids need this every transition - it's accommodation, not punishment.",

    parent_state: ['calm', 'patient', 'matter-of-fact'],
    location_type: ['car', 'anywhere'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60,
    age_min: 4,
    age_max: 10,
  },

  // DEFIANT - Extra Transitions
  {
    title: "Dragging feet - slow motion rebellion",
    profile: 'DEFIANT',
    category: 'Transitions',
    situation_trigger: 'Time to transition (get ready for school, leave house, start homework). Child moves in slow motion: taking forever to put on shoes, walking like a sloth, deliberate slowness. Testing your patience.',

    phrase_1: "You're going slow to see what I'll do.",
    phrase_1_action: "CONNECTION",

    phrase_2: "Moving slow feels like having control, AND we leave at 8:15 no matter what.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Ready by 8:15 with breakfast, or ready by 8:15 without. Your speed, your consequence.",
    phrase_3_action: "COMMAND",

    wrong_way: "HURRY UP! Why are you so SLOW?! MOVE FASTER! You're doing this on PURPOSE! I'm so sick of this every morning!",

    neurological_tip: "DEFIANT kids use slow motion as passive resistance - if they can't control the transition, they control the speed. It's autonomy assertion without direct refusal. Yelling gives them the reaction they're testing for and creates the fight they wanted. Naming their strategy ('going slow to see what I'll do') shows you see the pattern without engaging. The key: time-based boundary, not task-based. 'We leave at 8:15' is immovable regardless of their readiness. Natural consequence (hungry if not ready) is theirs to control. Most will speed up when slow motion stops working as control tool.",

    parent_state: ['calm', 'firm', 'neutral'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 4,
    age_max: 11,
  },

  // DISTRACTED - Extra Social
  {
    title: "Losing track during conversation",
    profile: 'DISTRACTED',
    category: 'Social',
    situation_trigger: 'Having conversation with child. Mid-sentence, they trail off or change subject completely. Lost train of thought, staring into space. Not being rude, genuinely lost.',

    phrase_1: "The thought disappeared mid-sentence.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You were telling me something, AND now you can't remember what.",
    phrase_2_action: "VALIDATION",

    phrase_3: "I'll tell you what you said so far, or we move on. You pick.",
    phrase_3_action: "COMMAND",

    wrong_way: "HELLO? Where did you GO? Finish your sentence! Why can't you just finish ONE thought?! You're not even trying!",

    neurological_tip: "DISTRACTED kids lose train of thought mid-sentence because working memory drops the thread - by the time they get to word 7, words 1-3 are gone. It's not disinterest; the mental list literally erased. Demanding they remember adds pressure without solving the memory issue. Naming it ('thought disappeared') externalizes the problem. Offering to replay ('I'll tell you what you said') re-loads their memory. Giving option to move on respects that sometimes the thought is truly gone. This pattern is normal for them - accommodation, not correction.",

    parent_state: ['patient', 'calm', 'understanding'],
    location_type: ['anywhere'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60,
    age_min: 5,
    age_max: 12,
  },
];

console.log('🌟 BATCH 06 - Transitions + Extras\n');

for (const script of premiumScripts) {
  console.log(`📝 ${script.profile}/${script.category}: ${script.title}`);
  const { error } = await supabase.from('scripts').insert([script]);
  console.log(error ? `   ❌ ${error.message}` : `   ✅`);
}

const { data } = await supabase.from('scripts').select('profile, category');

// Build comprehensive matrix
const matrix = {};
data.forEach(s => {
  if (!matrix[s.profile]) matrix[s.profile] = {};
  if (!matrix[s.profile][s.category]) matrix[s.profile][s.category] = 0;
  matrix[s.profile][s.category]++;
});

console.log('\n📊 COMPLETE CATEGORY COVERAGE:\n');

const allCategories = ['Bedtime', 'Emotional_Regulation', 'Homework', 'Hygiene', 'Mealtime', 'Morning_Routines', 'Problem_Solving', 'Screens', 'Social', 'Tantrums', 'Transitions'];

['INTENSE', 'DISTRACTED', 'DEFIANT'].forEach(profile => {
  console.log(`${profile}:`);
  allCategories.forEach(cat => {
    const count = matrix[profile]?.[cat] || 0;
    const status = count > 0 ? '✅' : '❌';
    console.log(`  ${status} ${cat}: ${count}`);
  });
  const total = Object.values(matrix[profile] || {}).reduce((a, b) => a + b, 0);
  console.log(`  TOTAL: ${total}\n`);
});

const grandTotal = data.length;
const covered = allCategories.filter(cat =>
  ['INTENSE', 'DISTRACTED', 'DEFIANT'].every(prof => matrix[prof]?.[cat] > 0)
).length;

console.log(`📊 Database: ${grandTotal} scripts`);
console.log(`✅ Categories with full coverage: ${covered}/11\n`);
