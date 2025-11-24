import { useState, useEffect, useRef, useCallback } from "react";
import { X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "../ProgressBar";
import { ChapterContentV2 } from "./ChapterContentV2";
import { NavigationButtons } from "../NavigationButtons";
import { ChapterCoverV2 } from "./ChapterCoverV2";
import { TableOfContents } from "../TableOfContents";
import { SearchDialog } from "../SearchDialog";
import { ReadingControlsV2 } from "./ReadingControlsV2";
import { NotesPanel } from "../NotesPanel";
import { HighlightsPanel } from "./HighlightsPanel";
import { Chapter } from "@/data/ebookContent";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useHighlights } from "@/hooks/useHighlights";

interface EbookReaderV2Props {
  chapters: Chapter[];
  initialChapter?: number;
  initialScrollPosition?: number;
  completedChapters?: Set<number>;
  onChapterChange?: (index: number) => void;
  onChapterComplete?: (index: number) => void;
  onScrollPositionChange?: (position: number) => void;
  onClose?: () => void;
}

export const EbookReaderV2 = ({ 
  chapters, 
  initialChapter = 0,
  initialScrollPosition = 0,
  completedChapters: externalCompleted,
  onChapterChange,
  onChapterComplete,
  onScrollPositionChange,
  onClose 
}: EbookReaderV2Props) => {
  console.log('📖 EbookReaderV2 mounted:', { 
    chaptersCount: chapters?.length,
    initialChapter,
    firstChapter: chapters?.[0]
  });

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
  const { highlights, getChapterHighlights } = useHighlights();

  const currentChapter = chapters[currentChapterIndex];
  
  if (!currentChapter) {
    console.error('❌ Current chapter not found:', currentChapterIndex);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chapter not found.</p>
      </div>
    );
  }

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
    if (isInitialMount.current) {
      if (initialScrollPosition > 0) {
        setTimeout(() => {
          window.scrollTo({ top: initialScrollPosition, behavior: 'auto' });
        }, 100);
      }
      // Mark that initial mount is complete
      isInitialMount.current = false;
    }
  }, [initialScrollPosition]);

  // ✅ CRITICAL: Force scroll to top when chapter changes
  useEffect(() => {
    console.log('🔝 Scroll effect triggered:', { 
      currentChapterIndex, 
      isInitialMount: isInitialMount.current,
      currentScroll: window.scrollY 
    });
    
    if (!isInitialMount.current) {
      // Scroll to top immediately when chapter changes
      window.scrollTo({ top: 0, behavior: 'instant' });
      console.log('✅ Scrolled to top, new position:', window.scrollY);
    }
  }, [currentChapterIndex]);

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
          setCompletedChapters(newCompleted);
          localStorage.setItem("ebook-completed", JSON.stringify([...newCompleted]));
          onChapterComplete?.(currentChapterIndex);
        }
      }

      // Debounced scroll position save (2000ms to reduce server load)
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        onScrollPositionChange?.(currentScrollY);
      }, 2000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [currentChapterIndex, completedChapters, onChapterComplete, onScrollPositionChange]);

  const handleNext = useCallback(() => {
    if (currentChapterIndex < chapters.length - 1) {
      const nextIndex = currentChapterIndex + 1;
      console.log('📖 Next chapter clicked:', { from: currentChapterIndex, to: nextIndex });
      setCurrentChapterIndex(nextIndex);
      onChapterChange?.(nextIndex);
      // Force scroll immediately
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentChapterIndex, chapters.length, onChapterChange]);

  const handlePrevious = useCallback(() => {
    if (currentChapterIndex > 0) {
      const prevIndex = currentChapterIndex - 1;
      console.log('📖 Previous chapter clicked:', { from: currentChapterIndex, to: prevIndex });
      setCurrentChapterIndex(prevIndex);
      onChapterChange?.(prevIndex);
      // Force scroll immediately
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentChapterIndex, onChapterChange]);

  const handleChapterSelect = useCallback((index: number) => {
    console.log('📖 Chapter selected from menu:', { from: currentChapterIndex, to: index });
    setCurrentChapterIndex(index);
    onChapterChange?.(index);
    // Force scroll immediately
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentChapterIndex, onChapterChange]);

  const handleToggleBookmark = useCallback(() => {
    toggleBookmark(currentChapterIndex);
  }, [currentChapterIndex, toggleBookmark]);

  const chapterHighlights = getChapterHighlights(currentChapterIndex);

  return (
    <div 
      className="min-h-screen bg-background pb-[calc(6rem+env(safe-area-inset-bottom))] font-serif"
      style={{ fontSize: `${fontSize}rem` }}
    >
      {/* Smart Header - Slides in/out */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-glass border-b border-border transition-transform duration-300 ${
          showHeader ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 py-2 max-w-5xl" style={{ paddingTop: 'calc(0.5rem + env(safe-area-inset-top))' }}>
          <ProgressBar 
            current={currentChapterIndex + 1}
            total={chapters.length}
            percentage={progress}
          />
        </div>
        
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-2 max-w-5xl">
          <div className="flex items-center gap-2 min-w-0 flex-shrink">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-accent/50 flex-shrink-0"
              aria-label="Close ebook"
            >
              <X className="h-5 w-5" />
            </Button>
            
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground font-sans min-w-0">
              <Home className="h-4 w-4 flex-shrink-0" />
              <span className="flex-shrink-0">Chapter {currentChapterIndex + 1}</span>
              <span className="flex-shrink-0">•</span>
              <span className="truncate max-w-[150px]">{currentChapter.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <TableOfContents 
              chapters={chapters}
              currentChapter={currentChapterIndex}
              completedChapters={completedChapters}
              onChapterSelect={handleChapterSelect}
            />
            
            <SearchDialog chapters={chapters} onResultClick={handleChapterSelect} />
            
            <NotesPanel 
              currentChapter={currentChapterIndex}
            />

            <HighlightsPanel 
              chapterIndex={currentChapterIndex}
              highlights={chapterHighlights}
              onHighlightClick={(highlight) => {
                console.log("Navigate to highlight:", highlight);
              }}
            />
            
            <ReadingControlsV2
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              isBookmarked={isBookmarked(currentChapterIndex)}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        </div>
      </header>

      {/* Main Content - Premium Typography */}
      <main className="container mx-auto px-4 pt-32 pb-24 max-w-3xl">
        <ChapterCoverV2
          chapterNumber={currentChapterIndex + 1}
          title={currentChapter?.title || 'Untitled Chapter'}
          subtitle={currentChapter?.subtitle}
        />

        <ChapterContentV2 
          blocks={currentChapter?.content || []}
          chapterIndex={currentChapterIndex}
        />

        <div className="mt-12 text-center text-sm text-muted-foreground font-sans">
          Page {currentChapterIndex + 1} of {chapters.length}
        </div>

        <NavigationButtons
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasNext={currentChapterIndex < chapters.length - 1}
          hasPrevious={currentChapterIndex > 0}
        />
      </main>
    </div>
  );
};
