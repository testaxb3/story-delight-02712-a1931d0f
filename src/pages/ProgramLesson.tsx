import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Heart, CheckCircle2, Loader2, ChevronLeft, BookOpen } from 'lucide-react';
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
      <div className="min-h-screen bg-[#F8F8F8] dark:bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-[#FF6631]" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Lesson Not Found</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            This lesson doesn't exist yet. It will be available soon as part of this program.
          </p>
          <motion.button
            onClick={() => navigate(`/programs/${slug}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-[#FF6631] to-[#FF8551] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-shadow"
          >
            Back to Program
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-background pb-32">
      {/* Header with safe area - sticky covers entire top including status bar */}
      <header className="sticky top-0 z-10 bg-[#F8F8F8] dark:bg-background shadow-sm">
        {/* Safe area spacing inside sticky header */}
        <div className="h-[env(safe-area-inset-top)]" />
        {/* Header content */}
        <div className="px-5 pt-4 pb-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => navigate(`/programs/${slug}`)}
              className="flex items-center gap-2 text-foreground"
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-lg font-semibold">Lesson {lessonNumber}</span>
            </motion.button>
          </div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-5"
      >
        {/* Hero Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-card rounded-2xl shadow-md border border-border/30 overflow-hidden mb-6"
        >
          {/* Title inside card */}
          <div className="px-5 pt-5">
            <h1 className="text-xl font-bold text-[#393939] dark:text-foreground leading-tight">
              Lesson {lessonNumber}. {lesson.title}
            </h1>
          </div>

          {/* Cover Image with Heart overlay */}
          {lesson.image_url && (
            <div className="relative mt-4 mx-5">
              <img
                src={lesson.image_url}
                alt={lesson.title}
                className="w-full h-48 object-cover rounded-xl"
              />
              {lesson?.id && program && (
                <motion.button
                  onClick={() => toggleFavorite.mutate({ lessonId: lesson.id, programId: program.id })}
                  disabled={toggleFavorite.isPending}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all"
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      isFavorite(lesson.id)
                        ? 'fill-red-500 text-red-500 scale-110'
                        : 'text-[#393939] dark:text-white'
                    }`}
                  />
                </motion.button>
              )}
            </div>
          )}
          
          {/* Audio Player - Inline Simple */}
          {lesson.audio_url && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="px-5 py-4 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20"
            >
              <audio ref={audioRef} src={lesson.audio_url} preload="metadata" />
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={togglePlay}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6631] to-[#FF8551] flex items-center justify-center flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </motion.button>
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-[#E5E5E5] dark:bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#FF6631] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:shadow-lg [&::-webkit-slider-thumb]:transition-shadow"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Summary/Description */}
          {lesson.summary && (
            <div className="px-5 pb-5">
              <p className="text-[15px] text-[#393939]/80 dark:text-muted-foreground leading-relaxed">
                {lesson.summary}
              </p>
            </div>
          )}
        </motion.div>

        {/* Content */}
        {parsedContent ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="lesson-content"
          >
            <LessonContentRenderer content={parsedContent} skipHero />
          </motion.div>
        ) : (
          <div className="text-[15px] text-foreground leading-relaxed whitespace-pre-line px-5">
            {lesson.summary}
          </div>
        )}

        {/* Mark as Completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-6 border-t border-border"
        >
          <p className="text-sm text-muted-foreground text-center mb-4 px-2">
            After completing the lesson, click the button below and let us know you're ready to go to the next one.
          </p>

          <motion.button
            onClick={handleComplete}
            disabled={isCompleting || isCompleted}
            whileHover={!isCompleted && !isCompleting ? { scale: 1.02 } : {}}
            whileTap={!isCompleted && !isCompleting ? { scale: 0.98 } : {}}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all shadow-md ${
              isCompleted
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30'
                : 'bg-gradient-to-r from-[#FF6631] to-[#FF8551] text-white hover:shadow-lg hover:shadow-orange-500/40'
            } ${isCompleting || isCompleted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
          </motion.button>
        </motion.div>
      </motion.main>

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
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-background pb-32">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-10 bg-[#F8F8F8] dark:bg-background shadow-sm">
        <div className="h-[env(safe-area-inset-top)]" />
        <div className="px-5 pt-4 pb-4">
          <div className="relative h-6 w-32 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>
      </header>

      <div className="px-5">
        {/* Hero Card Skeleton */}
        <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-border/30 overflow-hidden mb-6 p-5">
          {/* Title */}
          <div className="relative h-7 w-3/4 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden mb-4">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>

          {/* Image */}
          <div className="relative h-48 w-full rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden mb-4">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>

          {/* Audio Player */}
          <div className="bg-orange-50/50 dark:bg-orange-950/20 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <div className="relative h-4 w-full rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
            <div className="relative h-4 w-5/6 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-3 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="relative h-4 w-full rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          ))}
        </div>

        {/* Button Skeleton */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="relative h-14 w-full rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
