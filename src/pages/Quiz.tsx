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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshChildren, setActiveChild } = useChildProfiles();

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

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
  };

  const handleStartQuiz = () => {
    if (!isValidChildName(childName)) {
      toast.error(`Child's name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters.`);
      return;
    }
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
      await persistChildProfile(calculatedResult.type);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleGoToDashboard = async () => {
    if (savingProfile) return;

    if (user?.profileId) {
      try {
        await supabase
          .from('profiles')
          .update({
            quiz_completed: true,
            quiz_in_progress: false
          })
          .eq('id', user.profileId);
      } catch (error) {
        logger.error('Failed to update quiz completion:', error);
      }
    }

    navigate('/dashboard');
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

  return (
    <MainLayout hideBottomNav hideSideNav hideTopBar>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4 relative overflow-hidden">
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
                <div className="backdrop-blur-2xl bg-card/80 border border-border/50 rounded-3xl p-10 shadow-2xl shadow-primary/10">
                  <div className="text-center space-y-8">
                    <motion.div 
                      className="w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-primary/20"
                      animate={{ 
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Brain className="w-12 h-12 text-primary-foreground" />
                    </motion.div>

                    <div>
                      <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        Discover Your Child's Brain Profile
                      </h2>
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
                        <Input
                          id="childName"
                          type="text"
                          placeholder="Enter child's name"
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && isValidChildName(childName)) {
                              handleStartQuiz();
                            }
                          }}
                          className="h-14 px-6 text-lg rounded-2xl border-2 focus:border-primary transition-all duration-300"
                          maxLength={MAX_NAME_LENGTH}
                          autoComplete="off"
                        />
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          onClick={handleStartQuiz}
                          disabled={!isValidChildName(childName)}
                          size="lg"
                          className="w-full h-14 text-lg rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all duration-300 group"
                        >
                          Start Assessment
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : !showResult ? (
              <motion.div
                key={`question-${currentQuestion}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="backdrop-blur-2xl bg-card/80 border border-border/50 rounded-3xl p-8 shadow-2xl shadow-primary/10">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">
                          Question {currentQuestion + 1} of {questions.length}
                        </span>
                        <span className="text-primary font-semibold">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-2xl font-semibold leading-relaxed">
                        {questions[currentQuestion].question}
                      </h3>

                      <RadioGroup
                        value={answers[currentQuestion]}
                        onValueChange={handleAnswer}
                        className="space-y-3"
                      >
                        {questions[currentQuestion].options.map((option) => (
                          <motion.div
                            key={option.value}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <Label
                              htmlFor={option.value}
                              className={cn(
                                "flex items-center space-x-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                                "hover:bg-muted/20 hover:border-primary/50",
                                answers[currentQuestion] === option.value
                                  ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                                  : "bg-card/50 border-border/50"
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
                            className="w-full h-12 rounded-2xl border-2 group"
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
                          className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all duration-300 group"
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="backdrop-blur-2xl bg-card/80 border border-border/50 rounded-3xl p-10 shadow-2xl shadow-primary/10">
                  <div className="text-center space-y-8">
                    {result && (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 0.2
                          }}
                        >
                          <div className={cn(
                            "w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-2xl mb-6",
                            `bg-gradient-to-br ${brainTypeInfo[result.type].gradient}`
                          )}>
                            <Sparkles className="w-16 h-16 text-white" />
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Badge className="mb-4 text-lg px-6 py-2 rounded-full">{childName}</Badge>
                          <h2 className={cn(
                            "text-5xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent",
                            brainTypeInfo[result.type].gradient
                          )}>
                            {brainTypeInfo[result.type].title}
                          </h2>
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
                          transition={{ delay: 0.6 }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              size="lg" 
                              onClick={handleGoToDashboard}
                              disabled={savingProfile}
                              className="w-full h-14 text-lg rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all duration-300 group"
                            >
                              Go to Dashboard
                              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </Button>
                          </motion.div>
                        </motion.div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
}
