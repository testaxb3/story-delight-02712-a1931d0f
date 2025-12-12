import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useProgramDetail, ProgramDetail as ProgramDetailType } from '@/hooks/useProgramDetail';
import { CurrentChallengeProgressCard } from '@/components/Programs/CurrentChallengeProgressCard';
import { ProgramBadgesSection } from '@/components/Programs/ProgramBadgesSection';
import { NextLessonCard } from '@/components/Programs/NextLessonCard';
import { LessonListItem } from '@/components/Programs/LessonListItem';
import { FavoritesSection } from '@/components/Programs/FavoritesSection';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BookOpen, ListChecks, Sparkles, AlertCircle } from 'lucide-react';

export default function ProgramDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: program, isLoading, error } = useProgramDetail(slug || '');

  if (isLoading) {
    return <ProgramDetailSkeleton />;
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Program Not Found</h2>
          <p className="text-sm text-muted-foreground mb-6">This program doesn't exist or has been removed.</p>
          <motion.button
            onClick={() => navigate('/programs')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-[#FF6631] to-[#FFA300] text-white rounded-full font-semibold shadow-lg shadow-orange-500/30"
          >
            Back to Programs
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Find next lesson to continue
  const completedLessons = program.progress.lessons_completed;
  const nextLessonNumber = completedLessons.length > 0
    ? Math.max(...completedLessons) + 1
    : 1;
  const nextLesson = program.lessons.find(l => l.day_number === nextLessonNumber) || program.lessons[0];
  const isFirstLesson = completedLessons.length === 0;

  // Determine lesson status
  const getLessonStatus = (lessonNumber: number): 'completed' | 'available' | 'locked' => {
    if (completedLessons.includes(lessonNumber)) return 'completed';
    // For now, all lessons are available (no locking logic)
    return 'available';
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with safe area */}
      <header className="bg-background sticky top-0 z-10">
        {/* Safe area spacing */}
        <div className="h-[env(safe-area-inset-top)]" />

        {/* Header content */}
        <div className="px-5 pt-4 pb-5">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/programs')}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-card shadow-md border border-border transition-all hover:shadow-lg"
              whileHover={{ x: -2, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </motion.button>

            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl text-foreground leading-6 font-bold"
              >
                Program Details
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xs text-muted-foreground mt-0.5"
              >
                {program.lessons.length} lessons • {completedLessons.length} completed
              </motion.p>
            </div>
          </div>
        </div>

        {/* Subtle divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </header>

      <motion.main
        className="px-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Progress Card */}
        <CurrentChallengeProgressCard
          title={program.title}
          totalLessons={program.total_lessons}
          completedLessons={completedLessons.length}
          ageRange={program.age_range}
          imageUrl={program.cover_image_url || '/program-images/picky-eating/28-day-picky-eater-mini.png'}
        />

        {/* Next Lesson Card */}
        {nextLesson && (
          <section className="py-3">
            <NextLessonCard
              lesson={nextLesson}
              programSlug={program.slug}
              programId={program.id}
              isFirstLesson={isFirstLesson}
              totalLessons={program.total_lessons}
            />
          </section>
        )}

        {/* Favorites Section */}
        <FavoritesSection programId={program.id} programSlug={program.slug} />

        {/* Achievements / Badges */}
        <ProgramBadgesSection badges={program.badges} lessonsCompleted={completedLessons.length} />

        {/* All Lessons Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="py-5"
        >
          {/* Section Header */}
          <div className="flex flex-row items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#2791E0] to-[#5BA8E8] shadow-lg shadow-blue-500/20">
                <ListChecks className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">All Lessons</h2>
                <p className="text-xs text-muted-foreground">{completedLessons.length} of {program.lessons.length} completed</p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-1">
              {program.lessons.slice(0, 5).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className={`w-1.5 h-6 rounded-full ${i < completedLessons.length
                    ? 'bg-gradient-to-b from-green-500 to-emerald-400'
                    : 'bg-gray-200'
                    }`}
                />
              ))}
              {program.lessons.length > 5 && (
                <span className="text-[10px] text-muted-foreground ml-1">+{program.lessons.length - 5}</span>
              )}
            </div>
          </div>

          {/* Lessons List */}
          <div className="bg-white dark:bg-card rounded-[20px] border border-border overflow-hidden shadow-sm">
            {program.lessons.map((lesson, index) => (
              <LessonListItem
                key={lesson.id}
                lesson={lesson}
                programSlug={program.slug}
                status={getLessonStatus(lesson.day_number)}
                index={index}
              />
            ))}
          </div>

          {/* Empty state */}
          {program.lessons.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center bg-white dark:bg-card rounded-[20px] border border-border"
            >
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center"
              >
                <BookOpen className="w-8 h-8 text-[#FF6631]/60" />
              </motion.div>
              <p className="text-base font-semibold text-foreground mb-1">
                Lessons Coming Soon
              </p>
              <p className="text-sm text-muted-foreground">
                We're preparing amazing content for you!
              </p>
              <motion.div
                className="flex justify-center gap-2 mt-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-[#FFA300]" />
                <Sparkles className="w-4 h-4 text-[#FF6631]" />
                <Sparkles className="w-4 h-4 text-[#FFA300]" />
              </motion.div>
            </motion.div>
          )}
        </motion.section>
      </motion.main>
    </div>
  );
}

function ProgramDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="px-5 pt-[calc(env(safe-area-inset-top)+16px)] pb-5">
        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <div className="space-y-2">
            <div className="relative h-5 w-32 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
            <div className="relative h-3 w-24 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* Progress card skeleton */}
        <div className="relative h-40 w-full rounded-[20px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>

        {/* Next lesson skeleton */}
        <div className="relative h-[380px] w-full rounded-[20px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>

        {/* Section header skeleton */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-[12px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <div className="space-y-2">
            <div className="relative h-5 w-28 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
            <div className="relative h-3 w-20 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          </div>
        </div>

        {/* Lessons list skeleton */}
        <div className="bg-white rounded-[20px] border border-gray-100 overflow-hidden">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-3 p-4 border-b border-gray-100 last:border-b-0">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="relative h-4 w-3/4 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                <div className="relative h-3 w-1/2 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
