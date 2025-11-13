import { useState, useEffect } from 'react';
import { AnimatedPage } from "@/components/common/AnimatedPage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Share, PlusSquare, Bell, Check, Sparkles, Zap, TrendingUp } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { notificationManager } from '@/lib/notifications';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Install() {
  const { user } = useAuth();
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const supported = notificationManager.isSupported();
    setIsSupported(supported);
    if (supported) {
      setPermissionStatus(notificationManager.getPermission());
    }
  }, []);

  const handleEnableNotifications = async () => {
    if (!user?.profileId) {
      toast.error('Please sign in to enable notifications');
      return;
    }

    setIsLoading(true);
    try {
      const granted = await notificationManager.requestPermission();

      if (!granted) {
        toast.error('Notification permission denied');
        setIsLoading(false);
        return;
      }

      setPermissionStatus('granted');

      await notificationManager.showNotification(
        'Notifications Enabled! 🎉',
        {
          body: 'You\'ll receive daily reminders and progress updates.',
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

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background p-4 sm:p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Hero Section */}
          <div className="text-center space-y-3 py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">Get the Full Experience</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Install NEP System and enable notifications for the best parenting support
            </p>
          </div>

          {/* Notification Permission Card */}
          {isSupported && (
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Bell className="w-5 h-5 text-primary" />
                      Push Notifications
                      {permissionStatus === 'granted' && (
                        <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                          <Check className="w-3 h-3 mr-1" />
                          Enabled
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Stay on track with smart reminders and insights
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Daily Mission Reminders</p>
                      <p className="text-xs text-muted-foreground">Get notified at 9 AM to start your day right</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                    <Zap className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Streak Protection</p>
                      <p className="text-xs text-muted-foreground">Warning at 8 PM if you haven't logged today</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                    <TrendingUp className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Weekly Progress Reports</p>
                      <p className="text-xs text-muted-foreground">Sunday at 7 PM - see how far you've come</p>
                    </div>
                  </div>
                </div>

                {permissionStatus !== 'granted' && (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleEnableNotifications}
                    disabled={isLoading || permissionStatus === 'denied'}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    {isLoading ? 'Enabling...' : permissionStatus === 'denied' ? 'Blocked - Check Browser Settings' : 'Enable Notifications'}
                  </Button>
                )}

                {permissionStatus === 'denied' && (
                  <div className="p-3 bg-destructive/10 rounded-md border border-destructive/20">
                    <p className="text-xs text-destructive">
                      Notifications are blocked. Please enable them in your browser settings and refresh.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Installation Instructions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Install as App</h2>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-6 h-6" />
                iOS (Safari)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1">1.</span>
                  <span>Tap the <Share className="inline w-4 h-4" /> share button in Safari</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">2.</span>
                  <span>Scroll down and tap <PlusSquare className="inline w-4 h-4" /> "Add to Home Screen"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">3.</span>
                  <span>Tap "Add" in the top right corner</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-6 h-6" />
                Android (Chrome)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1">1.</span>
                  <span>Tap the menu button (three dots) in the top right</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">2.</span>
                  <span>Tap "Install app" or "Add to Home screen"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">3.</span>
                  <span>Tap "Install" to confirm</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="font-medium">Why Install?</p>
                <p className="text-sm text-muted-foreground">
                  ✓ Instant access from your home screen<br/>
                  ✓ Works offline<br/>
                  ✓ Faster loading times<br/>
                  ✓ Push notifications for daily support
                </p>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
