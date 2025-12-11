import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useProgramDetail } from '@/hooks/useProgramDetail';
import { ProgramHero } from '@/components/Programs/ProgramHero';
import { ProgramProgressBar } from '@/components/Programs/ProgramProgressBar';
import { ProgramBadgesSection } from '@/components/Programs/ProgramBadgesSection';
import { NextLessonCard } from '@/components/Programs/NextLessonCard';
import { LessonListItem } from '@/components/Programs/LessonListItem';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

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
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <ProgramHero
        title={program.title}
        description={program.description}
        ageRange={program.age_range}
        totalLessons={program.total_lessons}
        coverImageUrl={program.cover_image_url}
      />

      {/* Progress Bar */}
      <ProgramProgressBar
        completed={completedLessons.length}
        total={program.total_lessons}
        percentage={program.progress.percentage}
      />

      {/* Badges */}
      <ProgramBadgesSection badges={program.badges} />

      <Separator className="mx-4" />

      {/* Next Lesson Card */}
      {nextLesson && (
        <div className="py-4">
          <NextLessonCard
            lesson={nextLesson}
            programSlug={program.slug}
            isFirstLesson={isFirstLesson}
          />
        </div>
      )}

      <Separator className="mx-4" />

      {/* All Lessons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-4 py-4"
      >
        <h2 className="text-sm font-semibold text-foreground mb-3">
          All Lessons ({program.lessons.length})
        </h2>
        
        <div className="space-y-1">
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
            <p className="text-sm text-muted-foreground">
              Lessons are being prepared. Check back soon!
            </p>
          </div>
        )}
      </motion.div>
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
