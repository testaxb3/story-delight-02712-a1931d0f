# 📝 Decision: user_roles Table

**Status:** ⚠️ PENDING DECISION  
**Date Created:** 2024-11-16

---

## Current Situation

The database contains a `user_roles` table and `has_role()` function that are **NOT actively used** in the application:

- **Table:** `user_roles` (with columns: `id`, `user_id`, `role`, `created_at`)
- **Function:** `has_role(_user_id uuid, _role app_role)` - SECURITY DEFINER function
- **Usage:** Only used in `AnalyticsDashboard.tsx` for counting users (now fixed to use `profiles` instead)

---

## Options

### Option A: Remove Completely ✅ RECOMMENDED

**Pros:**
- Reduces database complexity
- Eliminates unused code
- Current admin system works via `profiles.is_admin` boolean

**Cons:**
- Cannot support multiple roles per user in future without re-adding
- Loses potential for granular permissions (editor, moderator, etc.)

**Implementation:**
```sql
-- Drop function first (depends on table)
DROP FUNCTION IF EXISTS public.has_role(_user_id uuid, _role app_role);

-- Drop table
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Drop enum if not used elsewhere
DROP TYPE IF EXISTS public.app_role;
```

---

### Option B: Keep for Future Use

**Pros:**
- Ready for multi-role system if needed
- Can add "moderator", "editor", "premium" roles later

**Cons:**
- Unused code in production
- Maintenance burden
- Current simple boolean is sufficient

**Next Steps if keeping:**
1. Document intended use case
2. Create integration plan with frontend
3. Add RLS policies for `user_roles` table

---

## Recommendation

**REMOVE** the `user_roles` table because:
1. Current admin system (`profiles.is_admin`) is sufficient
2. No immediate need for multi-role permissions
3. Can be re-added later if requirements change

**If multi-role is needed in future:**
- Re-add table with proper RLS policies
- Integrate with frontend authorization hooks
- Migrate existing admins from `profiles.is_admin`

---

## Action Required

**Decision Maker:** Product Owner / Tech Lead  
**Deadline:** End of Sprint

**Options:**
- [ ] Remove `user_roles` table (recommended)
- [ ] Keep table and document future use case
