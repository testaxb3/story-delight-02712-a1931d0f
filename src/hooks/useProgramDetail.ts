import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ProgramLesson {
  id: string;
  day_number: number;
  title: string;
  summary: string | null;
  estimated_minutes: number | null;
  image_url: string | null;
  audio_url: string | null;
}

export interface ProgramBadge {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  requirement_type: string;
  requirement_value: number;
  earned: boolean;
  earned_at?: string;
}

export interface ProgramDetail {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  age_range: string | null;
  total_lessons: number;
  status: string;
  lessons: ProgramLesson[];
  badges: ProgramBadge[];
  progress: {
    lessons_completed: number[];
    started_at: string | null;
    completed_at: string | null;
    percentage: number;
  };
}

export function useProgramDetail(slug: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['program-detail', slug, user?.id],
    queryFn: async (): Promise<ProgramDetail> => {
      // Fetch program
      const { data: program, error: programError } = await supabase
        .from('programs')
        .select('*')
        .eq('slug', slug)
        .single();

      if (programError) throw programError;

      // Fetch lessons for this program
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('id, day_number, title, summary, estimated_minutes, image_url, audio_url')
        .eq('program_id', program.id)
        .order('day_number', { ascending: true });

      if (lessonsError) throw lessonsError;

      // Fetch program badges
      const { data: badges, error: badgesError } = await supabase
        .from('program_badges')
        .select('*')
        .eq('program_id', program.id)
        .order('display_order', { ascending: true });

      if (badgesError) throw badgesError;

      // Fetch user progress
      let progress = {
        lessons_completed: [] as number[],
        started_at: null as string | null,
        completed_at: null as string | null,
        percentage: 0
      };

      // Fetch user earned badges
      let earnedBadges: Record<string, string> = {};

      if (user?.id) {
        const { data: userProgress } = await supabase
          .from('user_program_progress')
          .select('lessons_completed, started_at, completed_at')
          .eq('user_id', user.id)
          .eq('program_id', program.id)
          .single();

        if (userProgress) {
          progress = {
            lessons_completed: userProgress.lessons_completed || [],
            started_at: userProgress.started_at,
            completed_at: userProgress.completed_at,
            percentage: Math.round(((userProgress.lessons_completed?.length || 0) / program.total_lessons) * 100)
          };
        }

        // Fetch earned badges
        const { data: userBadges } = await supabase
          .from('user_program_badges')
          .select('program_badge_id, earned_at')
          .eq('user_id', user.id);

        userBadges?.forEach(b => {
          earnedBadges[b.program_badge_id] = b.earned_at;
        });
      }

      // Map badges with earned status
      const badgesWithStatus: ProgramBadge[] = (badges || []).map(b => ({
        id: b.id,
        name: b.name,
        description: b.description,
        icon: b.icon,
        requirement_type: b.requirement_type || 'lessons_completed',
        requirement_value: b.requirement_value || 1,
        earned: !!earnedBadges[b.id],
        earned_at: earnedBadges[b.id]
      }));

      return {
        id: program.id,
        slug: program.slug,
        title: program.title,
        description: program.description,
        cover_image_url: program.cover_image_url,
        age_range: program.age_range,
        total_lessons: program.total_lessons,
        status: program.status,
        lessons: lessons || [],
        badges: badgesWithStatus,
        progress
      };
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCompleteLesson() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ programId, lessonNumber }: { programId: string; lessonNumber: number }) => {
      if (!user?.id) throw new Error('Must be logged in');

      // Get current progress
      const { data: existing } = await supabase
        .from('user_program_progress')
        .select('lessons_completed')
        .eq('user_id', user.id)
        .eq('program_id', programId)
        .single();

      const currentLessons = existing?.lessons_completed || [];
      
      if (currentLessons.includes(lessonNumber)) {
        return { alreadyCompleted: true };
      }

      const newLessons = [...currentLessons, lessonNumber].sort((a, b) => a - b);

      // Get total lessons to check if program is complete
      const { data: program } = await supabase
        .from('programs')
        .select('total_lessons')
        .eq('id', programId)
        .single();

      const isComplete = newLessons.length >= (program?.total_lessons || 30);

      // Upsert progress
      const { error } = await supabase
        .from('user_program_progress')
        .upsert({
          user_id: user.id,
          program_id: programId,
          lessons_completed: newLessons,
          started_at: existing ? undefined : new Date().toISOString(),
          completed_at: isComplete ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,program_id'
        });

      if (error) throw error;

      // Check and award badges
      const { data: badges } = await supabase
        .from('program_badges')
        .select('*')
        .eq('program_id', programId);

      for (const badge of badges || []) {
        const { data: alreadyEarned } = await supabase
          .from('user_program_badges')
          .select('id')
          .eq('user_id', user.id)
          .eq('program_badge_id', badge.id)
          .single();

        if (alreadyEarned) continue;

        let shouldAward = false;
        if (badge.requirement_type === 'lessons_completed' && newLessons.length >= badge.requirement_value) {
          shouldAward = true;
        } else if (badge.requirement_type === 'all_complete' && isComplete) {
          shouldAward = true;
        }

        if (shouldAward) {
          await supabase
            .from('user_program_badges')
            .insert({
              user_id: user.id,
              program_badge_id: badge.id
            });
        }
      }

      return { completed: true, isComplete };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['program-detail'] });
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    }
  });
}
