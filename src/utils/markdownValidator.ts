import { Chapter } from '@/data/ebookContent';
import { parseMarkdownToChapters } from './markdownToChapters';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalChapters: number;
    totalSections: number;
    totalWords: number;
    estimatedReadingTime: number;
  };
}

/**
 * Validate markdown content before parsing
 */
export function validateMarkdown(markdown: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    stats: {
      totalChapters: 0,
      totalSections: 0,
      totalWords: 0,
      estimatedReadingTime: 0,
    },
  };

  // Check if markdown is empty
  if (!markdown || markdown.trim().length === 0) {
    result.isValid = false;
    result.errors.push('Markdown content is empty');
    return result;
  }

  try {
    // Try to parse the markdown
    const chapters = parseMarkdownToChapters(markdown);

    // Check minimum chapters
    if (chapters.length === 0) {
      result.isValid = false;
      result.errors.push('No chapters detected. Make sure to use "## CHAPTER X:" format');
      return result;
    }

    // Calculate stats
    result.stats.totalChapters = chapters.length;
    
    chapters.forEach(chapter => {
      result.stats.totalSections += chapter.content.length;
      
      // Count words
      chapter.content.forEach(section => {
        if (typeof section.content === 'string') {
          result.stats.totalWords += section.content.split(/\s+/).length;
        } else if (Array.isArray(section.content)) {
          section.content.forEach(item => {
            if (typeof item === 'string') {
              result.stats.totalWords += item.split(/\s+/).length;
            }
          });
        }
      });

      // Check if chapter has title
      if (!chapter.title) {
        result.warnings.push(`Chapter ${chapter.id} has no title`);
      }

      // Check if chapter has content
      if (chapter.content.length === 0) {
        result.warnings.push(`Chapter "${chapter.title}" is empty`);
      }
    });

    // Calculate reading time (200 words per minute)
    result.stats.estimatedReadingTime = Math.ceil(result.stats.totalWords / 200);

    // Check for broken images
    const imageUrls = extractImageUrls(markdown);
    imageUrls.forEach(url => {
      if (!isValidUrl(url)) {
        result.warnings.push(`Potentially invalid image URL: ${url}`);
      }
    });

    // Check for broken links
    const linkUrls = extractLinkUrls(markdown);
    linkUrls.forEach(url => {
      if (!isValidUrl(url)) {
        result.warnings.push(`Potentially invalid link URL: ${url}`);
      }
    });

    // Check minimum word count
    if (result.stats.totalWords < 500) {
      result.warnings.push('Content is very short (less than 500 words)');
    }

  } catch (error) {
    result.isValid = false;
    result.errors.push(`Failed to parse markdown: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

/**
 * Extract image URLs from markdown
 */
function extractImageUrls(markdown: string): string[] {
  const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const urls: string[] = [];
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    urls.push(match[2]);
  }

  return urls;
}

/**
 * Extract link URLs from markdown
 */
function extractLinkUrls(markdown: string): string[] {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const urls: string[] = [];
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    urls.push(match[2]);
  }

  return urls;
}

/**
 * Check if URL is valid
 */
function isValidUrl(url: string): boolean {
  // Allow relative URLs
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return true;
  }

  // Check absolute URLs
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate chapter structure
 */
export function validateChapters(chapters: Chapter[]): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    stats: {
      totalChapters: chapters.length,
      totalSections: 0,
      totalWords: 0,
      estimatedReadingTime: 0,
    },
  };

  if (chapters.length === 0) {
    result.isValid = false;
    result.errors.push('No chapters provided');
    return result;
  }

  chapters.forEach((chapter, index) => {
    result.stats.totalSections += chapter.content.length;

    if (!chapter.id) {
      result.errors.push(`Chapter ${index + 1} has no ID`);
      result.isValid = false;
    }

    if (!chapter.title) {
      result.errors.push(`Chapter ${index + 1} has no title`);
      result.isValid = false;
    }

    if (chapter.content.length === 0) {
      result.warnings.push(`Chapter "${chapter.title}" has no content`);
    }

    // Count words
    chapter.content.forEach(section => {
      if (typeof section.content === 'string') {
        result.stats.totalWords += section.content.split(/\s+/).length;
      } else if (Array.isArray(section.content)) {
        section.content.forEach(item => {
          if (typeof item === 'string') {
            result.stats.totalWords += item.split(/\s+/).length;
          }
        });
      }
    });
  });

  result.stats.estimatedReadingTime = Math.ceil(result.stats.totalWords / 200);

  return result;
}
