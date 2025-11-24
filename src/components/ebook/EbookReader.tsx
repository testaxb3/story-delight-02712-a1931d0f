import { useState, useEffect, useRef, useCallback } from "react";
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
  initialScrollPosition?: number;
  completedChapters?: Set<number>;
  onChapterChange?: (index: number) => void;
  onChapterComplete?: (index: number) => void;
  onScrollPositionChange?: (position: number) => void;
  onClose?: () => void;
}

export const EbookReader = ({ 
  chapters, 
  initialChapter = 0,
  initialScrollPosition = 0,
  completedChapters: externalCompleted,
  onChapterChange,
  onChapterComplete,
  onScrollPositionChange,
  onClose 
}: EbookReaderProps) => {
  if (!chapters || chapters.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Content unavailable.</p>
      </div>
    );
  }

  const safeInitialChapter = Math.min(Math.max(initialChapter, 0), chapters.length - 1);
  
  const [currentChapterIndex, setCurrentChapterIndex] = useState(safeInitialChapter);
  const [fontSize, setFontSize] = useState(1);
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(
    externalCompleted || new Set()
  );
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const isInitialMount = useRef(true);
  
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

  // Restore scroll position ONLY on initial mount
  useEffect(() => {
    if (isInitialMount.current && initialScrollPosition > 0) {
      setTimeout(() => {
        window.scrollTo({ top: initialScrollPosition, behavior: 'auto' });
        isInitialMount.current = false;
      }, 100);
    }
  }, [initialScrollPosition]);

  // Intelligent header visibility + save scroll position + mark chapter complete
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollPosition = currentScrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Smart header: show when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowHeader(false);
      }
      lastScrollY.current = currentScrollY;

      // Mark chapter as completed when reaching the end
      if (scrollPosition >= documentHeight - 100) {
        if (!completedChapters.has(currentChapterIndex)) {
          const newCompleted = new Set(completedChapters);
          newCompleted.add(currentChapterIndex);
          
          // Call parent callback first (updates Supabase), then update localStorage
          onChapterComplete?.(currentChapterIndex);
          localStorage.setItem("ebook-completed", JSON.stringify(Array.from(newCompleted)));
          setCompletedChapters(newCompleted);
        }
      }

      // Debounce scroll position save (2000ms to reduce server load)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        onScrollPositionChange?.(Math.floor(currentScrollY));
      }, 2000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [currentChapterIndex, completedChapters, onChapterComplete, onScrollPositionChange]);

  const handleNext = () => {
    if (currentChapterIndex < chapters.length - 1) {
      const newIndex = currentChapterIndex + 1;
      setCurrentChapterIndex(newIndex);
      onChapterChange?.(newIndex);
      // Force immediate scroll to top - multiple attempts for reliability
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }
  };

  const handlePrevious = () => {
    if (currentChapterIndex > 0) {
      const newIndex = currentChapterIndex - 1;
      setCurrentChapterIndex(newIndex);
      onChapterChange?.(newIndex);
      // Force immediate scroll to top - multiple attempts for reliability
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }
  };

  const handleChapterSelect = (index: number) => {
    setCurrentChapterIndex(index);
    onChapterChange?.(index);
    // Force immediate scroll to top - multiple attempts for reliability
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  };

  const handleToggleBookmark = () => {
    toggleBookmark(currentChapterIndex);
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontSize: `${fontSize}rem` }}>
        {/* Fixed Header with Smart Visibility */}
        <div 
          className={`
            fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border
            transition-transform duration-300
            ${showHeader ? 'translate-y-0' : '-translate-y-full'}
          `}
        >
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
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
        </div>
        
        {/* Content with top padding to account for fixed header */}
        <div className="max-w-3xl mx-auto px-6 pt-24 pb-8">
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
          <ChapterContent blocks={currentChapter.content || []} />
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
