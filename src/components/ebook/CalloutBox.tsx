import { Lightbulb, Microscope, AlertCircle, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CalloutBoxProps {
  type?: 'science' | 'try' | 'remember' | 'warning';
  content: string;
}

const calloutConfig = {
  science: {
    icon: Microscope,
    title: "Science Says",
    className: "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 dark:from-blue-950/40 dark:to-blue-900/20 dark:border-blue-800/50 shadow-sm shadow-blue-100/50 dark:shadow-blue-900/20",
    iconClassName: "text-blue-600 dark:text-blue-400",
    badgeClassName: "bg-blue-100/80 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-semibold"
  },
  try: {
    icon: Target,
    title: "Try This",
    className: "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50 dark:from-green-950/40 dark:to-green-900/20 dark:border-green-800/50 shadow-sm shadow-green-100/50 dark:shadow-green-900/20",
    iconClassName: "text-green-600 dark:text-green-400",
    badgeClassName: "bg-green-100/80 text-green-700 dark:bg-green-900/50 dark:text-green-300 font-semibold"
  },
  remember: {
    icon: Lightbulb,
    title: "Remember",
    className: "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/50 dark:from-amber-950/40 dark:to-amber-900/20 dark:border-amber-800/50 shadow-sm shadow-amber-100/50 dark:shadow-amber-900/20",
    iconClassName: "text-amber-600 dark:text-amber-400",
    badgeClassName: "bg-amber-100/80 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 font-semibold"
  },
  warning: {
    icon: AlertCircle,
    title: "Important",
    className: "bg-gradient-to-br from-red-50 to-red-100/50 border-red-200/50 dark:from-red-950/40 dark:to-red-900/20 dark:border-red-800/50 shadow-sm shadow-red-100/50 dark:shadow-red-900/20",
    iconClassName: "text-red-600 dark:text-red-400",
    badgeClassName: "bg-red-100/80 text-red-700 dark:bg-red-900/50 dark:text-red-300 font-semibold"
  }
};

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
      <code key={`code-${match.index}`} className="px-2 py-1 bg-muted/50 rounded text-sm font-mono">
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
            return <strong key={`${partIdx}-bold-${boldIdx}`} className="font-semibold">{boldPart.slice(2, -2)}</strong>;
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

export const CalloutBox = ({ type = "remember", content }: CalloutBoxProps) => {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div className={`my-8 p-8 rounded-2xl border-2 smooth-transition backdrop-blur-sm ${config.className}`}>
      <div className="flex gap-5">
        <div className="flex-shrink-0 mt-1">
          <Icon className={`w-7 h-7 ${config.iconClassName}`} />
        </div>

        <div className="flex-1 space-y-4">
          <Badge className={`${config.badgeClassName} px-4 py-1.5 text-xs tracking-wider uppercase`}>
            {config.title}
          </Badge>

          <div className="space-y-3 font-body text-base">
            {content.split('\n').map((line, index) => {
              if (!line.trim()) return null;

              return (
                <p key={index} className="text-foreground leading-relaxed m-0">
                  {renderContent(line)}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
