import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

const defiantScripts = [
  // 1. BEDTIME #2
  {
    title: "Stalling with endless requests at bedtime",
    profile: 'DEFIANT',
    category: 'Bedtime',
    situation_trigger: "Bedtime routine done, child in bed. Endless stream of requests: one more hug, adjust blanket, need different stuffed animal, too hot, too cold. Each request delays sleep, testing your patience.",

    phrase_1: "You're finding reasons to keep me here.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You want to control when sleep happens, AND bedtime was 10 minutes ago.",
    phrase_2_action: "VALIDATION",
    phrase_3: "One final request, I grant it, then I leave. No call-backs after. Choose wisely.",
    phrase_3_action: "COMMAND",

    wrong_way: "ENOUGH! No more requests! I've been in here for 20 minutes! Go to SLEEP! I'm LEAVING and I'm not coming back!",

    neurological_tip: "DEFIANT kids use stalling requests to maintain control over bedtime timeline - each granted request reinforces that they can extend your presence. Orbitofrontal cortex is learning: more requests = more time with parent. You'll see: strategic timing of requests (right as you reach door), escalating urgency ('I REALLY need water'), testing different request types to find what works. Why 'you're finding reasons to keep me here' works: Names the strategy without judgment. Why 'one final request, choose wisely' works: Gives them control (what to request) while maintaining boundary (only one). The key: After granting it, you MUST leave despite protests. If you return for 'emergencies,' you teach: keep trying, I'll come back.",

    parent_state: ['firm', 'calm', 'resolved'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
    age_min: 3,
    age_max: 9,
  },

  // 2. SCREENS #2
  {
    title: "Sneaking extra screen time when you're not watching",
    profile: 'DEFIANT',
    category: 'Screens',
    situation_trigger: "Screen time is over, device should be charging. You catch child sneaking it back, watching 'just one more thing' or gaming quietly. Testing if you'll notice/enforce.",

    phrase_1: "You're seeing if I actually check.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You want to decide your own screen rules, AND sneaking broke the trust rule.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Hand it over now, no screens tomorrow. Or hide it and lose it for a week. I'm counting to three.",
    phrase_3_action: "COMMAND",

    wrong_way: "I KNEW you'd try this! You can't be TRUSTED! Why do you always SNEAK?! You just lost screens for a MONTH! I can't believe you!",

    neurological_tip: "DEFIANT kids test enforcement consistency - sneaking screens checks: Does the rule apply when you're not watching? Anterior cingulate cortex (rule-learning center) is running experiment: Is screen limit real law or only when parent supervises? You'll see: strategic sneaking (when you're busy/on phone), acting innocent when caught, minimizing ('I was just checking the time'). Why 'you're seeing if I actually check' works: Shows you understand the test without moralizing. Why immediate consequence (no screens tomorrow) works: Makes cost of sneaking concrete and immediate. Why escalating consequence for resistance (hide it = lose week) works: Tests if THEY value screens enough to comply. Calm enforcement teaches: rules persist whether I'm watching or not.",

    parent_state: ['firm', 'calm', 'unshakeable'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 5,
    age_max: 14,
  },

  // 3. MEALTIME #2
  {
    title: "Demanding different meal after seeing what was made",
    profile: 'DEFIANT',
    category: 'Mealtime',
    situation_trigger: "Dinner is ready, everyone sitting down. Child sees the food and demands something else: 'I want chicken nuggets' or 'Can you make pasta instead?' Testing if complaints change the menu.",

    phrase_1: "You want to decide the menu.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You don't like being served food you didn't choose, AND this is what was made.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Eat what's here, make yourself a sandwich, or don't eat. Kitchen doesn't reopen. Your call.",
    phrase_3_action: "COMMAND",

    wrong_way: "I just COOKED for an hour! You're going to eat what I MADE! I'm not a RESTAURANT! You don't get to ORDER off a menu! EAT IT or STARVE!",

    neurological_tip: "DEFIANT kids demand menu control because being served food = someone else controlling what enters their body. Anterior cingulate fires 'autonomy threat' at preset meals. The demand isn't about disliking the food - it's testing if complaints can change outcomes. You'll see: demands AFTER seeing food (not before), comparison to preferred foods, negotiating ('what if I eat SOME of this and you make...'), watching for signs you'll cave. Why 'you want to decide the menu' works: Names the autonomy need directly. Why offering alternatives (sandwich, skip meal) works: Gives choice without you becoming short-order cook. Why 'kitchen doesn't reopen' works: Makes it time-based boundary, not emotional battle. Natural consequence (hunger) is theirs to manage.",

    parent_state: ['calm', 'firm', 'neutral'],
    location_type: ['home', 'kitchen'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 4,
    age_max: 12,
  },

  // 4. SOCIAL #2
  {
    title: "Provoking sibling then playing victim",
    profile: 'DEFIANT',
    category: 'Social',
    situation_trigger: "Child deliberately provokes sibling (taking toy, teasing, invading space), sibling reacts, then child complains loudly: 'They hit me!' or 'They're being mean!' Strategic victimhood.",

    phrase_1: "You started it and now you're reporting them.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You wanted a reaction, AND now you want me to blame them instead of you.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Tell the truth about what you did first, or both of you get consequence. Count of 10.",
    phrase_3_action: "COMMAND",

    wrong_way: "I SAW what you did! Don't you LIE to me! You STARTED it! You're the PROBLEM! Why do you always do this to your sibling?!",

    neurological_tip: "DEFIANT kids use strategic provocation to manipulate adult intervention - they've learned: provoke sibling quietly, then report their reaction loudly, parent punishes sibling. Orbitofrontal cortex has encoded this pattern through successful trials. You'll see: subtle provocation when they think you're not looking, immediate loud complaints at sibling's reaction, innocent expression when you arrive, deflection if confronted ('I didn't do anything!'). Why 'you started it and now you're reporting them' works: Shows you see the full sequence, not just the end. Why 'tell truth about what you did OR both get consequence' works: Removes benefit of strategic victimhood. If lying persists, they learn the cost. Equal consequence for both disrupts the manipulation pattern.",

    parent_state: ['firm', 'calm', 'observant'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
    age_min: 5,
    age_max: 13,
  },

  // 5. HYGIENE #2
  {
    title: "Lying about having brushed teeth",
    profile: 'DEFIANT',
    category: 'Hygiene',
    situation_trigger: "You ask if child brushed teeth. They say yes. Toothbrush is dry, no toothpaste smell. Lying to avoid compliance with hygiene directive.",

    phrase_1: "You're saying yes but your toothbrush says no.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You don't want to do it, AND lying makes it worse.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Brush now and it's done. Lie again and you brush plus lose tomorrow's dessert. Decide now.",
    phrase_3_action: "COMMAND",

    wrong_way: "Don't you LIE to me! I can SEE your toothbrush is dry! Why can't you just DO what you're asked?! Now you're in TROUBLE for lying!",

    neurological_tip: "DEFIANT kids lie about hygiene compliance to test: Can I avoid authority's directive through deception? Orbitofrontal cortex is calculating: lying effort < brushing effort, so try lying. You'll see: confident 'yes' despite obvious evidence, defensiveness when questioned, doubling down on lie ('I DID brush it!'), strategic timing (lying when you're busy/distracted). Why 'your toothbrush says no' works: States observable evidence without accusing, making lie impossible to maintain. Why separating consequence for task vs lie works: Brushing isn't punishment, lying adds cost. Why 'decide now' works: Forces choice between small effort (brush) or bigger consequence (brush + lose dessert). If you enforce this ONCE with follow-through, lying about hygiene usually stops.",

    parent_state: ['calm', 'firm', 'matter-of-fact'],
    location_type: ['home', 'bathroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 5,
    age_max: 12,
  },

  // 6. TRANSITIONS #3
  {
    title: "Refusing to leave playground - full meltdown",
    profile: 'DEFIANT',
    category: 'Transitions',
    situation_trigger: "Time to leave playground/park. Child refuses: running away, climbing higher on equipment, full meltdown when you approach. Testing if meltdown will extend playground time.",

    phrase_1: "You're making leaving so hard I might give up.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You want the tantrum to buy more time, AND we're leaving in 30 seconds either way.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Walk to car now or I carry you. Tantrum in public doesn't change the answer. Count of three.",
    phrase_3_action: "COMMAND",

    wrong_way: "GET DOWN HERE RIGHT NOW! Everyone is WATCHING! You're embarrassing me! FINE, five more minutes but then we're LEAVING! I can't BELIEVE you!",

    neurological_tip: "DEFIANT kids escalate at playground departure because public setting = parental embarrassment leverage. Orbitofrontal cortex has learned: big tantrum in front of other parents sometimes works. You'll see: strategic escalation (louder when more people around), physical evasion (running, climbing out of reach), checking your reaction for signs of caving, sometimes pausing tantrum to gauge effectiveness. Why 'you're making leaving so hard I might give up' works: Shows you see the strategy. Why 'we're leaving in 30 seconds either way' + immovable tone works: Removes leverage of public tantrum. Why carry-threat works: Makes leaving inevitable regardless of cooperation. If you carry them out once with calm follow-through despite stares, pattern typically stops. Other parents' judgment matters less than your child's learning.",

    parent_state: ['firm', 'calm', 'unshakeable'],
    location_type: ['public', 'playground', 'park'],
    emergency_suitable: true,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
    age_min: 3,
    age_max: 9,
  },

  // 7. EMOTIONAL_REGULATION
  {
    title: "Escalating tone to match yours when angry",
    profile: 'DEFIANT',
    category: 'Emotional_Regulation',
    situation_trigger: "Conflict happening, your voice raises in frustration. Child immediately escalates to match or exceed your volume/intensity. Mirroring your emotion to test if you'll back down or escalate further.",

    phrase_1: "You're matching my energy to see what I'll do.",
    phrase_1_action: "CONNECTION",
    phrase_2: "When I get louder you get louder, AND this just makes it worse.",
    phrase_2_action: "VALIDATION",
    phrase_3: "I'm going quiet now. When you match my calm, we finish this conversation. I'm waiting.",
    phrase_3_action: "COMMAND",

    wrong_way: "Don't you YELL at ME! I'm the PARENT! You do NOT talk to me that WAY! Go to your ROOM until you can be RESPECTFUL!",

    neurological_tip: "DEFIANT kids mirror parental escalation as power-testing - when you raise voice, they raise voice to assert equal standing. Anterior cingulate detects emotional escalation as dominance challenge. You'll see: instant volume match when you get loud, watching for your next move, sometimes smirking (recognizing they've gotten to you), escalating further if you escalate. Why 'you're matching my energy' works: Names the pattern, showing you see the dynamic. Why going QUIET yourself works: Removes the escalation fuel - they can't mirror what you're not doing. Why waiting for them to match calm works: Makes de-escalation their choice to continue conversation. If you can regulate yourself first (hardest part), you short-circuit the escalation cycle. Their brain learns: escalation doesn't work, calm does.",

    parent_state: ['calm', 'self-aware', 'regulated'],
    location_type: ['home', 'anywhere'],
    emergency_suitable: true,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 360,
    age_min: 6,
    age_max: 15,
  },

  // 8. PROBLEM_SOLVING #3
  {
    title: "Breaking things when frustrated instead of asking for help",
    profile: 'DEFIANT',
    category: 'Problem_Solving',
    situation_trigger: "Child working on something (toy, puzzle, device). Stuck or frustrated. Instead of asking for help, breaks it or throws it. Destruction as response to difficulty.",

    phrase_1: "Breaking it feels better than admitting you need help.",
    phrase_1_action: "CONNECTION",
    phrase_2: "Asking for help feels like losing, AND now it's broken and can't be fixed.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Broken things don't get replaced. Next time you're stuck: ask or walk away. Those are the options.",
    phrase_3_action: "COMMAND",

    wrong_way: "WHY did you BREAK it?! I would have HELPED you! Now it's RUINED! You just lost [item] FOREVER! You need to learn to CONTROL yourself!",

    neurological_tip: "DEFIANT kids break things when frustrated because asking for help = admitting someone has knowledge/power they lack. Ventromedial prefrontal cortex (autonomy/competence monitoring) interprets 'I can't do this' as threat to self-image. Breaking it is control assertion: I may not be able to solve it, but I can destroy it. You'll see: increasing force with growing frustration, sometimes satisfying expression after breaking, resistance if you approach to help before break, deflection of responsibility ('it was already broken'). Why 'breaking feels better than admitting you need help' works: Names the real conflict (pride vs competence). Why natural consequence (broken = not replaced) works: Makes destruction costly without you being punisher. Why teaching options (ask OR walk away) works: Gives alternatives to destruction that preserve autonomy.",

    parent_state: ['calm', 'firm', 'non-punitive'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
    age_min: 4,
    age_max: 12,
  },
];

console.log('🚀 DEFIANT EXPANSION: 8 Premium Scripts\n');

let count = 0;
for (const script of defiantScripts) {
  const { error } = await supabase.from('scripts').insert([script]);

  if (error) {
    console.log(`❌ ${script.category}: ${script.title}`);
    console.log(`   Error: ${error.message}\n`);
  } else {
    count++;
    console.log(`✅ ${count}/8: ${script.category} - ${script.title}`);
  }
}

console.log(`\n🎉 ${count} DEFIANT scripts added successfully!\n`);

// Show updated distribution
const { data } = await supabase.from('scripts').select('profile, category');
const defiantOnly = data.filter(s => s.profile === 'DEFIANT');
const byCat = {};
defiantOnly.forEach(s => {
  byCat[s.category] = (byCat[s.category] || 0) + 1;
});

console.log('📊 DEFIANT Distribution:\n');
Object.entries(byCat)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count} scripts`);
  });

console.log(`\n📊 Total DEFIANT scripts: ${defiantOnly.length}`);
console.log(`📊 Total database: ${data.length} scripts\n`);
