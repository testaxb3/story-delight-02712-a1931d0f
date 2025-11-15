import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

interface AppVersionInfo {
  version: string;
  build: number;
  last_updated: string;
  force_update: boolean;
  update_message: string;
}

const STORAGE_KEY = 'app_version_acknowledged';
const UPDATE_ATTEMPT_KEY = 'app_update_attempt_count';
const MAX_UPDATE_ATTEMPTS = 3;
const CHECK_INTERVAL = 15 * 60 * 1000; // Check every 15 minutes (reduced from 5)

const SESSION_START_KEY = 'app_session_start';
const MIN_SESSION_TIME = 60000; // 1 minuto antes de mostrar update

export function useAppVersion() {
  const [versionInfo, setVersionInfo] = useState<AppVersionInfo | null>(null);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkVersion = async () => {
    try {
      // Não mostrar update em páginas específicas
      const currentPath = window.location.pathname;
      const excludedPaths = ['/auth', '/quiz', '/onboarding'];
      
      if (excludedPaths.some(path => currentPath.startsWith(path))) {
        return;
      }

      // Verificar se já passou tempo mínimo desde o início da sessão
      const sessionStart = localStorage.getItem(SESSION_START_KEY);
      if (sessionStart) {
        const elapsed = Date.now() - parseInt(sessionStart, 10);
        if (elapsed < MIN_SESSION_TIME) {
          return; // Muito cedo para mostrar update
        }
      }

      setChecking(true);
      const { data, error } = await supabase.rpc('get_app_version');

      if (error) {
        logger.error('Failed to check app version:', error);
        return;
      }

      if (!data) {
        return;
      }

      const versionData = data as AppVersionInfo;
      setVersionInfo(versionData);

      // Check if we need to show update prompt
      const acknowledgedVersion = localStorage.getItem(STORAGE_KEY);
      const currentVersion = `${versionData.version}-${versionData.build}`;

      if (versionData.force_update && acknowledgedVersion !== currentVersion) {
        setShowUpdatePrompt(true);
      }
    } catch (error) {
      logger.error('Error checking app version:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleUpdate = async () => {
    if (!versionInfo) return;

    // Check for infinite loop protection
    const attemptCount = parseInt(localStorage.getItem(UPDATE_ATTEMPT_KEY) || '0', 10);

    if (attemptCount >= MAX_UPDATE_ATTEMPTS) {
      logger.error('Max update attempts reached. Preventing infinite loop.');
      toast.error('Update failed after multiple attempts', {
        description: 'Please clear your browser cache manually or contact support.',
        duration: 10000,
      });
      // Clear the attempt counter after showing error
      localStorage.removeItem(UPDATE_ATTEMPT_KEY);
      return;
    }

    // Increment attempt counter
    localStorage.setItem(UPDATE_ATTEMPT_KEY, String(attemptCount + 1));

    try {
      // Show initial progress
      const toastId = toast.loading('Preparing update...', {
        description: 'Please wait while we update the app',
      });

      // Mark version as acknowledged FIRST (before any cache operations)
      const currentVersion = `${versionInfo.version}-${versionInfo.build}`;
      localStorage.setItem(STORAGE_KEY, currentVersion);

      // Acknowledge update in backend
      toast.loading('Saving update status...', {
        id: toastId,
        description: 'Recording your update',
      });

      await supabase.rpc('acknowledge_app_update');

      // Clear attempt counter on success
      localStorage.removeItem(UPDATE_ATTEMPT_KEY);

      // Show success message
      toast.success('Update ready!', {
        id: toastId,
        description: 'Reloading application...',
        duration: 1500,
      });

      // Force a hard reload to bypass all caches
      // This is safer than manually clearing caches in PWA context
      setTimeout(() => {
        // Use location.href assignment for hard reload that works in PWA
        window.location.href = window.location.href;
      }, 1500);

    } catch (error) {
      logger.error('Error during app update:', error);

      // Check if we've exceeded max attempts
      const newAttemptCount = parseInt(localStorage.getItem(UPDATE_ATTEMPT_KEY) || '0', 10);

      if (newAttemptCount >= MAX_UPDATE_ATTEMPTS) {
        toast.error('Update failed', {
          description: 'Max retry attempts reached. Please refresh manually.',
          duration: 10000,
        });
        localStorage.removeItem(UPDATE_ATTEMPT_KEY);
        return; // Don't reload if max attempts reached
      }

      // Show error but don't reload automatically
      toast.error('Update failed', {
        description: 'Please try again or refresh the page manually.',
        duration: 5000,
      });

      // Don't reload on error - let user retry manually
      return;
    }
  };

  const dismissUpdate = () => {
    if (!versionInfo) return;

    // Mark as acknowledged so we don't show again this session
    const currentVersion = `${versionInfo.version}-${versionInfo.build}`;
    localStorage.setItem(STORAGE_KEY, currentVersion);
    setShowUpdatePrompt(false);
  };

  useEffect(() => {
    // Registrar início da sessão se não existir
    if (!localStorage.getItem(SESSION_START_KEY)) {
      localStorage.setItem(SESSION_START_KEY, String(Date.now()));
    }

    // Delay inicial antes da primeira verificação (2 minutos)
    const initialDelay = setTimeout(() => {
      checkVersion();
    }, 2 * 60 * 1000);

    // Set up periodic version check (a cada 15 minutos)
    const interval = setInterval(checkVersion, CHECK_INTERVAL);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  return {
    versionInfo,
    showUpdatePrompt,
    checking,
    handleUpdate,
    dismissUpdate,
    checkVersion,
  };
}
