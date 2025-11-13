import { supabase } from "@/integrations/supabase/client";
import { parseMarkdownToChapters, calculateReadingTime, countWords } from "@/utils/markdownToChapters";

interface EbookSeed {
  title: string;
  subtitle: string;
  slug: string;
  markdown: string;
  coverColor: string;
}

const EBOOK_SEEDS: EbookSeed[] = [
  {
    title: "The Ultimate Routine Builder",
    subtitle: "Build unbreakable routines in 7 days",
    slug: "routine-builder",
    coverColor: "#8b5cf6",
    markdown: `# 📘 EBOOK 1: How to Build Your Children's Routine
## The Visual System That Makes Kids Clean Up Without Being Asked

## CHAPTER 1: The Magic of Routines
The Pizza vs Education Paradox

A well-structured routine is worth more than any parenting course you'll ever buy. Instead of nagging 50 times, you get independent children who check their routine chart and complete tasks proudly.

## CHAPTER 2: Why Traditional Routines Fail
Learn the 4 critical mistakes parents make with routines.

## CHAPTER 3: The Routine Chart Technique
Visual + Autonomy + Gamification = Automatic Obedience

## CHAPTER 4: Building Your First Routine
Step-by-step implementation guide for success.

## CHAPTER 5: Morning Routine Template
Ready-to-use morning routines that work.

## CHAPTER 6: Evening Routine Template
Bedtime made easy with proven templates.

## CHAPTER 7: Weekend Routine Template
Structure for free days without fights.

## CHAPTER 8: Troubleshooting Common Issues
Solutions for resistance and setbacks.

## CHAPTER 9: Success Stories
Real parent transformations and results.

## CHAPTER 10: Printable Routine Charts
Bonus templates you can use today.`
  },
  {
    title: "Independent Play Mastery",
    subtitle: "From clingy to confident in 14 days",
    slug: "independent-play",
    coverColor: "#3b82f6",
    markdown: `# 📘 EBOOK 2: How to Teach Your Child to Play Alone
## Screen-Free Games That Foster Imagination & Build Intelligence

## CHAPTER 1: The Screen Addiction Crisis
The Uncomfortable Truth

Every hour of screen time = 30% reduction in creative play. Learn why we never taught our children HOW to play alone.

## CHAPTER 2: Why "Go Play!" Doesn't Work
The 4 mistakes parents make when trying to encourage independent play.

## CHAPTER 3: The Independent Play Formula
The 3-Phase System that builds play skills.

## CHAPTER 4: 50+ Activities by Age Group
Age-appropriate activities for every stage.

## CHAPTER 5: The Play Session Timer Technique
Building focus and engagement gradually.

## CHAPTER 6: Reducing Screen Time
The right way to transition off screens.

## CHAPTER 7: Creating a "Yes Space"
Safe exploration environment setup.

## CHAPTER 8: Troubleshooting "Mom, I'm Bored!"
Proven solutions for boredom complaints.

## CHAPTER 9: Success Metrics
How to track your child's progress.

## CHAPTER 10: Activity Starter Kit
Bonus materials and templates.`
  },
  {
    title: "Overcoming Childhood Fears",
    subtitle: "Evidence-based strategies for anxious kids",
    slug: "childhood-fears",
    coverColor: "#10b981",
    markdown: `# 📘 EBOOK 3: What Are You Afraid Of?
## Helping Your Child Deal with Fear Through Play (Ages 2-10)

## CHAPTER 1: The Story That Changed Everything
The 14-Year-Old Boy

Why addressing fear NOW prevents crisis LATER. The powerful story that changed my approach to childhood psychology.

## CHAPTER 2: Why Fear is Normal (And Necessary)
Fear vs Anxiety explained - understanding the difference.

## CHAPTER 3: The 5 Most Common Childhood Fears
By age group with specific strategies.

## CHAPTER 4: When Fear Becomes Anxiety
Warning signs every parent should know.

## CHAPTER 5: The Play-Based Fear Processing System
The system that actually works.

## CHAPTER 6: 20+ Playful Techniques by Fear Type
Specific strategies for each fear.

## CHAPTER 7: Scripts for Each Fear
Exactly what to say in each situation.

## CHAPTER 8: Building Emotional Resilience
Long-term strategies for strong kids.

## CHAPTER 9: When to Seek Professional Help
Knowing when it's time for expert support.

## CHAPTER 10: Calm Down Corner Setup
Bonus setup guide and materials.`
  }
];

export async function seedEbooks() {
  const results = [];

  for (const seed of EBOOK_SEEDS) {
    try {
      // Parse markdown to chapters
      const chapters = parseMarkdownToChapters(seed.markdown);
      const totalWords = countWords(chapters);
      const estimatedTime = calculateReadingTime(chapters);

      // Insert ebook
      const { data, error } = await supabase
        .from("ebooks")
        .upsert({
          title: seed.title,
          subtitle: seed.subtitle,
          slug: seed.slug,
          content: chapters,
          markdown_source: seed.markdown,
          thumbnail_url: "/ebook-cover.png",
          cover_color: seed.coverColor,
          total_chapters: chapters.length,
          estimated_reading_time: estimatedTime,
          total_words: totalWords,
        }, {
          onConflict: "slug"
        })
        .select()
        .single();

      if (error) throw error;

      results.push({ success: true, title: seed.title, id: data.id });
    } catch (error: any) {
      results.push({ success: false, title: seed.title, error: error.message });
    }
  }

  return results;
}
