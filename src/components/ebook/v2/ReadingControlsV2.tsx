import { Minus, Plus, Bookmark, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";

interface ReadingControlsV2Props {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const ReadingControlsV2 = ({
  fontSize,
  onFontSizeChange,
  isBookmarked,
  onToggleBookmark,
}: ReadingControlsV2Props) => {
  const { theme, toggleTheme } = useTheme();

  const increaseFontSize = () => {
    if (fontSize < 1.5) {
      onFontSizeChange(fontSize + 0.1);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 0.8) {
      onFontSizeChange(fontSize - 0.1);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent/50 relative z-50"
          aria-label="Reading controls"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      {/* Added z-[60] to ensure it opens above the fixed header which is z-50.
          Added mr-2 or style to handle safe area if aligned to edge. 
          The DropdownMenuContent aligns 'end' which means right edge.
          In PWA, top right is usually safe, but let's ensure padding.
      */}
      <DropdownMenuContent 
        align="end" 
        className="w-56 font-sans z-[60] mr-2 mt-2"
        sideOffset={5}
      >
        <div className="px-2 py-2">
          <p className="text-sm font-medium mb-2">Font Size</p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={decreaseFontSize}
              disabled={fontSize <= 0.8}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center text-sm font-medium">
              {Math.round(fontSize * 100)}%
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={increaseFontSize}
              disabled={fontSize >= 1.5}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onToggleBookmark}>
          <Bookmark
            className={`mr-2 h-4 w-4 ${isBookmarked ? "fill-primary" : ""}`}
          />
          {isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={toggleTheme}>
          {theme === "dark" ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              Dark Mode
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};