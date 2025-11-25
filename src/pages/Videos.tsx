import { useEffect, useMemo, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Bookmark, BookmarkCheck, CheckCircle2, Play, Lock, Clock, Eye, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVideoProgressOptimized } from '@/hooks/useVideoProgressOptimized';
import { useVideoBookmarks } from '@/hooks/useVideoBookmarks';
import { EmptyState } from '@/components/common/EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import { OptimizedYouTubePlayer } from '@/components/VideoPlayer/OptimizedYouTubePlayer';
import { VideoStatsCards } from '@/components/Videos/VideoStatsCards';
import { VideoCategoryTabs } from '@/components/Videos/VideoCategoryTabs';
import { motion, AnimatePresence } from 'framer-motion';

type VideoRow = Database['public']['Tables']['videos']['Row'];
type FilterType = 'all' | 'watched' | 'unwatched' | 'in-progress' | 'bookmarked';

const getSectionDisplay = (section: string): { name: string; icon: string } => {
  const sectionMap: Record<string, { name: string; icon: string }> = {
    'practice': { name: 'Daily Situations', icon: '🎯' },
    'mastery': { name: 'Masterclass', icon: '⚡' },
    'foundation': { name: 'Foundations', icon: '💡' },
    'ages-1-2': { name: 'Ages 1-2', icon: '🎯' },
    'ages-3-4': { name: 'Ages 3-4', icon: '⚡' },
    'ages-5-plus': { name: 'Ages 5+', icon: '💡' },
  };
  return sectionMap[section.toLowerCase()] || { name: section, icon: '📚' };
};

const fetchVideos = async () => {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) throw new Error('Failed to load videos');
  return data ?? [];
};

const parseDurationToMinutes = (duration: string | null): number => {
  if (!duration) return 0;
  const parts = duration.split(':');
  if (parts.length < 2) return 0;
  const minutes = Number(parts[0]) || 0;
  const seconds = Number(parts[1]) || 0;
  return minutes + seconds / 60;
};

export default function Videos() {
  const { user } = useAuth();

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortNewest, setSortNewest] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<VideoRow | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const autoMarkedRef = useRef<string | null>(null);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
  });

  const { progress, updateProgress, markAsWatched, getProgressPercentage, isCompleted, isInProgress } = useVideoProgressOptimized();
  const { bookmarks, loading: bookmarksLoading, toggleBookmark, isBookmarked } = useVideoBookmarks();

  const watched = useMemo(() => {
    return new Set(Array.from(progress.keys()).filter(id => isCompleted(id)));
  }, [progress, isCompleted]);

  const inProgressSet = useMemo(() => {
    return new Set(Array.from(progress.keys()).filter(id => isInProgress(id)));
  }, [progress, isInProgress]);

  const sections = useMemo(() => {
    const uniqueSections = [...new Set(videos.map(v => getSectionDisplay(v.section).name))];
    return uniqueSections;
  }, [videos]);

  const filteredVideos = useMemo(() => {
    let result = videos;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.title.toLowerCase().includes(query) ||
        v.description?.toLowerCase().includes(query)
      );
    }

    if (sectionFilter !== 'all') {
      result = result.filter(v => getSectionDisplay(v.section).name === sectionFilter);
    }

    if (filter === 'watched') {
      result = result.filter(v => watched.has(v.id));
    } else if (filter === 'unwatched') {
      result = result.filter(v => !watched.has(v.id) && !inProgressSet.has(v.id));
    } else if (filter === 'in-progress') {
      result = result.filter(v => inProgressSet.has(v.id));
    } else if (filter === 'bookmarked') {
      result = result.filter(v => isBookmarked(v.id));
    }

    if (sortNewest) {
      result = [...result].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return result;
  }, [videos, searchQuery, sectionFilter, filter, watched, inProgressSet, isBookmarked, sortNewest]);

  const handleVideoClick = (video: VideoRow) => {
    setPlayingVideo(video);
    setCurrentTime(0);
    setVideoDuration(0);
    setPlaybackRate(1);
    autoMarkedRef.current = null;
  };

  const handleMarkAsWatched = async (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video || !video.duration) return;

    const minutes = parseDurationToMinutes(video.duration);
    const seconds = Math.round(minutes * 60);
    await markAsWatched(videoId, seconds);
    toast.success('Video marked as watched');
  };

  const totalMinutesWatched = useMemo(() => {
    return Object.values(progress).reduce((acc, p) => {
      return acc + (p.total_duration_seconds / 60);
    }, 0);
  }, [progress]);

  const videoCounts = {
    all: videos.length,
    watched: watched.size,
    unwatched: videos.length - watched.size - inProgressSet.size,
    inProgress: inProgressSet.size,
    bookmarked: bookmarks.size,
  };

  useEffect(() => {
    if (!playingVideo || !videoDuration || !currentTime) return;
    
    const progressPercent = (currentTime / videoDuration) * 100;
    if (progressPercent >= 90 && autoMarkedRef.current !== playingVideo.id) {
      autoMarkedRef.current = playingVideo.id;
      markAsWatched(playingVideo.id, Math.round(videoDuration));
      toast.success('Video completed!');
    }
  }, [currentTime, videoDuration, playingVideo, markAsWatched]);

  if (isLoading || bookmarksLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="h-48 bonus-glass rounded-lg animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bonus-glass rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-72 bonus-glass rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bonus-glass rounded-2xl p-8 md:p-12 border border-border/40"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/10 animate-gradient" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/50">
                <Play className="h-6 w-6 text-white" />
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 animate-pulse">
                <Sparkles className="h-3 w-3 mr-1" />
                {videos.length} Videos Available
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Video Learning Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Master essential skills through our comprehensive video library. Track your progress and continue where you left off.
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <VideoStatsCards
          totalVideos={videos.length}
          watchedCount={watched.size}
          inProgressCount={inProgressSet.size}
          totalMinutesWatched={Math.round(totalMinutesWatched)}
        />

        {/* Filters */}
        <VideoCategoryTabs
          sections={sections}
          sectionFilter={sectionFilter}
          setSectionFilter={setSectionFilter}
          filter={filter}
          setFilter={setFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortNewest={sortNewest}
          setSortNewest={setSortNewest}
          videoCounts={videoCounts}
        />

        {/* Videos Grid */}
        <AnimatePresence mode="wait">
          {filteredVideos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                icon={Play}
                title="No videos found"
                description="Try adjusting your filters or search query"
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                'grid gap-6',
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              )}
            >
              {filteredVideos.map((video, index) => {
                const progressPercent = getProgressPercentage(video.id);
                const isWatched = watched.has(video.id);
                const inProgress = inProgressSet.has(video.id);
                const bookmarked = isBookmarked(video.id);

                return (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bonus-glass border-border/40 overflow-hidden group hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
                      <div className="relative aspect-video bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
                        {video.thumbnail_url ? (
                          <img 
                            src={video.thumbnail_url} 
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Play className="h-12 w-12 text-muted-foreground/50" />
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleVideoClick(video)}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <div className="h-16 w-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-primary/50">
                            <Play className="h-8 w-8 text-white ml-1" />
                          </div>
                        </motion.button>

                        <div className="absolute top-3 left-3 flex gap-2">
                          {isWatched && (
                            <Badge className="bg-green-500/90 text-white border-0 shadow-lg">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                          {inProgress && !isWatched && (
                            <Badge className="bg-orange-500/90 text-white border-0 shadow-lg">
                              <Clock className="h-3 w-3 mr-1" />
                              In Progress
                            </Badge>
                          )}
                          {video.locked && (
                            <Badge className="bg-yellow-500/90 text-white border-0 shadow-lg">
                              <Lock className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleBookmark(video.id)}
                          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-colors"
                        >
                          {bookmarked ? (
                            <BookmarkCheck className="h-4 w-4 text-primary" />
                          ) : (
                            <Bookmark className="h-4 w-4 text-muted-foreground" />
                          )}
                        </motion.button>

                        {progressPercent > 0 && progressPercent < 100 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/20">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercent}%` }}
                              className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                            />
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                            {video.title}
                          </h3>
                        </div>

                        {video.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {video.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          {video.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {video.duration}
                            </div>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {getSectionDisplay(video.section).icon} {getSectionDisplay(video.section).name}
                          </Badge>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => handleVideoClick(video)}
                            className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 transition-all"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {inProgress ? 'Continue' : 'Watch'}
                          </Button>
                          {!isWatched && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsWatched(video.id)}
                              className="bonus-glass border-border/40"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Player Modal */}
        <Dialog open={!!playingVideo} onOpenChange={() => setPlayingVideo(null)}>
          <DialogContent className="max-w-6xl w-[98vw] sm:w-[95vw] h-[98vh] sm:h-[90vh] p-0 overflow-hidden bg-gradient-to-br from-background via-background/95 to-background border-border shadow-2xl">
            <div className="h-full flex flex-col">
              <DialogHeader className="p-3 sm:p-4 md:p-6 pr-14 bg-gradient-to-r from-card/95 via-card/90 to-card/95 backdrop-blur-xl border-b border-border">
                <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-base sm:text-lg md:text-xl font-bold text-foreground line-clamp-1">
                      {playingVideo?.title}
                    </DialogTitle>
                    {playingVideo?.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mt-0.5">
                        {playingVideo.description}
                      </p>
                    )}
                  </div>
                  <Badge className="mr-10 bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                    <Eye className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">{Math.round(getProgressPercentage(playingVideo?.id || ''))}% Watched</span>
                    <span className="sm:hidden">{Math.round(getProgressPercentage(playingVideo?.id || ''))}%</span>
                  </Badge>
                </div>
              </DialogHeader>

              <div className="flex-1 relative bg-black">
                {playingVideo && (
                  <OptimizedYouTubePlayer
                    videoUrl={playingVideo.video_url}
                    videoId={playingVideo.id}
                    thumbnail={playingVideo.thumbnail_url || undefined}
                    onTimeUpdate={(time, duration) => {
                      setCurrentTime(time);
                      setVideoDuration(duration);
                      if (time > 0 && duration > 0) {
                        updateProgress(playingVideo.id, Math.round(time), Math.round(duration));
                      }
                    }}
                    onPlaybackRateChange={setPlaybackRate}
                    playbackRate={playbackRate}
                  />
                )}
              </div>

              <div className="p-2 sm:p-3 md:p-4 bg-gradient-to-r from-card/95 via-card/90 to-card/95 backdrop-blur-xl border-t border-border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
                  {/* Time Display and CC Attribution */}
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}</span>
                      <span>/</span>
                      <span>{Math.floor(videoDuration / 60)}:{String(Math.floor(videoDuration % 60)).padStart(2, '0')}</span>
                    </div>
                    
                    {/* CC Attribution - Compact */}
                    {playingVideo?.license_type && playingVideo.license_type !== 'Standard' && (
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs">
                        <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-400/40 rounded font-medium">
                          {playingVideo.license_type}
                        </span>
                        {playingVideo.creator_name && (
                          <span className="text-muted-foreground">
                            by <span className="text-foreground font-medium">{playingVideo.creator_name}</span>
                          </span>
                        )}
                        {playingVideo.original_url && (
                          <a
                            href={playingVideo.original_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Original
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Speed:</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                        <Button
                          key={rate}
                          size="sm"
                          variant={playbackRate === rate ? 'default' : 'outline'}
                          onClick={() => setPlaybackRate(rate)}
                          className={cn(
                            'h-6 sm:h-7 px-1.5 sm:px-2 text-xs transition-all',
                            playbackRate === rate && 'bg-primary text-primary-foreground shadow-lg shadow-primary/50'
                          )}
                        >
                          {rate}x
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Progress
                    value={(currentTime / videoDuration) * 100 || 0}
                    className="h-1.5 sm:h-2 bg-muted/20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-50 animate-pulse pointer-events-none" />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
