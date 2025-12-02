import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAudioSeriesAdmin } from '@/hooks/useAdminAudio';
import type { Database } from '@/integrations/supabase/types';

type AudioSeries = Database['public']['Tables']['audio_series']['Row'];

interface AudioSeriesFormProps {
  series: AudioSeries | null;
  onClose: () => void;
}

export function AudioSeriesForm({ series, onClose }: AudioSeriesFormProps) {
  const { createSeries, updateSeries } = useAudioSeriesAdmin();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon_name: '🎧',
    display_order: 0,
  });

  useEffect(() => {
    if (series) {
      setFormData({
        name: series.name,
        slug: series.slug,
        description: series.description || '',
        icon_name: series.icon_name || '🎧',
        display_order: series.display_order || 0,
      });
    }
  }, [series]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-generate slug from name if empty
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');

    if (series) {
      await updateSeries.mutateAsync({
        id: series.id,
        updates: { ...formData, slug },
      });
    } else {
      await createSeries.mutateAsync({ ...formData, slug });
    }

    onClose();
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Series Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g., The Obedience Audio Tracks"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (auto-generated)</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="the-obedience-audio-tracks"
        />
        <p className="text-xs text-muted-foreground">
          Used in URLs. Auto-generated from name if empty.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of this series..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon Emoji</Label>
          <Input
            id="icon"
            value={formData.icon_name}
            onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
            placeholder="🎧"
            maxLength={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="order">Display Order</Label>
          <Input
            id="order"
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
            min={0}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={createSeries.isPending || updateSeries.isPending}
        >
          {series ? 'Update Series' : 'Create Series'}
        </Button>
      </div>
    </form>
  );
}
