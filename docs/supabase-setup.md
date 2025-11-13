# Supabase project bootstrap

The Supabase project at `https://iogceaotdodvugrmogpp.supabase.co` ships empty. Run the migrations in
`supabase/migrations` before logging into the app so that tables, policies, and starter content exist.

## Option 1 — Supabase CLI (recommended)

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli).
2. Create a [personal access token](https://supabase.com/dashboard/account/tokens) and run:

   ```bash
   supabase login
   ```
3. Link the local repo to the new project (grab the database password from **Project Settings → Database** in Supabase):

   ```bash
   supabase link --project-ref iogceaotdodvugrmogpp --password <database-password>
   ```
4. Push the schema and seed data:

   ```bash
   supabase db push
   ```

The command applies every SQL file in `supabase/migrations/` in order, creating the full schema plus the
starter scripts, videos, and PDF resources.

## Option 2 — Supabase SQL editor

If you cannot use the CLI, open the Supabase Dashboard → **SQL Editor** and run the migrations manually:

1. Execute `20251017185705_1421a197-477f-4559-8703-e293054664d8.sql` to lay down the core schema.
2. Run the remaining files in chronological order (including the new
   `20251018150000_create_profiles_and_tracker.sql` and `20251108000300_seed_core_content.sql`).

Once the SQL has been executed the application will display:

- A fully functional profiles table tied to Supabase Auth users.
- Automatic creation of 30-day tracker rows for each new user.
- Preloaded NEP scripts, videos, and PDF downloads so every route renders meaningful data on first login.
