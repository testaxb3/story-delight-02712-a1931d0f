import { useState, useMemo, useCallback } from 'react';
import { quizQuestions, calculateBrainProfile, type BrainProfile } from '@/lib/quizQuestions';

// Removed 'speed' step - 90% chose balanced, adding friction
export type QuizStep = 'name' | 'details' | 'goals' | 'challenge' | 'duration' | 'questions';

interface QuizState {
  // Step management
  quizStep: QuizStep;
  currentQuestion: number;
  
  // User inputs
  childName: string;
  childAge: number;
  parentGoals: string[];
  challengeLevel: number;
  challengeDuration: string;
  triedApproaches: string[]; // Kept for backward compatibility but no longer used
  resultSpeed: 'slow' | 'balanced' | 'intensive';
  answers: Record<number, string>;
  
  // UI states
  hasStarted: boolean;
  showCountdown: boolean;
  countdown: number;
  completingQuiz: boolean;
  showFinalCelebration: boolean;
  showEnhancedResults: boolean;
  showLoading: boolean;
  
  // Results
  result: { type: BrainProfile; score: number } | null;
}

// Total steps for progress calculation: name, details, goals, challenge, duration, + 7 questions = 12 screens
const TOTAL_STEPS = 5 + quizQuestions.length; // 12 total

export function useQuizState() {
  // Main state - resultSpeed defaults to 'balanced' (no longer user-selectable)
  const [state, setState] = useState<QuizState>({
    quizStep: 'name',
    currentQuestion: 0,
    childName: '',
    childAge: 5,
    parentGoals: [],
    challengeLevel: 5,
    challengeDuration: '',
    triedApproaches: [],
    resultSpeed: 'balanced', // Default, no longer a step
    answers: {},
    hasStarted: false,
    showCountdown: false,
    countdown: 3,
    completingQuiz: false,
    showFinalCelebration: false,
    showEnhancedResults: false,
    showLoading: false,
    result: null,
  });

  // Memoized calculations - updated for new flow
  const progressPercentage = useMemo(() => {
    const getStepNumber = () => {
      switch (state.quizStep) {
        case 'name': return 1;
        case 'details': return 2;
        case 'goals': return 3;
        case 'challenge': return 4;
        case 'duration': return 5;
        case 'questions': return 5 + state.currentQuestion + 1;
        default: return 1;
      }
    };
    return Math.round((getStepNumber() / TOTAL_STEPS) * 100);
  }, [state.quizStep, state.currentQuestion]);

  const pageNumber = useMemo(() => {
    switch (state.quizStep) {
      case 'name': return 1;
      case 'details': return 2;
      case 'goals': return 3;
      case 'challenge': return 4;
      case 'duration': return 5;
      case 'questions': return 6 + state.currentQuestion;
      default: return 1;
    }
  }, [state.quizStep, state.currentQuestion]);

  // Estimated time remaining
  const estimatedTimeRemaining = useMemo(() => {
    const stepsRemaining = TOTAL_STEPS - pageNumber;
    const secondsPerStep = 8; // Average time per step
    const totalSeconds = stepsRemaining * secondsPerStep;
    const minutes = Math.ceil(totalSeconds / 60);
    return minutes <= 1 ? 'Less than 1 minute left' : `About ${minutes} minutes left`;
  }, [pageNumber]);

  // Update functions with useCallback
  const setQuizStep = useCallback((step: QuizStep) => {
    setState(prev => ({ ...prev, quizStep: step }));
  }, []);

  const setCurrentQuestion = useCallback((question: number) => {
    setState(prev => ({ ...prev, currentQuestion: question }));
  }, []);

  const setChildName = useCallback((name: string) => {
    setState(prev => ({ ...prev, childName: name }));
  }, []);

  const setChildAge = useCallback((age: number) => {
    setState(prev => ({ ...prev, childAge: age }));
  }, []);

  const setParentGoals = useCallback((goals: string[]) => {
    setState(prev => ({ ...prev, parentGoals: goals }));
  }, []);

  const toggleParentGoal = useCallback((goal: string) => {
    setState(prev => ({
      ...prev,
      parentGoals: prev.parentGoals.includes(goal)
        ? prev.parentGoals.filter(g => g !== goal)
        : [...prev.parentGoals, goal]
    }));
  }, []);

  const setChallengeLevel = useCallback((level: number) => {
    setState(prev => ({ ...prev, challengeLevel: level }));
  }, []);

  const setChallengeDuration = useCallback((duration: string) => {
    setState(prev => ({ ...prev, challengeDuration: duration }));
  }, []);

  const setTriedApproaches = useCallback((approaches: string[]) => {
    setState(prev => ({ ...prev, triedApproaches: approaches }));
  }, []);

  const toggleTriedApproach = useCallback((approach: string) => {
    setState(prev => ({
      ...prev,
      triedApproaches: prev.triedApproaches.includes(approach)
        ? prev.triedApproaches.filter(a => a !== approach)
        : [...prev.triedApproaches, approach]
    }));
  }, []);

  const setResultSpeed = useCallback((speed: 'slow' | 'balanced' | 'intensive') => {
    setState(prev => ({ ...prev, resultSpeed: speed }));
  }, []);

  const setAnswer = useCallback((questionIndex: number, answer: string) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionIndex]: answer }
    }));
  }, []);

  const calculateResult = useCallback(() => {
    const result = calculateBrainProfile(state.answers);
    setState(prev => ({ ...prev, result }));
    return result;
  }, [state.answers]);

  // UI state setters
  const setHasStarted = useCallback((started: boolean) => {
    setState(prev => ({ ...prev, hasStarted: started }));
  }, []);

  const setShowCountdown = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showCountdown: show }));
  }, []);

  const setCountdown = useCallback((count: number) => {
    setState(prev => ({ ...prev, countdown: count }));
  }, []);

  const setCompletingQuiz = useCallback((completing: boolean) => {
    setState(prev => ({ ...prev, completingQuiz: completing }));
  }, []);

  const setShowFinalCelebration = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showFinalCelebration: show }));
  }, []);

  const setShowEnhancedResults = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showEnhancedResults: show }));
  }, []);

  const setShowLoading = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showLoading: show }));
  }, []);

  return {
    ...state,
    progressPercentage,
    pageNumber,
    estimatedTimeRemaining,
    setQuizStep,
    setCurrentQuestion,
    setChildName,
    setChildAge,
    setParentGoals,
    toggleParentGoal,
    setChallengeLevel,
    setChallengeDuration,
    setTriedApproaches,
    toggleTriedApproach,
    setResultSpeed,
    setAnswer,
    calculateResult,
    setHasStarted,
    setShowCountdown,
    setCountdown,
    setCompletingQuiz,
    setShowFinalCelebration,
    setShowEnhancedResults,
    setShowLoading,
  };
}
