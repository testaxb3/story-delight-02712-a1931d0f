import { RefreshCw, X } from 'lucide-react';
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

export function UpdatePrompt() {
  const { user } = useAuth();
  const { versionInfo, showUpdatePrompt, handleUpdate, dismissUpdate } = useAppVersion();

  // Don't show update prompt for unauthenticated users (e.g., on login page)
  if (!user || !showUpdatePrompt || !versionInfo) return null;

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
        </div>

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
