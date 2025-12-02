-- Create storage bucket for audio tracks
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio-tracks',
  'audio-tracks',
  true,
  52428800, -- 50MB limit per file
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a']
);

-- Create RLS policies for audio-tracks bucket
CREATE POLICY "Audio tracks are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio-tracks');

CREATE POLICY "Admins can upload audio tracks"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'audio-tracks' AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Admins can update audio tracks"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'audio-tracks' AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Admins can delete audio tracks"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'audio-tracks' AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Create audio_series table (similar to video_collections)
CREATE TABLE audio_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,
  icon_name TEXT,
  display_order INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0, -- total seconds
  track_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audio_tracks table
CREATE TABLE audio_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID REFERENCES audio_series(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  track_number INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  audio_url TEXT NOT NULL,
  thumbnail TEXT,
  is_preview BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(series_id, track_number)
);

-- Create user_audio_progress table
CREATE TABLE user_audio_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES audio_tracks(id) ON DELETE CASCADE,
  progress_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  last_played_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- Enable RLS
ALTER TABLE audio_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_audio_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audio_series
CREATE POLICY "Anyone can view audio series"
ON audio_series FOR SELECT
USING (true);

CREATE POLICY "Admins can manage audio series"
ON audio_series FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- RLS Policies for audio_tracks
CREATE POLICY "Anyone can view audio tracks"
ON audio_tracks FOR SELECT
USING (true);

CREATE POLICY "Admins can manage audio tracks"
ON audio_tracks FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- RLS Policies for user_audio_progress
CREATE POLICY "Users can view their own audio progress"
ON user_audio_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own audio progress"
ON user_audio_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audio progress"
ON user_audio_progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audio progress"
ON user_audio_progress FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_audio_tracks_series_id ON audio_tracks(series_id);
CREATE INDEX idx_audio_tracks_track_number ON audio_tracks(series_id, track_number);
CREATE INDEX idx_user_audio_progress_user_id ON user_audio_progress(user_id);
CREATE INDEX idx_user_audio_progress_track_id ON user_audio_progress(track_id);
CREATE INDEX idx_user_audio_progress_last_played ON user_audio_progress(user_id, last_played_at DESC);

-- Create function to update audio_series stats
CREATE OR REPLACE FUNCTION update_audio_series_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE audio_series
  SET 
    track_count = (SELECT COUNT(*) FROM audio_tracks WHERE series_id = COALESCE(NEW.series_id, OLD.series_id)),
    total_duration = (SELECT COALESCE(SUM(duration_seconds), 0) FROM audio_tracks WHERE series_id = COALESCE(NEW.series_id, OLD.series_id)),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.series_id, OLD.series_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update series stats
CREATE TRIGGER trigger_update_audio_series_stats
AFTER INSERT OR UPDATE OR DELETE ON audio_tracks
FOR EACH ROW
EXECUTE FUNCTION update_audio_series_stats();

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_audio_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER trigger_audio_series_updated_at
BEFORE UPDATE ON audio_series
FOR EACH ROW
EXECUTE FUNCTION update_audio_updated_at();

CREATE TRIGGER trigger_audio_tracks_updated_at
BEFORE UPDATE ON audio_tracks
FOR EACH ROW
EXECUTE FUNCTION update_audio_updated_at();

CREATE TRIGGER trigger_user_audio_progress_updated_at
BEFORE UPDATE ON user_audio_progress
FOR EACH ROW
EXECUTE FUNCTION update_audio_updated_at();