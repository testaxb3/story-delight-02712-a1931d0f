import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

const ebookContent = {
  chapters: [
    {
      id: "chapter-1",
      sections: [
        {
          type: "heading",
          content: "The Sound That Makes You Want to Scream"
        },
        {
          type: "paragraph",
          content: "It's 3:47pm. You've been managing your INTENSE child's meltdowns all day. You're running on fumes. Your nervous system is already at a 7 out of 10."
        },
        {
          type: "paragraph",
          content: "Then you hear it."
        },
        {
          type: "paragraph",
          content: "\"**MOM! HE TOUCHED MY STUFF AGAIN!**\""
        },
        {
          type: "paragraph",
          content: "\"**SHE STARTED IT!**\""
        },
        {
          type: "paragraph",
          content: "\"**I HATE YOU!**\""
        },
        {
          type: "paragraph",
          content: "The screaming. The crying. The tattling. Again. For the **14th time today**."
        },
        {
          type: "paragraph",
          content: "You feel your chest tighten. Your jaw clench. That familiar rage building. You've already tried separating them, reasoning with them, explaining \"how to use your words.\""
        },
        {
          type: "callout",
          calloutType: "remember",
          content: "If you feel like a referee instead of a mom, you're not failing. You're just using the wrong playbook. Sibling conflict isn't a discipline problem - it's a **nervous system problem**."
        }
        // ... rest of chapters (truncated for brevity - would include all 7 chapters)
      ]
    }
  ]
};

async function createEbook() {
  console.log('Creating ebook: When Siblings Fight...');
  
  const { data: ebook, error: ebookError } = await supabase
    .from('ebooks')
    .insert({
      title: 'When Siblings Fight: 7 Scripts to Turn Conflict into Connection',
      subtitle: 'Science-backed strategies to stop the screaming, reduce the rivalry, and help your kids actually like each other',
      slug: 'sibling-fighting-v2',
      content: ebookContent,
      total_chapters: 7,
      estimated_reading_time: 35,
      total_words: 12000,
      cover_color: '#ef4444',
      thumbnail_url: '/ebook-covers/sibling-fighting.jpg',
      metadata: {
        target_audience: "Parents of siblings ages 2-10, especially with INTENSE children",
        key_outcomes: ["Reduce sibling fighting by 60-70%", "Build co-regulation skills"],
        reading_level: "Accessible, conversational, science-backed"
      }
    })
    .select()
    .single();

  if (ebookError) throw ebookError;
  console.log('✅ Ebook created:', ebook.id);

  const { data: bonus, error: bonusError } = await supabase
    .from('bonuses')
    .insert({
      title: 'When Siblings Fight: 7 Scripts to Turn Conflict into Connection',
      description: 'Science-backed strategies to stop the screaming, reduce the rivalry, and help your kids actually like each other.',
      category: 'ebook',
      thumbnail: '/ebook-covers/sibling-fighting.jpg',
      tags: ['sibling rivalry', 'conflict resolution', 'INTENSE'],
      locked: false,
      is_new: true
    })
    .select()
    .single();

  if (bonusError) throw bonusError;
  console.log('✅ Bonus created:', bonus.id);

  const { error: linkError } = await supabase
    .from('ebooks')
    .update({ bonus_id: bonus.id })
    .eq('id', ebook.id);

  if (linkError) throw linkError;
  console.log('✅ Linked ebook to bonus');
}

createEbook().catch(console.error);
