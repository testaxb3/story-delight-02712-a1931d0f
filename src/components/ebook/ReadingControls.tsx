import { Moon, Sun, Type, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

interface ReadingControlsProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onToggleBookmark: () => void;
  isBookmarked: boolean;
}

export const ReadingControls = ({
  fontSize,
  onFontSizeChange,
  onToggleBookmark,
  isBookmarked,
}: ReadingControlsProps) => {
  const { theme, setTheme } = useTheme();

  const increaseFontSize = () => {
    if (fontSize < 1.5) onFontSizeChange(fontSize + 0.1);
  };

  const decreaseFontSize = () => {
    if (fontSize > 0.8) onFontSizeChange(fontSize - 0.1);
  };

  const resetFontSize = () => {
    onFontSizeChange(1);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="rounded-full hover:bg-primary/10"
      >
        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </Button>

      {/* Font Size Control */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
            <Type className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Font Size</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={increaseFontSize}>
            <span className="text-lg">A+</span>
            <span className="ml-2">Increase</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={decreaseFontSize}>
            <span className="text-sm">A-</span>
            <span className="ml-2">Decrease</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={resetFontSize}>
            <span className="text-base">A</span>
            <span className="ml-2">Reset</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Bookmark Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleBookmark}
        className="rounded-full hover:bg-primary/10"
      >
        <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
      </Button>
    </div>
  );
};
