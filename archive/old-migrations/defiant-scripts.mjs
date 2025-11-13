import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const defiantScripts = [
  // BEDTIME (need 3 more) - DEFIANT currently has 1
  {
    title: "Bedtime refusal - endless negotiation",
    profile: 'DEFIANT',
    category: 'Bedtime',
    situation_trigger: 'Child keeps negotiating, "just 5 more minutes", refusing to accept bedtime is non-negotiable',
    phrase_1: 'You hate being told when to sleep.',
    phrase_2: 'You want to stay up as long as you want, AND your body needs sleep by 8:30.',
    phrase_3: 'Pajamas now or lose morning screen time. Choose in 3 seconds. Three, two...',
    wrong_way: '"Stop arguing with me! I don\'t care what you want, it\'s bedtime NOW! Go to your room this instant!"',
    neurological_tip: 'DEFIANT brains see negotiation as control. Name their autonomy need, state the boundary, then force choice with countdown. No debate = no power struggle fuel.',
    parent_state: ['firm', 'calm', 'authoritative'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90
  },
  {
    title: "Bedtime - refusing to stay in bed",
    profile: 'DEFIANT',
    category: 'Bedtime',
    situation_trigger: 'Child keeps getting out of bed, coming downstairs, testing if you will enforce boundary',
    phrase_1: 'You want to be in charge of you.',
    phrase_2: 'You want to come out whenever you decide, AND bedroom door stays closed after lights out.',
    phrase_3: 'Stay in bed or door gets locked from outside. Count of 3. One, two...',
    wrong_way: '"Every single night with you! Why can\'t you just LISTEN? Get back in that bed right now!"',
    neurological_tip: 'Repeated testing is DEFIANT brain checking if boundary is real. Calm enforcement without emotion teaches boundary is fixed, not negotiable.',
    parent_state: ['firm', 'calm', 'consistent'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 75
  },
  {
    title: "Bedtime - demanding parent stay in room",
    profile: 'DEFIANT',
    category: 'Bedtime',
    situation_trigger: 'Child insisting you must stay in room, crying or yelling if you try to leave, controlling your movement',
    phrase_1: 'You don\'t want me to leave.',
    phrase_2: 'You want me here all night, AND I leave after 2 minutes of quiet body.',
    phrase_3: 'Lie still and breathe or I leave now. You choose. Five, four...',
    wrong_way: '"I\'m not your servant! You can\'t control me! I\'m leaving and you\'ll deal with it!"',
    neurological_tip: 'DEFIANT kids often try to control parent behavior. Forced choice puts decision back on their behavior, not their demands.',
    parent_state: ['firm', 'calm', 'boundaried'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Medium (2-5min)',
    expected_time_seconds: 180
  },

  // EMOTIONAL_REGULATION (need 3 more) - DEFIANT currently has 1
  {
    title: "Emotional regulation - refusing to calm down",
    profile: 'DEFIANT',
    category: 'Emotional_Regulation',
    situation_trigger: 'Child escalating emotionally and refusing any calming strategy you suggest, saying "no" to everything',
    phrase_1: 'You don\'t want me telling you how to feel.',
    phrase_2: 'You want to handle this yourself, AND loud screaming moves to your room or outside.',
    phrase_3: 'Pick your calm-down spot: room or backyard. Count of 3. One, two...',
    wrong_way: '"You need to calm down RIGHT NOW! Stop this tantrum! Take a deep breath because I said so!"',
    neurological_tip: 'DEFIANT brains resist being told how to regulate. Giving choice of location preserves autonomy while enforcing boundary on volume/impact.',
    parent_state: ['firm', 'calm', 'respectful'],
    location_type: ['home', 'any'],
    emergency_suitable: false,
    success_speed: 'Medium (2-5min)',
    expected_time_seconds: 200
  },
  {
    title: "Emotional regulation - destroying things when angry",
    profile: 'DEFIANT',
    category: 'Emotional_Regulation',
    situation_trigger: 'Child throwing, hitting, or breaking objects during emotional escalation to assert control',
    phrase_1: 'You feel like breaking things.',
    phrase_2: 'You want to show how mad you are, AND things in this house stay safe.',
    phrase_3: 'Hit the couch pillows or go outside to yell. Choose now. Three, two...',
    wrong_way: '"STOP IT! You\'re acting like a baby! You\'re going to replace everything you break with your own money!"',
    neurological_tip: 'DEFIANT need for physical expression of anger is real. Redirect to safe outlet with forced choice prevents property damage without shaming emotion.',
    parent_state: ['firm', 'calm', 'protective'],
    location_type: ['home', 'any'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60
  },
  {
    title: "Emotional regulation - refusing to leave a situation",
    profile: 'DEFIANT',
    category: 'Emotional_Regulation',
    situation_trigger: 'Child emotionally escalated but refusing to step away, insisting on staying to argue or "finish" the conflict',
    phrase_1: 'You don\'t want to walk away.',
    phrase_2: 'You want to stay and fight this out, AND we pause when bodies are activated.',
    phrase_3: 'Walk away for 5 minutes or lose device tonight. Decide now. Five, four...',
    wrong_way: '"You\'re out of control! Leave this room immediately! I don\'t want to see your face right now!"',
    neurological_tip: 'DEFIANT brains see walking away as losing. Frame it as timed pause (not defeat) with consequence for refusing preserves their dignity.',
    parent_state: ['firm', 'calm', 'de-escalating'],
    location_type: ['home', 'any'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90
  },

  // HOMEWORK (need 3 more) - DEFIANT currently has 1
  {
    title: "Homework - refusing to start",
    profile: 'DEFIANT',
    category: 'Homework',
    situation_trigger: 'Child avoiding homework, saying "I\'ll do it later", testing if you\'ll enforce it',
    phrase_1: 'You hate being told when to work.',
    phrase_2: 'You want to start when you feel like it, AND homework finishes before any screens.',
    phrase_3: 'Start now or no devices until it\'s done. Count of 5. Five, four...',
    wrong_way: '"You ALWAYS do this! Why can\'t you just do your homework without a fight? Sit down NOW!"',
    neurological_tip: 'DEFIANT brains resist imposed timelines. State the sequence (homework then screens) as reality, not punishment. Consequence is natural, not arbitrary.',
    parent_state: ['firm', 'calm', 'matter-of-fact'],
    location_type: ['home', 'study_area'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 75
  },
  {
    title: "Homework - demanding you do it for them",
    profile: 'DEFIANT',
    category: 'Homework',
    situation_trigger: 'Child trying to control you into doing their work, saying "I can\'t" or "you have to help me"',
    phrase_1: 'You want me to do it for you.',
    phrase_2: 'You want me to give you all the answers, AND this is your work to complete.',
    phrase_3: 'Try it yourself or explain what you don\'t understand. Pick one. Three, two...',
    wrong_way: '"I\'m not doing your homework! You\'re being lazy! Figure it out yourself or fail, I don\'t care!"',
    neurological_tip: 'DEFIANT kids test if they can control parent effort. Forced choice between trying independently or asking specific questions blocks manipulation.',
    parent_state: ['firm', 'calm', 'boundaried'],
    location_type: ['home', 'study_area'],
    emergency_suitable: false,
    success_speed: 'Medium (2-5min)',
    expected_time_seconds: 150
  },
  {
    title: "Homework - arguing about the assignment",
    profile: 'DEFIANT',
    category: 'Homework',
    situation_trigger: 'Child complaining homework is stupid, pointless, too hard, trying to debate whether they should have to do it',
    phrase_1: 'You think this homework is pointless.',
    phrase_2: 'You don\'t want to do work that feels dumb, AND your teacher assigned it so it gets done.',
    phrase_3: 'Do it quietly or complain to your teacher tomorrow. Choose now. Five, four...',
    wrong_way: '"I don\'t care what you think! The teacher gave it, so you\'re doing it! Stop whining!"',
    neurological_tip: 'DEFIANT brains want to debate authority. Validate opinion, state reality, redirect complaint to appropriate authority figure (teacher). No debate with parent.',
    parent_state: ['firm', 'calm', 'non-reactive'],
    location_type: ['home', 'study_area'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 80
  },

  // HYGIENE (need 3 more) - DEFIANT currently has 1
  {
    title: "Hygiene - refusing to shower",
    profile: 'DEFIANT',
    category: 'Hygiene',
    situation_trigger: 'Child saying "no" to shower, arguing they showered recently, testing if boundary is enforced',
    phrase_1: 'You don\'t want me controlling your body.',
    phrase_2: 'You want to decide when you wash, AND shower happens before screen time tonight.',
    phrase_3: 'Shower now or no devices until you do. Count of 3. One, two...',
    wrong_way: '"You smell terrible! Everyone can smell you! Get in that shower right now or you\'re grounded!"',
    neurological_tip: 'DEFIANT brains see hygiene demands as bodily control. Link to natural consequence (no preferred activity until complete) removes power struggle.',
    parent_state: ['firm', 'calm', 'matter-of-fact'],
    location_type: ['home', 'bathroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90
  },
  {
    title: "Hygiene - refusing to brush teeth",
    profile: 'DEFIANT',
    category: 'Hygiene',
    situation_trigger: 'Child saying they already brushed (lying), refusing to do it again, testing your enforcement',
    phrase_1: 'You hate being told what to do with your mouth.',
    phrase_2: 'You want to skip brushing tonight, AND teeth get brushed before bed every single night.',
    phrase_3: 'Brush for 2 minutes or lose morning treat. Choose now. Three, two...',
    wrong_way: '"I know you didn\'t brush! You\'re lying to me! Get in there and brush or you\'ll have no teeth!"',
    neurological_tip: 'DEFIANT kids lie to preserve autonomy. Don\'t debate if they did it - state the requirement and consequence calmly. No power struggle over truth.',
    parent_state: ['firm', 'calm', 'consistent'],
    location_type: ['home', 'bathroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60
  },
  {
    title: "Hygiene - refusing to wash hands before eating",
    profile: 'DEFIANT',
    category: 'Hygiene',
    situation_trigger: 'Child sitting down to eat without washing hands, saying "they\'re fine" when you ask them to wash',
    phrase_1: 'You don\'t want to stop what you\'re doing.',
    phrase_2: 'You want to eat right now, AND clean hands touch the food in this house.',
    phrase_3: 'Wash hands or food waits. You choose. Count of 5. Five, four...',
    wrong_way: '"That\'s disgusting! Do you want to get sick? Go wash your hands NOW before you touch anything!"',
    neurological_tip: 'DEFIANT brains resist interruptions. State hygiene as prerequisite to desired activity (eating). Food waiting is natural consequence, not punishment.',
    parent_state: ['firm', 'calm', 'health-focused'],
    location_type: ['home', 'kitchen'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 45
  },

  // MEALTIME (need 3 more) - DEFIANT currently has 1
  {
    title: "Mealtime - refusing to come to table",
    profile: 'DEFIANT',
    category: 'Mealtime',
    situation_trigger: 'Child ignoring calls to dinner, saying "in a minute", testing if you\'ll enforce attendance',
    phrase_1: 'You don\'t want to stop your activity.',
    phrase_2: 'You want to come when you feel like it, AND dinner is served once at 6pm.',
    phrase_3: 'Come now or food gets put away. Count of 3. One, two...',
    wrong_way: '"I\'ve called you 5 times! This is so disrespectful! Get to this table RIGHT NOW or no dinner!"',
    neurological_tip: 'DEFIANT brains test if timeline is real. One call, one countdown, immediate consequence. No repeated requests = no power struggle.',
    parent_state: ['firm', 'calm', 'consistent'],
    location_type: ['home', 'kitchen'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60
  },
  {
    title: "Mealtime - demanding different food",
    profile: 'DEFIANT',
    category: 'Mealtime',
    situation_trigger: 'Child refusing what\'s served, demanding you make something else, trying to control the menu',
    phrase_1: 'You want to choose what you eat.',
    phrase_2: 'You don\'t like what I made, AND this is what\'s for dinner tonight.',
    phrase_3: 'Eat what\'s here or make a sandwich. Decide now. Five, four...',
    wrong_way: '"I\'m not a short-order cook! You get what you get and you don\'t throw a fit! Eat it or starve!"',
    neurological_tip: 'DEFIANT brains fight imposed choices. Offering simple alternative (sandwich) preserves autonomy while maintaining boundary on special requests.',
    parent_state: ['firm', 'calm', 'matter-of-fact'],
    location_type: ['home', 'kitchen'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 75
  },
  {
    title: "Mealtime - leaving table without permission",
    profile: 'DEFIANT',
    category: 'Mealtime',
    situation_trigger: 'Child getting up from table repeatedly, not asking to be excused, testing mealtime boundaries',
    phrase_1: 'You don\'t want to ask permission to move.',
    phrase_2: 'You want to get up whenever you want, AND you stay seated until meal is done.',
    phrase_3: 'Sit until dismissed or dinner is over for you. Choose. Three, two...',
    wrong_way: '"Sit DOWN! You don\'t just get up from the table! We have rules in this house! SIT!"',
    neurological_tip: 'DEFIANT brains resist asking permission (feels like submission). State boundary, offer choice to comply or lose privilege of continuing meal.',
    parent_state: ['firm', 'calm', 'authoritative'],
    location_type: ['home', 'kitchen'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 50
  },

  // MORNING_ROUTINES (need 4) - DEFIANT currently has 0
  {
    title: "Morning routine - refusing to wake up",
    profile: 'DEFIANT',
    category: 'Morning_Routines',
    situation_trigger: 'Child pulling covers over head, saying "no", refusing to get out of bed when it\'s time',
    phrase_1: 'You hate being told to wake up.',
    phrase_2: 'You want to sleep as long as you want, AND we leave for school at 7:30.',
    phrase_3: 'Get up now or I remove the blankets. Count of 3. One, two...',
    wrong_way: '"GET UP RIGHT NOW! You\'re going to make us late AGAIN! I\'m so tired of this every morning!"',
    neurological_tip: 'DEFIANT brains resist being controlled out of sleep. State departure time as fixed reality, then physical consequence (blanket removal) without emotion.',
    parent_state: ['firm', 'calm', 'matter-of-fact'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90
  },
  {
    title: "Morning routine - refusing to get dressed",
    profile: 'DEFIANT',
    category: 'Morning_Routines',
    situation_trigger: 'Child still in pajamas, arguing about clothes, refusing to change when time is running out',
    phrase_1: 'You don\'t want me telling you what to wear.',
    phrase_2: 'You want to pick your own outfit, AND you need clothes on in 3 minutes.',
    phrase_3: 'Get dressed or go in pajamas. You choose. Count of 5. Five, four...',
    wrong_way: '"We don\'t have time for this! Put on these clothes RIGHT NOW! I picked them out, just do it!"',
    neurological_tip: 'DEFIANT brains fight clothing control. Time pressure + choice (your clothes or go in PJs) removes debate. Natural consequence (embarrassment) teaches faster than arguing.',
    parent_state: ['firm', 'calm', 'time-bound'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 75
  },
  {
    title: "Morning routine - refusing to eat breakfast",
    profile: 'DEFIANT',
    category: 'Morning_Routines',
    situation_trigger: 'Child saying they\'re not hungry, refusing breakfast, trying to skip the routine',
    phrase_1: 'You don\'t want to eat right now.',
    phrase_2: 'You\'re not hungry this second, AND your body needs food before school.',
    phrase_3: 'Eat 3 bites or pack it to eat in car. Decide. Three, two...',
    wrong_way: '"You HAVE to eat breakfast! You\'re going to be starving by 10am! Sit down and eat NOW!"',
    neurological_tip: 'DEFIANT brains refuse demands about body needs. Forced choice (eat now or in car) preserves autonomy while ensuring nutrition happens.',
    parent_state: ['firm', 'calm', 'practical'],
    location_type: ['home', 'kitchen'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60
  },
  {
    title: "Morning routine - dawdling to avoid leaving",
    profile: 'DEFIANT',
    category: 'Morning_Routines',
    situation_trigger: 'Child moving slowly, finding reasons to delay, trying to control departure time',
    phrase_1: 'You don\'t want to be rushed.',
    phrase_2: 'You want to control when we leave, AND the car leaves at 7:30 with or without you ready.',
    phrase_3: 'Shoes on now or go barefoot to car. Choose. Count of 3. One, two...',
    wrong_way: '"MOVE FASTER! Why are you always so slow? You\'re doing this on purpose! HURRY UP!"',
    neurological_tip: 'DEFIANT kids dawdle to exert control over timeline. Remove timeline as negotiable - car leaves at fixed time, their choice is ready or not.',
    parent_state: ['firm', 'calm', 'time-bound'],
    location_type: ['home', 'any'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 50
  },

  // PROBLEM_SOLVING (need 3 more) - DEFIANT currently has 1
  {
    title: "Problem solving - refusing to discuss solutions",
    profile: 'DEFIANT',
    category: 'Problem_Solving',
    situation_trigger: 'Child shutting down, saying "I don\'t care" or "whatever" when you try to problem-solve together',
    phrase_1: 'You don\'t want me fixing this for you.',
    phrase_2: 'You want to handle it yourself or not at all, AND this problem needs a solution today.',
    phrase_3: 'Talk it through with me or solve it alone. Choose now. Five, four...',
    wrong_way: '"Don\'t you "whatever" me! We WILL solve this and you WILL participate! Sit down and talk to me NOW!"',
    neurological_tip: 'DEFIANT brains resist collaborative problem-solving (feels like adult control). Offer choice: engage with support or handle independently. Both preserve autonomy.',
    parent_state: ['firm', 'calm', 'respectful'],
    location_type: ['home', 'any'],
    emergency_suitable: false,
    success_speed: 'Medium (2-5min)',
    expected_time_seconds: 180
  },
  {
    title: "Problem solving - blaming everyone else",
    profile: 'DEFIANT',
    category: 'Problem_Solving',
    situation_trigger: 'Child refusing accountability, insisting problem is everyone else\'s fault, won\'t look at their role',
    phrase_1: 'You think everyone else caused this.',
    phrase_2: 'You don\'t want to take any blame, AND you\'re the only person you can control.',
    phrase_3: 'Name one thing you could change or stay stuck. Decide. Three, two...',
    wrong_way: '"Stop blaming everyone! YOU caused this problem! Take responsibility for once in your life!"',
    neurological_tip: 'DEFIANT brains deflect blame to protect autonomy. Acknowledge their view, then redirect to what they control. One small action restores their power.',
    parent_state: ['firm', 'calm', 'reality-based'],
    location_type: ['home', 'any'],
    emergency_suitable: false,
    success_speed: 'Medium (2-5min)',
    expected_time_seconds: 200
  },
  {
    title: "Problem solving - rejecting every suggestion",
    profile: 'DEFIANT',
    category: 'Problem_Solving',
    situation_trigger: 'Child saying "no" to every idea you offer, shooting down solutions without trying',
    phrase_1: 'You don\'t want my ideas.',
    phrase_2: 'You want to find your own solution, AND you need one by tomorrow.',
    phrase_3: 'Create your own plan or pick one of mine. Choose. Count of 5. Five, four...',
    wrong_way: '"You shoot down everything I say! Fine, figure it out yourself then! Don\'t come crying to me!"',
    neurological_tip: 'DEFIANT brains auto-reject parent ideas (feels like submission). Forced choice: generate own solution or choose from offered ones. Both give control.',
    parent_state: ['firm', 'calm', 'solution-focused'],
    location_type: ['home', 'any'],
    emergency_suitable: false,
    success_speed: 'Medium (2-5min)',
    expected_time_seconds: 220
  },

  // SCREENS (need 3 more) - DEFIANT currently has 1
  {
    title: "Screens - refusing to turn off device",
    profile: 'DEFIANT',
    category: 'Screens',
    situation_trigger: 'Child ignoring screen time limit, saying "one more minute", refusing to hand over device',
    phrase_1: 'You don\'t want me controlling your screen.',
    phrase_2: 'You want to decide when you\'re done, AND screen time ends at 8pm every night.',
    phrase_3: 'Turn it off or I take it for tomorrow too. Count of 3. One, two...',
    wrong_way: '"Time\'s up! I don\'t care about your game! Give me that device RIGHT NOW or you\'re grounded!"',
    neurological_tip: 'DEFIANT brains escalate when device is threatened. Name autonomy need, state boundary as fixed, countdown to enforce. Extended loss if they refuse.',
    parent_state: ['firm', 'calm', 'consistent'],
    location_type: ['home', 'any'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 75
  },
  {
    title: "Screens - demanding device back after consequence",
    profile: 'DEFIANT',
    category: 'Screens',
    situation_trigger: 'Child harassing you to return confiscated device, arguing, negotiating, trying to control when they get it back',
    phrase_1: 'You want your device back now.',
    phrase_2: 'You don\'t want to wait until tomorrow, AND the consequence stands as stated.',
    phrase_3: 'Stop asking or it becomes 2 days. Your choice. Count of 3. One, two...',
    wrong_way: '"I already TOLD you no! Stop asking me! You lost it and that\'s final! Leave me alone!"',
    neurological_tip: 'DEFIANT brains test if consequence is negotiable. Extend consequence if harassment continues. Teaches boundary is fixed, not up for debate.',
    parent_state: ['firm', 'calm', 'non-negotiable'],
    location_type: ['home', 'any'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60
  },
  {
    title: "Screens - sneaking device after bedtime",
    profile: 'DEFIANT',
    category: 'Screens',
    situation_trigger: 'You catch child on device after bedtime, they argue "I couldn\'t sleep" or deny they were using it',
    phrase_1: 'You wanted to decide your own bedtime rules.',
    phrase_2: 'You don\'t think the screen rule applies to you, AND devices stay out of bedroom at night.',
    phrase_3: 'Hand it over now or lose it for the weekend. Choose. Three, two...',
    wrong_way: '"I KNEW you\'d do this! You\'re a liar and a sneak! Give me that NOW! You\'re grounded for a month!"',
    neurological_tip: 'DEFIANT brains test rules when unsupervised. Don\'t debate the lie - state the boundary break and consequence. Escalate loss if they refuse compliance.',
    parent_state: ['firm', 'calm', 'authoritative'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 70
  },

  // SOCIAL (need 2 more) - DEFIANT currently has 2
  {
    title: "Social - refusing to apologize after hurting someone",
    profile: 'DEFIANT',
    category: 'Social',
    situation_trigger: 'Child refusing to say sorry after hitting/hurting another child, saying "they deserved it" or "I don\'t care"',
    phrase_1: 'You don\'t want to admit you were wrong.',
    phrase_2: 'You think they deserved it, AND you hurt someone so you make it right.',
    phrase_3: 'Apologize now or sit out until you do. Your move. Count of 5. Five, four...',
    wrong_way: '"Say you\'re sorry RIGHT NOW! I don\'t care what they did! You hurt them! APOLOGIZE!"',
    neurological_tip: 'DEFIANT brains see apologies as submission. Frame as requirement to rejoin activity (natural consequence) not forced admission of fault.',
    parent_state: ['firm', 'calm', 'justice-focused'],
    location_type: ['home', 'public', 'school'],
    emergency_suitable: false,
    success_speed: 'Medium (2-5min)',
    expected_time_seconds: 180
  },
  {
    title: "Social - bossing other kids around",
    profile: 'DEFIANT',
    category: 'Social',
    situation_trigger: 'Child trying to control other children\'s play, dictating all rules, other kids getting upset and leaving',
    phrase_1: 'You want to be in charge of the game.',
    phrase_2: 'You want everyone to follow your rules, AND other kids get to choose too.',
    phrase_3: 'Let others decide or play alone. Pick one. Count of 3. One, two...',
    wrong_way: '"Stop being so bossy! No one wants to play with you when you act like this! Let them have a turn!"',
    neurological_tip: 'DEFIANT brains need control but must learn social limits. Natural consequence (isolation) teaches faster than lecture. Their choice: share control or lose playmates.',
    parent_state: ['firm', 'calm', 'social-teaching'],
    location_type: ['home', 'public', 'playground'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90
  },

  // TANTRUMS (need 3 more) - DEFIANT currently has 1
  {
    title: "Tantrum - public meltdown for control",
    profile: 'DEFIANT',
    category: 'Tantrums',
    situation_trigger: 'Child escalating in public space (store, restaurant) to force you to give in to demand',
    phrase_1: 'You want me to give you what you want.',
    phrase_2: 'You\'re trying to make me say yes by making a scene, AND my answer stays no.',
    phrase_3: 'Calm body or we leave right now. Count of 3. One, two...',
    wrong_way: '"You\'re embarrassing me! Everyone is staring! Fine, FINE, you can have it! Just STOP!"',
    neurological_tip: 'DEFIANT brains escalate in public because it usually works. Calm removal (follow through on leaving) teaches boundary is same everywhere. Never give in.',
    parent_state: ['firm', 'calm', 'unbothered'],
    location_type: ['public', 'store'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 80
  },
  {
    title: "Tantrum - rage when told no",
    profile: 'DEFIANT',
    category: 'Tantrums',
    situation_trigger: 'Child exploding in rage after hearing "no", screaming, slamming things, trying to intimidate you into changing answer',
    phrase_1: 'You hate hearing the word no.',
    phrase_2: 'You want to scare me into changing my mind, AND my answer is still no.',
    phrase_3: 'Go rage in your room or lose tomorrow\'s privilege. Choose. Five, four...',
    wrong_way: '"HOW DARE YOU act like this! You don\'t scare me! Go to your room RIGHT NOW before I really lose it!"',
    neurological_tip: 'DEFIANT brains use intimidation to regain control. Calm, unchanged answer + choice of rage location shows their behavior doesn\'t work. No fear = no power.',
    parent_state: ['firm', 'calm', 'unfazed'],
    location_type: ['home', 'any'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90
  },
  {
    title: "Tantrum - won\'t stop arguing after decision made",
    profile: 'DEFIANT',
    category: 'Tantrums',
    situation_trigger: 'Child continuing to argue, debate, negotiate endlessly after you\'ve made a final decision',
    phrase_1: 'You want to change my mind.',
    phrase_2: 'You think if you keep talking I\'ll give in, AND this decision is final.',
    phrase_3: 'Accept it quietly or lose tomorrow too. Count of 3. One, two...',
    wrong_way: '"ENOUGH! I\'m not discussing this anymore! The answer is NO! Stop talking RIGHT NOW!"',
    neurological_tip: 'DEFIANT brains persist because persistence often works. Escalating consequence for continued debate teaches decision is truly final. One warning, then execute.',
    parent_state: ['firm', 'calm', 'final'],
    location_type: ['home', 'any'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60
  },

  // TRANSITIONS (need 3 more) - DEFIANT currently has 1
  {
    title: "Transition - refusing to leave fun activity",
    profile: 'DEFIANT',
    category: 'Transitions',
    situation_trigger: 'Child refusing to leave playground, friend\'s house, or fun place when it\'s time to go',
    phrase_1: 'You don\'t want me deciding when you leave.',
    phrase_2: 'You want to stay as long as you want, AND we\'re leaving in 2 minutes.',
    phrase_3: 'Walk to car or I carry you. Count of 5. Five, four...',
    wrong_way: '"We\'re leaving NOW! I don\'t care if you\'re having fun! When I say it\'s time, it\'s TIME! Let\'s GO!"',
    neurological_tip: 'DEFIANT brains fight transitions they don\'t control. Brief warning, countdown, then physical follow-through if needed. No extended negotiation.',
    parent_state: ['firm', 'calm', 'time-bound'],
    location_type: ['public', 'playground', 'friend_home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 75
  },
  {
    title: "Transition - refusing to stop screen for other activity",
    profile: 'DEFIANT',
    category: 'Transitions',
    situation_trigger: 'Child glued to screen, ignoring request to transition to dinner, homework, or family time',
    phrase_1: 'You want to decide when you\'re done.',
    phrase_2: 'You don\'t want to stop right now, AND screen goes off in 30 seconds.',
    phrase_3: 'Pause it yourself or I turn off the wifi. Choose. Three, two...',
    wrong_way: '"I\'ve asked you three times! Turn that OFF! You\'re addicted to screens! NOW!"',
    neurological_tip: 'DEFIANT brains need control over stopping. 30-second warning + choice (you stop or I stop it) preserves some autonomy. Follow through on wifi if needed.',
    parent_state: ['firm', 'calm', 'tech-savvy'],
    location_type: ['home', 'any'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60
  },
  {
    title: "Transition - refusing to start getting ready",
    profile: 'DEFIANT',
    category: 'Transitions',
    situation_trigger: 'Child needs to get ready for school/appointment but refusing to start the transition process',
    phrase_1: 'You hate being told to start getting ready.',
    phrase_2: 'You want to keep doing what you\'re doing, AND we leave in 10 minutes no matter what.',
    phrase_3: 'Start now or go as you are. Your choice. Count of 5. Five, four...',
    wrong_way: '"You need to start getting ready NOW! Why do you always wait until the last second? MOVE!"',
    neurological_tip: 'DEFIANT brains dawdle to maintain control. State departure time as non-negotiable, their choice is ready or not. Natural consequence (embarrassment) teaches.',
    parent_state: ['firm', 'calm', 'matter-of-fact'],
    location_type: ['home', 'any'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 70
  }
];

async function insertScripts() {
  console.log(`\n🚀 Starting insertion of ${defiantScripts.length} DEFIANT scripts...\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < defiantScripts.length; i++) {
    const script = defiantScripts[i];
    try {
      const { data, error } = await supabase
        .from('scripts')
        .insert([script])
        .select();

      if (error) {
        errorCount++;
        errors.push({ script: script.title, error: error.message });
        console.log(`❌ Error inserting "${script.title}": ${error.message}`);
      } else {
        successCount++;
        console.log(`✅ [${i + 1}/${defiantScripts.length}] Inserted: ${script.title}`);
      }
    } catch (err) {
      errorCount++;
      errors.push({ script: script.title, error: err.message });
      console.log(`❌ Exception inserting "${script.title}": ${err.message}`);
    }
  }

  console.log(`\n` + '='.repeat(60));
  console.log(`📊 INSERTION SUMMARY`);
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}/${defiantScripts.length}`);
  console.log(`❌ Failed: ${errorCount}/${defiantScripts.length}`);

  if (errors.length > 0) {
    console.log(`\n❌ ERRORS:`);
    errors.forEach(({ script, error }) => {
      console.log(`   - ${script}: ${error}`);
    });
  }

  console.log('='.repeat(60) + '\n');

  // Distribution check
  const distribution = defiantScripts.reduce((acc, script) => {
    acc[script.category] = (acc[script.category] || 0) + 1;
    return acc;
  }, {});

  console.log(`📋 CATEGORY DISTRIBUTION:`);
  Object.entries(distribution).sort().forEach(([category, count]) => {
    console.log(`   ${category}: ${count} scripts`);
  });
  console.log('');
}

// Run the insertion
insertScripts().catch(console.error);

export { defiantScripts };
