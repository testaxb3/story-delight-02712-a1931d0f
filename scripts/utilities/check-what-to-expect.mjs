import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWhatToExpect() {
  console.log('\n🔍 Checking What to Expect data across all scripts...\n');

  const { data: scripts, error } = await supabase
    .from('scripts')
    .select('id, title, profile, what_to_expect')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching scripts:', error);
    return;
  }

  console.log(`📊 Total scripts found: ${scripts.length}\n`);

  let missingData = [];
  let hasData = [];
  let invalidFormat = [];

  scripts.forEach(script => {
    if (!script.what_to_expect) {
      missingData.push(script);
    } else {
      try {
        const wte = script.what_to_expect;

        // Check if it has the required fields
        if (!wte.first_30_seconds || !wte.this_is_success || !wte.dont_expect) {
          invalidFormat.push({
            ...script,
            issue: 'Missing required fields',
            fields: {
              has_first_30_seconds: !!wte.first_30_seconds,
              has_middle_field: !!(wte.by_90_seconds || wte.by_2_minutes || wte.by_3_minutes || wte.by_x_weeks || wte.first_few_weeks),
              has_this_is_success: !!wte.this_is_success,
              has_dont_expect: !!wte.dont_expect,
              actual_keys: Object.keys(wte)
            }
          });
        } else {
          hasData.push({
            ...script,
            fields: {
              has_first_30_seconds: !!wte.first_30_seconds,
              has_middle_field: !!(wte.by_90_seconds || wte.by_2_minutes || wte.by_3_minutes || wte.by_x_weeks || wte.first_few_weeks),
              middle_field_name: wte.by_90_seconds ? 'by_90_seconds' :
                                  wte.by_2_minutes ? 'by_2_minutes' :
                                  wte.by_3_minutes ? 'by_3_minutes' :
                                  wte.by_x_weeks ? 'by_x_weeks' :
                                  wte.first_few_weeks ? 'first_few_weeks' : 'NONE',
              has_this_is_success: !!wte.this_is_success,
              has_dont_expect: !!wte.dont_expect
            }
          });
        }
      } catch (e) {
        invalidFormat.push({
          ...script,
          issue: 'Parse error: ' + e.message
        });
      }
    }
  });

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (missingData.length > 0) {
    console.log(`❌ Scripts with NO what_to_expect data: ${missingData.length}`);
    missingData.forEach(s => {
      console.log(`   - ID ${s.id}: "${s.title}" (${s.profile})`);
    });
    console.log('');
  }

  if (invalidFormat.length > 0) {
    console.log(`⚠️  Scripts with INVALID/INCOMPLETE what_to_expect: ${invalidFormat.length}`);
    invalidFormat.forEach(s => {
      console.log(`   - ID ${s.id}: "${s.title}" (${s.profile})`);
      if (s.issue) {
        console.log(`     Issue: ${s.issue}`);
      }
      if (s.fields) {
        console.log(`     Fields:`, JSON.stringify(s.fields, null, 2));
      }
    });
    console.log('');
  }

  if (hasData.length > 0) {
    console.log(`✅ Scripts with COMPLETE what_to_expect: ${hasData.length}`);

    // Group by middle field name
    const byMiddleField = hasData.reduce((acc, s) => {
      const fieldName = s.fields.middle_field_name;
      if (!acc[fieldName]) acc[fieldName] = [];
      acc[fieldName].push(s);
      return acc;
    }, {});

    Object.entries(byMiddleField).forEach(([fieldName, scripts]) => {
      console.log(`   ${fieldName}: ${scripts.length} scripts`);
    });
    console.log('');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Show detailed breakdown
  console.log('📋 DETAILED BREAKDOWN:\n');

  console.log('Scripts with complete data:');
  hasData.forEach(s => {
    console.log(`   ✅ ID ${s.id}: "${s.title}"`);
    console.log(`      Middle field: ${s.fields.middle_field_name}`);
  });
  console.log('');

  if (invalidFormat.length > 0) {
    console.log('Scripts with issues:');
    invalidFormat.forEach(s => {
      console.log(`   ⚠️  ID ${s.id}: "${s.title}"`);
      console.log(`      ${s.issue}`);
      if (s.fields) {
        console.log(`      Actual keys: ${s.fields.actual_keys.join(', ')}`);
      }
    });
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

checkWhatToExpect();
