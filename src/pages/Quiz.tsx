import { useEffect, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';
import { trackEvent } from '@/lib/analytics';

// Custom hooks
import { useQuizState } from '@/hooks/useQuizState';
import { useQuizValidation } from '@/hooks/useQuizValidation';
import { useQuizProgress } from '@/hooks/useQuizProgress';
import { useQuizSubmission } from '@/hooks/useQuizSubmission';

// Components
import { QuizNameStep } from '@/components/Quiz/QuizNameStep';
import { QuizDetailsStep } from '@/components/Quiz/QuizDetailsStep';
import { QuizGoalsStep } from '@/components/Quiz/QuizGoalsStep';
import { QuizChallengeLevelStep } from '@/components/Quiz/QuizChallengeLevelStep';
import { QuizDurationStep } from '@/components/Quiz/QuizDurationStep';
import { QuizQuestionStep } from '@/components/Quiz/QuizQuestionStep';
import { QuizLoadingScreen } from '@/components/Quiz/QuizLoadingScreen';
import { QuizFinalCelebration } from '@/components/Quiz/QuizFinalCelebration';
import { QuizEnhancedResults } from '@/components/Quiz/QuizEnhancedResults';
import { QuizResultsSkeleton } from '@/components/Quiz/QuizResultsSkeleton';
import { QuizErrorBoundary } from '@/components/Quiz/ui/QuizErrorBoundary';
import { quizQuestions } from '@/lib/quizQuestions';

export default function Quiz() {
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();
  const [showResultsSkeleton, setShowResultsSkeleton] = useState(false);

  // Custom hooks
  const quizState = useQuizState();
  const validation = useQuizValidation({
    childName: quizState.childName,
    childAge: quizState.childAge,
    parentGoals: quizState.parentGoals,
    challengeDuration: quizState.challengeDuration,
    currentAnswer: quizState.answers[quizState.currentQuestion],
    quizStep: quizState.quizStep,
  });
  const progress = useQuizProgress({
    currentQuestion: quizState.currentQuestion,
    quizStep: quizState.quizStep,
  });
  const submission = useQuizSubmission();

  // Track quiz start
  useEffect(() => {
    trackEvent('quiz_started');
  }, []);

  // Track step changes
  useEffect(() => {
    trackEvent('quiz_step_changed', { 
      step: quizState.quizStep,
      question: quizState.quizStep === 'questions' ? quizState.currentQuestion + 1 : undefined
    });
  }, [quizState.quizStep, quizState.currentQuestion]);

  // Skeleton → Real Results Transition
  useEffect(() => {
    if (quizState.showEnhancedResults && quizState.result) {
      setShowResultsSkeleton(true);
      const timer = setTimeout(() => {
        setShowResultsSkeleton(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [quizState.showEnhancedResults, quizState.result]);

  // Start quiz flow
  const startQuiz = useCallback(() => {
    quizState.setHasStarted(true);
    trackEvent('quiz_questions_started');
  }, [quizState]);

  // Complete quiz
  const handleCompleteQuiz = useCallback(async () => {
    console.log('🔵 [Quiz] Iniciando conclusão do quiz');
    trackEvent('quiz_completing');
    const result = quizState.calculateResult();
    
    if (!result) {
      console.log('❌ [Quiz] Nenhum resultado calculado');
      return;
    }

    const sanitizedName = validation.sanitizeName();
    
    await submission.completeQuiz({
      childName: sanitizedName,
      brainProfile: result.type,
      childAge: quizState.childAge,
      parentGoals: quizState.parentGoals,
      challengeLevel: quizState.challengeLevel,
      challengeDuration: quizState.challengeDuration,
      triedApproaches: quizState.triedApproaches,
      resultSpeed: quizState.resultSpeed,
    });
    
    trackEvent('quiz_completed', { brainProfile: result.type });
  }, [quizState, validation, submission]);

  // Countdown timer
  useEffect(() => {
    if (!quizState.showCountdown) return;
    
    if (quizState.countdown > 0) {
      const timer = setTimeout(() => {
        quizState.setCountdown(quizState.countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (quizState.countdown === 0) {
      quizState.setShowCountdown(false);
      quizState.setShowLoading(true);
      handleCompleteQuiz();
    }
  }, [quizState.countdown, quizState.showCountdown, quizState, handleCompleteQuiz]);

  // Navigation handlers - updated for new flow (no speed step)
  const handleNext = useCallback(() => {
    triggerHaptic('light');

    switch (quizState.quizStep) {
      case 'name':
        if (validation.nameValidation.isValid) {
          quizState.setQuizStep('details');
        }
        break;
      case 'details':
        quizState.setQuizStep('goals');
        break;
      case 'goals':
        quizState.setQuizStep('challenge');
        break;
      case 'challenge':
        quizState.setQuizStep('duration');
        break;
      case 'duration':
        quizState.setQuizStep('questions');
        startQuiz();
        break;
      case 'questions':
        if (progress.isLastQuestion) {
          quizState.setShowCountdown(true);
          quizState.setCountdown(3);
        } else {
          quizState.setCurrentQuestion(quizState.currentQuestion + 1);
        }
        break;
    }
  }, [quizState, validation, progress, triggerHaptic, startQuiz]);

  const handlePrevious = useCallback(() => {
    triggerHaptic('light');

    switch (quizState.quizStep) {
      case 'details':
        quizState.setQuizStep('name');
        break;
      case 'goals':
        quizState.setQuizStep('details');
        break;
      case 'challenge':
        quizState.setQuizStep('goals');
        break;
      case 'duration':
        quizState.setQuizStep('challenge');
        break;
      case 'questions':
        if (quizState.currentQuestion > 0) {
          quizState.setCurrentQuestion(quizState.currentQuestion - 1);
        } else {
          quizState.setQuizStep('duration');
        }
        break;
    }
  }, [quizState, triggerHaptic]);

  // Loading screen
  if (quizState.showLoading) {
    return <QuizLoadingScreen onComplete={() => { quizState.setShowLoading(false); quizState.setShowEnhancedResults(true); }} />;
  }

  // Results screen
  if (quizState.showEnhancedResults && quizState.result) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="h-1 bg-muted">
            <motion.div className="h-full bg-foreground" initial={{ width: 0 }} animate={{ width: '95%' }} transition={{ duration: 0.5 }} />
          </div>
        </div>
        <div className="flex-1 px-4 md:px-5 lg:px-6 pb-24 md:pb-26 lg:pb-28 overflow-y-auto" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)' }}>
          <AnimatePresence mode="wait">
            {showResultsSkeleton ? (
              <motion.div key="skeleton" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <QuizResultsSkeleton />
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <QuizEnhancedResults
                  brainType={quizState.result.type}
                  childName={quizState.childName}
                  challengeLevel={quizState.challengeLevel}
                  parentGoals={quizState.parentGoals}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-full md:max-w-md z-50">
          <div className="bg-background/80 backdrop-blur-2xl border border-border/20 shadow-2xl rounded-full p-1.5 ring-1 ring-border/10">
            <Button 
              onClick={() => { 
                triggerHaptic('light'); 
                quizState.setShowEnhancedResults(false); 
                quizState.setShowFinalCelebration(true); 
              }} 
              className="w-full h-12 md:h-14 bg-foreground text-background hover:bg-foreground/90 text-base font-bold rounded-full shadow-lg transition-all active:scale-95"
            >
              See My Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Final celebration → navigate directly to dashboard
  if (quizState.showFinalCelebration && quizState.result) {
    return <QuizFinalCelebration brainType={quizState.result.type} onComplete={() => navigate('/', { state: { quizJustCompleted: true } })} />;
  }

  const showBackButton = quizState.quizStep !== 'name' && !quizState.showCountdown && !quizState.showFinalCelebration && !quizState.showLoading && !quizState.showEnhancedResults;
  const showProgressBar = !quizState.showFinalCelebration && !quizState.showLoading && !quizState.showEnhancedResults;

  // Calculate progress text for questions
  const getProgressText = () => {
    if (quizState.quizStep === 'questions') {
      return `Question ${quizState.currentQuestion + 1} of ${quizQuestions.length}`;
    }
    return null;
  };

  return (
    <QuizErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Progress Bar & Header */}
        {showProgressBar && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-background backdrop-blur-xl border-b border-border/50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            <div className="px-4 md:px-6 h-14 md:h-16 flex items-center gap-2 md:gap-3">
              {showBackButton && (
                <motion.button onClick={handlePrevious} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-foreground hover:bg-muted rounded-full transition-colors flex-shrink-0">
                  <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>
              )}
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden mr-3">
                    <motion.div className="h-full bg-foreground rounded-full" initial={{ width: 0 }} animate={{ width: `${quizState.progressPercentage}%` }} transition={{ duration: 0.3, ease: "easeOut" }} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                    {quizState.progressPercentage}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  {getProgressText() ? (
                    <span className="text-xs text-muted-foreground">{getProgressText()}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground opacity-0">-</span>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{quizState.estimatedTimeRemaining}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4 md:px-6 pb-20 md:pb-24" style={{ paddingTop: showProgressBar ? 'calc(env(safe-area-inset-top) + 5rem)' : 'calc(env(safe-area-inset-top) + 1.5rem)' }}>
          <AnimatePresence mode="wait">
            {quizState.showCountdown ? (
              <motion.div key="countdown" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5 }} className="text-center">
                <h1 className="text-8xl md:text-9xl font-black text-foreground font-relative">{quizState.countdown}</h1>
              </motion.div>
            ) : quizState.quizStep === 'name' ? (
              <QuizNameStep key="name" childName={quizState.childName} nameError={!validation.nameValidation.isValid && quizState.childName.length > 0} onChange={quizState.setChildName} />
            ) : quizState.quizStep === 'details' ? (
              <QuizDetailsStep key="details" childAge={quizState.childAge} onChange={quizState.setChildAge} />
            ) : quizState.quizStep === 'goals' ? (
              <QuizGoalsStep key="goals" selectedGoals={quizState.parentGoals} onToggle={quizState.toggleParentGoal} />
            ) : quizState.quizStep === 'challenge' ? (
              <QuizChallengeLevelStep key="challenge" challengeLevel={quizState.challengeLevel} onChange={quizState.setChallengeLevel} />
            ) : quizState.quizStep === 'duration' ? (
              <QuizDurationStep key="duration" challengeDuration={quizState.challengeDuration} onChange={quizState.setChallengeDuration} />
            ) : quizState.quizStep === 'questions' && quizState.hasStarted ? (
              <QuizQuestionStep key={`question-${quizState.currentQuestion}`} question={quizQuestions[quizState.currentQuestion]} currentAnswer={quizState.answers[quizState.currentQuestion]} onAnswer={(answer) => quizState.setAnswer(quizState.currentQuestion, answer)} />
            ) : null}
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Button */}
        {!quizState.showCountdown && !quizState.showFinalCelebration && !quizState.showLoading && !quizState.showEnhancedResults && (
          <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/50 px-4 md:px-6 pt-2.5 md:pt-3 lg:pt-4 z-50" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}>
            <Button onClick={handleNext} disabled={!validation.canProceed} className="w-full h-11 md:h-12 lg:h-14 bg-foreground text-background hover:bg-foreground/90 disabled:bg-muted disabled:text-muted-foreground text-sm md:text-base font-bold rounded-xl transition-all shadow-lg">
              {progress.buttonText}
            </Button>
          </div>
        )}
      </div>
    </QuizErrorBoundary>
  );
}
