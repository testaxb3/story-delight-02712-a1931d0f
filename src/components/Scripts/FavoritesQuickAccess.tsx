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
      <div className="space-y-2">
        {favorites.slice(0, 6).map((item, index) => (
          <button
            key={item.script.id}
            onClick={() => onSelectScript(item.script)}
            className="w-full flex items-center gap-3 px-3 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-pink-200 dark:border-pink-800 hover:border-pink-400 hover:shadow-md transition-all group animate-in fade-in slide-in-from-left duration-200 text-left"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <span className="text-lg group-hover:scale-110 transition-transform flex-shrink-0">
              {item.emoji}
            </span>
            <span className="text-sm font-medium text-pink-900 dark:text-pink-100 truncate">
              {item.script.title}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
