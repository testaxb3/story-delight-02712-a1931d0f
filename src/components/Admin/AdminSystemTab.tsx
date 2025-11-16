import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw, Loader2, AlertTriangle, CheckCircle2, Settings, Users, TrendingUp } from 'lucide-react';
import { useConfirm } from '@/hooks/useConfirm';
import { useAdminRateLimit } from '@/hooks/useAdminRateLimit';

interface UpdateStats {
  current_version: string;
  current_build: number;
  force_update_enabled: boolean;
  total_users: number;
  updated_users: number;
  pending_users: number;
  update_percentage: number;
  last_updated: string;
}

export function AdminSystemTab() {
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('New update available! Please update the app.');
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const [stats, setStats] = useState<UpdateStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Confirmation and rate limiting
  const { confirm, ConfirmDialogComponent } = useConfirm();
  const updateRateLimit = useAdminRateLimit(5, 60000, 'force updates');

  const MIN_UPDATE_INTERVAL = 60000; // 1 minute
  const remainingCooldown = Math.max(0, MIN_UPDATE_INTERVAL - (Date.now() - lastUpdateTime));
  const canUpdate = remainingCooldown === 0;

  // Load update statistics
  const loadStatistics = async () => {
    setLoadingStats(true);
    try {
      const { data, error } = await supabase.rpc('get_update_statistics');

      if (error) throw error;

      setStats(data);
    } catch (error: any) {
      console.error('Error loading statistics:', error);
      // Don't show error toast for stats, just log it
    } finally {
      setLoadingStats(false);
    }
  };

  // Load stats on mount and after updates
  useEffect(() => {
    loadStatistics();
  }, []);

  // Sanitize message to prevent XSS
  const sanitizeMessage = (message: string): string => {
    return message
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>'"]/g, '') // Remove dangerous characters
      .trim();
  };

  const handleForceUpdate = async () => {
    // Validate message is not empty
    if (!updateMessage.trim()) {
      toast.error('Update message cannot be empty', {
        description: 'Please enter a message for users',
        icon: <AlertTriangle className="w-5 h-5" />,
      });
      return;
    }

    // Check rate limiting
    if (!canUpdate) {
      const secondsLeft = Math.ceil(remainingCooldown / 1000);
      toast.error('Please wait before forcing another update', {
        description: `You can update again in ${secondsLeft} seconds`,
        icon: <AlertTriangle className="w-5 h-5" />,
      });
      return;
    }

    setUpdating(true);

    try {
      // Sanitize message before sending
      const sanitizedMessage = sanitizeMessage(updateMessage);

      const { data, error } = await supabase.rpc('force_app_update', {
        update_message: sanitizedMessage
      });

      if (error) {
        throw error;
      }

      // Update last update time
      setLastUpdateTime(Date.now());

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

      // Reload statistics after successful update
      setTimeout(() => loadStatistics(), 1000);
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

      {/* Update Statistics Card */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Update Adoption Statistics
            </CardTitle>
            <CardDescription>
              Real-time metrics of users who have updated to the latest version
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Total Users
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.total_users}
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-900 dark:text-green-100">
                    Updated
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.updated_users}
                </p>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                    Pending
                  </span>
                </div>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.pending_users}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Update Progress</span>
                <span className="font-semibold">{stats.update_percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-500"
                  style={{ width: `${stats.update_percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Current Version: {stats.current_version}</span>
                <span>Build #{stats.current_build}</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={loadStatistics}
              disabled={loadingStats}
              className="w-full mt-4"
            >
              {loadingStats ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Statistics
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

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

          {!canUpdate && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm">
              <p className="text-blue-800 dark:text-blue-200">
                ⏱️ Rate limit cooldown: {Math.ceil(remainingCooldown / 1000)} seconds remaining
              </p>
            </div>
          )}

          <Button
            className="w-full gap-2"
            size="lg"
            onClick={handleForceUpdate}
            disabled={updating || !canUpdate}
          >
            {updating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : !canUpdate ? (
              <>
                <AlertTriangle className="w-4 h-4" />
                Cooldown Active ({Math.ceil(remainingCooldown / 1000)}s)
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Force Global Update
              </>
            )}
          </Button>
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
      
      {/* Confirmation Dialog */}
      {ConfirmDialogComponent}
    </div>
  );
}
