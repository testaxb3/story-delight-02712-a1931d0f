/**
 * Bonus category types and enums
 */

export enum BonusCategory {
  VIDEO = 'video',
  EBOOK = 'ebook',
  PDF = 'pdf',
  TOOL = 'tool',
  TEMPLATE = 'template',
  SESSION = 'session',
}

export const BONUS_CATEGORIES = Object.values(BonusCategory);

export function isBonusCategory(value: string): value is BonusCategory {
  return BONUS_CATEGORIES.includes(value as BonusCategory);
}

export interface BonusData {
  id: string;
  title: string;
  description: string;
  category: BonusCategory;
  thumbnail?: string;
  duration?: string;
  size?: string;
  locked: boolean;
  completed?: boolean;
  progress?: number;
  isNew?: boolean;
  requirement?: string;
  tags?: string[];
  videoUrl?: string;
  downloadUrl?: string;
  viewUrl?: string;
}
