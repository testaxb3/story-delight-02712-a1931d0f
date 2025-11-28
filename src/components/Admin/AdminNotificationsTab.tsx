import { useState, useEffect } from 'react';
import { Bell, Send, Users, CheckCircle, AlertCircle, ExternalLink, Filter, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

type NotificationType = 'broadcast' | 'new_script' | 'new_content' | 'tracker_reminder';
type TargetProfile = 'ALL' | 'INTENSE' | 'DISTRACTED' | 'DEFIANT';

interface NotificationLog {
  id: string;
  notification_type: string;
  target_profile: string | null;
  title: string;
  message: string;
  recipients_count: number;
  status: string;
  sent_at: string | null;
  created_at: string;
}

const NOTIFICATION_TYPES: { value: NotificationType; label: string; description: string }[] = [
  { value: 'broadcast', label: 'Broadcast', description: 'Send to all users' },
  { value: 'new_script', label: 'New Script', description: 'Announce new scripts by profile' },
  { value: 'new_content', label: 'New Content', description: 'Announce new ebooks/videos' },
  { value: 'tracker_reminder', label: 'Tracker Reminder', description: 'Remind users to log' },
];

const PROFILES: { value: TargetProfile; label: string; emoji: string }[] = [
  { value: 'ALL', label: 'All Users', emoji: '👥' },
  { value: 'INTENSE', label: 'Intense Profile', emoji: '🔥' },
  { value: 'DISTRACTED', label: 'Distracted Profile', emoji: '🦋' },
  { value: 'DEFIANT', label: 'Defiant Profile', emoji: '⚡' },
];

export function AdminNotificationsTab() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [notificationType, setNotificationType] = useState<NotificationType>('broadcast');
  const [targetProfile, setTargetProfile] = useState<TargetProfile>('ALL');
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<NotificationLog[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

  // Load notification history
  useEffect(() => {
    loadHistory();
    loadSubscriberCount();
  }, [targetProfile]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    const { data, error } = await supabase
      .from('push_notification_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setHistory(data as NotificationLog[]);
    }
    setLoadingHistory(false);
  };

  const loadSubscriberCount = async () => {
    try {
      const { data, error } = await supabase.rpc('get_player_ids_by_profile', {
        target_profile: targetProfile
      });

      if (!error && data) {
        setSubscriberCount(data.length);
      }
    } catch (e) {
      console.error('Error loading subscriber count:', e);
    }
  };

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in both title and message');
      return;
    }

    setSending(true);

    try {
      console.log('[Admin] Sending notification via edge function:', { 
        type: notificationType, 
        target_profile: targetProfile, 
        title 
      });

      const { data, error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          type: notificationType,
          target_profile: targetProfile,
          title,
          message,
          created_by: user?.id,
          data: {
            link: notificationType === 'new_script' ? '/scripts' : 
                  notificationType === 'new_content' ? '/bonuses' : '/'
          }
        }
      });

      if (error) {
        throw error;
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to send notification');
      }

      console.log('[Admin] Notification sent:', data);

      toast.success(`Notification sent to ${data.recipients} users! 🎉`);

      // Clear form and reload history
      setTitle('');
      setMessage('');
      loadHistory();

    } catch (error: any) {
      console.error('[Admin] Error sending notification:', error);
      toast.error(error.message || 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500/15 text-green-600">Sent</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            Push Notifications
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Send targeted push notifications to users
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open('https://app.onesignal.com', '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          OneSignal Dashboard
        </Button>
      </div>

      {/* Notification Form */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Send className="w-5 h-5 text-primary" />
          Create Notification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Notification Type */}
          <div>
            <Label>Notification Type</Label>
            <Select value={notificationType} onValueChange={(v) => setNotificationType(v as NotificationType)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NOTIFICATION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex flex-col">
                      <span>{type.label}</span>
                      <span className="text-xs text-muted-foreground">{type.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Target Profile */}
          <div>
            <Label className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Target Audience
            </Label>
            <Select value={targetProfile} onValueChange={(v) => setTargetProfile(v as TargetProfile)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROFILES.map((profile) => (
                  <SelectItem key={profile.value} value={profile.value}>
                    <span>{profile.emoji} {profile.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {subscriberCount !== null && (
              <p className="text-xs text-muted-foreground mt-1">
                {subscriberCount} subscribed {subscriberCount === 1 ? 'user' : 'users'} will receive this
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="notification-title">Title *</Label>
            <Input
              id="notification-title"
              placeholder="e.g., New NEP Scripts Available!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {title.length}/50 characters
            </p>
          </div>

          <div>
            <Label htmlFor="notification-message">Message *</Label>
            <Textarea
              id="notification-message"
              placeholder="e.g., Check out 5 new bedtime scripts designed for INTENSE brain types..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={200}
              rows={4}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {message.length}/200 characters
            </p>
          </div>

          {/* Preview */}
          {(title || message) && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border-2 border-dashed border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-2">PREVIEW:</p>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🧠</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{title || 'Notification Title'}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {message || 'Notification message will appear here...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Button
              onClick={handleSendNotification}
              disabled={sending || !title.trim() || !message.trim() || subscriberCount === 0}
              className="w-full"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send to {targetProfile === 'ALL' ? 'All Users' : `${targetProfile} Profile Users`}
                </>
              )}
            </Button>
          </div>

          <Alert className="bg-muted/50 border-border">
            <Users className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Push + In-App:</strong> This will send both a push notification and create an in-app notification for all targeted users.
            </AlertDescription>
          </Alert>
        </div>
      </Card>

      {/* Notification History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <History className="w-5 h-5" />
          Notification History
        </h3>
        
        {loadingHistory ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No notifications sent yet
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border"
              >
                {item.status === 'sent' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : item.status === 'failed' ? (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Bell className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm truncate">{item.title}</p>
                    {getStatusBadge(item.status)}
                    {item.target_profile && (
                      <Badge variant="outline" className="text-xs">
                        {item.target_profile}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.message}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {item.sent_at ? new Date(item.sent_at).toLocaleString() : new Date(item.created_at).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.recipients_count} recipients
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}