import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Heart, CheckCircle2, Loader2, ChevronLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProgramDetail, useCompleteLesson } from '@/hooks/useProgramDetail';
import { useFavoriteLessons } from '@/hooks/useFavoriteLessons';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { LessonContentRenderer } from '@/components/Lessons/content/LessonContentRenderer';
import { isStructuredContent, StructuredLessonContent } from '@/types/lesson-content';

export default function ProgramLesson() {
  const { slug, number } = useParams<{ slug: string; number: string }>();
  const navigate = useNavigate();
  const lessonNumber = parseInt(number || '1');

  const { data: program } = useProgramDetail(slug || '');
  const { isFavorite, toggleFavorite } = useFavoriteLessons(program?.id);
  const completeLesson = useCompleteLesson();
  const [isCompleting, setIsCompleting] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  // Audio player state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Fetch full lesson content from database
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
  const hasNextLesson = lessonNumber < (program?.total_lessons || 28);

  // Audio handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = parseFloat(e.target.value);
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleComplete = async () => {
    if (!program || isCompleted) return;

    setIsCompleting(true);
    try {
      await completeLesson.mutateAsync({
        programId: program.id,
        lessonNumber
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setShowComplete(true);
      toast.success('Lesson completed!');

      if (hasNextLesson) {
        setTimeout(() => {
          navigate(`/programs/${slug}/lesson/${lessonNumber + 1}`);
        }, 2000);
      }
    } catch (error) {
      toast.error('Failed to save progress');
    } finally {
      setIsCompleting(false);
    }
  };

  // Parse content if it's a string (Supabase returns JSON as string)
  const parsedContent = useMemo((): StructuredLessonContent | null => {
    if (!lesson?.content) return null;
    
    // If already an object, use directly
    if (typeof lesson.content === 'object') {
      return isStructuredContent(lesson.content) ? lesson.content : null;
    }
    
    // If string, parse it
    if (typeof lesson.content === 'string') {
      try {
        const parsed = JSON.parse(lesson.content);
        return isStructuredContent(parsed) ? parsed : null;
      } catch {
        return null;
      }
    }
    
    return null;
  }, [lesson?.content]);

  if (isLoading || !program) {
    return <LessonSkeleton />;
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
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-background pb-32">
      {/* Simple Header */}
      <header className="px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(`/programs/${slug}`)} 
            className="flex items-center gap-2 text-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-lg font-semibold">Lesson {lessonNumber}</span>
          </button>
        </div>
      </header>

      <main className="px-4">
        {/* Hero Card Container */}
        <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border/30 overflow-hidden mb-6">
          {/* Title inside card */}
          <div className="px-4 pt-4">
            <h1 className="text-lg font-bold text-[#393939] dark:text-foreground leading-tight">
              Lesson {lessonNumber}. {lesson.title}
            </h1>
          </div>
          
          {/* Cover Image with Heart overlay */}
          {lesson.image_url && (
            <div className="relative mt-3 mx-4">
              <img
                src={lesson.image_url}
                alt={lesson.title}
                className="w-full h-44 object-cover rounded-xl"
              />
              {lesson?.id && program && (
                <button
                  onClick={() => toggleFavorite.mutate({ lessonId: lesson.id, programId: program.id })}
                  disabled={toggleFavorite.isPending}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-black/50 flex items-center justify-center shadow-sm"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isFavorite(lesson.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-[#393939] dark:text-white'
                    }`}
                  />
                </button>
              )}
            </div>
          )}
          
          {/* Audio Player - Inline Simple */}
          {lesson.audio_url && (
            <div className="px-4 py-3">
              <audio ref={audioRef} src={lesson.audio_url} preload="metadata" />
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-11 h-11 rounded-full bg-[#FF6631] flex items-center justify-center flex-shrink-0 shadow-sm"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-[#E5E5E5] dark:bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-[#FF6631] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Summary/Description */}
          {lesson.summary && (
            <div className="px-4 pb-4">
              <p className="text-[15px] text-[#393939]/80 dark:text-muted-foreground leading-relaxed">
                {lesson.summary}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        {parsedContent ? (
          <div className="lesson-content">
            <LessonContentRenderer content={parsedContent} skipHero />
          </div>
        ) : (
          <div className="text-[15px] text-foreground leading-relaxed whitespace-pre-line">
            {lesson.summary}
          </div>
        )}

        {/* Mark as Completed */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground text-center mb-3">
            After completing the lesson, click the button below and let us know you're ready to go to the next one.
          </p>

          <button
            onClick={handleComplete}
            disabled={isCompleting || isCompleted}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${
              isCompleted
                ? 'bg-green-500 text-white'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {isCompleting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </span>
            ) : isCompleted ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Completed
              </span>
            ) : (
              'Mark as Completed'
            )}
          </button>
        </div>
      </main>

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
                  : 'You completed the program!'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LessonSkeleton() {
  return (
    <div className="min-h-screen bg-background px-5 pt-12">
      <Skeleton className="h-6 w-32 mb-6" />
      <Skeleton className="h-48 w-full rounded-2xl mb-4" />
      <Skeleton className="h-11 w-full rounded-full mb-4" />
      <Skeleton className="h-7 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-6" />
      <Skeleton className="h-px w-full mb-6" />
      <Skeleton className="h-5 w-48 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
