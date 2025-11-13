import type { Database } from '@/integrations/supabase/types';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];

export interface ScriptItem {
  id: string;
  title: string;
  category: string;
  displayCategory: string;
  brainType: string;
  preview: string;
  emoji: string;
  badge: string | null;
  wrongWay: string;
  neurologicalTip: string;
  tags: string[];
  estimatedTimeMinutes: number | null;
  steps: Array<{
    action: string;
    phrase: string;
  }>;
}

export const CATEGORY_EMOJIS: Record<string, string> = {
  bedtime: '🛏️',
  screens: '📱',
  mealtime: '🍽️',
  transitions: '🔄',
  tantrums: '😤',
  morning_routines: '☀️',
  social: '👥',
  hygiene: '🪥',
};

/**
 * Formats a category string to title case with proper spacing
 * @param category - The category string to format (e.g., "morning_routines", "bedtime")
 * @returns Formatted category string (e.g., "Morning Routines", "Bedtime")
 */
export const formatCategory = (category: string): string =>
  category
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

/**
 * Converts a ScriptRow from the database to a ScriptItem for UI display
 * @param script - The script row from the database
 * @returns A formatted ScriptItem ready for display
 */
export const convertToScriptItem = (script: ScriptRow): ScriptItem => ({
  id: script.id,
  title: script.title,
  category: script.category,
  displayCategory: formatCategory(script.category),
  brainType: script.profile,
  preview: script.phrase_1_action || script.phrase_1,
  emoji: CATEGORY_EMOJIS[script.category.toLowerCase()] ?? '🧠',
  badge: null,
  wrongWay: script.wrong_way,
  neurologicalTip: script.neurological_tip,
  tags: script.tags ?? [],
  estimatedTimeMinutes: script.estimated_time_minutes ?? null,
  steps: [
    { action: script.phrase_1_action, phrase: script.phrase_1 },
    { action: script.phrase_2_action, phrase: script.phrase_2 },
    { action: script.phrase_3_action, phrase: script.phrase_3 },
  ],
});

/**
 * Gets the appropriate badge color class based on brain type
 * @param brainType - The brain type (INTENSE, DISTRACTED, DEFIANT)
 * @returns Tailwind CSS classes for the badge
 */
export const getBrainTypeBadgeColor = (brainType: string): string => {
  switch (brainType) {
    case 'INTENSE':
      return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
    case 'DISTRACTED':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    case 'DEFIANT':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};
