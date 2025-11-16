import { ChapterSection, TableData } from "@/data/ebookContent";
import { CalloutBox } from "./CalloutBox";
import { ScriptBox } from "./ScriptBox";
import { TableBlock } from "./TableBlock";
import { ChapterDecorator } from "./ChapterDecorator";

interface ChapterContentProps {
  blocks: ChapterSection[];
}

const renderContent = (content: string) => {
  // Process in order: code inline, bold, italic
  // Split by code inline first (`code`)
  const parts: (string | JSX.Element)[] = [];
  let currentIndex = 0;
  const codeRegex = /`([^`]+)`/g;
  let match;
  
  while ((match = codeRegex.exec(content)) !== null) {
    // Add text before code
    if (match.index > currentIndex) {
      parts.push(content.substring(currentIndex, match.index));
    }
    // Add code element
    parts.push(
      <code key={`code-${match.index}`} className="px-2 py-1 bg-muted rounded text-sm font-mono">
        {match[1]}
      </code>
    );
    currentIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (currentIndex < content.length) {
    parts.push(content.substring(currentIndex));
  }
  
  // Now process bold and italic in the string parts
  return (
    <>
      {parts.map((part, partIdx) => {
        if (typeof part !== 'string') return part;
        
        // Split by bold (**text**)
        const boldParts = part.split(/(\*\*.*?\*\*)/g);
        
        return boldParts.map((boldPart, boldIdx) => {
          if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
            return <strong key={`${partIdx}-bold-${boldIdx}`}>{boldPart.slice(2, -2)}</strong>;
          }
          
          // Split by italic (*text* or _text_)
          const italicParts = boldPart.split(/(\*[^*]+\*|_[^_]+_)/g);
          
          return italicParts.map((italicPart, italicIdx) => {
            if ((italicPart.startsWith('*') && italicPart.endsWith('*') && italicPart.length > 2) ||
                (italicPart.startsWith('_') && italicPart.endsWith('_') && italicPart.length > 2)) {
              return <em key={`${partIdx}-${boldIdx}-italic-${italicIdx}`}>{italicPart.slice(1, -1)}</em>;
            }
            return <span key={`${partIdx}-${boldIdx}-${italicIdx}`}>{italicPart}</span>;
          });
        });
      })}
    </>
  );
};

export const ChapterContent = ({ blocks }: ChapterContentProps) => {
  return (
    <div className="space-y-6 reading-content">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            const level = (block.level || 1);
            const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
            const headingClasses = {
              1: "text-4xl md:text-5xl font-bold leading-tight mb-6 mt-8",
              2: "text-3xl md:text-4xl font-bold leading-tight mb-4 mt-8",
              3: "text-2xl md:text-3xl font-bold leading-tight mb-3 mt-6",
              4: "text-xl md:text-2xl font-bold leading-tight mb-2 mt-4",
            }[level] || "text-lg font-bold mb-2 mt-3";
            
            return (
              <div key={index}>
                {level === 1 && <ChapterDecorator />}
                <HeadingTag className={headingClasses}>
                  {renderContent(block.content as string)}
                </HeadingTag>
                {level === 1 && (
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-1.5 w-20 bg-primary rounded-full" />
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  </div>
                )}
              </div>
            );
            
          case "paragraph":
            return (
              <p key={index} className="text-foreground leading-relaxed whitespace-pre-line">
                {renderContent(block.content as string)}
              </p>
            );
            
          case "list":
            const items = Array.isArray(block.content) ? block.content : [block.content as string];
            return (
              <ul key={index} className="space-y-3 ml-2">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                    <span className="text-foreground">{renderContent(item)}</span>
                  </li>
                ))}
              </ul>
            );
            
          case "callout":
            return (
              <CalloutBox
                key={index}
                type={block.calloutType}
                content={block.content as string}
              />
            );
            
          case "script":
            return (
              <ScriptBox
                key={index}
                content={block.content as string | string[]}
              />
            );
            
          case "table":
            return (
              <TableBlock
                key={index}
                data={block.content as TableData}
              />
            );
            
          case "image":
            return (
              <div key={index} className="my-8">
                <img
                  src={block.content as string}
                  alt={block.imageAlt || "Content image"}
                  className="w-full rounded-2xl shadow-lg"
                />
              </div>
            );
            
          default:
            return null;
        }
      })}
    </div>
  );
};
