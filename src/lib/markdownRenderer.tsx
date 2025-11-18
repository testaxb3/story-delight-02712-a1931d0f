import React from "react";

/**
 * Renders inline markdown: **bold**, *italic*, `code`
 * Returns an array of React elements ready for rendering
 */
export function renderMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  const elements: React.ReactNode[] = [];
  let currentText = text;
  let key = 0;

  while (currentText.length > 0) {
    // Check for bold: **text**
    const boldMatch = currentText.match(/^\*\*(.+?)\*\*/);
    if (boldMatch) {
      elements.push(
        <strong key={key++} className="font-semibold text-foreground">
          {boldMatch[1]}
        </strong>
      );
      currentText = currentText.slice(boldMatch[0].length);
      continue;
    }

    // Check for italic: *text* or _text_
    const italicMatch = currentText.match(/^[*_](.+?)[*_]/);
    if (italicMatch) {
      elements.push(
        <em key={key++} className="italic">
          {italicMatch[1]}
        </em>
      );
      currentText = currentText.slice(italicMatch[0].length);
      continue;
    }

    // Check for inline code: `code`
    const codeMatch = currentText.match(/^`(.+?)`/);
    if (codeMatch) {
      elements.push(
        <code key={key++} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
          {codeMatch[1]}
        </code>
      );
      currentText = currentText.slice(codeMatch[0].length);
      continue;
    }

    // No markdown found, add regular character
    const nextSpecialChar = currentText.search(/[*_`]/);
    const textToAdd = nextSpecialChar === -1 
      ? currentText 
      : currentText.slice(0, nextSpecialChar);
    
    if (textToAdd) {
      elements.push(textToAdd);
      currentText = currentText.slice(textToAdd.length);
    } else {
      // Edge case: special char that didn't match, just add it
      elements.push(currentText[0]);
      currentText = currentText.slice(1);
    }
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
