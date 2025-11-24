import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import type { BrainProfile } from '@/lib/quizQuestions';

interface SubmissionData {
  childName: string;
  brainProfile: BrainProfile;
  childAge: number;
  parentGoals: string[];
  challengeLevel: number;
  challengeDuration: string;
  triedApproaches: string[];
  resultSpeed: 'slow' | 'balanced' | 'intensive';
}

export function useQuizSubmission() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, refreshUser } = useAuth();
  const { refreshChildren, setActiveChild } = useChildProfiles();
  const queryClient = useQueryClient();

  // Save child profile to database
  const saveChildProfile = useCallback(async (data: SubmissionData) => {
    if (!user) {
      const errorMsg = 'User not authenticated';
      setError(errorMsg);
      toast.error('Você precisa estar logado para salvar o perfil.');
      logger.error(errorMsg);
      return null;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Check for existing profile with same name
      const { data: existingProfile } = await supabase
        .from('child_profiles')
        .select('id, name')
        .eq('name', data.childName)
        .eq('parent_id', user.id)
        .maybeSingle();

      if (existingProfile) {
        const errorMsg = `A profile with the name "${data.childName}" already exists.`;
        setError(errorMsg);
        toast.error(errorMsg);
        logger.warn('Duplicate child profile name', { name: data.childName });
        return null;
      }

      // Insert new profile
      const { data: newProfile, error: insertError } = await supabase
        .from('child_profiles')
        .insert([
          {
            name: data.childName,
            brain_profile: data.brainProfile,
            parent_id: user.id,
            age: data.childAge,
            parent_goals: data.parentGoals,
            challenge_level: data.challengeLevel,
            challenge_duration: data.challengeDuration,
            tried_approaches: data.triedApproaches,
            result_speed: data.resultSpeed,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      if (newProfile) {
        // Refresh data and set active child
        await Promise.all([
          refreshChildren(),
          refreshUser(),
        ]);

        queryClient.invalidateQueries({ queryKey: ['children'] });

        // ✅ Fix: Pass child ID (string) instead of full profile object
        setActiveChild(newProfile.id);

        toast.success(`Profile for ${data.childName} saved successfully!`);
        logger.debug(`Child profile created`, { childId: newProfile.id, name: data.childName });

        return newProfile;
      }

      return null;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to save profile';
      setError(errorMsg);
      toast.error(`Error: ${errorMsg}`);
      logger.error('Error saving child profile', err);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [user, refreshChildren, refreshUser, setActiveChild, queryClient]);

  // Mark quiz as completed
  const markQuizCompleted = useCallback(async () => {
    if (!user?.id) {
      const errorMsg = 'User ID not available';
      setError(errorMsg);
      toast.error('Erro ao salvar conclusão do quiz. Tente fazer login novamente.');
      logger.error(errorMsg);
      return false;
    }

    try {
      logger.debug('Marking quiz as completed', { userId: user.id });

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          quiz_completed: true,
          quiz_in_progress: false 
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // ✅ Set grace period for 10 minutes (increased from 5)
      sessionStorage.setItem('quizJustCompletedAt', Date.now().toString());

      // Refresh user data
      await refreshUser();
      
      // ✅ Additional delay to ensure propagation
      await new Promise(resolve => setTimeout(resolve, 200));
      
      logger.debug('✅ Quiz marked as completed and propagated successfully');
      return true;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to mark quiz as completed';
      setError(errorMsg);
      toast.error(`Erro ao salvar quiz: ${errorMsg}`);
      logger.error('Error marking quiz as completed', err);
      return false;
    }
  }, [user, refreshUser]);

  // Complete quiz (save profile + mark completed)
  const completeQuiz = useCallback(async (data: SubmissionData) => {
    if (!user?.id) return false;
    
    // ✅ OPTIMISTIC UPDATE: Update cache IMMEDIATELY before DB save
    queryClient.setQueryData(['user-profile', user.id], (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        quiz_completed: true,
        quiz_in_progress: false
      };
    });
    
    logger.debug('🟢 [completeQuiz] Cache updated optimistically');
    
    // Save child profile first
    const profile = await saveChildProfile(data);
    
    if (!profile) {
      // ❌ Rollback optimistic update if save fails
      queryClient.setQueryData(['user-profile', user.id], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          quiz_completed: false,
          quiz_in_progress: true
        };
      });
      logger.error('Failed to save child profile during quiz completion - rolled back cache');
      return false;
    }

    // Mark quiz as completed
    const success = await markQuizCompleted();
    
    return success;
  }, [saveChildProfile, markQuizCompleted, user, queryClient]);

  return {
    isSaving,
    error,
    saveChildProfile,
    markQuizCompleted,
    completeQuiz,
  };
}