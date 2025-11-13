import { motion } from "framer-motion";
import { Gift, Trophy, Clock, CheckCircle, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BonusesHeaderProps {
  userName?: string;
  totalBonuses: number;
  unlockedBonuses: number;
  completedBonuses: number;
  totalTimeSpent?: string;
}

export function BonusesHeader({
  userName = "Member",
  totalBonuses,
  unlockedBonuses,
  completedBonuses,
  totalTimeSpent = "0h"
}: BonusesHeaderProps) {
  const completionPercentage = Math.round((completedBonuses / totalBonuses) * 100);
  const unlockedPercentage = Math.round((unlockedBonuses / totalBonuses) * 100);

  const stats = [
    {
      icon: Gift,
      label: "Bonuses Available",
      value: unlockedBonuses,
      total: totalBonuses,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: completedBonuses,
      total: totalBonuses,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      icon: Trophy,
      label: "Completion",
      value: `${completionPercentage}%`,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Clock,
      label: "Time Invested",
      value: totalTimeSpent,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    }
  ];

  return (
    <div className="mb-8 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-primary/20 to-intense/20 rounded-xl">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-intense to-purple-600 bg-clip-text text-transparent">
              Welcome back, {userName}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Continue your journey to parenting mastery
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl md:text-3xl font-bold">
                    {stat.value}
                  </span>
                  {stat.total && (
                    <span className="text-sm text-muted-foreground">
                      /{stat.total}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-6 bg-gradient-to-br from-primary/5 via-intense/5 to-purple-500/5 border-2 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-purple-600 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Your Learning Journey</h3>
                <p className="text-sm text-muted-foreground">
                  {completionPercentage}% of all bonuses completed
                </p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {completedBonuses}/{totalBonuses}
              </div>
              <p className="text-xs text-muted-foreground">Bonuses</p>
            </div>
          </div>
          <Progress value={completionPercentage} className="h-3" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Keep learning to unlock more bonuses</span>
            <span>{100 - completionPercentage}% remaining</span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
