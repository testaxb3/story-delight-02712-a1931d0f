import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ebookContent } from "@/data/ebookContent";

interface BookmarkData {
  id: string;
  chapterId: string;
  chapterTitle: string;
  timestamp: string;
  note?: string;
}

interface BookmarksPanelProps {
  currentChapter: string;
  onBookmarkClick?: (chapterId: string) => void;
  onAddBookmark?: () => void;
}

export const BookmarksPanel = ({
  currentChapter,
  onBookmarkClick,
  onAddBookmark
}: BookmarksPanelProps) => {
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const saved = localStorage.getItem('ebook-bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  };

  const addBookmark = () => {
    const chapter = ebookContent.find(ch => ch.id === currentChapter);
    if (!chapter) return;

    const newBookmark: BookmarkData = {
      id: `bookmark-${Date.now()}`,
      chapterId: currentChapter,
      chapterTitle: chapter.title,
      timestamp: new Date().toISOString()
    };

    const updated = [...bookmarks, newBookmark];
    setBookmarks(updated);
    localStorage.setItem('ebook-bookmarks', JSON.stringify(updated));
    onAddBookmark?.();
  };

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem('ebook-bookmarks', JSON.stringify(updated));
  };

  const isCurrentChapterBookmarked = bookmarks.some(b => b.chapterId === currentChapter);

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Bookmark className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            Bookmarks
          </CardTitle>
          <Button
            variant={isCurrentChapterBookmarked ? "outline" : "default"}
            size="sm"
            onClick={addBookmark}
            disabled={isCurrentChapterBookmarked}
            className={cn(
              "gap-2",
              !isCurrentChapterBookmarked && "gradient-primary text-white"
            )}
          >
            <Bookmark className="w-4 h-4" />
            {isCurrentChapterBookmarked ? "Bookmarked" : "Add"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {bookmarks.length === 0 ? (
          <div className="text-center py-6 md:py-8">
            <Bookmark className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-xs md:text-sm text-muted-foreground">
              No bookmarks yet. Add your first bookmark to save your place!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className={cn(
                  "p-2.5 md:p-3 rounded-lg border transition-all group",
                  bookmark.chapterId === currentChapter
                    ? "bg-primary/5 border-primary/30"
                    : "bg-muted/20 hover:bg-muted/40 border-border"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => onBookmarkClick?.(bookmark.chapterId)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Bookmark className={cn(
                        "w-3 h-3 shrink-0",
                        bookmark.chapterId === currentChapter ? "text-primary fill-primary" : "text-muted-foreground"
                      )} />
                      <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                        {bookmark.chapterTitle}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(bookmark.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </button>

                  <div className="flex items-center gap-1">
                    {bookmark.chapterId !== currentChapter && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onBookmarkClick?.(bookmark.chapterId)}
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBookmark(bookmark.id)}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
