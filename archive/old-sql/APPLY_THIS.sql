-- ============================================================================
-- APLICAR ESTE ARQUIVO NO SUPABASE SQL EDITOR
-- ============================================================================
-- Este arquivo contém TODAS as migrations necessárias para o Feedback Loop
-- Copie e cole no SQL Editor do Supabase Dashboard e clique "Run"
-- ============================================================================

-- MIGRATION 1: Create script_feedback table
-- ============================================================================
CREATE TABLE IF NOT EXISTS script_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,  -- NULLABLE (fixed)
  script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  outcome TEXT NOT NULL CHECK (outcome IN ('worked', 'progress', 'not_yet')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast queries
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

-- Enable Row Level Security
ALTER TABLE script_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can insert their own feedback"
  ON script_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
  ON script_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback"
  ON script_feedback FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feedback"
  ON script_feedback FOR DELETE
  USING (auth.uid() = user_id);

-- Comments for documentation
COMMENT ON TABLE script_feedback IS 'Tracks parent feedback on script usage outcomes to improve recommendations';
COMMENT ON COLUMN script_feedback.outcome IS 'One of: worked (successful), progress (some improvement), not_yet (did not work)';
COMMENT ON COLUMN script_feedback.child_id IS 'Optional reference to child profile. Can be NULL for backwards compatibility with script_usage table.';

-- ============================================================================
-- ✅ DONE!
-- ============================================================================
-- If you see "Success. No rows returned", that's GOOD!
-- The table is now created and ready to use.
-- ============================================================================
