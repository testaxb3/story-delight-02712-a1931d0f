import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Heart, User } from 'lucide-react';
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
        return 'bg-intense/10 text-intense border-intense/20';
      case 'DISTRACTED':
        return 'bg-distracted/10 text-distracted border-distracted/20';
      case 'DEFIANT':
        return 'bg-defiant/10 text-defiant border-defiant/20';
      default:
        return 'bg-muted/50 text-muted-foreground border-border/30';
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
          <Badge className="bg-red-500/90 text-white dark:text-white border-0 shadow-lg animate-pulse font-bold text-xs">
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

      <div className="flex items-start gap-4 mt-12 relative z-10">
        <div className="text-5xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-tight">
            {script.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 font-medium">{displayCategory}</p>

          {script.situation_trigger && (
            <div className="mt-3 p-4 bg-gradient-to-br from-muted/70 to-muted/40 rounded-xl border border-border/30">
              <p className="text-sm font-medium text-foreground/90 line-clamp-2 leading-relaxed">
                💬 {script.situation_trigger}
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
            {script.expected_time_seconds && (
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>{Math.ceil(script.expected_time_seconds / 60)}min</span>
              </div>
            )}
            {(script.age_min && script.age_max) && (
              <div className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5" />
                <span>{script.age_min}-{script.age_max}y</span>
              </div>
            )}
            {script.difficulty && (
              <div className="flex items-center gap-1.5 font-medium capitalize">
                <span>• {script.difficulty}</span>
              </div>
            )}
          </div>

          {collectionsNames.length > 0 && (
            <div className="mt-3">
              <Badge variant="secondary" className="text-xs bg-muted/50 border-0">
                📚 {collectionsNames.length} collection{collectionsNames.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
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
