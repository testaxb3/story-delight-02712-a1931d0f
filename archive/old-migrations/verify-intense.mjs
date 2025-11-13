import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

const { data } = await supabase
  .from('scripts')
  .select('profile, category')
  .eq('profile', 'INTENSE')
  .order('category');

const cats = {};
data.forEach(s => {
  cats[s.category] = (cats[s.category] || 0) + 1;
});

console.log('\n📊 INTENSE Scripts by Category:\n');
Object.entries(cats).sort().forEach(([cat, count]) => {
  const status = count >= 4 ? '✅' : '⚠️';
  console.log(`  ${status} ${cat}: ${count}/4`);
});

console.log(`\n📈 Total INTENSE scripts: ${data.length}\n`);
