import { BonusData } from "@/components/bonuses/BonusCard";
import { mockBonusesData } from "./bonusesData";

const STORAGE_KEY = "nep_bonuses_data";

/**
 * Bonuses Service - CRUD operations with localStorage
 * Preparado para futura integração com Supabase
 */

// Initialize localStorage with mock data if empty
function initializeStorage(): void {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockBonusesData));
  }
}

// Get all bonuses
export function getAllBonuses(): BonusData[] {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Get bonus by ID
export function getBonusById(id: string): BonusData | undefined {
  const bonuses = getAllBonuses();
  return bonuses.find(b => b.id === id);
}

// Create new bonus
export function createBonus(bonus: Omit<BonusData, "id">): BonusData {
  const bonuses = getAllBonuses();
  const newBonus: BonusData = {
    ...bonus,
    id: generateId()
  };
  bonuses.push(newBonus);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bonuses));
  return newBonus;
}

// Update existing bonus
export function updateBonus(id: string, updates: Partial<BonusData>): BonusData | null {
  const bonuses = getAllBonuses();
  const index = bonuses.findIndex(b => b.id === id);

  if (index === -1) return null;

  bonuses[index] = { ...bonuses[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bonuses));
  return bonuses[index];
}

// Delete bonus
export function deleteBonus(id: string): boolean {
  const bonuses = getAllBonuses();
  const filtered = bonuses.filter(b => b.id !== id);

  if (filtered.length === bonuses.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

// Bulk delete
export function deleteBonuses(ids: string[]): number {
  const bonuses = getAllBonuses();
  const filtered = bonuses.filter(b => !ids.includes(b.id));
  const deletedCount = bonuses.length - filtered.length;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return deletedCount;
}

// Toggle lock status
export function toggleBonusLock(id: string): BonusData | null {
  const bonus = getBonusById(id);
  if (!bonus) return null;

  return updateBonus(id, { locked: !bonus.locked });
}

// Duplicate bonus
export function duplicateBonus(id: string): BonusData | null {
  const bonus = getBonusById(id);
  if (!bonus) return null;

  const duplicate = {
    ...bonus,
    title: `${bonus.title} (Copy)`,
    isNew: true
  };

  return createBonus(duplicate);
}

// Reorder bonuses (for drag & drop)
export function reorderBonuses(bonuses: BonusData[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bonuses));
}

// Export to JSON
export function exportBonusesToJSON(): string {
  const bonuses = getAllBonuses();
  return JSON.stringify(bonuses, null, 2);
}

// Import from JSON
export function importBonusesFromJSON(jsonString: string): { success: boolean; count: number; error?: string } {
  try {
    const imported = JSON.parse(jsonString);

    if (!Array.isArray(imported)) {
      return { success: false, count: 0, error: "Invalid format: expected array" };
    }

    // Validate each item has required fields
    for (const item of imported) {
      if (!item.title || !item.category || !item.description) {
        return { success: false, count: 0, error: "Invalid bonus data: missing required fields" };
      }
    }

    // Assign new IDs to avoid conflicts
    const bonuses = imported.map(item => ({
      ...item,
      id: generateId()
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(bonuses));
    return { success: true, count: bonuses.length };

  } catch (error) {
    return { success: false, count: 0, error: "Invalid JSON format" };
  }
}

// Reset to mock data
export function resetToMockData(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockBonusesData));
}

// Get statistics
export function getBonusStats() {
  const bonuses = getAllBonuses();

  return {
    total: bonuses.length,
    locked: bonuses.filter(b => b.locked).length,
    unlocked: bonuses.filter(b => !b.locked).length,
    new: bonuses.filter(b => b.isNew).length,
    completed: bonuses.filter(b => b.completed).length,
    byCategory: {
      video: bonuses.filter(b => b.category === 'video').length,
      ebook: bonuses.filter(b => b.category === 'ebook').length,
      pdf: bonuses.filter(b => b.category === 'pdf').length,
      tool: bonuses.filter(b => b.category === 'tool').length,
      template: bonuses.filter(b => b.category === 'template').length,
      session: bonuses.filter(b => b.category === 'session').length,
    }
  };
}

// Generate unique ID
function generateId(): string {
  return `bonus-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Search and filter
export function searchBonuses(query: string, category?: string): BonusData[] {
  let bonuses = getAllBonuses();

  // Filter by category
  if (category && category !== 'all') {
    bonuses = bonuses.filter(b => b.category === category);
  }

  // Search in title, description, tags
  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    bonuses = bonuses.filter(b =>
      b.title.toLowerCase().includes(lowerQuery) ||
      b.description.toLowerCase().includes(lowerQuery) ||
      b.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  return bonuses;
}

// Sort bonuses
export function sortBonuses(bonuses: BonusData[], sortBy: 'title' | 'category' | 'newest' | 'locked'): BonusData[] {
  const sorted = [...bonuses];

  switch (sortBy) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'category':
      return sorted.sort((a, b) => a.category.localeCompare(b.category));
    case 'newest':
      return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    case 'locked':
      return sorted.sort((a, b) => (b.locked ? 1 : 0) - (a.locked ? 1 : 0));
    default:
      return sorted;
  }
}
