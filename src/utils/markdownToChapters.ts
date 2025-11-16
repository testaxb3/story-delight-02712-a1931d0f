import { Chapter, ChapterSection, TableData } from '@/data/ebookContent';

export interface MarkdownParserOptions {
  chapterMarker?: RegExp;
  generateIds?: boolean;
  preserveFormatting?: boolean;
  sanitizeHtml?: boolean;
}

const DEFAULT_OPTIONS: MarkdownParserOptions = {
  chapterMarker: /^##\s+CHAPTER\s+\d+:/i,
  generateIds: true,
  preserveFormatting: true,
  sanitizeHtml: true,
};

/**
 * Parse Markdown text into Chapter[] structure
 */
export function parseMarkdownToChapters(
  markdown: string,
  options: MarkdownParserOptions = {}
): Chapter[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const lines = markdown.split('\n');
  const chapters: Chapter[] = [];
  let currentChapter: Chapter | null = null;
  let currentSection: ChapterSection | null = null;
  let listItems: string[] = [];
  let tableRows: string[][] = [];
  let tableHeaders: string[] = [];
  let inCodeBlock = false;

  const flushList = () => {
    if (listItems.length > 0 && currentChapter) {
      currentChapter.content.push({
        type: 'list',
        content: [...listItems],
      });
      listItems = [];
    }
  };

  const flushTable = () => {
    if (tableHeaders.length > 0 && tableRows.length > 0 && currentChapter) {
      currentChapter.content.push({
        type: 'table',
        content: {
          headers: tableHeaders,
          rows: tableRows,
        } as TableData,
      });
      tableHeaders = [];
      tableRows = [];
    }
  };

  const flushSection = () => {
    flushList();
    flushTable();
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed && !inCodeBlock) {
      continue;
    }

    // Code blocks
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      continue;
    }

    // Chapter detection
    if (opts.chapterMarker?.test(trimmed)) {
      flushSection();
      const titleMatch = trimmed.match(/^##\s+CHAPTER\s+\d+:\s*(.+)/i);
      const title = titleMatch ? titleMatch[1].trim() : trimmed.replace(/^##\s+/i, '').trim();
      
      // Check for subtitle on next line
      let subtitle: string | undefined;
      if (i + 1 < lines.length && lines[i + 1].trim() && !lines[i + 1].trim().startsWith('#')) {
        subtitle = lines[i + 1].trim();
        i++; // Skip subtitle line
      }

      currentChapter = {
        id: opts.generateIds ? `chapter-${chapters.length}` : title.toLowerCase().replace(/\s+/g, '-'),
        title,
        subtitle,
        content: [],
      };
      chapters.push(currentChapter);
      continue;
    }

    // If no chapter yet, create intro chapter
    if (!currentChapter) {
      currentChapter = {
        id: 'intro',
        title: 'Introduction',
        content: [],
      };
      chapters.push(currentChapter);
    }

    // Headers (H1-H6)
    if (trimmed.match(/^#{1,6}\s+/)) {
      flushSection();
      const level = trimmed.match(/^(#{1,6})*/)?.[1].length || 1;
      const content = trimmed.replace(/^#{1,6}\s+/, '').trim();
      currentChapter.content.push({
        type: 'heading',
        level,
        content,
      });
      continue;
    }

    // Callouts (special blocks) - multi-line support
    if (trimmed.startsWith('> [!')) {
      flushSection();
      const calloutMatch = trimmed.match(/^>\s*\[!(NOTE|WARNING|TIP|SCIENCE)\]\s*(.+)/i);
      if (calloutMatch) {
        const type = calloutMatch[1].toLowerCase();
        let content = calloutMatch[2].trim();
        
        // Continue reading lines that start with '>'
        i++;
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          const continuationLine = lines[i].trim();
          if (continuationLine === '>') {
            content += '\n'; // Empty quote line = new paragraph
          } else {
            const lineContent = continuationLine.replace(/^>\s*/, '');
            content += '\n' + lineContent;
          }
          i++;
        }
        i--; // Back up one line since we'll increment in the main loop
        
        const calloutTypeMap: Record<string, ChapterSection['calloutType']> = {
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
      continue;
    }

    // Tables
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList();
      const cells = trimmed
        .split('|')
        .slice(1, -1)
        .map(c => c.trim());

      // Check if it's a separator line
      if (cells.every(c => c.match(/^[-:]+$/))) {
        continue;
      }

      if (tableHeaders.length === 0) {
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (tableHeaders.length > 0) {
      flushTable();
    }

    // Lists
    if (trimmed.match(/^[-*•]\s+/) || trimmed.match(/^\d+\.\s+/)) {
      flushTable();
      const content = trimmed.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '').trim();
      listItems.push(content);
      continue;
    } else if (listItems.length > 0) {
      flushList();
    }

    // Images
    if (trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)/)) {
      flushSection();
      const match = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
      if (match) {
        currentChapter.content.push({
          type: 'image',
          content: match[2], // URL
          imageAlt: match[1] || 'Image',
        });
      }
      continue;
    }

    // Script blocks (custom)
    if (trimmed === '---SCRIPT---') {
      flushSection();
      let scriptContent = '';
      i++;
      while (i < lines.length && lines[i].trim() !== '---SCRIPT---') {
        scriptContent += lines[i] + '\n';
        i++;
      }
      currentChapter.content.push({
        type: 'script',
        content: scriptContent.trim(),
      });
      continue;
    }

    // Regular paragraphs
    if (trimmed) {
      flushTable();
      flushList();
      
      // Preserve inline formatting
      let content = trimmed;
      if (opts.preserveFormatting) {
        // Keep markdown inline formatting
        // Will be rendered by ChapterContent component
      }

      currentChapter.content.push({
        type: 'paragraph',
        content,
      });
    }
  }

  // Flush any remaining sections
  flushSection();

  return chapters;
}

/**
 * Generate a slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(chapters: Chapter[]): number {
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

  // Average reading speed: 200 words per minute
  return Math.ceil(totalWords / 200);
}

/**
 * Count total words in chapters
 */
export function countWords(chapters: Chapter[]): number {
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

  return totalWords;
}
