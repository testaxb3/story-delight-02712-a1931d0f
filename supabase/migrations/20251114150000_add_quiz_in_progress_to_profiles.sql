-- ============================================================================
-- ADD QUIZ STATE TO PROFILES TABLE
-- ============================================================================
-- This migration adds quiz_in_progress field to profiles table to replace
-- localStorage usage with proper database state.
--
-- Security Improvement: Moving quiz state from client to server
-- - Synchronized across devices
-- - Persistent and reliable
-- - Protected by RLS policies
--
-- Created: 2025-11-14
-- Author: Security Enhancement
-- ============================================================================

-- Add quiz_in_progress column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS quiz_in_progress BOOLEAN NOT NULL DEFAULT FALSE;

-- Add helpful comment
COMMENT ON COLUMN public.profiles.quiz_in_progress IS 'Indicates if user has started but not completed the initial quiz';

-- ============================================================================
-- MIGRATION SUMMARY
-- ============================================================================
-- ADDED:
-- - quiz_in_progress BOOLEAN field to profiles table
--
-- BENEFITS:
-- - Quiz state synchronized across devices
-- - No more localStorage dependency
-- - Better data integrity
-- - Protected by existing RLS policies
