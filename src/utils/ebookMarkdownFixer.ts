/**
 * Utility to fix and normalize existing ebook markdown to work with the new system
 */

export function fixEbookMarkdown(markdown: string): string {
  if (!markdown) return markdown;

  let fixed = markdown;

  // 1. Normalize chapter headings to ## format (H2)
  // Convert "## CHAPTER X:" to just "## Chapter X: Title"
  fixed = fixed.replace(/^##\s*CHAPTER\s+(\d+):\s*/gim, '## Chapter $1: ');
  fixed = fixed.replace(/^##\s*CAP[ÍI]TULO\s+(\d+):\s*/gim, '## Capítulo $1: ');

  // 2. Remove standalone chapter labels that are on their own line (these will be removed by preprocessor)
  // Keep them for now as they'll be filtered out during rendering

  // 3. Normalize callout syntax to our expected format
  // Convert any variations of callouts to standard [!TYPE] format
  fixed = fixed.replace(/>\s*\*\*NOTE\*\*:\s*/gim, '> [!NOTE]\n> ');
  fixed = fixed.replace(/>\s*\*\*TIP\*\*:\s*/gim, '> [!TIP]\n> ');
  fixed = fixed.replace(/>\s*\*\*WARNING\*\*:\s*/gim, '> [!WARNING]\n> ');
  fixed = fixed.replace(/>\s*\*\*REMEMBER\*\*:\s*/gim, '> [!REMEMBER]\n> ');
  fixed = fixed.replace(/>\s*\*\*SCIENCE\*\*:\s*/gim, '> [!SCIENCE]\n> ');

  // 4. Fix script blocks - convert any "Script:" or similar to proper code blocks
  fixed = fixed.replace(/^Script:\s*$/gim, '```script');
  fixed = fixed.replace(/^End Script\s*$/gim, '```');

  // 5. Normalize line breaks - ensure consistent spacing
  // Remove excessive blank lines (more than 2 consecutive)
  fixed = fixed.replace(/\n{4,}/g, '\n\n\n');

  // 6. Ensure proper spacing around headings
  fixed = fixed.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');
  fixed = fixed.replace(/(#{1,6}\s[^\n]+)\n([^\n#])/g, '$1\n\n$2');

  // 7. Fix common markdown issues
  // Remove spaces INSIDE bold markers (e.g., "** text**" -> "**text**")
  // But preserve spaces OUTSIDE (e.g., "text **bold** text" stays the same)
  fixed = fixed.replace(/\*\*\s+([^\*])/g, '**$1');  // Remove space after opening **
  fixed = fixed.replace(/([^\*])\s+\*\*/g, '$1**');  // Remove space before closing **
  
  // 8. Normalize bullet points
  fixed = fixed.replace(/^[\-\*]\s+/gm, '- ');

  // 9. Remove trailing whitespace from lines
  fixed = fixed.replace(/[ \t]+$/gm, '');

  // 10. Ensure file ends with single newline
  fixed = fixed.trim() + '\n';

  return fixed;
}

/**
 * Validates if markdown is ready for the new system
 */
export function validateEbookMarkdown(markdown: string): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!markdown || markdown.trim().length === 0) {
    errors.push('Markdown content is empty');
    return { isValid: false, warnings, errors };
  }

  // Check for chapters
  const chapterMatches = markdown.match(/^#{2,3}\s+.+$/gm);
  if (!chapterMatches || chapterMatches.length === 0) {
    errors.push('No chapters found (## or ### headings)');
  } else if (chapterMatches.length < 2) {
    warnings.push(`Only ${chapterMatches.length} chapter found, expected multiple chapters`);
  }

  // Check for problematic patterns
  if (markdown.includes('**NOTE**:') || markdown.includes('**TIP**:')) {
    warnings.push('Found old-style callouts (should be converted to [!NOTE] format)');
  }

  if (markdown.match(/Script:\s*$/m) && !markdown.includes('```script')) {
    warnings.push('Found script sections not in code block format');
  }

  // Check for excessive blank lines
  if (markdown.match(/\n{5,}/)) {
    warnings.push('Found excessive blank lines (5+ consecutive)');
  }

  // Check for inconsistent heading levels
  const h1Count = (markdown.match(/^#\s+/gm) || []).length;
  if (h1Count > 1) {
    warnings.push(`Multiple H1 headings found (${h1Count}), should have at most 1 for main title`);
  }

  const isValid = errors.length === 0;
  return { isValid, warnings, errors };
}

/**
 * Preview changes that would be made to markdown
 */
export function previewMarkdownFixes(markdown: string): {
  original: string;
  fixed: string;
  changes: string[];
} {
  const changes: string[] = [];
  const fixed = fixEbookMarkdown(markdown);

  if (fixed !== markdown) {
    const originalLines = markdown.split('\n').length;
    const fixedLines = fixed.split('\n').length;
    
    if (originalLines !== fixedLines) {
      changes.push(`Line count changed from ${originalLines} to ${fixedLines}`);
    }

    // Detect specific changes
    const originalCallouts = (markdown.match(/\*\*(NOTE|TIP|WARNING)\*\*:/g) || []).length;
    const fixedCallouts = (fixed.match(/\[!(NOTE|TIP|WARNING|REMEMBER|SCIENCE)\]/g) || []).length;
    
    if (originalCallouts !== fixedCallouts) {
      changes.push(`Converted ${originalCallouts} old-style callouts to new format`);
    }

    const originalChapters = (markdown.match(/^##\s*CHAPTER\s+\d+/gim) || []).length;
    const fixedChapters = (fixed.match(/^##\s*Chapter\s+\d+/gim) || []).length;
    
    if (originalChapters > 0) {
      changes.push(`Normalized ${originalChapters} chapter headings`);
    }

    if (changes.length === 0) {
      changes.push('Minor formatting improvements (spacing, line breaks)');
    }
  } else {
    changes.push('No changes needed');
  }

  return { original: markdown, fixed, changes };
}
