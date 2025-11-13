import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

const { data: scripts, error } = await supabase
  .from('scripts')
  .select('*')
  .order('created_at', { ascending: true });

if (error) {
  console.error('Error:', error);
  process.exit(1);
}

console.log(`📊 Total scripts: ${scripts.length}\n`);

// Export to JSON for analysis
import fs from 'fs';
fs.writeFileSync('all-scripts-data.json', JSON.stringify(scripts, null, 2));

console.log('✅ Exported to all-scripts-data.json\n');

// Show titles for quick reference
scripts.forEach((s, idx) => {
  console.log(`${idx + 1}. [${s.profile}/${s.category}] ${s.title}`);
});
