import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import postgres from 'postgres';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://iogceaotdodvugrmogpp.supabase.co';
const dbUrl = process.env.SUPABASE_DB_URL;

if (!dbUrl) {
  console.error('❌ Missing SUPABASE_DB_URL in .env.local');
  process.exit(1);
}

async function applyMigration() {
  console.log('🚀 Starting Phase 1 Migration Application...\n');

  // Read migration file
  const migrationPath = 'supabase/migrations/20251112000000_community_premium_phase_1.sql';
  console.log(`📖 Reading migration file: ${migrationPath}`);

  let migrationSQL;
  try {
    migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    console.log(`✅ Migration file loaded (${migrationSQL.length} characters)\n`);
  } catch (error) {
    console.error('❌ Error reading migration file:', error.message);
    process.exit(1);
  }

  // Connect directly to database using postgres driver
  console.log('🔌 Connecting to Supabase database...');

  let sql;
  try {
    sql = postgres(dbUrl, {
      max: 1,
      ssl: { rejectUnauthorized: false }
    });
    console.log('✅ Database connection established\n');
  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    showManualInstructions(migrationPath);
    process.exit(1);
  }

  // Execute migration
  console.log('⚡ Executing migration SQL...\n');

  try {
    await sql.unsafe(migrationSQL);
    console.log('✅ Migration applied successfully!\n');
    console.log('🎉 Phase 1 database schema is ready!\n');

    // Verify some key changes
    console.log('🔍 Verifying migration...');

    // Check if reaction_type enum exists
    const reactionTypes = await sql`
      SELECT unnest(enum_range(NULL::reaction_type))::text as reaction_type
    `;
    console.log('✅ Reaction types:', reactionTypes.map(r => r.reaction_type).join(', '));

    // Check if user_followers table exists
    const followersTable = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'user_followers'
      ) as exists
    `;
    console.log('✅ user_followers table:', followersTable[0].exists ? 'Created' : 'Failed');

    // Check if new columns exist in profiles
    const profileColumns = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'profiles'
      AND column_name IN ('bio', 'badges', 'followers_count', 'following_count')
    `;
    console.log('✅ Profile columns added:', profileColumns.map(c => c.column_name).join(', '));

    // Check if notifications columns exist
    const notifColumns = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'notifications'
      AND column_name IN ('type_enum', 'actor_id', 'related_post_id')
    `;
    console.log('✅ Notification columns added:', notifColumns.map(c => c.column_name).join(', '));

    console.log('\n✨ All Phase 1 features are ready to use!\n');

  } catch (error) {
    console.error('❌ Error executing migration:', error.message);
    console.error('\nDetailed error:', error);
    showManualInstructions(migrationPath);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

function showManualInstructions(migrationPath) {
  console.log('\n⚠️  Automatic migration failed.');
  console.log('📋 Please apply the migration manually:\n');
  console.log('1. Go to: https://supabase.com/dashboard/project/iogceaotdodvugrmogpp/sql');
  console.log('2. Click "New Query"');
  console.log(`3. Open file: ${migrationPath}`);
  console.log('4. Copy and paste the entire content');
  console.log('5. Click "RUN" (bottom right)\n');
}

applyMigration();
