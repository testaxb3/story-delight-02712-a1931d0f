import { useState, useEffect, useMemo } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Search, Play, CheckCircle2, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type VideoRow = Database['public']['Tables']['videos']['Row'];

const SECTIONS = [
  { id: 'all', label: 'All Videos', emoji: '📚' },
  { id: 'practice', label: 'Daily Practice', emoji: '🎯' },
  { id: 'mastery', label: 'Masterclass', emoji: '⚡' },
  { id: 'foundation', label: 'Foundations', emoji: '💡' },
];

export default function VideosCalAI() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [playingVideo, setPlayingVideo] = useState<VideoRow | null>(null);
  const [progress, setProgress] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    fetchVideos();
    if (user) fetchProgress();
  }, [user]);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (!error && data) {
      setVideos(data);
    }
    setLoading(false);
  };

  const fetchProgress = async () => {
    if (!user?.id) return;
    
    const { data } = await supabase
      .from('video_progress')
      .select('video_id, progress_percent')
      .eq('user_id', user.id);
    
    if (data) {
      const progressMap = new Map(data.map((p: any) => [p.video_id, p.progress_percent || 0]));
      setProgress(progressMap);
    }
  };

  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const matchesSearch = !searchQuery || 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSection = selectedSection === 'all' || video.section === selectedSection;
      return matchesSearch && matchesSection;
    });
  }, [videos, searchQuery, selectedSection]);

  const sectionCounts = useMemo(() => {
    return SECTIONS.reduce((acc, section) => {
      if (section.id === 'all') {
        acc[section.id] = videos.length;
      } else {
        acc[section.id] = videos.filter(v => v.section === section.id).length;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [videos]);

  const getVideoProgress = (videoId: string) => progress.get(videoId) || 0;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Videos</h1>
          <p className="text-muted-foreground">Expert guidance and practical demonstrations</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        {/* Sections */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {SECTIONS.map(section => (
            <Button
              key={section.id}
              variant={selectedSection === section.id ? "default" : "ghost"}
              onClick={() => setSelectedSection(section.id)}
              className="flex-shrink-0"
            >
              <span className="mr-2">{section.emoji}</span>
              {section.label}
              {sectionCounts[section.id] > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {sectionCounts[section.id]}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="h-64 animate-pulse bg-card/50" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map(video => {
              const videoProgress = getVideoProgress(video.id);
              const isCompleted = videoProgress >= 95;
              
              return (
                <Card
                  key={video.id}
                  className="overflow-hidden hover:bg-muted/5 transition-colors cursor-pointer bg-card border-border"
                  onClick={() => setPlayingVideo(video)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-muted">
                    <img
                      src={video.thumbnail_url || '/placeholder.svg'}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      {isCompleted ? (
                        <CheckCircle2 className="w-12 h-12 text-white" />
                      ) : (
                        <Play className="w-12 h-12 text-white" />
                      )}
                    </div>
                    {videoProgress > 0 && !isCompleted && (
                      <div className="absolute bottom-0 left-0 right-0">
                        <Progress value={videoProgress} className="h-1 rounded-none" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {video.section}
                      </Badge>
                      {video.duration && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {video.duration}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-medium line-clamp-2 mb-2">
                      {video.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Video Player Dialog */}
        <Dialog open={!!playingVideo} onOpenChange={() => setPlayingVideo(null)}>
          <DialogContent className="max-w-4xl p-0">
            {playingVideo && playingVideo.video_url && (
              <div className="aspect-video">
                <video
                  src={playingVideo.video_url}
                  controls
                  className="w-full h-full"
                  autoPlay
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
