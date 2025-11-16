import { useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { ebookContent } from "@/data/ebookContent";
import { BookOpen, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  currentChapter: string;
  onProgressChange?: (progress: number) => void;
}

export const ProgressTracker = ({ currentChapter, onProgressChange }: ProgressTrackerProps) => {
  const currentIndex = ebookContent.findIndex(ch => ch.id === currentChapter);
  const progress = ((currentIndex + 1) / ebookContent.length) * 100;
  const isComplete = progress === 100;
  const isHalfway = progress >= 50 && progress < 100;

  useEffect(() => {
    // Call parent callback first (to update Supabase if needed)
    onProgressChange?.(progress);
    
    // Then update localStorage for offline support
    localStorage.setItem('ebook-progress', JSON.stringify({
      chapter: currentChapter,
      timestamp: new Date().toISOString(),
      progress: Math.round(progress)
    }));

    // Track completed chapters
    const completedChapters = JSON.parse(localStorage.getItem('ebook-completed-chapters') || '[]');
    if (!completedChapters.includes(currentChapter)) {
      completedChapters.push(currentChapter);
      localStorage.setItem('ebook-completed-chapters', JSON.stringify(completedChapters));
    }

    // Update reading streak
    const lastReadDate = localStorage.getItem('ebook-last-read-date');
    const today = new Date().toDateString();

    if (lastReadDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const currentStreak = parseInt(localStorage.getItem('ebook-reading-streak') || '0');

      if (lastReadDate === yesterday) {
        // Continue streak
        localStorage.setItem('ebook-reading-streak', String(currentStreak + 1));
      } else {
        // Reset streak
        localStorage.setItem('ebook-reading-streak', '1');
      }

      localStorage.setItem('ebook-last-read-date', today);
    }
  }, [currentChapter, progress, onProgressChange]);

  return (
    <div className="space-y-2 md:space-y-3">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-1 md:p-1.5 rounded-lg transition-colors",
            isComplete ? "bg-green-500/20" : isHalfway ? "bg-primary/20" : "bg-muted"
          )}>
            {isComplete ? (
              <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
            ) : isHalfway ? (
              <Target className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            ) : (
              <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
            )}
          </div>
          <span className="text-xs md:text-sm font-semibold text-muted-foreground">
            {isComplete ? "Completed!" : "Reading Progress"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xl md:text-2xl font-black tracking-tight",
            isComplete ? "text-green-500" : "text-primary"
          )}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <Progress
          value={progress}
          className={cn(
            "h-2.5 bg-muted",
            "[&>div]:transition-all [&>div]:duration-500"
          )}
        />
        {/* Milestone Markers */}
        <div className="absolute top-0 left-0 right-0 h-2.5 flex justify-between pointer-events-none">
          {[25, 50, 75].map((milestone) => (
            <div
              key={milestone}
              className={cn(
                "w-0.5 h-full transition-colors",
                progress >= milestone ? "bg-primary/30" : "bg-muted-foreground/20"
              )}
              style={{ marginLeft: `${milestone}%` }}
            />
          ))}
        </div>
      </div>

      {/* Chapter Counter */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">
          Chapter {currentIndex + 1} of {ebookContent.length}
        </span>
        {!isComplete && (
          <span className="text-muted-foreground/70">
            {ebookContent.length - currentIndex - 1} remaining
          </span>
        )}
        {isComplete && (
          <span className="text-green-500 font-semibold">
            🎉 All done!
          </span>
        )}
      </div>

      {/* Milestone Messages */}
      {isHalfway && !isComplete && (
        <div className="mt-2 p-1.5 md:p-2 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-[11px] md:text-xs text-primary font-medium">
            📖 Halfway there! You're making great progress.
          </p>
        </div>
      )}
      {isComplete && (
        <div className="mt-2 p-1.5 md:p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-[11px] md:text-xs text-green-600 dark:text-green-400 font-medium">
            🏆 Congratulations! You've finished the ebook.
          </p>
        </div>
      )}
    </div>
  );
};
