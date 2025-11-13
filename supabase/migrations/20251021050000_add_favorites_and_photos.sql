-- Add photo support to child profiles
ALTER TABLE child_profiles ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create favorite_scripts table
CREATE TABLE IF NOT EXISTS favorite_scripts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  script_id uuid NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, script_id)
);

-- Enable RLS
ALTER TABLE favorite_scripts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for favorite_scripts
CREATE POLICY "Users can view own favorites"
  ON favorite_scripts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON favorite_scripts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON favorite_scripts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create push_subscriptions table for notifications
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- Enable RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for push_subscriptions
CREATE POLICY "Users can manage own subscriptions"
  ON push_subscriptions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_favorite_scripts_user_id ON favorite_scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_scripts_script_id ON favorite_scripts(script_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
