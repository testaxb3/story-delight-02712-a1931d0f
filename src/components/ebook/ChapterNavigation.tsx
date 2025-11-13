import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Flame, Sparkles, Star, CheckCircle2 } from "lucide-react";
import { ebookContent } from "@/data/ebookContent";

interface ChapterNavigationProps {
  currentChapter: string;
  onChapterSelect: (chapterId: string) => void;
  className?: string;
}

const getChapterIcon = (chapterId: string, color?: string) => {
  if (chapterId.includes('chapter3') || color === 'defiant') return Flame;
  if (chapterId.includes('chapter4') || color === 'intense') return Sparkles;
  if (chapterId.includes('chapter5') || color === 'distracted') return Star;
  return BookOpen;
};

export const ChapterNavigation = ({
  currentChapter,
  onChapterSelect,
  className
}: ChapterNavigationProps) => {
  const currentIndex = ebookContent.findIndex(ch => ch.id === currentChapter);

  return (
    <ScrollArea className={cn("h-full", className)}>
      <div className="space-y-1 p-4">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-border">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
            Table of Contents
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-1 w-8 bg-primary/30 rounded-full"></div>
            <span>{ebookContent.length} Chapters</span>
          </div>
        </div>

        {ebookContent.map((chapter, index) => {
          const Icon = getChapterIcon(chapter.id, chapter.color);
          const isActive = currentChapter === chapter.id;
          const isCompleted = index < currentIndex;
          const isNext = index === currentIndex + 1;

          return (
            <Button
              key={chapter.id}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left h-auto py-3 px-3 md:py-4 md:px-4 rounded-lg md:rounded-xl transition-all mb-1",
                "hover:bg-muted/50 group relative overflow-hidden",
                isActive && "bg-primary/10 hover:bg-primary/15 shadow-md ring-2 ring-primary/20"
              )}
              onClick={() => onChapterSelect(chapter.id)}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"></div>
              )}

              <div className="flex items-start gap-2 md:gap-3 w-full pl-0.5 md:pl-1">
                {/* Icon with Status */}
                <div className={cn(
                  "relative mt-0.5 shrink-0",
                  isActive && "md:scale-110"
                )}>
                  {/* Background Glow */}
                  <div className={cn(
                    "absolute inset-0 rounded-lg blur-md opacity-0 transition-opacity",
                    isActive && "opacity-20",
                    chapter.color === 'defiant' && "bg-defiant",
                    chapter.color === 'intense' && "bg-intense",
                    chapter.color === 'distracted' && "bg-distracted",
                    !chapter.color && "bg-primary"
                  )}></div>

                  {/* Icon */}
                  <div className={cn(
                    "relative w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-all",
                    isActive && "shadow-lg",
                    chapter.color === 'defiant' && (isActive ? "bg-defiant/20 text-defiant" : "bg-defiant/10 text-defiant/70"),
                    chapter.color === 'intense' && (isActive ? "bg-intense/20 text-intense" : "bg-intense/10 text-intense/70"),
                    chapter.color === 'distracted' && (isActive ? "bg-distracted/20 text-distracted" : "bg-distracted/10 text-distracted/70"),
                    !chapter.color && (isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")
                  )}>
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>

                  {/* Completed Badge */}
                  {isCompleted && !isActive && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Chapter Info */}
                <div className="flex-1 min-w-0">
                  {/* Chapter Number */}
                  <div className={cn(
                    "text-[10px] font-bold uppercase tracking-widest mb-1.5",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {index === 0 ? 'Introduction' : `Chapter ${index}`}
                    {isNext && <span className="ml-2 text-primary">→ Next</span>}
                  </div>

                  {/* Chapter Title */}
                  <div className={cn(
                    "font-semibold text-[13px] leading-snug line-clamp-2 transition-colors",
                    isActive ? "text-foreground" : "text-foreground/70 group-hover:text-foreground"
                  )}>
                    {chapter.title}
                  </div>

                  {/* Subtitle */}
                  {chapter.subtitle && (
                    <div className={cn(
                      "text-[11px] leading-snug mt-1.5 line-clamp-1 transition-opacity",
                      isActive ? "text-muted-foreground" : "text-muted-foreground/70 opacity-0 group-hover:opacity-100"
                    )}>
                      {chapter.subtitle}
                    </div>
                  )}

                  {/* Progress Bar (for active chapter) */}
                  {isActive && (
                    <div className="mt-2 h-0.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-1/2 transition-all"></div>
                    </div>
                  )}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
};
