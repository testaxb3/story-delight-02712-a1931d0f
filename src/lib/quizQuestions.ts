// Optimized Quiz Questions - 7 most impactful questions
// Based on NEP System neuroscience research
// Redesigned for empathy and faster completion

export type BrainCategory = 'INTENSE' | 'DISTRACTED' | 'DEFIANT';
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

// Reduced to 7 questions with empathetic copy and no neutral options
export const quizQuestions: Question[] = [
  {
    question: "When they don't get what they want...",
    context: "This helps us understand their emotional regulation",
    options: [
      { value: 'A', label: 'Full meltdown (15-30+ min)', scores: { INTENSE: 5 } },
      { value: 'B', label: 'Quick explosion, easily redirected', scores: { DISTRACTED: 4 } },
      { value: 'C', label: 'Argues until they win', scores: { DEFIANT: 5 } },
      { value: 'D', label: 'Gets upset, needs comfort briefly', scores: { INTENSE: 1, DISTRACTED: 1, DEFIANT: 1 } },
    ]
  },
  {
    question: "Leaving the park, ending an activity...",
    context: "Transitions reveal how their brain handles change",
    options: [
      { value: 'A', label: 'Extreme resistance, physical reactions', scores: { INTENSE: 4 } },
      { value: 'B', label: 'Lost in activity, needs many reminders', scores: { DISTRACTED: 5 } },
      { value: 'C', label: 'Endless "5 more minutes!" battles', scores: { DEFIANT: 5 } },
      { value: 'D', label: 'Some pushback, eventually complies', scores: { INTENSE: 1, DISTRACTED: 2, DEFIANT: 1 } },
    ]
  },
  {
    question: "Their tantrum patterns look like...",
    context: "Duration and intensity tell us a lot",
    options: [
      { value: 'A', label: 'Long, intense (20-60+ min)', scores: { INTENSE: 5 } },
      { value: 'B', label: 'Short bursts, quickly distracted', scores: { DISTRACTED: 3 } },
      { value: 'C', label: 'Strategic—lasts until they get their way', scores: { DEFIANT: 5 } },
      { value: 'D', label: 'Brief upsets, recovers with support', scores: { INTENSE: 2, DISTRACTED: 1, DEFIANT: 1 } },
    ]
  },
  {
    question: "When screen time ends...",
    context: "A modern challenge most families face",
    options: [
      { value: 'A', label: 'Major meltdown every time', scores: { INTENSE: 5 } },
      { value: 'B', label: 'Hyperfocused, needs device removed', scores: { DISTRACTED: 4 } },
      { value: 'C', label: 'Negotiates, sneaks it back', scores: { DEFIANT: 5 } },
      { value: 'D', label: 'Protests but accepts the limit', scores: { INTENSE: 1, DISTRACTED: 2, DEFIANT: 2 } },
    ]
  },
  {
    question: "The morning routine is...",
    context: "Daily patterns show their nervous system style",
    options: [
      { value: 'A', label: 'Extremely hard—slow, emotional', scores: { INTENSE: 4 } },
      { value: 'B', label: 'Constant reminders, easily off-track', scores: { DISTRACTED: 5 } },
      { value: 'C', label: 'Power struggles at every step', scores: { DEFIANT: 4 } },
      { value: 'D', label: 'Works with consistent routine', scores: { INTENSE: 1, DISTRACTED: 1, DEFIANT: 2 } },
    ]
  },
  {
    question: "With homework or focused tasks...",
    context: "This reveals their focus and frustration tolerance",
    options: [
      { value: 'A', label: '"I can\'t do it!" — gives up fast', scores: { INTENSE: 5 } },
      { value: 'B', label: 'Attention drifts after 2-3 min', scores: { DISTRACTED: 5 } },
      { value: 'C', label: 'Argues it\'s stupid, refuses', scores: { DEFIANT: 4 } },
      { value: 'D', label: 'Completes with some help', scores: { INTENSE: 2, DISTRACTED: 2, DEFIANT: 1 } },
    ]
  },
  {
    question: "Their impulse control is...",
    context: "This helps identify their core wiring",
    options: [
      { value: 'A', label: 'Hijacked by emotions—can\'t wait', scores: { INTENSE: 5 } },
      { value: 'B', label: 'Acts before thinking, impulsive', scores: { DISTRACTED: 5 } },
      { value: 'C', label: 'CAN wait when motivated, CHOOSES not to', scores: { DEFIANT: 5 } },
      { value: 'D', label: 'Developing at their own pace', scores: { INTENSE: 2, DISTRACTED: 2, DEFIANT: 2 } },
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
    DEFIANT: 0
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
    .sort(([, a], [, b]) => b - a);

  const [primaryType, primaryScore] = sortedScores[0] as [BrainProfile, number];
  const [secondaryType, secondaryScore] = sortedScores[1] as [BrainProfile, number];

  // Determine confidence based on score gap (adjusted for 7 questions)
  const scoreGap = primaryScore - secondaryScore;
  let confidence: 'low' | 'medium' | 'high';

  if (scoreGap >= 8) {
    confidence = 'high';
  } else if (scoreGap >= 4) {
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
