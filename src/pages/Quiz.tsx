import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { logger } from '@/lib/logger';
import { quizQuestions, calculateBrainProfile } from '@/lib/quizQuestions';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

// Import step components
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

type BrainCategory = 'INTENSE' | 'DISTRACTED' | 'DEFIANT' | 'NEUTRAL';
type BrainProfile = 'INTENSE' | 'DISTRACTED' | 'DEFIANT';
type QuizStep = 'name' | 'details' | 'goals' | 'speed' | 'challenge' | 'questions';

const questions = quizQuestions;
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;

const sanitizeChildName = (name: string): string => {
  return name
    .trim()
    .replace(/[<>]/g, '')
    .replace(/[^\w\s\-']/g, '')
    .substring(0, MAX_NAME_LENGTH);
};

const isValidChildName = (name: string): boolean => {
  const trimmed = name.trim();
  return (
    trimmed.length >= MIN_NAME_LENGTH &&
    trimmed.length <= MAX_NAME_LENGTH &&
    /^[\w\s\-']+$/.test(trimmed)
  );
};

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<{ type: BrainProfile; score: number } | null>(null);
  const [childName, setChildName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const [completingQuiz, setCompletingQuiz] = useState(false);
  const [showPreLoading, setShowPreLoading] = useState(false);
  const [showPostSpeedMotivational, setShowPostSpeedMotivational] = useState(false);
  const [showFinalCelebration, setShowFinalCelebration] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showEnhancedResults, setShowEnhancedResults] = useState(false);
  const [showMotivationalMilestone, setShowMotivationalMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<25 | 50 | 75>(25);
  const [showLoading, setShowLoading] = useState(false);

  // Enhanced quiz data
  const [childAge, setChildAge] = useState<number>(5);
  const [parentGoals, setParentGoals] = useState<string[]>([]);
  const [challengeLevel, setChallengeLevel] = useState<number>(5);
  const [challengeDuration, setChallengeDuration] = useState<string>('');
  const [triedApproaches, setTriedApproaches] = useState<string[]>([]);
  const [resultSpeed, setResultSpeed] = useState<'slow' | 'balanced' | 'intensive'>('balanced');
  const [quizStep, setQuizStep] = useState<QuizStep>('name');

  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { theme } = useTheme();
  const { refreshChildren, setActiveChild } = useChildProfiles();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (countdown > 0 && showCountdown) {
      setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && showCountdown) {
      setShowCountdown(false);
      setCompletingQuiz(true);
      completeQuiz();
    }
  }, [countdown, showCountdown]);

  useEffect(() => {
    if (completingQuiz) {
      const timer = setTimeout(() => {
        setCompletingQuiz(false);
        setShowLoading(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [completingQuiz]);

  const startQuiz = () => {
    setHasStarted(true);
    setShowPreLoading(true);
    setTimeout(() => {
      setShowPreLoading(false);
    }, 1500);
  };

  const handleAnswer = (questionIndex: number, answer: string) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const calculateResult = () => {
    const brainProfile = calculateBrainProfile(answers);
    setResult(brainProfile);
    return brainProfile;
  };

  const saveChildProfile = async () => {
    if (!user || !result) return;

    setSavingProfile(true);

    try {
      const sanitizedName = sanitizeChildName(childName);

      const { data: existingProfile } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('name', sanitizedName)
        .eq('parent_id', user.id)
        .single();

      if (existingProfile) {
        toast.error('A profile with this name already exists.');
        return;
      }

      const { data, error } = await supabase.from('child_profiles').insert([
        {
          name: sanitizedName,
          brain_profile: result.type,
          parent_id: user.id,
          age: childAge,
          parent_goals: parentGoals,
          challenge_level: challengeLevel,
          challenge_duration: challengeDuration,
          tried_approaches: triedApproaches,
          result_speed: resultSpeed,
        },
      ]).select();

      if (error) throw error;

      if (data && data[0]) {
        await refreshChildren();
        await refreshUser();
        queryClient.invalidateQueries({ queryKey: ['children'] });
        setActiveChild(data[0]);
        toast.success(`Profile for ${sanitizedName} saved!`);
        logger.debug(`Profile saved for ${sanitizedName}`);
        return data[0];
      }
    } catch (error: any) {
      logger.error('Error saving profile', error);
      toast.error(error.message || 'Failed to save profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleNameChange = (name: string) => {
    setChildName(name);
    setNameError(!isValidChildName(name));
  };

  const completeQuiz = async () => {
    const finalResult = calculateResult();
    if (finalResult) {
      await saveChildProfile();
      
      // Mark quiz as completed in profiles table
      if (user?.id) {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            quiz_completed: true,
            quiz_in_progress: false 
          })
          .eq('id', user.id);
        
        if (error) {
          logger.error('Error updating quiz_completed', error);
        } else {
          // Set sessionStorage to allow navigation without redirect
          sessionStorage.setItem('quizJustCompletedAt', Date.now().toString());
          await refreshUser(); // Refresh user data to update quiz_completed state
          logger.debug('Quiz marked as completed');
        }
      }
    }
  };

  const checkMilestone = () => {
    const totalQuestions = questions.length;
    const milestones: Array<{ threshold: number; value: 25 | 50 | 75 }> = [
      { threshold: Math.floor(totalQuestions * 0.25), value: 25 },
      { threshold: Math.floor(totalQuestions * 0.50), value: 50 },
      { threshold: Math.floor(totalQuestions * 0.75), value: 75 }
    ];
    
    for (const milestone of milestones) {
      if (currentQuestion === milestone.threshold && !showMotivationalMilestone) {
        setCurrentMilestone(milestone.value);
        setShowMotivationalMilestone(true);
        return true;
      }
    }
    return false;
  };

  const handleNext = () => {
    switch (quizStep) {
      case 'name':
        if (isValidChildName(childName)) {
          setQuizStep('details');
        } else {
          setNameError(true);
        }
        break;
      case 'details':
        setQuizStep('goals');
        break;
      case 'goals':
        setQuizStep('speed');
        break;
      case 'speed':
        setShowPostSpeedMotivational(false);
        setQuizStep('challenge');
        break;
      case 'challenge':
        setQuizStep('questions');
        startQuiz();
        break;
      case 'questions':
        if (currentQuestion < questions.length - 1) {
          const nextQuestion = currentQuestion + 1;
          setCurrentQuestion(nextQuestion);
          setTimeout(() => checkMilestone(), 100);
        } else {
          setShowCountdown(true);
        }
        break;
    }
  };

  const handlePrevious = () => {
    switch (quizStep) {
      case 'details':
        setQuizStep('name');
        break;
      case 'goals':
        setQuizStep('details');
        break;
      case 'speed':
        setShowPostSpeedMotivational(false);
        setQuizStep('goals');
        break;
      case 'challenge':
        setQuizStep('speed');
        break;
      case 'questions':
        if (currentQuestion > 0) {
          setCurrentQuestion(currentQuestion - 1);
        } else {
          setQuizStep('challenge');
        }
        break;
    }
  };

  const canProceed = () => {
    switch (quizStep) {
      case 'name':
        return isValidChildName(childName);
      case 'details':
        return childAge > 0;
      case 'goals':
        return parentGoals.length > 0;
      case 'speed':
        return true;
      case 'challenge':
        return challengeDuration !== '';
      case 'questions':
        return answers[currentQuestion] !== undefined;
      default:
        return false;
    }
  };

  const getButtonText = () => {
    switch (quizStep) {
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
        return currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results';
      default:
        return 'Next';
    }
  };

  const progressPercentage = (() => {
    switch (quizStep) {
      case 'name':
        return 10;
      case 'details':
        return 20;
      case 'goals':
        return 30;
      case 'speed':
        return 40;
      case 'challenge':
        return 50;
      case 'questions':
        return ((currentQuestion + 1) / questions.length) * 50 + 50;
      default:
        return 0;
    }
  })();

  const pageNumber = (() => {
    switch (quizStep) {
      case 'name':
        return 1;
      case 'details':
        return 2;
      case 'goals':
        return 3;
      case 'speed':
        return 4;
      case 'challenge':
        return 5;
      case 'questions':
        return 6 + currentQuestion;
      default:
        return 1;
    }
  })();

  const showBackButton = quizStep !== 'name' && !showPreLoading && !showPostSpeedMotivational && !showCountdown && !completingQuiz && !showFinalCelebration && !showThankYou && !showLoading && !showEnhancedResults && !showMotivationalMilestone;
  const showProgressBar = !showFinalCelebration && !showThankYou && !showLoading && !showEnhancedResults;

  if (showPreLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground font-relative">
              Let's start the quiz!
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Get ready to discover {childName}'s brain profile
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showLoading) {
    return (
      <QuizLoadingScreen
        onComplete={() => {
          setShowLoading(false);
          setShowEnhancedResults(true);
        }}
      />
    );
  }

  if (showEnhancedResults && result) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
          <div className="h-1 bg-muted">
            <motion.div
              className="h-full bg-foreground"
              initial={{ width: 0 }}
              animate={{ width: '95%' }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="flex-1 px-6 pt-20 pb-24 overflow-y-auto">
          <QuizEnhancedResults
            brainType={result.type}
            childName={childName}
            challengeLevel={challengeLevel}
            parentGoals={parentGoals}
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
          <Button
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(15);
              setShowEnhancedResults(false);
              setShowFinalCelebration(true);
            }}
            className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 text-base font-bold rounded-xl shadow-xl hover:shadow-2xl transition-shadow"
          >
            See My Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (showMotivationalMilestone) {
    return (
      <QuizMotivationalScreen
        milestone={currentMilestone}
        brainType={currentMilestone === 75 ? result?.type : undefined}
        onContinue={() => setShowMotivationalMilestone(false)}
      />
    );
  }

  if (showPostSpeedMotivational) {
    return (
      <QuizPostSpeedMotivationalScreen
        selectedGoals={parentGoals}
        onContinue={handleNext}
      />
    );
  }

  if (completingQuiz) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-black flex items-center justify-center">
        <QuizLoadingScreen />
      </div>
    );
  }

  if (showFinalCelebration && result) {
    return (
      <QuizFinalCelebration
        brainType={result.type}
        onComplete={() => {
          setShowFinalCelebration(false);
          setShowThankYou(true);
        }}
      />
    );
  }

  if (showThankYou) {
    return <QuizThankYouScreen onContinue={() => navigate('/', { state: { quizJustCompleted: true } })} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      {/* Progress Bar & Header */}
      {showProgressBar && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black">
          <div className="px-4 h-14 flex items-center">
            {showBackButton && (
              <button
                onClick={handlePrevious}
                className="w-10 h-10 flex items-center justify-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="h-[2px] bg-gray-200 dark:bg-gray-800">
            <motion.div
              className="h-full bg-black dark:bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 pt-20 pb-24">
        <AnimatePresence mode="wait">
          {showCountdown ? (
            <motion.div
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <h1 className="text-6xl md:text-8xl font-black text-black dark:text-white font-relative">
                {countdown}
              </h1>
            </motion.div>
          ) : quizStep === 'name' ? (
            <QuizNameStep
              key="name"
              childName={childName}
              nameError={nameError}
              onChange={handleNameChange}
            />
          ) : quizStep === 'details' ? (
            <QuizDetailsStep
              key="details"
              childAge={childAge}
              onChange={setChildAge}
            />
          ) : quizStep === 'goals' ? (
            <QuizGoalsStep
              key="goals"
              selectedGoals={parentGoals}
              onToggle={(goal) =>
                setParentGoals((prev) =>
                  prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
                )
              }
            />
          ) : quizStep === 'speed' ? (
            <div key="speed" className="w-full max-w-2xl">
              <QuizSpeedSlider value={resultSpeed} onChange={setResultSpeed} />
            </div>
          ) : quizStep === 'challenge' ? (
            <QuizChallengeStep
              key="challenge"
              challengeLevel={challengeLevel}
              challengeDuration={challengeDuration}
              triedApproaches={triedApproaches}
              onLevelChange={setChallengeLevel}
              onDurationChange={setChallengeDuration}
              onApproachToggle={(approach) =>
                setTriedApproaches((prev) =>
                  prev.includes(approach) ? prev.filter((a) => a !== approach) : [...prev, approach]
                )
              }
            />
          ) : quizStep === 'questions' && hasStarted ? (
            <QuizQuestionStep
              key={`question-${currentQuestion}`}
              question={questions[currentQuestion]}
              currentAnswer={answers[currentQuestion]}
              onAnswer={(answer) => handleAnswer(currentQuestion, answer)}
            />
          ) : null}
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Button */}
      {!showCountdown && !completingQuiz && !showFinalCelebration && !showThankYou && !showPostSpeedMotivational && !showPreLoading && !showLoading && !showEnhancedResults && !showMotivationalMilestone && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 px-4 py-4 z-50">
          <Button
            onClick={quizStep === 'speed' ? () => {
              setShowPostSpeedMotivational(true);
            } : handleNext}
            disabled={!canProceed()}
            className="w-full h-14 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-base font-bold rounded-xl shadow-xl transition-all"
          >
            {getButtonText()}
          </Button>
        </div>
      )}
    </div>
  );
}
