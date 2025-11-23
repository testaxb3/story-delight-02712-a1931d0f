import { useMemo, useCallback } from 'react';
import { quizQuestions } from '@/lib/quizQuestions';
import type { QuizStep } from './useQuizState';

interface UseQuizProgressProps {
  currentQuestion: number;
  quizStep: QuizStep;
}

export function useQuizProgress({ currentQuestion, quizStep }: UseQuizProgressProps) {
  const totalQuestions = quizQuestions.length;

  // Milestone checking disabled - going directly through questions
  const checkMilestone = useCallback((questionNumber: number): { reached: boolean; milestone?: 25 | 50 | 75 } => {
    return { reached: false };
  }, []);

  // Calculate question progress percentage
  const questionProgress = useMemo(() => {
    if (quizStep !== 'questions') return 0;
    return Math.round(((currentQuestion + 1) / totalQuestions) * 100);
  }, [currentQuestion, totalQuestions, quizStep]);

  // Check if is last question
  const isLastQuestion = useMemo(() => {
    return currentQuestion === totalQuestions - 1;
  }, [currentQuestion, totalQuestions]);

  // Get button text based on current state
  const getButtonText = useCallback((step: QuizStep, isLast: boolean) => {
    switch (step) {
      case 'name':
        return 'Next - Details';
      case 'details':
        return 'Next - Goals';
      case 'goals':
        return 'Next - Speed';
      case 'speed':
        return 'Next - Challenge';
      case 'challenge':
        return 'Start Quiz';
      case 'questions':
        return isLast ? 'See Results' : 'Next Question';
      default:
        return 'Next';
    }
  }, []);

  const buttonText = useMemo(() => {
    return getButtonText(quizStep, isLastQuestion);
  }, [quizStep, isLastQuestion, getButtonText]);

  // Check if should show back button - completingQuiz and showMotivationalMilestone removed
  const showBackButton = useCallback((
    step: QuizStep,
    showPreLoading: boolean,
    showPostSpeedMotivational: boolean,
    showCountdown: boolean,
    completingQuiz: boolean,
    showFinalCelebration: boolean,
    showThankYou: boolean,
    showLoading: boolean,
    showEnhancedResults: boolean,
    showMotivationalMilestone: boolean
  ) => {
    return step !== 'name' && 
      !showPreLoading && 
      !showPostSpeedMotivational && 
      !showCountdown && 
      !showFinalCelebration && 
      !showThankYou && 
      !showLoading && 
      !showEnhancedResults;
  }, []);

  return {
    totalQuestions,
    questionProgress,
    isLastQuestion,
    buttonText,
    checkMilestone,
    showBackButton,
  };
}