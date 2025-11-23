import { useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

// Custom hooks
import { useQuizState } from '@/hooks/useQuizState';
import { useQuizValidation } from '@/hooks/useQuizValidation';
import { useQuizProgress } from '@/hooks/useQuizProgress';
import { useQuizSubmission } from '@/hooks/useQuizSubmission';

// Components
import { QuizNameStep } from '@/components/Quiz/QuizNameStep';
import { QuizDetailsStep } from '@/components/Quiz/QuizDetailsStep';
import { QuizGoalsStep } from '@/components/Quiz/QuizGoalsStep';
import { QuizSpeedSlider } from '@/components/Quiz/QuizSpeedSlider';
import { QuizChallengeStep } from '@/components/Quiz/QuizChallengeStep';
import { QuizQuestionStep } from '@/components/Quiz/QuizQuestionStep';
import { QuizLoadingScreen } from '@/components/Quiz/QuizLoadingScreen';
import { QuizPreLoadingScreen } from '@/components/Quiz/QuizPreLoadingScreen';
import { QuizPostSpeedMotivationalScreen } from '@/components/Quiz/QuizPostSpeedMotivationalScreen';
import { QuizFinalCelebration } from '@/components/Quiz/QuizFinalCelebration';
import { QuizThankYouScreen } from '@/components/Quiz/QuizThankYouScreen';
import { QuizEnhancedResults } from '@/components/Quiz/QuizEnhancedResults';
import { QuizMotivationalScreen } from '@/components/Quiz/QuizMotivationalScreen';
import { QuizErrorBoundary } from '@/components/Quiz/ui/QuizErrorBoundary';
import { quizQuestions } from '@/lib/quizQuestions';

export default function Quiz() {
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();
  
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

  // Start quiz flow
  const startQuiz = useCallback(() => {
    quizState.setHasStarted(true);
    quizState.setShowPreLoading(true);
    setTimeout(() => quizState.setShowPreLoading(false), 1500);
  }, [quizState]);

  // Complete quiz
  const handleCompleteQuiz = useCallback(async () => {
    const result = quizState.calculateResult();
    
    if (!result) return;

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
  }, [quizState, validation, submission]);

  // Countdown timer - Fixed to prevent double execution
  useEffect(() => {
    if (!quizState.showCountdown) return;
    
    if (quizState.countdown > 0) {
      const timer = setTimeout(() => {
        quizState.setCountdown(quizState.countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (quizState.countdown === 0) {
      // Only execute once when countdown reaches 0
      quizState.setShowCountdown(false);
      quizState.setShowLoading(true);
      handleCompleteQuiz();
    }
  }, [quizState.countdown, quizState.showCountdown, quizState, handleCompleteQuiz]);

  // Navigation handlers
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
        quizState.setQuizStep('speed');
        break;
      case 'speed':
        quizState.setShowPostSpeedMotivational(false);
        quizState.setQuizStep('challenge');
        break;
      case 'challenge':
        quizState.setQuizStep('questions');
        startQuiz();
        break;
      case 'questions':
        if (progress.isLastQuestion) {
          quizState.setShowCountdown(true);
          quizState.setCountdown(3); // Reset countdown to 3
        } else {
          const nextQuestion = quizState.currentQuestion + 1;
          quizState.setCurrentQuestion(nextQuestion);
          
          // Milestone screens removed - go directly to next question
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
      case 'speed':
        quizState.setShowPostSpeedMotivational(false);
        quizState.setQuizStep('goals');
        break;
      case 'challenge':
        quizState.setQuizStep('speed');
        break;
      case 'questions':
        if (quizState.currentQuestion > 0) {
          quizState.setCurrentQuestion(quizState.currentQuestion - 1);
        } else {
          quizState.setQuizStep('challenge');
        }
        break;
    }
  }, [quizState, triggerHaptic]);

  // Conditional screen renders
  if (quizState.showPreLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center bg-background">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-black text-foreground font-relative">Let's start the quiz!</h2>
          <p className="text-base md:text-lg text-muted-foreground">Get ready to discover {quizState.childName}'s brain profile</p>
        </motion.div>
      </motion.div>
    );
  }

  if (quizState.showLoading) {
    return <QuizLoadingScreen onComplete={() => { quizState.setShowLoading(false); quizState.setShowEnhancedResults(true); }} />;
  }

  if (quizState.showEnhancedResults && quizState.result) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
          <div className="h-1 bg-muted">
            <motion.div className="h-full bg-foreground" initial={{ width: 0 }} animate={{ width: '95%' }} transition={{ duration: 0.5 }} />
          </div>
        </div>
        <div className="flex-1 px-6 pt-20 pb-24 overflow-y-auto">
          <QuizEnhancedResults brainType={quizState.result.type} childName={quizState.childName} challengeLevel={quizState.challengeLevel} parentGoals={quizState.parentGoals} />
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
          <Button onClick={() => { triggerHaptic('light'); quizState.setShowEnhancedResults(false); quizState.setShowFinalCelebration(true); }} className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 text-base font-bold rounded-xl">See My Dashboard</Button>
        </div>
      </div>
    );
  }

  // Motivational milestone screens removed

  if (quizState.showPostSpeedMotivational) {
    return <QuizPostSpeedMotivationalScreen selectedGoals={quizState.parentGoals} onContinue={handleNext} />;
  }

  if (quizState.showFinalCelebration && quizState.result) {
    return <QuizFinalCelebration brainType={quizState.result.type} onComplete={() => { quizState.setShowFinalCelebration(false); quizState.setShowThankYou(true); }} />;
  }

  if (quizState.showThankYou) {
    return <QuizThankYouScreen onContinue={() => navigate('/', { state: { quizJustCompleted: true } })} />;
  }

  const showBackButton = progress.showBackButton(quizState.quizStep, quizState.showPreLoading, quizState.showPostSpeedMotivational, quizState.showCountdown, quizState.completingQuiz, quizState.showFinalCelebration, quizState.showThankYou, quizState.showLoading, quizState.showEnhancedResults, quizState.showMotivationalMilestone);
  const showProgressBar = !quizState.showFinalCelebration && !quizState.showThankYou && !quizState.showLoading && !quizState.showEnhancedResults;

  return (
    <QuizErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Progress Bar & Header */}
        {showProgressBar && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-background backdrop-blur-xl border-b border-border/50">
            <div className="pt-safe-area-top">
              <div className="px-6 h-16 flex items-center gap-4">
                {showBackButton && (
                  <motion.button onClick={handlePrevious} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted rounded-full transition-colors flex-shrink-0">
                    <ArrowLeft className="w-6 h-6" />
                  </motion.button>
                )}
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div className="h-full bg-foreground rounded-full" initial={{ width: 0 }} animate={{ width: `${quizState.progressPercentage}%` }} transition={{ duration: 0.3, ease: "easeOut" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-6 pt-20 pb-24">
          <AnimatePresence mode="wait">
            {quizState.showCountdown ? (
              <motion.div key="countdown" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5 }} className="text-center">
                <h1 className="text-8xl md:text-9xl font-black text-foreground font-relative">{quizState.countdown}</h1>
              </motion.div>
            ) : quizState.quizStep === 'name' ? (
              <QuizNameStep key="name" childName={quizState.childName} nameError={!validation.nameValidation.isValid} onChange={quizState.setChildName} />
            ) : quizState.quizStep === 'details' ? (
              <QuizDetailsStep key="details" childAge={quizState.childAge} onChange={quizState.setChildAge} />
            ) : quizState.quizStep === 'goals' ? (
              <QuizGoalsStep key="goals" selectedGoals={quizState.parentGoals} onToggle={quizState.toggleParentGoal} />
            ) : quizState.quizStep === 'speed' ? (
              <div key="speed" className="w-full max-w-2xl"><QuizSpeedSlider value={quizState.resultSpeed} onChange={quizState.setResultSpeed} /></div>
            ) : quizState.quizStep === 'challenge' ? (
              <QuizChallengeStep key="challenge" challengeLevel={quizState.challengeLevel} challengeDuration={quizState.challengeDuration} triedApproaches={quizState.triedApproaches} onLevelChange={quizState.setChallengeLevel} onDurationChange={quizState.setChallengeDuration} onApproachToggle={quizState.toggleTriedApproach} />
            ) : quizState.quizStep === 'questions' && quizState.hasStarted ? (
              <QuizQuestionStep key={`question-${quizState.currentQuestion}`} question={quizQuestions[quizState.currentQuestion]} currentAnswer={quizState.answers[quizState.currentQuestion]} onAnswer={(answer) => quizState.setAnswer(quizState.currentQuestion, answer)} />
            ) : null}
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Button */}
        {!quizState.showCountdown && !quizState.showFinalCelebration && !quizState.showThankYou && !quizState.showPostSpeedMotivational && !quizState.showPreLoading && !quizState.showLoading && !quizState.showEnhancedResults && (
          <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/50 px-6 pb-8 pt-4 z-50">
            <Button onClick={quizState.quizStep === 'speed' ? () => quizState.setShowPostSpeedMotivational(true) : handleNext} disabled={!validation.canProceed} className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 disabled:bg-muted disabled:text-muted-foreground text-base font-bold rounded-xl transition-all">
              {progress.buttonText}
            </Button>
          </div>
        )}
      </div>
    </QuizErrorBoundary>
  );
}