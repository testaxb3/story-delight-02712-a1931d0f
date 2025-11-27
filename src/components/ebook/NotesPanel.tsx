import { useState } from "react";
import { StickyNote, Plus, Trash2, Edit2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotes, Note } from "@/hooks/useNotes";

interface NotesPanelProps {
  currentChapter: number;
}

export const NotesPanel = ({ currentChapter }: NotesPanelProps) => {
  const { notes, addNote, updateNote, removeNote, getChapterNotes } = useNotes();
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editContent, setEditContent] = useState("");

  const chapterNotes = getChapterNotes(currentChapter);

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      addNote(currentChapter, newNoteContent);
      setNewNoteContent("");
    }
  };

  const handleStartEdit = (note: Note) => {
    setEditingNote(note);
    setEditContent(note.content);
  };

  const handleSaveEdit = () => {
    if (editingNote && editContent.trim()) {
      updateNote(editingNote.id, editContent);
      setEditingNote(null);
      setEditContent("");
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditContent("");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 relative">
          <StickyNote className="w-5 h-5" />
          {chapterNotes.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {chapterNotes.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 sm:w-96 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Notes</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {/* Add New Note */}
          <div className="space-y-2">
            <Textarea
              placeholder="Add a note for this chapter..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="font-body min-h-[100px]"
            />
            <Button onClick={handleAddNote} size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </div>

          {/* Notes List */}
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="space-y-3">
              {chapterNotes.length === 0 && (
                <p className="text-center text-muted-foreground py-8 font-body text-sm">
                  No notes yet. Add your first note!
                </p>
              )}
              {chapterNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-lg border border-border bg-muted/30 space-y-3"
                >
                  {editingNote?.id === note.id ? (
                    <>
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="font-body min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} size="sm" variant="default">
                          Save
                        </Button>
                        <Button onClick={handleCancelEdit} size="sm" variant="ghost">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-body text-foreground whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-body">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => handleStartEdit(note)}
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => removeNote(note.id)}
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};
