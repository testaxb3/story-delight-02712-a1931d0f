import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, Play, Pause, Heart, CheckCircle2, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProgramDetail, useCompleteLesson } from '@/hooks/useProgramDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

// Mock lesson content for picky-eating program
const MOCK_LESSON_CONTENT = {
  title: 'Understanding Picky Eating',
  image_url: '/program-images/picky-eating/lesson-01-thumbnail.webp',
  audio_url: null,
  audio_duration: '04:21',
  summary: `Have you ever found yourself frustrated because your toddler refuses to eat anything but chicken nuggets or apple slices? If so, you're not alone. Picky eating is a common concern among parents, especially during the toddler years.`,
  sections: [
    {
      type: 'heading',
      content: 'What is Picky Eating?'
    },
    {
      type: 'paragraph',
      content: `Picky eating typically involves a reluctance to try new foods, a preference for a limited range of foods, and a tendency to refuse foods based on their texture, color, or appearance. This behavior is especially common in toddlers, often peaking between the ages of 2 and 5.`
    },
    {
      type: 'paragraph',
      content: `During this stage, children are learning to assert their independence and are developing their sense of self. One of the ways they do this is by making choices about what they eat – or more often, what they won't eat!`
    },
    {
      type: 'heading',
      content: 'Common Causes of Picky Eating'
    },
    {
      type: 'timeline',
      items: [
        {
          title: 'Developmental Changes:',
          content: `As toddlers grow, their taste buds and preferences are constantly changing. Foods they loved last week might suddenly become unacceptable this week. This is partly due to their developing senses and partly a way to exercise their newfound independence.`
        },
        {
          title: 'Neophobia:',
          content: `This is the fear of new things, which includes new foods. Neophobia is a survival instinct that protects children from eating potentially harmful substances. While this instinct is useful in the wild, it can make mealtime challenging at home.`
        },
        {
          title: 'Texture and Sensory Sensitivities:',
          content: `Some children are more sensitive to the texture, smell, or look of foods. A child might refuse food because it feels slimy, smells strong, or looks unfamiliar. Understanding these sensitivities can help parents introduce new foods more gently.`
        },
        {
          title: 'Parental Influence:',
          content: `Children are great observers and often mimic their parents' attitudes and behaviors towards food. If parents have picky eating habits, it's more likely their child will too. Conversely, parents who model healthy eating and show enthusiasm for a variety of foods can encourage their child to do the same.`
        },
        {
          title: 'Environmental Factors:',
          content: `Stressful or chaotic mealtimes can contribute to picky eating. If a child associates mealtime with tension or pressure, they might become more resistant to eating or trying new foods. A calm, positive mealtime environment can make a big difference.`
        }
      ]
    },
    {
      type: 'callout',
      label: 'Why it Helps:',
      content: `A food diary can help you see if there are specific foods your child tends to accept or reject, and if there are patterns related to time of day, mood, or environment. This information can be incredibly useful in identifying triggers for picky eating and planning strategies to address them.`
    },
    {
      type: 'paragraph',
      content: `To better understand why toddlers become picky eaters and how you can support them through this stage, take a few minutes to watch the insightful TEDx Talk by Katie Kimball. It's a great presentation that offers valuable tips and perspectives on navigating this phase with patience and understanding:`
    }
  ]
};

export default function ProgramLesson() {
  const { slug, number } = useParams<{ slug: string; number: string }>();
  const navigate = useNavigate();
  const lessonNumber = parseInt(number || '1');

  const { data: program } = useProgramDetail(slug || '');
  const completeLesson = useCompleteLesson();
  const [isCompleting, setIsCompleting] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Audio player state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // For mock data
  const isMock = slug === 'picky-eating';
  const mockLesson = isMock ? {
    ...MOCK_LESSON_CONTENT,
    day_number: lessonNumber,
  } : null;

  // Fetch full lesson content
  const { data: serverLesson, isLoading } = useQuery({
    queryKey: ['program-lesson', slug, lessonNumber],
    queryFn: async () => {
      if (!program || isMock) return null;

      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('program_id', program.id)
        .eq('day_number', lessonNumber)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!program && !isMock,
  });

  const lesson = isMock ? mockLesson : serverLesson;
  const isCompleted = program?.progress.lessons_completed.includes(lessonNumber) || false;
  const hasNextLesson = lessonNumber < (program?.total_lessons || 28);

  // Audio handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = parseFloat(e.target.value);
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleComplete = async () => {
    if (!program || isCompleted) return;

    setIsCompleting(true);
    try {
      await completeLesson.mutateAsync({
        programId: program.id,
        lessonNumber
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setShowComplete(true);
      toast.success('Lesson completed!');

      if (hasNextLesson) {
        setTimeout(() => {
          navigate(`/programs/${slug}/lesson/${lessonNumber + 1}`);
        }, 2000);
      }
    } catch (error) {
      toast.error('Failed to save progress');
    } finally {
      setIsCompleting(false);
    }
  };

  if ((isLoading && !isMock) || !program) {
    return <LessonSkeleton />;
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#FEFBF9] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-[#393939] mb-2">Lesson Not Found</h2>
          <p className="text-sm text-[#999] mb-4">This lesson doesn't exist yet.</p>
          <button
            onClick={() => navigate(`/programs/${slug}`)}
            className="text-[#FF6631] text-sm font-medium"
          >
            Back to Program
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFBF9] pb-32">
      {/* Header */}
      <header className="bg-[#FEFBF9] pt-10 pb-5 sticky top-0 z-10 border-b border-[#E8E8E6]">
        <div className="px-5">
          <div className="flex justify-between items-center">
            <div className="flex flex-row items-center gap-5">
              <button onClick={() => navigate(`/programs/${slug}`)} className="p-1">
                <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
                  <path d="M8 1L2 7.5L8 14" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <p className="text-xl text-[#303030] leading-6 font-semibold">
                Lesson {lessonNumber}
              </p>
            </div>
            <button className="p-2">
              <Menu className="w-6 h-6 text-[#303030]" />
            </button>
          </div>
        </div>
      </header>

      <main className="px-5">
        {/* Main Lesson Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 bg-white rounded-xl border border-[#F0F0F0] overflow-hidden"
        >
          {/* Title */}
          <div className="p-4 pb-0">
            <h1 className="text-xl font-bold text-[#393939] text-center">
              Lesson {lessonNumber}. {lesson.title}
            </h1>
          </div>

          {/* Image with Favorite */}
          <div className="p-4 relative">
            {lesson.image_url && (
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={lesson.image_url}
                  alt={lesson.title}
                  className="w-full h-auto object-cover"
                />
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"
                >
                  <Heart
                    className={`w-5 h-5 ${isFavorite ? 'fill-[#FF6631] text-[#FF6631]' : 'text-[#999]'}`}
                  />
                </button>
              </div>
            )}
          </div>

          {/* Audio Player */}
          {lesson.audio_url && (
            <div className="px-4 pb-4">
              <audio ref={audioRef} src={lesson.audio_url} preload="metadata" />
              <div className="flex items-center gap-3 bg-[#F9F9F9] rounded-xl p-3">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-[#FF6631] flex items-center justify-center flex-shrink-0"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#393939] mb-1">
                    Lesson {lessonNumber}: {lesson.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#999]">{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-1 h-1 bg-[#E0E0E0] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#FF6631] [&::-webkit-slider-thumb]:rounded-full"
                    />
                    <span className="text-xs text-[#999]">{lesson.audio_duration || formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary Text */}
          <div className="px-4 pb-4">
            <p className="text-[15px] text-[#393939] leading-relaxed">
              {lesson.summary}
            </p>
          </div>
        </motion.div>

        {/* Content Sections */}
        {isMock && MOCK_LESSON_CONTENT.sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="mt-5"
          >
            {section.type === 'heading' && (
              <h2 className="text-xl font-bold text-[#393939] mb-3">
                {section.content}
              </h2>
            )}

            {section.type === 'paragraph' && (
              <p className="text-[15px] text-[#393939] leading-relaxed mb-4">
                {section.content}
              </p>
            )}

            {section.type === 'timeline' && (
              <div className="space-y-0">
                {section.items?.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#FFA500] flex-shrink-0 mt-1.5" />
                      {i < (section.items?.length || 0) - 1 && (
                        <div className="w-0.5 flex-1 bg-[#FFA500] min-h-[80px]" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-4 flex-1">
                      <h3 className="font-semibold text-[#393939] mb-1">{item.title}</h3>
                      <p className="text-[14px] text-[#666] leading-relaxed">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'callout' && (
              <div className="bg-[#FFF8E7] rounded-xl p-4 border-l-4 border-[#FFA500]">
                <p className="text-[15px] text-[#393939] leading-relaxed">
                  <span className="font-bold">{section.label}</span> {section.content}
                </p>
              </div>
            )}
          </motion.div>
        ))}

        {/* Video Embed Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-5 bg-[#1a1a1a] rounded-xl aspect-video flex items-center justify-center"
        >
          <div className="text-center text-white/60">
            <div className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center mx-auto mb-2">
              <Play className="w-5 h-5 text-white/60" />
            </div>
            <p className="text-sm">Video content</p>
          </div>
        </motion.div>
      </main>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FEFBF9] border-t border-[#E8E8E6] px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
        <p className="text-sm text-[#666] text-center mb-3">
          After completing the lesson, click the button below and let us know you're ready to go to the next one.
        </p>

        <button
          onClick={handleComplete}
          disabled={isCompleting || isCompleted}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${
            isCompleted
              ? 'bg-green-500 text-white'
              : 'bg-[#FF6631] text-white hover:bg-[#e55a2a]'
          }`}
        >
          {isCompleting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </span>
          ) : isCompleted ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Completed
            </span>
          ) : (
            'Mark as Completed'
          )}
        </button>

        <button className="w-full py-3 mt-2 rounded-xl border border-[#393939] text-[#393939] font-medium">
          Add note to this lesson
        </button>
      </div>

      {/* Completion Celebration */}
      <AnimatePresence>
        {showComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#FEFBF9]/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-[#393939] mb-2">
                Lesson Complete!
              </h2>
              <p className="text-sm text-[#999] mb-6">
                {hasNextLesson
                  ? 'Moving to the next lesson...'
                  : 'You completed the program!'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LessonSkeleton() {
  return (
    <div className="min-h-screen bg-[#FEFBF9]">
      <div className="px-5 pt-16">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-64 w-full rounded-xl mb-4" />
        <Skeleton className="h-16 w-full rounded-xl mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-6" />
        <Skeleton className="h-6 w-48 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
