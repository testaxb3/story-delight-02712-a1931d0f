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

type BrainCategory = 'INTENSE' | 'DISTRACTED' | 'DEFIANT' | 'NEUTRAL';
type BrainProfile = 'INTENSE' | 'DISTRACTED' | 'DEFIANT';

// Using the enhanced quiz questions from lib/quizQuestions.ts
const questions = quizQuestions;

// Legacy interface for backward compatibility - can be removed if not needed elsewhere
interface Option {
  value: string;
  label: string;
  scores?: Partial<Record<BrainCategory, number>>;
}

interface Question {
  question: string;
  options: Option[];
}

// Old questions removed - now using enhanced quiz from lib/quizQuestions.ts with:
// - 15 scientifically designed questions
// - Weighted scoring (1-5 points)
// - Confidence levels (low/medium/high)
// - Secondary trait detection
// - Context explanations for each question

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

  // Mark quiz as started in localStorage to prevent modal re-appearance
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
    // Use the enhanced calculation from lib/quizQuestions.ts
    // which includes weighted scoring, confidence levels, and secondary traits
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

    // Clear quiz_in_progress from localStorage when starting to save
    localStorage.removeItem('quiz_in_progress');

    try {
      // ✅ CRITICAL: Ensure parent profile exists before creating child profile
      // This fixes FK violation error
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.profileId)
        .single();

      if (profileCheckError || !existingProfile) {
        console.log('Profile does not exist, creating it now...');
        // Create the profile if it doesn't exist
        const { error: profileCreateError } = await supabase
          .from('profiles')
          .insert({
            id: user.profileId,
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split('@')[0],
            premium: true,
          });

        if (profileCreateError) {
          console.error('Failed to create profile:', profileCreateError);
          throw new Error('Could not create your profile. Please contact support.');
        }
        console.log('Profile created successfully');
      }

      // Use child_profiles directly (not children_profiles view) for compatibility
      const { data, error } = await supabase
        .from('child_profiles')
        .insert({
          parent_id: user.profileId,
          name: childName.trim(),
          brain_profile: brainType,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Quiz save error:', error);
        throw error;
      }

      // Mark quiz as completed and remove in-progress flag
      localStorage.setItem('quiz_completed', 'true');
      localStorage.removeItem('quiz_in_progress');

      await refreshChildren();
      if (data?.id) {
        setActiveChild(data.id);
      }

      // Show PWA installation guide before navigating to dashboard
      setTimeout(() => {
        setShowPWAGuide(true);
      }, 1200);

      return true;
    } catch (error: unknown) {
      console.error('Failed to store child profile', error);
      const message = error instanceof Error ? error.message : 'Unable to save this profile right now. Try again soon.';
      setSaveError(message);
      return false;
    } finally {
      setSavingProfile(false);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalResult = calculateResult();
      setResult(finalResult);
      setShowResult(true);
      // Don't block on saving here - let user see results immediately
      persistChildProfile(finalResult.type);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
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
    if (savingProfile) return; // Don't navigate while saving
    
    // Clear flags and navigate
    localStorage.setItem('quiz_completed', 'true');
    localStorage.removeItem('quiz_in_progress');
    navigate('/dashboard');
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const brainTypeInfo: Record<BrainProfile, {
    emoji: string;
    title: string;
    subtitle: string;
    description: string;
    traits: string[];
    color: string;
  }> = {
    INTENSE: {
      emoji: '🧠',
      title: 'INTENSE Brain',
      subtitle: 'Highly sensitive, emotionally intense, and deeply connected',
      description: 'Your child has a highly reactive nervous system that processes emotions and sensory information more intensely than others.',
      traits: [
        '• Your child feels everything more deeply than others',
        '• They have a highly reactive nervous system',
        '• Traditional parenting approaches often backfire',
        '• They need specialized neurological scripts'
      ],
      color: 'text-accent'
    },
    DISTRACTED: {
      emoji: '⚡',
      title: 'DISTRACTED Brain',
      subtitle: 'Easily distracted, impulsive, and always on the move',
      description: 'Your child\'s brain seeks constant stimulation and has difficulty with sustained attention and impulse control.',
      traits: [
        '• They struggle with focus and attention regulation',
        '• Impulsivity is driven by neurological differences',
        '• Standard consequences don\'t work effectively',
        '• They need movement and sensory breaks'
      ],
      color: 'text-warning'
    },
    DEFIANT: {
      emoji: '💪',
      title: 'DEFIANT Brain',
      subtitle: 'Strong-willed, power-seeking, and autonomy-driven',
      description: 'Your child\'s brain is wired for independence and control, making them question authority naturally.',
      traits: [
        '• They have an intense need for autonomy',
        '• Power struggles are neurologically driven',
        '• Traditional discipline escalates conflict',
        '• They need choices and collaborative problem-solving'
      ],
      color: 'text-destructive'
    }
  };

  if (!hasStarted) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Discover your child's NEP brain profile</h1>
            <p className="text-muted-foreground">
              Answer a few quick questions so we can personalize scripts, plans, and community prompts for your family.
            </p>
          </div>

          <Card className="p-6 bg-white/90 backdrop-blur-glass border-none shadow-lg">
            <div className="space-y-4">
              <div>
                <Label htmlFor="child-name" className="text-sm font-semibold">What's your child's name?</Label>
                <Input
                  id="child-name"
                  value={childName}
                  onChange={(event) => setChildName(event.target.value)}
                  placeholder="e.g., Emma"
                  className="mt-2"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                This helps us personalize every recommendation and makes it easy to track each child's progress.
              </div>
              <Button onClick={handleStartQuiz} disabled={!childName.trim()} className="w-full">
                Start assessment →
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (showResult && result) {
    const info = brainTypeInfo[result.type];

    return (
      <MainLayout>
        <div className="space-y-6 animate-fade-in">
          <Card className="p-8 bg-gradient-primary text-primary-foreground border-none shadow-lg text-center overflow-hidden relative">
            {/* Confetti effect placeholder */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute text-2xl animate-fade-in"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                >
                  {['🎉', '✨', '⭐', '💫'][Math.floor(Math.random() * 4)]}
                </div>
              ))}
            </div>

            <div className="text-6xl mb-4 animate-scale-in">{info.emoji}</div>
            <h1 className="text-3xl font-bold mb-2">Great! {childName || 'Your child'} has an {info.title}</h1>
            <Badge className="mb-4 text-lg px-4 py-2" variant="secondary">
              Assessment Complete
            </Badge>
            <h2 className="text-4xl font-bold mb-4">{info.title}</h2>
            <p className="text-lg mb-6 opacity-90">
              {info.subtitle}
            </p>
            {savingProfile ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <p className="text-sm opacity-80">Saving {childName}'s personalized plan...</p>
              </div>
            ) : saveError ? (
              <div className="space-y-2">
                <p className="text-sm text-destructive">{saveError}</p>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => result && persistChildProfile(result.type)}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <p className="text-sm opacity-80">✅ {childName}'s profile saved successfully!</p>
            )}
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-glass border-none shadow-lg">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                  <span className={info.color}>{info.emoji}</span>
                  What This Means:
                </h3>
                <p className="text-muted-foreground mb-4">{info.description}</p>
                <ul className="space-y-2 text-sm">
                  {info.traits.map((trait, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={info.color}>✓</span>
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-2 text-primary">🎯 Recommended Scripts:</h4>
                <p className="text-sm text-muted-foreground">
                  View your personalized neurological scripts tailored specifically for {info.title} children. 
                  These proven phrases will help you transform challenging moments into cooperation.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={handleGoToDashboard}
              disabled={savingProfile}
            >
              Go to Dashboard →
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate('/scripts')}
              disabled={savingProfile}
            >
              Explore Personalized Scripts
            </Button>
          </div>

          <Button variant="ghost" className="w-full" onClick={handleRetake}>
            + Add another child profile
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideTopBar={true}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Brain Type Quiz</h1>
          <p className="text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length} for {childName}
          </p>
        </div>

        <Progress value={progress} className="w-full" />

        <Card className="p-6 bg-white/90 backdrop-blur-glass border-none shadow-lg">
          <div className="mb-4">
            <Badge variant="outline" className="mb-4">
              Question {currentQuestion + 1}/{questions.length}
            </Badge>
            <h2 className="text-xl font-semibold">
              {questions[currentQuestion].question}
            </h2>
          </div>

          <RadioGroup
            value={answers[currentQuestion]}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {questions[currentQuestion].options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-start space-x-3 p-4 rounded-lg border transition-all cursor-pointer",
                  answers[currentQuestion] === option.value
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "hover:bg-muted/50 border-border"
                )}
              >
                <RadioGroupItem value={option.value} id={`q${currentQuestion}-${option.value}`} className="mt-0.5" />
                <Label htmlFor={`q${currentQuestion}-${option.value}`} className="cursor-pointer flex-1">
                  <span className="font-semibold mr-2">{option.value}.</span>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </Card>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex-1"
          >
            ← Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              answers[currentQuestion] === undefined ||
              answers[currentQuestion] === null ||
              answers[currentQuestion] === '' ||
              (savingProfile && currentQuestion === questions.length - 1)
            }
            className="flex-1"
          >
            {currentQuestion === questions.length - 1 ? 'See Results 🎉' : 'Next →'}
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Answer all questions honestly for the most accurate result</p>
        </div>
      </div>

      {/* PWA Installation Guide */}
      <PWAInstallGuide
        open={showPWAGuide}
        onClose={() => {
          setShowPWAGuide(false);
          navigate('/dashboard');
        }}
      />
    </MainLayout>
  );
}
