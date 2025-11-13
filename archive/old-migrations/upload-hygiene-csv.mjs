import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

const csvPath = 'C:\\Users\\gabri\\Downloads\\intense_hygiene_scripts.csv';

console.log('📖 Reading CSV file...');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

console.log('🔍 Parsing CSV manually...');
// Simple CSV parser (handles quoted fields with commas/newlines)
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
        i++; // skip next quote
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
      i++; // skip \n
    } else {
      currentField += char;
    }
  }

  // Push last field/line
  if (currentField || currentLine.length > 0) {
    currentLine.push(currentField);
    lines.push(currentLine);
  }

  // Convert to objects
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

console.log(`✅ Found ${records.length} scripts in CSV`);

for (const [index, record] of records.entries()) {
  console.log(`\n📝 Processing script ${index + 1}/${records.length}: "${record.title}"`);

  try {
    // Parse JSON fields
    const tags = record.tags ? record.tags.split(',').map(t => t.trim()) : [];

    let strategySteps = null;
    if (record.strategy_steps) {
      try {
        strategySteps = JSON.parse(record.strategy_steps);
      } catch (e) {
        console.warn(`  ⚠️  Failed to parse strategy_steps: ${e.message}`);
      }
    }

    let whatToExpect = null;
    if (record.what_to_expect) {
      try {
        whatToExpect = JSON.parse(record.what_to_expect);
        console.log('  📊 what_to_expect type:', typeof whatToExpect, Array.isArray(whatToExpect) ? 'ARRAY' : 'OBJECT');
      } catch (e) {
        console.warn(`  ⚠️  Failed to parse what_to_expect: ${e.message}`);
        console.warn(`  Raw value:`, record.what_to_expect.substring(0, 200));
      }
    }

    let commonVariations = null;
    if (record.common_variations) {
      try {
        commonVariations = JSON.parse(record.common_variations);
      } catch (e) {
        console.warn(`  ⚠️  Failed to parse common_variations: ${e.message}`);
      }
    }

    // Build insert object
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

      // NEW HYPER-SPECIFIC STRUCTURE
      the_situation: record.the_situation || null,
      what_doesnt_work: record.what_doesnt_work || null,
      strategy_steps: strategySteps,
      why_this_works: record.why_this_works || null,
      // what_to_expect is currently an ARRAY in the database (old structure)
      // We'll skip it for now and use the old fields instead
      // what_to_expect: whatToExpect,
      common_variations: commonVariations,
      parent_state_needed: record.parent_state_needed || null,

      // OLD FIELDS (for backward compatibility - extract from strategy_steps if possible)
      phrase_1: strategySteps?.[0]?.what_to_say_examples?.[0] || 'See strategy steps',
      phrase_1_action: strategySteps?.[0]?.step_explanation || '',
      phrase_2: strategySteps?.[1]?.what_to_say_examples?.[0] || 'See strategy steps',
      phrase_2_action: strategySteps?.[1]?.step_explanation || '',
      phrase_3: strategySteps?.[2]?.what_to_say_examples?.[0] || 'See strategy steps',
      phrase_3_action: strategySteps?.[2]?.step_explanation || '',
      wrong_way: record.what_doesnt_work?.split('\n')[0] || 'See what doesn\'t work section',
      neurological_tip: record.why_this_works || 'See why this works section',
    };

    const { data, error } = await supabase
      .from('scripts')
      .insert(scriptData)
      .select();

    if (error) {
      console.error(`  ❌ Error inserting script: ${error.message}`);
      console.error(`  Details:`, error);
    } else {
      console.log(`  ✅ Successfully inserted: ${data[0].title}`);
    }

  } catch (e) {
    console.error(`  ❌ Unexpected error: ${e.message}`);
    console.error(e.stack);
  }
}

console.log('\n🎉 Upload complete!');
