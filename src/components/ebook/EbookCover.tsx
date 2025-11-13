import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface EbookCoverProps {
  onStart: () => void;
  className?: string;
}

export const EbookCover = ({ onStart, className }: EbookCoverProps) => {
  return (
    <div className={cn(
      "flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8",
      className
    )}>
      <div className="max-w-2xl w-full">
        {/* Cover Image */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl border-2 border-border/50 bg-card">
          <img
            src="/ebook-cover.png"
            alt="Why Your Child Acts This Way - Ebook Cover"
            className="w-full h-auto"
          />
        </div>

        {/* Description */}
        <div className="text-center space-y-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Why Your Child Acts This Way
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Complete neuroscience-based ebook with 29 meta-analyzed studies, 3,500+ children in research samples, and word-for-word scripts for every situation. Validated by peer-reviewed research.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>5 Chapters</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center gap-2">
              <span>📚</span>
              <span>29 Research Studies</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center gap-2">
              <span>🧠</span>
              <span>Neuroscience-Based</span>
            </div>
          </div>
        </div>

        {/* Start Reading Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onStart}
            size="lg"
            className="gradient-primary text-white gap-2 text-base h-12 px-8 shadow-lg hover:shadow-xl transition-all"
          >
            <span className="font-semibold">Start Reading</span>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 rounded-xl bg-muted/30 border border-border/50">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            <span className="font-semibold text-foreground">Evidence-based parenting guidance</span> backed by peer-reviewed research. Learn the neuroscience behind your child's behavior and get practical, word-for-word scripts that work.
          </p>
        </div>
      </div>
    </div>
  );
};
