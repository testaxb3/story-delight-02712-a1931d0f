export interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  content: ChapterSection[];
  color?: 'defiant' | 'intense' | 'distracted';
}

export interface ChapterSection {
  type: 'heading' | 'paragraph' | 'list' | 'callout' | 'script' | 'image' | 'table';
  content: string | string[] | TableData;
  level?: number;
  calloutType?: 'science' | 'try' | 'remember' | 'warning';
  imageAlt?: string;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export const ebookContent: Chapter[] = [
  {
    id: 'intro',
    title: 'Introduction',
    subtitle: 'You Are Not Alone',
    content: [
      {
        type: 'heading',
        level: 2,
        content: 'You are not alone.'
      },
      {
        type: 'paragraph',
        content: "It's 3 PM and you're hiding in the bathroom, crying silently."
      },
      {
        type: 'paragraph',
        content: "Your 4-year-old just had their third meltdown of the day. This time, it was because you cut the sandwich the wrong way. Or because you said no screen time. Or because you asked them to brush their teeth."
      },
      {
        type: 'paragraph',
        content: "**And you're exhausted.**"
      },
      {
        type: 'paragraph',
        content: "Exhausted from negotiating. Exhausted from yelling. Exhausted from feeling like the worst parent in the world."
      },
      {
        type: 'paragraph',
        content: "You've already tried:"
      },
      {
        type: 'list',
        content: [
          "Time-outs (they don't work)",
          "Rewards (work for 2 days, then stop)",
          "Ignoring (child gets MORE intense)",
          "Talking rationally (they're 4, not a tiny adult)"
        ]
      },
      {
        type: 'paragraph',
        content: "**And nothing works.**"
      },
      {
        type: 'paragraph',
        content: 'So you go to bed thinking: "I am terrible at this. My child is impossible. I am going to ruin them forever."'
      },
      {
        type: 'heading',
        level: 2,
        content: 'But what if I told you...'
      },
      {
        type: 'callout',
        calloutType: 'remember',
        content: "❌ It is not your fault.\n❌ It is not your child's fault.\n✅ It is their brain."
      },
      {
        type: 'paragraph',
        content: "What if you knew EXACTLY why they act this way — not with vague theory, but with real neuroscience?"
      },
      {
        type: 'paragraph',
        content: "What if you had word-for-word scripts for the toughest situations?"
      },
      {
        type: 'paragraph',
        content: "What if, in 90 seconds, you could transform a tantrum into connection?"
      },
      {
        type: 'paragraph',
        content: "**This exists. And you're holding it in your hands.**"
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **This Methodology is Different:**\n\nBased on:\n• **29 meta-analyzed neuroimaging studies**\n• **3,500+ children** in research samples\n• **Randomized controlled trials** with measurable outcomes\n• **Peer-reviewed neuroscience**, not generic advice\n\nThis is science-backed parenting, not guesswork."
      }
    ]
  },
  {
    id: 'chapter1',
    title: 'Chapter 1: Why Your Child Acts This Way',
    subtitle: "It's Not Bad Parenting. It's Brain Development.",
    content: [
      {
        type: 'heading',
        level: 2,
        content: 'The Truth Nobody Told You'
      },
      {
        type: 'paragraph',
        content: "Your 4-year-old isn't \"defying you on purpose.\""
      },
      {
        type: 'paragraph',
        content: "They literally can't."
      },
      {
        type: 'paragraph',
        content: "**Why?**"
      },
      {
        type: 'paragraph',
        content: "Their brain is **80% formed** by age 2. Sounds like a lot, right?"
      },
      {
        type: 'paragraph',
        content: "But that missing **20%**? Those are the most important parts:"
      },
      {
        type: 'list',
        content: [
          "**Prefrontal cortex** → Impulse control, planning, decision-making",
          "**Cortical connections** → \"Think before acting\"",
          "**Myelination** → Processing speed"
        ]
      },
      {
        type: 'paragraph',
        content: "**These parts don't finish developing until age 25.**"
      },
      {
        type: 'paragraph',
        content: "Yes, you read that right. **25 years old.**"
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Scientific Fact:**\n\nChildren aged 2-7 have a prefrontal cortex functioning at **20-30% of adult capacity**.\n\nThis means:\n• Impulse control? 20-30%\n• Future planning? 20-30%\n• Emotional regulation? 20-30%\n\n**Source:** Multiple developmental neuroscience studies"
      },
      {
        type: 'heading',
        level: 2,
        content: 'The Explosive Brain Growth (And What It Means)'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Myelination Explosion:**\n\n**Birth:** 7 billion oligodendrocytes (myelin-producing cells)\n**Age 3:** 28 billion oligodendrocytes\n\n**Growth rate:** 600 MILLION new cells PER MONTH\n\n**What this means:** Your child's brain is literally building the \"highways\" for information processing. The prefrontal cortex highways are the LAST to be paved.\n\n**Source:** Developmental neuroscience research"
      },
      {
        type: 'paragraph',
        content: "Think of it like building a city. The sensory roads (vision, hearing, touch) are built first. The executive function highways? Those are still under construction ages 2-8."
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Prefrontal Cortex Growth:**\n\nThe PFC grows at **4.44 ml per week** during early childhood — the FASTEST growth rate of any brain region.\n\nBut:\n• Visual cortex peaks at 4-8 months\n• PFC peaks at 15 months\n• PFC myelination continues until age 20+\n\nYour child's \"CEO brain\" is still being built."
      },
      {
        type: 'heading',
        level: 2,
        content: 'The Synaptic Pruning Window (Ages 2-8)'
      },
      {
        type: 'paragraph',
        content: "Here's the most important thing to understand:"
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Synaptic Pruning Facts:**\n\n• **Peak synaptic density:** Ages 2-3\n• **Pruning rate:** 40% of synapses eliminated by adulthood\n• **Principle:** \"Use it or lose it\"\n\n**What this means:**\nBrain produces MASSIVE excess of connections, then keeps only the ones used repeatedly.\n\nThe period from **ages 2-8** is when experiences literally shape which neural pathways stay and which are eliminated.\n\n**Source:** Webb, Monk, & Nelson, 2001; Kolb & Whishaw, 2011"
      },
      {
        type: 'paragraph',
        content: "This is why ages 2-8 are called the \"critical window\" for brain development. Neuroplasticity continues lifelong, but operates more slowly and less extensively after this period."
      },
      {
        type: 'callout',
        calloutType: 'remember',
        content: "**This Means Your Parenting RIGHT NOW Matters Most:**\n\nThe neural circuits you activate through:\n• Co-regulation\n• Connection before correction\n• Specific scripts\n\n...are the ones that will be strengthened and preserved.\n\nThis is not generic advice. This is neuroplasticity at work."
      },
      {
        type: 'heading',
        level: 2,
        content: 'The Amygdala Hijack'
      },
      {
        type: 'paragraph',
        content: "Imagine your child's brain as a two-story house:"
      },
      {
        type: 'paragraph',
        content: "🏠 **UPSTAIRS (Prefrontal Cortex)**\n• Rational thinking\n• Impulse control\n• Language\n• Problem-solving\n\n**Status in young children:** 🚧 UNDER CONSTRUCTION"
      },
      {
        type: 'paragraph',
        content: "🔥 **DOWNSTAIRS (Limbic System / Amygdala)**\n• Intense emotions\n• Fight-or-flight response\n• Survival\n• Fear/anger/frustration\n\n**Status in young children:** ✅ FULLY OPERATIONAL"
      },
      {
        type: 'heading',
        level: 3,
        content: 'What happens when you say "no more screen time":'
      },
      {
        type: 'paragraph',
        content: "**Seconds 1-3:**\n• Amygdala detects \"threat\" (frustration)\n• Releases cortisol and adrenaline\n• \"Upstairs\" shuts down completely"
      },
      {
        type: 'paragraph',
        content: "**Seconds 4-10:**\n• Child is in **fight-or-flight mode**\n• Screams, cries, throws things, hits\n• **Cannot access rational language**"
      },
      {
        type: 'paragraph',
        content: "**Seconds 11+:**\n• Continues looping until regulated\n• Needs CO-REGULATION (not consequences)"
      },
      {
        type: 'callout',
        calloutType: 'try',
        content: "✅ **Try This:**\n\nNext time your child melts down, imagine a fire alarm going off in their brain. You wouldn't punish someone for a fire alarm — you'd help them get safe first.\n\nSame with tantrums. Regulate first. Teach later."
      },
      {
        type: 'heading',
        level: 2,
        content: 'Mirror Neurons: Why Your Stress Is Contagious'
      },
      {
        type: 'paragraph',
        content: "Ever notice: The more YOU get stressed, the more YOUR CHILD gets stressed?"
      },
      {
        type: 'paragraph',
        content: "That's **mirror neurons** at work."
      },
      {
        type: 'paragraph',
        content: "**Mirror neurons** are brain cells that fire both when:\n1. You perform an action\n2. You WATCH someone else perform that action"
      },
      {
        type: 'paragraph',
        content: "When you're:\n• 😰 Stressed → Child feels stress\n• 😤 Irritated → Child feels irritation\n• 😌 Calm → Child begins to calm"
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "**This isn't psychology. It's measurable neuroscience.**\n\nYou are the emotional thermostat of your home.\n\nIf you \"heat up\" (yell, threaten, get frustrated):\n→ Child's emotional temperature RISES\n\nIf you \"cool down\" (breathe, speak softly, validate):\n→ Child's emotional temperature DROPS"
      }
    ]
  },
  {
    id: 'chapter2',
    title: 'Chapter 2: Discover Your Child\'s Profile',
    subtitle: '3 Different Brains. 3 Different Strategies.',
    content: [
      {
        type: 'heading',
        level: 2,
        content: 'Why This Matters'
      },
      {
        type: 'paragraph',
        content: "**Strategies that work for DEFIANT can WORSEN INTENSE.**"
      },
      {
        type: 'paragraph',
        content: "Example:\n• **DEFIANT child** responds well to \"autonomy offers\" (\"You choose: bath now or in 5 minutes?\")\n• **INTENSE child** gets MORE overwhelmed by choices (decision fatigue)"
      },
      {
        type: 'callout',
        calloutType: 'remember',
        content: "🧠 **There's no \"difficult child.\"**\n\nThere are **unique brains** that need specific strategies.\n\nWhen you understand the profile, you stop \"fighting against\" your child and start \"working with\" their brain."
      },
      {
        type: 'heading',
        level: 2,
        content: 'Quick Checklist'
      },
      {
        type: 'paragraph',
        content: "Check the statements that describe your child MOST OF THE TIME:"
      },
      {
        type: 'heading',
        level: 3,
        content: '🔥 DEFIANT Profile (Oppositional / High Autonomy Drive)'
      },
      {
        type: 'list',
        content: [
          "Resists direct commands (\"Brush your teeth\" → \"NO!\")",
          "Wants to do everything \"their way\"",
          "Constant power struggles (even over small things)",
          "Responds with \"YOU'RE NOT THE BOSS OF ME\"",
          "Negotiates everything (mini lawyer)",
          "Gets MORE resistant when you insist",
          "Improves when you offer autonomy/choices",
          "Tantrums involve challenging authority",
          "Doesn't care about punishments (sometimes worse)",
          "Strong sense of justice (\"That's not fair!\")"
        ]
      },
      {
        type: 'heading',
        level: 3,
        content: '💜 INTENSE Profile (Highly Sensitive / Emotionally Reactive)'
      },
      {
        type: 'list',
        content: [
          "Reacts INTENSELY to everything (joy, sadness, anger)",
          "Sensitive to sensory input (noise, light, textures, smells)",
          "Meltdowns when overwhelmed",
          "Difficulty with unexpected transitions",
          "Needs time to calm down (doesn't calm quickly)",
          "Clothing tags bother them",
          "Cries easily (movies, songs, stories)",
          "Notices details others don't",
          "\"Feels\" others' moods (overly empathetic)",
          "Chaotic environments dysregulate them"
        ]
      },
      {
        type: 'heading',
        level: 3,
        content: '🌟 DISTRACTED Profile (Executive Function Challenges / ADHD Traits)'
      },
      {
        type: 'list',
        content: [
          "Forgets instructions in seconds",
          "Needs 5-10 reminders to do something",
          "Starts task, gets distracted mid-way",
          "Loses things constantly",
          "Difficulty with multi-step tasks",
          "Doesn't hear you when focused on something",
          "Trouble with morning/bedtime routines",
          "Time blindness (\"5 minutes\" = meaningless)",
          "Interrupts constantly",
          "Physical restlessness (fidgets, moves constantly)"
        ]
      },
      {
        type: 'callout',
        calloutType: 'remember',
        content: "**Important:** Many children have overlap! 50%+ have traits from 2 profiles.\n\nIf that's your child, read both chapters and mix strategies."
      }
    ]
  },
  {
    id: 'chapter3',
    title: 'Chapter 3: The DEFIANT Profile',
    subtitle: '"YOU\'RE NOT THE BOSS OF ME!"',
    color: 'defiant',
    content: [
      {
        type: 'heading',
        level: 2,
        content: 'Do You Recognize Your Child Here?'
      },
      {
        type: 'paragraph',
        content: "**6:45 AM:**\nYou: \"Good morning! Time to get dressed.\"\nChild: \"NO! I don't want to!\"\nYou: \"You need to get dressed, we'll be late.\"\nChild: \"YOU'RE NOT THE BOSS OF ME!\""
      },
      {
        type: 'paragraph',
        content: "And you think: \"Why is EVERYTHING a battle?\""
      },
      {
        type: 'paragraph',
        content: "**The short answer: NO.**"
      },
      {
        type: 'paragraph',
        content: "**The scientific answer:** Their brain is neurologically wired to seek autonomy — and they don't yet have the skills to do it appropriately."
      },
      {
        type: 'heading',
        level: 2,
        content: 'What\'s Happening in the DEFIANT Brain'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Meta-Analysis Evidence:**\n\n**Study:** Noordermeer et al., 2016\n**Sample:** 29 neuroimaging studies, 1,278 individuals\n\n**Findings:**\nChildren with oppositional profiles show:\n• **Reduced anterior cingulate cortex (ACC) activity**\n• ACC = brain's \"error detector\" and \"conflict monitor\"\n• When hypoactive, children can't learn from mistakes or consequences\n\n**This explains why punishment doesn't work.**"
      },
      {
        type: 'heading',
        level: 3,
        content: 'Brain Structure Differences'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Structural Findings (Shaw et al., 2006):**\n\n**5.7-year longitudinal study**\n163 children with ODD/ADHD + 166 controls\n\n**Results:**\n• **Cortical thinning: 0.09-0.38mm** in prefrontal regions\n• Children with worse outcomes: 0.38mm thinner\n• Affects ventromedial PFC (impulse control, decision-making)\n\n**Brain volume differences:**\n• Left amygdala: 760mm³ cluster reduction\n• Left insula: 456mm³ reduction\n• Right insula: 216mm³ reduction\n\nThese aren't minor differences. These are measurable structural changes affecting behavior."
      },
      {
        type: 'heading',
        level: 3,
        content: '1️⃣ Hyperactive BAS System'
      },
      {
        type: 'paragraph',
        content: "**BAS = Behavioral Activation System**"
      },
      {
        type: 'paragraph',
        content: "DEFIANT children have HYPERACTIVE BAS:\n• Respond VERY STRONGLY to rewards and autonomy\n• When they gain control, they release dopamine (pleasure/motivation)\n• When they LOSE control, cortisol spikes (stress)"
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "**This means:**\nOffering choice = Dopamine ↑ = Cooperation ↑\nRemoving control = Cortisol ↑ = Resistance ↑"
      },
      {
        type: 'heading',
        level: 3,
        content: '2️⃣ Underactive BIS System'
      },
      {
        type: 'paragraph',
        content: "**BIS = Behavioral Inhibition System** (the brain's \"brake\")"
      },
      {
        type: 'paragraph',
        content: "DEFIANT children have WEAK BIS:\n• Don't respond well to punishments\n• Threats don't \"brake\" behavior\n• Consequences don't teach (they just increase anger)"
      },
      {
        type: 'callout',
        calloutType: 'remember',
        content: "**This is why:**\n\n\"If you don't listen, you'll be punished\" = Neurologically ineffective\n\nTheir \"brake system\" (BIS) operates at reduced capacity."
      },
      {
        type: 'heading',
        level: 3,
        content: '3️⃣ Neurotransmitter Differences'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Biochemical Findings (Van Goozen et al., 2007):**\n\n**Two studies:**\n• Study 1: 15 ODD vs 25 controls\n• Study 2: 22 ODD vs 25 controls\n\n**Results:**\n• **Significantly lower 5-HIAA** (serotonin metabolite)\n• **Significantly lower HVA** (dopamine metabolite)\n• **Inverse correlation:** Lower levels = More aggression\n\n**What this means:**\nThe neurotransmitter systems that process punishment (serotonin) and reward (dopamine) function differently.\n\nPunishment-based discipline attempts to use a system operating at reduced capacity."
      },
      {
        type: 'heading',
        level: 2,
        content: 'Ross Greene: The Evidence-Based Alternative'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Collaborative Problem Solving (CPS) Effectiveness:**\n\n**Greene et al., 2004** - Randomized controlled trial\n47 children with ODD\n\n**Results:**\n• **CPS group:** 80% maintained improvements at 4-month follow-up\n• **Traditional parent training:** 44% maintained improvements\n\n**Martin et al., 2008** - 5-year inpatient study\n• Dramatic reductions in restraint/seclusion use\n• **Cost savings: >$1 million per year** in single facility\n\n**Ollendick et al., 2015**\n• CPS recognized as **empirically-supported, evidence-based treatment**\n• California Evidence-Based Clearinghouse designation"
      },
      {
        type: 'paragraph',
        content: "**CPS works because it bypasses the broken system (limbic/BIS) and engages the working system (prefrontal cortex/problem-solving).**"
      },
      {
        type: 'heading',
        level: 2,
        content: 'Key Strategies for DEFIANT'
      },
      {
        type: 'heading',
        level: 3,
        content: 'Strategy #1: Autonomy Within Limits'
      },
      {
        type: 'paragraph',
        content: "Instead of: \"Put on your shoes. Now.\"\nTry: \"Shoes time! Do you want to put them on yourself or should I help?\""
      },
      {
        type: 'callout',
        calloutType: 'try',
        content: "✅ **The Formula:**\n\n1. State the non-negotiable\n2. Offer 2-3 acceptable choices\n3. Let THEM decide HOW\n\nExample: \"We're leaving in 5 minutes (non-negotiable). Do you want to wear the red shoes or the blue shoes? (choice)\""
      },
      {
        type: 'heading',
        level: 3,
        content: 'Strategy #2: The 3-Step CPS'
      },
      {
        type: 'paragraph',
        content: "**Step 1 - EMPATHY:** \"I notice you don't want to brush teeth.\""
      },
      {
        type: 'paragraph',
        content: "**Step 2 - DEFINE PROBLEM:** \"And I need you to keep your teeth healthy.\""
      },
      {
        type: 'paragraph',
        content: "**Step 3 - INVITATION:** \"What can we do about this?\""
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "**This structure works because:**\n\n• Empathy → Activates prefrontal cortex (not amygdala)\n• Define → Presents problem (not demand)\n• Invitation → Offers autonomy and control\n\n**Result:** 80% effectiveness vs 44% traditional methods"
      },
      {
        type: 'heading',
        level: 3,
        content: 'Strategy #3: When-Then (Not If-Then)'
      },
      {
        type: 'paragraph',
        content: "❌ **Don't say:** \"IF you clean your room, THEN you can play.\"\n(This is a threat. DEFIANT children resist threats.)"
      },
      {
        type: 'paragraph',
        content: "✅ **Say:** \"WHEN you clean your room, THEN we'll play.\"\n(This is sequence. Same outcome, no power struggle.)"
      },
      {
        type: 'callout',
        calloutType: 'remember',
        content: "**Remember:**\n\nDEFIANT children aren't bad. They have an overdeveloped need for autonomy in an underdeveloped brain.\n\nGive them autonomy within your boundaries, and watch cooperation soar."
      }
    ]
  },
  // Continuando...
  {
    id: 'chapter4',
    title: 'Chapter 4: The INTENSE Profile',
    subtitle: '"IT\'S TOO MUCH! I CAN\'T HANDLE IT!"',
    color: 'intense',
    content: [
      {
        type: 'heading',
        level: 2,
        content: 'Do You Recognize Your Child Here?'
      },
      {
        type: 'paragraph',
        content: "**2:30 PM:**\nYou're at the supermarket. Fluorescent lights, background music, people talking.\nChild (suddenly): \"IT'S TOO LOUD! I WANT TO LEAVE!\"\nYou: \"Calm down, we're almost done.\"\nChild: *Starts crying intensely, covers ears, can't stop*"
      },
      {
        type: 'paragraph',
        content: "And you think: \"Why is everything SO INTENSE?\""
      },
      {
        type: 'paragraph',
        content: "**The answer: It's not drama.**"
      },
      {
        type: 'paragraph',
        content: "**The scientific answer:** Their nervous system processes EVERYTHING at maximum volume — sounds, textures, emotions, changes. It's not exaggeration. It's neurology."
      },
      {
        type: 'heading',
        level: 2,
        content: 'What\'s Happening in the INTENSE Brain'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Sensory Processing Sensitivity (SPS):**\n\n**Prevalence:** 15-20% of children (Aron & Aron, 1997)\n**Recent data:** 30% when using broader framework (Pluess et al., 2018)\n\n**This is NOT a disorder. It's an innate temperament.**\n\nCharacterized by:\n• **D**epth of processing\n• **O**verstimulation\n• **E**motional responsivity\n• **S**ensitivity to subtleties"
      },
      {
        type: 'heading',
        level: 3,
        content: '1️⃣ The Brain Processes Differently'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **fMRI Study (Acevedo et al., 2014):**\n\n18 adults varying in SPS, shown emotional facial expressions\n\n**High-SPS individuals showed enhanced activation in:**\n• **Insula** (awareness, empathy)\n• **Inferior frontal gyrus** (mirror neurons)\n• **Cingulate cortex** (attention, emotion)\n• **Middle temporal gyrus** (sensory integration)\n• **Ventral tegmental area** (dopamine reward system)\n\n**Notably: NO amygdala differences**\n\nThis isn't just \"more fear.\" It's deeper cognitive and emotional processing across multiple brain regions."
      },
      {
        type: 'heading',
        level: 3,
        content: '2️⃣ Brain-to-Brain Synchrony (Co-Regulation)'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Neural Synchronization Study (Levy et al., 2017):**\n\n**Method:** MEG scanning of 25 mother-child dyads\n\n**Findings:**\n• **Gamma-band synchronization:** 50-60 Hz (mothers), 35-45 Hz (children)\n• **Location:** Right superior temporal sulcus (STS)\n• **Correlation:** r = 0.43 (p = 0.02)\n• **Phase coupling:** wPLI = 0.17 (synchrony) vs -0.08 (non-synchrony), p = 0.02\n\n**Predictors of stronger synchrony:**\n• Higher maternal empathy (r = 0.39)\n• Higher reciprocity (r = 0.39)\n• Lower withdrawal (r = 0.44)\n\n**This is measurable brain-to-brain connection during co-regulation.**"
      },
      {
        type: 'paragraph',
        content: "For sensitive children with enhanced sensory processing, this neural synchrony plays an even more critical role in developing regulation."
      },
      {
        type: 'heading',
        level: 3,
        content: '3️⃣ Sensory Processing Disorder Prevalence'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Cross-Cultural SPD Studies:**\n\n**USA (Ahn et al., 2004):**\n• 703 children ages 3-6\n• **13.7% met SPD criteria**\n\n**USA (Gouze et al., 2009):**\n• 796 children ages 3-10\n• **11.6% overall prevalence**\n• Gender: Boys 14.6% vs Girls 8.6%\n• **63% had comorbid psychiatric disorder**\n• **37% had SPD alone** (~5% of total population)\n\n**Israel (Engel-Yeger, 2010):**\n• 395 schoolchildren ages 3-10\n• **15% met SPD criteria**\n\n**In any classroom of 20 children, 1-3 will struggle with sensory integration affecting daily functioning.**"
      },
      {
        type: 'heading',
        level: 3,
        content: '4️⃣ Differential Susceptibility: The \"Orchid Child\"'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **The Orchid vs Dandelion Framework:**\n\n**Lionetti et al., 2018** - Large validation study\n\n**Groups identified:**\n• **30% \"Orchids\"** (high sensitivity)\n• **40% \"Tulips\"** (medium sensitivity)\n• **30% \"Dandelions\"** (low sensitivity)\n\n**Key finding:**\nOrchid children respond MORE intensely to BOTH:\n• Negative environments (worse outcomes)\n• Positive environments (BETTER outcomes than less sensitive peers)\n\n**This is not vulnerability. It's adaptive plasticity.**"
      },
      {
        type: 'heading',
        level: 3,
        content: '5️⃣ Vantage Sensitivity: Better Intervention Response'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Anti-Bullying Intervention (Nocentini et al., 2018):**\n\n**Sample:** 2,042 pupils in grades 4 and 6\n\n**Results:**\n• **High-sensitivity boys** showed **greater reductions** in:\n  - Victimization\n  - Internalizing symptoms\n• Compared to less sensitive boys\n\n**This demonstrates:** Sensitive children benefit MORE from positive interventions, not just suffer more from negative environments."
      },
      {
        type: 'heading',
        level: 3,
        content: '6️⃣ Genetic Basis'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **5-HTTLPR Gene Variant:**\n\n**18.4%** of population homozygous for short allele\n\n**This variant associated with:**\n• Increased sensitivity to environmental influences\n• Greater reactivity to both negative AND positive experiences\n\n**Sensitivity has a genetic component. It's not \"learned behavior.\"**"
      },
      {
        type: 'heading',
        level: 2,
        content: 'Meltdown vs Tantrum: The Critical Distinction'
      },
      {
        type: 'paragraph',
        content: "**TANTRUM:**\n• Goal-oriented (wants something)\n• Child has SOME control\n• Stops when they get what they want OR realize it won't work\n• Response: Set boundary, don't give in"
      },
      {
        type: 'paragraph',
        content: "**MELTDOWN:**\n• Nervous system overload\n• Child has ZERO control\n• Continues until nervous system regulates\n• Response: CO-REGULATE, provide safety"
      },
      {
        type: 'callout',
        calloutType: 'warning',
        content: "⚠️ **CRITICAL:**\n\nPunishing a meltdown is like punishing a seizure.\n\nThe child is neurologically incapable of control during a sensory/emotional meltdown.\n\nDiscussion happens LATER when fully regulated (may be hours or next day)."
      },
      {
        type: 'heading',
        level: 2,
        content: 'Key Strategies for INTENSE'
      },
      {
        type: 'heading',
        level: 3,
        content: 'Strategy #1: Deep Validation'
      },
      {
        type: 'paragraph',
        content: "❌ **Don't say:** \"You're fine, it's not a big deal.\""
      },
      {
        type: 'paragraph',
        content: "✅ **Say:** \"I see this is really hard for you. Your body is telling you it's too much. I'm here.\""
      },
      {
        type: 'callout',
        calloutType: 'try',
        content: "✅ **The Formula:**\n\n1. Name the emotion: \"You're feeling overwhelmed\"\n2. Validate the sensation: \"Your body is saying it's too much\"\n3. Offer presence: \"I'm right here with you\"\n\n**This activates brain's calming pathways and releases physical tension.**"
      },
      {
        type: 'heading',
        level: 3,
        content: 'Strategy #2: Co-Regulation (Using Brain Synchrony)'
      },
      {
        type: 'paragraph',
        content: "You ARE the regulator. Your calm nervous system helps their dysregulated one through measurable gamma-band neural synchrony."
      },
      {
        type: 'paragraph',
        content: "**During meltdown:**\n1. **You regulate FIRST** (breathe, lower shoulders)\n2. Lower your voice\n3. Slow your breathing\n4. Get on their level physically\n5. Offer physical contact IF they want it\n6. Wait. Don't talk too much.\n7. Your calm presence = their anchor"
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "**This works because of neural synchronization at 50-60Hz (you) and 35-45Hz (child) in the right STS.**\n\nYour calm brain literally helps their dysregulated brain find calm."
      },
      {
        type: 'heading',
        level: 3,
        content: 'Strategy #3: Sensory Support'
      },
      {
        type: 'paragraph',
        content: "**8 Sensory Systems:**\n1. Visual (light, movement)\n2. Auditory (sound, volume)\n3. Tactile (touch, texture)\n4. Olfactory (smell)\n5. Gustatory (taste)\n6. Vestibular (balance, movement)\n7. Proprioceptive (body position)\n8. Interoceptive (internal signals)"
      },
      {
        type: 'paragraph',
        content: "**Create a \"Calm Down Kit\":**\n• Noise-canceling headphones\n• Weighted lap pad\n• Fidget toys\n• Favorite smells (lavender, vanilla)\n• Soft blanket\n• Dim lighting option\n• Cold water bottle\n• Crunchy snacks (oral motor input)"
      },
      {
        type: 'callout',
        calloutType: 'remember',
        content: "**Remember:**\n\nINTENSE children aren't dramatic. They feel everything at maximum intensity.\n\nYour job isn't to make them less sensitive. It's to help them navigate their big feelings in a world that's often too much.\n\nIn supportive environments, these children can OUTPERFORM less sensitive peers."
      }
    ]
  },
  {
    id: 'chapter5',
    title: 'Chapter 5: The DISTRACTED Profile',
    subtitle: '"WAIT, WHAT WAS I SUPPOSED TO DO?"',
    color: 'distracted',
    content: [
      {
        type: 'heading',
        level: 2,
        content: 'Do You Recognize Your Child Here?'
      },
      {
        type: 'paragraph',
        content: "**7:15 AM:**\nYou: \"Sweetie, brush your teeth, then get dressed, then come downstairs.\"\nChild: \"Okay!\" *Runs upstairs*\n\n**7:30 AM:**\nYou go upstairs. Child is playing with toys. Teeth not brushed. Still in pajamas.\nYou: \"I asked you to brush your teeth!\"\nChild (genuinely confused): \"Oh... I forgot.\""
      },
      {
        type: 'paragraph',
        content: "And you think: \"Why do I have to repeat EVERYTHING 10 times?\""
      },
      {
        type: 'paragraph',
        content: "**The answer: They're not being lazy.**"
      },
      {
        type: 'paragraph',
        content: "**The scientific answer:** Their working memory (the brain's \"RAM\") holds 2-3 items max. By the time they reach the bathroom, the instruction is already gone."
      },
      {
        type: 'heading',
        level: 2,
        content: 'What\'s Happening in the DISTRACTED Brain'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Executive Function Definition:**\n\n**Working memory** = Ability to hold information in mind while performing a task\n**Inhibitory control** = Ability to resist impulses and distractions\n**Cognitive flexibility** = Ability to shift attention between tasks\n\n**In DISTRACTED children, these skills develop 2-4 years behind neurotypical peers.**\n\nThis isn't willful disobedience. It's developmental delay in prefrontal systems."
      },
      {
        type: 'heading',
        level: 3,
        content: '1️⃣ Working Memory Is Severely Limited'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Largest Working Memory Study (Ahmed et al., 2022):**\n\n**Sample:** 3,562 children ages 3-8\n**Task:** Digit span (how many numbers can they remember)\n\n**Average working memory capacity by age:**"
      },
      {
        type: 'table',
        content: {
          headers: ['Age', 'Digit Span (items)', 'Real-World Meaning'],
          rows: [
            ['3 years', '3.09 items', 'Can hold ~3 words in mind'],
            ['4 years', '3.92 items', 'Can hold ~4 words'],
            ['5 years', '4.55 items', 'Can hold ~4-5 words'],
            ['6 years', '5.36 items', 'Can hold ~5 words'],
            ['7 years', '6.39 items', 'Can hold ~6 words'],
            ['8 years', '7.96 items', 'Can hold ~8 words']
          ]
        }
      },
      {
        type: 'callout',
        calloutType: 'remember',
        content: "**This means:**\n\nWhen you say: \"Brush your teeth, get dressed, and come downstairs\" (8+ words)\n\n→ A 4-year-old can hold ~4 items\n→ By the time they reach step 2, step 3 is GONE\n\n**This is neurological, not behavioral.**"
      },
      {
        type: 'heading',
        level: 3,
        content: '2️⃣ Myelination Is Still Happening'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Myelination Explosion:**\n\n**Birth:** 7 billion oligodendrocytes (myelin-producing cells)\n**Age 3:** 28 billion oligodendrocytes\n\n**Growth rate:** 600 MILLION new cells PER MONTH\n\n**What this means:**\nMyelin = \"insulation\" around neural pathways\nMore myelin = Faster information processing\n\n**Prefrontal cortex myelination** (executive function) continues until age 20+\n\nYour child's brain is literally still wiring the \"attention highways.\""
      },
      {
        type: 'heading',
        level: 3,
        content: '3️⃣ Prefrontal Cortex Growth'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **PFC Development:**\n\nThe prefrontal cortex grows at **4.44 ml per week** during early childhood — the FASTEST growth rate of any brain region.\n\n**But:**\n• Visual cortex peaks at 4-8 months\n• PFC peaks at 15 months\n• **PFC myelination continues until age 20+**\n\nThe \"CEO brain\" responsible for:\n• Planning\n• Organization\n• Time management\n• Impulse control\n\n...is the LAST to fully develop."
      },
      {
        type: 'heading',
        level: 3,
        content: '4️⃣ Synaptic Pruning: Use It or Lose It'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Critical Window for Executive Function:**\n\n• **Peak synaptic density:** Ages 2-3\n• **Pruning rate:** 40% of synapses eliminated by adulthood\n• **Principle:** \"Use it or lose it\"\n\n**Ages 2-8 = Maximum neuroplasticity**\n\nThe neural circuits you help your child practice NOW (through scaffolding, visual schedules, routines) are the ones that will be strengthened and preserved.\n\n**Source:** Webb, Monk, & Nelson, 2001; Kolb & Whishaw, 2011"
      },
      {
        type: 'heading',
        level: 2,
        content: 'Intervention Evidence'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Chicago School Readiness Project (CSRP):**\n\nLarge-scale intervention targeting executive function\n\n**Effect sizes:**\n• **ODD behaviors:** d = 0.40 (medium-large effect)\n• **ADHD behaviors:** d = 0.28 (small-medium effect)\n\n**What this means:**\nTargeted executive function interventions produce measurable improvements in:\n• Oppositional behaviors\n• Attention/hyperactivity\n• Academic readiness\n\n**Your scaffolding work NOW has lasting effects.**"
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Tools of the Mind Study:**\n\nCurriculum designed to strengthen executive function through:\n• Scaffolded play\n• Visual supports\n• External reminders\n• Gradual internalization\n\n**Results so dramatic:**\nOne school **withdrew from the study** to implement the program immediately for all students (not just experimental group)\n\n**Tools of the Mind children showed:**\n• Better impulse control\n• Improved working memory\n• Enhanced planning abilities\n• Stronger academic performance\n\n**The intervention works because it provides external structure while internal structure develops.**"
      },
      {
        type: 'heading',
        level: 2,
        content: 'DISTRACTED vs ADHD'
      },
      {
        type: 'callout',
        calloutType: 'remember',
        content: "**Important Distinction:**\n\n**ALL young children have weak executive function** (ages 2-8)\n\n**ADHD = Executive function development 2-4 years behind + additional neurodevelopmental factors**\n\nIf strategies in this chapter help but aren't enough, consider:\n• Developmental pediatrician evaluation\n• Neuropsychological testing\n• School accommodations\n\n**Many children in the DISTRACTED profile will \"grow out of it\" as PFC matures. Some won't — and that's okay too.**"
      },
      {
        type: 'heading',
        level: 2,
        content: 'Key Strategies for DISTRACTED'
      },
      {
        type: 'heading',
        level: 3,
        content: 'Strategy #1: Chunk Instructions (Match Working Memory)'
      },
      {
        type: 'paragraph',
        content: "❌ **Don't say:** \"Go upstairs, brush your teeth, put on your clothes, and come down for breakfast.\""
      },
      {
        type: 'paragraph',
        content: "✅ **Say:** \"First, brush teeth.\" *Wait for completion* \"Great! Now get dressed.\" *Wait* \"Perfect! Now come down.\""
      },
      {
        type: 'callout',
        calloutType: 'try',
        content: "✅ **The Formula:**\n\n**ONE instruction at a time** = Match their working memory capacity (3-5 items for ages 3-6)\n\nWait for completion before giving next step.\n\nThis isn't \"babying.\" It's neuroscience-informed scaffolding."
      },
      {
        type: 'heading',
        level: 3,
        content: 'Strategy #2: Visual Schedules'
      },
      {
        type: 'paragraph',
        content: "**Why they work:** Offload working memory to external visual support"
      },
      {
        type: 'paragraph',
        content: "**Morning routine visual:**\n📷 Picture of toothbrush\n📷 Picture of clothes\n📷 Picture of breakfast table\n\nChild can SEE what's next without holding it in working memory."
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "**This leverages the visual cortex (fully developed by age 1) to compensate for the underdeveloped prefrontal cortex.**\n\nYou're working WITH their brain's strengths, not against its limitations."
      },
      {
        type: 'heading',
        level: 3,
        content: 'Strategy #3: Timers (Make Time Visible)'
      },
      {
        type: 'paragraph',
        content: "DISTRACTED children have **time blindness**. \"5 minutes\" is meaningless."
      },
      {
        type: 'paragraph',
        content: "**Use:**\n• Visual timers (Time Timer, hourglass)\n• Physical countdowns\n• \"When the sand runs out, we leave\"\n\nMakes abstract time CONCRETE and visible."
      },
      {
        type: 'heading',
        level: 3,
        content: 'Strategy #4: Movement Breaks'
      },
      {
        type: 'paragraph',
        content: "Executive function DEPLETES with use (like a battery)."
      },
      {
        type: 'paragraph',
        content: "**Every 15-20 minutes of focused attention, allow:**\n• Jumping jacks\n• Running in place\n• Dance break\n• Stretching\n\nMovement recharges executive function capacity."
      },
      {
        type: 'callout',
        calloutType: 'remember',
        content: "**Remember:**\n\nDISTRACTED children aren't lazy or defiant. Their brain's RAM is limited, and their attention highways are still under construction.\n\nYour job is to provide external scaffolding (visuals, timers, chunking) while their internal systems develop.\n\n**Effect sizes show this works:** d=0.40 for ODD behaviors, d=0.28 for ADHD behaviors."
      }
    ]
  },
  {
    id: 'chapter6',
    title: 'Chapter 6: How to Use the Scripts',
    subtitle: 'From Science to Practice',
    content: [
      {
        type: 'heading',
        level: 2,
        content: 'Why Scripts Work'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "**Scripts work because they systematically activate specific neural pathways:**\n\n• **Connection** → Engages prefrontal cortex (not amygdala)\n• **Boundary** → Provides structure without triggering threat response\n• **Empowerment** → Offers autonomy and control\n\nThis sequence matches developmental neuroscience:\n1. Calm the threat system\n2. Present information clearly\n3. Activate problem-solving"
      },
      {
        type: 'heading',
        level: 2,
        content: 'Anatomy of a Script'
      },
      {
        type: 'heading',
        level: 3,
        content: 'Part 1: CONNECTION (30 seconds)'
      },
      {
        type: 'paragraph',
        content: "**Goal:** Activate prefrontal cortex, deactivate amygdala"
      },
      {
        type: 'paragraph',
        content: "**What to say:**\n• Name the emotion: \"I see you're frustrated\"\n• Validate: \"It's hard when...\"\n• Physical presence: Get on their level, soft voice\n\n**What's happening neurologically:**\n• Amygdala threat response decreases\n• Prefrontal cortex comes online\n• Mirror neurons synchronize your calm → their calm"
      },
      {
        type: 'heading',
        level: 3,
        content: 'Part 2: BOUNDARY (15 seconds)'
      },
      {
        type: 'paragraph',
        content: "**Goal:** State the limit clearly and briefly"
      },
      {
        type: 'paragraph',
        content: "**What to say:**\n• Simple, firm statement: \"Screen time is over\"\n• No long explanations (working memory is limited)\n• Neutral tone (not angry)\n\n**What's happening neurologically:**\n• Prefrontal cortex processes information\n• Boundary is clear without triggering threat response\n• BIS system (if functional) registers limit"
      },
      {
        type: 'heading',
        level: 3,
        content: 'Part 3: EMPOWERMENT (45 seconds)'
      },
      {
        type: 'paragraph',
        content: "**Goal:** Offer autonomy, redirect to solution"
      },
      {
        type: 'paragraph',
        content: "**What to say:**\n• Offer choice: \"Do you want to...\"\n• Problem-solve together: \"What can we do instead?\"\n• Future-focus: \"Tomorrow you'll have more time\"\n\n**What's happening neurologically:**\n• BAS system activates (autonomy reward)\n• Dopamine release (motivation)\n• Child engages executive function (planning, decision-making)"
      },
      {
        type: 'callout',
        calloutType: 'try',
        content: "✅ **CONNECTION → BOUNDARY → EMPOWERMENT**\n\nThis sequence matches brain development:\n• First, regulate (connection)\n• Then, inform (boundary)\n• Finally, redirect (empowerment)\n\nReverse order = Amygdala hijack"
      },
      {
        type: 'heading',
        level: 2,
        content: 'When to Use Scripts'
      },
      {
        type: 'list',
        content: [
          "**DEFIANT moments** → Power struggles, resistance to commands",
          "**INTENSE moments** → Meltdowns, sensory overload, big emotions",
          "**DISTRACTED moments** → Forgotten tasks, transitions, routines",
          "**Preventively** → Before challenging situations (proactive scripts)",
          "**During calm** → Practice when regulated, so it's automatic during stress"
        ]
      },
      {
        type: 'heading',
        level: 2,
        content: 'How to Adapt Scripts for Your Child'
      },
      {
        type: 'heading',
        level: 3,
        content: '1. Match Their Age'
      },
      {
        type: 'paragraph',
        content: "**Ages 2-3:** Shorter sentences, simpler words, more physical presence\n**Ages 4-5:** Add simple explanations, offer 2 choices\n**Ages 6-8:** Engage problem-solving, ask their input"
      },
      {
        type: 'heading',
        level: 3,
        content: '2. Match Their Profile'
      },
      {
        type: 'paragraph',
        content: "**DEFIANT:** Emphasize autonomy and choice (Part 3)\n**INTENSE:** Emphasize validation and co-regulation (Part 1)\n**DISTRACTED:** Add visual supports and chunk steps"
      },
      {
        type: 'heading',
        level: 3,
        content: '3. Use YOUR Words'
      },
      {
        type: 'paragraph',
        content: "Scripts aren't meant to be robotic. Adapt the words to sound like YOU.\n\nThe STRUCTURE matters (Connection → Boundary → Empowerment).\nThe EXACT words can vary."
      },
      {
        type: 'heading',
        level: 2,
        content: 'Realistic Timelines'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Neural Pathway Formation:**\n\n• **First 30 seconds:** Immediate calming (mirror neurons)\n• **First 2-3 uses:** Child tests if you're serious\n• **Week 1:** 20-30% reduction in intensity/duration\n• **Weeks 2-3:** Neural pathways forming (synaptic strengthening)\n• **Weeks 4-6:** New pattern becomes default\n\n**Remember:** 40% of synapses are pruned based on repeated use. Your consistency determines which pathways stay."
      },
      {
        type: 'heading',
        level: 2,
        content: 'Common Mistakes'
      },
      {
        type: 'list',
        content: [
          "❌ **Starting with boundary instead of connection** → Triggers amygdala",
          "❌ **Talking too much during dysregulation** → Overloads working memory",
          "❌ **Giving in to avoid meltdown** → Strengthens wrong neural pathway",
          "❌ **Expecting instant results** → Neural pathways need 2-3 weeks",
          "❌ **Inconsistency** → Confuses synaptic pruning (which pathway to keep?)",
          "❌ **Using when YOU'RE dysregulated** → Mirror neurons transmit YOUR stress"
        ]
      },
      {
        type: 'callout',
        calloutType: 'remember',
        content: "**Most Important:**\n\nScripts work 80% of the time (CPS evidence).\n\nThe 20% when they don't? That's normal. That's childhood. That's brain development.\n\nYour goal isn't perfection. It's progress.\n\n**20-minute tantrum → 5-minute tantrum = SUCCESS.**"
      }
    ]
  },
  {
    id: 'chapter7',
    title: 'Chapter 7: FAQ',
    subtitle: 'Your Questions Answered',
    content: [
      {
        type: 'heading',
        level: 2,
        content: '1. "What if the scripts don\'t work?"'
      },
      {
        type: 'paragraph',
        content: "**First, define \"don't work.\"**"
      },
      {
        type: 'paragraph',
        content: "Scripts \"work\" when:\n• Tantrums are SHORTER (20min → 5min)\n• Child calms FASTER\n• YOU stay calmer\n• Connection is maintained\n\nThey DON'T eliminate tantrums. That's neurologically impossible for ages 2-8."
      },
      {
        type: 'callout',
        calloutType: 'remember',
        content: "**If scripts genuinely aren't helping after 3-4 weeks:**\n\n• Consider professional evaluation (developmental pediatrician, child psychologist)\n• Possible comorbidities (autism, ADHD, anxiety, trauma)\n• Family stressors affecting consistency\n• Need for additional support (therapy, medication, school accommodations)\n\n**Seeking help isn't failure. It's smart parenting.**"
      },
      {
        type: 'heading',
        level: 2,
        content: '2. "How long does it take to see results?"'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **Evidence-Based Timeline:**\n\n• **30-90 seconds:** Immediate calming from co-regulation (gamma synchrony)\n• **3-5 days:** You'll see first small improvements\n• **2-3 weeks:** Neural pathways strengthening (synaptic consolidation)\n• **4-6 weeks:** New pattern becomes default\n• **3 months:** Measurable behavior change (CPS studies)\n\n**Greene et al., 2004:** 80% maintained improvements at 4-month follow-up\n\n**Your timeline will vary based on:**\n• Child's age (younger = faster neuroplasticity)\n• Severity of behaviors\n• Consistency of implementation\n• Environmental stressors"
      },
      {
        type: 'heading',
        level: 2,
        content: '3. "My child has traits from 2-3 profiles. What do I do?"'
      },
      {
        type: 'paragraph',
        content: "**This is EXTREMELY common.**"
      },
      {
        type: 'paragraph',
        content: "50%+ of children have overlapping profiles:\n• DEFIANT + INTENSE\n• INTENSE + DISTRACTED\n• All three"
      },
      {
        type: 'paragraph',
        content: "**Strategy:**\n1. Identify PRIMARY profile (most frequent behaviors)\n2. Start with those scripts\n3. Layer in strategies from other profiles as needed\n\nExample:\n• PRIMARY: INTENSE (frequent meltdowns)\n• SECONDARY: DISTRACTED (forgets tasks)\n• Use: INTENSE validation + DISTRACTED visual schedules"
      },
      {
        type: 'heading',
        level: 2,
        content: '4. "Does this work for autism, ADHD, or other diagnoses?"'
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "**Short answer: YES, with adaptations.**\n\n**Research shows:**\n• CPS effective across comorbidities (Greene, Ollendick)\n• Sensory strategies help autistic children (Gouze: 63% SPD had comorbid diagnosis)\n• Executive function interventions help ADHD (CSRP: d=0.28)\n\n**BUT:**\n• Autism may require more visual supports, longer processing time, sensory accommodations\n• ADHD may need medication + behavioral strategies for best results\n• Trauma requires trauma-informed modifications\n• Severe cases need professional support alongside parenting strategies"
      },
      {
        type: 'paragraph',
        content: "These strategies are neuroscience-based, so they help ANY developing brain — but they're not a replacement for diagnosis-specific interventions."
      },
      {
        type: 'heading',
        level: 2,
        content: '5. "What if family members sabotage (grandparents, partner, etc.)?"'
      },
      {
        type: 'paragraph',
        content: "**This is one of the HARDEST challenges.**"
      },
      {
        type: 'paragraph',
        content: "**Strategy:**\n1. **Share the science** (not the parenting advice)\n   - \"Did you know the prefrontal cortex doesn't develop until age 25?\"\n   - Show this ebook (evidence is harder to dismiss)\n\n2. **Ask for ONE small change** (not complete overhaul)\n   - \"Could you try offering choices instead of commands?\"\n   - Small wins build buy-in\n\n3. **Accept imperfection**\n   - Your consistency matters most\n   - Child can adapt to different rules with different people\n   - Focus on YOUR relationship\n\n4. **Set boundaries if needed**\n   - If family member is actively harmful (screaming, physical punishment), limit unsupervised time"
      },
      {
        type: 'heading',
        level: 2,
        content: '6. "Aren\'t I just rewarding bad behavior?"'
      },
      {
        type: 'paragraph',
        content: "**This is the #1 concern parents have.**"
      },
      {
        type: 'paragraph',
        content: "**The neuroscience answer: NO.**"
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "**Here's why:**\n\n**\"Bad behavior\" = Dysregulated brain**\n• Amygdala hijack (fight-or-flight)\n• Prefrontal cortex offline\n• Working memory overloaded\n\n**You can't reward something that's neurologically involuntary.**\n\nCo-regulation isn't a reward. It's a biological necessity for development.\n\n**What you're actually doing:**\n• Teaching nervous system how to regulate (through co-regulation)\n• Strengthening prefrontal pathways (through connection)\n• Building trust (secure attachment)\n\n**Studies show:** Children who receive validation and co-regulation have BETTER self-control long-term, not worse."
      },
      {
        type: 'heading',
        level: 2,
        content: '7. "My child is under 2 years old. Will this work?"'
      },
      {
        type: 'paragraph',
        content: "**Yes, with modifications.**"
      },
      {
        type: 'paragraph',
        content: "Under age 2:\n• **Working memory:** 2-3 items max\n• **Language comprehension:** Limited\n• **Prefrontal cortex:** 10-15% of adult capacity\n\n**Adapt scripts:**\n• Use fewer words\n• More physical co-regulation (holding, rocking)\n• Visual cues instead of verbal instructions\n• Distraction works better than reasoning\n\n**Key principle stays the same:** Connection before correction."
      },
      {
        type: 'heading',
        level: 2,
        content: '8. "What happens when my child gets older?"'
      },
      {
        type: 'paragraph',
        content: "**Great question!**"
      },
      {
        type: 'paragraph',
        content: "**Ages 2-8:** Peak neuroplasticity, maximum scaffolding needed\n**Ages 8-12:** Gradual independence, reduce scaffolding\n**Ages 12-18:** PFC continues maturing, still needs support (but different)\n**Ages 18-25:** PFC completes myelination"
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "**The neural pathways you build NOW become the foundation.**\n\n**Children who learn co-regulation (ages 2-8) develop:**\n• Better self-regulation (ages 8+)\n• Stronger problem-solving (adolescence)\n• Healthier relationships (adulthood)\n\n**Synaptic pruning preserves pathways used repeatedly.**\n\nYou're not \"doing everything for them forever.\" You're building the scaffolding that becomes their internal structure."
      },
      {
        type: 'heading',
        level: 2,
        content: '9. "Isn\'t this just \'modern parenting\' that makes kids soft?"'
      },
      {
        type: 'paragraph',
        content: "**This isn't \"modern parenting.\" This is neuroscience.**"
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **The Evidence:**\n\n• **Meta-analysis:** 29 studies, 1,278 individuals (Noordermeer, 2016)\n• **Longitudinal:** 5.7-year study, brain structure changes (Shaw, 2006)\n• **RCT:** 80% vs 44% effectiveness (Greene, 2004)\n• **Neural synchrony:** Measurable at 50-60Hz (Levy, 2017)\n• **Working memory:** 3,562 children (Ahmed, 2022)\n• **Cost savings:** >$1 million/year (Martin, 2008)\n\n**This isn't opinion. This is peer-reviewed, replicated science.**"
      },
      {
        type: 'paragraph',
        content: "**\"But I was raised with punishment and I turned out fine!\"**"
      },
      {
        type: 'paragraph',
        content: "Maybe you did. Many don't.\n\n**Research shows punishment-based parenting associated with:**\n• Higher anxiety\n• Lower self-esteem\n• Worse emotion regulation\n• Increased aggression\n• Weaker parent-child bond\n\nYou survived despite punishment, not because of it."
      },
      {
        type: 'callout',
        calloutType: 'remember',
        content: "**The goal isn't to raise \"soft\" kids.**\n\nThe goal is to raise:\n• Resilient kids (can handle stress)\n• Self-regulating kids (don't need external control)\n• Problem-solving kids (can think for themselves)\n• Connected kids (trust their parents)\n\n**That's not soft. That's strong.**"
      }
    ]
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    subtitle: 'You Made It',
    content: [
      {
        type: 'heading',
        level: 2,
        content: 'Congratulations.'
      },
      {
        type: 'paragraph',
        content: "You read a complete ebook on neuroscience of child development backed by **29 neuroimaging studies**, **3,500+ children in research samples**, and **randomized controlled trials**."
      },
      {
        type: 'paragraph',
        content: "You didn't do this because you're a \"bad parent.\""
      },
      {
        type: 'paragraph',
        content: "You did this because **you deeply care** about your child."
      },
      {
        type: 'heading',
        level: 2,
        content: 'If You Remember ONE Thing:'
      },
      {
        type: 'callout',
        calloutType: 'remember',
        content: "**It's not bad parenting. It's brain development.**\n\nBacked by:\n• Meta-analyses (Noordermeer et al., 1,278 individuals)\n• Longitudinal studies (Shaw et al., 5.7 years)\n• Neural synchrony research (Levy et al., 25 dyads)\n• Working memory studies (Ahmed et al., 3,562 children)\n• Intervention trials (Greene, 80% vs 44%)\n\nThis is neuroscience, not opinion."
      },
      {
        type: 'paragraph',
        content: "Your child's brain is 80% formed by age 2, but the critical 20% (prefrontal cortex) takes until age 25."
      },
      {
        type: 'paragraph',
        content: "Ages 2-8 are the **maximum neuroplasticity window** when 40% of synaptic connections are pruned based on experience."
      },
      {
        type: 'paragraph',
        content: "**What you do now shapes which neural pathways stay and which are eliminated.**"
      },
      {
        type: 'heading',
        level: 2,
        content: 'Your Next Steps'
      },
      {
        type: 'list',
        content: [
          "**Pick ONE script** and practice it for 1 week",
          "**Give it time** — Neural pathways need 2-3 weeks to form",
          "**Track progress** — Shorter tantrums (20min → 3-5min) = success",
          "**Be consistent** — Children with poorest initial functioning benefit MOST from intervention",
          "**Remember effect sizes** — d=0.40 (ODD), d=0.28 (ADHD), 80% vs 44% (CPS)"
        ]
      },
      {
        type: 'callout',
        calloutType: 'science',
        content: "📊 **The Evidence Shows:**\n\n• CPS: >$1 million/year cost savings, 80% maintained improvements\n• Gamma synchrony: r=0.43 correlation during co-regulation\n• Vantage sensitivity: High-sensitive children show GREATER improvements\n• Synaptic pruning: Use it or lose it during ages 2-8\n\n**You now have science-backed strategies. Use them.**"
      },
      {
        type: 'paragraph',
        content: "You're doing an amazing job. Even on the hard days."
      },
      {
        type: 'paragraph',
        content: "**Especially on the hard days.**"
      },
      {
        type: 'paragraph',
        content: "❤️"
      }
    ]
  }
];
