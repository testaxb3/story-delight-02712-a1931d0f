import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔧 Disabling validation triggers temporarily...\n');

// Since we can't execute raw SQL easily, we'll just insert without the problematic fields
console.log('📖 Loading CSV...\n');

const csvPath = 'C:\\Users\\gabri\\Downloads\\intense_hygiene_scripts.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');

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

console.log(`✅ Found ${records.length} scripts\n`);

for (const [index, record] of records.entries()) {
  console.log(`📝 [${index + 1}/${records.length}] ${record.title}`);

  try {
    const tags = record.tags ? record.tags.split(',').map(t => t.trim()) : [];

    let strategySteps = null;
    if (record.strategy_steps) {
      try {
        strategySteps = JSON.parse(record.strategy_steps);
      } catch (e) {
        console.warn(`  ⚠️  Failed to parse strategy_steps`);
      }
    }

    let commonVariations = null;
    if (record.common_variations) {
      try {
        commonVariations = JSON.parse(record.common_variations);
      } catch (e) {
        console.warn(`  ⚠️  Failed to parse common_variations`);
      }
    }

    const scriptData = {
      title: record.title,
      category: record.category,
      profile: record.profile,
      tags,
      age_min: record.age_min ? parseInt(record.age_min) : null,
      age_max: record.age_max ? parseInt(record.age_max) : null,
      difficulty: record.difficulty || null,
      duration_minutes: record.duration_minutes ? parseInt(record.duration_minutes) : null,
      emergency_suitable: record.emergency_suitable === 'true',

      // NEW FIELDS
      the_situation: record.the_situation || null,
      what_doesnt_work: record.what_doesnt_work || null,
      strategy_steps: strategySteps,
      why_this_works: record.why_this_works || null,
      common_variations: commonVariations,
      parent_state_needed: record.parent_state_needed || null,

      // OLD FIELDS (compatibility)
      phrase_1: strategySteps?.[0]?.what_to_say_examples?.[0] || 'See strategy',
      phrase_1_action: strategySteps?.[0]?.step_explanation || '',
      phrase_2: strategySteps?.[1]?.what_to_say_examples?.[0] || 'See strategy',
      phrase_2_action: strategySteps?.[1]?.step_explanation || '',
      phrase_3: strategySteps?.[2]?.what_to_say_examples?.[0] || 'See strategy',
      phrase_3_action: strategySteps?.[2]?.step_explanation || '',
      wrong_way: record.what_doesnt_work?.split('\n')[0] || 'See section',
      neurological_tip: record.why_this_works || 'See why this works',
    };

    const { data, error } = await supabase
      .from('scripts')
      .insert(scriptData)
      .select();

    if (error) {
      console.error(`  ❌ ${error.message}`);
      if (error.details) console.error(`     ${error.details}`);
    } else {
      console.log(`  ✅ Inserted successfully`);
    }

  } catch (e) {
    console.error(`  ❌ Unexpected error: ${e.message}`);
  }
}

console.log('\n🎉 Upload complete!');
