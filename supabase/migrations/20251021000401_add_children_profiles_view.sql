-- Migration: Add children_profiles view for NEPSystem compatibility
-- Description: Create a view that maps child_profiles to children_profiles naming

-- ============================================================================
-- CREATE VIEW FOR COMPATIBILITY
-- ============================================================================

-- Drop view if exists
DROP VIEW IF EXISTS public.children_profiles;

-- Create view that maps child_profiles to children_profiles
CREATE VIEW public.children_profiles AS
SELECT
  id,
  parent_id AS user_id,
  name,
  brain_profile,
  age,
  notes,
  is_active,
  created_at,
  updated_at
FROM public.child_profiles;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT SELECT ON public.children_profiles TO authenticated;

-- ============================================================================
-- ENABLE INSERT/UPDATE/DELETE ON VIEW (UPDATABLE VIEW)
-- ============================================================================

-- Create INSTEAD OF triggers to allow INSERT/UPDATE/DELETE on the view
CREATE OR REPLACE FUNCTION public.children_profiles_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.child_profiles (parent_id, name, brain_profile, age, notes, is_active)
  VALUES (NEW.user_id, NEW.name, NEW.brain_profile, NEW.age, NEW.notes, COALESCE(NEW.is_active, true))
  RETURNING id, parent_id, name, brain_profile, age, notes, is_active, created_at, updated_at
  INTO NEW.id, NEW.user_id, NEW.name, NEW.brain_profile, NEW.age, NEW.notes, NEW.is_active, NEW.created_at, NEW.updated_at;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.children_profiles_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.child_profiles
  SET
    name = NEW.name,
    brain_profile = NEW.brain_profile,
    age = NEW.age,
    notes = NEW.notes,
    is_active = NEW.is_active,
    updated_at = timezone('utc', now())
  WHERE id = OLD.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.children_profiles_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.child_profiles WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER children_profiles_insert_trigger
  INSTEAD OF INSERT ON public.children_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.children_profiles_insert();

CREATE TRIGGER children_profiles_update_trigger
  INSTEAD OF UPDATE ON public.children_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.children_profiles_update();

CREATE TRIGGER children_profiles_delete_trigger
  INSTEAD OF DELETE ON public.children_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.children_profiles_delete();
