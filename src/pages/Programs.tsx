import { motion } from 'framer-motion';
import { CheckCircle2, Clock, CalendarDays, Zap } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { usePrograms, ProgramWithProgress } from '@/hooks/usePrograms';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { ProgramsStreakCard } from '@/components/Programs/ProgramsStreakCard';
import { CurrentProgramCard } from '@/components/Programs/CurrentProgramCard';
import { AvailableProgramCard } from '@/components/Programs/AvailableProgramCard';
import { ComingSoonProgramCard } from '@/components/Programs/ComingSoonProgramCard';
import { CompletedProgramItem } from '@/components/Programs/CompletedProgramItem';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for visualization
const MOCK_DATA = {
  current: [
    {
      id: '1',
      title: 'Picky Eating Challenge',
      slug: 'picky-eating',
      description: 'Transform mealtime battles into peaceful family dinners. Learn how to expand your child\'s palate without pressure.',
      cover_image_url: null,
      total_lessons: 28,
      lessons_completed: [1, 2, 3, 4, 5],
      age_range: '2-6 years',
      status: 'active',
      display_order: 1,
      created_at: new Date().toISOString(),
      votes_count: 120,
      user_voted: false,
      started_at: new Date().toISOString(),
      completed_at: null,
      progress_percentage: 18
    }
  ] as ProgramWithProgress[],
  available: [
    {
      id: '2',
      title: 'Potty Training Success',
      slug: 'potty-training',
      description: 'A step-by-step guide to ditching diapers with confidence. Say goodbye to accidents and hello to independence.',
      cover_image_url: null,
      total_lessons: 7,
      lessons_completed: [],
      age_range: '18m-4 years',
      status: 'active',
      display_order: 2,
      created_at: new Date().toISOString(),
      votes_count: 85,
      user_voted: false,
      started_at: null,
      completed_at: null,
      progress_percentage: 0
    },
    {
      id: '3',
      title: 'Tame the Tantrums',
      slug: 'tantrum-taming',
      description: 'Learn the root causes of tantrums and effective strategies to calm the storm and connect with your child.',
      cover_image_url: null,
      total_lessons: 14,
      lessons_completed: [],
      age_range: '1-5 years',
      status: 'active',
      display_order: 3,
      created_at: new Date().toISOString(),
      votes_count: 200,
      user_voted: false,
      started_at: null,
      completed_at: null,
      progress_percentage: 0
    }
  ] as ProgramWithProgress[],
  comingSoon: [
    {
      id: '4',
      title: 'Teens Unlocked: Parenting Strategies',
      slug: 'teens-unlocked',
      description: 'Navigate the turbulent teen years with grace. Build trust and open communication channels.',
      cover_image_url: null,
      total_lessons: 21,
      lessons_completed: [],
      age_range: '13-18 years',
      status: 'coming_soon',
      display_order: 4,
      created_at: new Date().toISOString(),
      votes_count: 342,
      user_voted: true,
      started_at: null,
      completed_at: null,
      progress_percentage: 0
    },
    {
      id: '5',
      title: 'Sibling Harmony',
      slug: 'sibling-harmony',
      description: 'Turn rivalry into lifelong friendship. Tools to manage conflict and foster love between siblings.',
      cover_image_url: null,
      total_lessons: 10,
      lessons_completed: [],
      age_range: 'All ages',
      status: 'coming_soon',
      display_order: 5,
      created_at: new Date().toISOString(),
      votes_count: 156,
      user_voted: false,
      started_at: null,
      completed_at: null,
      progress_percentage: 0
    }
  ] as ProgramWithProgress[],
  completed: [
    {
      id: '6',
      title: 'Newborn Essentials',
      slug: 'newborn-essentials',
      description: 'Everything you need to know for the first 3 months. Sleep, feeding, and soothing techniques.',
      cover_image_url: null,
      total_lessons: 12,
      lessons_completed: Array(12).fill(1),
      age_range: '0-3 months',
      status: 'completed',
      display_order: 6,
      created_at: new Date().toISOString(),
      votes_count: 90,
      user_voted: false,
      started_at: new Date(Date.now() - 100000000).toISOString(),
      completed_at: new Date().toISOString(),
      progress_percentage: 100
    }
  ] as ProgramWithProgress[],
  all: [] as ProgramWithProgress[]
};

// Populate 'all'
MOCK_DATA.all = [
  ...MOCK_DATA.current,
  ...MOCK_DATA.available,
  ...MOCK_DATA.comingSoon,
  ...MOCK_DATA.completed
];

export default function Programs() {
  // Use mock data instead of real hook for visualization
  // const { data, isLoading } = usePrograms();
  const data = MOCK_DATA;
  const isLoading = false;
  
  const { data: stats } = useDashboardStats();

  // Calculate total lessons completed across all programs
  const totalLessonsCompleted = data?.all?.reduce(
    (acc, p) => acc + (p.lessons_completed?.length || 0), 
    0
  ) || 0;

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
              {/* Streak Card */}
              <ProgramsStreakCard 
                lessonsCompletedCount={12} 
                weekProgress={[true, true, true, false, false, false, false]}
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
