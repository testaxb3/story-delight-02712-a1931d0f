import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock } from 'lucide-react';
import { useRecentScripts } from '@/hooks/useRecentScripts';
import { useFavoriteScripts } from '@/hooks/useFavoriteScripts';
import { timeAgo } from '@/utils/timeAgo';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];

interface QuickAccessBarProps {
  onScriptSelect: (script: ScriptRow) => void;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  bedtime: '🛏️',
  screens: '📱',
  mealtime: '🍽️',
  transitions: '🔄',
  tantrums: '😤',
  morning_routines: '☀️',
  social: '👥',
  hygiene: '🪥',
};

const getBrainTypeGradient = (brainType: string): string => {
  switch (brainType?.toUpperCase()) {
    case 'INTENSE':
      return 'from-red-500/20 to-orange-500/20';
    case 'DISTRACTED':
      return 'from-blue-500/20 to-cyan-500/20';
    case 'DEFIANT':
      return 'from-purple-500/20 to-pink-500/20';
    default:
      return 'from-violet-500/20 to-purple-500/20';
  }
};

export function QuickAccessBar({ onScriptSelect }: QuickAccessBarProps) {
  const { recentScripts, isLoading: loadingRecent } = useRecentScripts();
  const { favorites, loading: loadingFavorites } = useFavoriteScripts();
  const [favoriteScripts, setFavoriteScripts] = useState<ScriptRow[]>([]);

  // Fetch top 2 favorite scripts
  useEffect(() => {
    const fetchFavoriteScripts = async () => {
      if (favorites.length === 0) {
        setFavoriteScripts([]);
        return;
      }

      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .in('id', favorites)
        .limit(2);

      if (error) {
        console.error('Error fetching favorite scripts:', error);
        setFavoriteScripts([]);
        return;
      }

      setFavoriteScripts(data || []);
    };

    fetchFavoriteScripts();
  }, [favorites]);

  const isLoading = loadingRecent || loadingFavorites;
  const hasContent = recentScripts.length > 0 || favoriteScripts.length > 0;

  // Don't render if no content and not loading
  if (!isLoading && !hasContent) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Quick Access</h2>
      </div>

      <div className="relative">
        <div className="flex overflow-x-auto scrollbar-hide gap-3 pb-2">
          {/* Loading Skeletons */}
          {isLoading && (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={`skeleton-${i}`}
                  className="flex-shrink-0 w-[120px] h-[100px] rounded-xl bg-gradient-to-br from-slate-200/50 to-slate-300/50 dark:from-slate-700/50 dark:to-slate-800/50 animate-pulse"
                />
              ))}
            </>
          )}

          {/* Recent Scripts Section */}
          {!isLoading && recentScripts.length > 0 && (
            <>
              {recentScripts.map((script) => {
                const emoji = CATEGORY_EMOJIS[script.category?.toLowerCase()] || '🧠';
                const gradient = getBrainTypeGradient(script.profile);

                return (
                  <button
                    key={`recent-${script.id}`}
                    onClick={() => onScriptSelect(script)}
                    className="flex-shrink-0 w-[120px] h-[100px] rounded-xl bg-gradient-to-br backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border-2 border-white/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 p-3 flex flex-col items-center justify-center gap-2 group relative overflow-hidden"
                  >
                    {/* Gradient Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-70 transition-opacity`}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 w-full">
                      <div className="text-3xl group-hover:scale-110 transition-transform">
                        {emoji}
                      </div>
                      <h3 className="text-[10px] font-bold text-center line-clamp-2 leading-tight px-1">
                        {script.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="text-[9px] px-1.5 py-0 bg-slate-900/10 dark:bg-white/10 border-none"
                      >
                        {timeAgo(script.used_at)}
                      </Badge>
                    </div>
                  </button>
                );
              })}

              {/* Visual Divider if we have both sections */}
              {favoriteScripts.length > 0 && (
                <div className="flex-shrink-0 w-px h-[100px] bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
              )}
            </>
          )}

          {/* Favorites Section */}
          {!isLoading && favoriteScripts.length > 0 && (
            <>
              {favoriteScripts.map((script) => {
                const emoji = CATEGORY_EMOJIS[script.category?.toLowerCase()] || '🧠';
                const gradient = getBrainTypeGradient(script.profile);

                return (
                  <button
                    key={`favorite-${script.id}`}
                    onClick={() => onScriptSelect(script)}
                    className="flex-shrink-0 w-[120px] h-[100px] rounded-xl bg-gradient-to-br backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border-2 border-yellow-500/30 dark:border-yellow-400/30 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 p-3 flex flex-col items-center justify-center gap-2 group relative overflow-hidden"
                  >
                    {/* Gradient Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-70 transition-opacity`}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 w-full">
                      <div className="text-3xl group-hover:scale-110 transition-transform">
                        {emoji}
                      </div>
                      <h3 className="text-[10px] font-bold text-center line-clamp-2 leading-tight px-1">
                        {script.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="text-[9px] px-1.5 py-0 bg-yellow-500/20 dark:bg-yellow-400/20 border-none flex items-center gap-0.5"
                      >
                        <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
                        Favorite
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </>
          )}

          {/* Empty State */}
          {!isLoading && recentScripts.length === 0 && favoriteScripts.length === 0 && (
            <Card className="flex-shrink-0 w-full p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border-dashed">
              <p className="text-xs text-muted-foreground text-center">
                Your recently used scripts will appear here
              </p>
            </Card>
          )}
        </div>

        {/* Scroll Fade Effect (optional visual enhancement) */}
        {hasContent && !isLoading && (
          <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  );
}
