import { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, Image as ImageIcon, Video, Plus, List, Sparkles, Crown, Lock } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { getBestYouTubeThumbnail, isValidYouTubeUrl } from '@/lib/youtube';

interface AdminVideosTabProps {
  onContentChanged?: () => void;
}

export function AdminVideosTab({ onContentChanged }: AdminVideosTabProps) {
  type Video = Database['public']['Tables']['videos']['Row'];

  const getSectionDisplay = (section: string): string => {
    const sectionMap: Record<string, string> = {
      'practice': '🎯 Daily Situations',
      'mastery': '⚡ Masterclass',
      'foundation': '💡 Foundations',
      'ages-1-2': '🎯 Ages 1-2',
      'ages-3-4': '⚡ Ages 3-4',
      'ages-5-plus': '💡 Ages 5+',
    };
    return sectionMap[section.toLowerCase()] || section;
  };

  const [videos, setVideos] = useState<Video[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    section: 'foundation',
    duration: '',
    videoUrl: '',
    thumbnailUrl: '',
    orderIndex: '0',
    premiumOnly: false,
    licenseType: 'Standard',
    creatorName: '',
    originalUrl: '',
    attributionRequired: false,
    verified: false,
  });
  const [loading, setLoading] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleteVideoId, setDeleteVideoId] = useState<string | null>(null);
  const [fetchingThumbnail, setFetchingThumbnail] = useState(false);

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      section: 'foundation',
      duration: '',
      videoUrl: '',
      thumbnailUrl: '',
      orderIndex: '0',
      premiumOnly: false,
      licenseType: 'Standard',
      creatorName: '',
      originalUrl: '',
      attributionRequired: false,
      verified: false,
    });
  };

  function getErrorMessage(error: unknown, fallback: string) {
    if (error && typeof error === 'object') {
      const message = 'message' in error ? (error as { message?: string }).message : undefined;
      const details = 'details' in error ? (error as { details?: string }).details : undefined;
      return [message, details].filter(Boolean).join(' ') || fallback;
    }

    return fallback;
  }

  const handleAutoFetchThumbnail = async () => {
    if (!form.videoUrl.trim()) {
      toast.error('Please enter a YouTube video URL first');
      return;
    }

    if (!isValidYouTubeUrl(form.videoUrl)) {
      toast.error('Invalid YouTube URL. Please use a valid YouTube video link');
      return;
    }

    setFetchingThumbnail(true);

    try {
      const thumbnailUrl = await getBestYouTubeThumbnail(form.videoUrl);

      if (thumbnailUrl) {
        setForm((prev) => ({ ...prev, thumbnailUrl }));
        toast.success('Thumbnail fetched successfully!');
      } else {
        toast.error('Could not fetch thumbnail from this video');
      }
    } catch (error) {
      console.error('Error fetching thumbnail:', error);
      toast.error('Failed to fetch thumbnail');
    } finally {
      setFetchingThumbnail(false);
    }
  };

  const fetchVideos = useCallback(async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      toast.error(getErrorMessage(error, 'Failed to load videos'));
      return;
    }

    setVideos((data as Video[]).map((video) => ({ ...video, premium_only: video.premium_only ?? false })));
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.duration.trim()) {
      toast.error('Title and duration are required');
      return;
    }

    // Validation for CC videos
    if (form.licenseType !== 'Standard' && form.attributionRequired) {
      if (!form.creatorName.trim()) {
        toast.error('Creator name is required for CC-BY videos');
        return;
      }
      if (!form.originalUrl.trim()) {
        toast.error('Original URL is required for CC-BY videos');
        return;
      }
      if (!form.verified) {
        toast.error('Please verify the license manually before submitting');
        return;
      }
    }

    setLoading(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      section: form.section,
      duration: form.duration.trim(),
      video_url: form.videoUrl.trim() || null,
      thumbnail_url: form.thumbnailUrl.trim() || null,
      order_index: Number(form.orderIndex) || 0,
      premium_only: form.premiumOnly,
      license_type: form.licenseType,
      creator_name: form.creatorName.trim() || null,
      original_url: form.originalUrl.trim() || null,
      attribution_required: form.attributionRequired,
      verified_date: form.verified ? new Date().toISOString() : null,
    };

    try {
      const { error } = await supabase.from('videos').insert(payload);

      if (error) {
        throw error;
      }

      toast.success('Video added!');
      await fetchVideos();
      onContentChanged?.();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, 'Failed to add video'));
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (video: Video) => {
    setEditingVideo(video);
    setForm({
      title: video.title,
      description: video.description || '',
      section: video.section,
      duration: video.duration,
      videoUrl: video.video_url || '',
      thumbnailUrl: video.thumbnail_url || '',
      orderIndex: String(video.order_index ?? 0),
      premiumOnly: video.premium_only ?? false,
      licenseType: video.license_type || 'Standard',
      creatorName: video.creator_name || '',
      originalUrl: video.original_url || '',
      attributionRequired: video.attribution_required ?? false,
      verified: !!video.verified_date,
    });
    setShowEditDialog(true);
  };

  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingVideo || !form.title.trim() || !form.duration.trim()) {
      toast.error('Title and duration are required');
      return;
    }

    // Validation for CC videos
    if (form.licenseType !== 'Standard' && form.attributionRequired) {
      if (!form.creatorName.trim()) {
        toast.error('Creator name is required for CC-BY videos');
        return;
      }
      if (!form.originalUrl.trim()) {
        toast.error('Original URL is required for CC-BY videos');
        return;
      }
      if (!form.verified) {
        toast.error('Please verify the license manually before submitting');
        return;
      }
    }

    setLoading(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      section: form.section,
      duration: form.duration.trim(),
      video_url: form.videoUrl.trim() || null,
      thumbnail_url: form.thumbnailUrl.trim() || null,
      order_index: Number(form.orderIndex) || 0,
      premium_only: form.premiumOnly,
      license_type: form.licenseType,
      creator_name: form.creatorName.trim() || null,
      original_url: form.originalUrl.trim() || null,
      attribution_required: form.attributionRequired,
      verified_date: form.verified ? new Date().toISOString() : null,
    };

    try {
      const { error } = await supabase
        .from('videos')
        .update(payload)
        .eq('id', editingVideo.id);

      if (error) {
        throw error;
      }

      toast.success('Video updated!');
      await fetchVideos();
      onContentChanged?.();
      setShowEditDialog(false);
      setEditingVideo(null);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, 'Failed to update video'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('videos').delete().eq('id', id);

    if (error) {
      toast.error(getErrorMessage(error, 'Failed to delete video'));
      return;
    }

    toast.success('Video deleted!');
    setDeleteVideoId(null);
    await fetchVideos();
    onContentChanged?.();
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-pink-950/30 border border-purple-100 dark:border-purple-900/50 shadow-lg">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg">
                  <Video className="w-7 h-7 text-white" />
                </div>
                Video Management
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Manage your educational video library with ease
              </p>
            </div>
            <div className="flex items-center gap-3 card-glass border rounded-xl px-4 py-3 shadow-sm">
              <div className="p-2 rounded-lg bg-primary/10">
                <List className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{videos.length}</div>
                <div className="text-xs font-medium text-muted-foreground">Total Videos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Video Form - Glass Morphism Card */}
      <div className="group relative rounded-2xl backdrop-premium shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl gradient-primary shadow-glow">
              <Plus className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Add New Video</h3>
          </div>

          <form onSubmit={handleAddVideo} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="video-title" className="text-sm font-semibold text-foreground">
                Video Title
              </Label>
              <Input
                id="video-title"
                placeholder="Enter video title"
                className="mt-1 bg-input border-border focus:border-ring focus:ring-ring/20 transition-all duration-200"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-description" className="text-sm font-semibold text-foreground">
                Description
              </Label>
              <Textarea
                id="video-description"
                placeholder="Brief description of the video content"
                className="mt-1 bg-input border-border focus:border-ring focus:ring-ring/20 transition-all duration-200 resize-none"
                rows={3}
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="video-section" className="text-sm font-semibold text-foreground">
                  Section
                </Label>
                <Select
                  value={form.section}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, section: value }))}
                >
                  <SelectTrigger className="mt-1 bg-input border-border focus:border-ring focus:ring-ring/20">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="foundation" className="focus:bg-accent">Foundations</SelectItem>
                    <SelectItem value="practice" className="focus:bg-purple-50 dark:focus:bg-purple-900/20">Daily Situations</SelectItem>
                    <SelectItem value="mastery" className="focus:bg-purple-50 dark:focus:bg-purple-900/20">Masterclass</SelectItem>
                    <SelectItem value="ages-1-2" className="focus:bg-purple-50 dark:focus:bg-purple-900/20">Ages 1-2</SelectItem>
                    <SelectItem value="ages-3-4" className="focus:bg-purple-50 dark:focus:bg-purple-900/20">Ages 3-4</SelectItem>
                    <SelectItem value="ages-5-plus" className="focus:bg-purple-50 dark:focus:bg-purple-900/20">Ages 5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-duration" className="text-sm font-semibold text-foreground">
                  Duration (MM:SS)
                </Label>
                <Input
                  id="video-duration"
                  placeholder="e.g., 12:30"
                  className="mt-1 bg-input border-border focus:border-ring focus:ring-ring/20 transition-all duration-200"
                  value={form.duration}
                  onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-url" className="text-sm font-semibold text-foreground">
                Video URL
              </Label>
              <Input
                id="video-url"
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-1 bg-input border-border focus:border-ring focus:ring-ring/20 transition-all duration-200"
                value={form.videoUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, videoUrl: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="thumbnail-url" className="text-sm font-semibold text-foreground">
                  Thumbnail URL
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoFetchThumbnail}
                  disabled={fetchingThumbnail || !form.videoUrl.trim()}
                  className="h-8 text-xs gradient-primary text-primary-foreground border-0 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <ImageIcon className="w-3 h-3 mr-1.5" />
                  {fetchingThumbnail ? 'Fetching...' : 'Auto-fetch from YouTube'}
                </Button>
              </div>
              <Input
                id="thumbnail-url"
                placeholder="https://... (or click Auto-fetch)"
                className="mt-1 bg-input border-border focus:border-ring focus:ring-ring/20 transition-all duration-200"
                value={form.thumbnailUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, thumbnailUrl: event.target.value }))}
              />
              {form.thumbnailUrl && (
                <div className="mt-3 group/thumb">
                  <div className="relative w-full max-w-xs overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-md group-hover/thumb:shadow-xl transition-all duration-300">
                    <img
                      src={form.thumbnailUrl}
                      alt="Thumbnail preview"
                      className="w-full h-auto group-hover/thumb:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="video-order" className="text-sm font-semibold text-foreground">
                Order Index
              </Label>
              <Input
                id="video-order"
                type="number"
                placeholder="0"
                className="mt-1 bg-input border-border focus:border-ring focus:ring-ring/20 transition-all duration-200"
                value={form.orderIndex}
                onChange={(event) => setForm((prev) => ({ ...prev, orderIndex: event.target.value }))}
              />
            </div>

            {/* Creative Commons License Section */}
            <div className="border-2 border-primary/20 rounded-xl p-4 space-y-4 bg-primary/5">
              <div className="flex items-center gap-2">
                <span className="text-lg">📄</span>
                <h3 className="font-semibold text-base text-foreground">Creative Commons License</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="license-type" className="text-sm font-semibold text-foreground">
                  License Type
                </Label>
                <Select 
                  value={form.licenseType} 
                  onValueChange={(value) => setForm({ 
                    ...form, 
                    licenseType: value,
                    attributionRequired: value !== 'Standard'
                  })}
                >
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select license" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="Standard">Standard YouTube License (Default)</SelectItem>
                    <SelectItem value="CC-BY">CC-BY (Attribution)</SelectItem>
                    <SelectItem value="CC-BY-SA">CC-BY-SA (Attribution ShareAlike)</SelectItem>
                    <SelectItem value="CC0">CC0 (Public Domain)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.attributionRequired && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="creator-name" className="text-sm font-semibold text-foreground">
                      Creator Name *
                    </Label>
                    <Input
                      id="creator-name"
                      value={form.creatorName}
                      onChange={(e) => setForm({ ...form, creatorName: e.target.value })}
                      placeholder="e.g., Sprouts"
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="original-url" className="text-sm font-semibold text-foreground">
                      Original Video URL *
                    </Label>
                    <Input
                      id="original-url"
                      value={form.originalUrl}
                      onChange={(e) => setForm({ ...form, originalUrl: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                    <Switch
                      id="verified-license"
                      checked={form.verified}
                      onCheckedChange={(checked) => setForm({ ...form, verified: checked })}
                    />
                    <Label htmlFor="verified-license" className="text-sm font-medium cursor-pointer">
                      I verified this video has a {form.licenseType} license
                    </Label>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-primary shadow-md">
                  <Crown className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <Label htmlFor="video-locked" className="text-sm font-semibold text-foreground cursor-pointer">
                    Premium Only
                  </Label>
                  <p className="text-xs text-muted-foreground">Require premium subscription to access</p>
                </div>
              </div>
              <Switch
                id="video-locked"
                checked={form.premiumOnly}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, premiumOnly: checked }))}
                className="data-[state=checked]:gradient-primary"
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary text-primary-foreground font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Adding Video...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Video
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Existing Videos Table - Glass Morphism Card */}
      <div className="group relative rounded-2xl backdrop-premium shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl gradient-primary shadow-glow">
              <List className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Existing Videos
            </h3>
            <span className="ml-auto px-3 py-1.5 bg-primary/10 rounded-lg text-sm font-semibold text-primary border border-primary/20">
              {videos.length} videos
            </span>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-card/50">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted border-b border-border">
                  <TableHead className="font-bold text-foreground">Title</TableHead>
                  <TableHead className="font-bold text-foreground">Section</TableHead>
                  <TableHead className="font-bold text-foreground">Duration</TableHead>
                  <TableHead className="font-bold text-foreground">Order</TableHead>
                  <TableHead className="font-bold text-foreground">Status</TableHead>
                  <TableHead className="w-24 font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => (
                  <TableRow
                    key={video.id}
                    className="border-b border-border hover:bg-accent/50 transition-all duration-200"
                  >
                    <TableCell className="font-semibold text-foreground">{video.title}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary/10 rounded-lg text-xs font-medium text-secondary border border-secondary/20">
                        {getSectionDisplay(video.section)}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-medium">{video.duration}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-sm font-bold text-primary border border-primary/20">
                        {video.order_index ?? 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      {video.premium_only ? (
                        <Badge className="gradient-primary text-primary-foreground border-0 shadow-sm hover:shadow-md transition-all duration-200">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20">
                          Free
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(video)}
                          className="hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-110"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteVideoId(video.id)}
                          className="hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:scale-110"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Edit Video Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl gradient-primary shadow-glow">
                <Edit className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-foreground">Edit Video</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Update the video details below
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <form onSubmit={handleUpdateVideo} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-video-title" className="text-sm font-semibold text-foreground">
                Video Title
              </Label>
              <Input
                id="edit-video-title"
                placeholder="Enter video title"
                className="mt-1 bg-input border-border focus:border-ring focus:ring-ring/20 transition-all duration-200"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-video-description" className="text-sm font-semibold text-foreground">
                Description
              </Label>
              <Textarea
                id="edit-video-description"
                placeholder="Brief description of the video content"
                className="mt-1 bg-input border-border focus:border-ring focus:ring-ring/20 transition-all duration-200 resize-none"
                rows={3}
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-video-section" className="text-sm font-semibold text-foreground">
                  Section
                </Label>
                <Select
                  value={form.section}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, section: value }))}
                >
                  <SelectTrigger className="mt-1 bg-input border-border focus:border-ring focus:ring-ring/20">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="foundation" className="focus:bg-accent">Foundations</SelectItem>
                    <SelectItem value="practice" className="focus:bg-accent">Daily Situations</SelectItem>
                    <SelectItem value="mastery" className="focus:bg-accent">Masterclass</SelectItem>
                    <SelectItem value="ages-1-2" className="focus:bg-accent">Ages 1-2</SelectItem>
                    <SelectItem value="ages-3-4" className="focus:bg-accent">Ages 3-4</SelectItem>
                    <SelectItem value="ages-5-plus" className="focus:bg-accent">Ages 5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-video-duration" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Duration (MM:SS)
                </Label>
                <Input
                  id="edit-video-duration"
                  placeholder="e.g., 12:30"
                  className="mt-1 bg-white/50 dark:bg-gray-950/50 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-200"
                  value={form.duration}
                  onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-video-url" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Video URL
              </Label>
              <Input
                id="edit-video-url"
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-1 bg-white/50 dark:bg-gray-950/50 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-200"
                value={form.videoUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, videoUrl: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="edit-thumbnail-url" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Thumbnail URL
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoFetchThumbnail}
                  disabled={fetchingThumbnail || !form.videoUrl.trim()}
                  className="h-8 text-xs bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <ImageIcon className="w-3 h-3 mr-1.5" />
                  {fetchingThumbnail ? 'Fetching...' : 'Auto-fetch from YouTube'}
                </Button>
              </div>
              <Input
                id="edit-thumbnail-url"
                placeholder="https://... (or click Auto-fetch)"
                className="mt-1 bg-white/50 dark:bg-gray-950/50 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-200"
                value={form.thumbnailUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, thumbnailUrl: event.target.value }))}
              />
              {form.thumbnailUrl && (
                <div className="mt-3 group/thumb">
                  <div className="relative w-full max-w-xs overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-md group-hover/thumb:shadow-xl transition-all duration-300">
                    <img
                      src={form.thumbnailUrl}
                      alt="Thumbnail preview"
                      className="w-full h-auto group-hover/thumb:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-video-order" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Order Index
              </Label>
              <Input
                id="edit-video-order"
                type="number"
                placeholder="0"
                className="mt-1 bg-white/50 dark:bg-gray-950/50 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-200"
                value={form.orderIndex}
                onChange={(event) => setForm((prev) => ({ ...prev, orderIndex: event.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 shadow-md">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <Label htmlFor="edit-video-locked" className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer">
                    Premium Only
                  </Label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Require premium subscription to access</p>
                </div>
              </div>
              <Switch
                id="edit-video-locked"
                checked={form.premiumOnly}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, premiumOnly: checked }))}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-blue-600"
              />
            </div>

            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingVideo(null);
                  resetForm();
                }}
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  'Update Video'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteVideoId !== null} onOpenChange={() => setDeleteVideoId(null)}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <AlertDialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Delete Video?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400 text-base">
              This action cannot be undone. This will permanently delete the video from your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteVideoId && handleDelete(deleteVideoId)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Video
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
