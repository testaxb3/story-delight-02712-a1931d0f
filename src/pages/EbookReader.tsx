import { EbookReader } from "@/components/ebook/EbookReader";
import { ebookContent } from "@/data/ebookContent";
import { useNavigate, useParams } from "react-router-dom";
import { useEbookContent } from "@/hooks/useEbookContent";
import { useEbookProgress } from "@/hooks/useEbookProgress";

const EbookReaderPage = () => {
  const navigate = useNavigate();
  const { ebookId } = useParams();

  // Load dynamic ebook content
  const { ebook, chapters, chaptersMarkdown, markdown_source, isLoading, error } = useEbookContent(ebookId);
  
  // Load user progress
  const { 
    progress, 
    updateCurrentChapter, 
    updateScrollPosition,
    markChapterComplete 
  } = useEbookProgress(ebookId);

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

  // Prefer markdown chapters, fallback to parsed chapters, then hardcoded
  const useMarkdown = chaptersMarkdown && chaptersMarkdown.length > 0;
  const finalChapters = useMarkdown ? chaptersMarkdown : (chapters && chapters.length > 0 ? chapters : ebookContent);

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
    <EbookReader
      chapters={finalChapters}
      useMarkdown={useMarkdown}
      initialChapter={initialChapter}
      initialScrollPosition={initialScrollPosition}
      completedChapters={completedChapters}
      onChapterChange={(index) => {
        if (ebookId) {
          updateCurrentChapter.mutate(index);
        }
      }}
      onScrollPositionChange={(position) => {
        if (ebookId) {
          updateScrollPosition.mutate(position);
        }
      }}
      onChapterComplete={(index) => {
        if (ebookId) {
          markChapterComplete.mutate(index);
        }
      }}
      onClose={handleClose}
    />
  );
};

export default EbookReaderPage;
