-- Phase 3: Security, Performance, UX & Data Integrity Improvements

-- 1. Add audit logging for admin actions
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  changes JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON admin_audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- System can insert audit logs (SECURITY DEFINER function will handle this)
CREATE POLICY "System can insert audit logs"
  ON admin_audit_log FOR INSERT
  WITH CHECK (true);

-- Index for faster audit log queries
CREATE INDEX idx_audit_log_admin_id ON admin_audit_log(admin_id);
CREATE INDEX idx_audit_log_entity ON admin_audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created_at ON admin_audit_log(created_at DESC);

-- 2. Add unique constraint on bonus titles to prevent duplicates
ALTER TABLE bonuses ADD CONSTRAINT bonuses_title_unique UNIQUE (title);

-- 3. Add soft delete column for archive feature
ALTER TABLE bonuses ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE bonuses ADD COLUMN IF NOT EXISTS archived_by UUID REFERENCES profiles(id);

-- Create index for archived bonuses
CREATE INDEX idx_bonuses_archived ON bonuses(archived_at) WHERE archived_at IS NOT NULL;

-- 4. Create function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only log if user is authenticated
  IF auth.uid() IS NOT NULL THEN
    INSERT INTO admin_audit_log (admin_id, action, entity_type, entity_id, changes)
    VALUES (
      auth.uid(),
      TG_OP,
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      CASE 
        WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
        WHEN TG_OP = 'UPDATE' THEN jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
        ELSE to_jsonb(NEW)
      END
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 5. Add audit triggers for bonuses table
DROP TRIGGER IF EXISTS audit_bonuses_changes ON bonuses;
CREATE TRIGGER audit_bonuses_changes
  AFTER INSERT OR UPDATE OR DELETE ON bonuses
  FOR EACH ROW
  EXECUTE FUNCTION log_admin_action();

-- 6. Add audit triggers for ebooks table
DROP TRIGGER IF EXISTS audit_ebooks_changes ON ebooks;
CREATE TRIGGER audit_ebooks_changes
  AFTER INSERT OR UPDATE OR DELETE ON ebooks
  FOR EACH ROW
  EXECUTE FUNCTION log_admin_action();

-- 7. Create optimized view for bonuses with progress (reduces multiple queries)
CREATE OR REPLACE VIEW bonuses_with_user_progress AS
SELECT 
  b.*,
  ub.progress as user_progress,
  ub.completed_at as user_completed_at,
  ub.unlocked_at as user_unlocked_at,
  e.id as ebook_id,
  e.slug as ebook_slug,
  e.total_chapters as ebook_total_chapters,
  uep.completed_chapters as ebook_completed_chapters,
  uep.current_chapter as ebook_current_chapter
FROM bonuses b
LEFT JOIN user_bonuses ub ON b.id = ub.bonus_id AND ub.user_id = auth.uid()
LEFT JOIN ebooks e ON b.id = e.bonus_id AND e.deleted_at IS NULL
LEFT JOIN user_ebook_progress uep ON e.id = uep.ebook_id AND uep.user_id = auth.uid()
WHERE b.archived_at IS NULL;

-- 8. Create function for archiving bonuses (soft delete)
CREATE OR REPLACE FUNCTION archive_bonus(p_bonus_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Check admin permission
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Archive the bonus
  UPDATE bonuses
  SET 
    archived_at = NOW(),
    archived_by = auth.uid(),
    updated_at = NOW()
  WHERE id = p_bonus_id
  RETURNING to_jsonb(bonuses.*) INTO v_result;

  IF v_result IS NULL THEN
    RAISE EXCEPTION 'Bonus not found';
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'bonus', v_result
  );
END;
$$;

-- 9. Create function to restore archived bonuses
CREATE OR REPLACE FUNCTION restore_bonus(p_bonus_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Check admin permission
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Restore the bonus
  UPDATE bonuses
  SET 
    archived_at = NULL,
    archived_by = NULL,
    updated_at = NOW()
  WHERE id = p_bonus_id
  RETURNING to_jsonb(bonuses.*) INTO v_result;

  IF v_result IS NULL THEN
    RAISE EXCEPTION 'Bonus not found';
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'bonus', v_result
  );
END;
$$;

-- 10. Add cascade handling for bonus deletion
CREATE OR REPLACE FUNCTION handle_bonus_cascade_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- When a bonus is deleted, mark linked ebooks as orphaned
  UPDATE ebooks
  SET bonus_id = NULL, updated_at = NOW()
  WHERE bonus_id = OLD.id;
  
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS bonus_cascade_delete ON bonuses;
CREATE TRIGGER bonus_cascade_delete
  BEFORE DELETE ON bonuses
  FOR EACH ROW
  EXECUTE FUNCTION handle_bonus_cascade_delete();

-- 11. Add comment on bonuses table for category constraint
COMMENT ON CONSTRAINT bonuses_category_check ON bonuses IS 
  'Ensures category is one of: video, ebook, pdf, tool, template, session';

-- 12. Create function to get orphaned ebooks
CREATE OR REPLACE FUNCTION get_orphaned_ebooks()
RETURNS TABLE(
  id UUID,
  title TEXT,
  slug TEXT,
  created_at TIMESTAMPTZ,
  total_chapters INTEGER
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id, title, slug, created_at, total_chapters
  FROM ebooks
  WHERE bonus_id IS NULL 
    AND deleted_at IS NULL
  ORDER BY created_at DESC;
$$;