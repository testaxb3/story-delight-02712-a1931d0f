/**
 * Preprocesses markdown to handle custom syntax before react-markdown parsing
 */

export function preprocessMarkdown(markdown: string): string {
  let processed = markdown;

  // Remove standalone chapter labels (H1s like "CHAPTER 10" that are just labels, not titles)
  // Keep H1s that are actual content titles (more than just "CHAPTER X")
  processed = processed.replace(
    /^#\s+(CHAPTER|CAP[ÍI]TULO)\s+\d+\s*$/gim,
    ''
  );

  // Convert callouts from [!TYPE] syntax to custom HTML that we can detect
  // Supports: [!NOTE], [!TIP], [!WARNING], [!REMEMBER], [!TRY], [!SCIENCE]
  processed = processed.replace(
    /^>\s*\[!(NOTE|TIP|WARNING|REMEMBER|TRY|SCIENCE)\]\s*\n((?:>\s*.+\n?)+)/gim,
    (match, type, content) => {
      // Remove '> ' from each line of content
      const cleanContent = content
        .split('\n')
        .map((line: string) => line.replace(/^>\s*/, ''))
        .filter((line: string) => line.trim())
        .join('\n');
      
      // Map TIP to TRY, NOTE to REMEMBER
      const mappedType = type === 'TIP' ? 'TRY' : type === 'NOTE' ? 'REMEMBER' : type;
      
      return `<div data-callout="${mappedType.toLowerCase()}">\n\n${cleanContent}\n\n</div>\n\n`;
    }
  );

  // Convert script blocks from ```script to a custom syntax
  processed = processed.replace(
    /```script\n([\s\S]*?)```/g,
    (match, content) => {
      return `<div data-script="true">\n\n${content.trim()}\n\n</div>\n\n`;
    }
  );

  return processed;
}

/**
 * Extracts chapter title from markdown content
 */
export function extractChapterTitle(markdown: string): string {
  // Try to find first heading (any level)
  const headingMatch = markdown.match(/^#{1,6}\s+(.+)$/m);
  if (headingMatch) {
    return headingMatch[1].trim();
  }
  
  // Try to find first bold text
  const boldMatch = markdown.match(/\*\*(.+?)\*\*/);
  if (boldMatch) {
    return boldMatch[1].trim();
  }
  
  // Try first line if it's not empty
  const firstLine = markdown.split('\n')[0]?.trim();
  if (firstLine && firstLine.length > 0 && firstLine.length < 100) {
    return firstLine;
  }
  
  return 'Untitled Chapter';
}

/**
 * Extracts chapter number from chapter title if present
 * Returns null if no number is found
 */
export function extractChapterNumber(title: string): number | null {
  // Try patterns like "Chapter 3:", "CHAPTER 3:", "3.", "Chapter Three"
  const patterns = [
    /chapter\s*(\d+)/i,           // "Chapter 3" or "CHAPTER 3"
    /cap[íi]tulo\s*(\d+)/i,       // "Capítulo 3"
    /^(\d+)\./,                    // "3. Title"
    /^(\d+)\s*[-–—]\s*/,          // "3 - Title" or "3 – Title"
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num)) {
        return num;
      }
    }
  }

  return null;
}
