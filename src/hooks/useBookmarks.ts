import { useState, useEffect } from "react";

const STORAGE_KEY = "ebook-bookmarks";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setBookmarks(new Set(JSON.parse(stored)));
      } catch (error) {
        console.error("Failed to load bookmarks:", error);
      }
    }
  }, []);

  const saveBookmarks = (newBookmarks: Set<number>) => {
    setBookmarks(newBookmarks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newBookmarks)));
  };

  const toggleBookmark = (chapterIndex: number) => {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(chapterIndex)) {
      newBookmarks.delete(chapterIndex);
    } else {
      newBookmarks.add(chapterIndex);
    }
    saveBookmarks(newBookmarks);
  };

  const isBookmarked = (chapterIndex: number) => {
    return bookmarks.has(chapterIndex);
  };

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
  };
};
