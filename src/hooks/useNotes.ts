import { useState, useEffect } from "react";

export interface Note {
  id: string;
  chapterIndex: number;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "ebook-notes";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setNotes(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to load notes:", error);
      }
    }
  }, []);

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
  };

  const addNote = (chapterIndex: number, content: string) => {
    const newNote: Note = {
      id: `${Date.now()}-${Math.random()}`,
      chapterIndex,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveNotes([...notes, newNote]);
    return newNote;
  };

  const updateNote = (id: string, content: string) => {
    saveNotes(
      notes.map((note) =>
        note.id === id ? { ...note, content, updatedAt: Date.now() } : note
      )
    );
  };

  const removeNote = (id: string) => {
    saveNotes(notes.filter((n) => n.id !== id));
  };

  const getChapterNotes = (chapterIndex: number) => {
    return notes.filter((n) => n.chapterIndex === chapterIndex);
  };

  return {
    notes,
    addNote,
    updateNote,
    removeNote,
    getChapterNotes,
  };
};
