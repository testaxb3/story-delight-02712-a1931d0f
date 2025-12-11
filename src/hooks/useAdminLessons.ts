import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Lesson {
  id: string;
  day_number: number;
  title: string;
  content: string;
  summary: string | null;
  estimated_minutes: number | null;
  audio_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProcessedLesson {
  day_number: number;
  title: string;
  content: string;
  summary: string;
  estimated_minutes: number;
}

export function useAdminLessons() {
  return useQuery({
    queryKey: ['admin-lessons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('day_number', { ascending: true });
      
      if (error) throw error;
      return data as Lesson[];
    },
  });
}

export function useProcessLessons() {
  return useMutation({
    mutationFn: async (rawLessons: Array<{ Title: string; Body: string }>) => {
      const { data, error } = await supabase.functions.invoke('process-lessons', {
        body: { lessons: rawLessons },
      });
      
      if (error) throw error;
      return data as { lessons: ProcessedLesson[] };
    },
  });
}

export function useImportLessons() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (lessons: ProcessedLesson[]) => {
      // Delete existing lessons first
      const { error: deleteError } = await supabase
        .from('lessons')
        .delete()
        .gte('day_number', 0);
      
      if (deleteError) throw deleteError;
      
      // Insert new lessons
      const { data, error } = await supabase
        .from('lessons')
        .insert(lessons.map(lesson => ({
          day_number: lesson.day_number,
          title: lesson.title,
          content: lesson.content,
          summary: lesson.summary,
          estimated_minutes: lesson.estimated_minutes,
        })))
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Lessons imported successfully!');
    },
    onError: (error) => {
      toast.error('Failed to import lessons: ' + error.message);
    },
  });
}

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
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Lesson updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update lesson: ' + error.message);
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Lesson deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete lesson: ' + error.message);
    },
  });
}

export function useUploadLessonAudio() {
  return useMutation({
    mutationFn: async ({ file, lessonId }: { file: File; lessonId: string }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${lessonId}.${fileExt}`;
      const filePath = `lessons/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('audio-tracks')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('audio-tracks')
        .getPublicUrl(filePath);

      return publicUrl;
    },
  });
}
