import { useEffect, useMemo, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Import useQueryClient
import { MainLayout } from '@/components/Layout/MainLayout'; // Assumindo export nomeado
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'; // Import Dialog components
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Loader2, Bookmark, BookmarkCheck, CheckCircle, Info, Play, Search, Video as VideoIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VideoCardSkeletonList } from '@/components/Skeletons/VideoCardSkeleton'; // Assumindo export nomeado
import { useVideoProgress } from '@/hooks/useVideoProgress';
import { EmptyState } from '@/components/common/EmptyState'; // Assumindo export nomeado
import { useAuth } from '@/contexts/AuthContext'; // Importa useAuth
import { OptimizedYouTubePlayer } from '@/components/VideoPlayer/OptimizedYouTubePlayer';

type VideoRow = Database['public']['Tables']['videos']['Row'];
type FilterType = 'all' | 'watched' | 'unwatched' | 'in-progress';

// Section display names and icons
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

// Função para buscar vídeos (usada com React Query)
const fetchVideos = async () => {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Failed to load videos', error);
    throw new Error('Failed to load videos'); // React Query prefere que erros sejam lançados
  }
  return data ?? [];
};

const parseDurationToMinutes = (duration: string | null): number => {
  if (!duration) return 0;
  const parts = duration.split(':');
  if (parts.length < 2) return 0; // Formato inválido
  const minutes = Number(parts[0]) || 0;
  const seconds = Number(parts[1]) || 0;
  return minutes + seconds / 60;
};

export default function Videos() {
  const { user } = useAuth(); // Obtém o usuário autenticado
  const queryClient = useQueryClient(); // Para invalidação de cache se necessário

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('all'); // NEW: Section filter
  // Load bookmarks from localStorage
  const [bookmarked, setBookmarked] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    const saved = localStorage.getItem('video-bookmarks');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [playingVideo, setPlayingVideo] = useState<VideoRow | null>(null);
  const [infoVideo, setInfoVideo] = useState<VideoRow | null>(null); // For More Info modal

  // Player state
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Track if we've auto-marked the current video as watched
  const autoMarkedRef = useRef<string | null>(null);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('video-bookmarks', JSON.stringify(Array.from(bookmarked)));
  }, [bookmarked]);

  // --- React Query para buscar vídeos ---
  const { data: videos = [], isLoading, error } = useQuery<VideoRow[]>({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    onError: () => {
      toast.error("Failed to load videos");
    }
  });

  // --- Hook de Progresso ---
  const {
    progress, // Map<videoId, VideoProgress>
    markAsWatched,
    updateProgress,
    getProgress,
    isCompleted,
    isInProgress: checkIsInProgress,
    loading: isLoadingProgressHook
  } = useVideoProgress(); // NÃO passa userId - o hook usa AuthContext

  // --- Estados Derivados do Progresso ---
  const watched = useMemo(() => {
    const watchedSet = new Set<string>();
    progress.forEach((data, videoId) => {
      if (data.completed) {
        watchedSet.add(videoId);
      }
    });
    return watchedSet;
  }, [progress]);

  const inProgress = useMemo(() => {
    const inProgressSet = new Set<string>();
    progress.forEach((data, videoId) => {
      if (!data.completed && data.progress_seconds > 0) {
        inProgressSet.add(videoId);
      }
    });
    return inProgressSet;
  }, [progress]);

  // --- Vídeo em Destaque ---
  const featuredVideo = useMemo(() => {
    if (!videos || videos.length === 0) return null;
    // Tenta encontrar o primeiro vídeo em progresso
    const firstInProgress = videos.find(v => inProgress.has(v.id));
    if (firstInProgress) return firstInProgress;
    // Senão, tenta encontrar o primeiro não assistido
    const firstUnwatched = videos.find(v => !watched.has(v.id) && !inProgress.has(v.id));
    if (firstUnwatched) return firstUnwatched;
    // Senão, pega o primeiro vídeo da lista
    return videos[0];
  }, [videos, watched, inProgress]);

  // --- Lógica de Filtragem ---
  const sections = useMemo(() => Array.from(new Set(videos.map((video) => video.section || 'Geral'))), [videos]);

  const filteredVideos = useMemo(() => videos.filter((video) => {
    const isWatched = watched.has(video.id);
    const isInProg = inProgress.has(video.id);

    // Filtro de Busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        video.title.toLowerCase().includes(query) ||
        video.description?.toLowerCase().includes(query) ||
        (video.section || '').toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Filtro de Seção
    if (sectionFilter !== 'all') {
      if ((video.section || 'Geral') !== sectionFilter) return false;
    }

    // Filtro de Status
    switch (filter) {
      case 'watched': return isWatched;
      case 'unwatched': return !isWatched && !isInProg;
      case 'in-progress': return isInProg;
      case 'all':
      default: return true;
    }
  }), [videos, searchQuery, sectionFilter, filter, watched, inProgress]);

  // --- Cálculos de Progresso Total ---
  const totalVideos = videos.length;
  const watchedCount = watched.size;
  const progressPercentage = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;
  const totalMinutesWatched = useMemo(() => {
    return Array.from(watched).reduce((acc, videoId) => {
      const video = videos.find((item) => item.id === videoId);
      return acc + parseDurationToMinutes(video?.duration ?? null);
    }, 0);
  }, [watched, videos]);

  // --- Funções de Manipulação ---
  const toggleBookmark = (videoId: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(videoId)) {
        next.delete(videoId);
        toast.success("Removed from saved");
      } else {
        next.add(videoId);
        toast.success("Saved to watch later");
      }
      return next;
    });
  };

  const handleVideoClick = (video: VideoRow) => {
    setPlayingVideo(video);
    // Não precisa mais setar inProgress aqui, o player fará isso via handleProgress
  };

  const handleMarkAsWatched = async (videoId: string) => {
    if (!user?.id) return;

    const video = videos.find(v => v.id === videoId);
    if (!video?.duration) {
      toast.error("Cannot mark as watched: video duration not found");
      return;
    }

    // Parse duration to seconds (format: "MM:SS")
    const durationSeconds = parseDurationToMinutes(video.duration) * 60;

    try {
      await markAsWatched(videoId, durationSeconds);
      toast.success("Video marked as watched!");
    } catch (err) {
      console.error("Failed to mark as watched", err);
      toast.error("Failed to mark as watched");
    }
  };

  const getSectionProgress = (section: string) => {
    const sectionVideos = videos.filter((video) => (video.section || 'Geral') === section);
    const completed = sectionVideos.filter((video) => watched.has(video.id)).length;
    return { completed, total: sectionVideos.length };
  };

  const getProgressPercentageForVideo = (videoId: string): number => {
    const progressData = progress.get(videoId);
    const video = videos.find(v => v.id === videoId);
    const durationMinutes = parseDurationToMinutes(video?.duration ?? null);
    if (!progressData || durationMinutes <= 0 || progressData.completed) {
        return progressData?.completed ? 100 : 0;
    }
    const durationSeconds = durationMinutes * 60;
    return Math.min(100, Math.round((progressData.progress_seconds / durationSeconds) * 100));
  };

  // Reset auto-marked ref when video changes
  useEffect(() => {
    if (playingVideo) {
      autoMarkedRef.current = null;
    }
  }, [playingVideo?.id]);

  // Auto-mark as watched when reaching 90%
  useEffect(() => {
    if (!playingVideo || videoDuration === 0) return;

    const liveProgress = (currentTime / videoDuration) * 100;

    // Only auto-mark if:
    // 1. Progress >= 90%
    // 2. Not already marked as watched
    // 3. We haven't already auto-marked this video in this session
    if (
      liveProgress >= 90 &&
      !watched.has(playingVideo.id) &&
      autoMarkedRef.current !== playingVideo.id
    ) {
      autoMarkedRef.current = playingVideo.id;
      handleMarkAsWatched(playingVideo.id);
    }
  }, [currentTime, videoDuration, playingVideo, watched, handleMarkAsWatched]);

  return (
    <MainLayout fullWidth={true}>
      <div>
        {/* Featured Video Hero Section - Mantido */}
        {featuredVideo && !isLoading && (
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full overflow-hidden group">
            <div className="absolute inset-0">
              {featuredVideo.thumbnail_url ? (
                <img
                  src={featuredVideo.thumbnail_url}
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = '/placeholder.svg')} // Fallback image
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center">
                   <VideoIcon className="w-24 h-24 text-white/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 space-y-4 max-w-2xl">
              {/* Only show watched badge if completed */}
              {watched.has(featuredVideo.id) && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600/90 text-white backdrop-blur-sm text-xs font-medium px-2 py-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Watched
                  </Badge>
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                {featuredVideo.title}
              </h1>

              {/* Progress bar - more contrast */}
              {inProgress.has(featuredVideo.id) && !watched.has(featuredVideo.id) && (
                <div className="space-y-1.5">
                  <div className="h-2 bg-black/40 rounded-full overflow-hidden backdrop-blur-sm ring-1 ring-white/20">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${getProgressPercentageForVideo(featuredVideo.id)}%` }}
                    />
                  </div>
                  <p className="text-sm text-white/90 font-medium">
                    {getProgressPercentageForVideo(featuredVideo.id)}% complete
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 text-white/80 text-sm">
                <span>{featuredVideo.duration || 'N/A'}</span>
                {featuredVideo.section && (
                  <>
                    <span>•</span>
                    <span>{getSectionDisplay(featuredVideo.section).name}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 font-semibold"
                  onClick={() => handleVideoClick(featuredVideo)}
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  {inProgress.has(featuredVideo.id)
                    ? `Continue (${Math.floor((parseDurationToMinutes(featuredVideo.duration || '0:00') * 60 * (1 - getProgressPercentageForVideo(featuredVideo.id) / 100)) / 60)}:${String(Math.floor((parseDurationToMinutes(featuredVideo.duration || '0:00') * 60 * (1 - getProgressPercentageForVideo(featuredVideo.id) / 100)) % 60)).padStart(2, '0')})`
                    : "Watch Now"}
                </Button>
                {/* More Info Button */}
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => setInfoVideo(featuredVideo)}
                >
                  <Info className="w-5 h-5 mr-2" />
                  {"More Info"}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm"
                  onClick={(e) => { e.stopPropagation(); toggleBookmark(featuredVideo.id); }}
                >
                  {bookmarked.has(featuredVideo.id) ? (
                    <BookmarkCheck className="w-5 h-5" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
         {isLoading && ( // Skeleton para o Hero
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full overflow-hidden bg-gray-200 animate-pulse">
                 <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 space-y-4 max-w-2xl">
                    <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                     <div className="h-4 bg-gray-300 rounded w-5/6 mb-3"></div>
                    <div className="h-5 bg-gray-300 rounded w-1/3 mb-4"></div>
                     <div className="flex gap-3 pt-2">
                        <div className="h-12 bg-gray-300 rounded w-36"></div>
                        <div className="h-12 bg-gray-300 rounded w-40"></div>
                         <div className="h-12 bg-gray-300 rounded w-12"></div>
                     </div>
                 </div>
            </div>
         )}

        {/* Controls Section */}
        <div className="px-4 sm:px-6 lg:px-8 space-y-6 mt-6">
          {/* Simplified progress - just count */}
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-sm font-medium text-foreground">
              {watchedCount} of {totalVideos} videos
            </span>
            {/* Visual progress bar */}
            <div className="flex-1 max-w-xs ml-4">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sticky Tabs - Status Filters */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b pb-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
                disabled={isLoading}
                className={filter === 'all' ? '' : 'text-muted-foreground'}
              >
                All
              </Button>
              <Button
                variant={filter === 'unwatched' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('unwatched')}
                disabled={isLoading}
                className={filter === 'unwatched' ? '' : 'text-muted-foreground'}
              >
                Unwatched
                {videos.filter(v => !watched.has(v.id) && !inProgress.has(v.id)).length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs px-1.5">
                    {videos.filter(v => !watched.has(v.id) && !inProgress.has(v.id)).length}
                  </Badge>
                )}
              </Button>
              <Button
                variant={filter === 'in-progress' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('in-progress')}
                disabled={isLoading}
                className={filter === 'in-progress' ? '' : 'text-muted-foreground'}
              >
                In Progress
                {inProgress.size > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs px-1.5">
                    {inProgress.size}
                  </Badge>
                )}
              </Button>
              <Button
                variant={filter === 'watched' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('watched')}
                disabled={isLoading}
                className={filter === 'watched' ? '' : 'text-muted-foreground'}
              >
                Watched
                {watched.size > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs px-1.5">
                    {watched.size}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Search and Section Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Section Filter */}
            <div className="flex-shrink-0">
              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                className="h-11 px-4 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[200px]"
                disabled={isLoading}
              >
                <option value="all">All Sections</option>
                {sections.map((section) => {
                  const display = getSectionDisplay(section);
                  return (
                    <option key={section} value={section}>
                      {display.icon} {display.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="px-4 sm:px-6 lg:px-8 mt-6">
            <VideoCardSkeletonList count={6} />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && videos.length === 0 && !error && (
            <div className="px-4 sm:px-6 lg:px-8 mt-10">
               <EmptyState
                    title={"No videos available"}
                    message={"Check back later or contact support if you think this is an error."}
                    icon={VideoIcon}
               />
            </div>
        )}
        {!isLoading && filteredVideos.length === 0 && videos.length > 0 && !error && (
             <div className="px-4 sm:px-6 lg:px-8 mt-10">
                 <EmptyState
                     title={"No videos found"}
                     message={"Try adjusting your filters or search term."}
                     icon={Search}
                 />
             </div>
        )}

        {/* Video Sections (Netflix-style) - Mantido */}
        {!isLoading && !error && sections.map((section) => {
          const sectionVideos = filteredVideos.filter((video) => (video.section || 'Geral') === section);
          if (sectionVideos.length === 0) return null;

          const { completed, total } = getSectionProgress(section);

          const sectionProgress = total > 0 ? (completed / total) * 100 : 0;
          const sectionDisplay = getSectionDisplay(section);

          // Create dot indicators
          const dots = Array.from({ length: total }, (_, i) => i < completed);

          return (
            <div key={section} className="space-y-3 mt-6">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{sectionDisplay.icon}</span>
                    <h2 className="text-2xl font-bold">{sectionDisplay.name}</h2>
                    {completed === total && total > 0 && (
                      <Badge className="bg-green-600/90 text-white text-xs px-2 py-1">
                        <CheckCircle className="w-3 h-3 mr-1" />Complete
                      </Badge>
                    )}
                  </div>
                  {/* Visual progress dots with count */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {dots.map((isCompleted, i) => (
                        <div
                          key={i}
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${
                            isCompleted ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {completed}/{total}
                    </span>
                  </div>
                </div>
                {/* Progress bar for section */}
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${sectionProgress}%` }}
                  />
                </div>
              </div>

              <VideoRow>
                {sectionVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    isWatched={watched.has(video.id)}
                    isInProgress={inProgress.has(video.id)}
                    isBookmarked={bookmarked.has(video.id)}
                    progressPercent={getProgressPercentageForVideo(video.id)}
                    onPlay={() => handleVideoClick(video)}
                    onMarkWatched={() => handleMarkAsWatched(video.id)}
                    onToggleBookmark={() => toggleBookmark(video.id)}
                  />
                ))}
              </VideoRow>
            </div>
          );
        })}
      </div>

      {/* --- Player Modal --- */}
      <Dialog open={!!playingVideo} onOpenChange={(open) => !open && setPlayingVideo(null)}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 border-0 bg-black">
          <DialogHeader className="sr-only">
            <DialogTitle>{playingVideo?.title || 'Video Player'}</DialogTitle>
            <DialogDescription>Watch video</DialogDescription>
          </DialogHeader>

          {playingVideo && user && (() => {
            const currentIndex = videos.findIndex(v => v.id === playingVideo.id);
            const nextVideo = currentIndex < videos.length - 1 ? videos[currentIndex + 1] : null;
            const videoProgress = getProgressPercentageForVideo(playingVideo.id);

            // Format time helper
            const formatTime = (seconds: number) => {
              const mins = Math.floor(seconds / 60);
              const secs = Math.floor(seconds % 60);
              return `${mins}:${secs.toString().padStart(2, '0')}`;
            };

            // Calculate progress percentage from current time
            const liveProgress = videoDuration > 0 ? (currentTime / videoDuration) * 100 : videoProgress;

            return (
              <>
                {/* Title and Context - Top */}
                <div className="px-4 pt-4 pb-2 bg-black">
                  <h3 className="text-base font-semibold text-white mb-1">
                    {playingVideo.title}
                  </h3>
                  <p className="text-xs text-white/60">
                    Video {currentIndex + 1} of {videos.length}
                    {playingVideo.section && (
                      <> • {getSectionDisplay(playingVideo.section).name}</>
                    )}
                  </p>
                </div>

                {/* Player */}
                <div className="relative">
                  <OptimizedYouTubePlayer
                    videoUrl={playingVideo.video_url}
                    videoId={playingVideo.id}
                    thumbnail={playingVideo.thumbnail_url || undefined}
                    playbackRate={playbackRate}
                    onTimeUpdate={(current, duration) => {
                      setCurrentTime(current);
                      setVideoDuration(duration);
                    }}
                    onPlaybackRateChange={(rate) => setPlaybackRate(rate)}
                  />
                </div>

                {/* Enhanced Progress Bar */}
                <div className="px-4 py-3 bg-black space-y-2">
                  {/* Progress bar - thicker (8px) with percentage */}
                  <div className="relative">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${liveProgress}%` }}
                      />
                    </div>
                    {videoDuration > 0 && (
                      <span className="absolute -right-12 -top-0.5 text-sm text-white/60 font-medium">
                        {Math.round(liveProgress)}%
                      </span>
                    )}
                  </div>

                  {/* Time display - larger text */}
                  {videoDuration > 0 && (
                    <div className="flex justify-between text-sm text-white/60 font-medium">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(videoDuration)}</span>
                    </div>
                  )}
                </div>

                {/* Speed Controls */}
                <div className="px-4 py-2 bg-black border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60">⚡ Speed:</span>
                    {[1, 1.25, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackRate(speed)}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          playbackRate === speed
                            ? 'bg-primary text-white font-medium'
                            : 'bg-white/10 text-white/60 hover:bg-white/20'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions and Next Video */}
                <div className="p-4 bg-black space-y-3">
                  {/* Complete Video Button - 80% width centered */}
                  {!watched.has(playingVideo.id) && liveProgress < 90 && (
                    <div className="flex justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsWatched(playingVideo.id)}
                        className="w-4/5 border-white/20 text-white hover:bg-white/10"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Video
                      </Button>
                    </div>
                  )}

                  {/* Up Next Preview - Larger thumbnail */}
                  {nextVideo && (
                    <div className="border-t border-white/10 pt-3">
                      <p className="text-xs text-white/60 mb-2">
                        Up Next: Video {currentIndex + 2} of {videos.length}
                      </p>
                      <div
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                        onClick={() => handleVideoClick(nextVideo)}
                      >
                        {nextVideo.thumbnail_url && (
                          <img
                            src={nextVideo.thumbnail_url}
                            alt={nextVideo.title}
                            className="w-[100px] h-[60px] object-cover rounded flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-base text-white font-semibold line-clamp-2 mb-1 leading-tight">
                            {nextVideo.title}
                          </p>
                          <p className="text-xs text-white/60">
                            {nextVideo.duration}
                            {nextVideo.section && (
                              <> • <span className="px-1.5 py-0.5 rounded bg-white/10">{getSectionDisplay(nextVideo.section).name}</span></>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
      {/* --- END Player Modal --- */}

      {/* --- More Info Modal --- */}
      <Dialog open={!!infoVideo} onOpenChange={(open) => !open && setInfoVideo(null)}>
        <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto p-0">
          {infoVideo && (
            <div className="flex flex-col">
              <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
                <DialogTitle className="text-xl sm:text-2xl font-bold pr-8">{infoVideo.title}</DialogTitle>
                <DialogDescription className="sr-only">Video information</DialogDescription>
              </DialogHeader>

              {/* Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {infoVideo.thumbnail_url ? (
                  <img
                    src={infoVideo.thumbnail_url}
                    alt={infoVideo.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                    <VideoIcon className="w-16 h-16 text-muted-foreground/50" />
                  </div>
                )}
                {/* Progress Indicator */}
                {inProgress.has(infoVideo.id) && (
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${getProgressPercentageForVideo(infoVideo.id)}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 px-4 pt-4 sm:px-6">
                <Button
                  size="lg"
                  className="flex-1 w-full"
                  onClick={() => {
                    setInfoVideo(null);
                    handleVideoClick(infoVideo);
                  }}
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  {inProgress.has(infoVideo.id) ? "Continue Watching" : "Watch Now"}
                </Button>
                <div className="flex gap-2 sm:gap-3">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    onClick={() => toggleBookmark(infoVideo.id)}
                  >
                    {bookmarked.has(infoVideo.id) ? (
                      <>
                        <BookmarkCheck className="w-5 h-5 sm:mr-2" />
                        <span className="hidden sm:inline">Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-5 h-5 sm:mr-2" />
                        <span className="hidden sm:inline">Save</span>
                      </>
                    )}
                  </Button>
                  {!watched.has(infoVideo.id) && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 sm:flex-none"
                      onClick={() => handleMarkAsWatched(infoVideo.id)}
                    >
                      <CheckCircle className="w-5 h-5 sm:mr-2" />
                      <span className="hidden sm:inline">Mark Watched</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Video Info */}
              <div className="space-y-4 p-4 sm:p-6 border-t">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {watched.has(infoVideo.id) && (
                    <Badge className="bg-green-500 text-white text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Watched
                    </Badge>
                  )}
                  {inProgress.has(infoVideo.id) && !watched.has(infoVideo.id) && (
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                      In Progress ({getProgressPercentageForVideo(infoVideo.id)}%)
                    </Badge>
                  )}
                  {infoVideo.premium_only && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                      Premium
                    </Badge>
                  )}
                  {infoVideo.section && (
                    <Badge variant="secondary" className="text-xs capitalize">
                      {infoVideo.section}
                    </Badge>
                  )}
                  {infoVideo.duration && (
                    <Badge variant="outline" className="text-xs">
                      {infoVideo.duration}
                    </Badge>
                  )}
                </div>

                {/* Description */}
                {infoVideo.description && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">About this video</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {infoVideo.description}
                    </p>
                  </div>
                )}

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Status</p>
                    <p className="text-sm font-semibold">
                      {watched.has(infoVideo.id)
                        ? "Completed"
                        : inProgress.has(infoVideo.id)
                        ? "In Progress"
                        : "Not Started"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Duration</p>
                    <p className="text-sm font-semibold">{infoVideo.duration || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* --- END More Info Modal --- */}
    </MainLayout>
  );
}

// --- Video Row Component with Scroll Navigation ---
interface VideoRowProps {
  children: React.ReactNode;
}

function VideoRow({ children }: VideoRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        scrollEl.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative group/row">
      {/* Left Scroll Button */}
      {canScrollLeft && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-full max-h-[200px] w-12 bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 rounded-l-md"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
      )}

      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-3 pb-2">{children}</div>
      </div>

      {/* Right Scroll Button */}
      {canScrollRight && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-full max-h-[200px] w-12 bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 rounded-r-md"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      )}
    </div>
  );
}

// --- Componente VideoCard Interno (Mantido e Melhorado) ---
interface VideoCardProps {
  video: VideoRow;
  isWatched: boolean;
  isInProgress: boolean;
  isBookmarked: boolean;
  progressPercent: number; // Progresso de 0 a 100
  onPlay: () => void;
  onMarkWatched: () => void;
  onToggleBookmark: () => void;
}

function VideoCard({
  video,
  isWatched,
  isInProgress,
  isBookmarked,
  progressPercent,
  onPlay,
  onMarkWatched,
  onToggleBookmark,
}: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const showProgressBar = progressPercent > 0 && progressPercent < 100;

  return (
    <div
      className="relative flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] group cursor-pointer tap-highlight-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onPlay}
      role="button"
      tabIndex={0}
      aria-label={`Watch ${video.title}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onPlay(); }}
    >
      <Card className={cn(
        "overflow-hidden border bg-card text-card-foreground shadow-md transition-all duration-500 ease-out touch-target transform-gpu",
        isHovered && "shadow-2xl sm:scale-[1.05] z-10 ring-2 ring-primary/20"
      )}>
        {/* Thumbnail */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          {video.thumbnail_url ? (
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className={cn(
                "w-full h-full object-cover transition-all duration-500 ease-out",
                isHovered && "scale-110 brightness-75"
              )}
              loading="lazy"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
              <Play className="w-12 h-12 text-muted-foreground/50" />
            </div>
          )}

          {/* Overlay on Hover */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center transition-all duration-300 pointer-events-none",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            {/* Play button centered */}
            <div className={cn(
              "w-16 h-16 rounded-full bg-white flex items-center justify-center transform transition-all duration-300",
              isHovered ? "scale-100" : "scale-0"
            )}>
              <Play className="w-7 h-7 text-primary fill-current ml-1" />
            </div>
          </div>

          {/* Progress Bar - inside thumbnail as bottom overlay */}
          {showProgressBar && (
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Duration Badge - show if not watched and no progress */}
          {video.duration && !isWatched && !showProgressBar && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white/90 px-2 py-0.5 rounded text-xs font-medium backdrop-blur-sm">
              {video.duration}
            </div>
          )}

          {/* WATCHED Badge - clear green badge */}
          {isWatched && (
            <div className="absolute top-2 left-2 bg-green-600 px-2 py-1 rounded-md shadow-md backdrop-blur-sm">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-white" />
                <span className="text-[10px] font-semibold text-white uppercase tracking-wide">Watched</span>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            {/* Title - BIGGER and BOLDER (15px) */}
            <h3 className="font-bold text-[15px] leading-tight line-clamp-2 flex-1" title={video.title}>
              {video.title}
            </h3>
            {/* Bookmark Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10 -mt-1 -mr-1"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark();
              }}
              aria-label={isBookmarked ? "Remove from saved" : "Save for later"}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-primary" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Progress Indicator - Circular like bonuses */}
          {isInProgress && !isWatched && progressPercent > 0 && progressPercent < 100 && (
            <div className="flex items-center gap-3 pt-2">
              <div className="relative w-10 h-10">
                <svg className="transform -rotate-90 w-10 h-10">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 16}`}
                    strokeDashoffset={`${2 * Math.PI * 16 * (1 - progressPercent / 100)}`}
                    className="text-primary transition-all duration-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                  {Math.round(progressPercent)}%
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground">In Progress</p>
                <p className="text-[10px] text-muted-foreground">Continue watching</p>
              </div>
            </div>
          )}

          {/* Badges - very subtle or removed */}
          <div className="flex items-center justify-between pt-1">
             <div className="flex items-center gap-1.5 flex-wrap">
                {/* Premium badge - very subtle */}
                {video.premium_only && (
                  <span className="text-[10px] text-muted-foreground">Premium</span>
                )}
             </div>

             {/* Mark Watched Button - Simplified */}
             {!isWatched && (
                <Button
                   variant="ghost"
                   size="sm"
                   className="h-7 px-2 text-xs text-muted-foreground hover:text-green-600 hover:bg-green-100"
                    onClick={(e) => {
                       e.stopPropagation();
                       onMarkWatched();
                    }}
                    aria-label={"Mark as Watched"}
                 >
                   <CheckCircle className="w-3.5 h-3.5" />
                 </Button>
             )}
          </div>

        </div>
      </Card>
    </div>
  );
}

