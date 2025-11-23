import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
type Notification = {
  id: string;
  user_id: string;
  type: string;
  content: string | null;
  read: boolean;
  metadata: any;
  created_at: string;
};

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    let cancelled = false; // Flag to prevent race conditions
    setLoading(true);

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          // ✅ PERFORMANCE: Only select needed columns
          .select('id, user_id, type, content, read, metadata, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (cancelled) return; // Check before state update

        if (error) throw error;

        setNotifications(data || []);
        setUnreadCount(data?.filter((n) => !n.read).length || 0);
      } catch (error) {
        if (!cancelled) console.error('Error fetching notifications:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchNotifications();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`notifications-${userId}`) // Unique channel name per user
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => {
            // Prevent duplicates
            if (prev.some(n => n.id === newNotification.id)) return prev;
            return [newNotification, ...prev];
          });
          setUnreadCount((prev) => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updatedNotification = payload.new as Notification;
          setNotifications((prev) =>
            prev.map((n) => (n.id === updatedNotification.id ? updatedNotification : n))
          );
          // Recalculate unread count
          setUnreadCount((prev) => {
            const oldNotification = notifications.find((n) => n.id === updatedNotification.id);
            if (oldNotification?.read === false && updatedNotification.read === true) {
              return Math.max(0, prev - 1);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      cancelled = true; // Set flag on cleanup
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  };
}
