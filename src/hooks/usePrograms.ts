import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Program {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  age_range: string | null;
  total_lessons: number;
  status: 'active' | 'coming_soon' | 'completed';
  display_order: number;
  created_at: string;
  votes_count?: number;
  user_voted?: boolean;
}

export interface ProgramWithProgress extends Program {
  lessons_completed: number[];
  started_at: string | null;
  completed_at: string | null;
  progress_percentage: number;
}

export function usePrograms() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['programs', user?.id],
    queryFn: async () => {
      // Fetch all programs
      const { data: programs, error: programsError } = await supabase
        .from('programs')
        .select('*')
        .order('display_order', { ascending: true });

      if (programsError) throw programsError;

      // Fetch votes count for each program
      const { data: votesData } = await supabase
        .from('program_votes')
        .select('program_id');

      // Count votes per program
      const votesCount: Record<string, number> = {};
      votesData?.forEach(vote => {
        votesCount[vote.program_id] = (votesCount[vote.program_id] || 0) + 1;
      });

      // Check if user voted
      let userVotes: string[] = [];
      if (user?.id) {
        const { data: userVotesData } = await supabase
          .from('program_votes')
          .select('program_id')
          .eq('user_id', user.id);
        userVotes = userVotesData?.map(v => v.program_id) || [];
      }

      // Fetch user progress
      let userProgress: Record<string, { lessons_completed: number[]; started_at: string; completed_at: string | null }> = {};
      if (user?.id) {
        const { data: progressData } = await supabase
          .from('user_program_progress')
          .select('program_id, lessons_completed, started_at, completed_at')
          .eq('user_id', user.id);

        progressData?.forEach(p => {
          userProgress[p.program_id] = {
            lessons_completed: p.lessons_completed || [],
            started_at: p.started_at,
            completed_at: p.completed_at
          };
        });
      }

      // Combine all data
      const programsWithData: ProgramWithProgress[] = (programs || []).map(p => ({
        ...p,
        status: p.status as 'active' | 'coming_soon' | 'completed',
        votes_count: votesCount[p.id] || 0,
        user_voted: userVotes.includes(p.id),
        lessons_completed: userProgress[p.id]?.lessons_completed || [],
        started_at: userProgress[p.id]?.started_at || null,
        completed_at: userProgress[p.id]?.completed_at || null,
        progress_percentage: userProgress[p.id] 
          ? Math.round((userProgress[p.id].lessons_completed.length / p.total_lessons) * 100)
          : 0
      }));

      // Categorize programs
      const current = programsWithData.filter(p => 
        p.status === 'active' && p.started_at && !p.completed_at
      );
      const available = programsWithData.filter(p => 
        p.status === 'active' && !p.started_at
      );
      const comingSoon = programsWithData.filter(p => p.status === 'coming_soon');
      const completed = programsWithData.filter(p => p.completed_at !== null);

      return {
        all: programsWithData,
        current,
        available,
        comingSoon,
        completed
      };
    },
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProgramVote() {
  const { user } = useAuth();

  const vote = async (programId: string) => {
    if (!user?.id) throw new Error('Must be logged in to vote');

    const { error } = await supabase
      .from('program_votes')
      .insert({ program_id: programId, user_id: user.id });

    if (error) throw error;
  };

  const unvote = async (programId: string) => {
    if (!user?.id) throw new Error('Must be logged in to unvote');

    const { error } = await supabase
      .from('program_votes')
      .delete()
      .eq('program_id', programId)
      .eq('user_id', user.id);

    if (error) throw error;
  };

  return { vote, unvote };
}
