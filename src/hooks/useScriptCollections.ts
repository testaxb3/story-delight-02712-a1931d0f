import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { toast } from '@/components/ui/use-toast';
import { t } from '@/hooks/useTranslation';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];

export interface ScriptCollection {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  childProfileId: string | null;
  scriptIds: string[];
}

interface UseScriptCollectionsResult {
  collections: ScriptCollection[];
  scopedCollections: ScriptCollection[];
  loading: boolean;
  createCollection: (name: string, scopeToChild?: boolean) => Promise<ScriptCollection | null>;
  addScriptToCollection: (collectionId: string, scriptId: string) => Promise<void>;
  removeScriptFromCollection: (collectionId: string, scriptId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

// NOTE: Since 'script_collections' table does not exist, this hook will simulate collections
// based on the 'scripts' table and the 'user_favorites' table.
// This is a temporary solution until a proper 'script_collections' table is implemented.

function mapScriptToCollection(script: ScriptRow): ScriptCollection {
  return {
    id: script.id,
    name: script.title || 'Untitled Script',
    createdAt: script.created_at || new Date().toISOString(),
    updatedAt: script.created_at || new Date().toISOString(),
    childProfileId: null, // No direct childProfileId for individual scripts
    scriptIds: [script.id],
  };
}

export function useScriptCollections(): UseScriptCollectionsResult {
  const { user } = useAuth();
  const { activeChild } = useChildProfiles();
  const [collections, setCollections] = useState<ScriptCollection[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCollections = useCallback(async () => {
    if (!user?.profileId) {
      setCollections([]);
      return;
    }

    setLoading(true);
    try {
      // Fetch all scripts that are favorited by the user
      const { data: favoriteScriptsData, error: favoriteScriptsError } = await supabase
        .from('user_favorites')
        .select('script_id')
        .eq('user_id', user.profileId);

      if (favoriteScriptsError) {
        console.error('Failed to load favorite script IDs', favoriteScriptsError);
        toast({
          title: t().recommendations.errors.loadFavoritesFailed,
          description: favoriteScriptsError.message,
          variant: 'destructive',
        });
        setCollections([]);
        return;
      }

      const favoriteScriptIds = favoriteScriptsData?.map(item => item.script_id) || [];

      // Fetch the actual script details for the favorited scripts
      const { data: scriptsData, error: scriptsError } = await supabase
        .from('scripts')
        .select('*')
        .in('id', favoriteScriptIds);

      if (scriptsError) {
        console.error('Failed to load favorite scripts', scriptsError);
        toast({
          title: t().recommendations.errors.loadFavoriteScriptsFailed,
          description: scriptsError.message,
          variant: 'destructive',
        });
        setCollections([]);
        return;
      }

      // For now, each favorited script is treated as its own collection
      // This can be expanded later to support actual user-defined collections
      const mappedCollections = (scriptsData || []).map(mapScriptToCollection);
      setCollections(mappedCollections);

    } catch (error) {
      console.error('Failed to load script collections', error);
      toast({
        title: t().recommendations.errors.loadCollectionsFailed,
        description: (error as Error).message,
        variant: 'destructive',
      });
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }, [user?.profileId]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const scopedCollections = useMemo(() => {
    if (!activeChild) return collections.filter((collection) => !collection.childProfileId);
    return collections.filter(
      (collection) => !collection.childProfileId || collection.childProfileId === activeChild.id,
    );
  }, [collections, activeChild]);

  const createCollection = useCallback<UseScriptCollectionsResult['createCollection']>(async (name, scopeToChild = true) => {
    // Since there's no 'script_collections' table, we'll simulate creation by adding to favorites
    // This function needs to be re-evaluated if actual collection creation is desired.
    toast({
      title: 'Funcionalidade de criação de coleção temporariamente indisponível',
      description: 'A criação de coleções customizadas não está disponível no momento. Scripts são salvos como favoritos.',
      variant: 'default',
    });
    return null;
  }, []);

  const addScriptToCollection = useCallback<UseScriptCollectionsResult['addScriptToCollection']>(async (collectionId, scriptId) => {
    if (!user?.profileId) {
      toast({
        title: 'Please log in again',
        description: t().auth.errors.accountNotFound,
        variant: 'destructive',
      });
      return;
    }

    // In this simulated setup, collectionId is effectively the scriptId for a favorited script
    // So, we just add to user_favorites
    const { error } = await supabase
      .from('user_favorites')
      .insert({ user_id: user.profileId, script_id: scriptId });

    if (error) {
      console.error('Failed to add script to favorites', error);
      toast({
        title: t().scripts.errors.addFavoriteFailed,
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setCollections((prev) => {
      const existingCollection = prev.find(col => col.id === scriptId);
      if (existingCollection) {
        return prev.map(col => col.id === scriptId ? { ...col, scriptIds: [...new Set([...col.scriptIds, scriptId])] } : col);
      } else {
        // If it's a new favorite, fetch the script details to create a new 'collection'
        // This is a simplified approach, a full implementation would fetch the script and map it
        return [...prev, { id: scriptId, name: 'Favorito', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), childProfileId: null, scriptIds: [scriptId] }];
      }
    });
    toast({ title: 'Script salvo', description: 'O script foi adicionado aos seus favoritos.' });
    fetchCollections(); // Refresh to get accurate data
  }, [user?.profileId, fetchCollections]);

  const removeScriptFromCollection = useCallback<UseScriptCollectionsResult['removeScriptFromCollection']>(async (collectionId, scriptId) => {
    if (!user?.profileId) {
      toast({
        title: 'Please log in again',
        description: t().auth.errors.accountNotFound,
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', user.profileId)
      .eq('script_id', scriptId);

    if (error) {
      console.error('Failed to remove script from favorites', error);
      toast({
        title: t().scripts.errors.removeFavoriteFailed,
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setCollections((prev) => prev.filter(col => col.id !== scriptId));
    toast({ title: 'Removido dos favoritos' });
    fetchCollections(); // Refresh to get accurate data
  }, [user?.profileId, fetchCollections]);

  return {
    collections,
    scopedCollections,
    loading,
    createCollection,
    addScriptToCollection,
    removeScriptFromCollection,
    refresh: fetchCollections,
  };
}

