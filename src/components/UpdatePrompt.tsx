import { RefreshCw, X, Smartphone, Monitor, Info } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppVersion } from '@/hooks/useAppVersion';
import { useAuth } from '@/contexts/AuthContext';
import { getPlatformInfo } from '@/utils/platform';

export function UpdatePrompt() {
  const { user } = useAuth();
  const location = useLocation();
  const { versionInfo, showUpdatePrompt, handleUpdate, dismissUpdate } = useAppVersion();

  // Get platform information
  const platform = getPlatformInfo();

  // Don't show update prompt in specific routes or for unauthenticated users
  const excludedRoutes = ['/auth', '/quiz', '/onboarding'];
  const isExcludedRoute = excludedRoutes.some(route => location.pathname.startsWith(route));

  if (!user || !showUpdatePrompt || !versionInfo || isExcludedRoute) return null;

  return (
    <Dialog open={showUpdatePrompt} onOpenChange={(open) => !open && dismissUpdate()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            New Update Available
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {versionInfo.update_message || 'A new version of the app is available with improvements and fixes.'}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Version:</span>
            <span className="font-semibold">{versionInfo.version}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Build:</span>
            <span className="font-semibold">#{versionInfo.build}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Platform:</span>
            <span className="font-semibold flex items-center gap-1">
              {platform.isIOS ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
              {platform.browserName}
            </span>
          </div>
        </div>

        {/* iOS specific message */}
        {platform.isIOS && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 space-y-1">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800 dark:text-blue-200">
                <p className="font-semibold mb-1">iOS Update Process</p>
                <p>This update will clear all cached data and reload the app with the latest version.</p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={dismissUpdate}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Later
          </Button>
          <Button
            onClick={handleUpdate}
            className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            <RefreshCw className="w-4 h-4" />
            Update Now
          </Button>
        </DialogFooter>

        <p className="text-xs text-muted-foreground text-center">
          The update will only take a few seconds.
        </p>
      </DialogContent>
    </Dialog>
  );
}
