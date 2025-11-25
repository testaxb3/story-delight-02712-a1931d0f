import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { RoutineStep } from '@/types/routine';

export const useRoutinePlayer = (routineId: string, steps: RoutineStep[]) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [moodBefore, setMoodBefore] = useState<'happy' | 'neutral' | 'sad' | 'frustrated' | null>(null);
  const [moodAfter, setMoodAfter] = useState<'happy' | 'neutral' | 'sad' | 'frustrated' | null>(null);
  const queryClient = useQueryClient();

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isComplete = currentStepIndex >= steps.length;

  useEffect(() => {
    if (currentStep && isPlaying) {
      setTimeRemaining(currentStep.duration_seconds);
    }
  }, [currentStep, isPlaying]);

  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeRemaining]);

  const saveCompletion = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('routine_completions').insert({
        routine_id: routineId,
        mood_before: moodBefore || undefined,
        mood_after: moodAfter || undefined,
        steps_completed: steps.length,
        duration_seconds: steps.reduce((acc, step) => acc + step.duration_seconds, 0),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });

  const startRoutine = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pauseRoutine = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const nextStep = useCallback(() => {
    if (isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
      setIsPlaying(false);
      saveCompletion.mutate();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [isLastStep, saveCompletion]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const resetRoutine = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setTimeRemaining(0);
    setMoodBefore(null);
    setMoodAfter(null);
  }, []);

  return {
    currentStep,
    currentStepIndex,
    totalSteps: steps.length,
    isPlaying,
    timeRemaining,
    isLastStep,
    isComplete,
    moodBefore,
    moodAfter,
    setMoodBefore,
    setMoodAfter,
    startRoutine,
    pauseRoutine,
    nextStep,
    previousStep,
    resetRoutine,
  };
};
