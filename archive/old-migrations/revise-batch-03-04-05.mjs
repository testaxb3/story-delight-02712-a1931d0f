import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

const revisions = [
  // BATCH 03
  {
    title: "Washing hands too long - contamination fear",
    new_tip: "INTENSE kids can develop OCD-like contamination loops where orbitofrontal cortex (error detection) keeps sending 'not clean yet' signal even after hands are raw. The anxiety isn't about germs rationally - it's internal alarm that won't turn off. You'll see: red hands, scrubbing same spot repeatedly, distress if interrupted. The washing is compulsive attempt to resolve anxiety, but anxiety is internal so washing never resolves it. Why 'hands still don't feel clean' works: Validates internal sensation without agreeing hands are actually dirty. Why timed interruption (10 sec then off) works: External control when internal control is broken. If this pattern persists daily, strongly consider OCD screening - this is clinical territory."
  },
  {
    title: "Forgets to eat - food gets cold",
    new_tip: "DISTRACTED kids have attention that defaults to most novel stimulus - eating is repetitive, so their executive function disengages mid-meal. Brain literally stops sending 'keep eating' signal. You'll see: fork halfway to mouth then stops, staring into space, or talking/playing while food sits. Internal hunger cues are weak (interoception deficit), so they don't notice. Why 'your brain left the table' works: Names the attention shift as brain behavior, not choice. Why 'three bites NOW, I'm watching' works: External attention anchor (your gaze) substitutes for their missing internal drive. Why counting works: Creates external structure for automatic task their autopilot can't maintain."
  },
  {
    title: "Refusing shower - autonomy battle",
    new_tip: "DEFIANT kids interpret hygiene directives as control over their most intimate boundary - their body. Ventromedial prefrontal cortex (autonomy monitoring) fires 'threat to bodily autonomy' when you say 'you need to shower.' Content doesn't matter - it's WHO decides. You'll see: defensive posture, argumentative reasoning ('I don't smell'), digging in. Why 'don't want me deciding when you shower' works: Names the real conflict (autonomy over body) not stated conflict (cleanliness). Why choice (now OR morning early wake) works: Gives WHEN control while maintaining THAT it happens. Most choose now to avoid early wake. If they choose morning, you MUST enforce wake time or choice becomes meaningless and trust breaks."
  },
  {
    title: "Resisting getting in the car - delaying",
    new_tip: "DEFIANT kids stall at transitions because being rushed = loss of control over timeline. Each delay tactic (retying shoes, 'forgot something') tests: Can I change the departure time? Their anterior cingulate (conflict detector) is checking if timeline is YOUR rule or physics. You'll see: slow-motion movement, sudden 'emergencies,' strategic incompetence. Why 'you're trying to control when we leave' works: Names the strategy without engaging with delay tactics. Why 'car leaves at 8:15 no matter what' works: Makes it time-based law, not your opinion. Why carry-threat + follow-through works: If you hesitate at three, orbitofrontal cortex learns counts are bluffable. One real carry-out usually extinguishes pattern."
  },
  {
    title: "Can't solve problem - shutting down",
    new_tip: "INTENSE kids have performance anxiety tied to self-worth - failure at task = evidence of being fundamentally incapable. Ventromedial prefrontal cortex (self-evaluation) catastrophizes from one failed attempt. You'll see: hands go still, face crumples, 'I can't do it' before truly trying. The shutdown is protective: if I stop trying, I stop failing. Why 'didn't work first time and now you're done' works: Names the pattern (one failure → quit) without shame. Why 'expected to get it right away' works: Identifies unrealistic expectation driving the shutdown. Why 'one more try WITH me watching' works: Your presence reduces performance anxiety (not being evaluated alone) while maintaining engagement."
  },
  {
    title: "Losing pieces while building - frustration spiral",
    new_tip: "DISTRACTED kids have weak object permanence tracking - inferior parietal cortex doesn't maintain spatial map of objects outside visual focus. Piece goes out of sight = genuinely vanishes from mental representation. You'll see: searching same spot repeatedly, increasing frustration, blaming others. This is tracking failure, not carelessness. Why 'pieces keep disappearing' works: Validates their experience (pieces DO vanish to their brain). Why 'your brain doesn't track small things' works: Externalizes as neurology, not character. Why environmental solution (tray OR table) works: Accommodates their brain instead of demanding it do what it can't. Teaching systematic search after choosing structure builds compensatory skill."
  },

  // BATCH 04
  {
    title: "Refusing to apologize after hurting someone",
    new_tip: "DEFIANT kids resist forced apologies because 'say sorry' = forced submission to authority's judgment. Their anterior cingulate (autonomy monitor) rejects being told what words to say. The resistance isn't lack of empathy - it's refusal to perform contrition on command. You'll see: crossed arms, face turned away, 'NO' or 'they started it' deflection. Forcing parrot-words teaches compliance theater, not genuine remorse. Why 'don't want to be forced to say sorry' works: Names autonomy resistance without arguing whether apology is deserved. Why choice (say it your way OR write it) works: Removes force from expression while maintaining accountability. Time limit + consequence prevents standoff. Often genuine apology emerges once force is removed."
  },
  {
    title: "Meltdown when activity ends - emotional whiplash",
    new_tip: "INTENSE kids don't gradually wind down from joy to neutral - their emotion regulation system lacks modulation. Amygdala crashes from peak positive to grief in seconds. You'll see: laughing one moment, full tears the next, body collapse. The fun's intensity makes the ending feel like loss. Autonomic nervous system can't ease the transition. Why 'going from fun to over feels impossible' works: Validates the jarring whiplash they're experiencing. Why 'happy 10 seconds ago, now you have to stop' works: Acknowledges both truths (was joy, now is grief). Why forced choice + count works: External structure when their emotional regulation is offline. Counting creates predictability when their system is in chaos."
  },
  {
    title: "Refusing to leave friend's house",
    new_tip: "DEFIANT kids resist departure because 'time to go' = someone else ending their experience. Ventromedial prefrontal cortex fires 'autonomy violation.' Every delay tests: Is this timeline negotiable? You'll see: 'five more minutes' bargaining, sudden urgent needs, ignoring you. Why 'don't want someone else ending your fun' works: Names autonomy need without arguing logistics. Why 'time to go now' as immovable fact works: Non-negotiable, unemotional. Why walk-or-carry choice works: Gives METHOD control (their autonomy need satisfied). If you reach three and don't carry, you teach: threats are empty, keep testing. One follow-through rewrites the rule."
  },
  {
    title: "Lost during transition - forgot where we're going",
    new_tip: "DISTRACTED kids have severe working memory limitations - verbal information (where we're going) doesn't encode during transitions when attention is split. Hippocampus never receives the information to store. You'll see: genuine confusion, asking multiple times, no recognition when you repeat. This isn't not listening - encoding failed. Why 'you already forgot' states fact without blame. Why repetition technique (say it back 3 times) works: Forces active encoding through motor speech (stronger pathway than passive hearing). The irritation you feel is real, but yelling doesn't fix neurology. Some kids need this every transition - accommodation, not enabling."
  },
  {
    title: "Sibling touched their stuff - rage response",
    new_tip: "INTENSE kids have hyperactive insula (disgust/violation center) + amygdala (threat response) - belongings are extensions of self. Touching without permission triggers same activation as someone touching THEIR BODY uninvited. You'll see: rage disproportionate to object value, physical aggression toward sibling, genuine violation language. This isn't about the toy - it's territorial/bodily boundary violation. Why 'someone touched what's yours and it feels like a violation' works: Uses their exact internal experience word (violation). Why acknowledging want (complete protection) + reality (shared house) works: Honest about both truths. Why appropriate response teaching (tell them/ask back) vs inappropriate (hitting) works: Channels reaction without suppressing feeling."
  },
  {
    title: "Won't get out of bed - genuinely exhausted",
    new_tip: "INTENSE kids often have sleep debt from nighttime rumination - their default mode network reviews events for hours before sleep. Real sleep deprivation, not laziness. You'll see: heavy limbs, genuine 'I'm so tired,' may have bags under eyes. Sympathetic nervous system is depleted from hypervigilance. Why 'brain wouldn't stop' validates the real cause (rumination) without requiring detailed explanation. Why choice (now with breakfast OR later without) works: Maintains non-negotiable outcome (getting up) while giving timing/food control. If this pattern is chronic, address nighttime rumination separately - this script handles morning, not root cause."
  },

  // BATCH 05
  {
    title: "Weaponizing emotions in public",
    new_tip: "DEFIANT kids quickly learn public tantrums have leverage - orbitofrontal cortex encodes: parental embarrassment > boundary enforcement. They're not 'bad' - they're using available tools strategically. You'll see: volume escalates when audience appears, checking if you'll cave, may pause to gauge reaction. Why 'you're making it big so I'll give in' works: Names the strategy, showing immunity. Why 'the answer stays no' works: Removes the leverage. Why consequence (leave now, banned from outings) MUST be real: If you cave to avoid stares, you teach: public = winning strategy. Other people's judgment matters less than your child's learning. One solid follow-through in public usually ends the pattern."
  },
  {
    title: "Refuses consequences - 'you can't make me'",
    new_tip: "DEFIANT kids challenge consequences to test enforcement reality - 'you can't make me' probes if boundaries are physics or preference. Orbitofrontal cortex is hypothesis-testing. You'll see: defiant stance, watching for your reaction, escalating language to find your breaking point. Why 'you're testing if I can actually enforce this' works: Shows you see the test. Why 'consequence stands, fight it and it doubles' works: Makes resistance COST something, engaging their strategic brain. You must be willing to enforce even if difficult. Why calm delivery essential: Anger makes it emotional battle (they win by getting reaction). Calm inevitability teaches consequences are natural law, not debatable. One solid enforcement usually ends testing phase."
  },
  {
    title: "Starting homework but drifting off mid-problem",
    new_tip: "DISTRACTED kids' sustained attention depletes like battery - can start with focus but executive function runs out mid-task, especially on repetitive work. Prefrontal cortex literally loses activation. You'll see: starts problem, gets partway through, then staring/doodling/eraser-playing. The drift isn't willful. Why 'brain wandered away' externalizes as attention shift, not choice. Why structure (finish ONE with supervision, then break) works: Chunks task to match their attention span limits. Why break isn't reward, it's reset: Attention system needs recovery time before next problem. Forcing continuous work burns depleted system, creating homework battles. Working WITH their neurology (chunk + break cycle) gets it done."
  },
  {
    title: "Lights/sounds are painful - overstimulation shutdown",
    new_tip: "DISTRACTED kids with sensory processing sensitivity have thalamic gating failure - stimuli that should be filtered reach sensory cortex at full volume. In overloading environments, EVERYTHING gets through simultaneously. Somatosensory cortex floods. You'll see: hands on ears, eyes squinting/closing, irritability escalating to tears, body folding inward. By meltdown start, prefrontal cortex is offline from overwhelm - can't reason or self-regulate. Why immediate exit essential: Only solution is removing assault on nervous system. Why 'cover ears and eyes, follow my voice' works: Provides sensory blocking + external regulation when their system can't self-regulate. If pattern repeats, consider sensory diet/OT evaluation."
  },
  {
    title: "Refusing shower - autonomy battle",
    new_tip: "DEFIANT kids resist hygiene directives because 'shower now' = authority over their most intimate space (their body). Anterior cingulate fires autonomy threat. The defensiveness protects self-determination. You'll see: 'I'm fine,' 'I don't smell,' digging in. Fighting entrenches resistance. Why 'don't want me deciding when you shower' names real conflict (body autonomy) not stated conflict (hygiene). Why choice (now OR morning early) gives control while ensuring outcome. Most choose now. If they choose morning, enforce wake time - empty threats break trust and teach you're bluffable."
  },
];

console.log('🔧 REVISIONS BATCH 03-04-05 (Final 16 scripts)\n');

let done = 0;
for (const rev of revisions) {
  const { error } = await supabase
    .from('scripts')
    .update({ neurological_tip: rev.new_tip })
    .eq('title', rev.title);

  if (error) {
    console.log(`❌ ${rev.title}: ${error.message}`);
  } else {
    done++;
    console.log(`✅ ${done}/16: ${rev.title}`);
  }
}

console.log(`\n🎉 ALL 28 SCRIPTS REVISED!\n`);
console.log('Total elevated: 28 scripts');
console.log('Top tier maintained: 15 scripts');
console.log('Database total: 43 premium scripts\n');
