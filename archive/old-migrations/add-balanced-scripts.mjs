import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

const newScripts = [
  // 1. DISTRACTED - Emotional_Regulation
  {
    title: "Overwhelm spiral - can't name feelings",
    profile: 'DISTRACTED',
    category: 'Emotional_Regulation',
    situation_trigger: 'Child getting overwhelmed by too many emotions at once, shutting down or zoning out',
    phrase_1: 'Big feelings tornado right now.',
    phrase_2: 'Your body feels all the things at once, AND we can untangle them together.',
    phrase_3: 'Point or nod: tired, mad, or scared? We go one at a time.',
    wrong_way: '"Just use your words! Tell me what\'s wrong! Why can\'t you just TELL me how you feel?"',
    neurological_tip: 'DISTRACTED brains get flooded by multiple emotions simultaneously. Breaking it into binary choices helps them process one feeling at a time instead of shutting down.',
    parent_state: ['calm', 'alert', 'worried'],
    location_type: ['home', 'public', 'anywhere'],
    emergency_suitable: true,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
  },

  // 2. INTENSE - Homework
  {
    title: "Homework meltdown - perfectionism spiral",
    profile: 'INTENSE',
    category: 'Homework',
    situation_trigger: 'Child melting down over homework not being perfect, ripping paper, refusing to continue',
    phrase_1: 'Homework feels impossible right now.',
    phrase_2: 'You want it perfect, AND your brain is screaming at you.',
    phrase_3: 'Messy draft or break? You pick, I time 5 minutes.',
    wrong_way: '"It doesn\'t have to be perfect! You\'re making this so much harder than it is! Just DO it already!"',
    neurological_tip: 'INTENSE kids tie performance to self-worth. Naming the internal "screaming" externalizes the anxiety. Giving them control over next step prevents shutdown.',
    parent_state: ['calm', 'patient'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 420,
  },

  // 3. DISTRACTED - Hygiene
  {
    title: "Bath time avoidance - sensory overwhelm",
    profile: 'DISTRACTED',
    category: 'Hygiene',
    situation_trigger: 'Child refusing bath/shower because it feels like too much input, avoiding bathroom',
    phrase_1: 'Water feels like a lot tonight.',
    phrase_2: 'You want your body calm, AND the bath sounds scary.',
    phrase_3: 'Quick rinse or wipes tonight? Pick one, we do 5 minutes max.',
    wrong_way: '"You HAVE to take a bath! You smell! Stop being ridiculous, it\'s just water!"',
    neurological_tip: 'DISTRACTED kids get overwhelmed by multi-sensory experiences. Acknowledging "too much" + offering low-input alternative prevents full refusal.',
    parent_state: ['calm', 'neutral'],
    location_type: ['home', 'bathroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
  },

  // 4. DEFIANT - Hygiene
  {
    title: "Teeth brushing power struggle",
    profile: 'DEFIANT',
    category: 'Hygiene',
    situation_trigger: 'Child refusing to brush teeth, making it a control battle, arguing why they don\'t need to',
    phrase_1: 'You hate being told what to do.',
    phrase_2: 'You want to decide about your body, AND teeth get brushed every night.',
    phrase_3: 'You brush or I brush. Count of 3. One, two...',
    wrong_way: '"I don\'t care what you think! You WILL brush your teeth because I SAID SO! End of discussion!"',
    neurological_tip: 'DEFIANT brains resist authority. Naming their autonomy need + non-negotiable boundary + forced choice breaks the power loop.',
    parent_state: ['firm', 'calm', 'authoritative'],
    location_type: ['home', 'bathroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60,
  },

  // 5. INTENSE - Screens
  {
    title: "Screen shutdown rage - losing game progress",
    profile: 'INTENSE',
    category: 'Screens',
    situation_trigger: 'Screen time ending, child having a full meltdown because they were in the middle of a game/level',
    phrase_1: 'You are furious. You lost your progress.',
    phrase_2: 'You worked so hard on that level, AND screen time is done.',
    phrase_3: 'Save spot or screenshot? Then device goes on charger. You choose.',
    wrong_way: '"Too bad! I told you screen time was almost over! You should have saved earlier! Give me the iPad NOW!"',
    neurological_tip: 'INTENSE kids experience loss of progress as genuine grief. Acknowledging their effort + offering documentation of achievement helps them let go.',
    parent_state: ['empathetic', 'firm'],
    location_type: ['home'],
    emergency_suitable: true,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 360,
  },

  // 6. DISTRACTED - Tantrums
  {
    title: "Overstimulation tantrum in busy environment",
    profile: 'DISTRACTED',
    category: 'Tantrums',
    situation_trigger: 'Child melting down in overstimulating environment (store, party, mall) - too much noise/people/lights',
    phrase_1: 'Everything is too much right now.',
    phrase_2: 'Your brain is overloaded, AND we need to get you somewhere quiet.',
    phrase_3: 'Cover ears or close eyes while I carry you out. Just go limp, I got you.',
    wrong_way: '"Stop making a scene! Calm down RIGHT NOW! Everyone is looking! You\'re acting like a baby!"',
    neurological_tip: 'DISTRACTED brains hit sensory overload fast. Naming "overloaded" + immediate exit + sensory blocking gives them permission to shut down safely.',
    parent_state: ['protective', 'urgent'],
    location_type: ['public', 'store', 'mall', 'party'],
    emergency_suitable: true,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
  },
];

console.log('🚀 Inserindo 6 novos scripts para balancear categorias...\n');

for (const script of newScripts) {
  console.log(`📝 Criando: ${script.title} (${script.profile} - ${script.category})`);

  const { error } = await supabase
    .from('scripts')
    .insert([script]);

  if (error) {
    console.error(`   ❌ Erro: ${error.message}`);
  } else {
    console.log(`   ✅ Sucesso!`);
  }
}

console.log('\n✨ Pronto! Verificando distribuição final...\n');

// Check final distribution
const { data } = await supabase
  .from('scripts')
  .select('category')
  .order('category');

const categoryCount = {};
data.forEach(script => {
  const cat = script.category || 'unknown';
  categoryCount[cat] = (categoryCount[cat] || 0) + 1;
});

console.log('Distribuição final:\n');
Object.entries(categoryCount)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .forEach(([cat, count]) => {
    const status = count >= 3 ? '✅' : '⚠️';
    console.log(`  ${status} ${cat}: ${count} scripts`);
  });

console.log(`\n📊 Total: ${data.length} scripts`);
