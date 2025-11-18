export type EbookCategory = 
  | 'routines'
  | 'behavior'
  | 'emotions'
  | 'sleep'
  | 'school'
  | 'mealtime'
  | 'screen-time'
  | 'public-behavior';

export type ProfileType = 'intense' | 'distracted' | 'defiant' | 'universal';

export interface PromptTemplate {
  category: EbookCategory;
  profile: ProfileType;
  title: string;
  description: string;
}

export const ebookCategories: Record<EbookCategory, string> = {
  'routines': 'Routines (Morning, Evening, Transitions)',
  'behavior': 'Behavior (Tantrums, Defiance, Cooperation)',
  'emotions': 'Emotions (Regulation, Anxiety, Frustration)',
  'sleep': 'Sleep (Bedtime, Resistance)',
  'school': 'School (Preparation, Homework)',
  'mealtime': 'Mealtime (Selectivity, Behavior)',
  'screen-time': 'Screen Time (Shutdown, Limits)',
  'public-behavior': 'Public Behavior (Restaurants, Stores)'
};

export const profileTypes: Record<ProfileType, string> = {
  'intense': 'INTENSE Profile (High emotional reactivity)',
  'distracted': 'DISTRACTED Profile (Attention challenges)',
  'defiant': 'DEFIANT Profile (Strong autonomy needs)',
  'universal': 'Universal (All Profiles)'
};

export const promptTemplates: PromptTemplate[] = [
  // ROUTINES
  {
    category: 'routines',
    profile: 'universal',
    title: 'Morning Routines That Actually Work',
    description: 'Practical morning/evening routines for neurodivergent children'
  },
  {
    category: 'routines',
    profile: 'intense',
    title: 'Routines for INTENSE Children',
    description: 'Routines adapted for highly sensitive, emotionally reactive children'
  },
  {
    category: 'routines',
    profile: 'distracted',
    title: 'Routines for DISTRACTED Children',
    description: 'Routines that work with short attention spans and distractibility'
  },
  {
    category: 'routines',
    profile: 'defiant',
    title: 'Routines for DEFIANT Children',
    description: 'Power-struggle-free routines for strong-willed children'
  },
  // BEHAVIOR
  {
    category: 'behavior',
    profile: 'universal',
    title: 'Managing Tantrums and Meltdowns',
    description: 'Practical strategies for tantrums, defiance, and cooperation'
  },
  {
    category: 'behavior',
    profile: 'intense',
    title: 'Behavior Strategies for INTENSE Children',
    description: 'Managing emotional outbursts and reactivity'
  },
  {
    category: 'behavior',
    profile: 'distracted',
    title: 'Behavior Strategies for DISTRACTED Children',
    description: 'Managing impulsivity and following through'
  },
  {
    category: 'behavior',
    profile: 'defiant',
    title: 'Behavior Strategies for DEFIANT Children',
    description: 'Ending power struggles and building cooperation'
  },
  // EMOTIONS
  {
    category: 'emotions',
    profile: 'universal',
    title: 'Emotional Regulation for Kids',
    description: 'Teaching children to understand and manage their emotions'
  },
  {
    category: 'emotions',
    profile: 'intense',
    title: 'Emotional Regulation for INTENSE Children',
    description: 'Co-regulation strategies for emotionally sensitive children'
  },
  {
    category: 'emotions',
    profile: 'distracted',
    title: 'Emotional Regulation for DISTRACTED Children',
    description: 'Quick regulation strategies that hold attention'
  },
  {
    category: 'emotions',
    profile: 'defiant',
    title: 'Emotional Regulation for DEFIANT Children',
    description: 'Regulation without power struggles'
  },
  // SLEEP
  {
    category: 'sleep',
    profile: 'universal',
    title: 'Bedtime Without Battles',
    description: 'Sleep strategies for bedtime resistance'
  },
  {
    category: 'sleep',
    profile: 'intense',
    title: 'Sleep Strategies for INTENSE Children',
    description: 'Calming bedtime routines for anxious sleepers'
  },
  // SCHOOL
  {
    category: 'school',
    profile: 'universal',
    title: 'School Success Strategies',
    description: 'Morning preparation and homework management'
  },
  {
    category: 'school',
    profile: 'distracted',
    title: 'School Strategies for DISTRACTED Children',
    description: 'Focus and organization for school challenges'
  },
  // MEALTIME
  {
    category: 'mealtime',
    profile: 'universal',
    title: 'Peaceful Mealtimes',
    description: 'Managing picky eating and mealtime behavior'
  },
  {
    category: 'mealtime',
    profile: 'intense',
    title: 'Mealtime for INTENSE Children',
    description: 'Sensory-friendly mealtime strategies'
  },
  // SCREEN TIME
  {
    category: 'screen-time',
    profile: 'universal',
    title: '35 Strategies to Get Your Child Off Screens',
    description: 'Screen shutdown and healthy limits'
  },
  {
    category: 'screen-time',
    profile: 'defiant',
    title: 'Screen Time for DEFIANT Children',
    description: 'Setting limits without meltdowns'
  },
  // PUBLIC BEHAVIOR
  {
    category: 'public-behavior',
    profile: 'universal',
    title: 'Handling Public Meltdowns',
    description: 'Restaurants, stores, and public spaces'
  }
];

export const getPromptsByCategory = (category: EbookCategory) => {
  return promptTemplates.filter(p => p.category === category);
};

export const getPromptByCategory = (category: EbookCategory, profile: ProfileType) => {
  return promptTemplates.find(p => p.category === category && p.profile === profile);
};
