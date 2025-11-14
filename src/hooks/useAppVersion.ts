import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface AppVersionInfo {
  version: string;
  build: number;
  last_updated: string;
  force_update: boolean;
  update_message: string;
}

const STORAGE_KEY = 'app_version_acknowledged';
const CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

export function useAppVersion() {
  const [versionInfo, setVersionInfo] = useState<AppVersionInfo | null>(null);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkVersion = async () => {
    try {
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

    try {
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Unregister service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }

      // Mark version as acknowledged
      const currentVersion = `${versionInfo.version}-${versionInfo.build}`;
      localStorage.setItem(STORAGE_KEY, currentVersion);

      // Acknowledge update in backend
      await supabase.rpc('acknowledge_app_update');

      // Force reload
      window.location.reload();
    } catch (error) {
      logger.error('Error during app update:', error);
      // Even if there's an error, reload anyway
      window.location.reload();
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
    // Check version on mount
    checkVersion();

    // Set up periodic version check
    const interval = setInterval(checkVersion, CHECK_INTERVAL);

    return () => clearInterval(interval);
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
