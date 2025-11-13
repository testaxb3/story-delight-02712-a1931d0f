import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];

interface FavoritesQuickAccessProps {
  favorites: Array<{
    script: ScriptRow;
    emoji: string;
  }>;
  onSelectScript: (script: ScriptRow) => void;
}

export function FavoritesQuickAccess({
  favorites,
  onSelectScript,
}: FavoritesQuickAccessProps) {
  if (favorites.length === 0) return null;

  return (
    <Card className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border border-pink-200/50 dark:border-pink-800/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
          <h3 className="text-sm font-bold text-pink-900 dark:text-pink-100">
            Quick Favorites
          </h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {favorites.length}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {favorites.slice(0, 8).map((item, index) => (
          <button
            key={item.script.id}
            onClick={() => onSelectScript(item.script)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-full border border-pink-200 dark:border-pink-800 hover:border-pink-400 hover:shadow-md transition-all group animate-in fade-in zoom-in duration-200"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <span className="text-sm group-hover:scale-110 transition-transform">
              {item.emoji}
            </span>
            <span className="text-xs font-medium text-pink-900 dark:text-pink-100 max-w-[120px] truncate">
              {item.script.title}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
