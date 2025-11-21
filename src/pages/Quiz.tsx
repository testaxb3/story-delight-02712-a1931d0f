import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import confetti from 'canvas-confetti';

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

  // Confetti trigger on progress milestones
  useEffect(() => {
    if (hasStarted && !showResult && currentQuestion > 0) {
      const progressPercent = ((currentQuestion + 1) / questions.length) * 100;
      if (progressPercent % 25 === 0 && progressPercent !== 100) {
        confetti({ 
          particleCount: 30, 
          spread: 50, 
          origin: { y: 0.3 },
          colors: ['#9b87f5', '#D6BCFA', '#FFD700']
        });
      }
    }
  }, [currentQuestion, hasStarted, showResult]);

  // Dramatic countdown before result reveal
  useEffect(() => {
    if (showResult && showCountdown) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setShowCountdown(false);
            // MASSIVE CONFETTI EXPLOSION
            confetti({ 
              particleCount: 200, 
              spread: 180, 
              origin: { y: 0.5 },
              colors: ['#9b87f5', '#D6BCFA', '#FFD700', '#FFA500'],
              startVelocity: 45,
              scalar: 1.2
            });
            return 0;
          }
          return prev - 1;
        });
      }, 800);
      return () => clearInterval(timer);
    }
  }, [showResult, showCountdown]);

  const handleAnswer = (value: string) => {
    // Mini confetti on click
    confetti({ 
      particleCount: 20, 
      spread: 40, 
      origin: { x: 0.5, y: 0.6 },
      colors: ['#9b87f5', '#D6BCFA']
    });
    
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
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const calculatedResult = calculateResult();
      setResult(calculatedResult);
      setShowResult(true);
      setShowCountdown(true);
      setCountdown(3);
      await persistChildProfile(calculatedResult.type);
    }
  };

  const handlePrevious = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2] 
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          {/* Floating sparkles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            {!hasStarted ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-10 shadow-2xl">
                  <div className="text-center space-y-8">
                    {/* 3D Animated Brain Icon with Glow */}
                    <motion.div 
                      className="relative w-24 h-24 mx-auto"
                      animate={{ 
                        scale: [1, 1.05, 1],
                        rotateY: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-primary/30 rounded-3xl blur-xl"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-3xl flex items-center justify-center shadow-lg shadow-primary/30">
                        <Brain className="w-12 h-12 text-primary-foreground" />
                      </div>
                    </motion.div>

                    <div>
                      {/* Animated Gradient Text */}
                      <motion.h2 
                        className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] bg-clip-text text-transparent"
                        animate={{ 
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
                        }}
                        transition={{ 
                          duration: 5, 
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        Discover Your Child's Brain Profile
                      </motion.h2>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        A scientifically-designed assessment to understand your child's unique neurodevelopmental patterns
                      </p>
                    </div>
                    
                    <div className="bg-muted/20 backdrop-blur-sm rounded-2xl p-8 space-y-4 text-left border border-border/30">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        What to expect:
                      </h3>
                      <ul className="space-y-4 text-muted-foreground">
                        <li className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          </div>
                          <span className="leading-relaxed">15 carefully crafted questions based on NEP System neuroscience</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          </div>
                          <span className="leading-relaxed">Takes approximately 5-7 minutes to complete</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          </div>
                          <span className="leading-relaxed">Identifies whether your child is Intense, Distracted, or Defiant</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          </div>
                          <span className="leading-relaxed">Personalized scripts and strategies based on results</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-6 pt-4">
                      <div className="space-y-3">
                        <Label htmlFor="childName" className="text-left block font-medium text-foreground text-base">
                          What's your child's name?
                        </Label>
                        <motion.div
                          animate={nameError ? {
                            x: [0, -10, 10, -10, 10, 0],
                          } : {}}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="relative">
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
                                "h-14 px-6 text-lg rounded-2xl border-2 transition-all duration-300",
                                "focus:border-primary focus:ring-4 focus:ring-primary/20",
                                nameError && "border-destructive focus:border-destructive focus:ring-destructive/20"
                              )}
                              maxLength={MAX_NAME_LENGTH}
                              autoComplete="off"
                            />
                            {isValidChildName(childName) && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="absolute right-4 top-1/2 -translate-y-1/2"
                              >
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          onClick={handleStartQuiz}
                          disabled={!isValidChildName(childName)}
                          size="lg"
                          className="relative w-full h-14 text-lg rounded-2xl overflow-hidden bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 shadow-lg shadow-primary/30 transition-all duration-300 group"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            Start Assessment
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                          
                          {/* Animated shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
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
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : !showResult ? (
              <motion.div
                key={`question-${currentQuestion}`}
                initial={{ opacity: 0, x: 100, rotateY: 20 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -100, rotateY: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={cn(
                  "bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl",
                  "bg-gradient-to-br",
                  questionGradients[currentQuestion % questionGradients.length]
                )}>
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2 rounded-full font-bold text-sm shadow-lg shadow-primary/30"
                        >
                          Question {currentQuestion + 1} of {questions.length}
                        </motion.div>
                        <span className="text-primary font-semibold text-lg">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full shadow-lg"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <motion.h3 
                        className="text-2xl font-semibold leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {questions[currentQuestion].question}
                      </motion.h3>

                      <RadioGroup
                        value={answers[currentQuestion]}
                        onValueChange={handleAnswer}
                        className="space-y-3"
                      >
                        {questions[currentQuestion].options.map((option, index) => (
                          <motion.div
                            key={option.value}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ 
                              scale: 1.02, 
                              y: -4,
                              boxShadow: "0 20px 40px rgba(155, 135, 245, 0.15)"
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Label
                              htmlFor={option.value}
                              className={cn(
                                "flex items-center space-x-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                                "bg-card/60 backdrop-blur-xl",
                                "hover:bg-card/80 hover:border-primary/50",
                                "hover:shadow-[0_0_30px_rgba(155,135,245,0.2)]",
                                answers[currentQuestion] === option.value
                                  ? "bg-primary/10 border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                                  : "border-border/50"
                              )}
                            >
                              <RadioGroupItem value={option.value} id={option.value} className="w-5 h-5" />
                              <span className="text-base leading-relaxed flex-1">{option.label}</span>
                            </Label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="flex gap-4 pt-4">
                      {currentQuestion > 0 && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1"
                        >
                          <Button
                            onClick={handlePrevious}
                            variant="outline"
                            size="lg"
                            className="w-full h-12 rounded-2xl border-2 group backdrop-blur-sm"
                          >
                            <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                            Previous
                          </Button>
                        </motion.div>
                      )}
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={currentQuestion > 0 ? 'flex-1' : 'w-full'}
                      >
                        <Button
                          onClick={handleNext}
                          disabled={!answers[currentQuestion]}
                          size="lg"
                          className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 group"
                        >
                          {currentQuestion < questions.length - 1 ? 'Next' : 'See Results'}
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {showCountdown ? (
                  // Dramatic Countdown
                  <div className="flex items-center justify-center min-h-[500px]">
                    <motion.div
                      key={countdown}
                      initial={{ scale: 0, opacity: 0, rotate: -180 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0, opacity: 0, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="text-9xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                    >
                      {countdown}
                    </motion.div>
                  </div>
                ) : (
                  // Result Card with 3D Flip
                  <motion.div
                    initial={{ rotateY: 90, scale: 0.8 }}
                    animate={{ rotateY: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ perspective: 1000 }}
                  >
                    <div className="backdrop-blur-2xl bg-gradient-to-br from-card via-card to-primary/5 border-4 border-primary/30 rounded-3xl p-10 shadow-[0_0_80px_rgba(155,135,245,0.3)] relative overflow-hidden">
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

                      <div className="text-center space-y-8 relative z-10">
                        {result && (
                          <>
                            {/* Pulsing Badge Icon */}
                            <motion.div
                              animate={{ 
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                  "0 0 20px rgba(155, 135, 245, 0.3)",
                                  "0 0 40px rgba(155, 135, 245, 0.6)",
                                  "0 0 20px rgba(155, 135, 245, 0.3)"
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <div className={cn(
                                "w-40 h-40 rounded-full flex items-center justify-center mx-auto shadow-2xl mb-6",
                                `bg-gradient-to-br ${brainTypeInfo[result.type].gradient}`
                              )}>
                                <Sparkles className="w-20 h-20 text-white" />
                              </div>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <Badge className="mb-6 text-lg px-6 py-2 rounded-full">{childName}</Badge>

                              <motion.h2
                                className={cn(
                                  "text-5xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent",
                                  brainTypeInfo[result.type].gradient
                                )}
                                animate={{
                                  scale: [1, 1.02, 1]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                {brainTypeInfo[result.type].title}
                              </motion.h2>
                              <p className="text-xl text-muted-foreground mb-6">
                                {brainTypeInfo[result.type].subtitle}
                              </p>
                              <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                                {brainTypeInfo[result.type].description}
                              </p>
                            </motion.div>

                            {savingProfile ? (
                              <motion.div 
                                className="bg-muted/20 backdrop-blur-sm rounded-2xl p-6 border border-border/30"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <div className="flex items-center justify-center gap-3">
                                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                  <p className="text-muted-foreground">Saving profile...</p>
                                </div>
                              </motion.div>
                            ) : saveError ? (
                              <motion.div 
                                className="bg-destructive/10 border-2 border-destructive/20 rounded-2xl p-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <p className="text-destructive font-medium">{saveError}</p>
                              </motion.div>
                            ) : null}

                            <motion.div 
                              className="pt-4"
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
                                  className="relative group overflow-hidden w-full h-16 text-xl rounded-2xl bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 shadow-2xl transition-all duration-300 disabled:opacity-50"
                                >
                                  <span className="relative z-10 flex items-center justify-center gap-2">
                                    {completingQuiz ? (
                                      <span className="animate-pulse">Finalizing...</span>
                                    ) : (
                                      <>
                                        See My Personalized Dashboard
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
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
