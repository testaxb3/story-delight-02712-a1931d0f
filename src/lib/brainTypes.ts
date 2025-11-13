/**
 * Brain Type utilities - Icons, colors, and descriptions
 * For NEP System brain profiles: INTENSE, DISTRACTED, DEFIANT
 */

export type BrainType = 'INTENSE' | 'DISTRACTED' | 'DEFIANT' | 'NEUTRAL';

export const BRAIN_TYPE_CONFIG = {
  INTENSE: {
    icon: '🧠',
    emoji: '🧠',
    label: 'INTENSE',
    color: 'purple',
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-700',
    borderClass: 'border-purple-500/20',
    gradientClass: 'from-purple-500 to-pink-500',
    description: 'Highly sensitive, emotionally intense, deeply connected',
  },
  DISTRACTED: {
    icon: '⚡',
    emoji: '⚡',
    label: 'DISTRACTED',
    color: 'amber',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-500/20',
    gradientClass: 'from-amber-500 to-orange-500',
    description: 'Curious and quick, but easily pulled in many directions',
  },
  DEFIANT: {
    icon: '💪',
    emoji: '💪',
    label: 'DEFIANT',
    color: 'emerald',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-500/20',
    gradientClass: 'from-emerald-500 to-teal-500',
    description: 'Strong-willed with a powerful sense of autonomy',
  },
  NEUTRAL: {
    icon: '🎯',
    emoji: '🎯',
    label: 'NEUTRAL',
    color: 'gray',
    bgClass: 'bg-gray-500/10',
    textClass: 'text-gray-700',
    borderClass: 'border-gray-500/20',
    gradientClass: 'from-gray-500 to-slate-500',
    description: 'Balanced and age-appropriate responses',
  },
} as const;

/**
 * Get brain type icon
 */
export function getBrainTypeIcon(type: string | null | undefined): string {
  if (!type) return '🎯';
  const upperType = type.toUpperCase() as BrainType;
  return BRAIN_TYPE_CONFIG[upperType]?.icon || '🎯';
}

/**
 * Get brain type emoji
 */
export function getBrainTypeEmoji(type: string | null | undefined): string {
  return getBrainTypeIcon(type);
}

/**
 * Get brain type config
 */
export function getBrainTypeConfig(type: string | null | undefined) {
  if (!type) return BRAIN_TYPE_CONFIG.NEUTRAL;
  const upperType = type.toUpperCase() as BrainType;
  return BRAIN_TYPE_CONFIG[upperType] || BRAIN_TYPE_CONFIG.NEUTRAL;
}

/**
 * Get brain type badge classes
 */
export function getBrainTypeBadgeClasses(type: string | null | undefined): string {
  const config = getBrainTypeConfig(type);
  return `${config.bgClass} ${config.textClass} ${config.borderClass}`;
}

/**
 * Get brain type label with icon
 */
export function getBrainTypeLabel(type: string | null | undefined): string {
  const config = getBrainTypeConfig(type);
  return `${config.icon} ${config.label}`;
}
