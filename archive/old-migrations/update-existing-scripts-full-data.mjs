import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔄 Updating existing scripts with full hyper-specific data\n');
console.log('⚠️  IMPORTANT: If this fails with validation errors,');
console.log('   open FIX_SCHEMA_AND_UPLOAD.html and run the SQL to drop triggers.\n');

const csvPath = 'C:\\Users\\gabri\\Downloads\\intense_hygiene_scripts.csv';

console.log('📖 Reading CSV file...');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// CSV Parser
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

let updated = 0;
let failed = 0;

for (const [index, record] of records.entries()) {
  console.log(`\n📝 [${index + 1}/${records.length}] Updating: "${record.title}"`);

  try {
    // Find existing script by title
    const { data: existing, error: findError } = await supabase
      .from('scripts')
      .select('id')
      .eq('title', record.title)
      .maybeSingle();

    if (findError || !existing) {
      console.log(`   ⏭️  Script not found, skipping`);
      continue;
    }

    console.log(`   📌 Found ID: ${existing.id}`);

    // Parse JSONB fields
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

    // Update with full data
    const updateData = {
      strategy_steps: strategySteps,
      what_to_expect: whatToExpect,
      common_variations: commonVariations,
      // Also update phrase fields from strategy_steps
      phrase_1: strategySteps?.[0]?.what_to_say_examples?.[0] || 'See strategy steps',
      phrase_1_action: strategySteps?.[0]?.step_title || '',
      phrase_2: strategySteps?.[1]?.what_to_say_examples?.[0] || 'See strategy steps',
      phrase_2_action: strategySteps?.[1]?.step_title || '',
      phrase_3: strategySteps?.[2]?.what_to_say_examples?.[0] || 'See strategy steps',
      phrase_3_action: strategySteps?.[2]?.step_title || '',
    };

    const { data, error } = await supabase
      .from('scripts')
      .update(updateData)
      .eq('id', existing.id)
      .select();

    if (error) {
      console.error(`   ❌ Update failed: ${error.message}`);
      if (error.details) console.error(`      Details: ${error.details}`);
      if (error.hint) console.error(`      Hint: ${error.hint}`);
      failed++;

      // Check if it's a validation trigger error
      if (error.message.includes('strategy_steps') || error.message.includes('what_to_expect')) {
        console.error(`\n   ⚠️  VALIDATION TRIGGER BLOCKING UPDATE!`);
        console.error(`   👉 Open FIX_SCHEMA_AND_UPLOAD.html and run the SQL to drop triggers.\n`);
      }
    } else {
      console.log(`   ✅ Updated successfully!`);
      updated++;
    }

  } catch (e) {
    console.error(`   ❌ Unexpected error: ${e.message}`);
    failed++;
  }
}

console.log('\n' + '='.repeat(60));
console.log('📊 Update Summary:');
console.log(`   ✅ Updated: ${updated}`);
console.log(`   ❌ Failed: ${failed}`);
console.log('='.repeat(60));

if (updated > 0) {
  console.log('\n🎉 Success! Scripts now have complete hyper-specific data.');
  console.log('📱 Refresh the app and open any INTENSE Hygiene script to see the new UI.\n');
}

if (failed > 0) {
  console.log('\n⚠️  Updates failed - likely due to validation triggers.');
  console.log('   Solution: Open FIX_SCHEMA_AND_UPLOAD.html in your browser');
  console.log('   and run the SQL to drop the triggers, then run this script again.\n');
}
