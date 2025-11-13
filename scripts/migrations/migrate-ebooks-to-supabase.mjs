import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Make sure to set these in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Simple markdown parser (inline version of markdownToChapters)
function parseMarkdownToChapters(markdown) {
  const lines = markdown.split('\n');
  const chapters = [];
  let currentChapter = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Chapter detection
    if (trimmed.match(/^##\s+CHAPTER\s+\d+:/i)) {
      if (currentChapter) {
        chapters.push(currentChapter);
      }

      const titleMatch = trimmed.match(/^##\s+CHAPTER\s+\d+:\s*(.+)/i);
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

    // If no chapter yet, create intro
    if (!currentChapter) {
      currentChapter = {
        id: 'intro',
        title: 'Introduction',
        content: [],
      };
    }

    // Simple content parsing
    if (trimmed) {
      if (trimmed.match(/^#{1,6}\s+/)) {
        const level = trimmed.match(/^(#{1,6})/)[1].length;
        const content = trimmed.replace(/^#{1,6}\s+/, '').trim();
        currentChapter.content.push({
          type: 'heading',
          level,
          content,
        });
      } else if (trimmed.startsWith('> [!')) {
        const calloutMatch = trimmed.match(/^>\s*\[!(NOTE|WARNING|TIP|SCIENCE)\]\s*(.+)/i);
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
          currentChapter.content.push({
            type: 'list',
            content: [content],
          });
        }
      } else if (trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)/)) {
        const match = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
        currentChapter.content.push({
          type: 'image',
          content: match[2],
          imageAlt: match[1] || 'Image',
        });
      } else {
        currentChapter.content.push({
          type: 'paragraph',
          content: trimmed,
        });
      }
    }
  }

  if (currentChapter) {
    chapters.push(currentChapter);
  }

  return chapters;
}

// Calculate stats
function calculateStats(chapters) {
  let totalWords = 0;

  chapters.forEach(chapter => {
    chapter.content.forEach(section => {
      if (typeof section.content === 'string') {
        totalWords += section.content.split(/\s+/).length;
      } else if (Array.isArray(section.content)) {
        section.content.forEach(item => {
          totalWords += item.split(/\s+/).length;
        });
      }
    });
  });

  return {
    totalWords,
    estimatedTime: Math.ceil(totalWords / 200), // 200 words/min
  };
}

// Ebooks to migrate
const EBOOKS_TO_MIGRATE = [
  {
    file: 'ebooks/EBOOK_1_ROUTINE_BUILDER.md',
    title: 'The Ultimate Routine Builder',
    subtitle: 'Build unbreakable routines in 7 days',
    slug: 'routine-builder',
    thumbnail: '/ebook-cover.png',
    coverColor: '#8b5cf6',
  },
  {
    file: 'ebooks/EBOOK_2_INDEPENDENT_PLAY.md',
    title: 'Independent Play Mastery',
    subtitle: 'From clingy to confident in 14 days',
    slug: 'independent-play',
    thumbnail: '/ebook-cover.png',
    coverColor: '#3b82f6',
  },
  {
    file: 'ebooks/EBOOK_3_WHAT_ARE_YOU_AFRAID_OF.md',
    title: 'Overcoming Childhood Fears',
    subtitle: 'Evidence-based strategies for anxious kids',
    slug: 'childhood-fears',
    thumbnail: '/ebook-cover.png',
    coverColor: '#10b981',
  },
];

async function migrateEbook(ebookConfig) {
  console.log(`\n🔄 Migrando: ${ebookConfig.title}`);
  
  try {
    // Read markdown file
    const projectRoot = join(__dirname, '../..');
    const filePath = join(projectRoot, ebookConfig.file);
    const markdown = await readFile(filePath, 'utf-8');
    console.log(`✅ Arquivo lido: ${markdown.length} caracteres`);
    
    // Parse to chapters
    const chapters = parseMarkdownToChapters(markdown);
    console.log(`✅ ${chapters.length} capítulos parseados`);
    
    // Calculate stats
    const { totalWords, estimatedTime } = calculateStats(chapters);
    console.log(`✅ ${totalWords} palavras, ~${estimatedTime} minutos de leitura`);
    
    // Check if ebook already exists
    const { data: existing } = await supabase
      .from('ebooks')
      .select('id')
      .eq('slug', ebookConfig.slug)
      .maybeSingle();

    if (existing) {
      console.log(`⚠️  Ebook já existe com ID: ${existing.id}`);
      console.log(`   Pulando para evitar duplicatas...`);
      return existing;
    }
    
    // Insert into Supabase
    const { data: ebook, error: insertError } = await supabase
      .from('ebooks')
      .insert({
        title: ebookConfig.title,
        subtitle: ebookConfig.subtitle,
        slug: ebookConfig.slug,
        content: chapters,
        markdown_source: markdown,
        thumbnail_url: ebookConfig.thumbnail,
        cover_color: ebookConfig.coverColor,
        total_chapters: chapters.length,
        estimated_reading_time: estimatedTime,
        total_words: totalWords,
      })
      .select()
      .single();
    
    if (insertError) throw insertError;
    console.log(`✅ Ebook inserido com ID: ${ebook.id}`);
    
    // Create bonus vinculado (se não existir)
    const { data: existingBonus } = await supabase
      .from('bonuses')
      .select('id')
      .eq('title', ebookConfig.title)
      .maybeSingle();
    
    if (!existingBonus) {
      const { data: bonus, error: bonusError } = await supabase
        .from('bonuses')
        .insert({
          title: ebookConfig.title,
          description: ebookConfig.subtitle,
          category: 'ebook',
          is_locked: false,
          order_index: 0,
        })
        .select()
        .single();
      
      if (bonusError) throw bonusError;
      
      // Vincular ebook ao bonus
      await supabase
        .from('ebooks')
        .update({ bonus_id: bonus.id })
        .eq('id', ebook.id);
      
      console.log(`✅ Bonus criado e vinculado: ${bonus.id}`);
    } else {
      // Vincular ao bonus existente
      await supabase
        .from('ebooks')
        .update({ bonus_id: existingBonus.id })
        .eq('id', ebook.id);
      
      console.log(`✅ Vinculado ao bonus existente: ${existingBonus.id}`);
    }
    
    console.log(`✅ Migração completa para: ${ebookConfig.title}\n`);
    return ebook;
    
  } catch (error) {
    console.error(`❌ Erro ao migrar ${ebookConfig.title}:`, error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Iniciando migração de ebooks para Supabase...\n');
  console.log('📋 Ebooks a migrar:');
  EBOOKS_TO_MIGRATE.forEach((config, i) => {
    console.log(`   ${i + 1}. ${config.title}`);
  });
  console.log('');
  
  const results = [];
  
  for (const config of EBOOKS_TO_MIGRATE) {
    try {
      const result = await migrateEbook(config);
      results.push({ success: true, config, result });
    } catch (error) {
      results.push({ success: false, config, error });
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DA MIGRAÇÃO');
  console.log('='.repeat(60));
  
  const successes = results.filter(r => r.success);
  const failures = results.filter(r => !r.success);
  
  console.log(`✅ Sucesso: ${successes.length}/${results.length}`);
  console.log(`❌ Falhas: ${failures.length}/${results.length}`);
  
  if (failures.length > 0) {
    console.log('\n❌ Ebooks que falharam:');
    failures.forEach(f => {
      console.log(`   - ${f.config.title}`);
      console.log(`     Erro: ${f.error.message}`);
    });
  }
  
  console.log('\n✅ Migração concluída!');
  console.log('\n🔍 Verifique no Supabase Dashboard:');
  console.log('   1. Tabela: ebooks');
  console.log('   2. Tabela: bonuses');
  console.log('   3. View: ebooks_with_stats');
  console.log('\n📱 Agora você pode testar o leitor dinâmico de ebooks no app!\n');
}

main().catch(error => {
  console.error('\n❌ Erro fatal:', error);
  process.exit(1);
});
