import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface ScriptCollection {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  childProfileId: string | null;
  scriptIds: string[];
}

interface UseScriptCollectionsResult {
  collections: ScriptCollection[];
  scopedCollections: ScriptCollection[];
  loading: boolean;
  createCollection: (name: string, description?: string, scopeToChild?: boolean) => Promise<ScriptCollection | null>;
  addScriptToCollection: (collectionId: string, scriptId: string) => Promise<void>;
  removeScriptFromCollection: (collectionId: string, scriptId: string) => Promise<void>;
  deleteCollection: (collectionId: string) => Promise<void>;
  updateCollection: (collectionId: string, name: string, description?: string) => Promise<void>;
  refresh: () => Promise<void>;
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
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('script_collections')
        .select(`
          id,
          name,
          description,
          created_at,
          updated_at,
          collection_scripts (
            script_id,
            position
          )
        `)
        .eq('user_id', user.profileId)
        .order('created_at', { ascending: false });

      if (collectionsError) {
        console.error('Failed to load collections', collectionsError);
        toast({
          title: 'Failed to load collections',
          description: collectionsError.message,
          variant: 'destructive',
        });
        setCollections([]);
        return;
      }

      const mappedCollections: ScriptCollection[] = (collectionsData || []).map(col => ({
        id: col.id,
        name: col.name,
        description: col.description || undefined,
        createdAt: col.created_at,
        updatedAt: col.updated_at,
        childProfileId: null,
        scriptIds: (col.collection_scripts || [])
          .sort((a: any, b: any) => a.position - b.position)
          .map((cs: any) => cs.script_id),
      }));

      setCollections(mappedCollections);
    } catch (error) {
      console.error('Failed to load script collections', error);
      toast({
        title: 'Failed to load collections',
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

  const createCollection = useCallback(async (
    name: string,
    description?: string,
    scopeToChild = false
  ): Promise<ScriptCollection | null> => {
    if (!user?.profileId) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create collections',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('script_collections')
        .insert({
          user_id: user.profileId,
          name,
          description,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create collection', error);
        toast({
          title: 'Failed to create collection',
          description: error.message,
          variant: 'destructive',
        });
        return null;
      }

      const newCollection: ScriptCollection = {
        id: data.id,
        name: data.name,
        description: data.description || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        childProfileId: null,
        scriptIds: [],
      };

      setCollections(prev => [newCollection, ...prev]);
      
      toast({
        title: 'Collection created',
        description: `"${name}" collection has been created`,
      });

      return newCollection;
    } catch (error) {
      console.error('Failed to create collection', error);
      toast({
        title: 'Failed to create collection',
        description: (error as Error).message,
        variant: 'destructive',
      });
      return null;
    }
  }, [user?.profileId]);

  const addScriptToCollection = useCallback(async (collectionId: string, scriptId: string) => {
    try {
      const { data: existingScripts } = await supabase
        .from('collection_scripts')
        .select('position')
        .eq('collection_id', collectionId)
        .order('position', { ascending: false })
        .limit(1);

      const nextPosition = existingScripts && existingScripts.length > 0 
        ? existingScripts[0].position + 1 
        : 0;

      const { error } = await supabase
        .from('collection_scripts')
        .insert({
          collection_id: collectionId,
          script_id: scriptId,
          position: nextPosition,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Script already in collection',
            variant: 'default',
          });
          return;
        }
        throw error;
      }

      setCollections(prev =>
        prev.map(col =>
          col.id === collectionId
            ? { ...col, scriptIds: [...col.scriptIds, scriptId] }
            : col
        )
      );

      toast({
        title: 'Script added',
        description: 'Script has been added to the collection',
      });
    } catch (error) {
      console.error('Failed to add script to collection', error);
      toast({
        title: 'Failed to add script',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  }, []);

  const removeScriptFromCollection = useCallback(async (collectionId: string, scriptId: string) => {
    try {
      const { error } = await supabase
        .from('collection_scripts')
        .delete()
        .eq('collection_id', collectionId)
        .eq('script_id', scriptId);

      if (error) throw error;

      setCollections(prev =>
        prev.map(col =>
          col.id === collectionId
            ? { ...col, scriptIds: col.scriptIds.filter(id => id !== scriptId) }
            : col
        )
      );

      toast({
        title: 'Script removed',
        description: 'Script has been removed from the collection',
      });
    } catch (error) {
      console.error('Failed to remove script from collection', error);
      toast({
        title: 'Failed to remove script',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  }, []);

  const deleteCollection = useCallback(async (collectionId: string) => {
    try {
      const { error } = await supabase
        .from('script_collections')
        .delete()
        .eq('id', collectionId);

      if (error) throw error;

      setCollections(prev => prev.filter(col => col.id !== collectionId));

      toast({
        title: 'Collection deleted',
        description: 'Collection has been deleted successfully',
      });
    } catch (error) {
      console.error('Failed to delete collection', error);
      toast({
        title: 'Failed to delete collection',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  }, []);

  const updateCollection = useCallback(async (
    collectionId: string,
    name: string,
    description?: string
  ) => {
    try {
      const { error } = await supabase
        .from('script_collections')
        .update({
          name,
          description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', collectionId);

      if (error) throw error;

      setCollections(prev =>
        prev.map(col =>
          col.id === collectionId
            ? { ...col, name, description, updatedAt: new Date().toISOString() }
            : col
        )
      );

      toast({
        title: 'Collection updated',
        description: 'Collection has been updated successfully',
      });
    } catch (error) {
      console.error('Failed to update collection', error);
      toast({
        title: 'Failed to update collection',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  }, []);

  const scopedCollections = collections.filter(col =>
    !col.childProfileId || col.childProfileId === activeChild?.id
  );

  return {
    collections,
    scopedCollections,
    loading,
    createCollection,
    addScriptToCollection,
    removeScriptFromCollection,
    deleteCollection,
    updateCollection,
    refresh: fetchCollections,
  };
}
