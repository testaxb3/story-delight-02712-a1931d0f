import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

const premiumScripts = [
  // INTENSE #9 - Social
  {
    title: "Excluded from friend group - devastated",
    profile: 'INTENSE',
    category: 'Social',
    situation_trigger: 'Child comes home from school devastated. Friends played without them, didn\'t pick them for team, or said "you can\'t play with us." Genuine grief, not manipulation.',

    phrase_1: "Being left out feels like your world is ending.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You want to be chosen every time, AND sometimes you won't be.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Cry it out for 10 minutes or tell me the exact words they said. You pick.",
    phrase_3_action: "COMMAND",

    wrong_way: "They're not your real friends then! You'll make new friends! It's not that big of a deal! You're being too sensitive! Get over it!",

    neurological_tip: "INTENSE kids experience social rejection as physical pain - their brain processes it the same way as actual injury. It's not dramatics; fMRI studies show real pain center activation. Minimizing ('not a big deal') invalidates genuine suffering. Naming the intensity ('world is ending') validates their experience without agreeing it's permanent. The validation phrase acknowledges the want (chosen every time) while introducing reality (sometimes you won't be). Offering structured release (cry OR verbalize) gives them a path through grief without suppressing it.",

    parent_state: ['empathetic', 'calm', 'present'],
    location_type: ['home'],
    emergency_suitable: true,
    success_speed: 'Long (10+ min)',
    expected_time_seconds: 720,
    age_min: 5,
    age_max: 13,
  },

  // INTENSE #10 - Problem Solving
  {
    title: "Can't solve problem - shutting down",
    profile: 'INTENSE',
    category: 'Problem_Solving',
    situation_trigger: 'Working on puzzle, Lego instructions, or problem. Tried once or twice, it didn\'t work, now sitting there frozen or starting to cry. Giving up because "I can\'t do it."',

    phrase_1: "It didn't work the first time and now you're done.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You expected to get it right away, AND hard things take tries.",
    phrase_2_action: "VALIDATION",

    phrase_3: "One more try with me watching, or put it away for today. Count of 10.",
    phrase_3_action: "COMMAND",

    wrong_way: "You barely TRIED! Don't give up so easily! You're being a quitter! Just TRY AGAIN! It's not that hard!",

    neurological_tip: "INTENSE kids interpret initial failure as evidence of inadequacy. Their self-worth is tied to performance, so 'not getting it right away' feels like being fundamentally incapable. The shutdown is protective - if I stop trying, I stop failing. Pushing ('just try again') triggers shame spiral. Naming the pattern ('didn't work first time, now you're done') shows you see it without judgment. Acknowledging their expectation ('expected to get it right away') validates the disappointment. One more try WITH support reduces shame. Allowing 'put it away' honors genuine overwhelm.",

    parent_state: ['calm', 'patient', 'encouraging'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 360,
    age_min: 4,
    age_max: 11,
  },

  // DISTRACTED #9 - Problem Solving
  {
    title: "Losing pieces while building - frustration spiral",
    profile: 'DISTRACTED',
    category: 'Problem_Solving',
    situation_trigger: 'Working on Lego, craft, or project. Pieces keep disappearing (fell on floor, mixed with other stuff). Getting increasingly frustrated, blaming everyone, starting to quit.',

    phrase_1: "The pieces keep disappearing and it's making you crazy.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You want everything to stay where you put it, AND your brain doesn't track small things.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Work on a tray or work on the table. Pick one, then we look for what's lost.",
    phrase_3_action: "COMMAND",

    wrong_way: "STOP LOSING THINGS! Pay ATTENTION to where you put stuff! This is YOUR fault! Clean up your mess and maybe you'll find them!",

    neurological_tip: "DISTRACTED kids have weak object permanence for small items - if it's not in direct visual field, it literally doesn't exist to their brain. They put a piece down, look away for 2 seconds, and can't find it again. The frustration is real - their brain isn't tracking. Blaming increases shame without fixing the problem. Naming it ('brain doesn't track small things') externalizes the struggle. The solution (tray OR table) is environmental support, not willpower. Helping them look after choosing structure teaches: accommodate your brain, don't fight it.",

    parent_state: ['calm', 'helpful', 'patient'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 180,
    age_min: 4,
    age_max: 10,
  },

  // DISTRACTED #10 - Transitions
  {
    title: "Can't stop activity - hyperfocused",
    profile: 'DISTRACTED',
    category: 'Transitions',
    situation_trigger: 'Child is deeply engaged in something (building, drawing, playing). Time to transition (dinner, leave, bedtime). They don\'t respond to your voice - genuinely can\'t hear you. Not ignoring.',

    phrase_1: "You're all the way inside what you're doing.",
    phrase_1_action: "CONNECTION",

    phrase_2: "Your brain is locked in, AND it's time to stop.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Five more minutes to find a stopping point, or I stop it now. Timer starts now.",
    phrase_3_action: "COMMAND",

    wrong_way: "I CALLED YOU THREE TIMES! Are you DEAF?! Stop IGNORING me! Put it down RIGHT NOW! You're so disrespectful!",

    neurological_tip: "DISTRACTED kids experience hyperfocus - when engaged, their brain literally filters out external input including voices. It's not selective hearing; auditory processing actually shuts down during deep focus. They can't hear you, and they can't 'snap out of it' on command. Yelling doesn't penetrate the focus, just startles them when it finally registers. Naming it ('all the way inside what you're doing') validates the state. Physical approach (not just voice) plus timer creates external structure their brain can latch onto. Five minutes gives transition time instead of jarring stop.",

    parent_state: ['calm', 'firm', 'understanding'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 300,
    age_min: 4,
    age_max: 12,
  },

  // DEFIANT #9 - Social
  {
    title: "Refusing to apologize after hurting someone",
    profile: 'DEFIANT',
    category: 'Social',
    situation_trigger: 'Child hit, pushed, or said something mean to sibling/friend. You tell them to apologize. They refuse: "No" or "I don\'t want to" or "They started it." Power struggle over forced apology.',

    phrase_1: "You don't want to be forced to say sorry.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You want to decide your own words, AND they got hurt.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Say sorry your way or write it down. But something happens in 1 minute or you lose TV.",
    phrase_3_action: "COMMAND",

    wrong_way: "APOLOGIZE RIGHT NOW! You HIT them! You don't get a choice! Say you're sorry or you're in BIG TROUBLE! SAY IT!",

    neurological_tip: "DEFIANT kids resist forced apologies because 'say sorry' feels like submission to authority, not genuine remorse. Making them parrot words teaches compliance theater, not empathy. Fighting about it creates power struggle where apologizing becomes losing. Naming their resistance ('don't want to be forced') validates autonomy need. The choice (say it your way OR write it) gives them control over expression while maintaining accountability (something happens). Time limit + consequence prevents indefinite standoff. Often they'll apologize genuinely once force is removed.",

    parent_state: ['firm', 'calm', 'neutral'],
    location_type: ['home', 'anywhere'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 4,
    age_max: 11,
  },

  // DEFIANT #10 - Problem Solving
  {
    title: "Rejecting help when clearly stuck",
    profile: 'DEFIANT',
    category: 'Problem_Solving',
    situation_trigger: 'Child struggling with task (zipper, puzzle, homework). You offer help. They snap: "I can do it MYSELF!" or "NO!" Getting increasingly frustrated but won\'t accept help.',

    phrase_1: "You want to figure it out on your own.",
    phrase_1_action: "CONNECTION",

    phrase_2: "Asking for help feels like failing, AND you're stuck.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Try 2 more minutes alone, or I help without talking. You pick, then it gets done.",
    phrase_3_action: "COMMAND",

    wrong_way: "You CLEARLY need help! Stop being so stubborn! Just LET me help you! You're making this harder than it has to be! FINE, suffer then!",

    neurological_tip: "DEFIANT kids equate accepting help with admitting defeat - their autonomy drive makes 'I need you' feel like weakness. Offering help triggers resistance even when they're genuinely stuck. Fighting about it entrenches the refusal. Naming the drive ('want to figure it out on your own') validates the independence need. Acknowledging the shame ('asking feels like failing') shows you understand. The choice (2 minutes alone OR silent help) respects autonomy while ensuring task completion. 'Help without talking' removes the 'I told you so' threat that makes help feel like submission.",

    parent_state: ['calm', 'respectful', 'patient'],
    location_type: ['home', 'anywhere'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 150,
    age_min: 3,
    age_max: 10,
  },
];

console.log('🌟 BATCH 05\n');

for (const script of premiumScripts) {
  console.log(`📝 ${script.title} (${script.profile}/${script.category})`);
  const { error } = await supabase.from('scripts').insert([script]);
  console.log(error ? `   ❌ ${error.message}` : `   ✅`);
}

const { data } = await supabase.from('scripts').select('profile');
const counts = {};
data.forEach(s => counts[s.profile] = (counts[s.profile] || 0) + 1);

console.log('\n📊 Total:');
Object.entries(counts).forEach(([p, c]) => console.log(`${p}: ${c}`));
console.log(`Database: ${data.length} scripts\n`);
