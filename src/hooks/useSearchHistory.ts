import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'nep_search_history';
const MAX_HISTORY_ITEMS = 8;

interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SearchHistoryItem[];
        // Filter out old entries (older than 7 days)
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const recent = parsed.filter((item) => item.timestamp > weekAgo);
        setHistory(recent);
      }
    } catch (error) {
      console.error('[SearchHistory] Failed to load:', error);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((items: SearchHistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('[SearchHistory] Failed to save:', error);
    }
  }, []);

  // Add a search query to history
  const addToHistory = useCallback((query: string) => {
    if (!query.trim() || query.length < 2) return;

    setHistory((prev) => {
      // Remove existing entry with same query (case-insensitive)
      const filtered = prev.filter(
        (item) => item.query.toLowerCase() !== query.toLowerCase()
      );

      // Add new entry at the beginning
      const newHistory = [
        { query: query.trim(), timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_HISTORY_ITEMS);

      saveHistory(newHistory);
      return newHistory;
    });
  }, [saveHistory]);

  // Remove a specific query from history
  const removeFromHistory = useCallback((query: string) => {
    setHistory((prev) => {
      const filtered = prev.filter(
        (item) => item.query.toLowerCase() !== query.toLowerCase()
      );
      saveHistory(filtered);
      return filtered;
    });
  }, [saveHistory]);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('[SearchHistory] Failed to clear:', error);
    }
  }, []);

  // Get recent queries as simple string array
  const recentQueries = history.map((item) => item.query);

  return {
    history,
    recentQueries,
    addToHistory,
    removeFromHistory,
    clearHistory,
    hasHistory: history.length > 0,
  };
}
