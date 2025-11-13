CREATE TABLE IF NOT EXISTS script_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  outcome TEXT NOT NULL CHECK (outcome IN ('worked', 'progress', 'not_yet')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_script_feedback_user_child
  ON script_feedback(user_id, child_id)
  WHERE child_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_script_feedback_user_only
  ON script_feedback(user_id)
  WHERE child_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_script_feedback_script_outcome
  ON script_feedback(script_id, outcome);

CREATE INDEX IF NOT EXISTS idx_script_feedback_created_at
  ON script_feedback(created_at DESC);

ALTER TABLE script_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own feedback" ON script_feedback;
CREATE POLICY "Users can insert their own feedback"
  ON script_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own feedback" ON script_feedback;
CREATE POLICY "Users can view their own feedback"
  ON script_feedback FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own feedback" ON script_feedback;
CREATE POLICY "Users can update their own feedback"
  ON script_feedback FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own feedback" ON script_feedback;
CREATE POLICY "Users can delete their own feedback"
  ON script_feedback FOR DELETE
  USING (auth.uid() = user_id);
