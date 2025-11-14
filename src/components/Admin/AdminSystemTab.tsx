import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw, Loader2, AlertTriangle, CheckCircle2, Settings } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function AdminSystemTab() {
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('New update available! Please update the app.');

  const handleForceUpdate = async () => {
    setUpdating(true);

    try {
      const { data, error } = await supabase.rpc('force_app_update', {
        update_message: updateMessage
      });

      if (error) {
        throw error;
      }

      toast.success(
        data.message || 'Update forced successfully!',
        {
          description: `Version: ${data.new_version} (Build #${data.build})`,
          icon: <CheckCircle2 className="w-5 h-5" />,
          duration: 5000,
        }
      );

      // Reset message
      setUpdateMessage('New update available! Please update the app.');
    } catch (error: any) {
      console.error('Error forcing update:', error);
      toast.error(
        'Error forcing update',
        {
          description: error.message || 'Please try again later',
          icon: <AlertTriangle className="w-5 h-5" />,
        }
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5" />
        <h2 className="text-2xl font-bold">System Settings</h2>
      </div>

      {/* Force App Update Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Force PWA Update
          </CardTitle>
          <CardDescription>
            Force all users to update the PWA app, clearing cache and loading the latest version.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="updateMessage">
              Update Message
            </Label>
            <Input
              id="updateMessage"
              value={updateMessage}
              onChange={(e) => setUpdateMessage(e.target.value)}
              placeholder="Enter the message users will see..."
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              This message will be displayed in the update dialog.
            </p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                  Warning!
                </p>
                <p className="text-yellow-800 dark:text-yellow-200">
                  This action will:
                </p>
                <ul className="list-disc list-inside space-y-1 text-yellow-800 dark:text-yellow-200 ml-2">
                  <li>Increment the app version</li>
                  <li>Force all users to see an update dialog</li>
                  <li>Clear PWA cache when they update</li>
                  <li>Reload the page to the new version</li>
                </ul>
              </div>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="w-full gap-2"
                size="lg"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Force Global Update
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Confirm Global Update
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>
                    You are about to force an update for <strong>all users</strong> of the app.
                  </p>
                  <p className="text-sm">
                    Message: "{updateMessage}"
                  </p>
                  <p className="font-semibold text-foreground">
                    Do you want to continue?
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleForceUpdate}
                  className="bg-primary hover:bg-primary/90"
                >
                  Yes, Force Update
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* System Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Details about the current system configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Environment:</span>
              <span className="font-semibold">
                {import.meta.env.DEV ? 'Development' : 'Production'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Mode:</span>
              <span className="font-semibold">{import.meta.env.MODE}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">PWA:</span>
              <span className="font-semibold">
                {'serviceWorker' in navigator ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
