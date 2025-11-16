import { motion } from "framer-motion";
import { Gift, Trophy, Clock, CheckCircle, Sparkles, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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
      bgGradient: "from-primary/20 via-primary/10 to-transparent",
      glowClass: "hover:shadow-glow"
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: completedBonuses,
      total: totalBonuses,
      color: "text-emerald-500",
      bgGradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
      glowClass: "hover:shadow-[0_0_30px_-10px_hsl(var(--success)/0.4)]"
    },
    {
      icon: TrendingUp,
      label: "Completion",
      value: `${completionPercentage}%`,
      color: "text-purple-500",
      bgGradient: "from-purple-500/20 via-purple-500/10 to-transparent",
      glowClass: "hover:shadow-[0_0_30px_-10px_hsl(270_80%_65%/0.4)]"
    },
    {
      icon: Clock,
      label: "Time Invested",
      value: totalTimeSpent,
      color: "text-blue-500",
      bgGradient: "from-blue-500/20 via-blue-500/10 to-transparent",
      glowClass: "hover:shadow-[0_0_30px_-10px_hsl(210_90%_60%/0.4)]"
    }
  ];

  return (
    <div className="mb-8 space-y-6">
      {/* Animated Gradient Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10"
      >
        {/* Animated mesh background */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full bg-primary/10 blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2,
              }}
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 20}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <motion.div
              animate={{
                rotate: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="p-3 bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl backdrop-blur-sm"
            >
              <Gift className="w-10 h-10 text-primary" />
            </motion.div>
            <div className="flex-1">
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-1"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--secondary)) 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                Welcome back, {userName}
              </motion.h1>
              <p className="text-muted-foreground text-base md:text-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                Continue your journey to parenting mastery
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Premium Glass Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={cn(
              "relative overflow-hidden transition-all duration-500",
              "bonus-glass hover:scale-105",
              stat.glowClass
            )}>
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
              
              <div className="relative p-5">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="p-2.5 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50"
                  >
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </motion.div>
                </div>
                
                <div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <motion.span
                      className="text-3xl font-bold"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                    >
                      {stat.value}
                    </motion.span>
                    {stat.total && (
                      <span className="text-sm text-muted-foreground font-medium">
                        /{stat.total}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
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
