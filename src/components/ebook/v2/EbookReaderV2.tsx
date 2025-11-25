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
  const previousChapterIndex = useRef(safeInitialChapter);
  const [fontSize, setFontSize] = useState(1);
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(
    externalCompleted || new Set()
  );
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const currentScrollY = useRef(0); // Track current scroll position
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const isInitialMount = useRef(true);
  const hasRestoredScroll = useRef(false);
  
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { highlights, getChapterHighlights } = useHighlights();

  const currentChapter = chapters[currentChapterIndex];
  
  console.log('🔍 Current chapter data:', { 
    currentChapterIndex, 
    title: currentChapter?.title,
    subtitle: currentChapter?.subtitle,
    contentLength: currentChapter?.content?.length
  });
  
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
    if (isInitialMount.current && !hasRestoredScroll.current) {
      if (initialScrollPosition > 0) {
        console.log('🎯 [INIT] Preparing to restore scroll to:', initialScrollPosition);
        hasRestoredScroll.current = true;

        // Use requestAnimationFrame for more reliable scroll restoration
        const restoreScroll = () => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const before = window.scrollY;
              window.scrollTo({ top: initialScrollPosition, behavior: 'auto' });
              document.documentElement.scrollTop = initialScrollPosition;
              document.body.scrollTop = initialScrollPosition;
              currentScrollY.current = initialScrollPosition;
              const after = window.scrollY;
              console.log('✅ [RESTORE] Scroll set:', { target: initialScrollPosition, before, after });
            });
          });
        };

        // Try multiple times to ensure it sticks - with longer delays
        setTimeout(restoreScroll, 150);
        setTimeout(restoreScroll, 600);
        setTimeout(restoreScroll, 1200);
        setTimeout(restoreScroll, 2000); // Extra attempt
      } else {
        console.log('📜 [INIT] No scroll position to restore (starting at top)');
        hasRestoredScroll.current = true;
      }
      // Mark that initial mount is complete AFTER restoration attempts
      setTimeout(() => {
        isInitialMount.current = false;
        console.log('🏁 [INIT] Initial mount complete, scroll restoration done');
      }, 2500);
    }
  }, [initialScrollPosition]);

  // ✅ CRITICAL: Force scroll to top ONLY when user manually changes chapter
  useEffect(() => {
    // Skip this entirely during initial mount
    if (isInitialMount.current) {
      console.log('⏭️ [CHAPTER] Skipping scroll-to-top: still in initial mount');
      return;
    }

    // Only scroll to top if chapter actually changed (not on initial mount)
    if (currentChapterIndex !== previousChapterIndex.current) {
      console.log('📍 [CHAPTER] Chapter changed from', previousChapterIndex.current, 'to', currentChapterIndex, '- scrolling to top');
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      previousChapterIndex.current = currentChapterIndex;
    } else {
      console.log('📍 [CHAPTER] Same chapter, keeping scroll position');
    }
  }, [currentChapterIndex]);

  // Poll scroll position every 500ms (fallback if scroll events don't work)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

      if (scrollY !== currentScrollY.current) {
        console.log('📜 [POLL] Scroll detected! scrollY:', Math.floor(scrollY), '(was:', Math.floor(currentScrollY.current), ')');
        currentScrollY.current = scrollY;
      }
    }, 500);

    return () => clearInterval(pollInterval);
  }, []);

  // Debug: Log ALL scroll events to track unexpected scroll changes
  useEffect(() => {
    const debugScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      console.log('🔍 [DEBUG] Scroll event fired! scrollY:', Math.floor(scrollY));
    };

    window.addEventListener('scroll', debugScroll, { passive: true });
    return () => window.removeEventListener('scroll', debugScroll);
  }, []);

  // Intelligent header visibility + save scroll position + mark chapter complete
  useEffect(() => {
    console.log('🔧 Setting up scroll listener on window');

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const scrollPosition = scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Update ref with current scroll position
      currentScrollY.current = scrollY;

      // Debug: log every scroll event
      console.log('📜 Window scroll event! scrollY:', Math.floor(scrollY), 'documentHeight:', documentHeight);

      // Smart header: show when scrolling up, hide when scrolling down
      if (scrollY < lastScrollY.current || scrollY < 100) {
        setShowHeader(true);
      } else if (scrollY > lastScrollY.current && scrollY > 100) {
        setShowHeader(false);
      }
      lastScrollY.current = scrollY;

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
        console.log('💾 Saving scroll position:', Math.floor(scrollY));
        onScrollPositionChange?.(Math.floor(scrollY));
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
      setCurrentChapterIndex(nextIndex);
      onChapterChange?.(nextIndex);
      // Scroll to top - header is now compact
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    }
  }, [currentChapterIndex, chapters.length, onChapterChange]);

  const handlePrevious = useCallback(() => {
    if (currentChapterIndex > 0) {
      const prevIndex = currentChapterIndex - 1;
      setCurrentChapterIndex(prevIndex);
      onChapterChange?.(prevIndex);
      // Scroll to top - header is now compact
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    }
  }, [currentChapterIndex, onChapterChange]);

  const handleChapterSelect = useCallback((index: number) => {
    setCurrentChapterIndex(index);
    onChapterChange?.(index);
    // Scroll to top - header is now compact
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, [onChapterChange]);

  const handleToggleBookmark = useCallback(() => {
    toggleBookmark(currentChapterIndex);
  }, [currentChapterIndex, toggleBookmark]);

  const handleClose = useCallback(() => {
    // Use ref value which is always current
    const scrollPosition = currentScrollY.current;
    console.log('🚪 Closing ebook - saving final scroll position:', scrollPosition);
    onScrollPositionChange?.(Math.floor(scrollPosition));

    // Small delay to ensure save completes
    setTimeout(() => {
      onClose?.();
    }, 200);
  }, [onScrollPositionChange, onClose]);

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
        {/* Status Bar Spacer for PWA */}
        <div className="w-full" style={{ height: 'env(safe-area-inset-top)' }} />
        
        <div className="container mx-auto px-4 pt-2 pb-4 flex items-center justify-between gap-2 max-w-5xl">
          <div className="flex items-center gap-3 min-w-0 flex-shrink">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="hover:bg-accent/50 flex-shrink-0"
              aria-label="Close ebook"
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Chapter Info with Title */}
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                <Home className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="flex-shrink-0">Chapter {currentChapterIndex + 1} of {chapters.length}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline text-primary font-semibold">{progress}% complete</span>
              </div>
              <h2 className="text-sm md:text-base font-bold text-foreground font-sans truncate max-w-[200px] md:max-w-[400px]">
                {currentChapter.title}
              </h2>
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
      <main className="container mx-auto px-4 pb-24 max-w-3xl" style={{ paddingTop: 'calc(6rem + env(safe-area-inset-top))' }}>
        {/* Spacer to push content down */}
        <div className="h-4"></div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar
            current={currentChapterIndex + 1}
            total={chapters.length}
            percentage={progress}
          />
        </div>

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
