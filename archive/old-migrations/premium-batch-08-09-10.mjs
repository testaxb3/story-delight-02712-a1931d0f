import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

// Batches 08-09-10: 18 scripts total
const scripts = [
  // Batch 08
  {
    title: "Pajamas feel wrong - texture refusal",
    profile: 'INTENSE',
    category: 'Bedtime',
    situation_trigger: 'Bedtime routine, time for pajamas. Child refuses specific pair, saying they feel wrong, itchy, or bad. Genuinely distressed by texture.',

    phrase_1: "These pajamas feel wrong on your skin tonight.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You want soft that matches your feeling of soft, AND these are what we have clean.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Wear these, pick different ones, or sleep in underwear. Count of 10.",
    phrase_3_action: "COMMAND",

    wrong_way: "They're FINE! You wore them last week! Stop being so picky! Put them ON or no story!",
    neurological_tip: "INTENSE kids have heightened tactile sensitivity - pajamas that felt fine last week can feel intolerable tonight based on sensory state. Seams, tightness, fabric texture can genuinely hurt. Fighting creates bedtime battle over something they can't control. Naming it ('feel wrong on your skin') validates sensory experience. Choice (these/different ones/underwear) maintains sleep hygiene while respecting their body.",

    parent_state: ['calm', 'patient'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 3,
    age_max: 10,
  },

  {
    title: "Gagging on certain food textures",
    profile: 'INTENSE',
    category: 'Mealtime',
    situation_trigger: 'Mealtime, certain food on plate. Child looks at it and gags or refuses because texture or smell triggers genuine nausea response.',

    phrase_1: "That texture makes your body want to throw up.",
    phrase_1_action: "CONNECTION",
    phrase_2: "Your stomach is rejecting it, AND you need to eat something tonight.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Three bites of safe food or one bite of this. You pick the food OR the amount.",
    phrase_3_action: "COMMAND",

    wrong_way: "You're NOT going to throw up! Just EAT it! Other kids eat this fine! Stop being dramatic! Swallow it!",
    neurological_tip: "INTENSE kids can have genuine texture aversions that trigger gag reflex - it's not choosiness, it's physical response to sensory input. Forcing causes real nausea and creates food trauma. Acknowledging their body's reaction ('makes your body want to throw up') validates the real physical experience. Offering control (pick safe food OR pick amount of challenging food) gives agency while ensuring nutrition.",

    parent_state: ['calm', 'neutral'],
    location_type: ['home', 'kitchen'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
    age_min: 3,
    age_max: 11,
  },

  {
    title: "Needs parent present to fall asleep",
    profile: 'DISTRACTED',
    category: 'Bedtime',
    situation_trigger: "Bedtime, child in bed. Begs you to stay: I need you here, don't leave, I can't sleep alone. Genuine anxiety about being alone with their thoughts.",

    phrase_1: "Your brain won't settle when you're alone.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You want me here until you're asleep, AND I need to leave after tuck-in.",
    phrase_2_action: "VALIDATION",
    phrase_3: "I stay 5 minutes with back rubs, then I leave. Timer starts now.",
    phrase_3_action: "COMMAND",

    wrong_way: "You're not a baby! You can fall asleep alone! I'm not staying here for an hour! Close your eyes and GO TO SLEEP!",
    neurological_tip: "DISTRACTED kids often need external regulation to settle - alone, their mind races or fixates on sounds/thoughts. Your presence provides calming they can't self-generate. Fighting independence battles at bedtime increases arousal. Naming it ('brain won't settle when alone') validates the need. Timed presence (5 min with touch) provides regulation window, then boundary. Gradual fading over weeks builds self-soothing.",

    parent_state: ['calm', 'gentle', 'patient'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 300,
    age_min: 3,
    age_max: 9,
  },

  {
    title: "Post-screen fog - can't remember instructions",
    profile: 'DISTRACTED',
    category: 'Screens',
    situation_trigger: 'Screen time just ended. You ask child what they need to do next. They stare blankly - genuinely can't recall what you said 5 minutes ago.',

    phrase_1: "You just played for an hour and your brain is blank.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You were inside the game, AND now you need to do homework.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Tell me what's next. If you can't remember, I'll say it once then timer starts.",
    phrase_3_action: "COMMAND",

    wrong_way: "I TOLD YOU before screens what to do after! Why can't you remember ANYTHING?! This is why you lose screen time!",
    neurological_tip: "DISTRACTED kids in post-screen fog have genuine working memory impairment - the transition from virtual to reality leaves them blank. They weren't not listening; encoding didn't happen during hyperfocus. Yelling doesn't restore memory. Acknowledging the blank ('your brain is blank') validates experience. Offering re-statement accommodates neurology while maintaining expectation (then timer starts).",

    parent_state: ['calm', 'patient', 'matter-of-fact'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60,
    age_min: 6,
    age_max: 13,
  },

  {
    title: "Defensiveness about hygiene comments",
    profile: 'DEFIANT',
    category: 'Hygiene',
    situation_trigger: 'You tell child they need to shower. They react defensively: I'm FINE, I don't smell, you always criticize me! Taking hygiene reminder as personal attack.',

    phrase_1: "Being told to shower feels like I'm calling you gross.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You want your body to be your business, AND hygiene affects people around you.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Shower now or shower before school tomorrow 20 minutes earlier. Your call.",
    phrase_3_action: "COMMAND",

    wrong_way: "I'm your PARENT! I'm SUPPOSED to tell you to shower! Don't take it personally! You DO smell! It's a FACT!",
    neurological_tip: "DEFIANT kids interpret hygiene directives as judgment of their worth - 'you need to shower' feels like 'you're disgusting.' Their defensiveness is protecting self-image. Fighting about it entrenches resistance. Naming the feeling ('feels like I'm calling you gross') validates the emotional reaction. Reframing (affects people around you) makes it social impact, not personal failure. Choice gives control while ensuring outcome.",

    parent_state: ['calm', 'neutral', 'firm'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 9,
    age_max: 16,
  },

  {
    title: "Fighting hair brushing - autonomy battle",
    profile: 'DEFIANT',
    category: 'Morning_Routines',
    situation_trigger: 'Morning rush, trying to brush child's hair. They pull away, complain, or refuse to sit still. Physical resistance to being touched/styled.',

    phrase_1: "You don't want me controlling your hair.",
    phrase_1_action: "CONNECTION",
    phrase_2: "Your body belongs to you, AND hair needs brushing before school.",
    phrase_2_action: "VALIDATION",
    phrase_3: "You brush or I brush. If I brush and you fight, no TV tonight. Count of three.",
    phrase_3_action: "COMMAND",

    wrong_way: "SIT STILL! Your hair is a RAT'S NEST! You can't go to school like that! Stop FIGHTING me! This is for YOUR benefit!",
    neurological_tip: "DEFIANT kids resist hair care because touch without consent + appearance control = double autonomy violation. Their head is literally their body. Fighting increases resistance. Naming it ('don't want me controlling your hair') validates autonomy drive. Choice (you brush OR I brush) gives control over method while maintaining hygiene standard. Consequence for fighting (not for needing help) separates cooperation from independence.",

    parent_state: ['calm', 'firm'],
    location_type: ['home', 'bathroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
    age_min: 4,
    age_max: 12,
  },

  // Batch 09
  {
    title: "Spiraling about mistake made days ago",
    profile: 'INTENSE',
    category: 'Emotional_Regulation',
    situation_trigger: 'Child suddenly brings up mistake/embarrassment from days/weeks ago. Spiraling emotionally as if it just happened. Can't let it go.',

    phrase_1: "Your brain is replaying something from last week like it's happening now.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You want to go back and fix it, AND time only goes forward.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Tell me what you wish you'd done differently, or write it down and close the book. Pick one.",
    phrase_3_action: "COMMAND",

    wrong_way: "That was LAST WEEK! Let it GO! Everyone forgot about it! You're the only one still thinking about this! Move ON!",
    neurological_tip: "INTENSE kids ruminate on past mistakes because their brain treats social/performance errors as ongoing threats. Time passing doesn't resolve the feeling - it loops until processed. Dismissing it ('everyone forgot') invalidates their real distress. Naming it ('replaying like it's happening now') validates the experience. Offering processing (verbalize OR externalize) helps move it from active loop to integrated memory. This is brain pattern, not character flaw.",

    parent_state: ['empathetic', 'calm', 'patient'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 420,
    age_min: 6,
    age_max: 14,
  },

  {
    title: "Melting down over losing at game/sport",
    profile: 'INTENSE',
    category: 'Tantrums',
    situation_trigger: 'Playing game or sport. Child loses. HUGE emotional response: crying, throwing things, rage, or complete shutdown. Genuine devastation.',

    phrase_1: "Losing feels like failing as a person.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You tie winning to being good enough, AND everyone loses sometimes.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Cry it out for 5 minutes or leave the game. But no throwing/hitting. That ends it permanently.",
    phrase_3_action: "COMMAND",

    wrong_way: "It's JUST A GAME! Everyone loses! You're being a SORE LOSER! No one wants to play with you when you act like this!",
    neurological_tip: "INTENSE kids experience losing as evidence of inadequacy - their self-worth is tied to performance, so losing = being worthless. It's not poor sportsmanship; it's existential threat. Minimizing ('just a game') invalidates real grief. Naming the connection ('losing feels like failing as a person') validates their system. Acknowledging the want (winning proves worth) while introducing reality (everyone loses) is honest. Offering appropriate release (cry) vs inappropriate (violence) teaches expression without suppression.",

    parent_state: ['empathetic', 'firm', 'calm'],
    location_type: ['home', 'public'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 360,
    age_min: 5,
    age_max: 13,
  },

  {
    title: "Wandering away in public - attention drift",
    profile: 'DISTRACTED',
    category: 'Social',
    situation_trigger: 'In store/park/public place. You look away for 10 seconds, child is gone. Not running away - just drifted toward something interesting, forgot you existed.',

    phrase_1: "Something caught your eye and you forgot I was here.",
    phrase_1_action: "CONNECTION",
    phrase_2: "Your brain followed the shiny thing, AND staying near me keeps you safe.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Hold my hand or stay in my sight. Wander off again and we leave immediately.",
    phrase_3_action: "COMMAND",

    wrong_way: "I LOOKED AWAY FOR ONE SECOND! You SCARED me! What if someone TOOK you?! You're supposed to STAY WITH ME! Pay ATTENTION!",

    neurological_tip: "DISTRACTED kids have weak object permanence for people - when you're not in visual field, you don't exist to their brain. Novel stimuli capture attention completely. It's not defiance; it's genuine forgetting. Yelling after the fact doesn't build awareness. Naming it ('forgot I was here') validates the lapse without shaming. The physical connection (hold hand) or visual rule (stay in sight) provides external structure their brain can't generate. Immediate consequence (leave) makes safety concrete.",

    parent_state: ['firm', 'calm'],
    location_type: ['public', 'store'],
    emergency_suitable: true,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60,
    age_min: 3,
    age_max: 8,
  },

  {
    title: "Can't find anything - searching same spot repeatedly",
    profile: 'DISTRACTED',
    category: 'Problem_Solving',
    situation_trigger: 'Child looking for item (shoe, toy, homework). Searching same drawer/spot repeatedly, getting frustrated. Genuinely can't see it even if it's right there.',

    phrase_1: "It's not where your brain thinks it is.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You're looking in the same place over and over, AND it's not there.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Ask me to help look, or keep looking alone for 2 more minutes. Pick now.",
    phrase_3_action: "COMMAND",

    wrong_way: "STOP! You've looked there THREE TIMES! Look somewhere ELSE! Use your EYES! Are you even TRYING?!",
    neurological_tip: "DISTRACTED kids have impaired visual scanning - once they form a mental model of where something 'should' be, their brain keeps checking that spot even when it fails. They literally can't shift search strategy. It's not stupidity; it's stuck executive function. Yelling doesn't unstick it. Naming it ('not where your brain thinks') externalizes the problem. Offering help vs continued solo attempt gives them choice. Help includes teaching systematic search pattern their brain struggles to generate.",

    parent_state: ['patient', 'calm', 'helpful'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
    age_min: 4,
    age_max: 12,
  },

  {
    title: "Arguing every instruction as unfair",
    profile: 'DEFIANT',
    category: 'Emotional_Regulation',
    situation_trigger: 'You give any instruction (clean room, do homework, come to dinner). Child immediately argues: That's not fair, why me, you never make [sibling] do this, etc.',

    phrase_1: "Every rule feels like an attack on your freedom.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You want to decide everything yourself, AND some things aren't negotiable.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Do it now or do it later, but arguing adds time. Every minute arguing = 1 minute earlier bedtime.",
    phrase_3_action: "COMMAND",

    wrong_way: "STOP ARGUING! I'm the parent! You do what I SAY! I don't CARE if it's fair! Life's not FAIR! Just DO IT!",
    neurological_tip: "DEFIANT kids argue instructions reflexively because any directive feels like autonomy threat. The content doesn't matter - it's about resisting control. Fighting about fairness creates power struggle. Naming their feeling ('every rule feels like attack on freedom') validates the drive. Acknowledging their want (decide everything) while stating reality (some things aren't negotiable) is honest. Consequence for arguing time (not for the rule itself) makes cost concrete - they can comply and keep bedtime, or argue and lose it.",

    parent_state: ['firm', 'calm', 'neutral'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 5,
    age_max: 14,
  },

  {
    title: "Refusing to clean up - power struggle",
    profile: 'DEFIANT',
    category: 'Transitions',
    situation_trigger: 'Playtime over, mess everywhere. You say clean up. Child says no, I'll do it later, it's not my job, etc. Testing if cleanup is enforceable.',

    phrase_1: "You don't want to be bossed around about your stuff.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You want to clean up when you feel like it, AND the rule is clean before next activity.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Clean it in 5 minutes or I clean it into a bag that you don't get back for a week. Timer starts now.",
    phrase_3_action: "COMMAND",

    wrong_way: "You MADE the mess, YOU clean it! I'm not your MAID! Clean it NOW or it goes in the TRASH! I'm counting to THREE!",
    neurological_tip: "DEFIANT kids resist cleanup directives because being told what to do with their stuff feels like control over their property. Testing if they can delay/refuse. Fighting about cleaning creates battle where compliance = submission. Naming their drive ('don't want to be bossed around') validates autonomy need. The boundary (clean before next thing) is immovable. The consequence (bag for week, not trash) is real and proportional. Timer creates urgency. If you reach zero, you MUST bag it - empty threats teach them you're bluffing.",

    parent_state: ['firm', 'calm'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 120,
    age_min: 4,
    age_max: 11,
  },

  // Batch 10
  {
    title: "Can't stop talking about special interest",
    profile: 'INTENSE',
    category: 'Social',
    situation_trigger: 'Child talking nonstop about favorite topic (dinosaurs, Minecraft, etc). Can't read social cues that listener is done. Monopolizing conversation.',

    phrase_1: "Your brain wants to share everything you know about this.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You love this topic, AND the other person needs a turn to talk.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Tell me 3 more facts then ask them a question. I'll count on my fingers.",
    phrase_3_action: "COMMAND",

    wrong_way: "ENOUGH! No one cares about dinosaurs! Let someone ELSE talk! You're being RUDE! Why can't you talk about NORMAL things?!",
    neurological_tip: "INTENSE kids with special interests experience joy-driven hyperfocus - talking about the topic floods them with dopamine, making it nearly impossible to stop. They aren't trying to dominate; they're riding a neurological wave. Shutting them down harshly damages self-esteem. Naming it ('brain wants to share everything') validates the drive. Structured limits (3 facts then question) teaches turn-taking while honoring their passion. Finger counting provides visual cue their system can track.",

    parent_state: ['patient', 'firm', 'kind'],
    location_type: ['home', 'public'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 5,
    age_max: 13,
  },

  {
    title: "Refusing to try new activity - fear of failure",
    profile: 'INTENSE',
    category: 'Problem_Solving',
    situation_trigger: 'New activity/class/sport starting. Child refuses to try: I'll be bad at it, everyone will be better, I don't want to. Genuine fear, not laziness.',

    phrase_1: "Starting something new feels dangerous because you might not be good right away.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You want to already be good at it, AND learning means being bad first.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Try it once with permission to quit after, or don't go and explain to [teacher/friend] why you're not coming.",
    phrase_3_action: "COMMAND",

    wrong_way: "You haven't even TRIED it! You might LOVE it! Everyone is bad when they start! Stop being so negative! You're going and that's FINAL!",
    neurological_tip: "INTENSE kids avoid new activities because being a beginner conflicts with their need for competence. The vulnerability of not knowing feels unsafe. Forcing creates trauma association with trying new things. Naming the fear ('dangerous because you might not be good') validates the real emotional experience. Acknowledging the impossible want (already be good) while stating reality (learning = being bad first) is honest. Choice (try once with exit OR explain to others) gives control while adding social accountability.",

    parent_state: ['empathetic', 'calm', 'firm'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Medium (5-10min)',
    expected_time_seconds: 420,
    age_min: 6,
    age_max: 14,
  },

  {
    title: "Getting lost in daydreams - zoning out mid-conversation",
    profile: 'DISTRACTED',
    category: 'Bedtime',
    situation_trigger: 'Bedtime routine, you're talking to child. Mid-sentence they zone out, staring into space. Not hearing you, genuinely dissociated into thoughts.',

    phrase_1: "Your brain drifted into a daydream.",
    phrase_1_action: "CONNECTION",
    phrase_2: "Something in your head got more interesting than what I was saying, AND it's bedtime.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Tell me one thing you were just thinking about, then we finish routine. Quick.",
    phrase_3_action: "COMMAND",

    wrong_way: "HELLO?! Are you LISTENING to me?! Where did you GO?! I'm talking to YOU! Why can't you pay ATTENTION for 2 minutes?!",
    neurological_tip: "DISTRACTED kids dissociate into internal thoughts when external conversation loses salience - their brain literally shifts from external to internal processing. They aren't choosing to ignore you; they're genuinely elsewhere. Yelling startles them back but doesn't prevent next drift. Naming it ('drifted into daydream') externalizes the lapse. Offering share (tell me what you were thinking) validates internal world while redirecting to task. Keeps connection without shaming.",

    parent_state: ['patient', 'calm', 'gentle'],
    location_type: ['home', 'bedroom'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60,
    age_min: 5,
    age_max: 12,
  },

  {
    title: "Blurting answers before others finish - can't wait",
    profile: 'DISTRACTED',
    category: 'Social',
    situation_trigger: 'At home or school, someone asking question. Child shouts answer before question is finished or before others have chance to think. Can't contain response.',

    phrase_1: "The answer is bursting out of you before others get a turn.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You know it and your brain can't hold it in, AND other people need time to think.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Put your hand on your mouth and count to 3 silently, then answer. Practice right now.",
    phrase_3_action: "COMMAND",

    wrong_way: "STOP interrupting! Let someone ELSE answer! You're being RUDE! Not everything is about YOU! Raise your HAND!",
    neurological_tip: "DISTRACTED kids blurt because working memory can't hold the answer while waiting - by the time their turn comes, the thought is gone. The blurting is trying to catch the answer before it vanishes. It's not rudeness; it's memory desperation. Teaching 'wait your turn' doesn't work because waiting = forgetting. Naming it ('answer bursting out') validates the urgency. Physical anchor (hand on mouth + count 3) provides just-long-enough delay that teaches micro-pause without losing thought.",

    parent_state: ['patient', 'firm', 'understanding'],
    location_type: ['home', 'public'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60,
    age_min: 5,
    age_max: 11,
  },

  {
    title: "Blaming others for everything - deflection reflex",
    profile: 'DEFIANT',
    category: 'Social',
    situation_trigger: 'Something goes wrong (sibling hurt, item broken, rule broken). Child immediately blames someone else: It was THEM, not me, they started it, it's their fault.',

    phrase_1: "Admitting fault feels like giving up power.",
    phrase_1_action: "CONNECTION",
    phrase_2: "You want to protect yourself, AND I can see what happened.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Tell the truth about your part, or the consequence doubles for lying. Count of 10.",
    phrase_3_action: "COMMAND",

    wrong_way: "Don't you LIE to me! I SAW what you did! Take RESPONSIBILITY! Why can't you just ADMIT when you're wrong?!",
    neurological_tip: "DEFIANT kids deflect blame reflexively because admitting fault feels like submitting to authority's judgment. It's self-protection, not malice. Fighting about truth creates power struggle. Naming their drive ('admitting fault feels like giving up power') validates the real fear. Acknowledging they want to protect self while stating you saw what happened is honest. The consequence for lying (doubles) vs consequence for honesty (original) makes truth-telling the strategic choice. Calm delivery essential - anger makes them dig in harder.",

    parent_state: ['firm', 'calm', 'unshakeable'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 90,
    age_min: 4,
    age_max: 13,
  },

  {
    title: "Doing opposite of what you ask - oppositional reflex",
    profile: 'DEFIANT',
    category: 'Transitions',
    situation_trigger: 'You ask child to do something (come here, put that down, get ready). They immediately do the opposite: go farther away, pick it up more, sit down. Reflex resistance.',

    phrase_1: "Your brain does the opposite of what I say automatically.",
    phrase_1_action: "CONNECTION",
    phrase_2: "Being told what to do makes you want to prove I can't control you, AND [task] needs to happen.",
    phrase_2_action: "VALIDATION",
    phrase_3: "Do it your way in the next 30 seconds, or I do it my way. Timer starts now.",
    phrase_3_action: "COMMAND",

    wrong_way: "WHY do you do the OPPOSITE of everything I say?! Just LISTEN for ONCE! What is WRONG with you?! STOP fighting me!",
    neurological_tip: "DEFIANT kids have oppositional reflex - directives trigger automatic resistance before conscious thought. It's not calculated defiance; it's neurological auto-response to perceived control. Fighting it entrenches the pattern. Naming it ('brain does opposite automatically') externalizes as brain wiring, not character flaw. Acknowledging the drive (prove I can't control you) validates autonomy need. Offering method control (your way) vs outcome control (my way) often resolves it - they'll do it to maintain autonomy.",

    parent_state: ['calm', 'firm', 'neutral'],
    location_type: ['home'],
    emergency_suitable: false,
    success_speed: 'Fast (under 2min)',
    expected_time_seconds: 60,
    age_min: 3,
    age_max: 11,
  },
];

console.log('🚀 BATCHES 08-09-10: Inserting 18 scripts\n');

for (const s of scripts) {
  const { error } = await supabase.from('scripts').insert([s]);
  if (error) {
    console.log(`❌ ${s.profile}/${s.category}: ${s.title} - ${error.message}`);
  } else {
    console.log(`✅ ${s.profile}/${s.category}: ${s.title}`);
  }
}

const { data } = await supabase.from('scripts').select('id');
console.log(`\n📊 Database total: ${data.length} scripts\n`);
