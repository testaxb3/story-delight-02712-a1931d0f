-- Create video_collections table for organizing video content
CREATE TABLE public.video_collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT DEFAULT 'folder',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.video_collections ENABLE ROW LEVEL SECURITY;

-- Everyone can view collections
CREATE POLICY "Collections are viewable by everyone" 
ON public.video_collections 
FOR SELECT 
USING (true);

-- Admins can manage collections
CREATE POLICY "Admins can manage collections" 
ON public.video_collections 
FOR ALL 
USING (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))));

-- Add collection_id to bonuses table
ALTER TABLE public.bonuses 
ADD COLUMN collection_id UUID REFERENCES public.video_collections(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX idx_bonuses_collection_id ON public.bonuses(collection_id);
CREATE INDEX idx_video_collections_display_order ON public.video_collections(display_order);

-- Insert initial collections
INSERT INTO public.video_collections (name, slug, description, icon_name, display_order) VALUES
  ('Quick Bites', 'quick-bites', 'Short videos under 5 minutes for busy parents', 'zap', 1),
  ('Understanding Development', 'understanding-development', 'Learn about child brain development and growth stages', 'brain', 2),
  ('Parenting Foundations', 'parenting-foundations', 'Core parenting styles, techniques and philosophies', 'heart', 3),
  ('Managing Emotions', 'managing-emotions', 'Handle tantrums, meltdowns and big emotions', 'flame', 4),
  ('Activities & Play', 'activities-play', 'Sensory activities and developmental play ideas', 'sparkles', 5),
  ('Special Topics', 'special-topics', 'Deep dives into specific parenting challenges', 'star', 6);

-- Update trigger for updated_at
CREATE TRIGGER update_video_collections_updated_at
BEFORE UPDATE ON public.video_collections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();