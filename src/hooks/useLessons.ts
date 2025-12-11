import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Lesson {
  id: string;
  day_number: number;
  title: string;
  content: string;
  summary: string | null;
  image_url: string | null;
  audio_url: string | null;
  estimated_minutes: number | null;
  created_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  progress_percentage: number;
}

export interface LessonWithProgress extends Lesson {
  progress?: LessonProgress;
  isLocked: boolean;
}

export function useLessons() {
  const { user } = useAuth();

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('day_number', { ascending: true });
      
      if (error) throw error;
      return data as Lesson[];
    },
    enabled: !!user,
  });

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['lesson-progress', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user!.id);
      
      if (error) throw error;
      return data as LessonProgress[];
    },
    enabled: !!user,
  });

  // Combine lessons with progress and determine lock status
  const lessonsWithProgress: LessonWithProgress[] = (lessons || []).map((lesson, index) => {
    const lessonProgress = progress?.find(p => p.lesson_id === lesson.id);
    
    // First lesson is always unlocked
    // Subsequent lessons unlock when previous is completed
    let isLocked = false;
    if (index > 0) {
      const previousLesson = lessons?.[index - 1];
      const previousProgress = progress?.find(p => p.lesson_id === previousLesson?.id);
      isLocked = !previousProgress?.completed;
    }

    return {
      ...lesson,
      progress: lessonProgress,
      isLocked,
    };
  });

  // Calculate stats
  const completedCount = progress?.filter(p => p.completed).length || 0;
  const totalCount = lessons?.length || 0;
  const currentLesson = lessonsWithProgress.find(l => !l.progress?.completed && !l.isLocked);
  const nextLesson = lessonsWithProgress.find(l => l.isLocked && 
    lessonsWithProgress.findIndex(x => x.id === l.id) === completedCount + 1
  );

  // Calculate streak (consecutive days with completed lessons)
  const calculateStreak = (): number => {
    if (!progress || progress.length === 0) return 0;
    
    const completedDates = progress
      .filter(p => p.completed && p.completed_at)
      .map(p => new Date(p.completed_at!).toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    if (completedDates.length === 0) return 0;
    
    let streak = 1;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    // Check if most recent completion is today or yesterday
    if (completedDates[0] !== today && completedDates[0] !== yesterday) {
      return 0;
    }
    
    for (let i = 0; i < completedDates.length - 1; i++) {
      const current = new Date(completedDates[i]);
      const next = new Date(completedDates[i + 1]);
      const diff = (current.getTime() - next.getTime()) / 86400000;
      
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return {
    lessons: lessonsWithProgress,
    isLoading: lessonsLoading || progressLoading,
    completedCount,
    totalCount,
    currentLesson,
    nextLesson,
    streak: calculateStreak(),
    progressPercentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
  };
}

export function useMarkLessonComplete() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
          progress_percentage: 100,
        }, {
          onConflict: 'user_id,lesson_id',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-progress'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}
