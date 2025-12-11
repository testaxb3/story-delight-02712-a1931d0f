import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProgramDetail, useCompleteLesson } from '@/hooks/useProgramDetail';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import LessonContentRenderer from '@/components/Lessons/LessonContentRenderer';
import LessonAudioPlayer from '@/components/Lessons/LessonAudioPlayer';

export default function ProgramLesson() {
  const { slug, number } = useParams<{ slug: string; number: string }>();
  const navigate = useNavigate();
  const lessonNumber = parseInt(number?.replace('lesson-', '') || '1');
  
  const { data: program } = useProgramDetail(slug || '');
  const completeLesson = useCompleteLesson();
  const [isCompleting, setIsCompleting] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  // Fetch full lesson content
  const { data: lesson, isLoading } = useQuery({
    queryKey: ['program-lesson', slug, lessonNumber],
    queryFn: async () => {
      if (!program) return null;
      
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('program_id', program.id)
        .eq('day_number', lessonNumber)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!program,
  });

  const isCompleted = program?.progress.lessons_completed.includes(lessonNumber) || false;
  const hasNextLesson = lessonNumber < (program?.total_lessons || 30);
  const nextLessonNumber = lessonNumber + 1;

  const handleComplete = async () => {
    if (!program || isCompleted) return;
    
    setIsCompleting(true);
    try {
      const result = await completeLesson.mutateAsync({
        programId: program.id,
        lessonNumber
      });

      // Show celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setShowComplete(true);
      toast.success('Lesson completed! 🎉');

      // Auto-advance after delay
      if (hasNextLesson) {
        setTimeout(() => {
          navigate(`/programs/${slug}/lesson-${nextLessonNumber}`);
        }, 2000);
      }
    } catch (error) {
      toast.error('Failed to save progress');
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading || !program) {
    return <ProgramLessonSkeleton />;
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">Lesson Not Found</h2>
          <p className="text-sm text-muted-foreground mb-4">This lesson doesn't exist yet.</p>
          <button 
            onClick={() => navigate(`/programs/${slug}`)}
            className="text-primary text-sm font-medium"
          >
            Back to Program
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 pt-[calc(env(safe-area-inset-top)+12px)]">
          <button
            onClick={() => navigate(`/programs/${slug}`)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Lesson {lessonNumber} of {program.total_lessons}</p>
            <h1 className="text-base font-semibold text-foreground truncate">
              {lesson.title}
            </h1>
          </div>
          {isCompleted && (
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          )}
        </div>
      </div>

      {/* Audio Player */}
      {lesson.audio_url && (
        <div className="px-4 py-4 border-b border-border">
          <LessonAudioPlayer audioUrl={lesson.audio_url} title={lesson.title} />
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-6">
        <LessonContentRenderer content={lesson.content} />
      </div>

      {/* Complete Button */}
      <AnimatePresence>
        {!showComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="sticky bottom-0 px-4 py-4 pb-[calc(env(safe-area-inset-bottom)+16px)] bg-gradient-to-t from-background via-background to-transparent"
          >
            {isCompleted ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(`/programs/${slug}`)}
                >
                  Back to Program
                </Button>
                {hasNextLesson && (
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => navigate(`/programs/${slug}/lesson-${nextLessonNumber}`)}
                  >
                    Next Lesson
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ) : (
              <Button
                size="lg"
                className="w-full gap-2"
                onClick={handleComplete}
                disabled={isCompleting}
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Complete
                  </>
                )}
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Celebration */}
      <AnimatePresence>
        {showComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Lesson Complete!
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {hasNextLesson 
                  ? 'Moving to the next lesson...' 
                  : 'You completed the program! 🎉'}
              </p>
              {!hasNextLesson && (
                <Button onClick={() => navigate(`/programs/${slug}`)}>
                  View Program
                </Button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProgramLessonSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-4 pt-[calc(env(safe-area-inset-top)+16px)]">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-3 w-24 mb-1" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
        <Skeleton className="h-20 w-full rounded-xl mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}
