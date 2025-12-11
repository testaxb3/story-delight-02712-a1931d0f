import { motion } from 'framer-motion';
import { GraduationCap, Sparkles } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { usePrograms } from '@/hooks/usePrograms';
import { CurrentProgramCard } from '@/components/Programs/CurrentProgramCard';
import { AvailableProgramCard } from '@/components/Programs/AvailableProgramCard';
import { ComingSoonProgramCard } from '@/components/Programs/ComingSoonProgramCard';
import { CompletedProgramItem } from '@/components/Programs/CompletedProgramItem';
import { Skeleton } from '@/components/ui/skeleton';

export default function Programs() {
  const { data, isLoading } = usePrograms();

  return (
    <MainLayout>
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="px-4 pt-[calc(env(safe-area-inset-top)+16px)] pb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Programs</h1>
              <p className="text-sm text-muted-foreground">30-day parenting challenges</p>
            </div>
          </motion.div>
        </div>

        {isLoading ? (
          <ProgramsSkeleton />
        ) : (
          <>
            {/* Current Challenge Section */}
            {data?.current && data.current.length > 0 && (
              <section className="px-4 mb-6">
                <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Current Challenge
                </h2>
                <div className="space-y-3">
                  {data.current.map(program => (
                    <CurrentProgramCard key={program.id} program={program} />
                  ))}
                </div>
              </section>
            )}

            {/* Choose Your Next Program */}
            {data?.available && data.available.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-semibold text-foreground mb-3 px-4">
                  Choose Your Next Program
                </h2>
                <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
                  {data.available.map((program, index) => (
                    <AvailableProgramCard key={program.id} program={program} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* Coming Soon */}
            {data?.comingSoon && data.comingSoon.length > 0 && (
              <section className="px-4 mb-6">
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
              <section className="px-4">
                <h2 className="text-sm font-semibold text-foreground mb-3">
                  Completed Programs
                </h2>
                <div className="space-y-2">
                  {data.completed.map((program, index) => (
                    <CompletedProgramItem key={program.id} program={program} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {!data?.current?.length && !data?.available?.length && !data?.comingSoon?.length && (
              <div className="px-4 py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Programs Yet</h3>
                <p className="text-sm text-muted-foreground">
                  New programs will appear here soon!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}

function ProgramsSkeleton() {
  return (
    <div className="px-4 space-y-6">
      <div>
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
      <div>
        <Skeleton className="h-4 w-48 mb-3" />
        <div className="flex gap-3">
          <Skeleton className="h-48 w-[280px] rounded-2xl flex-shrink-0" />
          <Skeleton className="h-48 w-[280px] rounded-2xl flex-shrink-0" />
        </div>
      </div>
      <div>
        <Skeleton className="h-4 w-32 mb-3" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
