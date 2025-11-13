import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

// REVISION BATCH 01: Scripts #1, #5, #8, #9, #10, #11
// Adding depth to neurological insights

const revisions = [
  {
    title: "Can't sleep - replaying something from today",
    new_tip: "INTENSE kids have hyperactive default mode networks (DMN) - the brain system that reviews and integrates experiences. Their DMN doesn't shut off at night; it loops on events tied to self-worth or social standing. You'll see: eyes open, body tense, maybe tears or angry muttering. The rumination isn't voluntary - their amygdala flags the event as 'unresolved threat' and won't release it. Externalizing (speak OR write) moves the memory from active DMN processing to concrete storage in hippocampus. Once externalized, the brain can file it as 'addressed' and stop looping. Why the phrase 'tell me ONE sentence' works: Limits scope so task feels achievable, prevents new spiral."
  },
  {
    title: "Refusing dinner as control test",
    new_tip: "DEFIANT kids have hypersensitive insula - the brain region monitoring bodily autonomy and threat to self. Food entering their body = ultimate autonomy question: 'Who decides what goes inside me?' Their anterior cingulate cortex (conflict detector) fires when you say 'eat this,' triggering oppositional response before they even taste it. Watch: jaw clenches, arms cross, body turns away. Forcing triggers genuine fight-or-flight in insula. Why 'your body belongs to you' works: Directly addresses the insula's core question, disarming the threat. Why 'kitchen closes in 20 min' works: Time-based boundary removes YOU as enforcer - it's physics, not authority."
  },
  {
    title: "Upset sibling got more screen time",
    new_tip: "INTENSE kids have overactive anterior cingulate cortex - hypervigilant for fairness violations as threats to their worth. They're literally counting minutes because their brain interprets inequality as 'I matter less.' You'll see: rapid calculations, checking clock, interrogating you about sibling's exact time. This isn't pettiness - their amygdala treats unfairness as social danger. Why 'you're counting minutes' works: Names the observable behavior without judgment. Why 'different ages = different rules' works: Provides rational framework their prefrontal cortex can process instead of emotional spiral. Why 'arguing eats screen time' works: Makes the COST immediate and concrete, engaging their calculating brain."
  },
  {
    title: "Melting down in middle of grocery store",
    new_tip: "DISTRACTED kids have low sensory gating in thalamus - the filter that screens out irrelevant stimuli. In overstimulating environments, EVERYTHING gets through: fluorescent buzz, cart wheels, announcements, people talking, bright packaging. Their sensory cortex floods. You'll see: hands over ears, eyes squinting/closing, face crumpling, body dropping. This is neurological overwhelm, not behavior. By the time meltdown starts, their prefrontal cortex is offline - can't reason, can't regulate. Why 'brain is full' works: Gives them language for a sensation they can't name. Why immediate exit works: Reduces sensory assault faster than any coping skill could. The phrase 'go limp, I've got you' tells their system to STOP trying to regulate (impossible right now) and surrender to external regulation (you)."
  },
  {
    title: "Resisting toothbrushing - sensory issue",
    new_tip: "DISTRACTED kids with oral sensitivity have hyperreactive trigeminal nerve - carries sensation from mouth/face to brain. Bristles others barely feel trigger pain signals; mint 'freshness' feels like burning. Their sensory cortex overreacts to textures. You'll see: pulling away, gagging at toothpaste smell, tears even before brush touches teeth. This is real pain, not drama. Forcing creates trauma association where brain encodes toothbrushing = threat. Why 'feels bad in your mouth' works: Validates the PAIN without requiring them to explain sensory processing differences. Why offering choices (different brush/paste/just water) works: Reduces sensory assault while maintaining hygiene outcome - works WITH their neurology instead of against it."
  },
  {
    title: "Coming out of room after bedtime",
    new_tip: "DEFIANT kids resist bedtime because sleep = ultimate loss of control - they must surrender consciousness to authority's timeline. Their ventromedial prefrontal cortex (evaluates threats to autonomy) fires at 'bedtime,' triggering excuses to test boundary malleability. Watch: multiple exits with escalating reasons ('water' → 'forgot to tell you something' → 'not tired'). Each excuse tests: Is bedtime negotiable? Why 'you want to decide when you sleep' works: Directly names the autonomy drive without arguing the excuse. Why 'bedtime already happened' works: Makes it time-based fact, not your opinion. Why count-then-consequence works: If you reach three and DON'T enforce, their orbitofrontal cortex (learns rules) encodes: counts are bluffable. One solid follow-through rewires the pattern."
  },
];

console.log('🔧 REVISION BATCH 01: Elevating 6 scripts to TOP 15 level\n');

for (const rev of revisions) {
  const { error } = await supabase
    .from('scripts')
    .update({ neurological_tip: rev.new_tip })
    .eq('title', rev.title);

  if (error) {
    console.log(`❌ ${rev.title}: ${error.message}`);
  } else {
    console.log(`✅ ${rev.title}`);
  }
}

console.log('\n✨ Batch 01 complete\n');
