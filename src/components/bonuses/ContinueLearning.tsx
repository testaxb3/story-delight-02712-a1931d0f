import { memo } from "react";
import { motion } from "framer-motion";
import { Play, Book, Clock, ArrowRight } from "lucide-react";
import { BonusData } from "@/types/bonus";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ContinueLearningProps {
  inProgressBonuses: BonusData[];
  onContinue: (bonus: BonusData) => void;
}

export const ContinueLearning = memo(function ContinueLearning({
  inProgressBonuses,
  onContinue,
}: ContinueLearningProps) {
  if (!inProgressBonuses.length) return null;

  // Show max 3 items in compact view
  const items = inProgressBonuses.slice(0, 3);

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Continue Learning
        </h3>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <ContinueCard key={item.id} item={item} index={idx} onContinue={onContinue} />
        ))}
      </div>
    </section>
  );
});

const ContinueCard = memo(function ContinueCard({
  item,
  index,
  onContinue,
}: {
  item: BonusData;
  index: number;
  onContinue: (bonus: BonusData) => void;
}) {
  const isVideo = item.category === 'video';
  const Icon = isVideo ? Play : Book;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => onContinue(item)}
      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 cursor-pointer hover:bg-secondary/50 transition-all group"
    >
      {/* Thumbnail */}
      <div className={cn(
        "relative shrink-0 overflow-hidden rounded-lg bg-muted",
        isVideo ? "w-20 aspect-video" : "w-14 aspect-[3/4]"
      )}>
        <img 
          src={item.thumbnail || "/placeholder.svg"} 
          alt={item.title}
          className={cn(
            "absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-105",
            isVideo ? "object-cover" : "object-fill"
          )}
        />
        {/* Play/Read Icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
            <Icon className={cn("w-3.5 h-3.5 text-black", isVideo && "fill-black ml-0.5")} />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {item.title}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <Progress value={item.progress} className="h-1.5 flex-1 max-w-[100px]" />
          <span className="text-xs text-muted-foreground font-medium">
            {item.progress}%
          </span>
        </div>
      </div>

      {/* Arrow */}
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
    </motion.div>
  );
});
