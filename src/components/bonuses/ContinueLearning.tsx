import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, ArrowRight, Clock } from "lucide-react";
import { BonusData } from "./BonusCard";
import { memo } from "react";
import { cn } from "@/lib/utils";

interface ContinueLearningProps {
  inProgressBonuses: BonusData[];
  onContinue: (bonus: BonusData) => void;
}

// PERFORMANCE: Memoize ContinueLearning component
export const ContinueLearning = memo(function ContinueLearning({ inProgressBonuses, onContinue }: ContinueLearningProps) {
  if (inProgressBonuses.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold tracking-tight">Up Next</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x">
        {inProgressBonuses.slice(0, 5).map((bonus, index) => (
          <motion.div
            key={bonus.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={cn(
              "snap-center first:pl-1",
              bonus.category === 'ebook' ? "min-w-[180px] w-[180px]" : "min-w-[280px] md:min-w-[320px]"
            )}
            onClick={() => onContinue(bonus)}
          >
            <div className={cn(
              "group relative cursor-pointer transition-all duration-300 h-full flex flex-col",
              bonus.category !== 'ebook' && "bg-card rounded-2xl overflow-hidden hover:shadow-lg border border-border/50"
            )}>
              {/* Thumbnail Area */}
              <div className={cn(
                "relative overflow-hidden w-full",
                bonus.category === 'ebook' ? "aspect-[3/4] rounded-2xl shadow-md border border-white/5" : "aspect-video"
              )}>
                {bonus.thumbnail ? (
                  <img
                    src={bonus.thumbnail}
                    alt={bonus.title}
                    className={cn(
                      "w-full h-full transition-transform duration-700 group-hover:scale-105",
                      bonus.category === 'ebook' ? "object-fill" : "object-cover"
                    )}
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Play className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </div>

                {/* Progress Bar at Bottom of Image */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${bonus.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Content Area */}
              <div className={cn(
                "flex flex-col justify-between flex-1",
                bonus.category === 'ebook' ? "mt-3 px-1" : "p-4"
              )}>
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">
                      {bonus.category || "Bonus"}
                    </span>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {Math.round((bonus.progress || 0) / 100 * (parseInt(bonus.duration || "30") || 30))}m left
                    </div>
                  </div>
                  
                  <h3 className={cn(
                    "font-semibold leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors",
                    bonus.category === 'ebook' ? "text-sm" : "text-base"
                  )}>
                    {bonus.title}
                  </h3>

                  {bonus.category !== 'ebook' && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {bonus.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});
