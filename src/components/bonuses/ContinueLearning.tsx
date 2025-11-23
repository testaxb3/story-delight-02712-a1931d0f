import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { BonusData } from "./BonusCard";
import { memo } from "react";

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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary/20 to-intense/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Continue Learning</h2>
            <p className="text-sm text-muted-foreground">
              Pick up where you left off
            </p>
          </div>
        </div>
        {inProgressBonuses.length > 3 && (
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {inProgressBonuses.slice(0, 3).map((bonus, index) => (
          <motion.div
            key={bonus.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 group cursor-pointer">
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-primary/20 to-purple-500/20">
                  {bonus.thumbnail ? (
                    <img
                      src={bonus.thumbnail}
                      alt={bonus.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  <h3 className="font-semibold line-clamp-2 text-sm group-hover:text-primary transition-colors">
                    {bonus.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{bonus.duration || "30 min"}</span>
                  </div>

                  {/* Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{bonus.progress}% complete</span>
                      <span className="text-primary font-medium">
                        {Math.round((bonus.progress || 0) / 100 * 30)}min left
                      </span>
                    </div>
                    <Progress value={bonus.progress} className="h-2" />
                  </div>

                  {/* Action */}
                  <Button
                    size="sm"
                    className="w-full gradient-primary text-white"
                    onClick={() => onContinue(bonus)}
                  >
                    <Play className="w-3 h-3 mr-2" />
                    Continue
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});
