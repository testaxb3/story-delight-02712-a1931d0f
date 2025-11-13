import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔧 Fixing "Why This Works" field from CSV...\n');

const csvPath = 'C:\\Users\\gabri\\Downloads\\intense_hygiene_scripts.csv';
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
      .select('id, why_this_works')
      .eq('title', record.title)
      .maybeSingle();

    if (findError || !existing) {
      console.log(`   ⏭️  Not found, skipping`);
      continue;
    }

    console.log(`   📌 Found ID: ${existing.id}`);
    console.log(`   📏 Current length: ${existing.why_this_works?.length || 0} chars`);
    console.log(`   📏 CSV length: ${record.why_this_works?.length || 0} chars`);

    // Update with full why_this_works from CSV
    const { data, error } = await supabase
      .from('scripts')
      .update({
        why_this_works: record.why_this_works || null,
        // Also update related text fields
        the_situation: record.the_situation || null,
        what_doesnt_work: record.what_doesnt_work || null,
        parent_state_needed: record.parent_state_needed || null,
      })
      .eq('id', existing.id)
      .select();

    if (error) {
      console.error(`   ❌ Failed: ${error.message}`);
      failed++;
    } else {
      console.log(`   ✅ Updated! New length: ${data[0].why_this_works?.length || 0} chars`);
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
  console.log('\n🎉 "Why This Works" now has full neurological explanations!');
  console.log('📱 Refresh the app and expand the section to see complete content.\n');
}
