import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Play, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ReactPlayer from 'react-player';
import { BonusData, BonusCategory } from '@/types/bonus';

const CollectionDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<BonusData | null>(null);

  const { data: collection, isLoading: loadingCollection } = useQuery({
    queryKey: ['collection', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_collections')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: videos = [], isLoading: loadingVideos } = useQuery({
    queryKey: ['collection-videos', collection?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bonuses')
        .select('*')
        .eq('collection_id', collection!.id)
        .eq('category', 'video')
        .is('archived_at', null)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((item): BonusData => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category as BonusCategory,
        thumbnail: item.thumbnail || undefined,
        duration: item.duration || undefined,
        locked: item.locked || false,
        completed: item.completed || false,
        progress: item.progress || 0,
        isNew: item.is_new || false,
        tags: item.tags || [],
        videoUrl: item.view_url || undefined,
      }));
    },
    enabled: !!collection?.id,
  });

  const isLoading = loadingCollection || loadingVideos;

  const parseDuration = (duration?: string): number => {
    if (!duration) return 0;
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const getCardSize = (duration?: string) => {
    const mins = parseDuration(duration);
    if (mins < 5) return 'compact';
    if (mins > 20) return 'large';
    return 'standard';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-[env(safe-area-inset-top)]">
        <div className="p-4 space-y-4">
          <div className="h-10 w-32 bg-muted animate-pulse rounded-lg" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-video bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Collection not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background pt-[env(safe-area-inset-top)]">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="flex items-center gap-3 p-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">{collection.name}</h1>
              <p className="text-sm text-muted-foreground">{videos.length} videos</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {collection.description && (
          <div className="px-4 py-3">
            <p className="text-sm text-muted-foreground">{collection.description}</p>
          </div>
        )}

        {/* Video Grid */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {videos.map((video, index) => {
              const size = getCardSize(video.duration);
              
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={size === 'large' ? 'col-span-2' : ''}
                >
                  <button
                    onClick={() => !video.locked && setSelectedVideo(video)}
                    disabled={video.locked}
                    className="w-full text-left group"
                  >
                    <div className={`relative rounded-xl overflow-hidden bg-muted ${
                      size === 'large' ? 'aspect-video' : 'aspect-video'
                    }`}>
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <Play className="w-8 h-8 text-primary/50" />
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                      {/* Play button */}
                      {!video.locked && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                            <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                          </div>
                        </div>
                      )}

                      {/* Duration badge */}
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm">
                          <span className="text-xs font-medium text-white">{video.duration}</span>
                        </div>
                      )}

                      {/* Locked overlay */}
                      {video.locked && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Lock className="w-6 h-6 text-white/70" />
                        </div>
                      )}

                      {/* New badge */}
                      {video.isNew && !video.locked && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary">
                          <span className="text-[10px] font-bold text-primary-foreground">NEW</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 space-y-0.5">
                      <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      {size === 'large' && video.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {videos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No videos in this collection yet</p>
            </div>
          )}
        </div>

        {/* Video Player Dialog */}
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="max-w-4xl w-full p-0 bg-black border-none">
            <div className="aspect-video w-full">
              {selectedVideo?.videoUrl && (
                <ReactPlayer
                  url={selectedVideo.videoUrl}
                  width="100%"
                  height="100%"
                  controls
                  playing
                  config={{
                    youtube: {
                      playerVars: {
                        modestbranding: 1,
                        rel: 0,
                      },
                    },
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default CollectionDetail;
