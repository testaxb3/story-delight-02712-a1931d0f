import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

const revisions = [
  {
    title: "Food touching on plate causes shutdown",
    new_tip: "INTENSE kids often have sensory over-responsivity in gustatory/tactile cortex - mixed foods trigger genuine disgust response, not preference. Their insular cortex (processes disgust) fires when foods cross boundaries they've mentally established. You'll see: face contorts, pushes plate away, may gag just looking at it. These aren't food rules - they're neurological boundaries. Violating them triggers same brain response as contamination. Why 'foods are touching and it's wrong' works: Uses their exact internal language ('wrong' not 'bad'). Why 'get new plate yourself' works: Gives them autonomy to fix their sensory environment instead of you enforcing tolerance of discomfort."
  },
  {
    title: "Inconsolable crying over minor disappointment",
    new_tip: "INTENSE kids have amygdala hyperreactivity - disappointments trigger same limbic response others have to major loss. Their emotion regulation circuitry (ventromedial prefrontal cortex) can't modulate the amygdala's fire alarm. You'll see: instant tears, body collapse, genuine grief language ('worst day ever'). The intensity isn't manipulation - their brain genuinely can't distinguish disappointment magnitude. Why 'this feels huge to you' works: Validates their ACTUAL felt experience without agreeing it's objectively huge. Why structured release (5 min cry OR one sentence) works: Gives prefrontal cortex a task to engage with, creating regulatory pathway when their system can't self-modulate."
  },
  {
    title: "Can't settle - body is still awake",
    new_tip: "DISTRACTED kids often have alerting-dominant autonomic nervous system - even when cognitively tired, their arousal system stays online. Proprioceptive sensors keep firing 'move' signals. You'll see: legs kicking, rolling, hands fidgeting, can't lie still even though exhausted. This isn't willful - their nervous system won't shift to parasympathetic (rest) mode. Demanding stillness adds cortisol (stress), increasing arousal. Why 'body won't turn off yet' works: Externalizes as body problem, not behavior choice. Why proprioceptive input (squeeze pillow, push into mattress) works: Satisfies sensors' need for feedback, telling arousal system 'task complete, safe to rest.' After discharge, parasympathetic can finally engage."
  },
  {
    title: "Tantrum when told no - testing your resolve",
    new_tip: "DEFIANT kids use tantrums strategically because their orbitofrontal cortex (learns rules through outcomes) has encoded: big emotion sometimes flips no to yes. Each tantrum is hypothesis-testing. You'll see: rapid escalation, watching for your reaction, may pause to gauge effect. This isn't loss of control - it's calculated. Why 'you're trying to make me change my answer' works: Names their strategy, showing you see the game. Why 'the answer is still no' + immovable delivery works: Rewrites orbitofrontal learning. Why location choice works: Gives them control over HOW (where to tantrum) without control over OUTCOME. If you cave, you've just taught: escalate harder next time."
  },
  {
    title: "Refusing to start homework - control battle",
    new_tip: "DEFIANT kids' anterior cingulate cortex (detects control threats) fires when told 'do homework now' - feels like forced submission. Their resistance isn't about the homework (content irrelevant), it's about timeline autonomy. You'll see: frozen defiance, argumentative delay tactics, doing literally anything EXCEPT homework. Fighting creates power struggle where starting = losing. Why 'don't want someone deciding your time' works: Addresses the REAL conflict (autonomy) not fake conflict (homework). Why 'do it now OR later but bedtime doesn't move' works: Gives WHEN control (their need) while maintaining THAT it happens (your need). Why natural consequence (wake early if not done) works: Makes THEM the enforcer of the outcome, not you."
  },
  {
    title: "Outfit doesn't feel right - changing repeatedly",
    new_tip: "INTENSE kids with sensory sensitivity have tactile cortex that processes touch as 10x signal strength - seams/tags/tightness others tolerate feel like actual pain. Their sensory state fluctuates (stress/sleep/hormones affect threshold), so yesterday's OK shirt is today's torture. You'll see: frantic changing, pulling at clothes, genuine distress. The re-changing seeks neurological comfort, not visual perfection. But perfectionism can create infinite loop. Why 'nothing feels right on your body today' works: Validates fluctuating sensory state ('today' acknowledges it varies). Why time limit + consequence (wear these OR pajamas) works: Stops infinite loop while respecting that discomfort is real. If chronic, consider tagless/seamless clothing as accommodation."
  },
];

console.log('🔧 REVISION BATCH 02\n');

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

console.log('\n✨ Done\n');
