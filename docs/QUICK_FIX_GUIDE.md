# Quick Fix Guide - Database Errors

⚠️ **Your database has schema issues. Here's the 15-minute fix.**

---

## TL;DR

1. Backup database in Supabase Dashboard
2. Run `supabase/migrations/20251113000000_FINAL_fix_all_console_errors.sql` in SQL Editor
3. Reload schema: Settings → API → Reload Schema
4. Refresh your app

**That's it. All errors fixed.**

---

## Step-by-Step (15 minutes)

### 1. Backup (5 min)
- Open https://supabase.com/dashboard/project/iogceaotdodvugrmogpp
- Database → Backups → Create Backup
- Wait for confirmation

### 2. Run Migration (3 min)
- SQL Editor → New Query
- Copy/paste contents of `supabase/migrations/20251113000000_FINAL_fix_all_console_errors.sql`
- Click Run
- Look for "MIGRATION COMPLETE" message

### 3. Reload Schema (2 min)
- Settings → API → Reload Schema
- Wait for confirmation

### 4. Verify (2 min)
SQL Editor:
```sql
SELECT * FROM verify_schema_fixes();
```
All should say "OK"

### 5. Test (3 min)
- Hard refresh app (`Ctrl+Shift+R`)
- Clear console (F12)
- Navigate through app
- Check for errors

---

## What Gets Fixed

✅ `tracker_days.child_id does not exist` → Added column
✅ `scripts_usage` not found → Exposed via API
✅ `posts` not found → Created view
✅ `user_bonuses` not found → Exposed via API
✅ `badges` not found → Exposed via API
✅ `user_badges` not found → Exposed via API

---

## What If It Doesn't Work?

### Still seeing errors?
1. Reload schema again (Settings → API → Reload Schema)
2. Hard refresh browser
3. Run verification query again

### Migration failed?
- Check error message
- Make sure you're running as database owner
- Try reloading schema first, then run migration

### Need to undo?
Restore from backup: Database → Backups → Restore

---

## Why This Happened

Your database was created manually (not via migrations). The 49 migration files in your folder were never applied to the actual database.

**Going forward:** Use `supabase migration new` and `supabase db push` for all schema changes.

---

## Full Documentation

- `docs/MIGRATION_ACTION_PLAN.md` - Detailed step-by-step with explanations
- `docs/DATABASE_AUDIT_FINAL.md` - Complete audit of what's wrong
- `docs/DATABASE_SCHEMA_FINAL.md` - Full schema documentation
- `supabase/migrations/README.md` - Migration folder explanation

---

## Quick Reference

**Project:** iogceaotdodvugrmogpp
**Migration File:** `supabase/migrations/20251113000000_FINAL_fix_all_console_errors.sql`
**Verification:** `SELECT * FROM verify_schema_fixes();`
**Time Required:** 15 minutes
**Risk Level:** Low (safe, reversible)

---

**Last Updated:** 2025-11-13
