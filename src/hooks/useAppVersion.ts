import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';
// Version is now managed entirely in the database

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

      const backendVersion = `${versionData.version}-${versionData.build}`;
      
      // Only show update prompt if ALL conditions are met:
      // 1. Backend has force_update enabled
      // 2. User hasn't acknowledged this version yet
      if (versionData.force_update) {
        const acknowledgedVersion = localStorage.getItem(STORAGE_KEY);
        
        // Check if user hasn't acknowledged this specific version yet
        if (acknowledgedVersion !== backendVersion) {
          logger.log(`Update available: ${backendVersion}`);
          setShowUpdatePrompt(true);
        } else {
          logger.log(`Update already acknowledged: ${backendVersion}`);
        }
      }
    } catch (error) {
      logger.error('Error checking app version:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleUpdate = async () => {
    if (!versionInfo) return;

    try {
      setChecking(true);

      // Mark as acknowledged
      const currentVersion = `${versionInfo.version}-${versionInfo.build}`;
      localStorage.setItem(STORAGE_KEY, currentVersion);

      // Save to database
      await supabase.rpc('acknowledge_app_update');

      // Remove the update attempt counter
      localStorage.removeItem(UPDATE_ATTEMPT_KEY);

      toast.success('Updating app...', {
        description: 'The app will reload in a moment.',
        duration: 1500,
      });

      // Use the proper PWA update mechanism
      const updateSW = (window as any).__updateSW;
      
      if (updateSW) {
        // This will trigger the service worker update and reload
        await updateSW(true);
      } else {
        // Fallback: traditional reload after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }

    } catch (error) {
      logger.error('Error during update:', error);
      toast.error('Update failed', {
        description: 'Please try refreshing the page manually.',
      });
      setChecking(false);
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
