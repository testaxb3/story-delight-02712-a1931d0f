import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RefundMessage {
  id: string;
  refund_request_id: string;
  sender_type: 'admin' | 'user';
  sender_id: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export function useRefundMessages(refundRequestId: string | null) {
  const [messages, setMessages] = useState<RefundMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!refundRequestId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('refund_messages')
        .select('*')
        .eq('refund_request_id', refundRequestId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data as RefundMessage[]) || []);
    } catch (error) {
      console.error('Error fetching refund messages:', error);
    } finally {
      setLoading(false);
    }
  }, [refundRequestId]);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Real-time subscription
  useEffect(() => {
    if (!refundRequestId) return;

    const channel = supabase
      .channel(`refund-messages-${refundRequestId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'refund_messages',
          filter: `refund_request_id=eq.${refundRequestId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as RefundMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refundRequestId]);

  const sendMessage = useCallback(async (
    message: string,
    senderType: 'admin' | 'user',
    senderId: string,
    customerUserId?: string // For admin to notify user
  ) => {
    if (!refundRequestId || !message.trim()) return false;

    setSending(true);
    try {
      // Insert message
      const { error: msgError } = await supabase
        .from('refund_messages')
        .insert({
          refund_request_id: refundRequestId,
          sender_type: senderType,
          sender_id: senderId,
          message: message.trim(),
        });

      if (msgError) throw msgError;

      // Create notification for the recipient
      if (senderType === 'admin' && customerUserId) {
        await supabase.from('notifications').insert({
          user_id: customerUserId,
          type: 'refund_response',
          type_enum: 'refund_response',
          title: 'New message about your refund',
          message: 'You have a new response regarding your refund request',
          link: '/refund-status',
        });
      }

      return true;
    } catch (error: any) {
      console.error('Error sending refund message:', {
        error,
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        refundRequestId,
        senderType,
      });
      return false;
    } finally {
      setSending(false);
    }
  }, [refundRequestId]);

  const markAsRead = useCallback(async () => {
    if (!refundRequestId) return;

    try {
      await supabase
        .from('refund_messages')
        .update({ read: true })
        .eq('refund_request_id', refundRequestId)
        .eq('read', false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [refundRequestId]);

  return {
    messages,
    loading,
    sending,
    sendMessage,
    markAsRead,
    refetch: fetchMessages,
  };
}
