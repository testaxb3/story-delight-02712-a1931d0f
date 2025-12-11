import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { usePrograms } from '@/hooks/usePrograms';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { ProgramsStreakCard } from '@/components/Programs/ProgramsStreakCard';
import { CurrentProgramCard } from '@/components/Programs/CurrentProgramCard';
import { AvailableProgramCard } from '@/components/Programs/AvailableProgramCard';
import { ComingSoonProgramCard } from '@/components/Programs/ComingSoonProgramCard';
import { CompletedProgramItem } from '@/components/Programs/CompletedProgramItem';
import { Skeleton } from '@/components/ui/skeleton';

export default function Programs() {
  const { data, isLoading } = usePrograms();
  const { data: stats } = useDashboardStats();

  // Calculate total lessons completed across all programs
  const totalLessonsCompleted = data?.all?.reduce(
    (acc, p) => acc + (p.lessons_completed?.length || 0), 
    0
  ) || 0;

  return (
    <MainLayout>
      <div className="min-h-screen bg-background pb-24">
        {/* Safe area spacing */}
        <div className="h-[env(safe-area-inset-top)]" />

        {isLoading ? (
          <ProgramsSkeleton />
        ) : (
          <div className="px-4 pt-4 space-y-6">
            {/* Streak Card */}
            <ProgramsStreakCard 
              lessonsCompletedCount={totalLessonsCompleted}
            />

            {/* Current Challenge Section */}
            {data?.current && data.current.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-foreground mb-3">
                  Current Challenge
                </h2>
                <div className="space-y-4">
                  {data.current.map(program => (
                    <CurrentProgramCard key={program.id} program={program} />
                  ))}
                </div>
              </section>
            )}

            {/* Choose Your Next Program - Vertical List */}
            {data?.available && data.available.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-foreground mb-3">
                  Choose Your Next Program
                </h2>
                <div className="space-y-3">
                  {data.available.map((program, index) => (
                    <AvailableProgramCard key={program.id} program={program} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* Coming Soon - 2 Column Grid */}
            {data?.comingSoon && data.comingSoon.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-foreground mb-3">
                  Coming Soon
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {data.comingSoon.map((program, index) => (
                    <ComingSoonProgramCard key={program.id} program={program} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* Completed Programs */}
            {data?.completed && data.completed.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Completed Programs
                </h2>
                <div className="space-y-3">
                  {data.completed.map((program, index) => (
                    <CompletedProgramItem key={program.id} program={program} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {!data?.current?.length && !data?.available?.length && !data?.comingSoon?.length && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Programs Yet</h3>
                <p className="text-sm text-muted-foreground">
                  New programs will appear here soon!
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function ProgramsSkeleton() {
  return (
    <div className="px-4 pt-4 space-y-6">
      {/* Streak Card Skeleton */}
      <Skeleton className="h-24 w-full rounded-2xl" />
      
      {/* Current Challenge Skeleton */}
      <div>
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
      
      {/* Available Programs Skeleton */}
      <div>
        <Skeleton className="h-4 w-48 mb-3" />
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
      
      {/* Coming Soon Skeleton */}
      <div>
        <Skeleton className="h-4 w-32 mb-3" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
