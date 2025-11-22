import { Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/lib/navigation';

interface ContinueWatchingProps {
  videoTitle: string;
  videoSection: string;
  progressPercentage: number;
  thumbnailUrl?: string;
  videoId: string;
}

export const ContinueWatching = ({ 
  videoTitle, 
  videoSection, 
  progressPercentage, 
  thumbnailUrl,
  videoId 
}: ContinueWatchingProps) => {
  const navigate = useNavigate();

  if (progressPercentage >= 100) return null;

  return (
    <div className="card-glass rounded-2xl p-6 hover-lift cursor-pointer" onClick={() => navigate(routes.bonusesVideos)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-warning/10">
          <Clock className="w-4 h-4 text-warning" />
        </div>
        <span className="text-sm font-bold text-warning uppercase tracking-wide">
          Continue Where You Left Off
        </span>
        <div className="ml-auto px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20">
          <span className="text-xs font-bold text-secondary">{progressPercentage}% Complete</span>
        </div>
      </div>

      <div className="flex gap-4">
        {thumbnailUrl && (
          <div className="relative w-32 h-20 flex-shrink-0 rounded-xl overflow-hidden">
            <img 
              src={thumbnailUrl} 
              alt={videoTitle} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground font-medium mb-1">
            {videoSection}
          </div>
          <h3 className="font-bold text-foreground mb-3 line-clamp-2">
            {videoTitle}
          </h3>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      <Button 
        className="w-full mt-4 gradient-primary font-bold group"
        onClick={(e) => {
          e.stopPropagation();
          navigate(routes.bonusesVideos);
        }}
      >
        <Play className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
        Continue Watching
      </Button>
    </div>
  );
};
