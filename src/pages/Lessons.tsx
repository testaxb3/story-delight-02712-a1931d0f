import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layout/MainLayout';
import { StickyHeader } from '@/components/Navigation/StickyHeader';
import { ProfileHeaderIcon } from '@/components/Navigation/ProfileHeaderIcon';
import { useLessons, LessonWithProgress } from '@/hooks/useLessons';
import { CurrentLessonCard } from '@/components/Lessons/CurrentLessonCard';
import { LessonCard } from '@/components/Lessons/LessonCard';
import { LessonStreakCard } from '@/components/Lessons/LessonStreakCard';
import { LessonDetailSheet } from '@/components/Lessons/LessonDetailSheet';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Lessons() {
  const navigate = useNavigate();
  const { 
    lessons, 
    isLoading, 
    completedCount, 
    totalCount, 
    currentLesson,
    streak,
    progressPercentage 
  } = useLessons();

  const [selectedLesson, setSelectedLesson] = useState<LessonWithProgress | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLessonClick = (lesson: LessonWithProgress) => {
    if (!lesson.isLocked) {
      setSelectedLesson(lesson);
      setSheetOpen(true);
    }
  };

  const upcomingLessons = lessons.filter(l => !l.progress?.completed && !l.isLocked);
  const completedLessons = lessons.filter(l => l.progress?.completed);
  const lockedLessons = lessons.filter(l => l.isLocked);

  return (
    <MainLayout>
      <div className="min-h-screen bg-background pb-32 relative">
        {/* Ambient Background */}
        <div className="fixed top-[-20%] left-[-20%] w-[80%] h-[80%] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none z-0" />
        <div className="fixed bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0" />

        {/* Sticky Header */}
        <StickyHeader>
          <div className="space-y-4">
            {/* Header Row */}
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Lessons</h1>
              <ProfileHeaderIcon size="md" />
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Your Progress</span>
                <span className="font-medium text-foreground">{completedCount} of {totalCount}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </StickyHeader>

        {/* Content */}
        <div className="px-5 pt-4 space-y-6 relative z-10">
          {/* Streak Card */}
          {streak > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <LessonStreakCard streak={streak} />
            </motion.div>
          )}

          {/* Current Lesson (Hero) */}
          {currentLesson && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CurrentLessonCard 
                lesson={currentLesson} 
                onClick={() => handleLessonClick(currentLesson)}
              />
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-secondary/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && lessons.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Lessons Coming Soon</h3>
              <p className="text-muted-foreground text-sm max-w-xs mt-2">
                We're preparing valuable content for you. Check back soon!
              </p>
            </div>
          )}

          {/* Upcoming Lessons */}
          {upcomingLessons.length > 1 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground px-1">Up Next</h2>
              <div className="space-y-3">
                {upcomingLessons.slice(1).map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <LessonCard 
                      lesson={lesson} 
                      onClick={() => handleLessonClick(lesson)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Lessons */}
          {lockedLessons.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-muted-foreground px-1">Locked</h2>
              <div className="space-y-3">
                {lockedLessons.slice(0, 3).map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <LessonCard 
                      lesson={lesson} 
                      onClick={() => handleLessonClick(lesson)}
                    />
                  </motion.div>
                ))}
                {lockedLessons.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    +{lockedLessons.length - 3} more lessons to unlock
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Completed Lessons */}
          {completedLessons.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-semibold text-foreground">Completed</h2>
                <span className="text-sm text-muted-foreground">({completedLessons.length})</span>
              </div>
              <div className="space-y-3">
                {completedLessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.03 }}
                  >
                    <LessonCard 
                      lesson={lesson} 
                      onClick={() => handleLessonClick(lesson)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lesson Detail Sheet */}
        <LessonDetailSheet
          lesson={selectedLesson}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
        />
      </div>
    </MainLayout>
  );
}
