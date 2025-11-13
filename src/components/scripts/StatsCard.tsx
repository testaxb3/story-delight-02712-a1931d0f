import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Star, CheckCircle2, Zap } from 'lucide-react';

interface StatsCardProps {
  stats: {
    totalScripts: number;
    usedThisWeek: number;
    favorites: number;
    streak: number;
  };
}

export function StatsCard({ stats }: StatsCardProps) {
  const statItems = [
    {
      label: 'Scripts Used',
      value: stats.usedThisWeek,
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Favorites',
      value: stats.favorites,
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      label: 'Day Streak',
      value: stats.streak,
      icon: Zap,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
    },
    {
      label: 'Total Scripts',
      value: stats.totalScripts,
      icon: BarChart3,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
  ];

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200/50 dark:border-indigo-800/50 animate-in fade-in slide-in-from-bottom-3 duration-400">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
          This Week's Stats
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statItems.map((stat, index) => (
          <div
            key={stat.label}
            className="flex flex-col items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-indigo-200/50 dark:border-indigo-700/50 animate-in zoom-in duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`p-2 ${stat.bg} rounded-lg mb-2`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <span className="text-2xl font-black text-indigo-900 dark:text-indigo-100">
              {stat.value}
            </span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 text-center">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
