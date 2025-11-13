import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VideoProgress {
  id: string;
  video_id: string;
  progress_seconds: number;
  duration_seconds: number;
  last_watched_at: string;
  completed: boolean;
  videos: {
    id: string;
    title: string;
    thumbnail_url?: string;
    duration_seconds?: number;
    youtube_id?: string;
  };
}

export function ContinueWatching() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: inProgressVideos, isLoading } = useQuery({
    queryKey: ['continue-watching', user?.profileId],
    queryFn: async () => {
      if (!user?.profileId) return [];

      const { data, error } = await supabase
        .from('video_progress')
        .select(`
          *,
          videos (
            id,
            title,
            thumbnail_url,
            duration_seconds,
            youtube_id
          )
        `)
        .eq('user_id', user.profileId)
        .eq('completed', false)
        .gt('progress_seconds', 10) // Only videos watched for more than 10 seconds
        .order('last_watched_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as VideoProgress[];
    },
    enabled: !!user?.profileId,
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (progress: number, duration: number) => {
    if (!duration) return 0;
    return (progress / duration) * 100;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Continue Watching</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!inProgressVideos || inProgressVideos.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          Continue Watching
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inProgressVideos.map((item) => {
            const video = item.videos;
            const progressPercent = getProgressPercentage(
              item.progress_seconds,
              item.duration_seconds || video.duration_seconds || 0
            );

            return (
              <div
                key={item.id}
                className="flex gap-4 p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer"
                onClick={() => navigate(`/videos?v=${video.youtube_id}`)}
              >
                {video.thumbnail_url && (
                  <div className="relative w-32 h-20 flex-shrink-0 rounded overflow-hidden">
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium mb-1 line-clamp-2">{video.title}</h4>
                  
                  <div className="space-y-2">
                    <Progress value={progressPercent} className="h-1" />
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatTime(item.progress_seconds)} / {formatTime(item.duration_seconds || video.duration_seconds || 0)}
                        </span>
                      </div>
                      <span>{Math.round(progressPercent)}% complete</span>
                    </div>
                  </div>
                </div>

                <Button size="sm" variant="ghost" className="self-center">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
