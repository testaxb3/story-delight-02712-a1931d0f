import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LessonWithProgress, useMarkLessonComplete } from '@/hooks/useLessons';
import { CheckCircle2, Clock, BookOpen, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';

interface LessonDetailSheetProps {
  lesson: LessonWithProgress | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LessonDetailSheet({ lesson, open, onOpenChange }: LessonDetailSheetProps) {
  const markComplete = useMarkLessonComplete();

  if (!lesson) return null;

  const isCompleted = lesson.progress?.completed;

  const handleMarkComplete = async () => {
    try {
      await markComplete.mutateAsync(lesson.id);
      toast.success('Lesson completed! 🎉', {
        description: 'Great job! Keep up the momentum.',
      });
    } catch (error) {
      toast.error('Failed to mark lesson as complete');
    }
  };

  // Sanitize HTML content
  const sanitizedContent = DOMPurify.sanitize(lesson.content, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'br', 'blockquote', 'img', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'style', 'target'],
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[92vh] rounded-t-3xl p-0 border-0"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <SheetHeader className="p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    Day {lesson.day_number}
                  </span>
                  {lesson.estimated_minutes && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {lesson.estimated_minutes} min
                    </span>
                  )}
                </div>
                <SheetTitle className="text-left text-xl font-bold">
                  {lesson.title}
                </SheetTitle>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* Content */}
        <ScrollArea className="h-[calc(92vh-180px)]">
          <div className="px-5 py-6">
            {/* Lesson Content */}
            <div 
              className="prose prose-sm dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:text-foreground
                prose-h1:text-2xl prose-h1:mb-4
                prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
                prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                prose-li:text-muted-foreground
                prose-strong:text-foreground prose-strong:font-semibold
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                prose-img:rounded-xl prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>
        </ScrollArea>

        {/* Footer Action */}
        <div className="sticky bottom-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/40">
          {isCompleted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 py-3 bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Completed</span>
            </motion.div>
          ) : (
            <Button 
              onClick={handleMarkComplete}
              disabled={markComplete.isPending}
              className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg shadow-lg shadow-emerald-500/30"
            >
              {markComplete.isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Mark as Complete
                </>
              )}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
