import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Chapter } from "@/data/ebookContent";

interface SearchDialogProps {
  chapters: Chapter[];
  onResultClick: (chapterIndex: number) => void;
}

interface SearchResult {
  chapterIndex: number;
  chapterTitle: string;
  content: string;
  preview: string;
}

export const SearchDialog = ({ chapters, onResultClick }: SearchDialogProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    chapters.forEach((chapter, chapterIndex) => {
      chapter.content.forEach((block) => {
        let text = "";
        
        if (block.type === "heading" || block.type === "paragraph") {
          text = typeof block.content === "string" ? block.content : "";
        } else if (block.type === "list" && Array.isArray(block.content)) {
          text = block.content.join(" ");
        } else if (block.type === "callout" && typeof block.content === "string") {
          text = block.content;
        } else if (block.type === "script" && typeof block.content === "string") {
          text = block.content;
        } else if (block.type === "table" && typeof block.content === "object" && !Array.isArray(block.content)) {
          const tableData = block.content as { headers: string[]; rows: string[][] };
          text = [...tableData.headers, ...tableData.rows.flat()].join(" ");
        }

        if (text.toLowerCase().includes(searchTerm)) {
          const index = text.toLowerCase().indexOf(searchTerm);
          const start = Math.max(0, index - 50);
          const end = Math.min(text.length, index + searchTerm.length + 50);
          const preview = (start > 0 ? "..." : "") + text.slice(start, end) + (end < text.length ? "..." : "");

          results.push({
            chapterIndex,
            chapterTitle: chapter.title,
            content: text,
            preview,
          });
        }
      });
    });

    return results;
  }, [query, chapters]);

  const handleResultClick = (chapterIndex: number) => {
    onResultClick(chapterIndex);
    setOpen(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
          <Search className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl pt-[calc(env(safe-area-inset-top)+1.5rem)]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Search Content</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search chapters..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="font-body"
            autoFocus
          />
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {searchResults.length === 0 && query.trim() && (
                <p className="text-center text-muted-foreground py-8 font-body">
                  No results found for "{query}"
                </p>
              )}
              {searchResults.length === 0 && !query.trim() && (
                <p className="text-center text-muted-foreground py-8 font-body">
                  Start typing to search...
                </p>
              )}
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleResultClick(result.chapterIndex)}
                  className="w-full text-left p-4 rounded-lg border border-border hover:bg-muted/50 smooth-transition"
                >
                  <div className="text-xs text-primary font-semibold font-body mb-2">
                    Chapter {result.chapterIndex + 1}: {result.chapterTitle}
                  </div>
                  <div className="text-sm text-foreground font-body line-clamp-2">
                    {result.preview}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
