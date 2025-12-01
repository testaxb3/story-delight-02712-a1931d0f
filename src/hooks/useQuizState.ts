import { useState, useMemo, useCallback } from 'react';
import { quizQuestions, calculateBrainProfile, type BrainProfile } from '@/lib/quizQuestions';

export type QuizStep = 'name' | 'details' | 'goals' | 'speed' | 'challenge' | 'questions';

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

export function useQuizState() {
  // Main state
  const [state, setState] = useState<QuizState>({
    quizStep: 'name',
    currentQuestion: 0,
    childName: '',
    childAge: 5,
    parentGoals: [],
    challengeLevel: 5,
    challengeDuration: '',
    triedApproaches: [],
    resultSpeed: 'balanced',
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

  // Memoized calculations
  const progressPercentage = useMemo(() => {
    switch (state.quizStep) {
      case 'name': return 10;
      case 'details': return 20;
      case 'goals': return 30;
      case 'speed': return 40;
      case 'challenge': return 50;
      case 'questions':
        return ((state.currentQuestion + 1) / quizQuestions.length) * 50 + 50;
      default: return 0;
    }
  }, [state.quizStep, state.currentQuestion]);

  const pageNumber = useMemo(() => {
    switch (state.quizStep) {
      case 'name': return 1;
      case 'details': return 2;
      case 'goals': return 3;
      case 'speed': return 4;
      case 'challenge': return 5;
      case 'questions': return 6 + state.currentQuestion;
      default: return 1;
    }
  }, [state.quizStep, state.currentQuestion]);

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