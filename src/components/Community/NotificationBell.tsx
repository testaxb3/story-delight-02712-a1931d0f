import React, { useState } from 'react';
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Check, 
  FileText, 
  Book, 
  Play, 
  DollarSign, 
  Sparkles,
  Megaphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type Notification = {
  id: string;
  user_id: string;
  type: string;
  content: string | null;
  read: boolean;
  metadata: any;
  created_at: string;
  title?: string;
  message?: string;
  link?: string;
};

interface NotificationBellProps {
  userId: string | null;
  className?: string;
}

export function NotificationBell({ userId, className }: NotificationBellProps) {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications(userId);
  const [open, setOpen] = useState(false);

  const recentNotifications = notifications.slice(0, 8);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'reply':
        return <MessageCircle className="w-4 h-4 text-green-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-purple-500" />;
      case 'new_script':
        return <FileText className="w-4 h-4 text-orange-500" />;
      case 'new_ebook':
        return <Book className="w-4 h-4 text-violet-500" />;
      case 'new_video':
        return <Play className="w-4 h-4 text-red-500" />;
      case 'refund_response':
        return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case 'app_update':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getNotificationMessage = (notification: Notification) => {
    // Use title/message if available (new format)
    if (notification.title) {
      return notification.title;
    }

    // Legacy format using metadata
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
      case 'new_script':
        return 'New script available';
      case 'new_ebook':
        return 'New ebook available';
      case 'new_video':
        return 'New video available';
      case 'refund_response':
        return 'New message about your refund';
      case 'app_update':
        return 'App update available';
      default:
        return notification.content || notification.message || 'New notification';
    }
  };

  const getNotificationDescription = (notification: Notification) => {
    if (notification.message && notification.title) {
      return notification.message;
    }
    return null;
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate based on link or type
    if (notification.link) {
      navigate(notification.link);
    } else {
      const metadata = notification.metadata as any;
      if (metadata?.post_id) {
        navigate('/community', { state: { scrollToPost: metadata.post_id } });
      } else if (notification.type === 'refund_response') {
        navigate('/refund-status');
      } else if (notification.type === 'new_script') {
        navigate('/scripts');
      } else if (notification.type === 'new_ebook' || notification.type === 'new_video') {
        navigate('/bonuses');
      }
    }

    setOpen(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("relative rounded-full", className)}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 border-2 border-background">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-3">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
              className="text-xs h-7 text-primary"
            >
              <Check className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2" />
            Loading...
          </div>
        ) : recentNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No notifications yet</p>
            <p className="text-xs text-muted-foreground mt-1">We'll notify you when something happens</p>
          </div>
        ) : (
          <>
            {recentNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  "flex gap-3 items-start p-3 cursor-pointer",
                  !notification.read && "bg-primary/5"
                )}
              >
                <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm line-clamp-2",
                    !notification.read && "font-semibold"
                  )}>
                    {getNotificationMessage(notification)}
                  </p>
                  {getNotificationDescription(notification) && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {getNotificationDescription(notification)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimestamp(notification.created_at || new Date().toISOString())}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                )}
              </DropdownMenuItem>
            ))}

            {notifications.length > 8 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    navigate('/notifications');
                    setOpen(false);
                  }}
                  className="justify-center font-medium text-primary py-3"
                >
                  View all notifications
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
