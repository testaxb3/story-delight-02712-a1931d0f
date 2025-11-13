import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔧 Step 1: Applying migration to add new columns...\n');

const migrationSQL = `
ALTER TABLE scripts
ADD COLUMN IF NOT EXISTS the_situation TEXT,
ADD COLUMN IF NOT EXISTS what_doesnt_work TEXT,
ADD COLUMN IF NOT EXISTS strategy_steps JSONB,
ADD COLUMN IF NOT EXISTS why_this_works TEXT,
ADD COLUMN IF NOT EXISTS what_to_expect JSONB,
ADD COLUMN IF NOT EXISTS common_variations JSONB,
ADD COLUMN IF NOT EXISTS parent_state_needed TEXT,
ADD COLUMN IF NOT EXISTS difficulty TEXT,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;
`;

try {
  // Execute using raw SQL via Supabase REST API
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    },
    body: JSON.stringify({ sql: migrationSQL })
  });

  if (!response.ok) {
    const error = await response.text();
    console.log('⚠️  Migration response:', error);
    console.log('(Columns may already exist - continuing...)\n');
  } else {
    console.log('✅ Migration applied successfully!\n');
  }
} catch (e) {
  console.log('⚠️  Migration may have failed:', e.message);
  console.log('(Columns may already exist - continuing...)\n');
}

console.log('📊 Step 2: Now upload the CSV\n');
console.log('Run: node upload-hygiene-csv.mjs');
