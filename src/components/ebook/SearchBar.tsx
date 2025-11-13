import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ebookContent } from "@/data/ebookContent";

interface SearchResult {
  chapterId: string;
  chapterTitle: string;
  sectionIndex: number;
  content: string;
  preview: string;
}

interface SearchBarProps {
  onResultSelect?: (chapterId: string, sectionIndex: number) => void;
  className?: string;
}

export const SearchBar = ({ onResultSelect, className }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const [isExpanded, setIsExpanded] = useState(false);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setCurrentResultIndex(-1);
      return;
    }

    // Search through all chapters
    const searchResults: SearchResult[] = [];
    const queryLower = debouncedQuery.toLowerCase();

    ebookContent.forEach((chapter) => {
      chapter.content.forEach((section, index) => {
        let textContent = "";

        if (section.type === "paragraph") {
          textContent = section.content as string;
        } else if (section.type === "list") {
          textContent = (section.content as string[]).join(" ");
        } else if (section.type === "callout") {
          textContent = section.content as string;
        } else if (section.type === "heading") {
          textContent = section.content as string;
        }

        if (textContent.toLowerCase().includes(queryLower)) {
          // Create preview with highlighted query
          const matchIndex = textContent.toLowerCase().indexOf(queryLower);
          const start = Math.max(0, matchIndex - 40);
          const end = Math.min(textContent.length, matchIndex + debouncedQuery.length + 40);
          let preview = textContent.slice(start, end);

          if (start > 0) preview = "..." + preview;
          if (end < textContent.length) preview = preview + "...";

          searchResults.push({
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            sectionIndex: index,
            content: textContent,
            preview
          });
        }
      });
    });

    setResults(searchResults);
    setCurrentResultIndex(searchResults.length > 0 ? 0 : -1);
  }, [debouncedQuery]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setCurrentResultIndex(-1);
    setIsExpanded(false);
  };

  const goToNextResult = () => {
    if (results.length === 0) return;
    const nextIndex = (currentResultIndex + 1) % results.length;
    setCurrentResultIndex(nextIndex);
    const result = results[nextIndex];
    onResultSelect?.(result.chapterId, result.sectionIndex);
  };

  const goToPreviousResult = () => {
    if (results.length === 0) return;
    const prevIndex = currentResultIndex === 0 ? results.length - 1 : currentResultIndex - 1;
    setCurrentResultIndex(prevIndex);
    const result = results[prevIndex];
    onResultSelect?.(result.chapterId, result.sectionIndex);
  };

  const handleResultClick = (index: number) => {
    setCurrentResultIndex(index);
    const result = results[index];
    onResultSelect?.(result.chapterId, result.sectionIndex);
    setIsExpanded(false);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Search Input */}
      <div className="flex items-center gap-2 p-2 rounded-xl bg-card/80 backdrop-blur-md border shadow-lg">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <Input
            type="text"
            placeholder="Search in ebook..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent h-8 p-0 focus-visible:ring-0 text-sm"
          />
          {query && (
            <>
              {/* Result counter */}
              {results.length > 0 && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {currentResultIndex + 1}/{results.length}
                </span>
              )}
              {/* Navigation buttons */}
              {results.length > 1 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToPreviousResult}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToNextResult}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </div>
              )}
              {/* Clear button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>

        {/* Expand results button */}
        {results.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 px-2 text-xs"
          >
            {isExpanded ? "Hide" : "Show"} All
          </Button>
        )}
      </div>

      {/* Results dropdown */}
      {isExpanded && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-card border rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50">
          <div className="space-y-2">
            {results.map((result, index) => (
              <button
                key={`${result.chapterId}-${result.sectionIndex}`}
                onClick={() => handleResultClick(index)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors",
                  "hover:bg-muted/50",
                  index === currentResultIndex && "bg-primary/10 border border-primary/30"
                )}
              >
                <div className="text-xs font-semibold text-primary mb-1">
                  {result.chapterTitle}
                </div>
                <div className="text-sm text-foreground/80 line-clamp-2">
                  {result.preview}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-card border rounded-xl shadow-2xl text-center">
          <p className="text-sm text-muted-foreground">
            No results found for "{query}"
          </p>
        </div>
      )}
    </div>
  );
};
