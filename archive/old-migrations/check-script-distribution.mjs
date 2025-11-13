import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

const { data, error } = await supabase
  .from('scripts')
  .select('category, profile, title')
  .order('category');

if (error) {
  console.error('Error:', error);
  process.exit(1);
}

// Count by category
const categoryCount = {};
data.forEach(script => {
  const cat = script.category || 'unknown';
  categoryCount[cat] = (categoryCount[cat] || 0) + 1;
});

console.log('Scripts por categoria:\n');
Object.entries(categoryCount)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .forEach(([cat, count]) => {
    const needed = Math.max(0, 3 - count);
    console.log(`  ${cat}: ${count} scripts ${needed > 0 ? `(PRECISA +${needed})` : '(OK)'}`);
  });

console.log(`\nTotal: ${data.length} scripts\n`);

// Count by profile
const profileCount = {};
data.forEach(script => {
  const prof = script.profile || 'unknown';
  profileCount[prof] = (profileCount[prof] || 0) + 1;
});

console.log('Scripts por perfil:\n');
Object.entries(profileCount)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .forEach(([prof, count]) => {
    console.log(`  ${prof}: ${count}`);
  });

// Distribution matrix
console.log('\n\nMatriz de distribuicao (categoria x perfil):\n');
const matrix = {};
data.forEach(script => {
  const cat = script.category || 'unknown';
  const prof = script.profile || 'unknown';
  if (!matrix[cat]) matrix[cat] = {};
  matrix[cat][prof] = (matrix[cat][prof] || 0) + 1;
});

const profiles = ['INTENSE', 'DISTRACTED', 'DEFIANT'];
console.log('Categoria'.padEnd(20) + profiles.join('  '));
console.log('-'.repeat(50));
Object.entries(matrix)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .forEach(([cat, profs]) => {
    const counts = profiles.map(p => (profs[p] || 0).toString().padStart(8));
    console.log(cat.padEnd(20) + counts.join('  '));
  });
