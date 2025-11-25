import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, TrendingDown } from 'lucide-react';

interface InsightsCardProps {
  meltdownsBefore: number;
  meltdownsAfter: number;
  averageStress: number;
  totalEntries: number;
}

export function InsightsCard({ meltdownsBefore, meltdownsAfter, averageStress, totalEntries }: InsightsCardProps) {
  const improvement = meltdownsBefore > 0 
    ? Math.round(((meltdownsBefore - meltdownsAfter) / meltdownsBefore) * 100)
    : 0;
  
  const isImproving = improvement > 0;
  const hasEnoughData = totalEntries >= 7;

  if (!hasEnoughData) {
    return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="px-6 mb-6"
          >
            <div className="bg-card border border-border rounded-3xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/10 rounded-xl">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Your Insights</h3>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  Track for 7 days to unlock personalized insights about your child's progress and patterns.
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(totalEntries / 7) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-bold">{totalEntries}/7</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      }
      
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="px-6 mb-6"
          >
            <div className="bg-card border border-border rounded-3xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-xl">
                      {isImproving ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Your Progress</h3>
                  </div>

                  {isImproving && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring" }}
                      className="px-3 py-1 bg-green-500/10 rounded-full"
                    >
                      <span className="text-green-600 font-bold text-sm">↓ {improvement}%</span>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-4 border border-border/20">
                    <div className="text-2xl font-bold text-foreground mb-1">{meltdownsBefore}</div>
                    <div className="text-xs text-muted-foreground">Before Day 7</div>
                  </div>

                  <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-4 border border-border/20">
                    <div className="text-2xl font-bold text-green-600 mb-1">{meltdownsAfter}</div>
                    <div className="text-xs text-muted-foreground">After Day 7</div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-muted/50 backdrop-blur-sm rounded-xl border border-border/20">
                  <div className="text-sm text-muted-foreground mb-2">Average Stress Level</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-yellow-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(averageStress / 10) * 100}%` }}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                    </div>
                    <span className="text-foreground font-bold text-lg">{averageStress.toFixed(1)}/10</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      }
