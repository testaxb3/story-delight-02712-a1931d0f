import { EbookReader } from "@/components/ebook/EbookReader";
import { ebookContent } from "@/data/ebookContent";
import { useNavigate, useParams } from "react-router-dom";
import { useEbookContent } from "@/hooks/useEbookContent";
import { useEbookProgress } from "@/hooks/useEbookProgress";

const EbookReaderPage = () => {
  const navigate = useNavigate();
  const { ebookId } = useParams();

  // Load dynamic ebook content
  const { ebook, chapters, isLoading } = useEbookContent(ebookId);
  
  // Load user progress
  const { 
    progress, 
    updateCurrentChapter, 
    markChapterComplete 
  } = useEbookProgress(ebookId);

  const handleClose = () => {
    navigate(-1);
  };

  // Use dynamic chapters if available, fallback to hardcoded
  const finalChapters = chapters || ebookContent;
  const initialChapter = progress?.current_chapter || 0;
  const completedChapters = new Set(progress?.completed_chapters || []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando ebook...</p>
        </div>
      </div>
    );
  }

  return (
    <EbookReader
      chapters={finalChapters}
      initialChapter={initialChapter}
      completedChapters={completedChapters}
      onChapterChange={(index) => {
        if (ebookId) {
          updateCurrentChapter.mutate(index);
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
