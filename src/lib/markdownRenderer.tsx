import React from "react";

/**
 * Renders inline markdown: **bold**, *italic*, `code`, and \n as line breaks
 * Returns an array of React elements ready for rendering
 */
export function renderMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  const elements: React.ReactNode[] = [];
  let currentText = text;
  let key = 0;

  while (currentText.length > 0) {
    // Find the next markdown pattern or line break
    const boldIndex = currentText.search(/\*\*(.+?)\*\*/);
    const italicIndex = currentText.search(/[*_](.+?)[*_]/);
    const codeIndex = currentText.search(/`(.+?)`/);
    const lineBreakIndex = currentText.indexOf('\n');

    // Find which pattern comes first
    const patterns = [
      { index: boldIndex, type: 'bold' },
      { index: italicIndex, type: 'italic' },
      { index: codeIndex, type: 'code' },
      { index: lineBreakIndex, type: 'linebreak' }
    ].filter(p => p.index !== -1).sort((a, b) => a.index - b.index);

    // If no patterns found, add remaining text
    if (patterns.length === 0) {
      elements.push(currentText);
      break;
    }

    const nextPattern = patterns[0];

    // Add text before the pattern
    if (nextPattern.index > 0) {
      elements.push(currentText.substring(0, nextPattern.index));
    }

    // Process the pattern
    const textAfterPrelude = currentText.substring(nextPattern.index);
    
    if (nextPattern.type === 'linebreak') {
      elements.push(<br key={key++} />);
      currentText = textAfterPrelude.substring(1);
      continue;
    } else if (nextPattern.type === 'bold') {
      const match = textAfterPrelude.match(/^\*\*(.+?)\*\*/);
      if (match) {
        elements.push(
          <strong key={key++} className="font-semibold text-foreground">
            {match[1]}
          </strong>
        );
        currentText = textAfterPrelude.substring(match[0].length);
        continue;
      }
    } else if (nextPattern.type === 'italic') {
      const match = textAfterPrelude.match(/^[*_](.+?)[*_]/);
      if (match) {
        elements.push(
          <em key={key++} className="italic">
            {match[1]}
          </em>
        );
        currentText = textAfterPrelude.substring(match[0].length);
        continue;
      }
    } else if (nextPattern.type === 'code') {
      const match = textAfterPrelude.match(/^`(.+?)`/);
      if (match) {
        elements.push(
          <code key={key++} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            {match[1]}
          </code>
        );
        currentText = textAfterPrelude.substring(match[0].length);
        continue;
      }
    }

    // If we get here, the pattern didn't match (edge case), skip one character
    elements.push(currentText[0]);
    currentText = currentText.substring(1);
  }

  return elements;
}

/**
 * Splits text by double line breaks and renders each paragraph
 */
export function renderParagraphs(text: string): React.ReactNode {
  if (!text) return null;

  const paragraphs = text.split(/\n\n+/);
  
  return paragraphs.map((para, idx) => {
    if (!para.trim()) return null;
    
    return (
      <p key={idx} className="text-foreground/90 leading-relaxed">
        {renderMarkdown(para)}
      </p>
    );
  });
}
