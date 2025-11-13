import { MainLayout } from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Brain, Microscope, Users, Award, FileCheck, GraduationCap, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Methodology() {
  return (
    <MainLayout>
      <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Scientific Methodology & Research Foundation
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our parenting scripts are grounded in peer-reviewed neuroscience research, not generic AI content. Every strategy is designed around specific neurological mechanisms validated by decades of child development research.
          </p>
        </div>

        <Separator className="my-8" />

        {/* Critical Distinction */}
        <Card className="border-2 border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-purple-600" />
              <CardTitle>Why This Is NOT Generic AI Content</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-purple-900 dark:text-purple-100">❌ Generic AI Content:</h4>
                <ul className="text-sm space-y-1 text-purple-800 dark:text-purple-200">
                  <li>• Vague advice: "Be patient and consistent"</li>
                  <li>• One-size-fits-all strategies</li>
                  <li>• No neurological explanations</li>
                  <li>• Unrealistic expectations</li>
                  <li>• No scientific citations</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-green-900 dark:text-green-100">✅ Our Methodology:</h4>
                <ul className="text-sm space-y-1 text-green-800 dark:text-green-200">
                  <li>• Profile-specific neurological mechanisms</li>
                  <li>• Exact phrases to say with timing</li>
                  <li>• Brain region/neurotransmitter data</li>
                  <li>• Honest timelines (5-7 repetitions)</li>
                  <li>• Ross Greene, Barkley, Siegel citations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Neurological Foundation */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <CardTitle>The Neurological Reality Parents Must Understand</CardTitle>
            </div>
            <CardDescription>
              Why traditional parenting advice fails: brain development science
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-5 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
              <h3 className="font-bold text-blue-900 dark:text-blue-100">The Prefrontal Cortex Problem</h3>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <p>
                  <strong>By age 2, children's brains reach 80% of adult size</strong>, with rapid prefrontal growth between ages 2-6. However, the prefrontal cortex (responsible for decision-making, impulse control, and emotional regulation) won't mature until their mid-twenties.
                </p>
                <p className="italic">
                  What appears as defiance is often developmental immaturity—children literally lack the neural architecture to consistently regulate emotions or inhibit impulses.
                </p>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 p-5 rounded-lg border border-amber-200 dark:border-amber-800 space-y-3">
              <h3 className="font-bold text-amber-900 dark:text-amber-100">Amygdala Hijacking & The "Upstairs/Downstairs" Brain</h3>
              <div className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                <p>
                  The "downstairs brain" (amygdala, brainstem) controlling emotions is fully operational from birth. The "upstairs brain" (prefrontal cortex) for logic and reasoning is under construction.
                </p>
                <p>
                  <strong>When stressed, the amygdala "hijacks" the brain</strong>—stress hormones physically block the "staircase" between brain regions, making logic, reasoning, and learning neurologically unavailable during distress.
                </p>
                <p className="font-semibold">
                  Implication: Attempting correction during dysregulation is neurologically futile.
                </p>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-950/30 p-5 rounded-lg border border-green-200 dark:border-green-800 space-y-3">
              <h3 className="font-bold text-green-900 dark:text-green-100">Co-Regulation: Your Calm = Their Calm (Literally)</h3>
              <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
                <p>
                  <strong>Mirror neurons fire both when performing an action AND when observing it.</strong> Children's brains unconsciously mirror their parent's emotional state.
                </p>
                <p>
                  A parent's calm nervous system physiologically helps regulate a child's dysregulated system through <strong>measurable changes in heart rate variability and stress hormones</strong>.
                </p>
                <p className="italic">
                  This co-regulation process serves as the child's "external prefrontal cortex" until their internal regulatory systems mature.
                </p>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Three Neurological Profiles - DETAILED */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Microscope className="w-6 h-6 text-purple-600" />
              <CardTitle>Three Neurological Profiles: Specific Brain Differences</CardTitle>
            </div>
            <CardDescription>
              Not personality types—documented neurological patterns with specific interventions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">

            {/* DEFIANT Profile */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="text-sm">DEFIANT</Badge>
                <h3 className="font-semibold text-lg">Oppositional / High Autonomy Drive</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">📊 Neurological Data:</h4>
                  <ul className="text-sm space-y-2 text-red-800 dark:text-red-200">
                    <li>• <strong>10-13% reduction in whole-brain cortical thickness</strong>, especially in ventromedial prefrontal cortex, superior temporal cortex, and angular gyrus (regions for reasoning and impulse control)</li>
                    <li>• <strong>Anterior cingulate gyrus hyperactivity</strong> ("gear shifter" of brain) → causes perseveration on "no" and inability to shift mental sets</li>
                    <li>• <strong>Altered dopamine, serotonin, noradrenaline functioning</strong></li>
                    <li>• <strong>Overactive BAS (Behavioral Activation System)</strong> responding to rewards + <strong>underactive BIS (Behavioral Inhibition System)</strong> failing to inhibit behavior in response to punishment</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🔬 Ross Greene's Evidence-Based Approach:</h4>
                  <div className="text-sm space-y-2 text-blue-800 dark:text-blue-200">
                    <p>
                      <strong>Collaborative Problem Solving (CPS)</strong> recognized as evidence-based by California Evidence-Based Clearinghouse.
                    </p>
                    <p className="font-bold text-blue-900 dark:text-blue-100">
                      Results: 80% maintain improvements at 4-month follow-up vs. 44% with traditional behavior management
                    </p>
                    <div className="mt-2 p-3 bg-white dark:bg-blue-900/30 rounded">
                      <p className="font-semibold mb-1">Plan B Structure:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li><strong>Empathy:</strong> "I've noticed that..."</li>
                        <li><strong>Define problem:</strong> "The thing is, I'm worried about..."</li>
                        <li><strong>Invitation:</strong> "I wonder if there's a way..."</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border-l-4 border-amber-500">
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">💡 Why Choices Activate Cooperation:</h4>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Offering choices <strong>engages dorsolateral prefrontal cortex</strong> (decision-making) instead of triggering amygdala (threat center).
                    Perceived control activates executive function networks. Powerlessness triggers fight-or-flight.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* INTENSE Profile */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-purple-600 text-sm">INTENSE</Badge>
                <h3 className="font-semibold text-lg">Highly Sensitive / Emotionally Reactive</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">📊 Prevalence & Neurological Data:</h4>
                  <ul className="text-sm space-y-2 text-purple-800 dark:text-purple-200">
                    <li>• <strong>15-20% of children are born with highly sensitive nervous systems</strong> (innate temperament, not disorder)</li>
                    <li>• <strong>More reactive limbic systems</strong> combined with immature prefrontal cortex = heightened emotions + limited regulation</li>
                    <li>• <strong>Altered Salience Network</strong> (detecting stimuli) overwhelms <strong>Central Executive Network</strong> (regulatory processes)</li>
                    <li>• <strong>5-13% show sensory processing differences</strong> across 8 sensory systems</li>
                  </ul>
                </div>

                <div className="p-4 bg-pink-50 dark:bg-pink-950/30 rounded-lg border-l-4 border-pink-500">
                  <h4 className="font-semibold text-pink-900 dark:text-pink-100 mb-2">🧩 DOES Framework (Highly Sensitive Child):</h4>
                  <ul className="text-sm space-y-1 text-pink-800 dark:text-pink-200">
                    <li>• <strong>D</strong>epth of processing: Grasp subtle changes, reflect deeply</li>
                    <li>• <strong>O</strong>verstimulation: Easily overwhelmed by high stimulation</li>
                    <li>• <strong>E</strong>motional responsivity: Strong reactions, high empathy</li>
                    <li>• <strong>S</strong>ensitivity to subtleties: Notice details others miss</li>
                  </ul>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">🚨 CRITICAL: Tantrum vs. Sensory Meltdown</h4>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-white dark:bg-red-900/20 rounded">
                      <p className="font-semibold mb-1">Tantrum (Controlled):</p>
                      <ul className="space-y-1 text-red-800 dark:text-red-200">
                        <li>✓ Child maintains some control</li>
                        <li>✓ May check if anyone's watching</li>
                        <li>✓ Stops when goal achieved</li>
                        <li>✓ Can be redirected</li>
                        <li><strong>Response: Firm boundaries + empathy</strong></li>
                      </ul>
                    </div>
                    <div className="p-3 bg-white dark:bg-red-900/20 rounded">
                      <p className="font-semibold mb-1">Meltdown (Uncontrolled):</p>
                      <ul className="space-y-1 text-red-800 dark:text-red-200">
                        <li>✓ Complete loss of control</li>
                        <li>✓ Unreachable, may dissociate</li>
                        <li>✓ Continues until exhausted</li>
                        <li>✓ Fight-or-flight activation</li>
                        <li><strong>Response: Reduce sensory input, NO punishment</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border-l-4 border-indigo-500">
                  <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">⚖️ Dual Susceptibility:</h4>
                  <p className="text-sm text-indigo-800 dark:text-indigo-200">
                    HSC children benefit <strong>MORE from supportive environments</strong> while being <strong>MORE vulnerable to adverse ones</strong>.
                    Their emotional reactivity amplifies both positive and negative environmental impacts.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* DISTRACTED Profile */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-600 text-white text-sm">DISTRACTED</Badge>
                <h3 className="font-semibold text-lg">Executive Function Challenges / ADHD Traits</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📊 Neurological Data:</h4>
                  <ul className="text-sm space-y-2 text-blue-800 dark:text-blue-200">
                    <li>• <strong>Immature prefrontal cortex development</strong> affecting working memory, impulse control, task persistence</li>
                    <li>• <strong>Working memory</strong> like "whiteboard that gets erased every 20 seconds"</li>
                    <li>• <strong>Hyperfocus during screens</strong>: prefrontal cortex goes "offline" for time tracking—auditory information doesn't register</li>
                    <li>• <strong>Time perception disappears</strong> during flow state (what feels like 2 minutes = 20 minutes)</li>
                  </ul>
                </div>

                <div className="p-4 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg border-l-4 border-cyan-500">
                  <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">🧠 External Scaffolding = Internal Skill Building:</h4>
                  <div className="text-sm space-y-2 text-cyan-800 dark:text-cyan-200">
                    <p>
                      <strong>Neuroplasticity principle:</strong> "Use it or lose it." Repeated experiences build stronger neural pathways through <strong>myelination and synaptic connections</strong>.
                    </p>
                    <p>
                      External supports (visual timers, single-step instructions, physical proximity) <strong>compensate for internal deficits</strong> while the prefrontal cortex matures.
                    </p>
                    <p className="font-semibold text-cyan-900 dark:text-cyan-100">
                      Parents literally build children's brains through consistent, scaffolded interactions.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-teal-50 dark:bg-teal-950/30 rounded-lg border-l-4 border-teal-500">
                  <h4 className="font-semibold text-teal-900 dark:text-teal-100 mb-2">⏱️ Why Visual Timers Work:</h4>
                  <p className="text-sm text-teal-800 dark:text-teal-200">
                    <strong>Visual information bypasses working memory bottleneck.</strong> Watching red shrink or sand fall gives brain a concrete reference that verbal time can't provide.
                    Activates visual-spatial processing which stays online even during hyperfocus.
                  </p>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Script Creation Methodology */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-green-600" />
              <CardTitle>Our 5-Step Script Creation & Validation Methodology</CardTitle>
            </div>
            <CardDescription>
              How we ensure every script is scientifically grounded, not AI-generated fluff
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold text-lg">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Profile-Specific Neurological Targeting</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Each script must work for ONLY its target profile based on documented brain function. If a strategy would work for any child, it's rejected.
                </p>
                <div className="text-xs bg-muted p-2 rounded">
                  <strong>Example:</strong> Offering choices works for DEFIANT (activates dorsolateral PFC instead of amygdala).
                  For INTENSE, emotion coaching and sensory accommodation. For DISTRACTED, external scaffolding and visual supports.
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-lg">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Neurological Mechanism Explanation (No Jargon Dumping)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Every "Why This Works" section explains brain regions, neurotransmitters, or developmental processes in parent-friendly language.
                </p>
                <div className="text-xs bg-muted p-2 rounded">
                  <strong>Example:</strong> "The anterior cingulate gyrus—the brain's 'gear shifter'—is hyperactive in DEFIANT children,
                  causing them to get STUCK on 'no' and unable to shift to cooperation."
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-lg">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Exact Behavioral Scripts (Not Vague Advice)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  3 concrete steps with 4-5 exact phrases to say, timing guidance, and what to do when child resists.
                </p>
                <div className="text-xs bg-muted p-2 rounded">
                  <strong>Not allowed:</strong> "Be patient and set boundaries"<br/>
                  <strong>Required:</strong> "At 2 minutes before timer ends, touch their shoulder, make eye contact, say: 'Two minutes left. When the timer beeps, I'm taking the tablet.'"
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center text-amber-700 dark:text-amber-300 font-bold text-lg">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Honest, Research-Based Timelines</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  No miracle promises. Evidence shows behavioral change requires 5-7 consistent repetitions for new neural pathways.
                </p>
                <div className="text-xs bg-muted p-2 rounded">
                  <strong>We explicitly say:</strong> "Expect resistance first 3-5 times. Progress isn't linear. Some nights will be better than others.
                  You're building neural pathways—this takes repetition."
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center text-red-700 dark:text-red-300 font-bold text-lg">
                5
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Validation & Quality Control Checklist</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Every script reviewed for:
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✓ Profile specificity (would this work for other profiles? → reject)</li>
                  <li>✓ Scientific accuracy (mechanism explanation traceable to research)</li>
                  <li>✓ Practical feasibility (can parents actually do this?)</li>
                  <li>✓ Realistic expectations (no false promises)</li>
                  <li>✓ Validating tone (removes parental shame and child blame)</li>
                </ul>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Academic References */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-slate-600" />
              <CardTitle>Peer-Reviewed Research Foundation</CardTitle>
            </div>
            <CardDescription>
              Published research informing our methodology (not Wikipedia summaries)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="pl-4 border-l-2 border-blue-400">
                <p className="font-medium">Greene, R.W. (2014). <em>The Explosive Child: A New Approach for Understanding and Parenting Easily Frustrated, Chronically Inflexible Children</em>. Harper Paperbacks.</p>
                <p className="text-xs text-muted-foreground mt-1">Collaborative Problem Solving (CPS) - Evidence-based intervention with 80% vs 44% effectiveness vs traditional methods</p>
              </div>

              <div className="pl-4 border-l-2 border-purple-400">
                <p className="font-medium">Barkley, R.A. (2012). <em>Executive Functions: What They Are, How They Work, and Why They Evolved</em>. Guilford Press.</p>
                <p className="text-xs text-muted-foreground mt-1">Executive function development, working memory, ADHD neuroscience</p>
              </div>

              <div className="pl-4 border-l-2 border-green-400">
                <p className="font-medium">Siegel, D.J. & Bryson, T.P. (2011). <em>The Whole-Brain Child: 12 Revolutionary Strategies to Nurture Your Child's Developing Mind</em>. Bantam.</p>
                <p className="text-xs text-muted-foreground mt-1">Upstairs/downstairs brain, amygdala hijacking, integration strategies</p>
              </div>

              <div className="pl-4 border-l-2 border-pink-400">
                <p className="font-medium">Dunn, W. (1997). The Impact of Sensory Processing Abilities on the Daily Lives of Young Children and Their Families. <em>Infants & Young Children, 9(4)</em>, 23-35.</p>
                <p className="text-xs text-muted-foreground mt-1">Sensory processing framework, 8 sensory systems, HSC neuroscience</p>
              </div>

              <div className="pl-4 border-l-2 border-amber-400">
                <p className="font-medium">Porges, S.W. (2011). <em>The Polyvagal Theory: Neurophysiological Foundations of Emotions, Attachment, Communication, and Self-regulation</em>. W.W. Norton.</p>
                <p className="text-xs text-muted-foreground mt-1">Co-regulation, nervous system states, neuroception (automatic threat detection)</p>
              </div>

              <div className="pl-4 border-l-2 border-red-400">
                <p className="font-medium">Shaw, P., et al. (2007). Attention-deficit/hyperactivity disorder is characterized by a delay in cortical maturation. <em>Proceedings of the National Academy of Sciences, 104(49)</em>, 19649-19654.</p>
                <p className="text-xs text-muted-foreground mt-1">Neuroimaging data: 10-13% cortical thickness reduction in ADHD/oppositional children</p>
              </div>

              <div className="pl-4 border-l-2 border-indigo-400">
                <p className="font-medium">Gottman, J.M., Katz, L.F., & Hooven, C. (1997). <em>Meta-Emotion: How Families Communicate Emotionally</em>. Lawrence Erlbaum Associates.</p>
                <p className="text-xs text-muted-foreground mt-1">Emotion coaching framework, parental emotional regulation impact</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Disclaimer */}
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
                <p className="font-semibold">Medical & Professional Disclaimer</p>
                <p>
                  This content is designed for educational purposes based on peer-reviewed research in child development and neuroscience.
                  It does not replace professional medical, psychological, or behavioral evaluation.
                  Parents experiencing persistent challenges should consult qualified specialists (child psychologists, developmental pediatricians, licensed therapists)
                  for personalized assessment and intervention plans.
                </p>
                <p className="text-xs italic">
                  If your child shows signs of severe emotional dysregulation, developmental delays, or behaviors that significantly impact daily functioning,
                  seek professional evaluation immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </MainLayout>
  );
}
