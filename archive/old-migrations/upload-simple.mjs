import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg4NzA4NCwiZXhwIjoyMDc2NDYzMDg0fQ.UBWhZUiQY0CklVKJonHbnjQRX51PvBaQDKy6-66Q-jU';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('📊 Uploading CSV scripts (simple version)...\n');

const scripts = [
  {
    title: "Toothbrush bristles feel 'scratchy' - clamps mouth shut",
    category: "Hygiene",
    profile: "INTENSE",
    tags: ["toothbrush", "teeth", "hygiene", "oral", "sensory"],
    age_min: 3,
    age_max: 10,
    difficulty: "Moderate",
    duration_minutes: 3,
    emergency_suitable: true,
    the_situation: "Bedtime routine. Time to brush teeth. Child sees the toothbrush and starts backing away, crying, or clamping their mouth shut tight.",
    what_doesnt_work: "• \"Open your mouth RIGHT NOW!\"\n• \"Everyone brushes their teeth!\"\n• Physically forcing their mouth open",
    why_this_works: "INTENSE kids have oral sensory hypersensitivity. Bristles feel like needles.",
    parent_state_needed: "Calm, patient, non-reactive",
    phrase_1: "I know the brush feels scratchy",
    phrase_1_action: "Acknowledge",
    phrase_2: "Teeth need brushing AND we can make it better",
    phrase_2_action: "Validate + boundary",
    phrase_3: "Finger brush or soft cloth. You pick.",
    phrase_3_action: "Give control",
    wrong_way: "Forcing mouth open",
    neurological_tip: "Oral sensitivity is real"
  },
  {
    title: "Water temperature feels 'wrong' - refuses to enter tub",
    category: "Hygiene",
    profile: "INTENSE",
    tags: ["bath", "water", "temperature", "sensory"],
    age_min: 3,
    age_max: 10,
    difficulty: "Moderate",
    duration_minutes: 5,
    emergency_suitable: false,
    the_situation: "Child sees bathwater and freaks out. Says it's too hot/cold even though temperature is normal.",
    what_doesnt_work: "• \"The water is FINE!\"\n• \"Stop being dramatic!\"",
    why_this_works: "Sensory processing overdrive makes normal temps feel wrong.",
    parent_state_needed: "Calm, patient",
    phrase_1: "Yeah, it doesn't feel right to you",
    phrase_1_action: "Acknowledge",
    phrase_2: "You still gotta get clean AND we can adjust",
    phrase_2_action: "Boundary + control",
    phrase_3: "Add cold water yourself. You fix it.",
    phrase_3_action: "Give control",
    wrong_way: "Arguing about temperature",
    neurological_tip: "Temperature sensitivity is neurological"
  },
  {
    title: "Screams when washing hair - water on head feels 'scary'",
    category: "Hygiene",
    profile: "INTENSE",
    tags: ["hair", "washing", "water", "sensory", "bath"],
    age_min: 3,
    age_max: 10,
    difficulty: "Hard",
    duration_minutes: 5,
    emergency_suitable: false,
    the_situation: "Bath time. Time to wash hair. Child starts screaming, covering their head, trying to escape.",
    what_doesnt_work: "• \"Just tilt your head back!\"\n• \"It's just water!\"",
    why_this_works: "Water on scalp triggers sensory overload.",
    parent_state_needed: "Calm, patient, creative",
    phrase_1: "I see water on your head feels scary",
    phrase_1_action: "Acknowledge",
    phrase_2: "Hair needs washing AND we can do it differently",
    phrase_2_action: "Boundary + flexibility",
    phrase_3: "Spray bottle or cup. You control the water.",
    phrase_3_action: "Give control",
    wrong_way: "Pouring water without warning",
    neurological_tip: "Scalp sensitivity is real"
  }
];

for (const [index, script] of scripts.entries()) {
  console.log(`📝 [${index + 1}/3] ${script.title}`);

  const { data, error } = await supabase
    .from('scripts')
    .insert(script)
    .select();

  if (error) {
    console.error(`  ❌ ${error.message}`);
  } else {
    console.log(`  ✅ Success! ID: ${data[0].id}`);
  }
}

console.log('\n🎉 Done!');
