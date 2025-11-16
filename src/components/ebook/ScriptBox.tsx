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
  const lines = Array.isArray(content) ? content : [content];
  
  return (
    <div className="bg-secondary border-2 border-border rounded-2xl p-6 my-6 smooth-transition hover:shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Script
        </span>
      </div>
      
      <div className="space-y-3 text-sm">
        {lines.map((line, index) => (
          <p key={index} className="text-foreground leading-relaxed border-l-4 border-primary pl-4">
            {renderContent(line)}
          </p>
        ))}
      </div>
    </div>
  );
};
