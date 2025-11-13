import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface ChildProfile {
  id: string;
  name: string;
  brain_profile: 'INTENSE' | 'DISTRACTED' | 'DEFIANT';
  created_at?: string | null;
  photo_url?: string | null;
  age?: number | null;
}

interface ChildProfilesContextValue {
  childProfiles: ChildProfile[];
  activeChild: ChildProfile | null;
  loading: boolean;
  onboardingRequired: boolean;
  refreshChildren: () => Promise<void>;
  setActiveChild: (childId: string) => void;
}

const ChildProfilesContext = createContext<ChildProfilesContextValue | undefined>(undefined);

function getStorageKey(userId: string) {
  return `active_child_${userId}`;
}

export function ChildProfilesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [childProfiles, setChildProfiles] = useState<ChildProfile[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStoredActiveChild = (userId: string) => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(getStorageKey(userId));
    } catch (error) {
      console.warn('Unable to read active child from storage', error);
      return null;
    }
  };

  const persistActiveChild = (userId: string, childId: string | null) => {
    if (typeof window === 'undefined') return;
    try {
      if (childId) {
        window.localStorage.setItem(getStorageKey(userId), childId);
      } else {
        window.localStorage.removeItem(getStorageKey(userId));
      }
    } catch (error) {
      console.warn('Unable to persist active child selection', error);
    }
  };

  const refreshChildren = async () => {
    if (!user?.profileId) {
      setChildProfiles([]);
      setActiveChildId(null);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('child_profiles')
        .select('id, name, brain_profile, created_at')
        .eq('parent_id', user.profileId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Failed to load child profiles', error);
        setChildProfiles([]);
        return;
      }

      const formatted = (data || []).map((child) => ({
        id: child.id,
        name: child.name,
        brain_profile: child.brain_profile as ChildProfile['brain_profile'],
        created_at: child.created_at,
      }));

      setChildProfiles(formatted);

      // Only auto-select if we have profiles and user ID
      if (user?.id && formatted.length > 0) {
        const storedId = loadStoredActiveChild(user.id);
        if (storedId && formatted.some((child) => child.id === storedId)) {
          setActiveChildId(storedId);
        } else {
          const fallbackId = formatted[0].id;
          setActiveChildId(fallbackId);
          persistActiveChild(user.id, fallbackId);
        }
      } else {
        setActiveChildId(null);
        if (user?.id) {
          persistActiveChild(user.id, null);
        }
      }
    } catch (error) {
      console.error('Unexpected error loading child profiles', error);
      setChildProfiles([]);
      setActiveChildId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setChildProfiles([]);
      setActiveChildId(null);
      return;
    }

    const stored = loadStoredActiveChild(user.id);
    if (stored) {
      setActiveChildId(stored);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshChildren();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.profileId]);

  const setActiveChild = (childId: string) => {
    if (!user?.id) return;
    setActiveChildId(childId);
    persistActiveChild(user.id, childId);
  };

  const activeChild = useMemo(() => {
    if (!activeChildId) return null;
    return childProfiles.find((child) => child.id === activeChildId) || null;
  }, [activeChildId, childProfiles]);

  const onboardingRequired = !!user && !loading && childProfiles.length === 0;

  return (
    <ChildProfilesContext.Provider
      value={{
        childProfiles,
        activeChild,
        loading,
        onboardingRequired,
        refreshChildren,
        setActiveChild,
      }}
    >
      {children}
    </ChildProfilesContext.Provider>
  );
}

export function useChildProfiles() {
  const context = useContext(ChildProfilesContext);
  if (!context) {
    throw new Error('useChildProfiles must be used within a ChildProfilesProvider');
  }
  return context;
}

