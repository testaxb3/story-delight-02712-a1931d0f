import type { User } from '@supabase/supabase-js';

/**
 * Gets user initials from full name or email
 * @param user - The user object
 * @returns User initials (max 2 characters)
 */
export function getUserInitials(user: User | null): string {
  if (user?.user_metadata?.full_name) {
    const names = user.user_metadata.full_name.trim().split(' ').filter(Boolean);
    if (names.length) {
      return names
        .map((name) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
  }
  return user?.email?.slice(0, 2).toUpperCase() || 'TE';
}

/**
 * Gets display name from user metadata or email
 * @param user - The user object
 * @returns Display name
 */
export function getDisplayName(user: User | null): string {
  return user?.user_metadata?.full_name?.trim() || user?.email?.split('@')[0] || 'User';
}

/**
 * Formats activity date to readable format
 * @param date - ISO date string
 * @returns Formatted date string
 */
export function formatActivityDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Brain type descriptions for profile
 */
export const BRAIN_DESCRIPTIONS: Record<string, string> = {
  INTENSE: 'High energy, deeply feeling, quick to react. Needs clear boundaries and emotional regulation tools.',
  DISTRACTED: 'Creative, curious, struggles with focus. Benefits from structured routines and visual cues.',
  DEFIANT: 'Strong-willed, questions authority, needs autonomy. Thrives with choices and logical explanations.',
};

/**
 * Gets brain type description
 * @param brainType - The brain type
 * @returns Description string
 */
export function getBrainDescription(brainType: string): string {
  return BRAIN_DESCRIPTIONS[brainType] || BRAIN_DESCRIPTIONS.INTENSE;
}
