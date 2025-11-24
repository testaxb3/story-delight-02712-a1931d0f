import { ChapterSection, TableData } from "@/data/ebookContent";
import { CalloutBox } from "../CalloutBox";
import { ScriptBox } from "../ScriptBox";
import { TableBlock } from "../TableBlock";
import { useHighlights } from "@/hooks/useHighlights";
import { HighlightToolbar } from "./HighlightToolbar";
import { useState, useEffect } from "react";

interface ChapterContentV2Props {
  blocks: ChapterSection[];
  chapterIndex: number;
}

const renderContent = (content: string): JSX.Element => {
  const elements: JSX.Element[] = [];
  let currentIndex = 0;
  let elementKey = 0;

  while (currentIndex < content.length) {
    // Check for code (highest priority)
    if (content[currentIndex] === '`') {
      const endIndex = content.indexOf('`', currentIndex + 1);
      if (endIndex !== -1) {
        const codeText = content.slice(currentIndex + 1, endIndex);
        elements.push(
          <code key={elementKey++} className="px-2 py-1 bg-muted/50 rounded font-mono text-sm">
            {codeText}
          </code>
        );
        currentIndex = endIndex + 1;
        continue;
      }
    }

    // Check for bold
    if (content[currentIndex] === '*' && content[currentIndex + 1] === '*') {
      const endIndex = content.indexOf('**', currentIndex + 2);
      if (endIndex !== -1) {
        const boldText = content.slice(currentIndex + 2, endIndex);
        elements.push(
          <strong key={elementKey++} className="font-bold text-foreground">
            {boldText}
          </strong>
        );
        currentIndex = endIndex + 2;
        continue;
      }
    }

    // Check for italic
    if (content[currentIndex] === '*') {
      const endIndex = content.indexOf('*', currentIndex + 1);
      if (endIndex !== -1) {
        const italicText = content.slice(currentIndex + 1, endIndex);
        elements.push(
          <em key={elementKey++} className="italic">
            {italicText}
          </em>
        );
        currentIndex = endIndex + 1;
        continue;
      }
    }

    // Regular text - find next special character
    let nextSpecial = content.length;
    const nextBacktick = content.indexOf('`', currentIndex);
    const nextAsterisk = content.indexOf('*', currentIndex);

    if (nextBacktick !== -1) nextSpecial = Math.min(nextSpecial, nextBacktick);
    if (nextAsterisk !== -1) nextSpecial = Math.min(nextSpecial, nextAsterisk);

    const text = content.slice(currentIndex, nextSpecial);
    if (text.length > 0) {
      elements.push(<span key={elementKey++}>{text}</span>);
    }
    currentIndex = nextSpecial;

    // Safety check to prevent infinite loops
    if (currentIndex === nextSpecial && nextSpecial === content.length) {
      break;
    }
    if (currentIndex < content.length && nextSpecial === content.length) {
      currentIndex++;
    }
  }

  return <>{elements}</>;
};

export const ChapterContentV2 = ({ blocks, chapterIndex }: ChapterContentV2Props) => {
  const { addHighlight, getChapterHighlights } = useHighlights();
  const [selectedText, setSelectedText] = useState("");
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);

  console.log('📝 ChapterContentV2:', { 
    chapterIndex, 
    blocksCount: blocks?.length,
    blocks: blocks?.slice(0, 3) // Show first 3 blocks
  });

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (text && text.length > 0) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        
        if (rect) {
          setSelectedText(text);
          setSelectionPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
          });
        }
      } else {
        setSelectedText("");
        setSelectionPosition(null);
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("touchend", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
    };
  }, []);

  const handleAddHighlight = (color: string) => {
    if (selectedText) {
      addHighlight(chapterIndex, selectedText, color);
      setSelectedText("");
      setSelectionPosition(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  const chapterHighlights = getChapterHighlights(chapterIndex);

  // Safety check: ensure blocks is an array
  const safeBlocks = Array.isArray(blocks) ? blocks : [];

  console.log('📝 Rendering blocks:', {
    blocksLength: safeBlocks.length,
    firstBlock: safeBlocks[0],
    allBlockTypes: safeBlocks.map(b => b.type)
  });

  if (safeBlocks.length === 0) {
    return (
      <article className="space-y-8">
        <p className="text-center text-muted-foreground py-12">
          No content available for this chapter.
        </p>
      </article>
    );
  }

  return (
    <article className="space-y-8">
      {selectedText && selectionPosition && (
        <HighlightToolbar
          position={selectionPosition}
          onSelectColor={handleAddHighlight}
          onClose={() => {
            setSelectedText("");
            setSelectionPosition(null);
          }}
        />
      )}

      {safeBlocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={index}
                className="font-display text-3xl md:text-4xl font-bold text-foreground mt-12 mb-6"
              >
                {typeof block.content === 'string' && renderContent(block.content)}
              </h2>
            );

          case "paragraph":
            const paragraphContent = typeof block.content === 'string' ? block.content : '';
            
            // Simply render with whitespace-pre-line to preserve all line breaks from database
            return (
              <p
                key={index}
                className="text-lg leading-loose text-foreground/90 tracking-wide my-4 select-text whitespace-pre-line"
              >
                {renderContent(paragraphContent)}
              </p>
            );

          case "list":
            return (
              <ul key={index} className="space-y-3 my-6 ml-6">
                {Array.isArray(block.content) && block.content.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="text-lg leading-loose text-foreground/90 flex gap-3 select-text"
                  >
                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                    <span>{typeof item === 'string' && renderContent(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case "callout":
            return (
              <CalloutBox
                key={index}
                type={block.calloutType || "remember"}
                content={block.content as string | { title?: string; body: string }}
              />
            );

          case "script":
            return (
              <ScriptBox
                key={index}
                content={typeof block.content === 'string' ? block.content : Array.isArray(block.content) ? block.content.join('\n') : ''}
              />
            );

          case "table":
            const tableData = block.content as TableData;
            return (
              <TableBlock
                key={index}
                data={tableData}
              />
            );

          case "image":
            return (
              <figure key={index} className="my-8">
                <img
                  src={typeof block.content === 'string' ? block.content : ''}
                  alt={block.imageAlt || ""}
                  className="w-full rounded-lg border border-border shadow-md"
                />
                {block.imageAlt && (
                  <figcaption className="text-sm text-muted-foreground text-center mt-3 font-sans">
                    {block.imageAlt}
                  </figcaption>
                )}
              </figure>
            );

          default:
            return null;
        }
      })}
    </article>
  );
};
