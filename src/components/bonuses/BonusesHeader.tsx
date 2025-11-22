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
    <div className="mb-6 space-y-4">
      {/* Minimalist Title */}
      <h1 className="text-3xl font-bold text-white px-1">Bonuses</h1>

      {/* Stats Grid - CalAI Style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="bg-[#1C1C1E] border-none rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-[#2C2C2E]">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-2xl font-bold text-white">
                {stat.value}
              </span>
              {stat.total && (
                <span className="text-sm text-gray-500 font-medium">
                  /{stat.total}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
