import { useMemo, useCallback } from 'react';
import { quizQuestions } from '@/lib/quizQuestions';
import type { QuizStep } from './useQuizState';

interface UseQuizProgressProps {
  currentQuestion: number;
  quizStep: QuizStep;
}

export function useQuizProgress({ currentQuestion, quizStep }: UseQuizProgressProps) {
  const totalQuestions = quizQuestions.length;

  // Check if reached a milestone
  const checkMilestone = useCallback((questionNumber: number): { reached: boolean; milestone?: 25 | 50 | 75 } => {
    const milestones: Array<{ threshold: number; value: 25 | 50 | 75 }> = [
      { threshold: Math.floor(totalQuestions * 0.25), value: 25 },
      { threshold: Math.floor(totalQuestions * 0.50), value: 50 },
      { threshold: Math.floor(totalQuestions * 0.75), value: 75 }
    ];
    
    const milestone = milestones.find(m => m.threshold === questionNumber);
    return milestone ? { reached: true, milestone: milestone.value } : { reached: false };
  }, [totalQuestions]);

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

  // Check if should show back button
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
      !completingQuiz && 
      !showFinalCelebration && 
      !showThankYou && 
      !showLoading && 
      !showEnhancedResults && 
      !showMotivationalMilestone;
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