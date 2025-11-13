import { BookOpen, CheckCircle2, Circle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Chapter } from "@/data/ebookContent";

interface TableOfContentsProps {
  chapters: Chapter[];
  currentChapter: number;
  onChapterSelect: (index: number) => void;
  completedChapters: Set<number>;
}

export const TableOfContents = ({
  chapters,
  currentChapter,
  onChapterSelect,
  completedChapters,
}: TableOfContentsProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
          <BookOpen className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Table of Contents</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <div className="space-y-2">
            {chapters.map((chapter, index) => {
              const isCompleted = completedChapters.has(index);
              const isCurrent = index === currentChapter;
              
              return (
                <button
                  key={index}
                  onClick={() => onChapterSelect(index)}
                  className={`w-full text-left p-4 rounded-lg smooth-transition border ${
                    isCurrent
                      ? "bg-primary/10 border-primary/30 shadow-sm"
                      : "bg-background hover:bg-muted/50 border-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-body text-muted-foreground mb-1">
                        Chapter {index + 1}
                      </div>
                      <div className={`font-display text-sm ${isCurrent ? "text-primary font-semibold" : "text-foreground"}`}>
                        {chapter.title}
                      </div>
                      {chapter.subtitle && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {chapter.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
