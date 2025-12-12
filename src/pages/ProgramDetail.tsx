import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useProgramDetail, ProgramDetail as ProgramDetailType } from '@/hooks/useProgramDetail';
import { CurrentChallengeProgressCard } from '@/components/Programs/CurrentChallengeProgressCard';
import { ProgramBadgesSection } from '@/components/Programs/ProgramBadgesSection';
import { NextLessonCard } from '@/components/Programs/NextLessonCard';
import { LessonListItem } from '@/components/Programs/LessonListItem';
import { FavoritesSection } from '@/components/Programs/FavoritesSection';
import { Skeleton } from '@/components/ui/skeleton';

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
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">Program Not Found</h2>
          <p className="text-sm text-muted-foreground mb-4">This program doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/programs')}
            className="text-primary text-sm font-medium"
          >
            Back to Programs
          </button>
        </div>
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
    // You can add sequential unlocking here if needed
    return 'available';
  };

  return (
    <div className="min-h-screen bg-[#FEFBF9] pb-24">
      {/* Header with safe area - sticky covers entire top including status bar */}
      <header className="bg-[#FEFBF9] sticky top-0 z-10 border-b border-[#E8E8E6] shadow-sm">
        {/* Safe area spacing inside sticky header */}
        <div className="h-[env(safe-area-inset-top)]" />
        {/* Header content */}
        <div className="px-5 pt-4 pb-5">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate('/programs')}
                className="p-1"
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
                  <path d="M8 1L2 7.5L8 14" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
              <p className="text-xl text-[#303030] leading-6 font-semibold">
                Program Details
              </p>
            </div>
        </div>
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
          <section className="py-2.5">
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

        {/* All Lessons */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="py-5"
        >
          {/* Header */}
          <div className="flex flex-row items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-[#2791E0] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
                <line x1="8" y1="9" x2="16" y2="9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="13" x2="16" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="17" x2="12" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[#393939]">Lessons</h2>
          </div>

          <div className="bg-white rounded-xl border border-[#F0F0F0] overflow-hidden">
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

          {program.lessons.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-[#999]">
                Lessons are being prepared. Check back soon!
              </p>
            </div>
          )}
        </motion.section>
      </motion.main>
    </div>
  );
}

function ProgramDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Skeleton className="h-64 w-full" />
      <div className="px-4 py-4 space-y-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="w-14 h-14 rounded-full flex-shrink-0" />
          ))}
        </div>
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
