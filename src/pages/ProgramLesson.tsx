import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Heart, CheckCircle2, Loader2, ChevronLeft, BookOpen, Sparkles, ArrowRight, Clock, Headphones, Volume2, Star } from 'lucide-react';
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
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF6631', '#FFA300', '#FFB84D', '#4CAF50', '#22D933']
      });

      setShowComplete(true);
      toast.success('Lesson completed! 🎉');

      if (hasNextLesson) {
        setTimeout(() => {
          navigate(`/programs/${slug}/lesson/${lessonNumber + 1}`);
        }, 2500);
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
      <div className="min-h-screen bg-gradient-to-b from-[#FEFBF9] to-[#FDF8F5] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <motion.div
            animate={{ y: [-4, 4, -4], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-24 h-24 mx-auto mb-6 rounded-[20px] bg-gradient-to-br from-[#FF6631] to-[#FFA300] flex items-center justify-center shadow-xl shadow-orange-500/30"
          >
            <BookOpen className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-[#393939] mb-3">Lesson Not Found</h2>
          <p className="text-sm text-[#8D8D8D] mb-6 leading-relaxed">
            This lesson doesn't exist yet. It will be available soon as part of this program.
          </p>
          <motion.button
            onClick={() => navigate(`/programs/${slug}`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-[#FF6631] to-[#FFA300] text-white rounded-full font-semibold shadow-lg shadow-orange-500/30 flex items-center gap-2 mx-auto"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Program
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEFBF9] to-[#FDF8F5] pb-32">
      {/* Header with safe area */}
      <header className="sticky top-0 z-10 bg-gradient-to-b from-[#FEFBF9] to-[#FEFBF9]/95 backdrop-blur-sm">
        <div className="h-[env(safe-area-inset-top)]" />
        <div className="px-5 pt-4 pb-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => navigate(`/programs/${slug}`)}
              className="flex items-center gap-3"
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-md border border-[#F0F0F0] flex items-center justify-center">
                <ChevronLeft className="w-5 h-5 text-[#393939]" />
              </div>
              <div>
                <span className="text-lg font-bold text-[#393939]">Lesson {lessonNumber}</span>
                <p className="text-xs text-[#8D8D8D]">{program.title}</p>
              </div>
            </motion.button>

            {/* Lesson progress indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#8D8D8D]">
                {lessonNumber}/{program.total_lessons}
              </span>
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(lessonNumber / program.total_lessons) * 100}%` }}
                  className="h-full bg-gradient-to-r from-[#FF6631] to-[#FFA300] rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[#E8E8E6] to-transparent" />
      </header>

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-5"
      >
        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mt-4 bg-white rounded-[24px] shadow-lg shadow-black/5 border border-[#F0E6DF] overflow-hidden mb-6"
        >
          {/* Accent gradient at top */}
          <div className="h-1 w-full bg-gradient-to-r from-[#FF6631] via-[#FFA300] to-[#FFB84D]" />

          {/* Title section */}
          <div className="px-5 pt-5 pb-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-gradient-to-r from-[#FF6631]/10 to-[#FFA300]/10 rounded-full text-xs font-semibold text-[#FF6631]">
                    Day {lessonNumber}
                  </span>
                  {lesson.estimated_minutes && (
                    <span className="flex items-center gap-1 text-xs text-[#8D8D8D]">
                      <Clock className="w-3 h-3" />
                      {lesson.estimated_minutes} min
                    </span>
                  )}
                  {lesson.audio_url && (
                    <span className="flex items-center gap-1 text-xs text-[#8D8D8D]">
                      <Headphones className="w-3 h-3" />
                      Audio
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-bold text-[#393939] leading-tight">
                  {lesson.title}
                </h1>
              </div>

              {/* Completed badge */}
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span className="text-xs font-semibold text-white">Done</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Cover Image */}
          {lesson.image_url && (
            <div className="relative mx-4 mb-4">
              <div className="rounded-[16px] overflow-hidden shadow-sm">
                <img
                  src={lesson.image_url}
                  alt={lesson.title}
                  className="w-full h-52 object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-[16px]" />
              </div>

              {/* Favorite Button */}
              {lesson?.id && program && (
                <motion.button
                  onClick={() => toggleFavorite.mutate({ lessonId: lesson.id, programId: program.id })}
                  disabled={toggleFavorite.isPending}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-3 right-3 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all hover:shadow-xl"
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${isFavorite(lesson.id)
                        ? 'fill-red-500 text-red-500 scale-110'
                        : 'text-[#393939]'
                      }`}
                  />
                </motion.button>
              )}
            </div>
          )}

          {/* Audio Player - Premium Version */}
          {lesson.audio_url && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-4 mb-4 p-4 bg-gradient-to-br from-[#FFF5ED] to-[#FFEAD9] rounded-[16px] border border-[#FFD9B3]/50"
            >
              <audio ref={audioRef} src={lesson.audio_url} preload="metadata" />

              <div className="flex items-center gap-4">
                {/* Play button */}
                <motion.button
                  onClick={togglePlay}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6631] to-[#FFA300] flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30"
                >
                  {/* Animated ring when playing */}
                  {isPlaying && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-2 border-[#FF6631]"
                    />
                  )}
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  )}
                </motion.button>

                <div className="flex-1 min-w-0">
                  {/* Audio label */}
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="w-4 h-4 text-[#FF6631]" />
                    <span className="text-sm font-semibold text-[#393939]">Listen to lesson</span>
                  </div>

                  {/* Progress bar container */}
                  <div className="relative">
                    <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#FF6631] to-[#FFA300] rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />
                  </div>

                  {/* Time labels */}
                  <div className="flex justify-between text-[11px] font-medium text-[#8D8D8D] mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Summary */}
          {lesson.summary && (
            <div className="px-5 pb-5">
              <p className="text-[15px] text-[#666] leading-relaxed">
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

        {/* Mark as Completed Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 pt-6"
        >
          {/* Divider with sparkles */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E8E8E6] to-transparent" />
            <Sparkles className="w-5 h-5 text-[#FFA300]" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E8E8E6] to-transparent" />
          </div>

          <div className="text-center mb-5">
            <h3 className="text-lg font-bold text-[#393939] mb-1">
              {isCompleted ? 'Lesson Completed!' : 'Ready to continue?'}
            </h3>
            <p className="text-sm text-[#8D8D8D] px-4">
              {isCompleted
                ? 'Great job! You can revisit this lesson anytime.'
                : 'Mark this lesson as complete when you\'re done.'}
            </p>
          </div>

          <motion.button
            onClick={handleComplete}
            disabled={isCompleting || isCompleted}
            whileHover={!isCompleted && !isCompleting ? { scale: 1.02, y: -2 } : {}}
            whileTap={!isCompleted && !isCompleting ? { scale: 0.98 } : {}}
            className={`relative w-full py-4 rounded-full font-bold text-lg transition-all overflow-hidden flex items-center justify-center gap-2 ${isCompleted
                ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg shadow-green-500/30'
                : 'bg-gradient-to-r from-[#FF6631] to-[#FFA300] text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40'
              } ${isCompleting || isCompleted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {/* Shine effect */}
            {!isCompleted && !isCompleting && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            )}

            {isCompleting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving progress...</span>
              </>
            ) : isCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Lesson Completed</span>
                <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Mark as Completed</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          {/* Next lesson hint */}
          {!isCompleted && hasNextLesson && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-xs text-[#ABABAB] mt-3"
            >
              You'll automatically go to the next lesson
            </motion.p>
          )}
        </motion.div>
      </motion.main>

      {/* Completion Celebration */}
      <AnimatePresence>
        {showComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/98 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-center max-w-xs"
            >
              {/* Animated success icon */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 mx-auto mb-6 flex items-center justify-center shadow-xl shadow-green-500/30"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>

              {/* Stars decoration */}
              <div className="flex justify-center gap-2 mb-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
                  >
                    <Star className="w-6 h-6 text-[#FFA300] fill-[#FFA300]" />
                  </motion.div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-[#393939] mb-2">
                Lesson Complete!
              </h2>
              <p className="text-sm text-[#8D8D8D] mb-6 leading-relaxed">
                {hasNextLesson
                  ? 'Amazing work! Moving to the next lesson...'
                  : '🎉 Congratulations! You completed the program!'}
              </p>

              {hasNextLesson && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="h-1 bg-gradient-to-r from-[#FF6631] to-[#FFA300] rounded-full"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LessonSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEFBF9] to-[#FDF8F5] pb-32">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-10 bg-[#FEFBF9]">
        <div className="h-[env(safe-area-inset-top)]" />
        <div className="px-5 pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
            <div className="space-y-2">
              <div className="relative h-5 w-24 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
              <div className="relative h-3 w-32 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-5 mt-4">
        {/* Hero Card Skeleton */}
        <div className="bg-white rounded-[24px] shadow-lg border border-[#F0E6DF] overflow-hidden mb-6 p-5">
          {/* Title */}
          <div className="flex gap-2 mb-3">
            <div className="relative h-6 w-16 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
            <div className="relative h-6 w-20 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          </div>
          <div className="relative h-7 w-3/4 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden mb-4">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>

          {/* Image */}
          <div className="relative h-52 w-full rounded-[16px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden mb-4">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>

          {/* Audio Player */}
          <div className="bg-[#FFF5ED] rounded-[16px] p-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="relative h-4 w-24 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
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
        <div className="mt-10 pt-6">
          <div className="relative h-14 w-full rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
