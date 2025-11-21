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
import { QuizMotivationalScreen } from '@/components/Quiz/QuizMotivationalScreen';
import { LottieIcon } from '@/components/LottieIcon';
import fingerHeartDark from '@/assets/lottie/calai/finger_heart_dark.json';

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
  const [showMotivational, setShowMotivational] = useState(false);
  const [motivationalMilestone, setMotivationalMilestone] = useState<25 | 50 | 75>(25);
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
    setAnswers({});
    setCurrentQuestion(0);
    setShowResult(false);
    setResult(null);
    setHasStarted(true);
    setSaveError(null);
  };

  const calculateResult = (): { type: BrainProfile; score: number } => {
    const result = calculateBrainProfile(answers);
    return {
      type: result.type,
      score: result.score
    };
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
          is_active: true
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
    
    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      const progress = ((nextQuestion + 1) / questions.length) * 100;
      
      // Check if we hit a milestone
      if (progress === 25 || progress === 50 || progress === 75) {
        setMotivationalMilestone(progress as 25 | 50 | 75);
        setShowMotivational(true);
        setCurrentQuestion(nextQuestion);
      } else {
        setCurrentQuestion(nextQuestion);
      }
    } else {
      const calculatedResult = calculateResult();
      setResult(calculatedResult);
      setShowResult(true);
      setShowCountdown(true);
      setCountdown(3);
      await persistChildProfile(calculatedResult.type);
    }
  };

  const handleContinueFromMotivational = () => {
    setShowMotivational(false);
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
            {!hasStarted ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-xl mx-auto">
                  <div className="space-y-6">
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
            ) : !showResult ? (
              showMotivational ? (
                <QuizMotivationalScreen
                  milestone={motivationalMilestone}
                  onContinue={handleContinueFromMotivational}
                />
              ) : (
              <motion.div
                key={`question-${currentQuestion}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-black"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <div className="space-y-6">
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

                  <div className="flex gap-4 pt-4">
                    {currentQuestion > 0 && (
                      <Button
                        onClick={handlePrevious}
                        variant="outline"
                        size="lg"
                        className="flex-1 h-14 rounded-2xl border-2 border-gray-200 bg-white hover:bg-gray-50 text-black"
                      >
                        <ArrowLeft className="mr-2 w-5 h-5" />
                        Previous
                      </Button>
                    )}
                    
                    <Button
                      onClick={handleNext}
                      disabled={!answers[currentQuestion]}
                      size="lg"
                      className={cn(
                        "h-14 rounded-2xl bg-black text-white hover:bg-black/90 disabled:bg-gray-200 disabled:text-gray-400 transition-colors",
                        currentQuestion > 0 ? 'flex-1' : 'w-full'
                      )}
                    >
                      {currentQuestion < questions.length - 1 ? 'Continue' : 'See Results'}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
              )
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {showCountdown ? (
                  countdown > 0 ? (
                    // Dramatic Countdown
                    <div className="flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                      <motion.div
                        key={countdown}
                        initial={{ scale: 0, opacity: 0, rotate: -180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="text-7xl md:text-9xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-relative"
                      >
                        {countdown}
                      </motion.div>
                    </div>
                  ) : (
                    // Loading Screen
                    <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl min-h-[400px] md:min-h-[500px]">
                      <QuizLoadingScreen />
                    </div>
                  )
                ) : (
                  // Result Card with 3D Flip
                  <motion.div
                    initial={{ rotateY: 90, scale: 0.8 }}
                    animate={{ rotateY: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ perspective: 1000 }}
                  >
                    <div className="backdrop-blur-2xl bg-gradient-to-br from-card via-card to-primary/5 border-2 md:border-4 border-primary/30 rounded-2xl md:rounded-3xl p-4 md:p-8 lg:p-10 shadow-[0_0_80px_rgba(155,135,245,0.3)] relative overflow-hidden">
                      {/* Animated background particles */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-primary/30 rounded-full"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                              x: [0, Math.random() * 100 - 50],
                              y: [0, Math.random() * 100 - 50],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 3 + Math.random() * 2,
                              repeat: Infinity,
                              delay: Math.random() * 2,
                            }}
                          />
                        ))}
                      </div>

                      <div className="text-center space-y-4 md:space-y-8 relative z-10">
                        {result && (
                          <>
                            {/* Celebration Lottie Animation */}
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
                              className="mx-auto mb-3 md:mb-6"
                            >
                              <LottieIcon
                                animationData={fingerHeartDark}
                                isActive={true}
                                size={window.innerWidth < 768 ? 100 : 160}
                                loop={true}
                                autoplay={true}
                              />
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <Badge className="mb-3 md:mb-6 text-sm md:text-lg px-4 md:px-6 py-1.5 md:py-2 rounded-full">{childName}</Badge>

                              <motion.h2
                                className={cn(
                                  "text-3xl md:text-5xl font-bold mb-2 md:mb-4 bg-gradient-to-r bg-clip-text text-transparent font-relative",
                                  brainTypeInfo[result.type].gradient
                                )}
                                animate={{
                                  scale: [1, 1.02, 1]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                {brainTypeInfo[result.type].title}
                              </motion.h2>
                              <p className="text-base md:text-xl text-muted-foreground mb-3 md:mb-6 px-2">
                                {brainTypeInfo[result.type].subtitle}
                              </p>
                              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-4 md:mb-8 px-2">
                                {brainTypeInfo[result.type].description}
                              </p>

                              {/* Progress Rings */}
                              <QuizResultRings 
                                brainType={result.type}
                                scriptsCount={45}
                                videosCount={12}
                                ebooksCount={3}
                              />
                            </motion.div>

                            {savingProfile ? (
                              <motion.div 
                                className="bg-muted/20 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border/30"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <div className="flex items-center justify-center gap-3">
                                  <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                  <p className="text-sm md:text-base text-muted-foreground">Saving profile...</p>
                                </div>
                              </motion.div>
                            ) : saveError ? (
                              <motion.div 
                                className="bg-destructive/10 border-2 border-destructive/20 rounded-xl md:rounded-2xl p-4 md:p-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <p className="text-sm md:text-base text-destructive font-medium">{saveError}</p>
                              </motion.div>
                            ) : null}

                            <motion.div 
                              className="pt-2 md:pt-4"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.8 }}
                            >
                              <motion.div
                                whileHover={{ 
                                  scale: 1.02,
                                  boxShadow: "0 30px 60px rgba(155, 135, 245, 0.4)"
                                }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Button 
                                  size="lg" 
                                  onClick={handleGoToDashboard}
                                  disabled={savingProfile || completingQuiz}
                                  className="relative group overflow-hidden w-full h-12 md:h-16 text-base md:text-xl rounded-xl md:rounded-2xl bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 shadow-2xl transition-all duration-300 disabled:opacity-50 font-relative"
                                >
                                  <span className="relative z-10 flex items-center justify-center gap-2">
                                    {completingQuiz ? (
                                      <span className="animate-pulse">Finalizing...</span>
                                    ) : (
                                      <>
                                        <span className="hidden sm:inline">See My Personalized Dashboard</span>
                                        <span className="sm:hidden">See My Dashboard</span>
                                        <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-300" />
                                      </>
                                    )}
                                  </span>
                                  
                                  {/* Animated shine effect */}
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ 
                                      duration: 2, 
                                      repeat: Infinity, 
                                      repeatDelay: 1,
                                      ease: "easeInOut"
                                    }}
                                  />
                                </Button>
                              </motion.div>
                            </motion.div>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
}
