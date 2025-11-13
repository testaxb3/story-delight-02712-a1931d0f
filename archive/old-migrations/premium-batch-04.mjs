import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

const premiumScripts = [
  // ============================================
  // INTENSE #7 - Morning routines
  // ============================================
  {
    title: "Outfit doesn't feel right - changing repeatedly",
    profile: 'INTENSE',
    category: 'Morning_Routines',
    situation_trigger: 'Morning rush, child has changed outfits 3+ times. Each time: "This doesn\'t feel right" or "It\'s too tight/itchy/wrong." Genuinely distressed, not playing.',

    phrase_1: "Nothing feels right on your body today.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You want it to feel perfect, AND we leave in 5 minutes.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Wear what you have on or go in pajamas. Count of 10. Ten, nine...",
    phrase_3_action: "COMMAND",

    wrong_way: "You JUST put that on! It's FINE! Stop being so picky! Everyone else is ready! We're going to be late because of YOU!",

    neurological_tip: "INTENSE kids have heightened sensory awareness - tags, seams, tightness that others tolerate feel genuinely painful to them. The re-changing isn't vanity; it's trying to escape physical discomfort. But the perfectionism loop can be infinite. Naming the feeling ('nothing feels right on your body') validates the real sensory distress. The boundary (5 minutes) and forced choice (current outfit OR pajamas) stops the loop. Counting down creates urgency. Pajamas consequence is real - follow through if needed.",

    parent_state: ['firm', 'calm', 'empathetic'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
    age_min: 4,
    age_max: 10,
  },

  // ============================================
  // INTENSE #8 - Hygiene
  // ============================================
  {
    title: "Washing hands too long - contamination fear",
    profile: 'INTENSE',
    category: 'Hygiene',
    situation_trigger: 'Child washing hands for 2+ minutes, scrubbing hard, or re-washing because "they\'re not clean yet." Genuinely anxious about germs/dirt.',

    phrase_1: "Your hands still don't feel clean.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You want them perfectly clean, AND the skin is getting raw.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Ten more seconds then water off. I'm counting. One, two...",
    phrase_3_action: "COMMAND",

    wrong_way: "THEY'RE CLEAN! Stop wasting water! You've been washing for five minutes! Your hands are going to bleed! TURN IT OFF!",

    neurological_tip: "INTENSE kids can develop contamination anxiety where 'clean' is an unreachable standard - their brain keeps sending 'not safe yet' signals. The washing becomes compulsive to resolve the anxiety, but it never resolves because the standard is internal and absolute. Fighting it increases anxiety. Naming the feeling ('still don't feel clean') validates the experience. The boundary (10 seconds then off) interrupts the compulsion with external control. Counting out loud helps them surrender control to you. If this pattern persists daily, consider professional assessment for OCD tendencies.",

    parent_state: ['calm', 'firm', 'gentle'],
    location_type: ['home', 'bathroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 5,
    age_max: 12,
  },

  // ============================================
  // DISTRACTED #7 - Mealtime
  // ============================================
  {
    title: "Forgets to eat - food gets cold",
    profile: 'DISTRACTED',
    category: 'Mealtime',
    situation_trigger: 'Dinner table, child takes one bite then stares into space or starts talking/playing. Food sits there getting cold. Not refusing, just literally forgetting to eat.',

    phrase_1: "Your brain left the table.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You started eating, AND then you forgot you're eating.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Three more bites right now, or dinner is done. I'm watching. One...",
    phrase_3_action: "COMMAND",

    wrong_way: "EAT! Stop talking! Stop staring! The food is right in front of you! Why can't you just EAT like a normal person?!",

    neurological_tip: "DISTRACTED kids have attention that drifts away from repetitive tasks - eating becomes background, and their mind moves to something more stimulating. They aren't refusing food; they genuinely forget they're mid-meal. Their internal hunger cues are weak, so external reminders are needed. Naming it ('brain left the table') shows you see what's happening. The forced focus (three bites NOW, I'm watching) brings attention back. Counting creates structure. If persistent, consider eating with fewer distractions (TV off, phone away, simpler environment).",

    parent_state: ['calm', 'firm', 'neutral'],
    location_type: ['home', 'kitchen'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 3,
    age_max: 10,
  },

  // ============================================
  // DISTRACTED #8 - Social
  // ============================================
  {
    title: "Interrupting constantly - can't hold thought",
    profile: 'DISTRACTED',
    category: 'Social',
    situation_trigger: 'You\'re talking to someone else. Child interrupts repeatedly: "Mom! Mom! MOM!" Can\'t wait, getting increasingly loud/desperate. Seems urgent but it\'s "Can I have a snack?"',

    phrase_1: "The thought feels like it's going to disappear.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You're scared you'll forget if you don't say it right now, AND I'm talking to someone.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Put your hand on my arm and wait, or go write it down. Pick one, then quiet.",
    phrase_3_action: "COMMAND",

    wrong_way: "STOP INTERRUPTING! I'm TALKING! It's RUDE! You need to WAIT YOUR TURN! Say excuse me like a normal child!",

    neurological_tip: "DISTRACTED kids have weak working memory - when a thought arrives, it feels urgent because they know it will vanish if they don't say it immediately. It's not rudeness; it's genuine fear of losing the thought. The escalating volume is desperation as the thought starts to slip. Teaching 'say excuse me' doesn't work because by the time they remember the rule, the thought is gone. Naming the fear ('thought feels like it's going to disappear') validates the real experience. Offering physical anchor (hand on arm) or external storage (write it down) gives them a way to hold the thought without interrupting.",

    parent_state: ['calm', 'patient', 'firm'],
    location_type: ['home', 'public', 'anywhere'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 180,
    age_min: 4,
    age_max: 10,
  },

  // ============================================
  // DEFIANT #7 - Hygiene
  // ============================================
  {
    title: "Refusing shower - autonomy battle",
    profile: 'DEFIANT',
    category: 'Hygiene',
    situation_trigger: 'You say "time for a shower." Child says "no" or "I don\'t need one" or just ignores you. Not about disliking showers - about not being told when to shower.',

    phrase_1: "You don't want me deciding when you shower.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You want control over your body, AND you need to shower before bed.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Shower now or shower in the morning, but you're waking 20 minutes earlier. Your call.",
    phrase_3_action: "COMMAND",

    wrong_way: "You SMELL! You NEED a shower! I don't care what you want! Get in the bathroom RIGHT NOW or you're losing screen time!",

    neurological_tip: "DEFIANT kids resist hygiene directives because 'you need to shower' feels like authority over their body. It's not about cleanliness - it's about who decides. Forcing creates power struggle where showering becomes submission. Naming their autonomy need ('don't want me deciding') validates the real drive. The choice (now OR morning but early wake) gives them control while maintaining the non-negotiable (showering happens). Most will choose now to avoid early wake. If they choose morning, you MUST enforce the early wake or the choice becomes meaningless.",

    parent_state: ['calm', 'firm', 'neutral'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 6,
    age_max: 14,
  },

  // ============================================
  // DEFIANT #8 - Morning routines
  // ============================================
  {
    title: "Resisting getting in the car - delaying",
    profile: 'DEFIANT',
    category: 'Morning_Routines',
    situation_trigger: 'Time to leave. Child is ready but won\'t get in the car. Stalling: tying shoes again, "forgot something," moving slow. Testing if departure time is negotiable.',

    phrase_1: "You're trying to control when we leave.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You want more time, AND the car leaves in 30 seconds.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Get in now or I carry you in. Count of three. One, two...",
    phrase_3_action: "COMMAND",

    wrong_way: "WE'RE LATE! Get in the CAR! NOW! I don't care that you forgot something! You should have thought of that earlier! MOVE!",

    neurological_tip: "DEFIANT kids stall at transitions because being rushed feels like losing control. The delay is testing: can I change the timeline? Every time stalling works (you wait/negotiate), they learn timelines are flexible. The key is immovability. Naming their strategy ('trying to control when we leave') shows you see the pattern. The phrase 'car leaves in 30 seconds' makes it non-negotiable. The forced choice (walk in OR get carried) puts outcome in their control. If you reach three, you MUST carry them - hesitation teaches them the count is bluffable. Do this once with follow-through, the pattern usually stops.",

    parent_state: ['firm', 'calm', 'authoritative'],
    location_type: ['home', 'driveway'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60,
    age_min: 3,
    age_max: 9,
  },
];

console.log('🌟 BATCH 04 - 6 Premium Scripts\n');

for (const script of premiumScripts) {
  console.log(`📝 ${script.title}`);
  console.log(`   ${script.profile} / ${script.category}`);

  const { error } = await supabase.from('scripts').insert([script]);

  if (error) {
    console.error(`   ❌ ${error.message}\n`);
  } else {
    console.log(`   ✅\n`);
  }
}

const { data } = await supabase.from('scripts').select('profile');
const counts = {};
data.forEach(s => counts[s.profile] = (counts[s.profile] || 0) + 1);

console.log('\n📊 Progress:');
Object.entries(counts).forEach(([p, c]) => console.log(`${p}: ${c}`));
console.log(`Total: ${data.length}\n`);
