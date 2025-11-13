import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

async function deleteDuplicates() {
  console.log('🔍 Finding and deleting duplicate scripts...\n');

  const { data: allScripts } = await supabase
    .from('scripts')
    .select('id, title, profile, category, created_at')
    .order('created_at', { ascending: true }); // Keep oldest

  // Group by title + profile + category
  const groups = {};
  allScripts.forEach(script => {
    const key = `${script.title}|||${script.profile}|||${script.category}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(script);
  });

  // Find duplicates (keep oldest, delete rest)
  const toDelete = [];
  let duplicateGroups = 0;

  Object.entries(groups).forEach(([key, scripts]) => {
    if (scripts.length > 1) {
      duplicateGroups++;
      const [title, profile, category] = key.split('|||');

      console.log(`📋 Found ${scripts.length} copies of "${title}" (${profile}/${category})`);
      console.log(`   Keeping: ${scripts[0].id} (created ${scripts[0].created_at})`);

      // Delete all except the first (oldest)
      for (let i = 1; i < scripts.length; i++) {
        console.log(`   ❌ Deleting: ${scripts[i].id} (created ${scripts[i].created_at})`);
        toDelete.push(scripts[i].id);
      }
      console.log('');
    }
  });

  if (toDelete.length === 0) {
    console.log('✅ No duplicates found!\n');
    return;
  }

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 SUMMARY:`);
  console.log(`   Duplicate groups: ${duplicateGroups}`);
  console.log(`   Scripts to delete: ${toDelete.length}`);
  console.log(`   Scripts to keep: ${allScripts.length - toDelete.length}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  console.log('🗑️  Deleting duplicates...\n');

  let deleted = 0;
  let failed = 0;

  for (const id of toDelete) {
    const { error } = await supabase
      .from('scripts')
      .delete()
      .eq('id', id);

    if (error) {
      console.log(`❌ Failed to delete ${id}: ${error.message}`);
      failed++;
    } else {
      deleted++;
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ DELETION COMPLETE:`);
  console.log(`   ✅ Deleted: ${deleted}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  // Verify final count
  const { count } = await supabase
    .from('scripts')
    .select('id', { count: 'exact', head: true });

  console.log(`📊 Final count: ${count} unique scripts\n`);
}

deleteDuplicates();
