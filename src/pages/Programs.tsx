import { motion } from 'framer-motion';
import { CheckCircle2, Clock, CalendarDays, Zap, BookOpen } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { usePrograms } from '@/hooks/usePrograms';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { ProgramsStreakCard } from '@/components/Programs/ProgramsStreakCard';
import { CurrentProgramCard } from '@/components/Programs/CurrentProgramCard';
import { AvailableProgramCard } from '@/components/Programs/AvailableProgramCard';
import { ComingSoonProgramCard } from '@/components/Programs/ComingSoonProgramCard';
import { CompletedProgramItem } from '@/components/Programs/CompletedProgramItem';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Programs() {
  const { data, isLoading } = usePrograms();
  const navigate = useNavigate();
  
  const { data: stats } = useDashboardStats();

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#FEFBF9] pb-[60px]">
        {/* Safe area spacing */}
        <div className="h-[env(safe-area-inset-top)]" />

        {isLoading ? (
          <ProgramsSkeleton />
        ) : (
          <div className="container px-4 pt-4">
            <section className="pt-[20px] pb-[10px]">
              {/* Programs Completed Card */}
              <ProgramsStreakCard 
                programsCompletedCount={data?.completed?.length || 0}
              />
            </section>

            {/* Current Challenge Section */}
            {data?.current && data.current.length > 0 && (
              <section className="overflow-hidden py-[10px] flex flex-col gap-[16px]">
                <div className="flex flex-row items-center gap-[11px] mb-[16px]">
                  <Clock className="w-[22px] h-[22px] text-[#FFA300]" />
                  <h3 className="text-[20px] text-[#393939] font-[600]">
                    Current Program
                  </h3>
                </div>
                <div className="flex flex-col items-center gap-[20px]">
                  {data.current.map(program => (
                    <CurrentProgramCard key={program.id} program={program} nextLessonTitle="Understanding Picky Eating" />
                  ))}
                </div>
              </section>
            )}

            {/* Choose Your Next Program */}
            {data?.available && data.available.length > 0 && (
              <section className="flex flex-col gap-[16px] py-[15px]">
                <div className="flex flex-row items-center gap-[11px]">
                  <Zap className="w-[22px] h-[22px] text-[#2791E0]" />
                  <h3 className="text-[22px] text-[#393939] font-[600] leading-[1]">
                    Choose Your Next Program
                  </h3>
                </div>
                <div className="flex flex-col gap-[16px]">
                  {data.available.map((program, index) => (
                    <AvailableProgramCard key={program.id} program={program} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* Coming Soon */}
            {data?.comingSoon && data.comingSoon.length > 0 && (
              <section className="flex flex-col gap-[16px] py-[15px]">
                <div className="flex flex-row items-center gap-[11px]">
                  <CalendarDays className="w-[22px] h-[22px] text-[#2791E0]" />
                  <h3 className="text-[22px] text-[#393939] font-[600] leading-[1]">
                    Upcoming Programs
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-[16px]">
                  {data.comingSoon.map((program, index) => (
                    <ComingSoonProgramCard key={program.id} program={program} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* Completed Programs */}
            {data?.completed && data.completed.length > 0 && (
              <section className="py-[15px]">
                <div className="flex flex-col gap-[16px]">
                  <div className="flex flex-row items-center gap-[11px] pb-[16px] border-b border-b-[#DADADA]">
                    <CheckCircle2 className="w-[22px] h-[22px] text-[#11C222]" />
                    <span className="text-[22px] text-[#393939] font-semibold leading-[28px]">
                      Completed Programs
                    </span>
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    {data.completed.map((program, index) => (
                      <CompletedProgramItem key={program.id} program={program} index={index} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Empty State */}
            {!data?.current?.length && !data?.available?.length && !data?.comingSoon?.length && !data?.completed?.length && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#F9F5F2] mx-auto mb-4 flex items-center justify-center border border-[#F0E6DF]">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-semibold text-[#393939] mb-2">No Programs Yet</h3>
                <p className="text-sm text-[#8D8D8D]">
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
