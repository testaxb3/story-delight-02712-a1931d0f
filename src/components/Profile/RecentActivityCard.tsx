import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import type { RecentActivity } from '@/hooks/useUserStats';
import { formatActivityDate } from '@/lib/profileUtils';

interface RecentActivityCardProps {
  activities: RecentActivity[];
}

export function RecentActivityCard({ activities }: RecentActivityCardProps) {
  if (activities.length === 0) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/30 dark:to-slate-800/30 border-slate-200/50 dark:border-slate-700/50 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Activity</h2>
      </div>
      <div className="space-y-2">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-white/80 dark:bg-slate-800/60 rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-300 animate-in fade-in slide-in-from-left-2"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="text-2xl">{activity.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {activity.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatActivityDate(activity.date)}
              </p>
            </div>
            <Badge variant="outline" className="text-xs dark:border-slate-600 dark:text-slate-300">
              {activity.type === 'script' ? '📖 Script' : '🎬 Video'}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
