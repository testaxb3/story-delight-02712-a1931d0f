import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = 'https://iogceaotdodvugrmogpp.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ Missing VITE_SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function parseMarkdownToChapters(markdown) {
  const lines = markdown.split('\n');
  const chapters = [];
  let currentChapter = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.match(/^##\s+Chapter\s+\d+:/i)) {
      if (currentChapter) {
        chapters.push(currentChapter);
      }

      const titleMatch = trimmed.match(/^##\s+Chapter\s+\d+:\s*(.+)/i);
      const title = titleMatch ? titleMatch[1].trim() : trimmed.replace(/^##\s+/i, '').trim();
      
      let subtitle;
      if (i + 1 < lines.length && lines[i + 1].trim() && !lines[i + 1].trim().startsWith('#')) {
        subtitle = lines[i + 1].trim();
        i++;
      }

      currentChapter = {
        id: `chapter-${chapters.length}`,
        title,
        subtitle,
        content: [],
      };
      continue;
    }

    if (!currentChapter) {
      currentChapter = {
        id: 'intro',
        title: 'Introduction',
        content: [],
      };
    }

    if (trimmed) {
      if (trimmed.match(/^#{1,6}\s+/)) {
        const level = trimmed.match(/^(#{1,6})/)[1].length;
        const content = trimmed.replace(/^#{1,6}\s+/, '').trim();
        currentChapter.content.push({ type: 'heading', level, content });
      } else if (trimmed.startsWith('[!')) {
        const calloutMatch = trimmed.match(/^\[!(NOTE|WARNING|TIP|SCIENCE)\]\s*(.+)/i);
        if (calloutMatch) {
          const type = calloutMatch[1].toLowerCase();
          const content = calloutMatch[2].trim();
          const calloutTypeMap = {
            note: 'remember',
            warning: 'warning',
            tip: 'try',
            science: 'science',
          };
          currentChapter.content.push({
            type: 'callout',
            calloutType: calloutTypeMap[type] || 'remember',
            content,
          });
        }
      } else if (trimmed.match(/^[-*•]\s+/) || trimmed.match(/^\d+\.\s+/)) {
        const content = trimmed.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '').trim();
        const lastSection = currentChapter.content[currentChapter.content.length - 1];
        if (lastSection && lastSection.type === 'list') {
          lastSection.content.push(content);
        } else {
          currentChapter.content.push({ type: 'list', content: [content] });
        }
      } else {
        currentChapter.content.push({ type: 'paragraph', content: trimmed });
      }
    }
  }

  if (currentChapter) {
    chapters.push(currentChapter);
  }

  return chapters;
}

function calculateStats(chapters) {
  let totalWords = 0;
  
  chapters.forEach(chapter => {
    chapter.content.forEach(section => {
      if (section.type === 'paragraph' || section.type === 'heading') {
        totalWords += section.content.split(/\s+/).length;
      } else if (section.type === 'list' && Array.isArray(section.content)) {
        section.content.forEach(item => {
          totalWords += item.split(/\s+/).length;
        });
      } else if (section.type === 'callout') {
        totalWords += section.content.split(/\s+/).length;
      }
    });
  });

  const estimatedReadingTime = Math.ceil(totalWords / 200);
  
  return { totalWords, estimatedReadingTime };
}

async function uploadEbook() {
  console.log('📘 Uploading "The Meltdown Decoder" to database...\n');

  const markdownPath = join(__dirname, '../../ebooks/EBOOK_5_MELTDOWN_DECODER.md');
  const markdown = await readFile(markdownPath, 'utf-8');

  const chapters = parseMarkdownToChapters(markdown);
  const { totalWords, estimatedReadingTime } = calculateStats(chapters);

  console.log(`✅ Parsed: ${chapters.length} chapters`);
  console.log(`✅ Total words: ${totalWords}`);
  console.log(`✅ Reading time: ${estimatedReadingTime} minutes\n`);

  const ebookData = {
    title: 'The Meltdown Decoder',
    subtitle: 'What Your Child\'s Behavior Is Really Telling You',
    slug: 'meltdown-decoder',
    content: chapters,
    markdown_source: markdown,
    total_chapters: chapters.length,
    total_words: totalWords,
    estimated_reading_time: estimatedReadingTime,
    cover_color: '#8B5CF6',
    metadata: {
      category: 'Comportamento',
      profile: 'Universal',
      description: 'A practical guide to understanding and responding to challenging behavior in neurodivergent children',
    }
  };

  const { data: existing } = await supabase
    .from('ebooks')
    .select('id')
    .eq('slug', ebookData.slug)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('ebooks')
      .update(ebookData)
      .eq('id', existing.id);

    if (error) {
      console.error('❌ Error updating ebook:', error);
      process.exit(1);
    }
    console.log('✅ Ebook updated successfully!');
  } else {
    const { error } = await supabase
      .from('ebooks')
      .insert([ebookData]);

    if (error) {
      console.error('❌ Error inserting ebook:', error);
      process.exit(1);
    }
    console.log('✅ Ebook inserted successfully!');
  }

  console.log('\n🎉 Done! Ebook is now in the database.');
  console.log('📖 View it at: /ebooks/meltdown-decoder');
}

uploadEbook();
