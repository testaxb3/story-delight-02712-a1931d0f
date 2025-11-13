import { useState, useEffect } from "react";
import { X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { ChapterContent } from "./ChapterContent";
import { NavigationButtons } from "./NavigationButtons";
import { ChapterCover } from "./ChapterCover";
import { TableOfContents } from "./TableOfContents";
import { SearchDialog } from "./SearchDialog";
import { ReadingControls } from "./ReadingControls";
import { NotesPanel } from "./NotesPanel";
import { Chapter } from "@/data/ebookContent";
import { useBookmarks } from "@/hooks/useBookmarks";

interface EbookReaderProps {
  chapters: Chapter[];
  initialChapter?: number;
  completedChapters?: Set<number>;
  onChapterChange?: (index: number) => void;
  onChapterComplete?: (index: number) => void;
  onClose?: () => void;
}

export const EbookReader = ({ 
  chapters, 
  initialChapter = 0,
  completedChapters: externalCompleted,
  onChapterChange,
  onChapterComplete,
  onClose 
}: EbookReaderProps) => {
  if (!chapters || chapters.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Conteúdo indisponível.</p>
      </div>
    );
  }

  const safeInitialChapter = Math.min(Math.max(initialChapter, 0), chapters.length - 1);
  
  const [currentChapterIndex, setCurrentChapterIndex] = useState(safeInitialChapter);
  const [fontSize, setFontSize] = useState(1);
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(
    externalCompleted || new Set()
  );
  const { toggleBookmark, isBookmarked } = useBookmarks();

  const currentChapter = chapters[currentChapterIndex];
  const progress = chapters.length > 0 
    ? Math.round(((currentChapterIndex + 1) / chapters.length) * 100)
    : 0;

  // Load completed chapters from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("ebook-completed");
    if (stored) {
      try {
        setCompletedChapters(new Set(JSON.parse(stored)));
      } catch (error) {
        console.error("Failed to load completed chapters:", error);
      }
    }
  }, []);

  // Mark chapter as completed when user reaches the end
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollPosition >= documentHeight - 100) {
        if (!completedChapters.has(currentChapterIndex)) {
          const newCompleted = new Set(completedChapters);
          newCompleted.add(currentChapterIndex);
          setCompletedChapters(newCompleted);
          localStorage.setItem("ebook-completed", JSON.stringify(Array.from(newCompleted)));
          onChapterComplete?.(currentChapterIndex);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentChapterIndex, completedChapters]);

  const handleNext = () => {
    if (currentChapterIndex < chapters.length - 1) {
      const newIndex = currentChapterIndex + 1;
      setCurrentChapterIndex(newIndex);
      onChapterChange?.(newIndex);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentChapterIndex > 0) {
      const newIndex = currentChapterIndex - 1;
      setCurrentChapterIndex(newIndex);
      onChapterChange?.(newIndex);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleChapterSelect = (index: number) => {
    setCurrentChapterIndex(index);
    onChapterChange?.(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleBookmark = () => {
    toggleBookmark(currentChapterIndex);
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontSize: `${fontSize}rem` }}>
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-primary/10"
              >
                <X className="w-5 h-5" />
              </Button>
              
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                <Home className="w-4 h-4" />
                <span>/</span>
                <span className="font-semibold text-foreground">Chapter {currentChapterIndex + 1}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <TableOfContents
                chapters={chapters}
                currentChapter={currentChapterIndex}
                onChapterSelect={handleChapterSelect}
                completedChapters={completedChapters}
              />
              <SearchDialog chapters={chapters} onResultClick={handleChapterSelect} />
              <NotesPanel currentChapter={currentChapterIndex} />
              <ReadingControls
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                onToggleBookmark={handleToggleBookmark}
                isBookmarked={isBookmarked(currentChapterIndex)}
              />
            </div>
          </div>
        
        {/* Progress */}
        <ProgressBar
          current={currentChapterIndex + 1}
          total={chapters.length}
          percentage={progress}
        />
        
        {/* Chapter Cover */}
        <div className="mt-12">
          <ChapterCover
            chapterNumber={currentChapterIndex + 1}
            title={currentChapter.title}
            subtitle={currentChapter.subtitle}
          />
        </div>
        
        {/* Chapter Content */}
        <div className="mt-8 animate-fade-in">
          <ChapterContent blocks={currentChapter.content} />
        </div>
        
        {/* Page Number */}
        <div className="mt-12 mb-8 text-center">
          <span className="text-sm font-body text-muted-foreground">
            Page {currentChapterIndex + 1} of {chapters.length}
          </span>
        </div>
        
        {/* Navigation */}
        <NavigationButtons
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={currentChapterIndex > 0}
          hasNext={currentChapterIndex < chapters.length - 1}
        />
        </div>
      </div>
  );
};
