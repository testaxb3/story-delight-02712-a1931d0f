import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Heart, MapPin, User, Zap, AlertTriangle, Calendar } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];

interface EnhancedScriptCardProps {
  script: ScriptRow;
  emoji: string;
  displayCategory: string;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  collectionsNames?: string[];
}

// PERFORMANCE OPTIMIZATION: Memoized component to prevent unnecessary re-renders
const EnhancedScriptCardComponent = ({
  script,
  emoji,
  displayCategory,
  onClick,
  isFavorite,
  onToggleFavorite,
  collectionsNames = [],
}: EnhancedScriptCardProps) => {
  const getBrainTypeBadgeColor = (brainType: string) => {
    switch (brainType) {
      case 'INTENSE':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      case 'DISTRACTED':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      case 'DEFIANT':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card
      className="group relative p-5 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/50 touch-target bg-card/50 backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {script.emergency_suitable && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse" />
      )}

      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20">
        <button
          onClick={onToggleFavorite}
          className="p-2 rounded-xl bg-background/95 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform touch-target"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'
            }`}
          />
        </button>
      </div>

      <div className="absolute top-4 left-4 flex gap-2 z-10">
        {script.emergency_suitable && (
          <Badge className="bg-red-500/90 text-white border-0 shadow-lg animate-pulse font-bold text-xs">
            🚨 SOS
          </Badge>
        )}
        <Badge
          className={`${getBrainTypeBadgeColor(script.profile)} font-bold shadow-md border-2 px-3 py-1 text-xs`}
          variant="outline"
        >
          {script.profile}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="flex items-start gap-4 mt-12">
        <div className="text-5xl flex-shrink-0 group-hover:scale-110 transition-transform">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {script.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">{displayCategory}</p>

          {/* Situation Trigger - Compact */}
          {script.situation_trigger && (
            <div className="mt-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-xs font-semibold text-warning-foreground mb-1">
                WHEN TO USE:
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {script.situation_trigger}
              </p>
            </div>
          )}

          {/* Key Badges - Most Important Only */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {script.expected_time_seconds && (
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {script.expected_time_seconds}s
              </Badge>
            )}

            {script.success_speed && (
              <Badge variant="outline" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                {script.success_speed}
              </Badge>
            )}

            {script.intensity_level === 'moderate' && (
              <Badge className="text-[10px] bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
                ⚠️ Moderate
              </Badge>
            )}

            {script.intensity_level === 'mild' && (
              <Badge className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                ✨ Mild situations
              </Badge>
            )}

            {script.age_min && script.age_max && (
              <Badge className="text-[10px] bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20">
                <User className="w-3 h-3 mr-1" />
                Ages {script.age_min}-{script.age_max}
              </Badge>
            )}

            {script.difficulty && (
              <Badge
                className={`text-[10px] ${
                  script.difficulty === 'Easy'
                    ? 'bg-green-500/10 text-green-700 border-green-500/20'
                    : script.difficulty === 'Moderate'
                    ? 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
                    : 'bg-red-500/10 text-red-700 border-red-500/20'
                }`}
              >
                {script.difficulty_level}
              </Badge>
            )}

            {script.requires_preparation && (
              <Badge className="text-[10px] bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Needs prep
              </Badge>
            )}
          </div>

          {/* Original Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <Badge variant="outline" className="border-blue-500/30 text-blue-700 dark:text-blue-400 bg-blue-500/5 font-semibold">
              <Clock className="w-3 h-3 mr-1" />
              {script.estimated_time_minutes ?? 5} min
            </Badge>
            {script.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="border-primary/30 text-primary font-medium">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Collections */}
          {collectionsNames.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {collectionsNames.map((name) => (
                <Badge key={name} className="bg-purple-500/10 text-purple-700 border-purple-500/20">
                  📂 {name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Export memoized version with custom comparison function
export const EnhancedScriptCard = memo(EnhancedScriptCardComponent, (prevProps, nextProps) => {
  // Custom comparison: only re-render if these specific props change
  return (
    prevProps.script.id === nextProps.script.id &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.collectionsNames?.length === nextProps.collectionsNames?.length
  );
});
