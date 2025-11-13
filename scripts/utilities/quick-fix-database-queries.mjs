#!/usr/bin/env node
/**
 * Quick Fix for Database Query Errors
 *
 * This script patches the code to match the actual database schema
 * instead of creating new database migrations.
 *
 * Use this if you cannot apply database migrations immediately.
 *
 * Changes:
 * 1. tracker_days: child_id -> child_profile_id
 * 2. scripts_usage -> script_usage
 * 3. posts (author_id) -> community_posts (user_id)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');

console.log('🔧 Quick Fix: Database Query Errors\n');

// Track changes
let changesApplied = 0;
const changes = [];

/**
 * Apply fixes to a file
 */
function applyFixes(filePath, fixes) {
  const relativePath = path.relative(projectRoot, filePath);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${relativePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  let fileChanges = [];

  fixes.forEach(fix => {
    if (content.includes(fix.search)) {
      const occurrences = (content.match(new RegExp(fix.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      content = content.replaceAll(fix.search, fix.replace);
      modified = true;
      fileChanges.push(`  - ${fix.description} (${occurrences} occurrence${occurrences > 1 ? 's' : ''})`);
      changesApplied++;
    }
  });

  if (modified) {
    // Create backup
    const backupPath = `${filePath}.backup`;
    fs.copyFileSync(filePath, backupPath);

    // Write fixed content
    fs.writeFileSync(filePath, content, 'utf-8');

    console.log(`✅ Fixed: ${relativePath}`);
    fileChanges.forEach(change => console.log(change));
    console.log(`   Backup: ${path.relative(projectRoot, backupPath)}\n`);

    changes.push({
      file: relativePath,
      changes: fileChanges,
      backup: path.relative(projectRoot, backupPath)
    });
  } else {
    console.log(`⏭️  Skipped: ${relativePath} (no changes needed)\n`);
  }
}

// Fix 1: Dashboard.tsx - tracker_days.child_id -> child_profile_id
const dashboardPath = path.join(projectRoot, 'src/pages/Dashboard.tsx');
applyFixes(dashboardPath, [
  {
    search: ".eq('child_id', activeChild.id)",
    replace: ".eq('child_profile_id', activeChild.id)",
    description: "Changed tracker_days query from child_id to child_profile_id"
  }
]);

// Fix 2: useUserStats.ts - scripts_usage -> script_usage, posts -> community_posts
const userStatsPath = path.join(projectRoot, 'src/hooks/useUserStats.ts');
applyFixes(userStatsPath, [
  {
    search: ".from('scripts_usage')",
    replace: ".from('script_usage')",
    description: "Changed table name from scripts_usage to script_usage"
  },
  {
    search: ".from('posts')",
    replace: ".from('community_posts')",
    description: "Changed table name from posts to community_posts"
  },
  {
    search: ".eq('author_id', userId)",
    replace: ".eq('user_id', userId)",
    description: "Changed column name from author_id to user_id"
  }
]);

// Summary
console.log('═══════════════════════════════════════════════════════════');
console.log('Summary:');
console.log(`✅ Total changes applied: ${changesApplied}`);
console.log(`📁 Files modified: ${changes.length}`);

if (changes.length > 0) {
  console.log('\n📋 Changes made:');
  changes.forEach(({ file, changes: fileChanges }) => {
    console.log(`\n  ${file}`);
    fileChanges.forEach(change => console.log(change));
  });

  console.log('\n💾 Backups created:');
  changes.forEach(({ file, backup }) => {
    console.log(`  ${file} → ${backup}`);
  });

  console.log('\n⚠️  IMPORTANT:');
  console.log('  1. Test the application to ensure all errors are resolved');
  console.log('  2. If everything works, you can delete the .backup files');
  console.log('  3. If issues occur, restore from backups:');
  console.log('     - Rename .backup files back to original names');
  console.log('  4. Consider applying database migration instead for long-term fix');
  console.log('     - See: docs/DATABASE_FIX_GUIDE.md');
} else {
  console.log('\n✨ All files are already up to date!');
}

console.log('\n═══════════════════════════════════════════════════════════');

// Export changes for programmatic use
export { changes };
