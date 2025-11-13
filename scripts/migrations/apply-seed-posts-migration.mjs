#!/usr/bin/env node

/**
 * APPLY SEED POSTS WITH AVATARS MIGRATION
 *
 * This script applies the migration that adds:
 * 1. author_photo_url column to community_posts table
 * 2. 20 diverse seed posts with DiceBear avatars
 * 3. Professional-looking community for new users
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  console.error('\n💡 Make sure these are set in your .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function applyMigration() {
  console.log('🚀 Applying Seed Posts Migration...\n');

  try {
    // Read migration file
    const migrationPath = join(__dirname, 'supabase', 'migrations', '20251117000004_add_seed_posts_with_avatars.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📖 Migration file loaded:', migrationPath);
    console.log('📝 Migration size:', (migrationSQL.length / 1024).toFixed(2), 'KB');

    // Execute migration
    console.log('\n⏳ Executing migration...');
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      // If exec_sql RPC doesn't exist, try direct execution (requires service role)
      console.log('⚠️  exec_sql RPC not found, trying direct execution...');

      // Split by semicolon and execute each statement
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        const { error: execError } = await supabase.rpc('exec', { sql: statement });
        if (execError) {
          console.error('❌ Error executing statement:', execError.message);
          throw execError;
        }
      }
    }

    console.log('✅ Migration applied successfully!\n');

    // Verify seed posts were created
    console.log('🔍 Verifying seed posts...');
    const { data: seedPosts, error: verifyError } = await supabase
      .from('community_posts')
      .select('id, author_name, author_photo_url, author_brain_type')
      .eq('is_seed_post', true);

    if (verifyError) {
      console.error('❌ Error verifying seed posts:', verifyError.message);
      throw verifyError;
    }

    console.log(`✅ Found ${seedPosts.length} seed posts\n`);

    // Display summary by brain type
    const byBrainType = seedPosts.reduce((acc, post) => {
      acc[post.author_brain_type] = (acc[post.author_brain_type] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 Seed Posts Summary:');
    console.log('   Total Posts:', seedPosts.length);
    console.log('   By Brain Type:');
    Object.entries(byBrainType).forEach(([type, count]) => {
      console.log(`     - ${type}: ${count} posts`);
    });

    // Show sample avatars
    console.log('\n🎨 Sample Avatar URLs:');
    seedPosts.slice(0, 3).forEach(post => {
      console.log(`   ${post.author_name}: ${post.author_photo_url}`);
    });

    console.log('\n✨ Migration complete! Your community now has realistic profile avatars!');
    console.log('\n💡 Next steps:');
    console.log('   1. Visit the Community page to see the avatars');
    console.log('   2. Verify that seed posts display correctly');
    console.log('   3. Check that avatars load properly');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure you have the SUPABASE_SERVICE_ROLE_KEY');
    console.error('   2. Check that the migration file exists');
    console.error('   3. Verify your Supabase connection');
    process.exit(1);
  }
}

// Run migration
applyMigration();
