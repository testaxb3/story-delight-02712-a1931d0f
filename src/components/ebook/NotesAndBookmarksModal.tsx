import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookmarksPanel } from "./BookmarksPanel";
import { Bookmark, StickyNote } from "lucide-react";

interface NotesAndBookmarksModalProps {
  currentChapter: string;
  onBookmarkClick?: (chapterId: string) => void;
  onAddBookmark?: () => void;
}

export const NotesAndBookmarksModal = ({
  currentChapter,
  onBookmarkClick,
  onAddBookmark
}: NotesAndBookmarksModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700/50 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 hover:border-amber-300 dark:hover:border-amber-600 text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 shadow-sm hover:shadow-md transition-all"
        >
          <Bookmark className="w-4 h-4" />
          <span className="hidden md:inline font-medium">Notes & Bookmarks</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-display font-bold">
            Your Notes & Bookmarks
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Tabs defaultValue="bookmarks" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bookmarks" className="gap-2">
                <Bookmark className="w-4 h-4" />
                Bookmarks
              </TabsTrigger>
              <TabsTrigger value="notes" className="gap-2">
                <StickyNote className="w-4 h-4" />
                Notes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="bookmarks" className="mt-4">
              <BookmarksPanel
                currentChapter={currentChapter}
                onBookmarkClick={onBookmarkClick}
                onAddBookmark={onAddBookmark}
              />
            </TabsContent>
            <TabsContent value="notes" className="mt-4">
              <div className="p-6 md:p-8 text-center border rounded-xl bg-muted/20">
                <StickyNote className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Notes feature coming soon! You'll be able to add personal notes to any section.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
