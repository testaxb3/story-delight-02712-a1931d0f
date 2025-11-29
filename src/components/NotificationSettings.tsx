import { useState, useEffect } from 'react';
import { Bell, BellOff, Check, X, Sparkles, Zap, TrendingUp, MessageCircle, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { notificationManager } from '@/lib/notifications';
import { registerPushSubscriptionWithRetry, unregisterPushSubscription, isOneSignalInitialized } from '@/lib/onesignal';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface NotificationPreferences {
  dailyMission: boolean;
  streakWarning: boolean;
  weeklyReport: boolean;
  communityReplies: boolean;
  milestones: boolean;
}

export function NotificationSettings() {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    dailyMission: true,
    streakWarning: true,
    weeklyReport: true,
    communityReplies: true,
    milestones: true,
  });

  useEffect(() => {
    // Check if notifications are supported
    const supported = notificationManager.isSupported();
    setIsSupported(supported);

    if (supported) {
      const permission = notificationManager.getPermission();
      setPermissionStatus(permission);
      setIsEnabled(permission === 'granted');
    }
  }, []);

  const handleEnableNotifications = async () => {
    if (!user?.profileId) {
      toast.error('Please sign in to enable notifications');
      return;
    }

    setIsLoading(true);

    try {
      // Request permission
      const granted = await notificationManager.requestPermission();

      if (!granted) {
        toast.error('Notification permission denied');
        setIsLoading(false);
        return;
      }

      setPermissionStatus('granted');
      setIsEnabled(true);

      // TODO: Subscribe to push notifications when VAPID keys are configured
      // For now, we'll just save the preference
      // const vapidKey = 'YOUR_VAPID_PUBLIC_KEY';
      // const subscription = await notificationManager.subscribe(vapidKey);

      // if (subscription) {
      //   // Save subscription to database
      //   await supabase.from('push_subscriptions').insert({
      //     user_id: user.profileId,
      //     endpoint: subscription.endpoint,
      //     p256dh: subscription.p256dh,
      //     auth: subscription.auth
      //   });
      // }

      // Register subscription in Supabase for targeted notifications
      if (user?.profileId) {
        // Use retry mechanism for robust registration
        registerPushSubscriptionWithRetry(user.profileId, 5, 2000).then(result => {
          if (!result.success) {
            console.error('[NotificationSettings] Push registration failed:', result.reason);
          } else {
            console.log('[NotificationSettings] Push registration successful, player ID:', result.playerId);
          }
        });
      }

      // Show a test notification
      await notificationManager.showNotification(
        'Notifications Enabled! 🎉',
        {
          body: 'You\'ll now receive reminders and updates from NEP System.',
          icon: '/icon-192.png'
        }
      );

      toast.success('Notifications enabled successfully!');
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast.error('Failed to enable notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setIsLoading(true);

    try {
      // Unsubscribe from push
      await notificationManager.unsubscribe();

      // Mark subscription as inactive in Supabase
      if (user?.profileId) {
        await unregisterPushSubscription(user.profileId);
      }

      setIsEnabled(false);
      toast.success('Notifications disabled');
    } catch (error) {
      console.error('Error disabling notifications:', error);
      toast.error('Failed to disable notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      await handleEnableNotifications();
    } else {
      await handleDisableNotifications();
    }
  };

  if (!isSupported) {
    return (
      <Card className="p-4 bg-muted/50">
        <div className="flex items-start gap-3">
          <BellOff className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-sm">Notifications Not Supported</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Your browser doesn't support push notifications. Try using Chrome, Firefox, or Edge.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Bell className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm">Push Notifications</h3>
              {permissionStatus === 'granted' ? (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                  <Check className="w-3 h-3 mr-1" />
                  Enabled
                </Badge>
              ) : permissionStatus === 'denied' ? (
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                  <X className="w-3 h-3 mr-1" />
                  Blocked
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                  Not Enabled
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Get daily mission reminders, streak alerts, and progress updates
            </p>

            {permissionStatus === 'denied' && (
              <div className="mt-2 p-2 bg-destructive/10 rounded-md">
                <p className="text-xs text-destructive">
                  Notifications are blocked. Please enable them in your browser settings.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="notifications-toggle" className="sr-only">
            Enable notifications
          </Label>
          <Switch
            id="notifications-toggle"
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={isLoading || permissionStatus === 'denied'}
          />
        </div>
      </div>

      {permissionStatus === 'default' && !isEnabled && (
        <div className="mt-3 pt-3 border-t">
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={handleEnableNotifications}
            disabled={isLoading}
          >
            <Bell className="w-4 h-4 mr-2" />
            {isLoading ? 'Enabling...' : 'Enable Notifications'}
          </Button>
        </div>
      )}

      {/* Notification Preferences - Only shown when enabled */}
      {permissionStatus === 'granted' && isEnabled && (
        <>
          <Separator className="my-4" />

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between"
            onClick={() => setShowPreferences(!showPreferences)}
          >
            <span className="text-sm font-medium">Notification Preferences</span>
            {showPreferences ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>

          {showPreferences && (
            <div className="mt-3 space-y-3">
              {/* Daily Mission Reminder */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <div>
                    <Label htmlFor="daily-mission" className="text-sm font-medium cursor-pointer">
                      Daily Mission
                    </Label>
                    <p className="text-xs text-muted-foreground">9 AM reminder</p>
                  </div>
                </div>
                <Switch
                  id="daily-mission"
                  checked={preferences.dailyMission}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, dailyMission: checked })
                  }
                />
              </div>

              {/* Streak Warning */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <div>
                    <Label htmlFor="streak-warning" className="text-sm font-medium cursor-pointer">
                      Streak Protection
                    </Label>
                    <p className="text-xs text-muted-foreground">8 PM if not logged</p>
                  </div>
                </div>
                <Switch
                  id="streak-warning"
                  checked={preferences.streakWarning}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, streakWarning: checked })
                  }
                />
              </div>

              {/* Weekly Report */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <div>
                    <Label htmlFor="weekly-report" className="text-sm font-medium cursor-pointer">
                      Weekly Report
                    </Label>
                    <p className="text-xs text-muted-foreground">Sunday 7 PM</p>
                  </div>
                </div>
                <Switch
                  id="weekly-report"
                  checked={preferences.weeklyReport}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, weeklyReport: checked })
                  }
                />
              </div>

              {/* Community Replies */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  <div>
                    <Label htmlFor="community-replies" className="text-sm font-medium cursor-pointer">
                      Community Replies
                    </Label>
                    <p className="text-xs text-muted-foreground">When someone responds</p>
                  </div>
                </div>
                <Switch
                  id="community-replies"
                  checked={preferences.communityReplies}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, communityReplies: checked })
                  }
                />
              </div>

              {/* Milestones */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <div>
                    <Label htmlFor="milestones" className="text-sm font-medium cursor-pointer">
                      Achievements
                    </Label>
                    <p className="text-xs text-muted-foreground">Milestone celebrations</p>
                  </div>
                </div>
                <Switch
                  id="milestones"
                  checked={preferences.milestones}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, milestones: checked })
                  }
                />
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
