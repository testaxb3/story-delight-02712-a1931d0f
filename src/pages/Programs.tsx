import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, CalendarDays, Zap, BookOpen, WifiOff, Sparkles, Star, Rocket, Trophy } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-b from-[#FEFBF9] to-[#FDF8F5] pb-[120px]">
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
              {/* Programs Streak Card */}
              <section className="pt-[16px] pb-[24px]">
                <ProgramsStreakCard
                  programsCompletedCount={data?.completed?.length || 0}
                />
              </section>

              {/* Current Challenge Section - HIGHEST PRIORITY */}
              {data?.current && data.current.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="py-[16px] flex flex-col gap-[16px]"
                >
                  {/* Section header with accent */}
                  <div className="flex flex-row items-center gap-[12px]">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="flex items-center justify-center w-[40px] h-[40px] rounded-[12px] bg-gradient-to-br from-[#FF6631] to-[#FFA300] shadow-lg shadow-[#FF6631]/30"
                    >
                      <Clock className="w-[20px] h-[20px] text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-[20px] text-[#393939] font-[700] leading-tight">
                        Current Program
                      </h3>
                      <p className="text-[13px] text-[#8D8D8D]">Continue where you left off</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-[20px]">
                    {data.current.map(program => (
                      <CurrentProgramCard key={program.id} program={program} />
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Choose Your Next Program - SECONDARY */}
              {data?.available && data.available.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col gap-[16px] py-[24px]"
                >
                  {/* Section header */}
                  <div className="flex flex-row items-center gap-[12px]">
                    <div className="flex items-center justify-center w-[40px] h-[40px] rounded-[12px] bg-gradient-to-br from-[#2791E0] to-[#76B9FF] shadow-lg shadow-[#2791E0]/20">
                      <Zap className="w-[20px] h-[20px] text-white" />
                    </div>
                    <div>
                      <h3 className="text-[20px] text-[#393939] font-[700] leading-tight">
                        Choose Your Next Program
                      </h3>
                      <p className="text-[13px] text-[#8D8D8D]">Explore new learning journeys</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[12px]">
                    {data.available.map((program, index) => (
                      <AvailableProgramCard key={program.id} program={program} index={index} />
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Section Divider */}
              {data?.comingSoon && data.comingSoon.length > 0 && (
                <div className="relative py-[8px]">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dashed border-[#E0DCD9]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-gradient-to-b from-[#FEFBF9] to-[#FDF8F5] text-[12px] text-[#ABABAB] font-medium flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      Coming Soon
                      <Sparkles className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              )}

              {/* Coming Soon */}
              {data?.comingSoon && data.comingSoon.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-[16px] py-[20px]"
                >
                  {/* Section header */}
                  <div className="flex flex-row items-center gap-[12px]">
                    <div className="flex items-center justify-center w-[40px] h-[40px] rounded-[12px] bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/20">
                      <Rocket className="w-[20px] h-[20px] text-white" />
                    </div>
                    <div>
                      <h3 className="text-[20px] text-[#393939] font-[700] leading-tight">
                        Upcoming Programs
                      </h3>
                      <p className="text-[13px] text-[#8D8D8D]">Vote for what you want next!</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-[14px]">
                    {data.comingSoon.map((program, index) => (
                      <ComingSoonProgramCard key={program.id} program={program} index={index} />
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Completed Programs */}
              {data?.completed && data.completed.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="py-[24px]"
                >
                  <div className="flex flex-col gap-[16px]">
                    {/* Section header with divider */}
                    <div className="flex flex-row items-center gap-[12px] pb-[16px] border-b border-[#E8E4E1]">
                      <div className="flex items-center justify-center w-[40px] h-[40px] rounded-[12px] bg-gradient-to-br from-[#11C222] to-[#22D933] shadow-lg shadow-[#11C222]/20">
                        <Trophy className="w-[20px] h-[20px] text-white" />
                      </div>
                      <div>
                        <h3 className="text-[20px] text-[#393939] font-[700] leading-tight">
                          Completed Programs
                        </h3>
                        <p className="text-[13px] text-[#8D8D8D]">Your achievements so far</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-[12px]">
                      {data.completed.map((program, index) => (
                        <CompletedProgramItem key={program.id} program={program} index={index} />
                      ))}
                    </div>
                  </div>
                </motion.section>
              )}

              {/* Empty State */}
              {!data?.current?.length && !data?.available?.length && !data?.comingSoon?.length && !data?.completed?.length && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="py-20 px-4 text-center"
                >
                  <div className="max-w-md mx-auto">
                    {/* Animated Icon Container */}
                    <motion.div
                      className="relative w-28 h-28 mx-auto mb-8"
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
                      {/* Outer glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full blur-2xl opacity-60" />

                      {/* Icon container */}
                      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#FF6631] to-[#FFA300] flex items-center justify-center shadow-xl shadow-[#FF6631]/30">
                        <BookOpen className="w-14 h-14 text-white" />
                      </div>

                      {/* Floating stars */}
                      <motion.div
                        animate={{ y: [-5, 5, -5], rotate: [0, 180, 360] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -top-2 -right-2"
                      >
                        <Star className="w-6 h-6 text-[#FFA300] fill-[#FFA300]" />
                      </motion.div>
                      <motion.div
                        animate={{ y: [5, -5, 5], rotate: [360, 180, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -bottom-1 -left-3"
                      >
                        <Sparkles className="w-5 h-5 text-[#FF6631]" />
                      </motion.div>
                    </motion.div>

                    {/* Text Content */}
                    <h3 className="text-2xl font-bold text-[#393939] mb-3">
                      <span className="bg-gradient-to-r from-[#FF6631] to-[#FFA300] bg-clip-text text-transparent">
                        No Programs Yet
                      </span>
                    </h3>
                    <p className="text-base text-[#8D8D8D] leading-relaxed mb-8">
                      Your parenting journey awaits! New programs will appear here soon to help you become the best parent you can be.
                    </p>

                    {/* Decorative animated dots */}
                    <div className="flex justify-center gap-3">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-3 h-3 rounded-full bg-gradient-to-r from-[#FF6631] to-[#FFA300]"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.4, 1, 0.4]
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
      <div className="relative h-28 w-full rounded-[16px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>

      {/* Current Challenge Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-[12px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
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
        <div className="bg-white rounded-[20px] p-5 border border-gray-100 space-y-4">
          <div className="relative h-5 w-3/4 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <div className="relative h-[180px] w-full rounded-[16px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
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
          <div className="relative h-14 w-full rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>
      </div>

      {/* Available Programs Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-[12px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <div className="space-y-2">
            <div className="relative h-5 w-48 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
            <div className="relative h-3 w-32 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="relative h-[120px] w-full rounded-[16px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-[12px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <div className="space-y-2">
            <div className="relative h-5 w-36 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
            <div className="relative h-3 w-28 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[14px]">
          {[1, 2].map((i) => (
            <div key={i} className="relative h-[260px] rounded-[16px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
