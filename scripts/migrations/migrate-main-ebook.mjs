import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '../..');

// Load environment variables
dotenv.config({ path: resolve(rootDir, '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://iogceaotdodvugrmogpp.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Calculate total words in chapters
 */
function countWords(chapters) {
  let totalWords = 0;
  
  chapters.forEach(chapter => {
    chapter.content.forEach(section => {
      if (typeof section.content === 'string') {
        totalWords += section.content.split(/\s+/).length;
      } else if (Array.isArray(section.content)) {
        section.content.forEach(item => {
          if (typeof item === 'string') {
            totalWords += item.split(/\s+/).length;
          }
        });
      }
    });
  });
  
  return totalWords;
}

/**
 * Calculate reading time (200 words per minute)
 */
function calculateReadingTime(totalWords) {
  return Math.ceil(totalWords / 200);
}

async function migrateMainEbook() {
  try {
    console.log('🚀 Starting main ebook migration...\n');

    // Read the ebook content file
    const ebookContentPath = resolve(rootDir, 'src/data/ebookContent.ts');
    console.log('📖 Reading ebook content from:', ebookContentPath);
    
    const fileContent = readFileSync(ebookContentPath, 'utf-8');
    
    // Extract the ebookContent array using regex
    const match = fileContent.match(/export const ebookContent(?::\s*Chapter\[\])?\s*=\s*(\[[\s\S]*?\]);/);
    
    if (!match) {
      throw new Error('Could not extract ebookContent from file');
    }
    
    // Parse the chapters (this is a bit tricky since it's TypeScript)
    // We'll need to evaluate it safely
    const chaptersString = match[1];
    const chapters = eval(chaptersString);
    
    console.log(`✅ Loaded ${chapters.length} chapters from ebookContent.ts\n`);

    // Calculate statistics
    const totalWords = countWords(chapters);
    const estimatedReadingTime = calculateReadingTime(totalWords);
    
    console.log('📊 Ebook Statistics:');
    console.log(`   - Total Chapters: ${chapters.length}`);
    console.log(`   - Total Words: ${totalWords}`);
    console.log(`   - Estimated Reading Time: ${estimatedReadingTime} minutes\n`);

    // Prepare ebook data
    const ebookData = {
      title: 'Why Your Child Acts This Way',
      subtitle: 'Complete Interactive Ebook',
      slug: 'why-your-child-acts-this-way',
      content: chapters,
      total_chapters: chapters.length,
      total_words: totalWords,
      estimated_reading_time: estimatedReadingTime,
      cover_color: '#8b5cf6',
      thumbnail_url: '/ebook-cover.png',
      updated_at: new Date().toISOString()
    };

    // Check if ebook already exists
    const { data: existing, error: fetchError } = await supabase
      .from('ebooks')
      .select('id, title')
      .eq('slug', ebookData.slug)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existing) {
      // Update existing ebook
      console.log(`📝 Updating existing ebook: ${existing.title} (ID: ${existing.id})`);
      
      const { error: updateError } = await supabase
        .from('ebooks')
        .update(ebookData)
        .eq('id', existing.id);

      if (updateError) throw updateError;
      
      console.log('✅ Ebook updated successfully!\n');
    } else {
      // Insert new ebook
      console.log('📝 Inserting new ebook...');
      
      const { data: inserted, error: insertError } = await supabase
        .from('ebooks')
        .insert(ebookData)
        .select()
        .single();

      if (insertError) throw insertError;
      
      console.log(`✅ Ebook inserted successfully! (ID: ${inserted.id})\n`);
    }

    console.log('🎉 Migration completed successfully!');
    console.log('\n📚 You can now view the complete ebook in the library.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateMainEbook();
