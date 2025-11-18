import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';
import { performPlatformUpdate, getPlatformInfo, logPlatformInfo } from '@/utils/platform';
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
const CHECK_INTERVAL = 5 * 60 * 1000; // ✅ Check every 5 minutes (optimized for faster updates)

const SESSION_START_KEY = 'app_session_start';
const MIN_SESSION_TIME = 30000; // ✅ 30 seconds before showing update (optimized)

export function useAppVersion() {
  const [versionInfo, setVersionInfo] = useState<AppVersionInfo | null>(null);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkVersion = async () => {
    try {
      // Não mostrar update se acabou de atualizar (iOS flag)
      if (sessionStorage.getItem('pwa_just_updated') === 'true') {
        sessionStorage.removeItem('pwa_just_updated');
        logger.log('⏭️ Skipping version check - app just updated');
        return;
      }

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

      // Log platform info for debugging
      const platform = getPlatformInfo();
      logger.log('🔄 Performing update for platform:', {
        browser: platform.browserName,
        isIOS: platform.isIOS,
        requiresHardReload: platform.requiresHardReload,
      });

      // Show appropriate toast message
      const updateMethod = platform.requiresHardReload ? 'hard reload' : 'Service Worker';
      toast.success('Updating app...', {
        description: `Using ${updateMethod}. The app will reload in a moment.`,
        duration: 2000,
      });

      // Wait a bit for toast to show, then perform platform-specific update
      setTimeout(async () => {
        try {
          await performPlatformUpdate();
        } catch (error) {
          logger.error('Error during platform update:', error);
          // Fallback: simple reload
          window.location.reload();
        }
      }, 1500);

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
    // Log platform info on mount for debugging
    logPlatformInfo();

    // Registrar início da sessão se não existir
    if (!localStorage.getItem(SESSION_START_KEY)) {
      localStorage.setItem(SESSION_START_KEY, String(Date.now()));
    }

    // ✅ Delay inicial reduzido (30 segundos em vez de 2 minutos)
    const initialDelay = setTimeout(() => {
      checkVersion();
    }, 30 * 1000);

    // ✅ Set up periodic version check (a cada 5 minutos em vez de 15)
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
