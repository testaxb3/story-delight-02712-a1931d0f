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
const CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

const SESSION_START_KEY = 'app_session_start';
const MIN_SESSION_TIME = 30000; // 30 seconds before showing update
const PWA_INSTALL_TIMESTAMP_KEY = 'pwa_install_timestamp';
const RECENT_INSTALL_PROTECTION = 5 * 60 * 1000; // 5 minutes protection after install

export function useAppVersion() {
  const [versionInfo, setVersionInfo] = useState<AppVersionInfo | null>(null);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [checking, setChecking] = useState(false);
  const [swUpdateAvailable, setSwUpdateAvailable] = useState(false);

  // Listen for Service Worker update events - only set flag, don't show prompt
  // Database force_update is the single source of truth for showing prompts
  useEffect(() => {
    const handleSwUpdate = () => {
      logger.log('🔄 Service Worker detected new version available (flag set, not showing prompt)');
      setSwUpdateAvailable(true);
      // NOT showing prompt here - let checkVersion() decide based on database
    };

    window.addEventListener('sw-update-available', handleSwUpdate);
    return () => window.removeEventListener('sw-update-available', handleSwUpdate);
  }, []);

  const checkVersion = async (): Promise<boolean> => {
    try {
      // Protection for recent PWA installations (5 minutes)
      const installTimestamp = localStorage.getItem(PWA_INSTALL_TIMESTAMP_KEY);
      if (installTimestamp) {
        const elapsed = Date.now() - parseInt(installTimestamp, 10);
        if (elapsed < RECENT_INSTALL_PROTECTION) {
          logger.log('⏭️ Skipping update check - PWA recently installed');
          return false;
        }
      }

      // Skip if just updated (iOS flag)
      if (sessionStorage.getItem('pwa_just_updated') === 'true') {
        sessionStorage.removeItem('pwa_just_updated');
        logger.log('⏭️ Skipping version check - app just updated');
        return false;
      }

      // Skip on specific pages
      const currentPath = window.location.pathname;
      const excludedPaths = ['/auth', '/quiz', '/onboarding'];

      if (excludedPaths.some(path => currentPath.startsWith(path))) {
        return false;
      }

      // Check minimum session time
      const sessionStart = localStorage.getItem(SESSION_START_KEY);
      if (sessionStart) {
        const elapsed = Date.now() - parseInt(sessionStart, 10);
        if (elapsed < MIN_SESSION_TIME) {
          return false;
        }
      }

      setChecking(true);
      const { data, error } = await supabase.rpc('get_app_version');

      if (error) {
        logger.error('Failed to check app version:', error);
        return false;
      }

      if (!data) {
        return false;
      }

      const versionData = data as AppVersionInfo;
      setVersionInfo(versionData);

      const backendVersion = `${versionData.version}-${versionData.build}`;
      
      // Database force_update is the SINGLE SOURCE OF TRUTH
      // Only show update prompt if force_update is true AND user hasn't acknowledged
      if (versionData.force_update) {
        const acknowledgedVersion = localStorage.getItem(STORAGE_KEY);
        
        if (acknowledgedVersion !== backendVersion) {
          logger.log(`✅ Update available (force_update=true): ${backendVersion}`);
          setShowUpdatePrompt(true);
          return true;
        } else {
          logger.log(`⏭️ Update already acknowledged: ${backendVersion}`);
        }
      } else {
        logger.log(`⏭️ No forced update (force_update=false)`);
      }
      return false;
    } catch (error) {
      logger.error('Error checking app version:', error);
      return false;
    } finally {
      setChecking(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setChecking(true);

      // Mark as acknowledged if we have version info from database
      if (versionInfo) {
        const currentVersion = `${versionInfo.version}-${versionInfo.build}`;
        localStorage.setItem(STORAGE_KEY, currentVersion);
        await supabase.rpc('acknowledge_app_update');
      }

      // Clear update flags
      localStorage.removeItem(UPDATE_ATTEMPT_KEY);
      setSwUpdateAvailable(false);

      // Log platform info for debugging
      const platform = getPlatformInfo();
      logger.log('🔄 Performing update:', {
        source: swUpdateAvailable ? 'Service Worker' : 'Database',
        browser: platform.browserName,
        isIOS: platform.isIOS,
      });

      toast.success('Updating app...', {
        description: 'The app will reload in a moment.',
        duration: 2000,
      });

      // Wait for toast, then update
      setTimeout(async () => {
        try {
          await performPlatformUpdate();
        } catch (error) {
          logger.error('Error during platform update:', error);
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

  // Force app refresh - always executes regardless of version state
  const forceAppRefresh = async () => {
    try {
      setChecking(true);
      
      // Clear all version-related storage to ensure fresh state
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SESSION_START_KEY);
      localStorage.removeItem(UPDATE_ATTEMPT_KEY);
      
      // Log platform info
      const platform = getPlatformInfo();
      logger.log('🔄 Forcing app refresh:', {
        browser: platform.browserName,
        isIOS: platform.isIOS,
        requiresHardReload: platform.requiresHardReload,
      });

      toast.info('Refreshing app...', { duration: 1500 });

      // Wait for toast to show, then perform platform-specific update
      setTimeout(async () => {
        try {
          await performPlatformUpdate();
        } catch (error) {
          logger.error('Error during forced refresh:', error);
          // Fallback: hard reload
          window.location.reload();
        }
      }, 1000);

    } catch (error) {
      logger.error('Error during force refresh:', error);
      toast.error('Refresh failed', {
        description: 'Please try refreshing the page manually.',
      });
      setChecking(false);
    }
  };

  useEffect(() => {
    // Log platform info on mount for debugging
    logPlatformInfo();

    // Set PWA install timestamp on first standalone launch
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;
    
    if (isStandalone && !localStorage.getItem(PWA_INSTALL_TIMESTAMP_KEY)) {
      localStorage.setItem(PWA_INSTALL_TIMESTAMP_KEY, String(Date.now()));
      logger.log('📱 PWA install timestamp set - 5 minute protection active');
    }

    // Register session start if not exists
    if (!localStorage.getItem(SESSION_START_KEY)) {
      localStorage.setItem(SESSION_START_KEY, String(Date.now()));
    }

    // Initial delay (30 seconds)
    const initialDelay = setTimeout(() => {
      checkVersion();
    }, 30 * 1000);

    // Periodic version check (every 5 minutes)
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
    forceAppRefresh,
  };
}
