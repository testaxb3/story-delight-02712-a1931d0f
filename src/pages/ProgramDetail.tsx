import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useProgramDetail, ProgramDetail as ProgramDetailType } from '@/hooks/useProgramDetail';
import { CurrentChallengeProgressCard } from '@/components/Programs/CurrentChallengeProgressCard';
import { ProgramBadgesSection } from '@/components/Programs/ProgramBadgesSection';
import { NextLessonCard } from '@/components/Programs/NextLessonCard';
import { LessonListItem } from '@/components/Programs/LessonListItem';
import { FavoritesSection } from '@/components/Programs/FavoritesSection';
import { Skeleton } from '@/components/ui/skeleton';

const MOCK_PROGRAM_DETAIL: ProgramDetailType = {
  id: '1',
  slug: 'picky-eating',
  title: 'Picky Eating Challenge',
  description: 'Transform mealtime battles into peaceful family dinners. Learn how to expand your child\'s palate without pressure.',
  cover_image_url: null,
  age_range: '2-8 years',
  total_lessons: 28,
  status: 'active',
  lessons: [
    {
      id: 'lesson-1',
      day_number: 1,
      title: 'Understanding Picky Eating',
      summary: 'Have you ever found yourself frustrated because your toddler refuses to eat anything but chicken nuggets or apple slices? If so, you\'re not alone. Picky eating is a common concern among parents, especially during the toddler years.',
      estimated_minutes: 5,
      image_url: '/program-images/picky-eating/lesson-01-thumbnail.webp',
      audio_url: null
    },
    {
      id: 'lesson-2',
      day_number: 2,
      title: 'Creating a Positive Mealtime Environment',
      summary: 'Learn how to set the stage for success before the food even hits the table.',
      estimated_minutes: 6,
      image_url: null,
      audio_url: null
    },
    {
      id: 'lesson-3',
      day_number: 3,
      title: 'Introducing New Foods',
      summary: 'Strategies for introducing new foods without the power struggles.',
      estimated_minutes: 5,
      image_url: null,
      audio_url: null
    },
    {
      id: 'lesson-4',
      day_number: 4,
      title: 'Kids and Meal Prep',
      summary: 'Getting your kids involved in the kitchen to increase their interest in food.',
      estimated_minutes: 7,
      image_url: null,
      audio_url: null
    },
    {
      id: 'lesson-5',
      day_number: 5,
      title: 'Role Modeling Healthy Eating',
      summary: 'How your own eating habits influence your child\'s relationship with food.',
      estimated_minutes: 5,
      image_url: null,
      audio_url: null
    },
    {
      id: 'lesson-6',
      day_number: 6,
      title: 'Managing Power Struggles',
      summary: 'De-escalating tension and avoiding battles over bites.',
      estimated_minutes: 8,
      image_url: null,
      audio_url: null
    },
    {
      id: 'lesson-7',
      day_number: 7,
      title: 'Making Mealtime Fun',
      summary: 'Creative ways to make eating an enjoyable experience.',
      estimated_minutes: 6,
      image_url: null,
      audio_url: null
    },
    {
      id: 'lesson-8',
      day_number: 8,
      title: 'Exploring Food Textures',
      summary: 'Helping your child become comfortable with different textures.',
      estimated_minutes: 5,
      image_url: null,
      audio_url: null
    },
    {
      id: 'lesson-9',
      day_number: 9,
      title: 'Overcoming Food Neophobia',
      summary: 'Strategies for dealing with fear of new foods.',
      estimated_minutes: 7,
      image_url: null,
      audio_url: null
    },
    {
      id: 'lesson-10',
      day_number: 10,
      title: 'Encouraging Independence at Mealtime',
      summary: 'Fostering self-feeding and food choice autonomy.',
      estimated_minutes: 6,
      image_url: null,
      audio_url: null
    },
    {
      id: 'lesson-11',
      day_number: 11,
      title: 'Understanding Food Preferences',
      summary: 'Why kids prefer certain foods and how to work with it.',
      estimated_minutes: 5,
      image_url: null,
      audio_url: null
    },
    {
      id: 'lesson-12',
      day_number: 12,
      title: 'Dealing with Food Jags',
      summary: 'When your child only wants one food repeatedly.',
      estimated_minutes: 6,
      image_url: null,
      audio_url: null
    },
    {
      id: 'lesson-13',
      day_number: 13,
      title: 'Exploring Cultural Foods',
      summary: 'Introducing diverse cuisines to expand palates.',
      estimated_minutes: 5,
      image_url: null,
      audio_url: null
    },
    {
      id: 'lesson-14',
      day_number: 14,
      title: 'Managing Sensory Sensitivities',
      summary: 'Supporting children with sensory food challenges.',
      estimated_minutes: 8,
      image_url: null,
      audio_url: null
    },
    ...Array.from({ length: 14 }, (_, i) => ({
      id: `lesson-${i + 15}`,
      day_number: i + 15,
      title: `Advanced Strategy ${i + 15}`,
      summary: 'Continuing the journey to healthy eating habits.',
      estimated_minutes: 5 + (i % 5),
      image_url: null,
      audio_url: null
    }))
  ],
  badges: [
    {
      id: 'badge-1',
      name: 'Food Detective',
      description: 'For successfully identifying patterns and triggers of picky eating.',
      icon: 'search', // You might need to update icon mapping or use image_url if supported
      image_url: '/program-images/picky-eating/achievement-food-detective.png',
      requirement_type: 'lessons_completed',
      requirement_value: 5,
      earned: false
    },
    {
      id: 'badge-2',
      name: 'New Food Explorer',
      description: 'For effectively introducing new foods without pressure.',
      icon: 'compass',
      image_url: '/program-images/picky-eating/achievement-new-food-explorer.png',
      requirement_type: 'lessons_completed',
      requirement_value: 10,
      earned: false
    },
    {
      id: 'badge-3',
      name: 'Fun Mealtime Maestro',
      description: 'For making mealtimes engaging and enjoyable for your child.',
      icon: 'smile',
      image_url: '/program-images/picky-eating/achievement-fun-mealtime-maestro.png',
      requirement_type: 'lessons_completed',
      requirement_value: 15,
      earned: false
    },
    {
      id: 'badge-4',
      name: 'Taste Adventurer',
      description: 'For accommodating your child’s food preferences while maintaining a balanced diet.',
      icon: 'utensils',
      image_url: '/program-images/picky-eating/achievement-taste-adventurer.png',
      requirement_type: 'lessons_completed',
      requirement_value: 20,
      earned: false
    },
    {
      id: 'badge-5',
      name: 'Healthy Eating Champion',
      description: 'For completing the 28-Day Picky Eaters Course and setting the foundation for lifelong healthy eating habits.',
      icon: 'trophy',
      image_url: '/program-images/picky-eating/achievement-healthy-eating-champion.png',
      requirement_type: 'all_complete',
      requirement_value: 28,
      earned: false
    }
  ],
  progress: {
    lessons_completed: [], // Reset to 0 completed as per HTML "0/28"
    started_at: new Date().toISOString(),
    completed_at: null,
    percentage: 0
  }
};

export default function ProgramDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: serverProgram, isLoading: serverLoading, error } = useProgramDetail(slug || '');

  // Use mock data for specific slug or fallback
  const isMock = slug === 'picky-eating';
  const program = isMock ? MOCK_PROGRAM_DETAIL : serverProgram;
  const isLoading = isMock ? false : serverLoading;

  if (isLoading) {
    return <ProgramDetailSkeleton />;
  }

  if ((!isMock && error) || !program) {
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
      {/* Header */}
      <header className="bg-[#FEFBF9] pt-10 pb-5 sticky top-0 z-10 border-b border-[#E8E8E6]">
        <div className="px-4">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/programs')} className="p-1">
                <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
                  <path d="M8 1L2 7.5L8 14" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <p className="text-xl text-[#303030] leading-6 font-semibold">
                Current Program
              </p>
            </div>
        </div>
      </header>

      <main className="px-4">
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
              isFirstLesson={isFirstLesson}
              totalLessons={program.total_lessons}
            />
          </section>
        )}

        {/* Favorites Section */}
        <FavoritesSection />

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
      </main>
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
