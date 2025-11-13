# Script Upload RLS Issue - Root Cause and Solution

## Problem

When uploading 200+ scripts in batch on the admin page, the following error occurred:
```
Batch 1: new row violates row-level security policy for table "scripts"
POST /rest/v1/scripts 403 (Forbidden)
```

User could access the admin page but couldn't insert data.

## Root Cause Analysis

The system had **two different admin verification mechanisms**:

### 1. Frontend Admin Verification
**Location**: `src/hooks/useAdminStatus.ts`
```typescript
const { data, error } = await supabase.rpc('is_admin');
```

**Function**: `supabase/migrations/20251021000200_fix_schema_issues.sql:90`
```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;
```
✅ Checks: `profiles.is_admin` column

### 2. RLS Policies (Original - INCORRECT)
**Location**: `supabase/migrations/20251018144231_*.sql`
```sql
CREATE POLICY "Admins can insert scripts"
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
```
❌ Checks: `user_roles.role = 'admin'` table

## The Mismatch

| System | Checks | User Status |
|--------|--------|-------------|
| Frontend Access | `profiles.is_admin = true` | ✅ TRUE |
| RLS Policies | `user_roles.role = 'admin'` | ❌ FALSE (no record) |

**Result**: User could view admin page but all INSERT operations returned 403 Forbidden.

## Solution

Update RLS policies to use `profiles.is_admin`, matching the frontend logic.

**Migration**: `20251122000002_fix_scripts_rls_use_profiles_is_admin.sql`

```sql
CREATE POLICY "Admins can insert scripts"
ON public.scripts
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
```

## Files Changed

### Created:
- `supabase/migrations/20251122000002_fix_scripts_rls_use_profiles_is_admin.sql` - Correct RLS policies
- `FIX_FINAL_RLS_PROFILES.sql` - Manual fix script
- `docs/SCRIPT_UPLOAD_RLS_SOLUTION.md` - This documentation

### Deprecated (do not use):
- `20251122000000_fix_scripts_rls_for_batch_insert.sql` - Used wrong verification
- `20251122000001_force_fix_scripts_rls.sql` - Used wrong verification
- `SOLUCAO_DEFINITIVA_RLS.sql` - Used wrong verification

## Testing

After applying the migration:

1. **Verify your admin status**:
```sql
SELECT is_admin FROM public.profiles WHERE id = auth.uid();
```
Should return `true`.

2. **Logout and login** to refresh JWT token

3. **Test batch upload**:
   - Go to Admin → Scripts
   - Upload file with 200+ scripts
   - Should succeed without 403 errors

## Key Takeaways

1. ✅ **Always use the same auth logic** across frontend and backend
2. ✅ **Check both frontend hooks and RLS policies** when debugging permissions
3. ✅ **Test with actual user sessions**, not just SQL Editor queries
4. ❌ **Don't assume** user_roles and profiles.is_admin are synchronized

## Related Code

- **Admin Page**: `src/pages/Admin.tsx:32` - Uses `useAdminStatus()`
- **Admin Hook**: `src/hooks/useAdminStatus.ts:24` - Calls `supabase.rpc('is_admin')`
- **is_admin RPC**: `supabase/migrations/20251021000200_fix_schema_issues.sql:90`
- **Batch Upload**: `src/components/Admin/AdminScriptsTab.tsx:426` - `supabase.from('scripts').insert(chunk)`

## Success Confirmation

User confirmed upload of 200 scripts works after applying fix.

Status: ✅ **RESOLVED**
