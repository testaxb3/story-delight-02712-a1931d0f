import { useState, useEffect } from "react";
import { EbookReaderV2 } from "@/components/ebook/v2/EbookReaderV2";
import { EbookCoverPage } from "@/components/ebook/EbookCoverPage";
import { ebookContent } from "@/data/ebookContent";
import { useNavigate, useParams } from "react-router-dom";
import { useEbookContent } from "@/hooks/useEbookContent";
import { useEbookProgress } from "@/hooks/useEbookProgress";
import { useQueryClient } from "@tanstack/react-query";

const EbookReaderV2Page = () => {
  const navigate = useNavigate();
  const { ebookId } = useParams();

  // Load dynamic ebook content
  const { ebook, chapters, isLoading, error } = useEbookContent(ebookId);
  
  // Load user progress
  const queryClient = useQueryClient();

  const {
    progress,
    isLoading: isProgressLoading,
    updateCurrentChapter,
    updateScrollPosition,
    markChapterComplete,
    saveHighlight
  } = useEbookProgress(ebook?.id);

  // Check if user has seen cover before
  const [showCover, setShowCover] = useState<boolean | null>(null);

  useEffect(() => {
    if (ebook?.id) {
      // Check localStorage for cover seen status
      const hasSeenCover = localStorage.getItem(`ebook-cover-seen-${ebook.id}`);
      // Also check if user has any progress (meaning they've read before)
      const hasProgress = progress && (progress.current_chapter > 0 || progress.scroll_position > 0);
      
      setShowCover(!hasSeenCover && !hasProgress);
    }
  }, [ebook?.id, progress]);

  const handleStartReading = () => {
    if (ebook?.id) {
      localStorage.setItem(`ebook-cover-seen-${ebook.id}`, 'true');
    }
    setShowCover(false);
  };

  const handleClose = () => {
    // Invalidate queries to refresh progress on next open
    queryClient.invalidateQueries({ queryKey: ['ebook-progress', ebook?.id] });
    navigate('/bonuses');
  };

  // Wait for BOTH ebook AND progress to load before rendering
  if (isLoading || (ebook?.id && isProgressLoading) || showCover === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading ebook...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-red-500 font-medium">Unable to load ebook.</p>
          <p className="text-sm text-muted-foreground">Please try again later.</p>
          <button 
            onClick={() => navigate('/bonuses')} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Back to bonuses
          </button>
        </div>
      </div>
    );
  }

  // Use dynamic chapters if available, fallback to hardcoded
  const finalChapters = chapters && chapters.length > 0 ? chapters : ebookContent;

  if (!finalChapters || finalChapters.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="font-medium">No content found.</p>
          <p className="text-sm text-muted-foreground">Please return to bonuses and try again.</p>
          <button 
            onClick={() => navigate('/bonuses')} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Back to bonuses
          </button>
        </div>
      </div>
    );
  }

  // Show cover page on first visit
  if (showCover) {
    return (
      <EbookCoverPage
        title={ebook?.title || finalChapters[0]?.title || 'Untitled'}
        subtitle={ebook?.subtitle || undefined}
        readingTime={ebook?.estimated_reading_time ? `${ebook.estimated_reading_time} min` : undefined}
        chapterCount={finalChapters.length}
        coverColor={ebook?.cover_color || '#6366f1'}
        thumbnail={ebook?.thumbnail_url}
        onStartReading={handleStartReading}
      />
    );
  }

  const initialChapter = Math.min(
    Math.max(progress?.current_chapter ?? 0, 0),
    finalChapters.length - 1
  );
  const initialScrollPosition = progress?.scroll_position ?? 0;
  const completedChapters = new Set(progress?.completed_chapters || []);

  console.log('📍 Initial values:', {
    initialChapter,
    initialScrollPosition,
    rawScrollPosition: progress?.scroll_position,
    hasProgress: !!progress
  });

  return (
    <div className="relative">
      <EbookReaderV2
        chapters={finalChapters}
        initialChapter={initialChapter}
        initialScrollPosition={initialScrollPosition}
        completedChapters={completedChapters}
        onChapterChange={(index) => {
          console.log('💾 Saving chapter progress:', index, 'ebook ID:', ebook?.id);
          if (!ebook?.id) {
            console.error('❌ Cannot save chapter: ebook.id is undefined');
            return;
          }
          updateCurrentChapter.mutate(index);
        }}
        onScrollPositionChange={(position) => {
          if (!ebook?.id) return;
          updateScrollPosition.mutate(position);
        }}
        onChapterComplete={(index) => {
          console.log('✅ Marking chapter complete:', index);
          if (!ebook?.id) {
            console.error('❌ Cannot mark complete: ebook.id is undefined');
            return;
          }
          markChapterComplete.mutate(index);
        }}
        onClose={handleClose}
      />
    </div>
  );
};

export default EbookReaderV2Page;
