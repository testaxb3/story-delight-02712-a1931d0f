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
      className="relative overflow-hidden rounded-xl p-6 bg-card border border-border hover:border-primary/50 transition-all group"
    >
      {/* Background gradient on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${gradient}`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-black text-foreground">{value}</p>
          {subtext && (
            <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
          )}
        </div>
      </div>
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
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Your Impact</h3>
        <p className="text-sm text-muted-foreground">
          Track your transformation journey
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

        <StatItem
          icon={Calendar}
          label="Active Days"
          value={completedDays}
          subtext="Days with recorded progress"
          gradient="from-indigo-400 to-blue-500"
          index={4}
        />
      </div>
    </Card>
  );
}
