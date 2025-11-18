import { Highlighter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Highlight } from "@/hooks/useHighlights";
import { Badge } from "@/components/ui/badge";

interface HighlightsPanelProps {
  chapterIndex: number;
  highlights: Highlight[];
  onHighlightClick: (highlight: Highlight) => void;
}

const COLOR_CLASSES: Record<string, string> = {
  yellow: "bg-yellow-200 dark:bg-yellow-900/40 border-yellow-400 dark:border-yellow-700",
  green: "bg-green-200 dark:bg-green-900/40 border-green-400 dark:border-green-700",
  blue: "bg-blue-200 dark:bg-blue-900/40 border-blue-400 dark:border-blue-700",
  pink: "bg-pink-200 dark:bg-pink-900/40 border-pink-400 dark:border-pink-700",
};

export const HighlightsPanel = ({ 
  chapterIndex, 
  highlights,
  onHighlightClick 
}: HighlightsPanelProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent/50 relative"
          aria-label="View highlights"
        >
          <Highlighter className="h-5 w-5" />
          {highlights.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
              {highlights.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">
            Highlights
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {highlights.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Highlighter className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-sans">
                No highlights yet
              </p>
              <p className="text-sm text-muted-foreground mt-2 font-sans">
                Select text to create your first highlight
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {highlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    COLOR_CLASSES[highlight.color] || COLOR_CLASSES.yellow
                  }`}
                  onClick={() => onHighlightClick(highlight)}
                >
                  <p className="text-sm font-serif leading-relaxed text-foreground mb-2">
                    &quot;{highlight.text}&quot;
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs font-sans capitalize">
                      {highlight.color}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-sans">
                      {new Date(highlight.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
