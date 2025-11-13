/**
 * SUCCESS STORIES DATABASE
 * Real parent transformations to showcase NEP System effectiveness
 * Rotates on Dashboard for social proof and inspiration
 */

export interface SuccessStory {
  id: string;
  name: string;
  initials: string;
  brainType: 'INTENSE' | 'DISTRACTED' | 'DEFIANT';
  childAge: number;
  challenge: string;
  timeline: string;
  before: {
    metric: string;
    value: number | string;
  };
  after: {
    metric: string;
    value: number | string;
  };
  quote: string;
  communityPostId?: string; // Link to full story in community
}

export const successStories: SuccessStory[] = [
  {
    id: '1',
    name: 'Sarah M.',
    initials: 'SM',
    brainType: 'INTENSE',
    childAge: 5,
    challenge: 'bedtime-meltdowns',
    timeline: '14 days',
    before: {
      metric: 'Bedtime tantrums',
      value: '10 per day',
    },
    after: {
      metric: 'Bedtime tantrums',
      value: 'ZERO',
    },
    quote: 'From 10 tantrums per day to ZERO using INTENSE brain scripts. My daughter finally sleeps through the night!',
    communityPostId: null,
  },
  {
    id: '2',
    name: 'Michael T.',
    initials: 'MT',
    brainType: 'DISTRACTED',
    childAge: 8,
    challenge: 'homework-battles',
    timeline: '21 days',
    before: {
      metric: 'Homework time',
      value: '2 hours of fighting',
    },
    after: {
      metric: 'Homework time',
      value: '20 minutes focused',
    },
    quote: 'The DISTRACTED scripts changed everything. Homework went from 2-hour battles to 20 minutes of focused work. He\'s actually proud of his grades now!',
    communityPostId: null,
  },
  {
    id: '3',
    name: 'Jessica L.',
    initials: 'JL',
    brainType: 'DEFIANT',
    childAge: 6,
    challenge: 'morning-chaos',
    timeline: '10 days',
    before: {
      metric: 'Morning meltdowns',
      value: '5 per week',
    },
    after: {
      metric: 'Morning meltdowns',
      value: '0-1 per week',
    },
    quote: 'My DEFIANT son used to fight me every morning. Within 10 days of using NEP, our mornings are peaceful. We\'re never late for school anymore!',
    communityPostId: null,
  },
  {
    id: '4',
    name: 'David R.',
    initials: 'DR',
    brainType: 'INTENSE',
    childAge: 4,
    challenge: 'public-meltdowns',
    timeline: '7 days',
    before: {
      metric: 'Public meltdowns',
      value: 'Every grocery trip',
    },
    after: {
      metric: 'Public meltdowns',
      value: 'None in 2 weeks',
    },
    quote: 'I was embarrassed to take my son anywhere. After just 1 week with NEP, we can grocery shop peacefully. Other parents ask me my secret!',
    communityPostId: null,
  },
  {
    id: '5',
    name: 'Amanda K.',
    initials: 'AK',
    brainType: 'DISTRACTED',
    childAge: 7,
    challenge: 'sibling-fights',
    timeline: '18 days',
    before: {
      metric: 'Sibling fights',
      value: '8-10 per day',
    },
    after: {
      metric: 'Sibling fights',
      value: '1-2 per day',
    },
    quote: 'My kids fought constantly. NEP taught me their brains need different approaches. Fights dropped from 10 to 1-2 per day. My house is peaceful again!',
    communityPostId: null,
  },
  {
    id: '6',
    name: 'Robert H.',
    initials: 'RH',
    brainType: 'DEFIANT',
    childAge: 9,
    challenge: 'screen-time-battles',
    timeline: '12 days',
    before: {
      metric: 'Screen time arguments',
      value: '45 min daily',
    },
    after: {
      metric: 'Screen time arguments',
      value: 'Under 5 min',
    },
    quote: 'Screen time was a daily war. NEP\'s DEFIANT scripts helped me understand his need for autonomy. Now transitions are smooth and respectful.',
    communityPostId: null,
  },
  {
    id: '7',
    name: 'Lisa W.',
    initials: 'LW',
    brainType: 'INTENSE',
    childAge: 3,
    challenge: 'mealtime-stress',
    timeline: '9 days',
    before: {
      metric: 'Meals ending in tears',
      value: '90% of meals',
    },
    after: {
      metric: 'Meals ending in tears',
      value: '10% of meals',
    },
    quote: 'Mealtimes were a nightmare. My INTENSE daughter would throw food and scream. Within 9 days, we went from 90% crying to 10%. Dinner is family time again!',
    communityPostId: null,
  },
];

/**
 * Get a random success story
 * Useful for rotating stories on Dashboard
 */
export function getRandomSuccessStory(): SuccessStory {
  const randomIndex = Math.floor(Math.random() * successStories.length);
  return successStories[randomIndex];
}

/**
 * Get success story by brain type
 * Shows stories relevant to user's child
 */
export function getSuccessStoriesByBrainType(
  brainType: 'INTENSE' | 'DISTRACTED' | 'DEFIANT'
): SuccessStory[] {
  return successStories.filter((story) => story.brainType === brainType);
}

/**
 * Get success story by challenge type
 * Shows stories relevant to user's current struggles
 */
export function getSuccessStoriesByChallenge(challenge: string): SuccessStory[] {
  return successStories.filter((story) => story.challenge.includes(challenge));
}

/**
 * Get N random success stories (no duplicates)
 */
export function getRandomSuccessStories(count: number): SuccessStory[] {
  const shuffled = [...successStories].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, successStories.length));
}
