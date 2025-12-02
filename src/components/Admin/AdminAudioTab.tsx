import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Music, Disc3 } from 'lucide-react';
import { useAudioSeriesAdmin, useAudioTracksAdmin } from '@/hooks/useAdminAudio';
import { AudioSeriesCard } from './AudioSeriesCard';
import { AudioTrackRow } from './AudioTrackRow';
import { AudioSeriesForm } from './AudioSeriesForm';
import { AudioTrackForm } from './AudioTrackForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Database } from '@/integrations/supabase/types';

type AudioSeries = Database['public']['Tables']['audio_series']['Row'];
type AudioTrack = Database['public']['Tables']['audio_tracks']['Row'];

export function AdminAudioTab() {
  const [activeTab, setActiveTab] = useState('series');
  const [isSeriesFormOpen, setIsSeriesFormOpen] = useState(false);
  const [isTrackFormOpen, setIsTrackFormOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<AudioSeries | null>(null);
  const [editingTrack, setEditingTrack] = useState<AudioTrack | null>(null);

  const { series, isLoading: loadingSeries } = useAudioSeriesAdmin();
  const { tracks, isLoading: loadingTracks } = useAudioTracksAdmin();

  const handleEditSeries = (s: AudioSeries) => {
    setEditingSeries(s);
    setIsSeriesFormOpen(true);
  };

  const handleEditTrack = (t: AudioTrack) => {
    setEditingTrack(t);
    setIsTrackFormOpen(true);
  };

  const handleCloseSeriesForm = () => {
    setIsSeriesFormOpen(false);
    setEditingSeries(null);
  };

  const handleCloseTrackForm = () => {
    setIsTrackFormOpen(false);
    setEditingTrack(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">🎧 Audio Management</h2>
        <p className="text-muted-foreground">Manage your audio series and tracks</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="series" className="flex items-center gap-2">
            <Disc3 className="w-4 h-4" />
            Series ({series.length})
          </TabsTrigger>
          <TabsTrigger value="tracks" className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            Tracks ({tracks.length})
          </TabsTrigger>
        </TabsList>

        {/* Series Management */}
        <TabsContent value="series" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Audio Series</h3>
            <Button
              onClick={() => setIsSeriesFormOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Series
            </Button>
          </div>

          {loadingSeries ? (
            <div className="text-center py-12 text-muted-foreground">Loading series...</div>
          ) : series.length === 0 ? (
            <Card className="p-12 text-center">
              <Disc3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No series yet</h3>
              <p className="text-muted-foreground mb-4">Create your first audio series to get started</p>
              <Button onClick={() => setIsSeriesFormOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Series
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {series.map((s) => (
                <AudioSeriesCard
                  key={s.id}
                  series={s}
                  onEdit={handleEditSeries}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tracks Management */}
        <TabsContent value="tracks" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Audio Tracks</h3>
            <Button
              onClick={() => setIsTrackFormOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Track
            </Button>
          </div>

          {loadingTracks ? (
            <div className="text-center py-12 text-muted-foreground">Loading tracks...</div>
          ) : tracks.length === 0 ? (
            <Card className="p-12 text-center">
              <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No tracks yet</h3>
              <p className="text-muted-foreground mb-4">Add your first audio track to get started</p>
              <Button onClick={() => setIsTrackFormOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Track
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {series.map((s) => {
                const seriesTracks = tracks.filter((t) => t.series_id === s.id);
                if (seriesTracks.length === 0) return null;

                return (
                  <div key={s.id} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Disc3 className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-lg">{s.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        ({seriesTracks.length} tracks)
                      </span>
                    </div>
                    <Card className="divide-y divide-border">
                      {seriesTracks.map((track) => (
                        <AudioTrackRow
                          key={track.id}
                          track={track}
                          onEdit={handleEditTrack}
                        />
                      ))}
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={isSeriesFormOpen} onOpenChange={setIsSeriesFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSeries ? 'Edit Series' : 'Create New Series'}
            </DialogTitle>
          </DialogHeader>
          <AudioSeriesForm
            series={editingSeries}
            onClose={handleCloseSeriesForm}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isTrackFormOpen} onOpenChange={setIsTrackFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTrack ? 'Edit Track' : 'Add New Track'}
            </DialogTitle>
          </DialogHeader>
          <AudioTrackForm
            track={editingTrack}
            series={series}
            onClose={handleCloseTrackForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
