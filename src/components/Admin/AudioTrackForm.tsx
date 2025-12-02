import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { useAudioTracksAdmin } from '@/hooks/useAdminAudio';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';
import { formatTime } from '@/lib/formatters';

type AudioTrack = Database['public']['Tables']['audio_tracks']['Row'];
type AudioSeries = Database['public']['Tables']['audio_series']['Row'];

interface AudioTrackFormProps {
  track: AudioTrack | null;
  series: AudioSeries[];
  onClose: () => void;
}

export function AudioTrackForm({ track, series, onClose }: AudioTrackFormProps) {
  const { createTrack, updateTrack, uploadAudioFile } = useAudioTracksAdmin();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    series_id: '',
    track_number: 1,
    audio_url: '',
    duration_seconds: 0,
    is_preview: false,
    tags: [] as string[],
  });

  useEffect(() => {
    if (track) {
      setFormData({
        title: track.title,
        description: track.description || '',
        series_id: track.series_id || '',
        track_number: track.track_number,
        audio_url: track.audio_url,
        duration_seconds: track.duration_seconds,
        is_preview: track.is_preview || false,
        tags: track.tags || [],
      });
    }
  }, [track]);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast.error('Please select an audio file');
      return;
    }

    setUploading(true);
    try {
      const { url, duration } = await uploadAudioFile(file);
      setFormData((prev) => ({
        ...prev,
        audio_url: url,
        duration_seconds: duration,
      }));
      toast.success('Audio uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload audio');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.audio_url) {
      toast.error('Please upload an audio file');
      return;
    }

    if (track) {
      await updateTrack.mutateAsync({
        id: track.id,
        updates: formData,
      });
    } else {
      await createTrack.mutateAsync(formData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Track Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Introduction: The Science Behind NEP"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of this track..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="series">Series *</Label>
          <Select
            value={formData.series_id}
            onValueChange={(value) => setFormData({ ...formData, series_id: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select series" />
            </SelectTrigger>
            <SelectContent>
              {series.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="track_number">Track Number *</Label>
          <Input
            id="track_number"
            type="number"
            value={formData.track_number}
            onChange={(e) => setFormData({ ...formData, track_number: parseInt(e.target.value) })}
            min={1}
            required
          />
        </div>
      </div>

      {/* Audio Upload */}
      <div className="space-y-2">
        <Label>Audio File *</Label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          {formData.audio_url ? (
            <div className="space-y-2">
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ Audio uploaded
              </div>
              <div className="text-xs text-muted-foreground">
                Duration: {formatTime(formData.duration_seconds)}
              </div>
              <audio controls src={formData.audio_url} className="w-full mt-2" />
              <label className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Replace Audio
                  </span>
                </Button>
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleAudioUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          ) : (
            <label className="cursor-pointer">
              <div className="space-y-2">
                {uploading ? (
                  <>
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload audio file (.mp3, .wav)
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleAudioUpload}
                disabled={uploading}
              />
            </label>
          )}
        </div>
      </div>

      {/* Preview Toggle */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="space-y-0.5">
          <Label htmlFor="preview">Preview Track</Label>
          <p className="text-xs text-muted-foreground">
            Make this track available for free (no premium required)
          </p>
        </div>
        <Switch
          id="preview"
          checked={formData.is_preview}
          onCheckedChange={(checked) => setFormData({ ...formData, is_preview: checked })}
        />
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={createTrack.isPending || updateTrack.isPending || uploading}
        >
          {track ? 'Update Track' : 'Create Track'}
        </Button>
      </div>
    </form>
  );
}
