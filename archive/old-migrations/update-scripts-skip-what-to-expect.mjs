import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔄 Updating existing scripts (skipping what_to_expect for now)\n');

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
  console.log(`\n📝 [${index + 1}/${records.length}] "${record.title}"`);

  try {
    // Find existing script
    const { data: existing, error: findError } = await supabase
      .from('scripts')
      .select('id')
      .eq('title', record.title)
      .maybeSingle();

    if (findError || !existing) {
      console.log(`   ⏭️  Not found, skipping`);
      continue;
    }

    console.log(`   📌 Found ID: ${existing.id}`);

    // Parse JSONB fields
    let strategySteps = null;
    if (record.strategy_steps) {
      try {
        strategySteps = JSON.parse(record.strategy_steps);
        console.log(`   ✅ strategy_steps: ${strategySteps.length} steps`);
      } catch (e) {
        console.warn(`   ⚠️  Parse error: ${e.message}`);
      }
    }

    let commonVariations = null;
    if (record.common_variations) {
      try {
        commonVariations = JSON.parse(record.common_variations);
        console.log(`   ✅ common_variations: ${commonVariations.length} variations`);
      } catch (e) {
        console.warn(`   ⚠️  Parse error: ${e.message}`);
      }
    }

    // Update WITHOUT what_to_expect (column type incompatible)
    const updateData = {
      strategy_steps: strategySteps,
      common_variations: commonVariations,
      // Update old phrase fields from strategy_steps
      phrase_1: strategySteps?.[0]?.what_to_say_examples?.[0] || null,
      phrase_1_action: strategySteps?.[0]?.step_title || null,
      phrase_2: strategySteps?.[1]?.what_to_say_examples?.[0] || null,
      phrase_2_action: strategySteps?.[1]?.step_title || null,
      phrase_3: strategySteps?.[2]?.what_to_say_examples?.[0] || null,
      phrase_3_action: strategySteps?.[2]?.step_title || null,
    };

    const { data, error } = await supabase
      .from('scripts')
      .update(updateData)
      .eq('id', existing.id)
      .select();

    if (error) {
      console.error(`   ❌ Failed: ${error.message}`);
      if (error.details) console.error(`      ${error.details}`);
      failed++;
    } else {
      console.log(`   ✅ Updated!`);
      updated++;
    }

  } catch (e) {
    console.error(`   ❌ Error: ${e.message}`);
    failed++;
  }
}

console.log('\n' + '='.repeat(60));
console.log('📊 Results:');
console.log(`   ✅ Updated: ${updated}`);
console.log(`   ❌ Failed: ${failed}`);
console.log('='.repeat(60));

if (updated > 0) {
  console.log('\n🎉 Success! Scripts now have:');
  console.log('   ✅ strategy_steps (3-step framework with examples)');
  console.log('   ✅ common_variations (situational responses)');
  console.log('   ⚠️  what_to_expect still empty (column type issue)');
  console.log('\n📱 Test in app: Open any INTENSE Hygiene script to see new UI!\n');
}

if (failed > 0) {
  console.log('\n⚠️  Some updates failed.');
  console.log('   Check FIX_SCHEMA_AND_UPLOAD.html for troubleshooting.\n');
}
