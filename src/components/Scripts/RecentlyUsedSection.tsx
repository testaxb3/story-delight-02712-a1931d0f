import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];

interface RecentlyUsedSectionProps {
  recentScripts: Array<{
    script: ScriptRow;
    usedAt: string;
    emoji: string;
    displayCategory: string;
  }>;
  onSelectScript: (script: ScriptRow) => void;
  loading?: boolean;
}

const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export function RecentlyUsedSection({
  recentScripts,
  onSelectScript,
  loading = false,
}: RecentlyUsedSectionProps) {
  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/50 dark:border-blue-800/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Clock className="w-5 h-5 text-white animate-pulse" />
          </div>
          <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100">
            Recently Used
          </h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-white/50 dark:bg-slate-800/50 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </Card>
    );
  }

  if (recentScripts.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/50 dark:border-blue-800/50 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100">
              Recently Used
            </h2>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Last 7 days
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50">
          {recentScripts.length}
        </Badge>
      </div>

      <div className="space-y-2">
        {recentScripts.map((item, index) => (
          <button
            key={`${item.script.id}-${index}`}
            onClick={() => onSelectScript(item.script)}
            className="w-full text-left p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all group animate-in fade-in slide-in-from-left duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {item.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-blue-900 dark:text-blue-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.script.title}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {item.displayCategory}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 flex-shrink-0">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(item.usedAt)}
              </div>
            </div>
          </button>
        ))}
      </div>

      {recentScripts.length >= 5 && (
        <div className="mt-3 text-center">
          <p className="text-xs text-blue-600 dark:text-blue-400">
            💡 Keep using scripts to see your personalized patterns
          </p>
        </div>
      )}
    </Card>
  );
}
