import { Card, CardContent } from '@/components/ui/card';
import { Play, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoStatsCardsProps {
  totalVideos: number;
  watchedCount: number;
  inProgressCount: number;
  totalMinutesWatched: number;
}

export function VideoStatsCards({
  totalVideos,
  watchedCount,
  inProgressCount,
  totalMinutesWatched,
}: VideoStatsCardsProps) {
  const completionRate = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;

  const stats = [
    {
      label: 'Total Videos',
      value: totalVideos,
      icon: Play,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Completed',
      value: watchedCount,
      icon: CheckCircle2,
      gradient: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-400',
    },
    {
      label: 'In Progress',
      value: inProgressCount,
      icon: Clock,
      gradient: 'from-orange-500/20 to-amber-500/20',
      iconColor: 'text-orange-400',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`bonus-glass border-border/40 overflow-hidden group hover:border-primary/50 transition-all duration-300`}>
            <CardContent className="p-4 relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
