import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RawLesson {
  Title: string;
  Body: string;
}

interface ProcessedLesson {
  day_number: number;
  title: string;
  content: string;
  summary: string;
  estimated_minutes: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { lessons } = await req.json() as { lessons: RawLesson[] };
    
    if (!lessons || !Array.isArray(lessons)) {
      throw new Error('Invalid input: expected { lessons: [...] }');
    }

    console.log(`Processing ${lessons.length} lessons with OpenAI...`);

    const processedLessons: ProcessedLesson[] = [];

    // Process lessons in batches of 5 for efficiency
    const batchSize = 5;
    for (let i = 0; i < lessons.length; i += batchSize) {
      const batch = lessons.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (lesson, batchIndex) => {
        const dayNumber = i + batchIndex + 1;
        
        const prompt = `You are processing lesson content for a parenting course app.

Given this raw lesson:
Title: ${lesson.Title}
Body (HTML): ${lesson.Body.substring(0, 8000)}

Extract and format:
1. Clean title (remove HTML tags, emojis at start, keep concise)
2. Clean, well-formatted HTML content with:
   - Proper headings (h2, h3)
   - Paragraphs with good spacing
   - Lists where appropriate
   - Remove any inline styles, keep semantic HTML only
   - Remove any course navigation elements
3. A 2-3 sentence summary of the key takeaway
4. Estimated reading time in minutes (based on ~200 words per minute)

Return ONLY valid JSON in this exact format:
{
  "title": "Clean title here",
  "content": "<h2>Section</h2><p>Content...</p>",
  "summary": "Brief summary here",
  "estimated_minutes": 5
}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are a helpful assistant that processes and formats educational content. Return only valid JSON.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 4000,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`OpenAI API error for lesson ${dayNumber}:`, errorText);
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Extract JSON from response (handle markdown code blocks)
        let jsonStr = content;
        if (content.includes('```json')) {
          jsonStr = content.split('```json')[1].split('```')[0].trim();
        } else if (content.includes('```')) {
          jsonStr = content.split('```')[1].split('```')[0].trim();
        }

        const parsed = JSON.parse(jsonStr);
        
        return {
          day_number: dayNumber,
          title: parsed.title,
          content: parsed.content,
          summary: parsed.summary,
          estimated_minutes: parsed.estimated_minutes || 5,
        };
      });

      const batchResults = await Promise.all(batchPromises);
      processedLessons.push(...batchResults);
      
      console.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(lessons.length / batchSize)}`);
    }

    console.log(`Successfully processed ${processedLessons.length} lessons`);

    return new Response(JSON.stringify({ lessons: processedLessons }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in process-lessons function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
