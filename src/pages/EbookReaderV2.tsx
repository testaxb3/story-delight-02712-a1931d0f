import { EbookReaderV2 } from "@/components/ebook/v2/EbookReaderV2";
import { ebookContent } from "@/data/ebookContent";
import { useNavigate, useParams } from "react-router-dom";
import { useEbookContent } from "@/hooks/useEbookContent";
import { useEbookProgress } from "@/hooks/useEbookProgress";
import { Badge } from "@/components/ui/badge";

const EbookReaderV2Page = () => {
  const navigate = useNavigate();
  const { ebookId } = useParams();

  // Load dynamic ebook content
  const { ebook, chapters, isLoading, error } = useEbookContent(ebookId);
  
  // Load user progress
  const { 
    progress, 
    updateCurrentChapter, 
    updateScrollPosition,
    markChapterComplete,
    saveHighlight
  } = useEbookProgress(ebook?.id);

  console.log('📊 Progress loaded:', {
    ebookId: ebook?.id,
    hasProgress: !!progress,
    currentChapter: progress?.current_chapter,
    completedChapters: progress?.completed_chapters,
    highlights: progress?.highlights
  });

  const handleClose = () => {
    navigate('/bonuses');
  };

  if (isLoading) {
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

  console.log('🔍 Ebook Debug:', { 
    ebookId, 
    hasEbook: !!ebook, 
    ebookTitle: ebook?.title,
    chaptersCount: chapters?.length,
    finalChaptersCount: finalChapters?.length,
    firstChapter: finalChapters?.[0]
  });

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

  const initialChapter = Math.min(
    Math.max(progress?.current_chapter ?? 0, 0),
    finalChapters.length - 1
  );
  const initialScrollPosition = progress?.scroll_position ?? 0;
  const completedChapters = new Set(progress?.completed_chapters || []);

  return (
    <div className="relative">
      <EbookReaderV2
        chapters={finalChapters}
        initialChapter={initialChapter}
        initialScrollPosition={initialScrollPosition}
        completedChapters={completedChapters}
        onChapterChange={(index) => {
          console.log('💾 Saving chapter progress:', index, 'ebook ID:', ebook?.id);
          if (ebook?.id) {
            updateCurrentChapter.mutate(index);
          } else {
            console.error('❌ Cannot save: ebook.id is undefined');
          }
        }}
        onScrollPositionChange={(position) => {
          if (ebook?.id) {
            updateScrollPosition.mutate(position);
          }
        }}
        onChapterComplete={(index) => {
          console.log('✅ Marking chapter complete:', index);
          if (ebook?.id) {
            markChapterComplete.mutate(index);
          } else {
            console.error('❌ Cannot mark complete: ebook.id is undefined');
          }
        }}
        onClose={handleClose}
      />
    </div>
  );
};

export default EbookReaderV2Page;
