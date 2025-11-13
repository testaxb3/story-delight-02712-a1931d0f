import { MessageSquare } from "lucide-react";

interface ScriptBoxProps {
  content: string | string[];
}

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
      
      <div className="space-y-3 font-mono text-sm">
        {lines.map((line, index) => (
          <p key={index} className="text-foreground leading-relaxed border-l-4 border-primary pl-4">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};
