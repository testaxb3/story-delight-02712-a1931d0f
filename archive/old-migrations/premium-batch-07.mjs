import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

const scripts = [
  {
    title: "Won't get out of bed - genuinely exhausted",
    profile: 'INTENSE',
    category: 'Morning_Routines',
    situation_trigger: 'Morning, child won\'t get up. Not typical kid tiredness - genuinely depleted, saying "I\'m so tired" or "I can\'t." May have had poor sleep from ruminating.',

    phrase_1: "Your body feels like it weighs a thousand pounds.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You didn't sleep well because your brain wouldn't stop, AND school starts in 30 minutes.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Get up now for breakfast, or get up in 5 with no breakfast. Timer starts now.",
    phrase_3_action: "COMMAND",

    wrong_way: "Everyone is tired in the morning! You can't just stay in bed! Get UP! You're going to be late! I don't care how tired you are!",

    neurological_tip: "INTENSE kids often have genuine sleep deprivation from nighttime rumination - their brain reviews events/worries for hours before sleep. The morning exhaustion is real fatigue, not laziness. Acknowledging their poor sleep ('brain wouldn't stop') validates the real cause. The boundary (school starts) is non-negotiable, but the choice (now with food OR later without) gives them control. Natural consequence (hunger) is theirs to manage. If this pattern is chronic, address nighttime rumination separately.",

    parent_state: ['calm', 'firm', 'empathetic'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
    age_min: 7,
    age_max: 14,
  },

  {
    title: "Sibling touched their stuff - rage response",
    profile: 'INTENSE',
    category: 'Social',
    situation_trigger: 'Sibling touched or moved child\'s belonging. Child discovers it and has HUGE reaction: yelling, crying, or hitting sibling. Genuine violation feeling, not just annoyed.',

    phrase_1: "Someone touched what's yours and it feels like a violation.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You want your space completely protected, AND we share a house.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Tell them how it made you feel or ask for it back. But no hitting. Hitting = lose the item for a day.",
    phrase_3_action: "COMMAND",

    wrong_way: "It's just a toy! You're overreacting! Share with your sibling! They barely touched it! Why are you SO dramatic about EVERYTHING?!",

    neurological_tip: "INTENSE kids have strong boundary sensitivity - their belongings feel like extensions of self, so touching without permission feels like a body violation. The rage is protecting territory and autonomy. Dismissing as 'just a toy' misses that it's about safety and control. Naming it as violation validates their system. Acknowledging their want (complete protection) while stating reality (shared house) is honest. Offering appropriate action (tell them your feelings, ask for return) vs inappropriate (hitting) teaches response without suppressing the feeling.",

    parent_state: ['calm', 'firm', 'understanding'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 300,
    age_min: 4,
    age_max: 12,
  },

  {
    title: "Lights/sounds are painful - overstimulation shutdown",
    profile: 'DISTRACTED',
    category: 'Emotional_Regulation',
    situation_trigger: 'In stimulating environment (party, restaurant, mall). Child starts covering ears, closing eyes, getting irritable or crying. Sensory input has crossed threshold.',

    phrase_1: "Everything is too loud and too bright right now.",
    phrase_1_action: "CONNECTION",

    phrase_2: "Your senses are overloaded, AND we need to get you somewhere quiet fast.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Cover your ears and eyes. I'm getting us out. Just follow my voice.",
    phrase_3_action: "COMMAND",

    wrong_way: "You were FINE five minutes ago! Stop covering your ears! There's nothing wrong! Everyone else is fine! You're being too sensitive!",

    neurological_tip: "DISTRACTED kids have sensory processing sensitivity - stimuli others tolerate feel genuinely painful when their system is overloaded. They don't gradually get uncomfortable; they crash suddenly when threshold is reached. By the time you see distress, they're already in pain. Naming it ('too loud and too bright') validates their sensory experience. Immediate exit + blocking input (cover ears/eyes) reduces assault on their system. This isn't weakness; it's neurology. Repeated pattern suggests need for sensory diet/OT assessment.",

    parent_state: ['protective', 'calm', 'urgent'],
    location_type: ['public', 'party', 'restaurant'],
    emergency_suitable: true,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
    age_min: 3,
    age_max: 10,
  },

  {
    title: "Homework is boring - cannot force focus",
    profile: 'DISTRACTED',
    category: 'Homework',
    situation_trigger: 'Homework time, work is repetitive or unstimulating (math drill, spelling practice). Child literally cannot make themselves focus - staring, doodling, getting up repeatedly.',

    phrase_1: "Your brain won't stick to boring work.",
    phrase_1_action: "CONNECTION",

    phrase_2: "It's not interesting, AND it still has to get done.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Timer for 10 minutes with me right here, then 5-minute break. We repeat until done.",
    phrase_3_action: "COMMAND",

    wrong_way: "MAKE yourself focus! Everyone has to do boring work! You're choosing not to try! Sit DOWN and get it DONE! No break until it's finished!",

    neurological_tip: "DISTRACTED kids have interest-based nervous systems - boring tasks provide insufficient dopamine for their brain to engage. They can't willpower their way through unstimulating work; their executive function won't activate. Punishment doesn't create focus. Naming it ('brain won't stick to boring work') externalizes the struggle. The structure (10 min focus, 5 min break, repeat) works WITH their system by chunking and providing reset intervals. Your presence provides external accountability their internal system can't generate. This is accommodation, not enabling.",

    parent_state: ['patient', 'present', 'calm'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Long (10+ min)',
    expected_time_seconds: 600,
    age_min: 6,
    age_max: 14,
  },

  {
    title: "Told no - weaponizing emotions in public",
    profile: 'DEFIANT',
    category: 'Tantrums',
    situation_trigger: 'In public (store, restaurant). You said no to request. Child immediately escalates to loud tantrum, knows everyone is watching, using public attention as leverage.',

    phrase_1: "You're making it big so I'll give in.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You want the audience to pressure me, AND the answer stays no.",
    phrase_2_action: "VALIDATION",

    phrase_3: "Tantrum here or we leave now and you're done coming with me. You have 10 seconds to choose.",
    phrase_3_action: "COMMAND",

    wrong_way: "*whispers* FINE! FINE! You can have it! Just STOP! Everyone is staring! I can't believe you're doing this to me! This is SO embarrassing!",

    neurological_tip: "DEFIANT kids quickly learn that public tantrums have power - parental embarrassment often overrides boundaries. They're not manipulative in a bad way; they're strategically using available tools to get needs met. The key is immovability. Naming their strategy ('making it big so I'll give in') shows you see the tactic. Stating your immunity ('the answer stays no') removes the leverage. The consequence (leave now, banned from future outings) must be real. If you cave to avoid embarrassment, you teach them public = winning. One consistent follow-through usually extinguishes the pattern.",

    parent_state: ['firm', 'calm', 'unshakeable'],
    location_type: ['public', 'store'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
    age_min: 3,
    age_max: 9,
  },

  {
    title: "Refuses consequences - 'you can't make me'",
    profile: 'DEFIANT',
    category: 'Problem_Solving',
    situation_trigger: 'You give consequence for behavior (no screen, early bed, lose privilege). Child says "You can\'t make me!" or "I don\'t care!" or physically refuses to comply.',

    phrase_1: "You're testing if I can actually enforce this.",
    phrase_1_action: "CONNECTION",

    phrase_2: "You want consequences to be negotiable, AND this one isn't.",
    phrase_2_action: "VALIDATION",

    phrase_3: "This consequence stands. Fight it and it doubles. Your choice how big this gets.",
    phrase_3_action: "COMMAND",

    wrong_way: "YES I CAN make you! You don't get a CHOICE! You'll do what I SAY or you'll be SORRY! Don't test me!",

    neurological_tip: "DEFIANT kids challenge consequences to test enforcement - 'you can't make me' is seeing if boundaries are real or bluffable. If you back down or escalate to force, they learn different wrong lessons. Naming their test ('testing if I can actually enforce') shows you see the game. The key is calm inevitability. The consequence WILL happen - their only choice is whether it escalates (doubles). You must be willing to enforce even if difficult. Consistency here teaches them consequences are laws of nature, not debatable opinions. One solid follow-through usually ends the testing phase.",

    parent_state: ['firm', 'calm', 'resolved'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 5,
    age_max: 13,
  },
];

for (const s of scripts) {
  await supabase.from('scripts').insert([s]);
  console.log(`✅ ${s.profile}/${s.category}: ${s.title}`);
}

const { data } = await supabase.from('scripts').select('profile');
console.log(`\n📊 Total: ${data.length} scripts\n`);
