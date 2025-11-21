import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
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
  const { refreshChildren, setActiveChild } = useChildProfiles();
  const queryClient = useQueryClient();

  useEffect(() => {
    const syncQuizState = async () => {
      if (user?.profileId) {
        try {
          await supabase
            .from('profiles')
            .update({ quiz_in_progress: hasStarted })
            .eq('id', user.profileId);
        } catch (error) {
          logger.error('Failed to sync quiz state:', error);
        }
      }
    };

    if (hasStarted) {
      syncQuizState();
    }
  }, [hasStarted, user]);

  // Dramatic countdown before result reveal
  useEffect(() => {
    if (showResult && showCountdown) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setShowCountdown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 800);
      return () => clearInterval(timer);
    }
  }, [showResult, showCountdown]);

  const handleAnswer = (value: string) => {
    // Haptic feedback (mobile)
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
  };

  const handleStartQuiz = () => {
    if (!isValidChildName(childName)) {
      setNameError(true);
      toast.error(`Child's name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters.`);
      return;
    }
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
    
    setNameError(false);
    setQuizStep('details'); // Move to details collection
  };

  const handleDetailsComplete = () => {
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
    setQuizStep('goals');
  };

  const handleGoalsComplete = () => {
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
    if (parentGoals.length === 0) {
      toast.error('Please select at least one goal');
      return;
    }
    setQuizStep('speed'); // Move to speed selection
  };

  const handleSpeedComplete = () => {
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
    setShowPostSpeedMotivational(true);
  };

  const handlePostSpeedMotivationalContinue = () => {
    setShowPostSpeedMotivational(false);
    setQuizStep('challenge');
  };

  const handleChallengeComplete = () => {
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
    if (!challengeDuration) {
      toast.error('Please select how long you have been facing this challenge');
      return;
    }
    setAnswers({});
    setCurrentQuestion(0);
    setShowResult(false);
    setResult(null);
    setHasStarted(true);
    setSaveError(null);
    setQuizStep('questions');
  };

  const toggleParentGoal = (goal: string) => {
    setParentGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const toggleApproach = (approach: string) => {
    setTriedApproaches(prev =>
      prev.includes(approach) ? prev.filter(a => a !== approach) : [...prev, approach]
    );
  };

  const calculateResult = (): { type: BrainProfile; score: number } => {
    const result = calculateBrainProfile(answers);
    return {
      type: result.type,
      score: result.score
    };
  };

  const getDevelopmentPhase = (age: number): string => {
    if (age < 2) return 'baby';
    if (age < 4) return 'toddler';
    if (age < 10) return 'child';
    if (age < 13) return 'preteen';
    return 'teen';
  };

  const persistChildProfile = async (brainType: BrainProfile): Promise<boolean> => {
    if (!user?.profileId) {
      logger.error('No user profile ID found');
      setSaveError('Unable to save profile. Please try again.');
      return false;
    }

    setSavingProfile(true);
    setSaveError(null);

    try {
      const sanitizedName = sanitizeChildName(childName);

      const { data: existingProfiles, error: fetchError } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('parent_id', user.profileId);

      if (fetchError) {
        logger.error('Error fetching existing profiles:', fetchError);
        setSaveError('Unable to check existing profiles. Please try again.');
        setSavingProfile(false);
        return false;
      }

      const duplicateName = existingProfiles?.some(
        profile => profile.name.toLowerCase() === sanitizedName.toLowerCase()
      );

      if (duplicateName) {
        setSaveError(`A profile with the name "${sanitizedName}" already exists.`);
        setSavingProfile(false);
        return false;
      }

      const { data: newChild, error: insertError } = await supabase
        .from('child_profiles')
        .insert({
          name: sanitizedName,
          brain_profile: brainType,
          parent_id: user.profileId,
          is_active: true,
          age_exact: childAge,
          development_phase: getDevelopmentPhase(childAge),
          parent_goals: parentGoals,
          challenge_level: challengeLevel,
          challenge_duration: challengeDuration,
          tried_approaches: triedApproaches,
          result_speed: resultSpeed
        })
        .select()
        .single();

      if (insertError) {
        logger.error('Error inserting child profile:', insertError);
        if (insertError.code === '23505') {
          setSaveError('A profile with this name already exists.');
        } else {
          setSaveError('Unable to save profile. Please try again.');
        }
        setSavingProfile(false);
        return false;
      }

      if (newChild) {
        await refreshChildren();
        setActiveChild(newChild.id);
      }

      setSavingProfile(false);
      return true;
    } catch (error) {
      logger.error('Unexpected error:', error);
      setSaveError('An unexpected error occurred. Please try again.');
      setSavingProfile(false);
      return false;
    }
  };

  const handleNext = async () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    // Show Thank You screen after 5th question (index 4)
    if (currentQuestion === 4) {
      setShowThankYou(true);
      setCurrentQuestion(5);
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Last question - show Pre-Loading screen
      setShowPreLoading(true);
    }
  };

  const handleThankYouContinue = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
    setShowThankYou(false);
    // currentQuestion is already set to 5 (next question) in handleNext
  };

  const handlePreLoadingContinue = async () => {
    setShowPreLoading(false);
    
    // Calculate result and save profile
    const calculatedResult = calculateResult();
    setResult(calculatedResult);
    setShowResult(true);
    setShowCountdown(true);
    setCountdown(3);
    await persistChildProfile(calculatedResult.type);
  };

  const handlePrevious = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleGoToDashboard = async () => {
    if (savingProfile || completingQuiz) return;

    // Show final celebration before navigation
    setShowFinalCelebration(true);
  };

  const handleCelebrationComplete = async () => {
    setCompletingQuiz(true);

    if (user?.profileId) {
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            quiz_completed: true,
            quiz_in_progress: false
          })
          .eq('id', user.profileId);

        if (profileError) {
          logger.error('Failed to update quiz completion (profile):', profileError);
          toast.error('Failed to save progress. Please try again.');
          setCompletingQuiz(false);
          return;
        }

        await supabase
          .from('user_progress')
          .update({ quiz_completed: true })
          .eq('user_id', user.profileId)
          .then(({ error }) => {
            if (error) logger.warn('user_progress update failed; proceeding anyway:', error);
          });

        queryClient.setQueryData(['user-profile', user.profileId], (old: any) => {
          if (!old) return old;
          return {
            ...old,
            quiz_completed: true,
            quiz_in_progress: false
          };
        });

        queryClient.invalidateQueries({ queryKey: ['user-profile', user.profileId] });
        queryClient.invalidateQueries({ queryKey: ['child-profiles'] });

        sessionStorage.setItem('quizJustCompletedAt', Date.now().toString());

        await Promise.all([
          refreshChildren(),
          refreshUser()
        ]);

        await new Promise(resolve => setTimeout(resolve, 500));

        toast.success('Profile created successfully!');

        const shouldShowPWAOnboarding = () => {
          const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
          const completedOnboarding = localStorage.getItem('pwa_onboarding_completed');
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          
          return isMobile && !isInstalled && !completedOnboarding;
        };

        if (shouldShowPWAOnboarding()) {
          navigate('/onboarding', { replace: true });
        } else {
          navigate('/', { replace: true, state: { quizJustCompleted: true } });
        }
      } catch (error) {
        logger.error('Failed to update quiz completion:', error);
        toast.error('An error occurred. Please try again.');
        setCompletingQuiz(false);
        return;
      }
    } else {
      sessionStorage.setItem('quizJustCompletedAt', Date.now().toString());
      
      const shouldShowPWAOnboarding = () => {
        const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
        const completedOnboarding = localStorage.getItem('pwa_onboarding_completed');
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        return isMobile && !isInstalled && !completedOnboarding;
      };

      if (shouldShowPWAOnboarding()) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/', { replace: true, state: { quizJustCompleted: true } });
      }
    }
  };

  const brainTypeInfo: Record<BrainProfile, {
    title: string;
    subtitle: string;
    description: string;
    gradient: string;
  }> = {
    INTENSE: {
      title: 'INTENSE Brain',
      subtitle: 'Highly sensitive, emotionally intense, and deeply connected',
      description: 'Your child has a highly reactive nervous system that processes emotions and sensory information more intensely than others.',
      gradient: 'from-intense via-intense/80 to-intense/60'
    },
    DISTRACTED: {
      title: 'DISTRACTED Brain',
      subtitle: 'Easily distracted, impulsive, and always on the move',
      description: 'Your child\'s brain seeks constant stimulation and has difficulty with sustained attention and impulse control.',
      gradient: 'from-distracted via-distracted/80 to-distracted/60'
    },
    DEFIANT: {
      title: 'DEFIANT Brain',
      subtitle: 'Strong-willed, power-seeking, and autonomy-driven',
      description: 'Your child\'s brain is wired for independence and control, making them question authority naturally.',
      gradient: 'from-defiant via-defiant/80 to-defiant/60'
    }
  };

  const progress = hasStarted ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  const questionGradients = [
    'from-primary/5 via-accent/5 to-primary/5',
    'from-intense/5 via-distracted/5 to-defiant/5',
    'from-accent/5 via-primary/10 to-accent/5',
    'from-primary/10 via-accent/5 to-primary/5',
    'from-distracted/5 via-intense/5 to-primary/5'
  ];

  return (
    <MainLayout hideBottomNav hideSideNav hideTopBar>
      <div className="min-h-screen bg-white py-4 md:py-8 px-4 relative overflow-hidden">

        <div className="max-w-2xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            {/* Special screens with keys for AnimatePresence */}
            {showFinalCelebration && result ? (
              <div key="final-celebration">
                <QuizFinalCelebration
                  brainType={result.type}
                  onComplete={handleCelebrationComplete}
                />
              </div>
            ) : showPostSpeedMotivational ? (
              <div key="post-speed-motivational">
                <QuizPostSpeedMotivationalScreen
                  selectedGoals={parentGoals}
                  onContinue={handlePostSpeedMotivationalContinue}
                />
              </div>
            ) : showThankYou ? (
              <div key="thank-you">
                <QuizThankYouScreen
                  onContinue={handleThankYouContinue}
                />
              </div>
            ) : showPreLoading && result ? (
              <div key="pre-loading">
                <QuizPreLoadingScreen
                  brainType={result.type}
                  onContinue={handlePreLoadingContinue}
                />
              </div>
            ) : quizStep === 'name' ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-xl mx-auto relative">
                  {/* Page Number */}
                  <div className="absolute top-0 left-0 z-10">
                    <div className="w-8 h-8 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black dark:text-white">1</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6 pt-10">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-black mb-3 font-relative">
                        Discover Your Child's Brain Profile
                      </h2>
                      <p className="text-gray-500 text-base md:text-lg">
                        A scientifically-designed assessment to understand your child's unique neurodevelopmental patterns
                      </p>
                    </div>

                    <div className="space-y-6 pt-4">
                      <div className="space-y-3">
                        <Label htmlFor="childName" className="text-left block font-medium text-black text-base">
                          What's your child's name?
                        </Label>
                        <Input
                          id="childName"
                          type="text"
                          placeholder="Enter child's name"
                          value={childName}
                          onChange={(e) => {
                            setChildName(e.target.value);
                            setNameError(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && isValidChildName(childName)) {
                              handleStartQuiz();
                            }
                          }}
                          className={cn(
                            "h-14 px-5 text-base rounded-2xl border-2 border-gray-200 bg-white transition-colors",
                            "focus:border-black focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                            nameError && "border-red-500"
                          )}
                          maxLength={MAX_NAME_LENGTH}
                          autoComplete="off"
                        />
                      </div>

                      <Button 
                        onClick={handleStartQuiz}
                        disabled={!isValidChildName(childName)}
                        size="lg"
                        className="w-full h-14 text-base font-medium rounded-2xl bg-black text-white hover:bg-black/90 disabled:bg-gray-200 disabled:text-gray-400 transition-colors font-relative"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : quizStep === 'details' ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="min-h-screen flex flex-col"
              >
                {/* Header */}
                <div className="fixed top-0 left-0 right-0 z-50 bg-white">
                  <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                    {/* Back Button */}
                    <button
                      onClick={() => setQuizStep('name')}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-black" />
                    </button>
                    
                    {/* Page Number */}
                    <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black">2</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-20 pb-24 px-4">
                  <div className="max-w-xl mx-auto space-y-6">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-black mb-3 font-relative">
                        Tell us about {childName}
                      </h2>
                      <p className="text-gray-500 text-sm md:text-base">
                        This helps us personalize strategies for their developmental stage
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-left block font-medium text-black text-base">
                          How old is {childName}?
                        </Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            value={[childAge]}
                            onValueChange={(value) => setChildAge(value[0])}
                            min={1}
                            max={18}
                            step={1}
                            className="flex-1"
                          />
                          <div className="w-16 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                            <span className="text-2xl font-bold text-black">{childAge}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">Age: {childAge} years old</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed Bottom Button */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50">
                  <div className="max-w-2xl mx-auto">
                    <Button 
                      onClick={handleDetailsComplete}
                      size="lg"
                      className="w-full h-14 text-base font-medium rounded-xl bg-black text-white hover:bg-black/90 font-relative shadow-xl"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : quizStep === 'goals' ? (
              <motion.div
                key="goals"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="min-h-screen flex flex-col"
              >
                {/* Header */}
                <div className="fixed top-0 left-0 right-0 z-50 bg-white">
                  <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                    {/* Back Button */}
                    <button
                      onClick={() => setQuizStep('details')}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-black" />
                    </button>
                    
                    {/* Page Number */}
                    <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black">3</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-20 pb-24 px-4">
                  <div className="max-w-xl mx-auto space-y-6">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-black mb-3 font-relative">
                        What do you most want to improve?
                      </h2>
                      <p className="text-gray-500 text-sm md:text-base">
                        Select all that apply - we'll prioritize these in your plan
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { value: 'tantrums', label: 'Tantrums & Meltdowns', emoji: '😤' },
                        { value: 'sleep', label: 'Sleep Routine', emoji: '😴' },
                        { value: 'eating', label: 'Eating & Mealtimes', emoji: '🍽️' },
                        { value: 'focus', label: 'Focus & Concentration', emoji: '🎯' },
                        { value: 'family', label: 'Family Relationships', emoji: '❤️' },
                        { value: 'transitions', label: 'Transitions & Changes', emoji: '🔄' },
                        { value: 'school', label: 'School Behavior', emoji: '📚' }
                      ].map((goal) => (
                        <div
                          key={goal.value}
                          onClick={() => toggleParentGoal(goal.value)}
                          className={cn(
                            "p-4 rounded-xl border-2 cursor-pointer transition-all",
                            parentGoals.includes(goal.value)
                              ? "border-black bg-black text-white"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={parentGoals.includes(goal.value)}
                              className="pointer-events-none"
                            />
                            <span className="text-2xl">{goal.emoji}</span>
                            <span className="font-medium">{goal.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fixed Bottom Button */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50">
                  <div className="max-w-2xl mx-auto">
                    <Button 
                      onClick={handleGoalsComplete}
                      size="lg"
                      disabled={parentGoals.length === 0}
                      className="w-full h-14 text-base font-medium rounded-xl bg-black text-white hover:bg-black/90 disabled:bg-gray-200 disabled:text-gray-400 font-relative shadow-xl"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : quizStep === 'speed' ? (
              <motion.div
                key="speed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="min-h-screen flex flex-col"
              >
                {/* Header */}
                <div className="fixed top-0 left-0 right-0 z-50 bg-white">
                  <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                    {/* Back Button */}
                    <button
                      onClick={() => setQuizStep('goals')}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-black" />
                    </button>
                    
                    {/* Page Number */}
                    <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black">4</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-14 pb-24">
                  <QuizSpeedSlider
                    value={resultSpeed}
                    onChange={setResultSpeed}
                  />
                </div>

                {/* Fixed Bottom Button */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50">
                  <div className="max-w-2xl mx-auto">
                    <Button 
                      onClick={handleSpeedComplete}
                      size="lg"
                      className="w-full h-14 text-base font-medium rounded-xl bg-black text-white hover:bg-black/90 font-relative shadow-xl"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : quizStep === 'challenge' ? (
              <motion.div
                key="challenge"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="min-h-screen flex flex-col"
              >
                {/* Header */}
                <div className="fixed top-0 left-0 right-0 z-50 bg-white">
                  <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                    {/* Back Button */}
                    <button
                      onClick={() => setQuizStep('speed')}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-black" />
                    </button>
                    
                    {/* Page Number */}
                    <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black">6</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-20 pb-24 px-4">
                  <div className="max-w-xl mx-auto space-y-6">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-black mb-3 font-relative">
                        How challenging has it been?
                      </h2>
                      <p className="text-gray-500 text-sm md:text-base">
                        Help us understand your current situation
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-left block font-medium text-black text-base">
                          Challenge Level
                        </Label>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Slider
                              value={[challengeLevel]}
                              onValueChange={(value) => setChallengeLevel(value[0])}
                              min={1}
                              max={10}
                              step={1}
                              className="flex-1"
                            />
                            <div className="w-16 h-14 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                              <span className="text-2xl font-bold text-white">{challengeLevel}</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>1 - Manageable</span>
                            <span>10 - Overwhelming</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-left block font-medium text-black text-base">
                          How long have you been facing this?
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          {['weeks', 'months', 'years', 'always'].map((duration) => (
                            <div
                              key={duration}
                              onClick={() => setChallengeDuration(duration)}
                              className={cn(
                                "p-4 rounded-xl border-2 cursor-pointer transition-all text-center",
                                challengeDuration === duration
                                  ? "border-black bg-black text-white"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              )}
                            >
                              <span className="font-medium capitalize">{duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-left block font-medium text-black text-base">
                          What have you already tried? (Optional)
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {['time_out', 'rewards', 'consequences', 'ignoring', 'talking', 'other_methods'].map((approach) => (
                            <div
                              key={approach}
                              onClick={() => toggleApproach(approach)}
                              className={cn(
                                "p-3 rounded-lg border cursor-pointer transition-all text-center text-sm",
                                triedApproaches.includes(approach)
                                  ? "border-black bg-black/5"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              )}
                            >
                              <span className="capitalize">{approach.replace('_', ' ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed Bottom Button */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50">
                  <div className="max-w-2xl mx-auto">
                    <Button 
                      onClick={handleChallengeComplete}
                      size="lg"
                      disabled={!challengeDuration}
                      className="w-full h-14 text-base font-medium rounded-xl bg-black text-white hover:bg-black/90 disabled:bg-gray-200 disabled:text-gray-400 font-relative shadow-xl"
                    >
                      Start Quiz
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : quizStep === 'questions' && !showResult ? (
              <motion.div
                key={`question-${currentQuestion}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="min-h-screen flex flex-col"
              >
                {/* Header: Progress Bar + Back Button + Page Number */}
                <div className="fixed top-0 left-0 right-0 z-50 bg-white">
                  <div className="relative h-1 bg-gray-200">
                    <motion.div 
                      className="h-full bg-black"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                    {/* Back Button */}
                    {currentQuestion > 0 && (
                      <button
                        onClick={handlePrevious}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5 text-black" />
                      </button>
                    )}
                    {currentQuestion === 0 && <div className="w-10" />}
                    
                    {/* Page Number */}
                    <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black">{7 + currentQuestion}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-20 pb-24 px-4">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-black mb-3 font-relative">
                        {questions[currentQuestion].question}
                      </h3>
                      <p className="text-gray-500 text-sm md:text-base">
                        This will be used to calibrate your custom plan.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((option, index) => (
                        <motion.div
                          key={option.value}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                        >
                          <QuizOptionCard
                            value={option.value}
                            label={option.label}
                            isSelected={answers[currentQuestion] === option.value}
                            onSelect={handleAnswer}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fixed Bottom Button */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50">
                  <div className="max-w-2xl mx-auto">
                    <Button
                      onClick={handleNext}
                      disabled={!answers[currentQuestion]}
                      size="lg"
                      className="w-full h-14 text-base font-medium rounded-xl bg-black text-white hover:bg-black/90 disabled:bg-gray-200 disabled:text-gray-400 transition-colors font-relative shadow-xl"
                    >
                      {currentQuestion < questions.length - 1 ? 'Continue' : 'See Results'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : showResult && showCountdown ? (
              <motion.div
                key="countdown"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center min-h-[60vh] relative"
              >
                {/* Page Number */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="w-8 h-8 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-black dark:text-white">20</span>
                  </div>
                </div>

                <div className="text-center">
                  <motion.div
                    key={countdown}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <div className="text-[12rem] md:text-[15rem] font-black text-black dark:text-white font-relative leading-none">
                      {countdown}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : showResult && !showCountdown && result ? (
              <div className="relative">
                {/* Page Number */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="w-8 h-8 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-black dark:text-white">21</span>
                  </div>
                </div>

                <div className="space-y-8">
                  <QuizEnhancedResults
                    brainType={result.type}
                    childName={childName}
                    challengeLevel={challengeLevel}
                    parentGoals={parentGoals}
                  />

                  <div className="flex flex-col items-center gap-4 mt-8">
                    {savingProfile && (
                      <p className="text-sm text-gray-500">Saving profile...</p>
                    )}
                    {saveError && (
                      <p className="text-sm text-red-500">{saveError}</p>
                    )}
                    
                    <Button
                      onClick={handleGoToDashboard}
                      disabled={savingProfile || completingQuiz}
                      className="w-full max-w-md h-14 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 text-base font-bold rounded-xl disabled:opacity-50 shadow-xl hover:shadow-2xl transition-shadow"
                    >
                      {completingQuiz ? 'Finalizing...' : 'See My Dashboard'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
}
