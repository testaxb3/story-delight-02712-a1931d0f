import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useAdminStatus() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      if (!user) {
        if (isMounted) {
          setIsAdmin(false);
          setChecking(false);
        }
        return;
      }

      setChecking(true);

      const { data, error } = await supabase.rpc('is_admin');
      if (!isMounted) return;

      if (error) {
        setIsAdmin(false);
      } else {
        setIsAdmin(Boolean(data));
      }
      setChecking(false);
    };

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { isAdmin, checking };
}
