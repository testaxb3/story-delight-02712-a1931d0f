import { ArrowLeft, Play, Pause, SkipForward, SkipBack, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoutines } from '@/hooks/useRoutines';
import { useRoutinePlayer } from '@/hooks/useRoutinePlayer';
import { StepTimer } from '@/components/Routines/StepTimer';
import { MoodSelector } from '@/components/Routines/MoodSelector';
import { CelebrationAnimation } from '@/components/Routines/CelebrationAnimation';
import { CompletionSummary } from '@/components/Routines/CompletionSummary';
import { ActivityRing } from '@/components/Routines/ActivityRing';
import { useRoutineStreak } from '@/hooks/useRoutineStreak';
import { useAuth } from '@/contexts/AuthContext';
import { useHaptic } from '@/hooks/useHaptic';

export default function RoutinePlayer() {
  const { routineId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { routines } = useRoutines();
  const routine = routines?.find((r) => r.id === routineId);
  const steps = routine?.routine_steps || [];
  const { triggerHaptic } = useHaptic();
  const { streak, refreshStreak } = useRoutineStreak(user?.id || '');

  const [showMoodBefore, setShowMoodBefore] = useState(true);
  const [showMoodAfter, setShowMoodAfter] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);

  const {
    currentStep,
    currentStepIndex,
    totalSteps,
    isPlaying,
    timeRemaining,
    isComplete,
    moodBefore,
    moodAfter,
    setMoodBefore,
    setMoodAfter,
    startRoutine,
    pauseRoutine,
    nextStep,
    previousStep,
  } = useRoutinePlayer(routineId!, steps);

  if (!routine) {
    return <div>Loading...</div>;
  }

  const handleStartAfterMood = (mood: 'happy' | 'neutral' | 'sad' | 'frustrated') => {
    setMoodBefore(mood);
    setShowMoodBefore(false);
    triggerHaptic('light');
    startRoutine();
  };

  const handleComplete = (mood: 'happy' | 'neutral' | 'sad' | 'frustrated') => {
    setMoodAfter(mood);
    setShowMoodAfter(false);
    setShowSummary(true);
    triggerHaptic('success');
    
    // Calculate total time
    const totalDuration = steps.reduce((sum, s) => sum + s.duration_seconds, 0);
    setCompletionTime(totalDuration);
    
    // Refresh streak
    refreshStreak();
  };

  const handleSummaryComplete = () => {
    setShowSummary(false);
    setShowCelebration(true);
  };

  const handleCelebrationComplete = () => {
    navigate('/tools/routine-builder');
  };

  if (showMoodBefore) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border pt-[calc(env(safe-area-inset-top)+8px)]">
          <div className="px-4 h-14 flex items-center">
            <button
              onClick={() => navigate('/tools/routine-builder')}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 pt-[calc(env(safe-area-inset-top)+88px)]">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="text-6xl">{routine.icon}</div>
              <h1 className="text-3xl font-bold">{routine.title}</h1>
              <p className="text-muted-foreground">
                {totalSteps} steps • Ready to start?
              </p>
            </div>
            <MoodSelector
              value={moodBefore}
              onChange={handleStartAfterMood}
              label="How are you feeling right now?"
            />
          </div>
        </div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <CompletionSummary
            totalTime={completionTime}
            stepsCompleted={totalSteps}
            totalSteps={totalSteps}
            moodBefore={moodBefore}
            moodAfter={moodAfter}
            streak={streak}
          />
          <button
            onClick={handleSummaryComplete}
            className="w-full h-14 rounded-2xl bg-foreground text-background font-semibold"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (showMoodAfter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="text-6xl">🎉</div>
            <h1 className="text-3xl font-bold">All Done!</h1>
            <p className="text-muted-foreground">Great job completing your routine!</p>
          </div>
          <MoodSelector
            value={moodAfter}
            onChange={handleComplete}
            label="How do you feel now?"
          />
        </div>
      </div>
    );
  }

  if (showCelebration) {
    return (
      <CelebrationAnimation 
        onComplete={handleCelebrationComplete}
        streak={streak}
        isNewRecord={streak > 0 && streak % 7 === 0}
      />
    );
  }

  if (isComplete) {
    setShowMoodAfter(true);
    return null;
  }

  // Trigger haptic on step change
  const handleNextStep = () => {
    triggerHaptic('light');
    nextStep();
  };

  const handlePreviousStep = () => {
    triggerHaptic('light');
    previousStep();
  };

  const handlePlayPause = () => {
    triggerHaptic('medium');
    isPlaying ? pauseRoutine() : startRoutine();
  };

  const totalProgress = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border pt-[calc(env(safe-area-inset-top)+8px)]">
        <div className="px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/tools/routine-builder')}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-center">
            <div className="text-sm font-medium">
              Step {currentStepIndex + 1} of {totalSteps}
            </div>
          </div>
          <div className="w-10" />
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 pb-3">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`h-1.5 rounded-full ${
                index <= currentStepIndex ? 'bg-primary' : 'bg-border'
              }`}
              initial={{ width: 8 }}
              animate={{ 
                width: index === currentStepIndex ? 32 : 8,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-[calc(env(safe-area-inset-top)+96px)] pb-40 space-y-8">
        {/* Overall progress ring (small, top) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <ActivityRing 
            progress={totalProgress} 
            size={80}
            strokeWidth={6}
            color="hsl(var(--primary))"
          />
        </motion.div>

        {/* Step content with carousel animation */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -50 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300 
            }}
            className="text-center space-y-6"
          >
            <motion.div 
              className="text-8xl"
              animate={{
                rotate: [0, -5, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {currentStep?.icon}
            </motion.div>
            <h2 className="text-4xl font-bold px-6">{currentStep?.title}</h2>
          </motion.div>
        </AnimatePresence>

        {/* Timer */}
        <StepTimer
          timeRemaining={timeRemaining}
          totalTime={currentStep?.duration_seconds || 0}
        />
      </div>

      {/* Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border p-6 space-y-4">
        <div className="flex justify-center gap-4">
          <motion.button
            onClick={handlePreviousStep}
            disabled={currentStepIndex === 0}
            className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center disabled:opacity-30"
            whileTap={{ scale: 0.95 }}
          >
            <SkipBack className="w-6 h-6" />
          </motion.button>

          <motion.button
            onClick={handlePlayPause}
            className="w-20 h-20 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg"
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </motion.button>

          <motion.button
            onClick={handleNextStep}
            className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
          >
            <SkipForward className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
