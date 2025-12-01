// Optimized Quiz Questions - Reduced to 10 most impactful questions
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

// Reduced from 20 to 10 questions - only the most diagnostic ones
export const quizQuestions: Question[] = [
  {
    question: "When your child faces disappointment...",
    options: [
      { value: 'A', label: 'Complete meltdown - 15-30+ min of crying/screaming', scores: { INTENSE: 4 } },
      { value: 'B', label: 'Brief outburst, quickly distracted by something else', scores: { DISTRACTED: 4 } },
      { value: 'C', label: 'Argues, negotiates, refuses to accept "no"', scores: { DEFIANT: 4 } },
      { value: 'D', label: 'Shows disappointment, recovers within minutes', scores: { NEUTRAL: 1 } },
    ]
  },
  {
    question: "During transitions (leaving park, bedtime)...",
    options: [
      { value: 'A', label: 'Extreme meltdowns, physical resistance', scores: { INTENSE: 3 } },
      { value: 'B', label: 'Lost in activity, needs many reminders', scores: { DISTRACTED: 4 } },
      { value: 'C', label: 'Endless "5 more minutes!" power struggles', scores: { DEFIANT: 4 } },
      { value: 'D', label: 'Transitions smoothly with one warning', scores: { NEUTRAL: 1 } },
    ]
  },
  {
    question: "Your child's tantrum patterns are...",
    options: [
      { value: 'A', label: '20-60+ min, full-body, completely dysregulated', scores: { INTENSE: 5 } },
      { value: 'B', label: '2-5 min, explosive but brief, easily redirected', scores: { DISTRACTED: 2 } },
      { value: 'C', label: 'Strategic outbursts that last until they win', scores: { DEFIANT: 4 } },
      { value: 'D', label: 'Rare and short-lived tantrums', scores: { NEUTRAL: 1 } },
    ]
  },
  {
    question: "With multi-step instructions...",
    options: [
      { value: 'A', label: 'Overwhelmed, freezes, melts down', scores: { INTENSE: 3 } },
      { value: 'B', label: 'Starts task, gets distracted midway, forgets rest', scores: { DISTRACTED: 4 } },
      { value: 'C', label: 'Argues about each step, does it their way', scores: { DEFIANT: 3 } },
      { value: 'D', label: 'Completes 2-3 steps with minimal prompting', scores: { NEUTRAL: 1 } },
    ]
  },
  {
    question: "When screen time ends...",
    options: [
      { value: 'A', label: 'Major meltdown every single time', scores: { INTENSE: 5 } },
      { value: 'B', label: 'Hyperfocused, needs device removed, then moves on', scores: { DISTRACTED: 3 } },
      { value: 'C', label: 'Endless negotiation, sneaks device back', scores: { DEFIANT: 5 } },
      { value: 'D', label: 'Mild protest but complies with timer', scores: { NEUTRAL: 1 } },
    ]
  },
  {
    question: "Your child's physical energy is...",
    options: [
      { value: 'A', label: 'Either shutdown OR hyperaroused, no in-between', scores: { INTENSE: 3 } },
      { value: 'B', label: 'Constant movement, can\'t sit still, always fidgeting', scores: { DISTRACTED: 5 } },
      { value: 'C', label: 'Uses aggression when frustrated (hitting, kicking)', scores: { DEFIANT: 3 } },
      { value: 'D', label: 'Age-appropriate energy levels', scores: { NEUTRAL: 1 } },
    ]
  },
  {
    question: "In public spaces (store, restaurant)...",
    options: [
      { value: 'A', label: 'Overstimulated, meltdowns from crowds/noise', scores: { INTENSE: 4 } },
      { value: 'B', label: 'Wanders off, touches everything, oblivious to safety', scores: { DISTRACTED: 5 } },
      { value: 'C', label: 'Tests every boundary, major scenes when told no', scores: { DEFIANT: 3 } },
      { value: 'D', label: 'Appropriate behavior with occasional reminders', scores: { NEUTRAL: 1 } },
    ]
  },
  {
    question: "Morning routine is...",
    options: [
      { value: 'A', label: 'Extremely difficult - meltdowns, very slow to wake', scores: { INTENSE: 3 } },
      { value: 'B', label: 'Constant redirection, forgets steps, loses track', scores: { DISTRACTED: 5 } },
      { value: 'C', label: 'Battles over every step, won\'t follow timeline', scores: { DEFIANT: 4 } },
      { value: 'D', label: 'Smooth with consistent routine', scores: { NEUTRAL: 1 } },
    ]
  },
  {
    question: "With homework or structured tasks...",
    options: [
      { value: 'A', label: '"I can\'t do it!" - extreme frustration, gives up', scores: { INTENSE: 4 } },
      { value: 'B', label: 'Attention drifts after 2-3 min, needs constant help', scores: { DISTRACTED: 5 } },
      { value: 'C', label: 'Argues it\'s stupid, refuses unless on their terms', scores: { DEFIANT: 3 } },
      { value: 'D', label: 'Completes with normal support', scores: { NEUTRAL: 1 } },
    ]
  },
  {
    question: "Your child's impulse control is...",
    options: [
      { value: 'A', label: 'Hijacked by emotion - cannot wait even 1 minute', scores: { INTENSE: 4 } },
      { value: 'B', label: 'Acts before thinking, impulsive grabbing/doing', scores: { DISTRACTED: 5 } },
      { value: 'C', label: 'CAN wait when motivated, CHOOSES not to', scores: { DEFIANT: 4 } },
      { value: 'D', label: 'Developing impulse control appropriately', scores: { NEUTRAL: 1 } },
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

  // Determine confidence based on score gap (adjusted for 10 questions)
  const scoreGap = primaryScore - secondaryScore;
  let confidence: 'low' | 'medium' | 'high';

  if (scoreGap >= 10) {
    confidence = 'high';
  } else if (scoreGap >= 5) {
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
