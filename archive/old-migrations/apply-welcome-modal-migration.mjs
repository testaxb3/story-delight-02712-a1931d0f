import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iogceaotdodvugrmogpp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU'
);

console.log('🔧 Applying welcome_modal_shown migration...\n');

// Add column
const { error: alterError } = await supabase.rpc('exec', {
  sql: `
    ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS welcome_modal_shown BOOLEAN DEFAULT FALSE;
  `
});

if (alterError) {
  console.log('❌ Failed to add column:', alterError.message);
  process.exit(1);
}

console.log('✅ Column added successfully\n');

// Update existing users
const { error: updateError } = await supabase.rpc('exec', {
  sql: `
    UPDATE profiles
    SET welcome_modal_shown = TRUE
    WHERE welcome_modal_shown IS NULL OR welcome_modal_shown = FALSE;
  `
});

if (updateError) {
  console.log('❌ Failed to update existing users:', updateError.message);
  process.exit(1);
}

console.log('✅ Existing users updated\n');
console.log('🎉 Migration applied successfully!\n');
