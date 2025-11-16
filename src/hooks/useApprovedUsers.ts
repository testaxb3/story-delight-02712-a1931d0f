import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ApprovedUser {
  id: string;
  email: string;
  order_id: string | null;
  product_name: string | null;
  total_price: number | null;
  first_name: string | null;
  last_name: string | null;
  status: string;
  approved_at: string;
  account_created: boolean;
  account_created_at: string | null;
  user_id: string | null;
  created_at: string;
}

export function useApprovedUsers() {
  const queryClient = useQueryClient();

  const { data: approvedUsers = [], isLoading } = useQuery({
    queryKey: ['approved-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('approved_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ApprovedUser[];
    },
  });

  const addApprovedUser = useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase
        .from('approved_users')
        .insert({
          email: email.toLowerCase().trim(),
          status: 'active',
          approved_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approved-users'] });
      toast.success('Email added to approved list');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add email');
    },
  });

  const updateUserStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('approved_users')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approved-users'] });
      toast.success('Status updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update status');
    },
  });

  const deleteApprovedUser = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('approved_users')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approved-users'] });
      toast.success('User removed from approved list');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove user');
    },
  });

  const stats = {
    total: approvedUsers.length,
    active: approvedUsers.filter(u => u.status === 'active').length,
    accountsCreated: approvedUsers.filter(u => u.account_created).length,
    pending: approvedUsers.filter(u => !u.account_created && u.status === 'active').length,
  };

  return {
    approvedUsers,
    isLoading,
    stats,
    addApprovedUser,
    updateUserStatus,
    deleteApprovedUser,
  };
}
