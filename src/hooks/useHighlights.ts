import React, { useState, useEffect } from "react";

export interface Highlight {
  id: string;
  chapterIndex: number;
  text: string;
  color: string;
  createdAt: number;
}

const STORAGE_KEY = "ebook-highlights";

export const useHighlights = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHighlights(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to load highlights:", error);
      }
    }
  }, []);

  const saveHighlights = (newHighlights: Highlight[]) => {
    setHighlights(newHighlights);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHighlights));
  };

  const addHighlight = (chapterIndex: number, text: string, color: string = "yellow") => {
    const newHighlight: Highlight = {
      id: `${Date.now()}-${Math.random()}`,
      chapterIndex,
      text,
      color,
      createdAt: Date.now(),
    };
    saveHighlights([...highlights, newHighlight]);
  };

  const removeHighlight = (id: string) => {
    saveHighlights(highlights.filter((h) => h.id !== id));
  };

  const getChapterHighlights = (chapterIndex: number) => {
    return highlights.filter((h) => h.chapterIndex === chapterIndex);
  };

  return {
    highlights,
    addHighlight,
    removeHighlight,
    getChapterHighlights,
  };
};
