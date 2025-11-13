import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

const intensiveScripts = [
  // ========== BEDTIME (need +3) ==========
  {
    title: "Bedtime anxiety about tomorrow's performance",
    profile: 'INTENSE',
    category: 'Bedtime',
    situation_trigger: 'Child unable to sleep due to intense anxiety about next day performance, test, or social event',
    phrase_1: 'Your brain won\'t stop racing.',
    phrase_2: 'You want tomorrow to be perfect, AND your body needs sleep to make that happen.',
    phrase_3: 'Brain dump notebook or calm breathing? Pick one, I stay 5 minutes.',
    wrong_way: '"Stop worrying! You\'ll be fine! Just go to sleep already!"',
    neurological_tip: 'INTENSE kids experience anticipatory anxiety as physical pain. Externalizing worries (brain dump) or somatic regulation (breathing) gives them control over the anxiety instead of fighting it.',
    parent_state: ['calm', 'empathetic', 'firm'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 420,
  },

  {
    title: "Bedtime resistance - day wasn't perfect",
    profile: 'INTENSE',
    category: 'Bedtime',
    situation_trigger: 'Child refusing bed because the day didn\'t end right, feeling incomplete or like they failed',
    phrase_1: 'Today feels unfinished and wrong.',
    phrase_2: 'You needed the day to end better, AND tomorrow is a fresh start.',
    phrase_3: 'Write tomorrow\'s plan or tell me one good thing? Then lights out.',
    wrong_way: '"Not everything has to be perfect! Tomorrow will be the same as today if you don\'t sleep!"',
    neurological_tip: 'INTENSE brains struggle with closure when events don\'t match expectations. Offering control over tomorrow\'s narrative or finding one positive reframes the "failure" feeling.',
    parent_state: ['understanding', 'gentle', 'firm'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 300,
  },

  {
    title: "Bedtime terror about sleeping alone",
    profile: 'INTENSE',
    category: 'Bedtime',
    situation_trigger: 'Child having intense fear of being alone at night, feeling vulnerable and panicked',
    phrase_1: 'Your body feels terrified right now.',
    phrase_2: 'You want to feel safe, AND you need to sleep in your bed.',
    phrase_3: 'Door cracked with hall light or stuffed animal guard? You choose.',
    wrong_way: '"There\'s nothing to be scared of! You\'re a big kid now! Stop being a baby!"',
    neurological_tip: 'INTENSE kids experience fear as genuine physical danger. Validating the terror as real + environmental controls gives them agency over their safety feelings.',
    parent_state: ['protective', 'calm', 'reassuring'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: true,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 180,
  },

  // ========== EMOTIONAL_REGULATION (need +3) ==========
  {
    title: "Rejection devastation from peer exclusion",
    profile: 'INTENSE',
    category: 'Emotional_Regulation',
    situation_trigger: 'Child experiencing crushing emotional pain from being left out, not invited, or rejected by friends',
    phrase_1: 'This feels devastating right now.',
    phrase_2: 'You wanted to be included, AND they made a different choice.',
    phrase_3: 'Angry art or tell me everything? You pick, I listen completely.',
    wrong_way: '"They\'re not your real friends anyway! You\'re better off without them! Stop crying over it!"',
    neurological_tip: 'INTENSE kids feel social rejection as genuine grief. Naming "devastating" matches their internal reality. Creative expression or verbal processing externalizes the pain safely.',
    parent_state: ['empathetic', 'present', 'calm'],
    location_type: ['home', 'car', 'anywhere'],
    emergency_suitable: true,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 480,
  },

  {
    title: "Rage explosion from small disappointment",
    profile: 'INTENSE',
    category: 'Emotional_Regulation',
    situation_trigger: 'Child having explosive rage over minor disappointment that feels catastrophic to them',
    phrase_1: 'You are absolutely furious.',
    phrase_2: 'Your whole plan just changed, AND your brain is screaming.',
    phrase_3: 'Scream into pillow or stomp it out? Then we problem-solve.',
    wrong_way: '"This is NOT a big deal! You\'re totally overreacting! Calm down right now!"',
    neurological_tip: 'INTENSE brains lack emotional gradation - everything is 0 or 100. Acknowledging the fury as real + physical release prevents internalization. Problem-solving comes AFTER regulation.',
    parent_state: ['steady', 'calm', 'firm'],
    location_type: ['home', 'anywhere'],
    emergency_suitable: true,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 240,
  },

  {
    title: "Shame spiral after making a mistake",
    profile: 'INTENSE',
    category: 'Emotional_Regulation',
    situation_trigger: 'Child collapsing into shame and self-hatred after making any mistake, saying they\'re terrible/stupid',
    phrase_1: 'Your brain is attacking you right now.',
    phrase_2: 'You made one mistake, AND your brain says you\'re all bad.',
    phrase_3: 'List what you did right or hug reset? Pick one, then we talk.',
    wrong_way: '"You\'re not stupid! Stop saying that! It was just one little mistake! You\'re fine!"',
    neurological_tip: 'INTENSE kids have harsh inner critics that catastrophize mistakes. Externalizing the "attacking brain" helps them see thoughts aren\'t facts. Evidence-gathering or physical reset interrupts the spiral.',
    parent_state: ['compassionate', 'calm', 'supportive'],
    location_type: ['home', 'school', 'anywhere'],
    emergency_suitable: true,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 360,
  },

  // ========== HOMEWORK (need +3) ==========
  {
    title: "Homework avoidance - fear of failure",
    profile: 'INTENSE',
    category: 'Homework',
    situation_trigger: 'Child completely avoiding starting homework because they\'re terrified it won\'t be good enough',
    phrase_1: 'Starting feels impossible right now.',
    phrase_2: 'You want it to be amazing, AND not starting guarantees it won\'t be.',
    phrase_3: 'One sentence or set timer for 5 minutes? You pick the first step.',
    wrong_way: '"If you\'d just START you\'d be done by now! You\'re making this worse by avoiding it!"',
    neurological_tip: 'INTENSE kids experience homework as performance that defines their worth. Breaking it into microscopic first steps removes the "all or nothing" pressure.',
    parent_state: ['patient', 'encouraging'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 420,
  },

  {
    title: "Homework rage quit after one wrong answer",
    profile: 'INTENSE',
    category: 'Homework',
    situation_trigger: 'Child getting one problem wrong and deciding they\'re too stupid, shutting down or destroying work',
    phrase_1: 'One mistake feels like total failure.',
    phrase_2: 'You wanted all correct, AND learning means some wrong answers.',
    phrase_3: 'Circle it to fix later or ask for help? Then move to next one.',
    wrong_way: '"One wrong answer doesn\'t mean anything! You know this stuff! Just keep going!"',
    neurological_tip: 'INTENSE brains tie performance to identity. Reframing mistakes as part of learning + continuing forward prevents shame shutdown.',
    parent_state: ['calm', 'matter-of-fact'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 180,
  },

  {
    title: "Homework perfectionism - erasing repeatedly",
    profile: 'INTENSE',
    category: 'Homework',
    situation_trigger: 'Child erasing and rewriting same answer over and over, creating holes in paper, never satisfied',
    phrase_1: 'Nothing looks right to you.',
    phrase_2: 'You want it perfect, AND the erasing is destroying the paper.',
    phrase_3: 'Write in pen or use pencil without erasing? Pick one, move forward.',
    wrong_way: '"It\'s fine! Stop erasing! Your teacher doesn\'t care if it\'s messy! Just finish it!"',
    neurological_tip: 'INTENSE perfectionism creates paralysis. Forced choice between tools removes the "perfect" option, making progress possible.',
    parent_state: ['firm', 'calm'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
  },

  // ========== HYGIENE (need +3) ==========
  {
    title: "Shower refusal - hair washing agony",
    profile: 'INTENSE',
    category: 'Hygiene',
    situation_trigger: 'Child melting down about washing hair, experiencing it as genuinely painful and overwhelming',
    phrase_1: 'Hair washing feels torturous to you.',
    phrase_2: 'You want clean hair, AND your scalp screams at you.',
    phrase_3: 'You wash or I wash gently? Happens either way, you pick how.',
    wrong_way: '"It doesn\'t hurt! Stop being dramatic! Everyone washes their hair! Just do it!"',
    neurological_tip: 'INTENSE kids have heightened sensory sensitivity. Acknowledging the genuine pain + control over method prevents full refusal.',
    parent_state: ['firm', 'understanding'],
    location_type: ['home', 'bathroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 180,
  },

  {
    title: "Morning hygiene battle - running late",
    profile: 'INTENSE',
    category: 'Hygiene',
    situation_trigger: 'Child refusing to wash face/brush teeth when running late, feeling rushed makes everything worse',
    phrase_1: 'Being rushed makes you want to refuse.',
    phrase_2: 'You hate the time pressure, AND face and teeth happen before leaving.',
    phrase_3: 'Quick wipe or full wash? You choose, I time 2 minutes.',
    wrong_way: '"We don\'t have TIME for this! You should have gotten up earlier! Just DO IT!"',
    neurological_tip: 'INTENSE kids resist when feeling controlled by time. Naming the resistance + minimal viable option + clear timer gives autonomy within limits.',
    parent_state: ['firm', 'urgent', 'calm'],
    location_type: ['home', 'bathroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
  },

  {
    title: "Hygiene shame after accident",
    profile: 'INTENSE',
    category: 'Hygiene',
    situation_trigger: 'Child having accident (bedwetting, daytime accident) and experiencing crushing shame, refusing help',
    phrase_1: 'Your body feels like it betrayed you.',
    phrase_2: 'You wanted to stay clean, AND accidents happen to everyone.',
    phrase_3: 'Clean up yourself or I help quietly? No one else knows, you choose.',
    wrong_way: '"It\'s not a big deal! Let\'s just clean it up! Stop crying, you\'re making it worse!"',
    neurological_tip: 'INTENSE kids experience body failures as moral failures. Externalizing "body betrayal" + privacy protection preserves dignity during cleanup.',
    parent_state: ['compassionate', 'discrete', 'calm'],
    location_type: ['home', 'bathroom'],
    emergency_suitable: true,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 240,
  },

  // ========== MEALTIME (need +3) ==========
  {
    title: "Mealtime anxiety - new food terror",
    profile: 'INTENSE',
    category: 'Mealtime',
    situation_trigger: 'Child panicking about new or different food on plate, experiencing genuine fear and disgust',
    phrase_1: 'That food looks scary to you.',
    phrase_2: 'You want to feel safe eating, AND dinner is what\'s served.',
    phrase_3: 'One tiny taste or smell it only? Then eat your safe foods.',
    wrong_way: '"It\'s just food! You liked this before! Take a bite or no dessert!"',
    neurological_tip: 'INTENSE kids experience food aversions as phobic-level fear. Minimal exposure (smell only) + permission to refuse prevents mealtime trauma.',
    parent_state: ['calm', 'neutral'],
    location_type: ['home', 'restaurant'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 180,
  },

  {
    title: "Mealtime rage - food touching on plate",
    profile: 'INTENSE',
    category: 'Mealtime',
    situation_trigger: 'Child melting down because different foods touched each other, refusing to eat any of it',
    phrase_1: 'The foods touching ruined everything.',
    phrase_2: 'You needed them separate, AND this is what we have.',
    phrase_3: 'Eat around it or separate plate? Pick one, then dinner continues.',
    wrong_way: '"It all mixes in your stomach anyway! This is ridiculous! Eat it or go hungry!"',
    neurological_tip: 'INTENSE kids catastrophize sensory violations. Acknowledging the "ruined" feeling + offering solution preserves the meal.',
    parent_state: ['patient', 'matter-of-fact'],
    location_type: ['home', 'restaurant'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
  },

  {
    title: "Mealtime control battle - refusing to eat",
    profile: 'INTENSE',
    category: 'Mealtime',
    situation_trigger: 'Child refusing to eat anything as power move after conflict, saying they\'re not hungry',
    phrase_1: 'You want control over your body.',
    phrase_2: 'You decide if you eat, AND food stays out 20 minutes.',
    phrase_3: 'Eat now or wait until next meal? Your body, your choice.',
    wrong_way: '"You WILL eat this! I worked hard on dinner! Sit there until you finish!"',
    neurological_tip: 'INTENSE kids make eating about autonomy. Giving full control over IF they eat (with natural consequence) ends the power struggle.',
    parent_state: ['calm', 'firm', 'neutral'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
  },

  // ========== MORNING_ROUTINES (need +3) ==========
  {
    title: "Morning paralysis - outfit doesn't feel right",
    profile: 'INTENSE',
    category: 'Morning_Routines',
    situation_trigger: 'Child unable to function because outfit feels wrong, changing repeatedly, becoming more distressed',
    phrase_1: 'Nothing feels right on your body.',
    phrase_2: 'You want to feel comfortable, AND we leave in 5 minutes.',
    phrase_3: 'Wear it anyway or yesterday\'s clothes? Pick now, we\'re leaving.',
    wrong_way: '"You look FINE! No one cares what you\'re wearing! We\'re going to be late because of this!"',
    neurological_tip: 'INTENSE kids experience sensory discomfort as unbearable. Time limit + comfort option (yesterday\'s familiar clothes) prevents prolonged struggle.',
    parent_state: ['firm', 'urgent'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
  },

  {
    title: "Morning meltdown - woke up wrong",
    profile: 'INTENSE',
    category: 'Morning_Routines',
    situation_trigger: 'Child waking up in terrible mood, everything is wrong, day feels ruined before it starts',
    phrase_1: 'You woke up feeling terrible.',
    phrase_2: 'Everything feels wrong right now, AND the day is still happening.',
    phrase_3: 'Start over in bathroom or 2-minute quiet time? Then we move forward.',
    wrong_way: '"You need to change your attitude! I\'m not dealing with this all day! Snap out of it!"',
    neurological_tip: 'INTENSE kids wake with emotional hangovers. Physical reset (cold water) or brief isolation lets them regulate before facing demands.',
    parent_state: ['calm', 'firm', 'understanding'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 180,
  },

  {
    title: "Morning resistance - doesn't want to go to school",
    profile: 'INTENSE',
    category: 'Morning_Routines',
    situation_trigger: 'Child refusing to get ready for school, saying they can\'t face it, becoming increasingly distressed',
    phrase_1: 'School feels impossible today.',
    phrase_2: 'You want to stay home, AND you\'re going to school.',
    phrase_3: 'Get ready yourself or I help you? Either way, we leave at 7:45.',
    wrong_way: '"You don\'t have a choice! Everyone goes to school! Stop complaining and get dressed!"',
    neurological_tip: 'INTENSE kids experience anticipatory dread as crisis-level. Acknowledging "impossible" + non-negotiable reality + autonomy over HOW prevents escalation.',
    parent_state: ['firm', 'empathetic', 'calm'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 240,
  },

  // ========== PROBLEM_SOLVING (need +3) ==========
  {
    title: "Problem-solving shutdown - can't see solutions",
    profile: 'INTENSE',
    category: 'Problem_Solving',
    situation_trigger: 'Child stuck in black-and-white thinking, can\'t brainstorm solutions, seeing only catastrophe',
    phrase_1: 'Your brain sees no way out.',
    phrase_2: 'You want a perfect solution, AND we need to find any solution.',
    phrase_3: 'I suggest three ideas or you think of one? We pick something today.',
    wrong_way: '"Just think of something! Use your brain! There are tons of solutions if you\'d just TRY!"',
    neurological_tip: 'INTENSE brains catastrophize and shutdown. Offering to generate options removes the pressure, or they maintain control by finding one solution.',
    parent_state: ['calm', 'supportive'],
    location_type: ['home', 'anywhere'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 300,
  },

  {
    title: "Problem-solving rage - solution isn't perfect",
    profile: 'INTENSE',
    category: 'Problem_Solving',
    situation_trigger: 'Child rejecting every possible solution because none of them are exactly what they wanted',
    phrase_1: 'No solution feels good enough.',
    phrase_2: 'You want the perfect fix, AND we have to pick from real options.',
    phrase_3: 'Best available option or problem stays? You decide in 2 minutes.',
    wrong_way: '"You can\'t have everything perfect! Pick one or I\'m picking for you! Stop being so difficult!"',
    neurological_tip: 'INTENSE perfectionism creates solution paralysis. Time limit + consequence of inaction forces movement past "perfect" waiting.',
    parent_state: ['firm', 'calm'],
    location_type: ['home', 'anywhere'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 180,
  },

  {
    title: "Problem-solving blame spiral",
    profile: 'INTENSE',
    category: 'Problem_Solving',
    situation_trigger: 'Child stuck blaming themselves or others for problem, unable to move into solution mode',
    phrase_1: 'You\'re stuck on who\'s fault it is.',
    phrase_2: 'You want to figure out blame, AND we need to fix the problem.',
    phrase_3: 'Talk about fault later or solve it now? We only do one.',
    wrong_way: '"It doesn\'t matter whose fault it is! Let\'s just fix it! Stop dwelling on it!"',
    neurological_tip: 'INTENSE kids get stuck in justice/blame loops. Separating blame discussion from solution allows them to move forward without feeling unheard.',
    parent_state: ['calm', 'firm', 'redirecting'],
    location_type: ['home', 'school', 'anywhere'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 240,
  },

  // ========== SCREENS (need +3) ==========
  {
    title: "Screen transition rage - mid-episode shutdown",
    profile: 'INTENSE',
    category: 'Screens',
    situation_trigger: 'Screen time ending in middle of show/video, child experiencing it as genuine loss and grief',
    phrase_1: 'You\'re devastated it\'s ending right now.',
    phrase_2: 'You needed to see the ending, AND screen time is over.',
    phrase_3: 'Bookmark it for tomorrow or find stopping point? Then screen goes off.',
    wrong_way: '"I don\'t care that it\'s not over! Time\'s up means time\'s up! Hand it over NOW!"',
    neurological_tip: 'INTENSE kids experience interruption as genuine grief. Offering preservation (bookmark) or brief control (stopping point) acknowledges the loss.',
    parent_state: ['firm', 'empathetic'],
    location_type: ['home', 'car'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 180,
  },

  {
    title: "Screen addiction argument - negotiating for more",
    profile: 'INTENSE',
    category: 'Screens',
    situation_trigger: 'Child intensely bargaining, arguing, pleading for more screen time with increasing desperation',
    phrase_1: 'You desperately want more time.',
    phrase_2: 'Your brain is screaming for it, AND the answer is no.',
    phrase_3: 'Hand it over calmly or I take it? Count of 3. One...',
    wrong_way: '"I already said NO! Stop asking! You\'re being manipulative! This is why you can\'t have screens!"',
    neurological_tip: 'INTENSE kids experience screen removal as withdrawal. Naming the craving + firm boundary + forced choice ends the negotiation loop.',
    parent_state: ['firm', 'calm', 'authoritative'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
  },

  {
    title: "Screen comparison rage - sibling has more time",
    profile: 'INTENSE',
    category: 'Screens',
    situation_trigger: 'Child furious that sibling got/has more screen time, experiencing it as profound unfairness',
    phrase_1: 'This feels completely unfair.',
    phrase_2: 'You want the same as them, AND you each have different rules.',
    phrase_3: 'Use your time now or save it? Your time, your choice.',
    wrong_way: '"Life isn\'t fair! They\'re older! Stop comparing! Be grateful for what you get!"',
    neurological_tip: 'INTENSE kids catastrophize perceived injustice. Redirecting to their autonomy over their own time breaks the comparison spiral.',
    parent_state: ['calm', 'firm'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
  },

  // ========== SOCIAL (need +3) ==========
  {
    title: "Social rejection - not invited to party",
    profile: 'INTENSE',
    category: 'Social',
    situation_trigger: 'Child discovering they weren\'t invited to peer\'s party, experiencing crushing social pain',
    phrase_1: 'Being left out feels crushing.',
    phrase_2: 'You wanted to be included, AND they chose differently.',
    phrase_3: 'Cry it out or plan something else? I\'m here either way.',
    wrong_way: '"Their loss! You don\'t need them! There will be other parties! Stop crying!"',
    neurological_tip: 'INTENSE kids feel social exclusion as genuine trauma. Matching their "crushing" experience + offering emotional outlet or forward action validates the pain.',
    parent_state: ['empathetic', 'present', 'supportive'],
    location_type: ['home', 'anywhere'],
    emergency_suitable: true,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 420,
  },

  {
    title: "Social conflict - friendship fight devastation",
    profile: 'INTENSE',
    category: 'Social',
    situation_trigger: 'Child in all-consuming distress after fight with friend, convinced friendship is over forever',
    phrase_1: 'You think you lost them forever.',
    phrase_2: 'The fight feels friendship-ending, AND most friends work through fights.',
    phrase_3: 'Message them or wait until school? You decide the next move.',
    wrong_way: '"You\'re being dramatic! You guys fight all the time! You\'ll be fine tomorrow!"',
    neurological_tip: 'INTENSE kids catastrophize conflict as permanent loss. Acknowledging the "forever" fear + realistic reframe + control over reconciliation path prevents spiral.',
    parent_state: ['calm', 'reassuring', 'supportive'],
    location_type: ['home', 'anywhere'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 360,
  },

  {
    title: "Social anxiety - refusing party or event",
    profile: 'INTENSE',
    category: 'Social',
    situation_trigger: 'Child panicking before social event, convinced something terrible will happen, refusing to go',
    phrase_1: 'Your brain is screaming danger.',
    phrase_2: 'You feel terrified of what might happen, AND we\'re going to try.',
    phrase_3: 'Go for 15 minutes or I stay nearby? You pick your safety plan.',
    wrong_way: '"There\'s nothing to be scared of! You\'ll have fun once you\'re there! Stop being ridiculous!"',
    neurological_tip: 'INTENSE kids experience social anxiety as genuine threat. Exit plan (15 min trial) or proximity safety gives them control over the fear.',
    parent_state: ['calm', 'reassuring', 'firm'],
    location_type: ['home', 'car'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 240,
  },

  // ========== TANTRUMS (need +3) ==========
  {
    title: "Tantrum from disappointment - event cancelled",
    profile: 'INTENSE',
    category: 'Tantrums',
    situation_trigger: 'Child having full meltdown because anticipated event was cancelled, experiencing it as grief',
    phrase_1: 'You are absolutely devastated.',
    phrase_2: 'You were counting on this, AND it\'s not happening.',
    phrase_3: 'Scream it out or break down crying? Let it out, then we talk.',
    wrong_way: '"It\'s not the end of the world! We\'ll do it another time! Calm down right now!"',
    neurological_tip: 'INTENSE kids grieve lost plans as genuine loss. Permission to fully express grief + delay of problem-solving allows emotional completion.',
    parent_state: ['empathetic', 'present', 'calm'],
    location_type: ['home', 'anywhere'],
    emergency_suitable: true,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 360,
  },

  {
    title: "Tantrum from change in routine",
    profile: 'INTENSE',
    category: 'Tantrums',
    situation_trigger: 'Child melting down because expected routine changed, experiencing loss of control and predictability',
    phrase_1: 'Everything feels wrong and different.',
    phrase_2: 'You needed it to be the same, AND today is different.',
    phrase_3: 'Melt down here or private space? Pick where, then we adjust.',
    wrong_way: '"You need to be flexible! Life changes! You can\'t meltdown every time something is different!"',
    neurological_tip: 'INTENSE kids experience routine changes as destabilizing loss. Offering location choice for meltdown preserves dignity while allowing regulation.',
    parent_state: ['calm', 'understanding'],
    location_type: ['home', 'public', 'anywhere'],
    emergency_suitable: true,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 300,
  },

  {
    title: "Tantrum from sibling conflict",
    profile: 'INTENSE',
    category: 'Tantrums',
    situation_trigger: 'Child having explosive tantrum after sibling interaction, feeling victimized and enraged',
    phrase_1: 'You feel completely wronged.',
    phrase_2: 'They did something that hurt you, AND you\'re out of control right now.',
    phrase_3: 'Separate spaces or tell me what happened? You choose, hitting is not okay.',
    wrong_way: '"I don\'t care who started it! Both of you stop! You\'re acting like babies!"',
    neurological_tip: 'INTENSE kids experience sibling conflict as injustice requiring immediate justice. Separating regulation from justice-seeking prevents escalation.',
    parent_state: ['firm', 'calm', 'fair'],
    location_type: ['home'],
    emergency_suitable: true,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 240,
  },

  // ========== TRANSITIONS (need +2) ==========
  {
    title: "Transition grief - leaving fun activity",
    profile: 'INTENSE',
    category: 'Transitions',
    situation_trigger: 'Child experiencing genuine grief when ending enjoyable activity, unable to move forward',
    phrase_1: 'Leaving feels like losing something.',
    phrase_2: 'You want to stay forever, AND it\'s time to go.',
    phrase_3: 'Take photo or plan when we return? Then we leave.',
    wrong_way: '"We had plenty of time! Stop whining! Say goodbye, we\'re leaving NOW!"',
    neurological_tip: 'INTENSE kids experience transitions as loss. Documentation (photo) or future plan preserves the experience and eases letting go.',
    parent_state: ['empathetic', 'firm'],
    location_type: ['public', 'park', 'anywhere'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 180,
  },

  {
    title: "Transition paralysis - can't stop current task",
    profile: 'INTENSE',
    category: 'Transitions',
    situation_trigger: 'Child frozen and unable to stop current activity, feeling like it MUST be finished perfectly',
    phrase_1: 'Stopping feels impossible right now.',
    phrase_2: 'You need it finished, AND we have to go now.',
    phrase_3: 'Leave it as-is or take it with you? Pick one, we leave in 30 seconds.',
    wrong_way: '"It doesn\'t have to be perfect! Leave it! We\'re going to be late because of you!"',
    neurological_tip: 'INTENSE perfectionism creates transition paralysis. Preserving the work (take it) or accepting imperfection (leave it) forces movement while giving control.',
    parent_state: ['firm', 'urgent'],
    location_type: ['home', 'anywhere'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
  },
];

console.log('🎯 Inserting 32 INTENSE-specific NEP scripts...\n');

let successCount = 0;
let errorCount = 0;

for (const script of intensiveScripts) {
  console.log(`📝 Creating: ${script.title} (${script.category})`);

  const { error } = await supabase
    .from('scripts')
    .insert([script]);

  if (error) {
    console.error(`   ❌ Error: ${error.message}`);
    errorCount++;
  } else {
    console.log(`   ✅ Success!`);
    successCount++;
  }
}

console.log('\n' + '='.repeat(60));
console.log(`✨ INTENSE Scripts Insertion Complete!`);
console.log(`   ✅ Successful: ${successCount}`);
console.log(`   ❌ Failed: ${errorCount}`);
console.log('='.repeat(60));

// Verify distribution
console.log('\n📊 Verifying INTENSE script distribution by category...\n');

const { data: intensiveData } = await supabase
  .from('scripts')
  .select('category')
  .eq('profile', 'INTENSE')
  .order('category');

const categoryCount = {};
intensiveData?.forEach(script => {
  const cat = script.category || 'unknown';
  categoryCount[cat] = (categoryCount[cat] || 0) + 1;
});

Object.entries(categoryCount)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .forEach(([cat, count]) => {
    const target = cat === 'Transitions' ? 4 : 4; // All should have 4 now
    const status = count >= target ? '✅' : '⚠️';
    console.log(`  ${status} ${cat}: ${count}/4 scripts`);
  });

console.log(`\n📈 Total INTENSE scripts: ${intensiveData?.length || 0}`);
