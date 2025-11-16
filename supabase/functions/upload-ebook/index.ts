import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  content: Array<{
    type: string;
    content: string | string[];
    level?: number;
    calloutType?: string;
    imageAlt?: string;
  }>;
}

function parseMarkdownToChapters(markdown: string): Chapter[] {
  const lines = markdown.split('\n');
  const chapters: Chapter[] = [];
  let currentChapter: Chapter | null = null;

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
        const level = (trimmed.match(/^(#{1,6})/) || ['', '#'])[1].length;
        const content = trimmed.replace(/^#{1,6}\s+/, '').trim();
        currentChapter.content.push({ type: 'heading', level, content });
      } else if (trimmed.startsWith('[!')) {
        const calloutMatch = trimmed.match(/^\[!(NOTE|WARNING|TIP|SCIENCE)\]\s*(.+)/i);
        if (calloutMatch) {
          const type = calloutMatch[1].toLowerCase();
          const content = calloutMatch[2].trim();
          const calloutTypeMap: Record<string, string> = {
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
          (lastSection.content as string[]).push(content);
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

function calculateStats(chapters: Chapter[]) {
  let totalWords = 0;
  
  chapters.forEach(chapter => {
    chapter.content.forEach(section => {
      if (section.type === 'paragraph' || section.type === 'heading') {
        totalWords += (section.content as string).split(/\s+/).length;
      } else if (section.type === 'list' && Array.isArray(section.content)) {
        section.content.forEach(item => {
          totalWords += item.split(/\s+/).length;
        });
      } else if (section.type === 'callout') {
        totalWords += (section.content as string).split(/\s+/).length;
      }
    });
  });

  const estimatedReadingTime = Math.ceil(totalWords / 200);
  
  return { totalWords, estimatedReadingTime };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { markdown, title, subtitle, slug, coverColor } = await req.json();

    if (!markdown || !title || !slug) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? 'https://iogceaotdodvugrmogpp.supabase.co';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZ2NlYW90ZG9kdnVncm1vZ3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODcwODQsImV4cCI6MjA3NjQ2MzA4NH0.uMAT-RZLc0jh1E03UiDrQ1gnpxfZulZ16OxQpypAGJo';

    const supabaseClient = serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey)
      : createClient(supabaseUrl, anonKey, {
          global: { headers: { authorization: req.headers.get('authorization') ?? '' } }
        });

    const chapters = parseMarkdownToChapters(markdown);
    const { totalWords, estimatedReadingTime } = calculateStats(chapters);

    const ebookData = {
      title,
      subtitle: subtitle || null,
      slug,
      content: chapters,
      markdown_source: markdown,
      total_chapters: chapters.length,
      total_words: totalWords,
      estimated_reading_time: estimatedReadingTime,
      cover_color: coverColor || '#8B5CF6',
      metadata: {
        category: 'Comportamento',
        profile: 'Universal',
        description: subtitle || title,
      }
    };

    const { data: existing } = await supabaseClient
      .from('ebooks')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    let result;
    if (existing) {
      const { data, error } = await supabaseClient
        .from('ebooks')
        .update(ebookData)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      result = { action: 'updated', data };
    } else {
      const { data, error } = await supabaseClient
        .from('ebooks')
        .insert([ebookData])
        .select()
        .single();
      
      if (error) throw error;
      result = { action: 'created', data };
    }

    return new Response(JSON.stringify({
      success: true,
      ...result,
      stats: {
        chapters: chapters.length,
        totalWords,
        estimatedReadingTime,
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error uploading ebook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload ebook';
    return new Response(JSON.stringify({ 
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
