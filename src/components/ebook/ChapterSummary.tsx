import { Target, Lightbulb, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChapterSummaryProps {
  keyPoints: string[];
  whatYoullLearn: string[];
  readingTime?: number;
  className?: string;
}

export const ChapterSummary = ({
  keyPoints,
  whatYoullLearn,
  readingTime,
  className
}: ChapterSummaryProps) => {
  return (
    <div className={cn(
      "mb-8 md:mb-12 p-5 md:p-7 rounded-xl border border-primary/30",
      "bg-gradient-to-br from-primary/5 to-transparent",
      "shadow-md",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-1.5 bg-primary/15 rounded-lg">
            <Target className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </div>
          <h3 className="text-base md:text-lg font-display font-bold text-foreground">
            Chapter Summary
          </h3>
        </div>
        {readingTime && (
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>{readingTime} min</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {/* Key Points */}
        <div>
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Target className="w-4 h-4 text-primary" />
            <h4 className="font-bold text-foreground uppercase tracking-wide text-xs md:text-sm">
              Key Points
            </h4>
          </div>
          <ul className="space-y-2.5 md:space-y-3">
            {keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <div className="mt-1.5 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                </div>
                <span className="text-sm md:text-base text-foreground/85 leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* What You'll Learn */}
        <div>
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Lightbulb className="w-4 h-4 text-primary" />
            <h4 className="font-bold text-foreground uppercase tracking-wide text-xs md:text-sm">
              What You'll Learn
            </h4>
          </div>
          <ul className="space-y-2.5 md:space-y-3">
            {whatYoullLearn.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <div className="mt-1.5 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                </div>
                <span className="text-sm md:text-base text-foreground/85 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
