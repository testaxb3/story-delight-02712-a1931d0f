import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 Full Hyper-Specific CSV Upload\n');
console.log('⚠️  IMPORTANT: Make sure you ran the SQL to drop validation triggers first!');
console.log('   (See FIX_SCHEMA_AND_UPLOAD.html)\n');

const csvPath = 'C:\\Users\\gabri\\Downloads\\intense_hygiene_scripts.csv';

console.log('📖 Reading CSV file...');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// CSV Parser (handles quoted multi-line fields)
function parseCSV(text) {
  const lines = [];
  let currentLine = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentLine.push(currentField);
      currentField = '';
    } else if (char === '\n' && !insideQuotes) {
      if (currentField || currentLine.length > 0) {
        currentLine.push(currentField);
        lines.push(currentLine);
        currentLine = [];
        currentField = '';
      }
    } else if (char === '\r' && nextChar === '\n' && !insideQuotes) {
      if (currentField || currentLine.length > 0) {
        currentLine.push(currentField);
        lines.push(currentLine);
        currentLine = [];
        currentField = '';
      }
      i++;
    } else {
      currentField += char;
    }
  }

  if (currentField || currentLine.length > 0) {
    currentLine.push(currentField);
    lines.push(currentLine);
  }

  const headers = lines[0];
  const records = lines.slice(1).map(line => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = line[index] || '';
    });
    return obj;
  });

  return records;
}

const records = parseCSV(csvContent);
console.log(`✅ Found ${records.length} scripts in CSV\n`);

// Check if scripts already exist by title
console.log('🔍 Checking for existing scripts...');
const existingTitles = new Set();
for (const record of records) {
  const { data } = await supabase
    .from('scripts')
    .select('id, title')
    .eq('title', record.title)
    .maybeSingle();

  if (data) {
    existingTitles.add(record.title);
    console.log(`   ⚠️  Already exists: "${record.title}" (ID: ${data.id})`);
  }
}

if (existingTitles.size > 0) {
  console.log(`\n⚠️  ${existingTitles.size} scripts already exist. Skipping duplicates.\n`);
}

// Insert scripts
let inserted = 0;
let skipped = 0;
let failed = 0;

for (const [index, record] of records.entries()) {
  if (existingTitles.has(record.title)) {
    console.log(`⏭️  [${index + 1}/${records.length}] Skipping: "${record.title}"`);
    skipped++;
    continue;
  }

  console.log(`\n📝 [${index + 1}/${records.length}] Processing: "${record.title}"`);

  try {
    // Parse fields
    const tags = record.tags ? record.tags.split(',').map(t => t.trim()) : [];

    let strategySteps = null;
    if (record.strategy_steps) {
      try {
        strategySteps = JSON.parse(record.strategy_steps);
        console.log(`   ✅ Parsed strategy_steps (${strategySteps.length} steps)`);
      } catch (e) {
        console.warn(`   ⚠️  Failed to parse strategy_steps: ${e.message}`);
      }
    }

    let whatToExpect = null;
    if (record.what_to_expect) {
      try {
        whatToExpect = JSON.parse(record.what_to_expect);
        console.log(`   ✅ Parsed what_to_expect`);
      } catch (e) {
        console.warn(`   ⚠️  Failed to parse what_to_expect: ${e.message}`);
      }
    }

    let commonVariations = null;
    if (record.common_variations) {
      try {
        commonVariations = JSON.parse(record.common_variations);
        console.log(`   ✅ Parsed common_variations (${commonVariations.length} variations)`);
      } catch (e) {
        console.warn(`   ⚠️  Failed to parse common_variations: ${e.message}`);
      }
    }

    // Build script data
    const scriptData = {
      // Basic info
      title: record.title,
      category: record.category,
      profile: record.profile,
      tags,

      // Age & difficulty
      age_min: record.age_min ? parseInt(record.age_min) : null,
      age_max: record.age_max ? parseInt(record.age_max) : null,
      difficulty: record.difficulty || null,
      duration_minutes: record.duration_minutes ? parseInt(record.duration_minutes) : null,
      emergency_suitable: record.emergency_suitable === 'true' || record.emergency_suitable === true,

      // NEW HYPER-SPECIFIC STRUCTURE (FULL!)
      the_situation: record.the_situation || null,
      what_doesnt_work: record.what_doesnt_work || null,
      strategy_steps: strategySteps,
      why_this_works: record.why_this_works || null,
      what_to_expect: whatToExpect, // Will be NULL if column type is incompatible
      common_variations: commonVariations,
      parent_state_needed: record.parent_state_needed || null,

      // OLD FIELDS (backward compatibility - extract from strategy_steps)
      phrase_1: strategySteps?.[0]?.what_to_say_examples?.[0] || 'See strategy steps',
      phrase_1_action: strategySteps?.[0]?.step_title || '',
      phrase_2: strategySteps?.[1]?.what_to_say_examples?.[0] || 'See strategy steps',
      phrase_2_action: strategySteps?.[1]?.step_title || '',
      phrase_3: strategySteps?.[2]?.what_to_say_examples?.[0] || 'See strategy steps',
      phrase_3_action: strategySteps?.[2]?.step_title || '',
      wrong_way: record.what_doesnt_work?.split('\n')[0] || 'See what doesn\'t work section',
      neurological_tip: record.why_this_works?.substring(0, 150) || 'See why this works section',
    };

    const { data, error } = await supabase
      .from('scripts')
      .insert(scriptData)
      .select();

    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
      if (error.details) console.error(`      Details: ${error.details}`);
      if (error.hint) console.error(`      Hint: ${error.hint}`);
      failed++;
    } else {
      console.log(`   ✅ Success! ID: ${data[0].id}`);
      inserted++;
    }

  } catch (e) {
    console.error(`   ❌ Unexpected error: ${e.message}`);
    failed++;
  }
}

console.log('\n' + '='.repeat(60));
console.log('📊 Upload Summary:');
console.log(`   ✅ Inserted: ${inserted}`);
console.log(`   ⏭️  Skipped (duplicates): ${skipped}`);
console.log(`   ❌ Failed: ${failed}`);
console.log('='.repeat(60));

if (inserted > 0) {
  console.log('\n🎉 Success! New hyper-specific scripts are ready.');
  console.log('📱 Test them in the app by opening any new INTENSE Hygiene script.');
  console.log('🎨 The new 6-section UI should display automatically.\n');
}

if (failed > 0) {
  console.log('\n⚠️  Some scripts failed to upload.');
  console.log('   Most likely cause: Validation triggers still active.');
  console.log('   👉 Open FIX_SCHEMA_AND_UPLOAD.html and run the SQL to drop triggers.\n');
}
