import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, CalendarDays, Zap, BookOpen, WifiOff } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { usePrograms } from '@/hooks/usePrograms';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
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
  const isOnline = useOnlineStatus();

  const { data: stats } = useDashboardStats();

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#FEFBF9] pb-[120px]">
        {/* Safe area spacing */}
        <div className="h-[env(safe-area-inset-top)]" />

        {/* Offline Indicator */}
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="sticky top-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 shadow-lg"
            >
              <div className="flex items-center justify-center gap-2">
                <WifiOff className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-medium">
                  You're offline. Showing cached content.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ProgramsSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="container px-4 pt-4"
            >
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
                    <CurrentProgramCard key={program.id} program={program} />
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="py-16 px-4 text-center"
              >
                <div className="max-w-md mx-auto">
                  {/* Animated Icon */}
                  <motion.div
                    className="relative w-24 h-24 mx-auto mb-6"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full opacity-50 blur-xl" />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center border-2 border-orange-200 shadow-lg">
                      <BookOpen className="w-12 h-12 text-[#FF6631]" />
                    </div>
                  </motion.div>

                  {/* Text Content */}
                  <h3 className="text-2xl font-bold text-[#393939] mb-3 bg-gradient-to-r from-[#FF6631] to-[#FFA300] bg-clip-text text-transparent">
                    No Programs Yet
                  </h3>
                  <p className="text-base text-[#8D8D8D] leading-relaxed mb-6">
                    Your parenting journey awaits! New programs will appear here soon to help you become the best parent you can be.
                  </p>

                  {/* Decorative Elements */}
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6631] to-[#FFA300]"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}

function ProgramsSkeleton() {
  return (
    <div className="px-4 pt-4 space-y-6">
      {/* Streak Card Skeleton */}
      <div className="relative h-24 w-full rounded-2xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>

      {/* Current Challenge Skeleton */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative h-5 w-5 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <div className="relative h-5 w-32 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
          <div className="relative h-4 w-3/4 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <div className="relative h-40 w-full rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <div className="space-y-2">
            <div className="relative h-4 w-full rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
            <div className="relative h-4 w-2/3 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          </div>
          <div className="relative h-12 w-full rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>
      </div>

      {/* Available Programs Skeleton */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative h-5 w-5 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <div className="relative h-5 w-48 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="relative h-24 w-full rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Skeleton */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative h-5 w-5 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <div className="relative h-5 w-32 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="relative h-48 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
