import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Upload, Disc3 } from 'lucide-react';
import { useAudioSeriesAdmin } from '@/hooks/useAdminAudio';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type AudioSeries = Database['public']['Tables']['audio_series']['Row'];

interface AudioSeriesCardProps {
  series: AudioSeries;
  onEdit: (series: AudioSeries) => void;
}

export function AudioSeriesCard({ series, onEdit }: AudioSeriesCardProps) {
  const { deleteSeries, updateSeries, uploadCoverImage } = useAudioSeriesAdmin();
  const [uploading, setUploading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this series? All tracks will also be deleted.')) return;
    deleteSeries.mutate(series.id);
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadCoverImage(file, series.id);
      await updateSeries.mutateAsync({
        id: series.id,
        updates: { cover_image: url },
      });
    } catch (error) {
      toast.error('Failed to upload cover image');
    } finally {
      setUploading(false);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0m 0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Cover Image */}
      <div className="relative h-40 bg-gradient-to-br from-purple-500 to-pink-500">
        {series.cover_image ? (
          <img
            src={series.cover_image}
            alt={series.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Disc3 className="w-16 h-16 text-white/80" />
          </div>
        )}
        <label className="absolute top-2 right-2 cursor-pointer">
          <div className="bg-white/90 hover:bg-white p-2 rounded-lg shadow-md transition-colors">
            {uploading ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-foreground" />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadCover}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{series.name}</h3>
            {series.icon_name && (
              <span className="text-2xl">{series.icon_name}</span>
            )}
          </div>
          {series.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {series.description}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Disc3 className="w-4 h-4" />
            <span>{series.track_count || 0} tracks</span>
          </div>
          <div className="text-muted-foreground">
            {formatDuration(series.total_duration)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(series)}
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteSeries.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
