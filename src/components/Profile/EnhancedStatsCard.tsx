import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { TrendingUp, BookOpen, Target, Zap, Calendar } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatItemProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  gradient: string;
  index: number;
}

function StatItem({ icon: Icon, label, value, subtext, gradient, index }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative overflow-hidden rounded-lg p-4 bg-card border border-border/50 hover:border-primary/30 transition-all"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground truncate">{label}</p>
          <p className="text-2xl font-black text-foreground">{value}</p>
        </div>
      </div>
      {subtext && (
        <p className="text-xs text-muted-foreground/80">{subtext}</p>
      )}
    </motion.div>
  );
}

interface EnhancedStatsCardProps {
  completedDays: number;
  totalDays: number;
  scriptsUsed: number;
  currentStreak: number;
  avgStress?: number;
}

export function EnhancedStatsCard({ 
  completedDays, 
  totalDays, 
  scriptsUsed, 
  currentStreak,
  avgStress 
}: EnhancedStatsCardProps) {
  const completionRate = Math.round((completedDays / totalDays) * 100);

  return (
    <Card className="p-4 space-y-4">
      <div>
        <h3 className="text-xl font-black text-foreground mb-1">Your Impact</h3>
        <p className="text-xs text-muted-foreground">
          Track your transformation
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatItem
          icon={Target}
          label="Days Completed"
          value={`${completedDays}/${totalDays}`}
          subtext={`${completionRate}% complete`}
          gradient="from-blue-400 to-cyan-500"
          index={0}
        />

        <StatItem
          icon={BookOpen}
          label="Scripts Used"
          value={scriptsUsed}
          subtext="Unique scripts applied"
          gradient="from-purple-400 to-pink-500"
          index={1}
        />

        <StatItem
          icon={Zap}
          label="Current Streak"
          value={currentStreak}
          subtext={currentStreak > 0 ? `${currentStreak} days in a row! 🔥` : 'Start your streak today'}
          gradient="from-orange-400 to-red-500"
          index={2}
        />

        {avgStress !== undefined && (
          <StatItem
            icon={TrendingUp}
            label="Avg Stress Level"
            value={avgStress.toFixed(1)}
            subtext="Out of 5.0"
            gradient="from-green-400 to-emerald-500"
            index={3}
          />
        )}
      </div>
    </Card>
  );
}
