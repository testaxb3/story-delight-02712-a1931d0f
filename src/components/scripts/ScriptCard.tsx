import { memo } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Database } from "@/integrations/supabase/types";

type Script = Database["public"]["Tables"]["scripts"]["Row"];

const profileBadgeStyles: Record<string, string> = {
  INTENSE: "bg-pink-500/15 text-pink-500 border-pink-500/30",
  DISTRACTED: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  DEFIANT: "bg-amber-500/15 text-amber-500 border-amber-500/30",
};

interface ScriptCardProps {
  script: Script;
  highlight?: "mostUsed" | "tryFirst" | null;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
  usageCount?: number;
}

const highlightCopy: Record<NonNullable<ScriptCardProps["highlight"]>, { label: string; tone: string }> = {
  mostUsed: { label: "MOST USED", tone: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" },
  tryFirst: { label: "TRY NEXT", tone: "bg-purple-500/15 text-purple-500 border-purple-500/30" },
};

// PERFORMANCE OPTIMIZATION: Memoized component to prevent unnecessary re-renders
// This component will only re-render when props actually change
const ScriptCardComponent = ({
  script,
  highlight = null,
  isFavorite,
  onSelect,
  onToggleFavorite,
  usageCount,
}: ScriptCardProps) => {
  const profileTone = script.profile ? profileBadgeStyles[script.profile] : undefined;
  const highlightTone = highlight ? highlightCopy[highlight] : null;

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className="relative h-full cursor-pointer border-border/60 dark:border-slate-700 bg-card/70 dark:bg-slate-800/90 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-lg"
        onClick={onSelect}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <Badge variant="secondary" className="dark:bg-slate-700 dark:text-slate-200">{script.category}</Badge>
              {script.profile && (
                <Badge className={profileTone}>{script.profile} Brain</Badge>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              {highlightTone && (
                <Badge className={`${highlightTone.tone} font-medium`}>{highlightTone.label}</Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="dark:hover:bg-slate-700"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleFavorite();
                }}
                aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
              >
                <Star className={`w-4 h-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <CardTitle className="text-xl leading-tight text-foreground">
            {script.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {script.neurological_tip}
          </p>
          {typeof usageCount === "number" && usageCount > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Used {usageCount} {usageCount === 1 ? "time" : "times"}
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button variant="ghost" className="w-full justify-between dark:hover:bg-slate-700" size="sm">
            View Script
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Export memoized version with custom comparison function
export const ScriptCard = memo(ScriptCardComponent, (prevProps, nextProps) => {
  // Custom comparison: only re-render if these specific props change
  return (
    prevProps.script.id === nextProps.script.id &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.highlight === nextProps.highlight &&
    prevProps.usageCount === nextProps.usageCount
  );
});
