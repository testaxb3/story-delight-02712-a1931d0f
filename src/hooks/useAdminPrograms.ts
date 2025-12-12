import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  age_range: string | null;
  status: string | null;
  display_order: number | null;
  total_lessons: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Lesson {
  id: string;
  program_id: string | null;
  day_number: number;
  title: string;
  summary: string | null;
  content: string;
  image_url: string | null;
  audio_url: string | null;
  estimated_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProgramWithLessons extends Program {
  lessons: Lesson[];
}

// Fetch all programs with their lessons
export function useAdminPrograms() {
  return useQuery({
    queryKey: ['admin-programs'],
    queryFn: async () => {
      const { data: programs, error: programsError } = await supabase
        .from('programs')
        .select('*')
        .order('display_order', { ascending: true });

      if (programsError) throw programsError;

      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('day_number', { ascending: true });

      if (lessonsError) throw lessonsError;

      // Group lessons by program_id
      const programsWithLessons: ProgramWithLessons[] = (programs || []).map(program => ({
        ...program,
        lessons: (lessons || []).filter(l => l.program_id === program.id),
      }));

      return programsWithLessons;
    },
  });
}

// Create program
export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Program, 'id' | 'created_at' | 'updated_at' | 'total_lessons'>) => {
      const { data: result, error } = await supabase
        .from('programs')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      toast.success('Program created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create program: ${error.message}`);
    },
  });
}

// Update program
export function useUpdateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Program> }) => {
      const { data, error } = await supabase
        .from('programs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      toast.success('Program updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update program: ${error.message}`);
    },
  });
}

// Delete program (cascades to lessons)
export function useDeleteProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // First delete all lessons in this program
      await supabase.from('lessons').delete().eq('program_id', id);
      
      // Then delete the program
      const { error } = await supabase.from('programs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      toast.success('Program and its lessons deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete program: ${error.message}`);
    },
  });
}

// Create lesson
export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('lessons')
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      // Auto-update total_lessons in program
      if (result.program_id) {
        const { count } = await supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true })
          .eq('program_id', result.program_id);

        await supabase
          .from('programs')
          .update({ total_lessons: count })
          .eq('id', result.program_id);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      queryClient.invalidateQueries({ queryKey: ['program-detail'] });
      toast.success('Lesson created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create lesson: ${error.message}`);
    },
  });
}

// Update lesson
export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Lesson> }) => {
      const { data, error } = await supabase
        .from('lessons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      toast.success('Lesson updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update lesson: ${error.message}`);
    },
  });
}

// Delete lesson
export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Get program_id before deleting
      const { data: lesson } = await supabase
        .from('lessons')
        .select('program_id')
        .eq('id', id)
        .single();

      const { error } = await supabase.from('lessons').delete().eq('id', id);
      if (error) throw error;

      // Recalculate total_lessons
      if (lesson?.program_id) {
        const { count } = await supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true })
          .eq('program_id', lesson.program_id);

        await supabase
          .from('programs')
          .update({ total_lessons: count })
          .eq('id', lesson.program_id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      queryClient.invalidateQueries({ queryKey: ['program-detail'] });
      toast.success('Lesson deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete lesson: ${error.message}`);
    },
  });
}

// Upload lesson image
export function useUploadLessonImage() {
  return useMutation({
    mutationFn: async ({ file, lessonId }: { file: File; lessonId: string }) => {
      const ext = file.name.split('.').pop();
      const path = `lessons/${lessonId}/cover.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('lesson-images')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('lesson-images').getPublicUrl(path);
      return data.publicUrl;
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload image: ${error.message}`);
    },
  });
}

// Upload lesson audio
export function useUploadLessonAudio() {
  return useMutation({
    mutationFn: async ({ file, lessonId }: { file: File; lessonId: string }) => {
      const ext = file.name.split('.').pop();
      const path = `lessons/${lessonId}/audio.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('audio-tracks')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('audio-tracks').getPublicUrl(path);
      return data.publicUrl;
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload audio: ${error.message}`);
    },
  });
}
