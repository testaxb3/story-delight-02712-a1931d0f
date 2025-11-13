// Enhanced Quiz Questions - More Specific and Scientific
// Based on NEP System neuroscience research

export type BrainCategory = 'INTENSE' | 'DISTRACTED' | 'DEFIANT' | 'NEUTRAL';
export type BrainProfile = 'INTENSE' | 'DISTRACTED' | 'DEFIANT';

export interface Option {
  value: string;
  label: string;
  scores: Partial<Record<BrainCategory, number>>;
}

export interface Question {
  question: string;
  context?: string;
  options: Option[];
}

export const quizQuestions: Question[] = [
  {
    question: "When your child experiences a disappointment (denied treat, can't watch TV, toy breaks)...",
    context: "This reveals emotional regulation patterns",
    options: [
      {
        value: 'A',
        label: 'Complete emotional flooding - crying/screaming for 15-30+ minutes, inconsolable',
        scores: { INTENSE: 4 }
      },
      {
        value: 'B',
        label: 'Brief outburst then quickly distracted by something else, forgets original upset',
        scores: { DISTRACTED: 4 }
      },
      {
        value: 'C',
        label: 'Argues intensely, tries to negotiate/manipulate, refuses to accept "no"',
        scores: { DEFIANT: 4 }
      },
      {
        value: 'D',
        label: 'Shows disappointment appropriately, recovers within a few minutes',
        scores: { NEUTRAL: 1 }
      },
    ]
  },
  {
    question: "During transitions (leaving park, ending playtime, bedtime), your child...",
    context: "Transition difficulty indicates nervous system flexibility",
    options: [
      {
        value: 'A',
        label: 'Has extreme difficulty shifting - meltdowns, crying, physical resistance',
        scores: { INTENSE: 3 }
      },
      {
        value: 'B',
        label: 'Doesn\'t hear/acknowledge transition, lost in their activity, needs multiple reminders',
        scores: { DISTRACTED: 4 }
      },
      {
        value: 'C',
        label: 'Actively refuses, bargains endlessly, "just 5 more minutes!" power struggles',
        scores: { DEFIANT: 4 }
      },
      {
        value: 'D',
        label: 'Transitions relatively smoothly with one warning',
        scores: { NEUTRAL: 1 }
      },
    ]
  },
  {
    question: "Your child's response to sensory input (loud noises, scratchy fabrics, bright lights)...",
    context: "Sensory processing reveals neurological sensitivity",
    options: [
      {
        value: 'A',
        label: 'Extreme sensitivity - covers ears, refuses certain clothes, melts down from sensory overload',
        scores: { INTENSE: 4 }
      },
      {
        value: 'B',
        label: 'Seeks intense sensation - crashes, jumps, touches everything, needs constant movement',
        scores: { DISTRACTED: 3 }
      },
      {
        value: 'C',
        label: 'Very particular and controlling about their environment/clothing preferences',
        scores: { DEFIANT: 2 }
      },
      {
        value: 'D',
        label: 'Normal sensory responses, no major sensitivities',
        scores: { NEUTRAL: 1 }
      },
    ]
  },
  {
    question: "When given multi-step instructions (\"Put shoes on, get backpack, meet me at door\")...",
    context: "Working memory and executive function assessment",
    options: [
      {
        value: 'A',
        label: 'Becomes overwhelmed, freezes, or only does first step then melts down',
        scores: { INTENSE: 3 }
      },
      {
        value: 'B',
        label: 'Starts first task, gets distracted midway, forgets the rest completely',
        scores: { DISTRACTED: 4 }
      },
      {
        value: 'C',
        label: 'Argues about each step, questions why, tries to do it their way or not at all',
        scores: { DEFIANT: 3 }
      },
      {
        value: 'D',
        label: 'Completes 2-3 steps independently with minimal prompting',
        scores: { NEUTRAL: 1 }
      },
    ]
  },
  {
    question: "Your child's sleep patterns are...",
    context: "Sleep regulation indicates nervous system state",
    options: [
      {
        value: 'A',
        label: 'Extremely difficult - needs perfect conditions, wakes multiple times, takes hours to fall asleep',
        scores: { INTENSE: 4 }
      },
      {
        value: 'B',
        label: 'Very restless - tossing, turning, talking, can\'t settle their body down',
        scores: { DISTRACTED: 3 }
      },
      {
        value: 'C',
        label: 'Major bedtime battles - refuses to go, endless negotiations, sneaks out of room',
        scores: { DEFIANT: 4 }
      },
      {
        value: 'D',
        label: 'Age-appropriate sleep with predictable routine',
        scores: { NEUTRAL: 1 }
      },
    ]
  },
  {
    question: "At mealtime, your child...",
    context: "Eating behavior reveals control and sensory patterns",
    options: [
      {
        value: 'A',
        label: 'Extremely picky (5-10 safe foods), gags on textures, strong aversions',
        scores: { INTENSE: 3 }
      },
      {
        value: 'B',
        label: 'Can\'t sit still, up and down constantly, eating while moving around',
        scores: { DISTRACTED: 4 }
      },
      {
        value: 'C',
        label: 'Refuses what\'s served, demands alternatives, major power struggles over food',
        scores: { DEFIANT: 4 }
      },
      {
        value: 'D',
        label: 'Eats variety of foods, sits for most of meal',
        scores: { NEUTRAL: 1 }
      },
    ]
  },
  {
    question: "In peer interactions (playground, playdate), your child...",
    context: "Social processing and regulation with peers",
    options: [
      {
        value: 'A',
        label: 'Gets overwhelmed quickly, cries easily when excluded, needs frequent breaks',
        scores: { INTENSE: 3 }
      },
      {
        value: 'B',
        label: 'Doesn\'t read social cues, interrupts, invades space, plays too rough without realizing',
        scores: { DISTRACTED: 4 }
      },
      {
        value: 'C',
        label: 'Must be in charge, struggles sharing control, becomes aggressive when doesn\'t get their way',
        scores: { DEFIANT: 4 }
      },
      {
        value: 'D',
        label: 'Plays cooperatively most of the time, normal conflicts',
        scores: { NEUTRAL: 1 }
      },
    ]
  },
  {
    question: "Your child's typical tantrum duration and intensity is...",
    context: "Meltdown patterns are neurological signatures",
    options: [
      {
        value: 'A',
        label: '20-60+ minutes, full-body involvement, completely dysregulated, exhausting',
        scores: { INTENSE: 5 }
      },
      {
        value: 'B',
        label: '2-5 minutes, explosive but brief, easily redirected to something new',
        scores: { DISTRACTED: 2 }
      },
      {
        value: 'C',
        label: 'Can last long if power struggle continues, purposeful/strategic outbursts',
        scores: { DEFIANT: 4 }
      },
      {
        value: 'D',
        label: 'Rare tantrums, short-lived when they occur',
        scores: { NEUTRAL: 1 }
      },
    ]
  },
  {
    question: "When doing homework or structured tasks...",
    context: "Executive function and frustration tolerance",
    options: [
      {
        value: 'A',
        label: 'Gives up immediately when it\'s hard, cries, "I can\'t do it!", extreme frustration',
        scores: { INTENSE: 4 }
      },
      {
        value: 'B',
        label: 'Starts ok but attention drifts after 2-3 minutes, needs constant redirection',
        scores: { DISTRACTED: 5 }
      },
      {
        value: 'C',
        label: 'Argues it\'s stupid/pointless, procrastinates, refuses unless on their terms',
        scores: { DEFIANT: 3 }
      },
      {
        value: 'D',
        label: 'Completes tasks with normal level of parental support',
        scores: { NEUTRAL: 1 }
      },
    ]
  },
  {
    question: "When screen time ends, your child...",
    context: "Dopamine regulation and transition ability",
    options: [
      {
        value: 'A',
        label: 'Major meltdowns every single time, screaming, hitting, complete dysregulation',
        scores: { INTENSE: 5 }
      },
      {
        value: 'B',
        label: 'Hyperfocused, doesn\'t hear you, needs device physically removed, then moves on',
        scores: { DISTRACTED: 3 }
      },
      {
        value: 'C',
        label: 'Endless negotiation, sneaks device back, lies about time, major power struggle',
        scores: { DEFIANT: 5 }
      },
      {
        value: 'D',
        label: 'Mild protest but complies with timer/warning',
        scores: { NEUTRAL: 1 }
      },
    ]
  },
  {
    question: "Your child's physical energy level and body regulation is...",
    context: "Proprioceptive and vestibular system",
    options: [
      {
        value: 'A',
        label: 'Either shutdown/lethargic OR hyperaroused with no in-between',
        scores: { INTENSE: 3 }
      },
      {
        value: 'B',
        label: 'Constant movement - can\'t sit still, always fidgeting, needs to move to think',
        scores: { DISTRACTED: 5 }
      },
      {
        value: 'C',
        label: 'Uses physical aggression when frustrated - hitting, kicking, throwing',
        scores: { DEFIANT: 3 }
      },
      {
        value: 'D',
        label: 'Age-appropriate energy, can sit for activities when needed',
        scores: { NEUTRAL: 1 }
      },
    ]
  },
  {
    question: "When siblings or peers take their toy or invade their space...",
    context: "Emotional reactivity and boundary response",
    options: [
      {
        value: 'A',
        label: 'Immediate tears, intense emotional reaction, needs long time to recover',
        scores: { INTENSE: 4 }
      },
      {
        value: 'B',
        label: 'Impulsive physical reaction (grabs back, pushes) without thinking',
        scores: { DISTRACTED: 3 }
      },
      {
        value: 'C',
        label: 'Escalates to aggression, refuses to share, retaliates strategically',
        scores: { DEFIANT: 4 }
      },
      {
        value: 'D',
        label: 'Protests verbally, can be coached through sharing/turn-taking',
        scores: { NEUTRAL: 1 }
      },
    ]
  },
  {
    question: "In public spaces (store, restaurant, waiting room)...",
    context: "Behavioral regulation under environmental stress",
    options: [
      {
        value: 'A',
        label: 'Overstimulated quickly, meltdowns from crowds/noise, needs to leave early',
        scores: { INTENSE: 4 }
      },
      {
        value: 'B',
        label: 'Wanders off, touches everything, can\'t stay with you, oblivious to safety',
        scores: { DISTRACTED: 5 }
      },
      {
        value: 'C',
        label: 'Tests every boundary, demands items, major scenes when told no',
        scores: { DEFIANT: 3 }
      },
      {
        value: 'D',
        label: 'Stays close, appropriate behavior with occasional reminders',
        scores: { NEUTRAL: 1 }
      },
    ]
  },
  {
    question: "Morning routine (wake up to leaving house)...",
    context: "Executive function and emotional baseline",
    options: [
      {
        value: 'A',
        label: 'Extremely difficult - grumpy, overwhelmed, meltdowns, very slow to wake up',
        scores: { INTENSE: 3 }
      },
      {
        value: 'B',
        label: 'Constant redirection, forgets steps, gets stuck on one thing, loses track',
        scores: { DISTRACTED: 5 }
      },
      {
        value: 'C',
        label: 'Battles over every step, refuses clothes/breakfast, won\'t follow your timeline',
        scores: { DEFIANT: 4 }
      },
      {
        value: 'D',
        label: 'Smooth with consistent routine and minimal prompting',
        scores: { NEUTRAL: 1 }
      },
    ]
  },
  {
    question: "Your child's impulse control when they want something NOW is...",
    context: "Prefrontal cortex development and self-regulation",
    options: [
      {
        value: 'A',
        label: 'Completely hijacked by emotion - cannot wait even one minute',
        scores: { INTENSE: 4 }
      },
      {
        value: 'B',
        label: 'Acts before thinking constantly, impulsive grabbing/doing without pause',
        scores: { DISTRACTED: 5 }
      },
      {
        value: 'C',
        label: 'CAN wait when motivated, but CHOOSES not to, deliberate defiance',
        scores: { DEFIANT: 4 }
      },
      {
        value: 'D',
        label: 'Developing impulse control, can wait short periods',
        scores: { NEUTRAL: 1 }
      },
    ]
  }
];

// Enhanced scoring system with weighted thresholds
export function calculateBrainProfile(answers: Record<number, string>): {
  type: BrainProfile;
  score: number;
  confidence: 'low' | 'medium' | 'high';
  secondaryTrait?: BrainProfile;
} {
  const scores: Record<BrainCategory, number> = {
    INTENSE: 0,
    DISTRACTED: 0,
    DEFIANT: 0,
    NEUTRAL: 0
  };

  // Calculate scores
  Object.entries(answers).forEach(([questionIndex, answer]) => {
    const question = quizQuestions[parseInt(questionIndex)];
    const option = question?.options.find(opt => opt.value === answer);
    if (option) {
      Object.entries(option.scores).forEach(([type, score]) => {
        scores[type as BrainCategory] += score!;
      });
    }
  });

  // Sort by score
  const sortedScores = Object.entries(scores)
    .filter(([type]) => type !== 'NEUTRAL')
    .sort(([, a], [, b]) => b - a);

  const [primaryType, primaryScore] = sortedScores[0] as [BrainProfile, number];
  const [secondaryType, secondaryScore] = sortedScores[1] as [BrainProfile, number];

  // Determine confidence based on score gap
  const scoreGap = primaryScore - secondaryScore;
  let confidence: 'low' | 'medium' | 'high';

  if (scoreGap >= 15) {
    confidence = 'high';
  } else if (scoreGap >= 8) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  return {
    type: primaryType,
    score: primaryScore,
    confidence,
    secondaryTrait: confidence === 'low' ? secondaryType : undefined
  };
}
