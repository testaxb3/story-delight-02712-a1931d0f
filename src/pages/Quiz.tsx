import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { PWAInstallGuide } from '@/components/PWAInstallGuide';
import { quizQuestions, calculateBrainProfile } from '@/lib/quizQuestions';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

type BrainCategory = 'INTENSE' | 'DISTRACTED' | 'DEFIANT' | 'NEUTRAL';
type BrainProfile = 'INTENSE' | 'DISTRACTED' | 'DEFIANT';

const questions = quizQuestions;

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
  const [showPWAGuide, setShowPWAGuide] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshChildren, setActiveChild } = useChildProfiles();

  useEffect(() => {
    if (hasStarted) {
      localStorage.setItem('quiz_in_progress', 'true');
    }
  }, [hasStarted]);

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
  };

  const handleStartQuiz = () => {
    if (!childName.trim()) return;
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

  const persistChildProfile = async (brainType: BrainProfile) => {
    if (!childName.trim()) {
      return false;
    }

    if (!user?.profileId) {
      setSaveError('We could not find your profile. Please sign out and back in to save this result.');
      return false;
    }

    setSavingProfile(true);
    setSaveError(null);
    localStorage.removeItem('quiz_in_progress');

    try {
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.profileId)
        .single();

      if (profileCheckError || !existingProfile) {
        const { error: createError } = await supabase
          .from('profiles')
          .insert([{ id: user.profileId }]);

        if (createError) {
          console.error('Profile creation error:', createError);
          setSaveError('Unable to create profile. Please try again.');
          setSavingProfile(false);
          return false;
        }
      }

      const { data: existingChild, error: childCheckError } = await supabase
        .from('child_profiles')
        .select('id')
        .eq('parent_id', user.profileId)
        .eq('name', childName.trim())
        .maybeSingle();

      if (childCheckError) {
        console.error('Child profile check error:', childCheckError);
      }

      if (existingChild) {
        const { error: updateError } = await supabase
          .from('child_profiles')
          .update({ brain_type: brainType })
          .eq('id', existingChild.id);

        if (updateError) {
          console.error('Child profile update error:', updateError);
          setSaveError('Unable to update child profile. Please try again.');
          setSavingProfile(false);
          return false;
        }

        await refreshChildren();
        setActiveChild(existingChild.id);
      } else {
        const { data: newChild, error: insertError } = await supabase
          .from('child_profiles')
          .insert([{
            parent_id: user.profileId,
            name: childName.trim(),
            brain_type: brainType,
            brain_profile: brainType
          }])
          .select()
          .single();

        if (insertError) {
          console.error('Child profile insert error:', insertError);
          setSaveError('Unable to save child profile. Please try again.');
          setSavingProfile(false);
          return false;
        }

        if (newChild) {
          await refreshChildren();
          setActiveChild(newChild.id);
        }
      }

      setSavingProfile(false);
      setShowPWAGuide(true);
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
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

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult(null);
    setChildName('');
    setHasStarted(false);
    setSaveError(null);
    localStorage.removeItem('quiz_in_progress');
  };

  const handleGoToDashboard = () => {
    if (savingProfile) return;
    
    localStorage.setItem('quiz_completed', 'true');
    localStorage.removeItem('quiz_in_progress');
    navigate('/dashboard');
  };

  const brainTypeInfo: Record<BrainProfile, {
    title: string;
    subtitle: string;
    description: string;
  }> = {
    INTENSE: {
      title: 'INTENSE Brain',
      subtitle: 'Highly sensitive, emotionally intense, and deeply connected',
      description: 'Your child has a highly reactive nervous system that processes emotions and sensory information more intensely than others. They feel everything more deeply and need specialized neurological scripts to thrive.',
    },
    DISTRACTED: {
      title: 'DISTRACTED Brain',
      subtitle: 'Easily distracted, impulsive, and always on the move',
      description: 'Your child\'s brain seeks constant stimulation and has difficulty with sustained attention and impulse control. They struggle with focus and need movement and sensory breaks to regulate.',
    },
    DEFIANT: {
      title: 'DEFIANT Brain',
      subtitle: 'Strong-willed, power-seeking, and autonomy-driven',
      description: 'Your child\'s brain is wired for independence and control, making them question authority naturally. They have an intense need for autonomy and need choices and collaborative problem-solving.',
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {!hasStarted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-8 shadow-xl border border-border/50 bg-card">
                  <div className="text-center space-y-6">
                    <motion.div 
                      className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto"
                      animate={{ 
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <Brain className="w-10 h-10 text-primary-foreground" />
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        Discover Your Child's Brain Profile
                      </h2>
                      <p className="text-muted-foreground text-lg">
                        A scientifically-designed assessment to understand your child's unique neurodevelopmental patterns
                      </p>
                    </div>
                    
                    <div className="bg-muted/30 rounded-xl p-6 space-y-4 text-left border border-border/30">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        What to expect:
                      </h3>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>15 carefully crafted questions based on NEP System neuroscience</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Takes approximately 5-7 minutes to complete</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Identifies whether your child is Intense, Distracted, or Defiant</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>Personalized scripts and strategies based on results</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="childName" className="text-left block font-medium text-foreground">
                          Child's Name
                        </Label>
                        <Input
                          id="childName"
                          type="text"
                          placeholder="e.g., Emma"
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                          className="text-lg bg-background border-border"
                          onKeyDown={(e) => e.key === 'Enter' && childName.trim() && handleStartQuiz()}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This helps us personalize every recommendation and makes it easy to track each child's progress.
                      </p>
                      
                      <Button 
                        size="lg" 
                        className="w-full text-lg group"
                        onClick={handleStartQuiz}
                        disabled={!childName.trim()}
                      >
                        Start Assessment
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : showResult && result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-8 shadow-xl border border-border/50 bg-card">
                  <div className="text-center space-y-6">
                    <motion.div 
                      className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.2
                      }}
                    >
                      <span className="text-6xl">
                        {result.type === 'INTENSE' ? '🔥' : result.type === 'DISTRACTED' ? '🌟' : '⚡'}
                      </span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Badge className="mb-3 text-lg px-4 py-1">{childName}</Badge>
                      <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
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
                        className="bg-muted/30 rounded-lg p-4 border border-border/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <p className="text-muted-foreground">Saving profile...</p>
                      </motion.div>
                    ) : saveError ? (
                      <motion.div 
                        className="bg-destructive/10 border border-destructive/20 rounded-lg p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <p className="text-destructive">{saveError}</p>
                      </motion.div>
                    ) : null}

                    <motion.div 
                      className="flex flex-col sm:flex-row gap-4 justify-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button size="lg" onClick={handleGoToDashboard} className="text-lg group">
                        Go to Dashboard
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        onClick={() => navigate('/scripts')}
                        className="text-lg group"
                      >
                        <Sparkles className="mr-2 w-5 h-5" />
                        Explore Personalized Scripts
                      </Button>
                    </motion.div>

                    <Button
                      variant="ghost"
                      onClick={handleRetake}
                      className="mt-4"
                    >
                      Add another child profile
                    </Button>

                    {showPWAGuide && (
                      <div className="mt-6">
                        <PWAInstallGuide open={showPWAGuide} onClose={() => setShowPWAGuide(false)} />
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8 shadow-xl border border-border/50 bg-card">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Brain className="w-6 h-6 text-primary" />
                        Brain Profile Assessment
                      </h2>
                      <Badge variant="secondary" className="text-sm px-3 py-1">
                        {currentQuestion + 1} / {questions.length}
                      </Badge>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={((currentQuestion + 1) / questions.length) * 100} 
                        className="h-3"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className="text-xl font-semibold mb-2">
                        {questions[currentQuestion].question}
                      </h3>
                      {questions[currentQuestion].context && (
                        <p className="text-sm text-muted-foreground italic mb-4 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          {questions[currentQuestion].context}
                        </p>
                      )}
                    </motion.div>

                    <RadioGroup
                      value={answers[currentQuestion] || ''}
                      onValueChange={handleAnswer}
                      className="space-y-3"
                    >
                      {questions[currentQuestion].options.map((option, index) => (
                        <motion.div
                          key={option.value}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          className={cn(
                            "flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                            answers[currentQuestion] === option.value
                              ? "border-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-md"
                              : "border-border hover:border-primary/50 hover:bg-accent hover:shadow-sm"
                          )}
                          onClick={() => handleAnswer(option.value)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                            className="mt-0.5"
                          />
                          <Label
                            htmlFor={option.value}
                            className="flex-1 cursor-pointer text-base leading-relaxed"
                          >
                            {option.label}
                          </Label>
                        </motion.div>
                      ))}
                    </RadioGroup>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="group"
                      >
                        <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Previous
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={!answers[currentQuestion]}
                        className="group"
                      >
                        {currentQuestion === questions.length - 1 ? (
                          <>
                            See Results
                            <Sparkles className="ml-2 w-4 h-4" />
                          </>
                        ) : (
                          <>
                            Next
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
}
