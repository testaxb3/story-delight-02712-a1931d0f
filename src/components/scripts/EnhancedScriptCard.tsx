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
      className="p-5 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200/50 dark:border-slate-700/50 shadow-xl cursor-pointer hover:shadow-2xl hover:-translate-y-1 hover:border-primary/50 transition-all duration-200 relative overflow-hidden group"
      onClick={onClick}
    >
      {/* Brain Type Badge - Top Right */}
      <Badge
        className={`absolute top-4 right-16 ${getBrainTypeBadgeColor(script.profile)} border-2 text-xs font-bold px-3 py-1.5 shadow-md`}
        variant="outline"
      >
        🧠 {script.profile}
      </Badge>

      {/* Favorite Button - Top Right Corner */}
      <button
        onClick={onToggleFavorite}
        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-primary/10 transition-colors z-10"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          className={`w-5 h-5 transition-all ${
            isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'
          }`}
        />
      </button>

      {/* Emergency Badge - Top Left */}
      {script.emergency_suitable && (
        <Badge className="absolute top-4 left-4 bg-red-500/10 text-red-700 border-red-500/20 border-2 text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 shadow-md">
          <Zap className="w-3 h-3" />
          SOS READY
        </Badge>
      )}

      {/* Main Content */}
      <div className="flex items-start gap-4 flex-1 pr-2">
        <div
          className={`text-4xl flex-shrink-0 ${script.emergency_suitable ? 'mt-12' : 'mt-6'} group-hover:scale-110 transition-transform`}
        >
          {emoji}
        </div>
        <div className={`flex-1 ${script.emergency_suitable ? 'mt-12' : 'mt-6'}`}>
          <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
            {script.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2 font-medium">{displayCategory}</p>

          {/* Situation Trigger - NEW */}
          {script.situation_trigger && (
            <div className="mt-3 mb-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md">
              <p className="text-[10px] font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide mb-1">
                WHEN TO USE:
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                {script.situation_trigger}
              </p>
            </div>
          )}

          {/* Context Badges - NEW */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {script.success_speed && (
              <Badge className="text-[10px] bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                <Zap className="w-3 h-3 mr-1" />
                {script.success_speed}
              </Badge>
            )}

            {script.expected_time_seconds && (
              <Badge className="text-[10px] bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
                <Clock className="w-3 h-3 mr-1" />
                {script.expected_time_seconds}s
              </Badge>
            )}

            {script.location_type && script.location_type.includes('public') && (
              <Badge className="text-[10px] bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20">
                <MapPin className="w-3 h-3 mr-1" />
                Works in public
              </Badge>
            )}

            {script.parent_state && script.parent_state.includes('frustrated') && (
              <Badge className="text-[10px] bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20">
                😤 OK when frustrated
              </Badge>
            )}

            {script.parent_state && script.parent_state.includes('exhausted') && (
              <Badge className="text-[10px] bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20">
                😮‍💨 Works when tired
              </Badge>
            )}

            {script.intensity_level === 'severe' && (
              <Badge className="text-[10px] bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
                🔥 Major meltdowns
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

            {script.difficulty_level && (
              <Badge
                className={`text-[10px] ${
                  script.difficulty_level === 'beginner'
                    ? 'bg-green-500/10 text-green-700 border-green-500/20'
                    : script.difficulty_level === 'intermediate'
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
