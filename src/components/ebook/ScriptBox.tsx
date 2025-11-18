import { MessageSquare } from "lucide-react";

interface ScriptBoxProps {
  content: string | string[];
}

const renderContent = (content: string) => {
  // Process in order: code inline, bold, italic
  const parts: (string | JSX.Element)[] = [];
  let currentIndex = 0;
  const codeRegex = /`([^`]+)`/g;
  let match;
  
  while ((match = codeRegex.exec(content)) !== null) {
    if (match.index > currentIndex) {
      parts.push(content.substring(currentIndex, match.index));
    }
    parts.push(
      <code key={`code-${match.index}`} className="px-2 py-1 bg-muted/50 rounded text-sm">
        {match[1]}
      </code>
    );
    currentIndex = match.index + match[0].length;
  }
  
  if (currentIndex < content.length) {
    parts.push(content.substring(currentIndex));
  }
  
  return (
    <>
      {parts.map((part, partIdx) => {
        if (typeof part !== 'string') return part;
        
        const boldParts = part.split(/(\*\*.*?\*\*)/g);
        
        return boldParts.map((boldPart, boldIdx) => {
          if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
            return <strong key={`${partIdx}-bold-${boldIdx}`}>{boldPart.slice(2, -2)}</strong>;
          }
          
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

export const ScriptBox = ({ content }: ScriptBoxProps) => {
  // Handle both string and array content
  const textContent = Array.isArray(content) ? content.join('\n') : content;
  
  // Split by double newlines for paragraphs, then split each paragraph by single newlines
  const sections = textContent.split('\n\n').filter(section => section.trim());
  
  return (
    <div className="bg-secondary border-2 border-border rounded-2xl p-6 my-6 smooth-transition hover:shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Script
        </span>
      </div>
      
      <div className="space-y-4">
        {sections.map((section, sectionIndex) => {
          const lines = section.split('\n').filter(line => line.trim());
          
          return (
            <div key={sectionIndex} className="space-y-2 border-l-4 border-primary pl-4">
              {lines.map((line, lineIndex) => (
                <p key={lineIndex} className="text-foreground leading-relaxed text-base">
                  {renderContent(line)}
                </p>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
