import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];

interface SOSDetectionOptions {
  searchQuery?: string;
  crisisMode?: boolean;
  enabled?: boolean;
}

interface SOSDetectionResult {
  isSOS: boolean;
  sosScript: ScriptRow | null;
  reason: string | null;
  dismissSOS: () => void;
}

/**
 * Hook to detect if user is in SOS/emergency mode and suggest best script
 */
export function useSOSDetection(options: SOSDetectionOptions = {}): SOSDetectionResult {
  const { searchQuery = '', crisisMode = false, enabled = true } = options;
  const { user } = useAuth();
  const [result, setResult] = useState<SOSDetectionResult>({
    isSOS: false,
    sosScript: null,
    reason: null,
  });
  const [manuallyDismissed, setManuallyDismissed] = useState(false);

  useEffect(() => {
    if (!enabled || !user?.id) {
      return;
    }

    const detectSOS = async () => {
      // Don't auto-trigger if user manually dismissed (unless explicit crisis mode)
      if (manuallyDismissed && !crisisMode) {
        return;
      }
      // Check 1: Explicit crisis mode from navigation
      if (crisisMode) {
        await loadBestSOSScript('crisis_mode_navigation');
        return;
      }

      // Check 2: Search query contains emergency keywords
      const emergencyKeywords = [
        'emergency',
        'help',
        'crisis',
        'sos',
        'desperate',
        'screaming',
        'hitting',
        'meltdown',
        'out of control',
        'violent',
        'major tantrum',
        'public meltdown',
        'explosive',
        'can\'t take it',
      ];

      const lowerQuery = searchQuery.toLowerCase();
      const hasEmergencyKeyword = emergencyKeywords.some((keyword) =>
        lowerQuery.includes(keyword),
      );

      if (hasEmergencyKeyword) {
        await loadBestSOSScript('emergency_keyword_search', searchQuery);
        return;
      }

      // Check 3: Rapid activity pattern (opened app multiple times in short period)
      // This checks if user has used scripts 3+ times in last 10 minutes = panic pattern
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

      const { data: recentUsage } = await supabase
        .from('script_usage')
        .select('used_at, script_id')
        .eq('user_id', user.id)
        .gte('used_at', tenMinutesAgo)
        .order('used_at', { ascending: false });

      if (recentUsage && recentUsage.length >= 3) {
        // User tried 3+ scripts in 10min = things aren't working = panic
        await loadBestSOSScript('panic_pattern_detected');
        return;
      }

      // Check 4: Last script marked as "not_yet" (didn't work)
      const { data: lastFeedback } = await supabase
        .from('script_feedback')
        .select('outcome, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (lastFeedback && lastFeedback.outcome === 'not_yet') {
        const feedbackTime = new Date(lastFeedback.created_at).getTime();
        const now = Date.now();
        const minutesAgo = (now - feedbackTime) / 1000 / 60;

        // If last script failed within 5 minutes
        if (minutesAgo < 5) {
          await loadBestSOSScript('last_script_failed');
          return;
        }
      }

      // Check 5: Rush hours + search activity (only if actively searching)
      // REMOVED: Too aggressive - was triggering on every page load
      // Can be re-enabled later with better heuristics

      // No SOS triggers detected
      setResult({
        isSOS: false,
        sosScript: null,
        reason: null,
      });
    };

    detectSOS();
  }, [enabled, user?.id, crisisMode, searchQuery, manuallyDismissed]);

  /**
   * Dismiss SOS mode manually
   */
  const dismissSOS = () => {
    setResult({
      isSOS: false,
      sosScript: null,
      reason: null,
    });
    setManuallyDismissed(true);
  };

  /**
   * Load the best SOS script based on context
   */
  const loadBestSOSScript = async (reason: string, situation?: string) => {
    try {
      // Get current location (could be enhanced with actual geolocation)
      const location = 'home'; // Default

      // Call database function to get best SOS script
      const { data, error } = await supabase.rpc('get_sos_script', {
        p_user_id: user!.id,
        p_child_id: null, // Could pass active child if available
        p_situation: situation || null,
        p_location: location,
      });

      if (error) {
        console.error('Error fetching SOS script:', error);
        return;
      }

      if (data && data.length > 0) {
        const sosScriptId = data[0].script_id;

        // Fetch full script details
        const { data: scriptData } = await supabase
          .from('scripts')
          .select('*')
          .eq('id', sosScriptId)
          .single();

        if (scriptData) {
          setResult({
            isSOS: true,
            sosScript: scriptData as ScriptRow,
            reason,
          });
          return;
        }
      }

      // Fallback: Get any emergency-suitable script
      const { data: fallbackScript } = await supabase
        .from('scripts')
        .select('*')
        .eq('emergency_suitable', true)
        .limit(1)
        .single();

      if (fallbackScript) {
        setResult({
          isSOS: true,
          sosScript: fallbackScript as ScriptRow,
          reason,
        });
      }
    } catch (error) {
      console.error('Error in loadBestSOSScript:', error);
    }
  };

  return {
    ...result,
    dismissSOS,
  };
}
