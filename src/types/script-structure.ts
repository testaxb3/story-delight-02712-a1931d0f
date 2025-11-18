/**
 * Type definitions for the new hyper-specific script structure
 * These types define the shape of JSON fields in the database
 */

export interface StrategyStep {
  step_number: number;
  step_title: string;
  step_explanation: string;
  what_to_say_examples: string[];
}

export interface WhatToExpect {
  // Current naming convention (PROJETO CLAUDE standard)
  first_30_seconds?: string;
  by_90_seconds?: string;
  by_2_minutes?: string;
  by_3_minutes?: string;
  dont_expect: string[];
  this_is_success: string;

  // Legacy naming conventions (for backwards compatibility with old scripts)
  first_few_days?: string;
  first_week?: string;
  first_5_minutes?: string;
  first_few_weeks?: string;
  by_week_2?: string;
  by_week_3?: string;
  by_2_months?: string;
  by_10_minutes?: string;
  by_x_weeks?: string;
}

export interface CommonVariation {
  variation_scenario: string;
  variation_response: string;
  why_this_works?: string;
}

/**
 * Helper to parse strategy_steps from database JSON
 */
export function parseStrategySteps(json: any): StrategyStep[] | null {
  if (!json) return null;
  try {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    if (Array.isArray(parsed)) {
      return parsed as StrategyStep[];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Helper to parse what_to_expect from database JSON
 */
export function parseWhatToExpect(json: any): WhatToExpect | null {
  if (!json) return null;
  try {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    return parsed as WhatToExpect;
  } catch {
    return null;
  }
}

/**
 * Helper to parse common_variations from database JSON
 */
export function parseCommonVariations(json: any): CommonVariation[] | null {
  if (!json) return null;
  try {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    if (Array.isArray(parsed)) {
      return parsed as CommonVariation[];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Check if a script uses the new hyper-specific structure
 */
export function isHyperSpecificScript(script: any): boolean {
  return !!(
    script.the_situation ||
    script.strategy_steps ||
    script.what_to_expect ||
    script.why_this_works
  );
}

/**
 * Get difficulty info with stars and colors
 */
export function getDifficultyInfo(difficulty: string | null) {
  switch (difficulty) {
    case 'Easy':
      return {
        stars: '⭐',
        label: 'Easy',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        borderColor: 'border-green-200 dark:border-green-800'
      };
    case 'Moderate':
      return {
        stars: '⭐⭐',
        label: 'Moderate',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
        borderColor: 'border-yellow-200 dark:border-yellow-800'
      };
    case 'Hard':
      return {
        stars: '⭐⭐⭐',
        label: 'Challenging',
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        borderColor: 'border-orange-200 dark:border-orange-800'
      };
    default:
      return {
        stars: '⭐⭐',
        label: 'Moderate',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
        borderColor: 'border-yellow-200 dark:border-yellow-800'
      };
  }
}
