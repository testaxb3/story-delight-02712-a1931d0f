import { Loader2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Database } from '@/integrations/supabase/types';
import { routes } from '@/lib/navigation';

type VideoRow = Database['public']['Tables']['videos']['Row'];

interface VideoCardProps {
  loading: boolean;
  video: VideoRow | null;
  progressPercentage: number;
  getSectionDisplay: (section: string) => { name: string; icon: string };
}

export function VideoCard({
  loading,
  video,
  progressPercentage,
  getSectionDisplay,
}: VideoCardProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card className="p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-glass border-none shadow-lg">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (video) {
    return (
      <Card className="p-4 sm:p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-glass border-none shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-warning">
            <span className="text-xl">⭐</span>
            <span className="font-semibold uppercase text-xs sm:text-sm">Continue Where You Left Off</span>
          </div>
          <Badge variant="secondary" className="text-xs sm:text-sm dark:bg-slate-700 dark:text-slate-200">{progressPercentage}% Complete</Badge>
        </div>

        <div
          className="relative mb-4 bg-gradient-accent rounded-xl overflow-hidden aspect-video flex items-center justify-center cursor-pointer group transition-all hover:scale-[1.02]"
          onClick={() => navigate(routes.bonusesVideos)}
        >
          {video.thumbnail_url ? (
            <>
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 opacity-80 group-hover:opacity-90 transition-opacity" />
          )}

          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Play className="w-10 h-10 sm:w-12 sm:h-12 fill-white" />
              <span className="text-base sm:text-lg">Continue</span>
            </div>
          </div>

          {video.duration && (
            <div className="absolute top-4 right-4 bg-black/70 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold z-10">
              {video.duration}
            </div>
          )}
          {video.section && (
            <div className="absolute bottom-4 left-4 z-10">
              <Badge className="bg-warning text-white border-none text-xs sm:text-sm">
                {getSectionDisplay(video.section).icon} {getSectionDisplay(video.section).name}
              </Badge>
            </div>
          )}

          {/* Progress bar overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20 z-10">
            <div
              className="h-full bg-warning transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2 text-foreground">{video.title}</h3>

        {video.description && (
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2">
            {video.description}
          </p>
        )}

        <div className="mb-4 flex items-center justify-between text-xs sm:text-sm">
          <span className="text-muted-foreground">Progress: {progressPercentage}% complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2 mb-4" />

        <Button className="w-full text-sm sm:text-base" onClick={() => navigate(routes.bonusesVideos)}>
          <Play className="w-4 h-4 mr-2" />
          Continue Watching
        </Button>
      </Card>
    );
  }

  // No video started yet - show start journey card
  return (
    <Card className="p-4 sm:p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-glass border-none shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-warning">
          <span className="text-xl">⭐</span>
          <span className="font-semibold uppercase text-xs sm:text-sm">Start Your Journey</span>
        </div>
        <Badge variant="secondary" className="text-xs sm:text-sm dark:bg-slate-700 dark:text-slate-200">NEW</Badge>
      </div>

      <div
        className="relative mb-4 bg-gradient-accent rounded-xl overflow-hidden aspect-video flex items-center justify-center cursor-pointer group transition-all hover:scale-[1.02]"
        onClick={() => navigate(routes.bonusesVideos)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 opacity-80 group-hover:opacity-90 transition-opacity" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center z-20">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-white font-semibold">
            <Play className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base">Watch Now</span>
          </div>
        </div>
        <Play className="w-12 h-12 sm:w-16 sm:h-16 text-white relative z-10 group-hover:opacity-0 transition-opacity" />
        <div className="absolute bottom-4 left-4 z-10">
          <Badge className="bg-warning text-white border-none text-xs sm:text-sm">💡 Foundations</Badge>
        </div>
      </div>

      <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Start with Foundations Videos</h3>

      <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg mb-4 border border-primary/20 dark:border-primary/30">
        <p className="text-xs sm:text-sm font-semibold text-primary dark:text-primary-foreground mb-1">Begin your journey:</p>
        <p className="text-xs sm:text-sm text-foreground">Learn the science behind your child's brain and transform your parenting</p>
      </div>

      <Button className="w-full text-sm sm:text-base" onClick={() => navigate(routes.bonusesVideos)}>
        <Play className="w-4 h-4 mr-2" />
        Start Watching
      </Button>
    </Card>
  );
}
