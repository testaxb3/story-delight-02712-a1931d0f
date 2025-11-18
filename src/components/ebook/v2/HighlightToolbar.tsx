import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HighlightToolbarProps {
  position: { x: number; y: number };
  onSelectColor: (color: string) => void;
  onClose: () => void;
}

const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "yellow", bg: "bg-yellow-200 dark:bg-yellow-900/40" },
  { name: "Green", value: "green", bg: "bg-green-200 dark:bg-green-900/40" },
  { name: "Blue", value: "blue", bg: "bg-blue-200 dark:bg-blue-900/40" },
  { name: "Pink", value: "pink", bg: "bg-pink-200 dark:bg-pink-900/40" },
];

export const HighlightToolbar = ({ position, onSelectColor, onClose }: HighlightToolbarProps) => {
  return (
    <div
      className="fixed z-50 bg-background border border-border rounded-lg shadow-xl p-2 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="flex items-center gap-1">
        {HIGHLIGHT_COLORS.map((color) => (
          <Button
            key={color.value}
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${color.bg} hover:opacity-80 transition-opacity`}
            onClick={() => onSelectColor(color.value)}
            title={`Highlight in ${color.name}`}
          >
            <span className="sr-only">{color.name}</span>
          </Button>
        ))}
      </div>
      
      <div className="w-px h-6 bg-border" />
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
