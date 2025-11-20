import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ScriptRequest {
  id: string;
  user_id: string;
  situation_description: string;
  child_brain_profile?: string;
  child_age?: number;
  location_type?: string[];
  parent_emotional_state?: string;
  urgency_level: 'low' | 'medium' | 'high' | 'urgent';
  additional_notes?: string;
  status: 'pending' | 'in_review' | 'completed' | 'rejected';
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_script_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateScriptRequestData {
  situation_description: string;
  child_brain_profile?: string;
  child_age?: number;
  location_type?: string[];
  parent_emotional_state?: string;
  urgency_level?: 'low' | 'medium' | 'high' | 'urgent';
  additional_notes?: string;
}

export const useScriptRequests = () => {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['script-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('script_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ScriptRequest[];
    },
  });

  const createRequest = useMutation({
    mutationFn: async (requestData: CreateScriptRequestData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('script_requests')
        .insert([{ ...requestData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['script-requests'] });
      toast.success('Request submitted successfully!', {
        description: 'Our team will review your request soon.',
      });
    },
    onError: (error) => {
      console.error('Error creating script request:', error);
      toast.error('Failed to submit request', {
        description: 'Please try again later.',
      });
    },
  });

  return {
    requests,
    isLoading,
    createRequest: createRequest.mutate,
    isCreating: createRequest.isPending,
  };
};

// Hook específico para admins
export const useAdminScriptRequests = () => {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['admin-script-requests'],
    queryFn: async () => {
      // Fetch script requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('script_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      // Fetch user profiles separately to avoid RLS join issues
      const userIds = [...new Set(requestsData.map(r => r.user_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, child_name')
        .in('id', userIds);

      if (profilesError) {
        console.warn('Could not fetch profiles:', profilesError);
        return requestsData;
      }

      // Map profiles to requests
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      return requestsData.map(request => ({
        ...request,
        profiles: profilesMap.get(request.user_id) || null,
      }));
    },
  });

  const updateRequest = useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<ScriptRequest> 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('script_requests')
        .update({
          ...updates,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-script-requests'] });
      toast.success('Request updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating script request:', error);
      toast.error('Failed to update request');
    },
  });

  return {
    requests,
    isLoading,
    updateRequest: updateRequest.mutate,
    isUpdating: updateRequest.isPending,
  };
};
