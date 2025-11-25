import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Routine, RoutineStep } from '@/types/routine';

export const useRoutines = (childProfileId?: string) => {
  const queryClient = useQueryClient();

  const { data: routines, isLoading } = useQuery({
    queryKey: ['routines', childProfileId],
    queryFn: async () => {
      let query = supabase
        .from('routines')
        .select('*, routine_steps(*)')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (childProfileId) {
        query = query.eq('child_profile_id', childProfileId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as (Routine & { routine_steps: RoutineStep[] })[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const createRoutine = useMutation({
    mutationFn: async (routine: Partial<Routine>) => {
      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('routines')
        .insert({
          ...routine,
          user_id: user.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });

  const updateRoutine = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Routine> & { id: string }) => {
      const { data, error } = await supabase
        .from('routines')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });

  const deleteRoutine = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('routines')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });

  const createStep = useMutation({
    mutationFn: async (step: Partial<RoutineStep>) => {
      const { data, error } = await supabase
        .from('routine_steps')
        .insert(step)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });

  const updateStep = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RoutineStep> & { id: string }) => {
      const { data, error } = await supabase
        .from('routine_steps')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });

  const deleteStep = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('routine_steps')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });

  return {
    routines,
    isLoading,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    createStep,
    updateStep,
    deleteStep,
  };
};

export const useRoutineTemplates = () => {
  const { data: templates, isLoading } = useQuery({
    queryKey: ['routine-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routine_templates')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });

  return { templates, isLoading };
};
