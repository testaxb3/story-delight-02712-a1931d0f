import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { logger } from '@/lib/logger';
import { quizQuestions, calculateBrainProfile } from '@/lib/quizQuestions';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { QuizResultRings } from '@/components/Quiz/QuizResultRings';
import { QuizOptionCard } from '@/components/Quiz/QuizOptionCard';
import { QuizLoadingScreen } from '@/components/Quiz/QuizLoadingScreen';
import { QuizEnhancedResults } from '@/components/Quiz/QuizEnhancedResults';
import { QuizSpeedSlider } from '@/components/Quiz/QuizSpeedSlider';
import { QuizFinalCelebration } from '@/components/Quiz/QuizFinalCelebration';
import { QuizThankYouScreen } from '@/components/Quiz/QuizThankYouScreen';
import { QuizPreLoadingScreen } from '@/components/Quiz/QuizPreLoadingScreen';
import { QuizPostSpeedMotivationalScreen } from '@/components/Quiz/QuizPostSpeedMotivationalScreen';
import { LottieIcon } from '@/components/LottieIcon';
import fingerHeartDark from '@/assets/lottie/calai/finger_heart_dark.json';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

type BrainCategory = 'INTENSE' | 'DISTRACTED' | 'DEFIANT' | 'NEUTRAL';
type BrainProfile = 'INTENSE' | 'DISTRACTED' | 'DEFIANT';

const questions = quizQuestions;

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;

const sanitizeChildName = (name: string): string => {
  return name
    .trim()
    .replace(/[<>]/g, '')
    .replace(/[^\\w\\s\\-']/g, '')
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

interface Option {
  value: string;
  label: string;
  scores?: Partial<Record<BrainCategory, number>>;
}

interface Question {
  question: string;
  options: Option[];
}

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ type: BrainProfile; score: number } | null>(null);
  const [childName, setChildName] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [completingQuiz, setCompletingQuiz] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showPreLoading, setShowPreLoading] = useState(false);
  const [showPostSpeedMotivational, setShowPostSpeedMotivational] = useState(false);
  
  // Enhanced quiz data
  const [childAge, setChildAge] = useState<number>(5);
  const [parentGoals, setParentGoals] = useState<string[]>([]);
  const [challengeLevel, setChallengeLevel] = useState<number>(5);
  const [challengeDuration, setChallengeDuration] = useState<string>('');
  const [triedApproaches, setTriedApproaches] = useState<string[]>([]);
  const [resultSpeed, setResultSpeed] = useState<'slow' | 'balanced' | 'intensive'>('balanced');
  const [quizStep, setQuizStep] = useState<'name' | 'details' | 'goals' | 'speed' | 'challenge' | 'questions'>('name');
  const [showFinalCelebration, setShowFinalCelebration] = useState(false);
  
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { theme } = useTheme();
  const { refreshChildren, setActiveChild } = useChildProfiles();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (countdown > 0 && showCountdown) {
      setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
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
        setShowFinalCelebration(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [completingQuiz]);

  useEffect(() => {
    if (showFinalCelebration) {
      const timer = setTimeout(() => {
        setShowFinalCelebration(false);
        setShowThankYou(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showFinalCelebration]);

  useEffect(() => {
    if (showThankYou) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showThankYou, navigate]);

  const startQuiz = () => {
    setHasStarted(true);
    setShowPreLoading(true);

    // Simulate pre-loading delay
    setTimeout(() => {
      setShowPreLoading(false);
    }, 1500);
  };

  const handleAnswer = (questionIndex: number, answer: string) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const calculateResult = () => {
    const brainProfile = calculateBrainProfile(questions, answers);
    setResult(brainProfile);
    return brainProfile;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult(null);
    setChildName('');
    setHasStarted(false);
    setSavingProfile(false);
    setSaveError(null);
    setCompletingQuiz(false);
    setCountdown(3);
    setShowCountdown(false);
    setNameError(false);
    setShowThankYou(false);
    setShowPreLoading(false);
    setChildAge(5);
    setParentGoals([]);
    setChallengeLevel(5);
    setChallengeDuration('');
    setTriedApproaches([]);
    setResultSpeed('balanced');
    setQuizStep('name');
    setShowFinalCelebration(false);
  };

  const saveChildProfile = async () => {
    if (!user) {
      logger.error('No user found, please login');
      return;
    }

    if (!result) {
      logger.error('No result found, please complete the quiz');
      return;
    }

    setSavingProfile(true);
    setSaveError(null);

    try {
      const sanitizedName = sanitizeChildName(childName);

      const { data: existingProfile, error: existingProfileError } = await supabase
        .from('children')
        .select('*')
        .eq('name', sanitizedName)
        .eq('user_id', user.id)
        .single();

      if (existingProfileError && existingProfileError.code !== 'PGRST116') {
        throw existingProfileError;
      }

      if (existingProfile) {
        setSaveError('A profile with this name already exists.');
        return;
      }

      const { data, error } = await supabase.from('children').insert([
        {
          name: sanitizedName,
          brain_profile: result.type,
          user_id: user.id,
          quiz_score: result.score,
          age: childAge,
          parent_goals: parentGoals,
          challenge_level: challengeLevel,
          challenge_duration: challengeDuration,
          tried_approaches: triedApproaches,
          result_speed: resultSpeed,
        },
      ]);

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from supabase');
      }

      await refreshChildren();
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ['children'] });
      const newChild = data[0];
      setActiveChild(newChild);

      toast.success(`Profile for ${sanitizedName} saved!`);
      logger.debug(`Profile saved for ${sanitizedName} with id ${newChild.id}`);

      return newChild;
    } catch (error: any) {
      logger.error('Error saving profile', error);
      setSaveError(error.message || 'Failed to save profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setChildName(name);
    setNameError(!isValidChildName(name));
  };

  const completeQuiz = async () => {
    const finalResult = calculateResult();
    if (finalResult) {
      await saveChildProfile();
    }
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
        setShowPostSpeedMotivational(true);
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
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setShowCountdown(true);
        }
        break;
      default:
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
      default:
        break;
    }
  };

  const handleGoalToggle = (goal: string) => {
    setParentGoals((prevGoals) =>
      prevGoals.includes(goal) ? prevGoals.filter((g) => g !== goal) : [...prevGoals, goal]
    );
  };

  const handleApproachToggle = (approach: string) => {
    setTriedApproaches((prevApproaches) =>
      prevApproaches.includes(approach) ? prevApproaches.filter((a) => a !== approach) : [...prevApproaches, approach]
    );
  };

  const canProceed = () => {
    switch (quizStep) {
      case 'name':
        return isValidChildName(childName);
      case 'details':
        return childAge > 0;
      case 'goals':
        return parentGoals.length > 0;
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

  const currentPage = (() => {
    switch (quizStep) {
      case 'name':
        return 'name';
      case 'details':
        return 'details';
      case 'goals':
        return 'goals';
      case 'speed':
        return 'speed';
      case 'challenge':
        return 'challenge';
      case 'questions':
        return 'questions';
      default:
        return 'name';
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
        return 6;
      default:
        return 1;
    }
  })();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      {/* Progress Bar - Full Width */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black shadow-sm">
        <div className="h-1 bg-gray-200 dark:bg-gray-800">
          <motion.div
            className="h-full bg-black dark:bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="px-4 h-14 flex items-center justify-between">
          {/* Back Button */}
          {currentPage !== 'name' && !showResult && !showPreLoading && !showFinalCelebration && (
            <button
              onClick={handlePrevious}
              className="w-10 h-10 flex items-center justify-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          {/* Page Number Badge */}
          <div className="ml-auto w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-black dark:text-white">{pageNumber}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {showPreLoading ? (
          <motion.div
            key="preloading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex items-center justify-center"
          >
            <QuizPreLoadingScreen />
          </motion.div>
        ) : showPostSpeedMotivational ? (
          <motion.div
            key="postSpeedMotivational"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex items-center justify-center"
          >
            <QuizPostSpeedMotivationalScreen />
          </motion.div>
        ) : quizStep === 'name' ? (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="container flex-grow flex flex-col items-center justify-center gap-4 p-4"
          >
            <h1 className="text-2xl font-bold text-center text-black dark:text-white">
              What is your child's name?
            </h1>
            <Input
              type="text"
              placeholder="Enter child's name"
              value={childName}
              onChange={handleNameChange}
              className={cn(
                'w-full max-w-md text-center rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-sm dark:bg-gray-900 dark:text-white',
                nameError && 'border-red-500 dark:border-red-500'
              )}
            />
            {nameError && (
              <p className="text-red-500 dark:text-red-400">
                Please enter a valid name (2-50 characters, letters, numbers, spaces, hyphens, and apostrophes only).
              </p>
            )}
          </motion.div>
        ) : quizStep === 'details' ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="container flex-grow flex flex-col items-center justify-center gap-4 p-4"
          >
            <h1 className="text-2xl font-bold text-center text-black dark:text-white">
              How old is your child?
            </h1>
            <Input
              type="number"
              placeholder="Enter child's age"
              value={childAge}
              onChange={(e) => setChildAge(Number(e.target.value))}
              className="w-full max-w-md text-center rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-sm dark:bg-gray-900 dark:text-white"
            />
          </motion.div>
        ) : quizStep === 'goals' ? (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="container flex-grow flex flex-col items-center justify-center gap-4 p-4"
          >
            <h1 className="text-2xl font-bold text-center text-black dark:text-white">
              What are your primary goals for your child?
            </h1>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                'Improve Focus',
                'Reduce Defiance',
                'Enhance Emotional Regulation',
                'Boost Confidence',
              ].map((goal) => (
                <Button
                  key={goal}
                  variant="outline"
                  className={cn(
                    'rounded-full',
                    parentGoals.includes(goal)
                      ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90'
                      : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                  onClick={() => handleGoalToggle(goal)}
                >
                  {goal}
                </Button>
              ))}
            </div>
          </motion.div>
        ) : quizStep === 'speed' ? (
          <motion.div
            key="speed"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="container flex-grow flex flex-col items-center justify-center gap-4 p-4"
          >
            <h1 className="text-2xl font-bold text-center text-black dark:text-white">
              How quickly do you want to see results?
            </h1>
            <QuizSpeedSlider setResultSpeed={setResultSpeed} resultSpeed={resultSpeed} />
          </motion.div>
        ) : quizStep === 'challenge' ? (
          <motion.div
            key="challenge"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="container flex-grow flex flex-col items-center justify-center gap-4 p-4"
          >
            <h1 className="text-2xl font-bold text-center text-black dark:text-white">
              What is the typical duration of a challenge or difficult behavior?
            </h1>
            <div className="flex flex-wrap justify-center gap-4">
              {['Less than 5 minutes', '5-15 minutes', '15-30 minutes', '30+ minutes'].map(
                (duration) => (
                  <Button
                    key={duration}
                    variant="outline"
                    className={cn(
                      'rounded-full',
                      challengeDuration === duration
                        ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90'
                        : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                    onClick={() => setChallengeDuration(duration)}
                  >
                    {duration}
                  </Button>
                )
              )}
            </div>

            <h2 className="text-xl font-semibold text-center text-black dark:text-white mt-6">
              What approaches have you already tried?
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                'Time-outs',
                'Reward Charts',
                'Ignoring Behavior',
                'Yelling',
                'Taking Away Privileges',
              ].map((approach) => (
                <Button
                  key={approach}
                  variant="outline"
                  className={cn(
                    'rounded-full',
                    triedApproaches.includes(approach)
                      ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90'
                      : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                  onClick={() => handleApproachToggle(approach)}
                >
                  {approach}
                </Button>
              ))}
            </div>
          </motion.div>
        ) : hasStarted ? (
          <motion.div
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="container flex-grow flex flex-col items-center justify-center gap-4 p-4"
          >
            <h1 className="text-2xl font-bold text-center text-black dark:text-white">
              {questions[currentQuestion].question}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {questions[currentQuestion].options.map((option) => (
                <QuizOptionCard
                  key={option.value}
                  option={option}
                  selected={answers[currentQuestion] === option.value}
                  onSelect={() => handleAnswer(currentQuestion, option.value)}
                />
              ))}
            </div>
          </motion.div>
        ) : showCountdown ? (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex items-center justify-center"
          >
            <h1 className="text-6xl font-bold text-center text-black dark:text-white">
              {countdown}
            </h1>
          </motion.div>
        ) : completingQuiz ? (
          <motion.div
            key="completing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex items-center justify-center"
          >
            <QuizLoadingScreen />
          </motion.div>
        ) : showFinalCelebration ? (
          <motion.div
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex items-center justify-center"
          >
            <QuizFinalCelebration />
          </motion.div>
        ) : showThankYou ? (
          <motion.div
            key="thankyou"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex items-center justify-center"
          >
            <QuizThankYouScreen />
          </motion.div>
        ) : (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="container flex-grow flex flex-col items-center justify-center gap-4 p-4"
          >
            <h1 className="text-3xl font-bold text-center text-black dark:text-white">
              Welcome to the Brain Profile Quiz!
            </h1>
            <p className="text-lg text-center text-gray-600 dark:text-gray-400">
              This quiz will help you understand your child's unique brain profile.
            </p>
            <Button
              onClick={startQuiz}
              className="w-full max-w-md h-14 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 text-base font-bold rounded-xl shadow-xl hover:shadow-2xl transition-shadow"
            >
              Start Quiz
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 px-4 py-4 z-50">
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full h-14 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-base font-bold rounded-xl shadow-xl hover:shadow-2xl transition-shadow"
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}
