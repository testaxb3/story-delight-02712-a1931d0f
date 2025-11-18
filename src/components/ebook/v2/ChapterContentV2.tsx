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
  const parts = content.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={index} className="px-2 py-1 bg-muted/50 rounded font-mono text-sm">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={index} className="italic">{part.slice(1, -1)}</em>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};

export const ChapterContentV2 = ({ blocks, chapterIndex }: ChapterContentV2Props) => {
  const { addHighlight, getChapterHighlights } = useHighlights();
  const [selectedText, setSelectedText] = useState("");
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);

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
            return (
              <p
                key={index}
                className="text-lg leading-loose text-foreground/90 tracking-wide my-4 select-text"
              >
                {typeof block.content === 'string' && renderContent(block.content)}
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
