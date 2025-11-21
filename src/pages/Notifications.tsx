// @ts-nocheck
import React from 'react';
import { ArrowLeft, Bell, Heart, MessageCircle, UserPlus, Check, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import type { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Notification = Database['public']['Tables']['notifications']['Row'];

export default function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications(user?.profileId ?? null);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'reply':
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getNotificationMessage = (notification: Notification) => {
    const metadata = notification.metadata as any;
    const actorName = metadata?.actor_name || 'Someone';

    switch (notification.type) {
      case 'like':
        return `${actorName} liked your post`;
      case 'comment':
        return `${actorName} commented on your post`;
      case 'reply':
        return `${actorName} replied to your comment`;
      case 'follow':
        return `${actorName} started following you`;
      default:
        return notification.content || 'New notification';
    }
  };

  const getNotificationPreview = (notification: Notification) => {
    const metadata = notification.metadata as any;
    return metadata?.preview || '';
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate to the related content
    const metadata = notification.metadata as any;
    if (metadata?.post_id) {
      navigate('/community', { state: { scrollToPost: metadata.post_id } });
    }
  };

  const handleDeleteNotification = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;

    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Group notifications by date
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const date = new Date(notification.created_at || '');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let key: string;
    if (date.toDateString() === today.toDateString()) {
      key = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      key = 'Yesterday';
    } else {
      key = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    }

    if (!acc[key]) acc[key] = [];
    acc[key].push(notification);
    return acc;
  }, {} as Record<string, Notification[]>);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                </p>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2 w-full sm:w-auto">
              <Check className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Mark all as read</span>
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No notifications yet</h3>
            <p className="text-muted-foreground mb-6">
              We'll notify you when someone interacts with your posts or follows you
            </p>
            <Button onClick={() => navigate('/community')}>
              Go to Community
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([dateLabel, notifs]) => (
              <div key={dateLabel}>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3">{dateLabel}</h2>
                <div className="space-y-2">
                  {notifs.map((notification) => (
                    <Card
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 cursor-pointer hover:shadow-md transition-all ${
                        !notification.read ? 'bg-primary/5 border-primary/20' : ''
                      }`}
                    >
                      <div className="flex gap-4 items-start">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm mb-1 ${!notification.read ? 'font-semibold' : ''}`}>
                            {getNotificationMessage(notification)}
                          </p>
                          {getNotificationPreview(notification) && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              "{getNotificationPreview(notification)}"
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.created_at || new Date().toISOString())}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
