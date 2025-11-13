import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iogceaotdodvugrmogpp.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const intenseScripts = [
  {
    title: 'Public Store Meltdown',
    category: 'Tantrums',
    wrong_way: '"Stop screaming RIGHT NOW! Everyone is staring at us! You\'re being so embarrassing!"',
    phrase_1: 'I see you\'re having big feelings...',
    phrase_1_action: 'Kneel to their level. Block your bodies from crowd view. Soft, low voice.',
    phrase_2: 'It\'s hard when everything feels too much, AND I\'m right here with you...',
    phrase_2_action: 'Offer hand or gentle touch on shoulder. Stay close. Ignore stares completely.',
    phrase_3: 'Squeeze my hands or take some space. You choose what your body needs.',
    phrase_3_action: 'Wait. Stay close. If they choose space, stand 2 feet away, calm face.',
    neurological_tip: 'Your calm body is their anchor when their nervous system is flooded. Ignoring the audience removes shame that intensifies meltdowns. Physical touch option gives sensory regulation for intense kids who need co-regulation.',
    profile: 'INTENSE',
    tags: ['meltdown', 'public', 'store', 'shopping', 'overwhelm', 'sensory'],
    situation_trigger: 'When child is screaming/melting down in public store and people are staring',
    location_type: ['public', 'store', 'shopping'],
    time_optimal: ['anytime'],
    intensity_level: 'severe',
    success_speed: '2min',
    parent_state: ['embarrassed', 'frustrated', 'anxious'],
    age_min: 3,
    age_max: 9,
    backup_plan: 'Pick up calmly and carry outside to car. Sit with them. Say nothing until body calms. Then: "That was really hard. Your body had too much."',
    common_mistakes: ['Looking at other shoppers apologetically (teaches: their opinion matters more than your feelings)', 'Saying "you\'re fine, stop crying" (invalidates real overwhelm)', 'Promising treats to stop meltdown (teaches: meltdown = reward)', 'Explaining why we need groceries (their brain can\'t process logic during meltdown)'],
    pause_after_phrase_1: 4,
    pause_after_phrase_2: 3,
    expected_time_seconds: 120,
    requires_preparation: false,
    works_in_public: true,
    emergency_suitable: false
  },
  {
    title: 'Restaurant Sensory Shutdown',
    category: 'Emotional_Regulation',
    wrong_way: '"Just TRY to sit still! Other families can do this! Why can\'t you just be normal?"',
    phrase_1: 'I notice it\'s really loud in here...',
    phrase_1_action: 'Lean close. Quiet voice. Put your body between them and the noise source.',
    phrase_2: 'It\'s hard when lights and sounds feel too big, AND we can take a break...',
    phrase_2_action: 'Gently touch their arm. Point toward exit/bathroom/quieter spot.',
    phrase_3: 'Outside for air or bathroom for quiet. You pick where feels better.',
    phrase_3_action: 'Stand up, offer hand. Walk slowly to their chosen spot. Stay with them.',
    neurological_tip: 'Intense kids\' sensory systems get flooded fast. Acknowledging the real physical discomfort validates their experience. Giving them control over where to regulate prevents full shutdown.',
    profile: 'INTENSE',
    tags: ['sensory overload', 'restaurant', 'public', 'loud', 'overstimulation'],
    situation_trigger: 'When child is shutting down at restaurant because it\'s too loud/bright/busy',
    location_type: ['public', 'restaurant'],
    time_optimal: ['afternoon', 'evening'],
    intensity_level: 'moderate',
    success_speed: '1min',
    parent_state: ['frustrated', 'embarrassed', 'exhausted'],
    age_min: 3,
    age_max: 10,
    backup_plan: 'Walk outside immediately. Find quiet spot away from people. Sit on ground with them. Wait until breathing slows. Offer to leave restaurant if needed.',
    common_mistakes: ['Forcing them to stay at table "just a little longer" (overload worsens)', 'Offering screen to distract (adds more sensory input when already flooded)', 'Comparing to other kids who can handle it (adds shame to overwhelm)', 'Asking questions while they\'re shutting down (can\'t process language)'],
    pause_after_phrase_1: 3,
    pause_after_phrase_2: 2,
    expected_time_seconds: 60,
    requires_preparation: false,
    works_in_public: true,
    emergency_suitable: true
  },
  {
    title: 'Bedtime Anxiety and Big Feelings',
    category: 'Bedtime',
    wrong_way: '"You\'re fine! The dark can\'t hurt you! Just close your eyes and GO TO SLEEP!"',
    phrase_1: 'I see your body feels worried...',
    phrase_1_action: 'Sit on edge of bed. Dim light on. Hand on their back or nearby.',
    phrase_2: 'It\'s hard when your brain won\'t settle and everything feels scary, AND I\'m staying right here...',
    phrase_2_action: 'Slow, deep breaths. Keep hand on their back. Rock gently if they allow it.',
    phrase_3: 'Tell me what you need, or I can guess. Squeeze, song, or breathing?',
    phrase_3_action: 'Do what they choose. Stay close. Slow everything down. Repeat if needed.',
    neurological_tip: 'Intense kids\' feelings are genuinely BIG and real, not manipulation. Your physical presence signals safety to their amygdala. Letting them name what helps gives control when they feel powerless.',
    profile: 'INTENSE',
    tags: ['bedtime', 'anxiety', 'dark', 'scared', 'big feelings', 'connection'],
    situation_trigger: 'When child can\'t settle for bed because of anxiety or big feelings about dark/being alone',
    location_type: ['home', 'bedroom'],
    time_optimal: ['evening'],
    intensity_level: 'moderate',
    success_speed: '5min',
    parent_state: ['exhausted', 'frustrated', 'calm'],
    age_min: 3,
    age_max: 10,
    backup_plan: 'Lie down next to them. Say: "I\'m staying until your body feels safe." Don\'t talk. Just breathe slow and calm. Stay until they sleep if needed.',
    common_mistakes: ['Leaving room to "teach independence" when they\'re genuinely scared (increases anxiety)', 'Saying "there\'s nothing to be scared of" (invalidates real fear)', 'Getting frustrated that bedtime is taking too long (they feel your stress)', 'Offering screen/video to calm down (stimulates brain instead of settling)'],
    pause_after_phrase_1: 4,
    pause_after_phrase_2: 3,
    expected_time_seconds: 300,
    requires_preparation: true,
    works_in_public: false,
    emergency_suitable: false
  },
  {
    title: 'Morning Sensory Overload Meltdown',
    category: 'Morning_Routines',
    wrong_way: '"We do this EVERY morning! Just put the clothes on! We\'re going to be SO LATE!"',
    phrase_1: 'I see everything feels wrong today...',
    phrase_1_action: 'Stop rushing. Kneel down. Soft voice. Turn off extra lights/sounds.',
    phrase_2: 'It\'s hard when your body feels too much and clothes hurt, AND we need clothes for school...',
    phrase_2_action: 'Hold up two outfit options. Remove tags if you can. Stay calm and slow.',
    phrase_3: 'This soft one or this loose one. Point to the one that feels okay.',
    phrase_3_action: 'Help them into chosen outfit. Skip socks if needed. Modify = survival, not failure.',
    neurological_tip: 'Intense kids\' morning nervous systems are already fragile. Sensory pain from clothes is REAL, not defiance. Slowing down for 60 seconds prevents 20-minute meltdown. Modified outfit beats no outfit.',
    profile: 'INTENSE',
    tags: ['morning', 'sensory', 'clothes', 'getting dressed', 'overwhelm', 'rush'],
    situation_trigger: 'When child is melting down in morning because clothes feel wrong and everything is overwhelming',
    location_type: ['home', 'bedroom'],
    time_optimal: ['morning'],
    intensity_level: 'severe',
    success_speed: '2min',
    parent_state: ['rushed', 'frustrated', 'anxious'],
    age_min: 3,
    age_max: 10,
    backup_plan: 'Choose their softest outfit yourself. Remove all tags. Say: "I picked soft clothes. Arms up." Dress them quickly. Get to car. Process feelings later, not during crisis.',
    common_mistakes: ['Forcing the outfit you picked (triggers more overwhelm)', 'Arguing about why they need to get dressed (logic doesn\'t work in meltdown)', 'Threatening consequences for being late (adds pressure to overload)', 'Offering 6 outfit choices (too many decisions when already overwhelmed)'],
    pause_after_phrase_1: 3,
    pause_after_phrase_2: 2,
    expected_time_seconds: 120,
    requires_preparation: false,
    works_in_public: false,
    emergency_suitable: false
  },
  {
    title: 'Playground Transition Tears',
    category: 'Transitions',
    wrong_way: '"Stop crying! We\'ll come back tomorrow! You\'re making this so hard! Let\'s GO!"',
    phrase_1: 'I see you\'re really sad to leave...',
    phrase_1_action: 'Kneel to their level. Acknowledge the tears. Gentle hand on shoulder if they allow.',
    phrase_2: 'It\'s hard to leave when you\'re having so much fun, AND our playground time is done...',
    phrase_2_action: 'Stand up slowly. Offer your hand. Point toward exit with calm confidence.',
    phrase_3: 'Hold my hand or walk next to me. We\'re walking to the car now.',
    phrase_3_action: 'Start walking slowly. If no movement in 3 seconds, pick up gently and carry. Stay calm.',
    neurological_tip: 'Intense kids feel transitions as real grief, not just preference. Acknowledging sadness without negotiating validates feelings while maintaining boundary. Your calm body during their storm = co-regulation.',
    profile: 'INTENSE',
    tags: ['transition', 'leaving', 'playground', 'park', 'crying', 'cooperation'],
    situation_trigger: 'When child is already crying about leaving playground and you need to go',
    location_type: ['public', 'park', 'playground'],
    time_optimal: ['afternoon', 'evening', 'anytime'],
    intensity_level: 'moderate',
    success_speed: '1min',
    parent_state: ['rushed', 'embarrassed', 'frustrated'],
    age_min: 2,
    age_max: 8,
    backup_plan: 'Pick up calmly and carry to car even if crying. Buckle in. Say: "I know that was really hard. We can be sad together." Let them cry. Drive home.',
    common_mistakes: ['Promising "just 5 more minutes" when you don\'t mean it (teaches: parent doesn\'t follow through)', 'Explaining all the reasons you have to leave (engages argument brain)', 'Getting angry at the tears (adds shame to sadness)', 'Bribing with treats to stop crying (teaches: big feelings = rewards)'],
    pause_after_phrase_1: 3,
    pause_after_phrase_2: 2,
    expected_time_seconds: 60,
    requires_preparation: false,
    works_in_public: true,
    emergency_suitable: true
  },
  {
    title: 'Sibling Hit During Anger Explosion',
    category: 'Social',
    wrong_way: '"We do NOT hit in this house! Say sorry RIGHT NOW! Go to your room!"',
    phrase_1: 'I see you hit your brother...',
    phrase_1_action: 'Firm voice. Move between children. Put hand up as physical boundary.',
    phrase_2: 'It\'s hard when anger feels so big you lose control, AND hitting hurts and isn\'t safe...',
    phrase_2_action: 'Move sibling to safety. Turn back to intense child. Lower voice. Slow down.',
    phrase_3: 'Different room or calm corner. Your body needs space to settle. I\'m coming with you.',
    phrase_3_action: 'Walk with them to separate space. Don\'t discuss yet. Just sit nearby until breathing slows.',
    neurological_tip: 'Intense kids\' anger is neurologically overwhelming, not malicious. Separation is for safety AND regulation, not punishment. Staying with them during cooldown = co-regulation. Repair happens AFTER nervous system calms.',
    profile: 'INTENSE',
    tags: ['hitting', 'sibling conflict', 'anger', 'aggression', 'big feelings'],
    situation_trigger: 'When intense child hit sibling during emotional explosion and you\'re frustrated',
    location_type: ['home'],
    time_optimal: ['anytime'],
    intensity_level: 'severe',
    success_speed: '3min',
    parent_state: ['angry', 'frustrated', 'disappointed'],
    age_min: 4,
    age_max: 10,
    backup_plan: 'Physically separate immediately. Say: "I\'m keeping everyone safe. You need space." Take them to different room. Sit with them. Wait for calm. Other parent comforts sibling if possible.',
    common_mistakes: ['Forcing apology while they\'re still escalated (insincere and ineffective)', 'Sending to room alone as punishment (they need co-regulation, not isolation)', 'Lecturing about hitting while they\'re still activated (can\'t process)', 'Asking "why did you do that?" during meltdown (engages argument brain)'],
    pause_after_phrase_1: 4,
    pause_after_phrase_2: 3,
    expected_time_seconds: 180,
    requires_preparation: false,
    works_in_public: false,
    emergency_suitable: false
  },
  {
    title: 'Mealtime Sensory Texture Battle',
    category: 'Mealtime',
    wrong_way: '"This is what we\'re eating! I\'m not making separate meals! Just TRY one bite!"',
    phrase_1: 'I see that texture doesn\'t work for you...',
    phrase_1_action: 'Stay seated. Calm face. Don\'t push plate closer. Acknowledge the real discomfort.',
    phrase_2: 'It\'s hard when food feels wrong in your mouth, AND your body needs fuel tonight...',
    phrase_2_action: 'Point to one safe food on table. Keep voice matter-of-fact, not pleading.',
    phrase_3: 'Eat what your body can handle. Bread, yogurt, or fruit. You choose one.',
    phrase_3_action: 'Put chosen safe food in front of them. Let them eat it. End of negotiation.',
    neurological_tip: 'Sensory texture aversion is neurological, not defiance. Fighting it creates food anxiety. One safe food = enough nutrition for tonight. Battle-free meals = long-term healthy relationship with food.',
    profile: 'INTENSE',
    tags: ['mealtime', 'picky eating', 'sensory', 'food refusal', 'texture'],
    situation_trigger: 'When child refuses dinner because of texture issues and mealtime is becoming a battle',
    location_type: ['home'],
    time_optimal: ['evening', 'anytime'],
    intensity_level: 'moderate',
    success_speed: '1min',
    parent_state: ['frustrated', 'exhausted', 'feeling guilty'],
    age_min: 3,
    age_max: 10,
    backup_plan: 'Say: "Your body knows what it needs. Eat what you can." Offer plain pasta, bread, or cheese. Let them eat safe food. Don\'t discuss nutrition. Survival meal is success.',
    common_mistakes: ['Forcing "one bite" of the refused food (increases food anxiety long-term)', 'Making them sit until they eat it (creates power struggle)', 'Explaining nutrition while they\'re distressed (logic doesn\'t work)', 'Feeling like failure as parent (you\'re preventing trauma, not giving in)'],
    pause_after_phrase_1: 3,
    pause_after_phrase_2: 2,
    expected_time_seconds: 60,
    requires_preparation: true,
    works_in_public: false,
    emergency_suitable: false
  },
  {
    title: 'Bath Time Sensory Shutdown',
    category: 'Hygiene',
    wrong_way: '"Bath time is NOT optional! You\'re dirty and you NEED a bath! Get in NOW!"',
    phrase_1: 'I see bath time feels bad tonight...',
    phrase_1_action: 'Stop forcing. Turn off rushing energy. Sit on bathroom floor at their level.',
    phrase_2: 'It\'s hard when water and towels feel wrong on your skin, AND bodies need washing...',
    phrase_2_action: 'Offer washcloth. Show warm water temperature on your hand. Stay slow and calm.',
    phrase_3: 'Quick washcloth bath or super fast shower. You pick how we get clean.',
    phrase_3_action: 'Let them choose. If washcloth: they wash face/hands/private areas, done. If shower: 2 minutes max.',
    neurological_tip: 'Evening sensory tolerance is already depleted for intense kids. Full bath isn\'t worth the trauma. Washcloth bath = clean enough. Modifying expectations = meeting their nervous system where it is.',
    profile: 'INTENSE',
    tags: ['bath', 'hygiene', 'sensory', 'evening routine', 'washing'],
    situation_trigger: 'When child is fighting bath time because of sensory issues with water or towels',
    location_type: ['home', 'bathroom'],
    time_optimal: ['evening'],
    intensity_level: 'moderate',
    success_speed: '2min',
    parent_state: ['exhausted', 'frustrated', 'rushed'],
    age_min: 3,
    age_max: 10,
    backup_plan: 'Skip bath entirely tonight. Say: "Bodies can skip one night. Washcloth on face and hands." Quick wipe down. Put on pajamas. Preserve bedtime peace over perfect hygiene.',
    common_mistakes: ['Forcing full bath "because they need it" (creates bath trauma)', 'Fighting about hair washing when they\'re already overwhelmed (pick your battles)', 'Using cold water as "consequence" for fighting (cruel and increases fear)', 'Rushing them through it while they\'re distressed (confirms bath = bad)'],
    pause_after_phrase_1: 3,
    pause_after_phrase_2: 2,
    expected_time_seconds: 120,
    requires_preparation: false,
    works_in_public: false,
    emergency_suitable: false
  },
  {
    title: 'Homework Emotional Shutdown',
    category: 'Problem_Solving',
    wrong_way: '"It\'s only 10 problems! Just START! Other kids can do this! Why is this so hard for you?"',
    phrase_1: 'I see this feels too big...',
    phrase_1_action: 'Sit next to them. Close extra worksheets. Remove visual overwhelm. Soft voice.',
    phrase_2: 'It\'s hard when work feels impossible and your brain shuts down, AND we can make it smaller...',
    phrase_2_action: 'Cover all problems except one. Point to single problem. Stay calm and close.',
    phrase_3: 'Just this one problem. Then break. Show me you can do one.',
    phrase_3_action: 'Wait. Don\'t help yet. If they try: celebrate. If frozen: do first one together, they do second.',
    neurological_tip: 'Intense kids\' emotional flooding blocks executive function. They CAN\'T, not WON\'T. Breaking into one tiny piece restarts frozen brain. Success on one = momentum. Forcing through shutdown = learned helplessness.',
    profile: 'INTENSE',
    tags: ['homework', 'overwhelm', 'shutdown', 'school', 'executive function'],
    situation_trigger: 'When child is shutting down over homework because task feels too overwhelming',
    location_type: ['home'],
    time_optimal: ['afternoon', 'evening'],
    intensity_level: 'severe',
    success_speed: '3min',
    parent_state: ['frustrated', 'exhausted', 'losing patience'],
    age_min: 5,
    age_max: 12,
    backup_plan: 'Close the homework. Say: "Your brain is done for tonight. Let\'s write a note to teacher." Write: "[Child] was overwhelmed tonight. We completed X problems. Will try again tomorrow." Protect their mental health over completion.',
    common_mistakes: ['Saying "it\'s easy, just do it" (minimizes real struggle)', 'Sitting there until it\'s done (creates homework trauma)', 'Doing the work for them (doesn\'t help long-term)', 'Comparing to siblings or classmates (adds shame to overwhelm)'],
    pause_after_phrase_1: 4,
    pause_after_phrase_2: 3,
    expected_time_seconds: 180,
    requires_preparation: true,
    works_in_public: false,
    emergency_suitable: false
  },
  {
    title: 'Car Seat Strap Sensory Meltdown',
    category: 'Transitions',
    wrong_way: '"The straps don\'t hurt! Just GET IN! We\'re already late! Stop making this difficult!"',
    phrase_1: 'I see the straps feel bad...',
    phrase_1_action: 'Stop forcing. Take breath. Acknowledge the real physical discomfort they feel.',
    phrase_2: 'It\'s hard when straps feel too tight and wrong, AND car seats keep you safe...',
    phrase_2_action: 'Loosen straps slightly. Show them it\'s looser. Put soft cloth on chest clip if you have one.',
    phrase_3: 'Get in now with loose straps, or I lift you in. We\'re leaving in 10 seconds.',
    phrase_3_action: 'Count slowly. If no movement by 10, lift them in calmly. Buckle while staying calm. Drive.',
    neurological_tip: 'Sensory sensitivity to car seat pressure is REAL for intense kids. Acknowledging it validates, loosening straps helps, but boundary stays firm: we\'re going. Your calm during their resistance = safety.',
    profile: 'INTENSE',
    tags: ['car seat', 'sensory', 'straps', 'transition', 'leaving', 'cooperation'],
    situation_trigger: 'When child is fighting car seat because straps hurt and you\'re already running late',
    location_type: ['car', 'parking lot', 'public'],
    time_optimal: ['morning', 'anytime'],
    intensity_level: 'severe',
    success_speed: '1min',
    parent_state: ['rushed', 'frustrated', 'angry'],
    age_min: 3,
    age_max: 7,
    backup_plan: 'Lift them into seat. Buckle quickly. If screaming: say nothing. Drive. Let them be upset. Arrive at destination. Then: "That was really hard. The straps feel bad and we still have to use them."',
    common_mistakes: ['Arguing that straps don\'t hurt (invalidates their real sensory experience)', 'Tightening straps "properly" while they\'re melting down (increases overwhelm)', 'Threatening to leave them home (empty threat, illegal)', 'Apologizing repeatedly while still forcing (mixed message)'],
    pause_after_phrase_1: 3,
    pause_after_phrase_2: 2,
    expected_time_seconds: 60,
    requires_preparation: false,
    works_in_public: true,
    emergency_suitable: true
  }
];

async function insertScripts() {
  console.log('🚀 Inserindo 10 scripts INTENSE...\n');

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < intenseScripts.length; i++) {
    const script = intenseScripts[i];
    console.log(`[${i+1}/10] Inserindo: ${script.title}`);

    const { data, error } = await supabase
      .from('scripts')
      .insert([script])
      .select();

    if (error) {
      console.log(`   ❌ Erro: ${error.message}`);
      errorCount++;
    } else {
      console.log(`   ✅ Inserido com sucesso!`);
      successCount++;
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RESULTADO:');
  console.log(`   ✅ Sucesso: ${successCount} scripts`);
  console.log(`   ❌ Erros: ${errorCount} scripts`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Verificar total no banco
  const { data: totalData, error: totalError } = await supabase
    .from('scripts')
    .select('title')
    .eq('profile', 'INTENSE');

  if (!totalError) {
    console.log(`📋 Total de scripts INTENSE no banco: ${totalData.length}\n`);
    totalData.forEach((s, i) => {
      console.log(`   ${i+1}. ${s.title}`);
    });
  }

  console.log('\n✅ DONE!');
}

insertScripts();
