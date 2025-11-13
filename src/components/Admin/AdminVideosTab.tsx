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
import { Edit, Trash2, Image as ImageIcon } from 'lucide-react';
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
    });
    setShowEditDialog(true);
  };

  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingVideo || !form.title.trim() || !form.duration.trim()) {
      toast.error('Title and duration are required');
      return;
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
    <div className="space-y-6">
      <Card className="p-6 bg-white/90 backdrop-blur-glass border-none shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Video</h2>
        <form onSubmit={handleAddVideo} className="space-y-4">
          <div>
            <Label htmlFor="video-title">Title</Label>
            <Input
              id="video-title"
              placeholder="Video title"
              className="mt-1"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="video-description">Description</Label>
            <Textarea
              id="video-description"
              placeholder="Brief description"
              className="mt-1"
              rows={3}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="video-section">Section</Label>
              <Select
                value={form.section}
                onValueChange={(value) => setForm((prev) => ({ ...prev, section: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foundation">💡 Foundations</SelectItem>
                  <SelectItem value="practice">🎯 Daily Situations</SelectItem>
                  <SelectItem value="mastery">⚡ Masterclass</SelectItem>
                  <SelectItem value="ages-1-2">🎯 Ages 1-2</SelectItem>
                  <SelectItem value="ages-3-4">⚡ Ages 3-4</SelectItem>
                  <SelectItem value="ages-5-plus">💡 Ages 5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="video-duration">Duration (MM:SS)</Label>
              <Input
                id="video-duration"
                placeholder="12:30"
                className="mt-1"
                value={form.duration}
                onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="video-url">Video URL</Label>
            <Input
              id="video-url"
              placeholder="https://..."
              className="mt-1"
              value={form.videoUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, videoUrl: event.target.value }))}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="thumbnail-url">Thumbnail URL</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoFetchThumbnail}
                disabled={fetchingThumbnail || !form.videoUrl.trim()}
                className="h-7 text-xs"
              >
                <ImageIcon className="w-3 h-3 mr-1" />
                {fetchingThumbnail ? 'Fetching...' : 'Auto-fetch from YouTube'}
              </Button>
            </div>
            <Input
              id="thumbnail-url"
              placeholder="https://... (or click Auto-fetch)"
              className="mt-1"
              value={form.thumbnailUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, thumbnailUrl: event.target.value }))}
            />
            {form.thumbnailUrl && (
              <div className="mt-2">
                <img
                  src={form.thumbnailUrl}
                  alt="Thumbnail preview"
                  className="w-full max-w-xs rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="video-order">Order Index</Label>
            <Input
              id="video-order"
              type="number"
              placeholder="0"
              className="mt-1"
              value={form.orderIndex}
              onChange={(event) => setForm((prev) => ({ ...prev, orderIndex: event.target.value }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="video-locked">Premium Only</Label>
            <Switch
              id="video-locked"
              checked={form.premiumOnly}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, premiumOnly: checked }))}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding…' : 'Add Video'}
          </Button>
        </form>
      </Card>

      <Card className="p-6 bg-white/90 backdrop-blur-glass border-none shadow-lg">
        <h2 className="text-xl font-bold mb-4">Existing Videos ({videos.length})</h2>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell>{getSectionDisplay(video.section)}</TableCell>
                  <TableCell>{video.duration}</TableCell>
                  <TableCell>{video.order_index ?? 0}</TableCell>
                  <TableCell>
                    {video.premium_only ? (
                      <Badge variant="secondary">Premium</Badge>
                    ) : (
                      <Badge variant="outline">Free</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(video)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteVideoId(video.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Video Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
            <DialogDescription>
              Update the video details below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateVideo} className="space-y-4">
            <div>
              <Label htmlFor="edit-video-title">Title</Label>
              <Input
                id="edit-video-title"
                placeholder="Video title"
                className="mt-1"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-video-description">Description</Label>
              <Textarea
                id="edit-video-description"
                placeholder="Brief description"
                className="mt-1"
                rows={3}
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-video-section">Section</Label>
                <Select
                  value={form.section}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, section: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="foundation">💡 Foundations</SelectItem>
                    <SelectItem value="practice">🎯 Daily Situations</SelectItem>
                    <SelectItem value="mastery">⚡ Masterclass</SelectItem>
                    <SelectItem value="ages-1-2">🎯 Ages 1-2</SelectItem>
                    <SelectItem value="ages-3-4">⚡ Ages 3-4</SelectItem>
                    <SelectItem value="ages-5-plus">💡 Ages 5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-video-duration">Duration (MM:SS)</Label>
                <Input
                  id="edit-video-duration"
                  placeholder="12:30"
                  className="mt-1"
                  value={form.duration}
                  onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-video-url">Video URL</Label>
              <Input
                id="edit-video-url"
                placeholder="https://..."
                className="mt-1"
                value={form.videoUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, videoUrl: event.target.value }))}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="edit-thumbnail-url">Thumbnail URL</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoFetchThumbnail}
                  disabled={fetchingThumbnail || !form.videoUrl.trim()}
                  className="h-7 text-xs"
                >
                  <ImageIcon className="w-3 h-3 mr-1" />
                  {fetchingThumbnail ? 'Fetching...' : 'Auto-fetch from YouTube'}
                </Button>
              </div>
              <Input
                id="edit-thumbnail-url"
                placeholder="https://... (or click Auto-fetch)"
                className="mt-1"
                value={form.thumbnailUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, thumbnailUrl: event.target.value }))}
              />
              {form.thumbnailUrl && (
                <div className="mt-2">
                  <img
                    src={form.thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-full max-w-xs rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="edit-video-order">Order Index</Label>
              <Input
                id="edit-video-order"
                type="number"
                placeholder="0"
                className="mt-1"
                value={form.orderIndex}
                onChange={(event) => setForm((prev) => ({ ...prev, orderIndex: event.target.value }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-video-locked">Premium Only</Label>
              <Switch
                id="edit-video-locked"
                checked={form.premiumOnly}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, premiumOnly: checked }))}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingVideo(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating…' : 'Update Video'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteVideoId !== null} onOpenChange={() => setDeleteVideoId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the video.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteVideoId && handleDelete(deleteVideoId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
