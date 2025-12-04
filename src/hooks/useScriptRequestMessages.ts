import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ScriptRequestMessage {
  id: string;
  script_request_id: string;
  sender_type: 'admin' | 'user';
  sender_id: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export function useScriptRequestMessages(scriptRequestId: string | null) {
  const [messages, setMessages] = useState<ScriptRequestMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!scriptRequestId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('script_request_messages')
        .select('*')
        .eq('script_request_id', scriptRequestId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data as ScriptRequestMessage[]) || []);
    } catch (error) {
      console.error('Error fetching script request messages:', error);
    } finally {
      setLoading(false);
    }
  }, [scriptRequestId]);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Real-time subscription
  useEffect(() => {
    if (!scriptRequestId) return;

    const channel = supabase
      .channel(`script-request-messages-${scriptRequestId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'script_request_messages',
          filter: `script_request_id=eq.${scriptRequestId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ScriptRequestMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [scriptRequestId]);

  const sendMessage = useCallback(async (
    message: string,
    senderType: 'admin' | 'user',
    senderId: string,
    customerUserId?: string
  ) => {
    if (!scriptRequestId || !message.trim()) return false;

    setSending(true);
    try {
      const { error: msgError } = await supabase
        .from('script_request_messages')
        .insert({
          script_request_id: scriptRequestId,
          sender_type: senderType,
          sender_id: senderId,
          message: message.trim(),
        });

      if (msgError) throw msgError;
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    } finally {
      setSending(false);
    }
  }, [scriptRequestId]);

  const markAsRead = useCallback(async () => {
    if (!scriptRequestId) return;

    try {
      await supabase
        .from('script_request_messages')
        .update({ read: true })
        .eq('script_request_id', scriptRequestId)
        .eq('read', false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [scriptRequestId]);

  return {
    messages,
    loading,
    sending,
    sendMessage,
    markAsRead,
    refetch: fetchMessages,
  };
}
