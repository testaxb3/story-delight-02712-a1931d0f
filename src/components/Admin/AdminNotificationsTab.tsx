import { useState } from 'react';
import { Bell, Send, Users, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sendNotificationToAll, isOneSignalInitialized } from '@/lib/onesignal';
import { toast } from 'sonner';
import { OneSignalDebug } from '@/components/OneSignalDebug';

interface NotificationHistory {
  id: string;
  title: string;
  message: string;
  sentAt: Date;
  success: boolean;
}

export function AdminNotificationsTab() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const oneSignalConfigured = !!import.meta.env.VITE_ONESIGNAL_APP_ID;
  const oneSignalInitialized = isOneSignalInitialized();

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in both title and message');
      return;
    }

    if (!oneSignalConfigured) {
      toast.error('OneSignal is not configured. Please add VITE_ONESIGNAL_APP_ID and VITE_ONESIGNAL_REST_API_KEY to .env');
      return;
    }

    setSending(true);

    try {
      console.log('[Admin] Sending notification:', { title, message });

      // Send notification via OneSignal API to all users
      const result = await sendNotificationToAll(title, message);

      console.log('[Admin] Notification result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to send notification');
      }

      // Add to history
      const newNotification: NotificationHistory = {
        id: Date.now().toString(),
        title,
        message,
        sentAt: new Date(),
        success: true,
      };

      setHistory(prev => [newNotification, ...prev]);

      toast.success('Notification sent to all users! 🎉');

      // Clear form
      setTitle('');
      setMessage('');
    } catch (error: any) {
      console.error('[Admin] Error sending notification:', error);

      const failedNotification: NotificationHistory = {
        id: Date.now().toString(),
        title,
        message,
        sentAt: new Date(),
        success: false,
      };

      setHistory(prev => [failedNotification, ...prev]);

      // More descriptive error message
      if (error.message?.includes('credentials')) {
        toast.error('OneSignal credentials are invalid. Check your environment variables.');
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        toast.error('Network error. Please check your internet connection.');
      } else {
        toast.error(error.message || 'Failed to send notification');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            Push Notifications via OneSignal
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Send push notifications to all subscribed users
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={oneSignalConfigured ? 'default' : 'destructive'}>
            {oneSignalConfigured ? '✓ OneSignal Configured' : '⚠ Not Configured'}
          </Badge>
          {oneSignalConfigured && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://app.onesignal.com', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              OneSignal Dashboard
            </Button>
          )}
        </div>
      </div>

      {/* Debug Panel - Shows detailed status */}
      <OneSignalDebug />

      {/* Configuration Warning */}
      {!oneSignalConfigured && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>OneSignal not configured!</strong> Please follow the setup instructions:
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Create account at <a href="https://onesignal.com" target="_blank" rel="noopener noreferrer" className="underline">onesignal.com</a></li>
              <li>Create a new Web Push app</li>
              <li>Get your App ID and REST API Key from Settings → Keys & IDs</li>
              <li>Add to .env file:
                <div className="bg-black/10 p-2 rounded mt-1 text-xs font-mono">
                  VITE_ONESIGNAL_APP_ID=your-app-id<br />
                  VITE_ONESIGNAL_REST_API_KEY=your-rest-api-key
                </div>
              </li>
              <li>Restart the dev server</li>
            </ol>
            <p className="mt-2">
              📖 See detailed instructions in <code className="bg-black/10 px-1 rounded">docs/ONESIGNAL_SETUP_INSTRUCTIONS.md</code>
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Notification Form */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-600" />
          Create Notification
        </h3>

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
            <div className="mt-4 p-4 bg-white rounded-lg border-2 border-dashed border-blue-300">
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

          {/* Action Buttons */}
          <div className="pt-2">
            <Button
              onClick={handleSendNotification}
              disabled={sending || !title.trim() || !message.trim() || !oneSignalConfigured}
              className="w-full"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending to all users...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send to All Subscribed Users
                </>
              )}
            </Button>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <Users className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm">
              <strong>OneSignal Broadcast:</strong> This will send a push notification to all users who:
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Opened the app and allowed notifications</li>
                <li>Are subscribed via OneSignal</li>
                <li>Have the app installed (PWA) or browser open</li>
              </ul>
              <p className="mt-2">
                💡 <strong>Tip:</strong> Test notifications first using the OneSignal Dashboard before sending to all users.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </Card>

      {/* Notification History */}
      {history.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            {history.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border"
              >
                {item.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.sentAt.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Help Section */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-purple-600" />
          How OneSignal Push Notifications Work
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">•</span>
            <span><strong>Automatic Subscription:</strong> Users are prompted to allow notifications when they first open the app. Once they accept, they're automatically subscribed via OneSignal.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">•</span>
            <span><strong>Testing:</strong> Use the OneSignal Dashboard to send test notifications before broadcasting to all users. Click "OneSignal Dashboard" button above.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">•</span>
            <span><strong>Delivery:</strong> Notifications are delivered instantly to all subscribed users, even if they don't have the app open (depending on browser settings).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">•</span>
            <span><strong>Analytics:</strong> View delivery stats, click rates, and subscriber counts in the OneSignal Dashboard.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">•</span>
            <span><strong>Best Practices:</strong> Keep titles under 50 chars, messages under 200 chars. Use clear, actionable language. Send at optimal times (not late night).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">•</span>
            <span><strong>Safari iOS:</strong> Users on iPhone/iPad must install the app as PWA (Add to Home Screen) for notifications to work.</span>
          </li>
        </ul>
        <div className="mt-4 p-3 bg-purple-100 rounded-lg">
          <p className="text-sm font-semibold text-purple-900">📖 Need Help?</p>
          <p className="text-xs text-purple-700 mt-1">
            See <code className="bg-purple-200 px-1 rounded">docs/ONESIGNAL_SETUP_INSTRUCTIONS.md</code> for detailed setup guide.
          </p>
        </div>
      </Card>
    </div>
  );
}
