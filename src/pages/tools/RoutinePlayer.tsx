import { ArrowLeft, Play, Pause, SkipForward, SkipBack, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoutines } from '@/hooks/useRoutines';
import { useRoutinePlayer } from '@/hooks/useRoutinePlayer';
import { StepTimer } from '@/components/Routines/StepTimer';
import { MoodSelector } from '@/components/Routines/MoodSelector';
import { CelebrationAnimation } from '@/components/Routines/CelebrationAnimation';

export default function RoutinePlayer() {
  const { routineId } = useParams();
  const navigate = useNavigate();
  const { routines } = useRoutines();
  const routine = routines?.find((r) => r.id === routineId);
  const steps = routine?.routine_steps || [];

  const [showMoodBefore, setShowMoodBefore] = useState(true);
  const [showMoodAfter, setShowMoodAfter] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

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
    startRoutine();
  };

  const handleComplete = (mood: 'happy' | 'neutral' | 'sad' | 'frustrated') => {
    setMoodAfter(mood);
    setShowMoodAfter(false);
    setShowCelebration(true);
  };

  const handleCelebrationComplete = () => {
    navigate('/tools/routine-builder');
  };

  if (showMoodBefore) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="px-4 h-14 flex items-center">
            <button
              onClick={() => navigate('/tools/routine-builder')}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 pt-20">
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
    return <CelebrationAnimation onComplete={handleCelebrationComplete} />;
  }

  if (isComplete) {
    setShowMoodAfter(true);
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
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
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-32 space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center space-y-4"
          >
            <div className="text-8xl">{currentStep?.icon}</div>
            <h2 className="text-4xl font-bold">{currentStep?.title}</h2>
          </motion.div>
        </AnimatePresence>

        <StepTimer
          timeRemaining={timeRemaining}
          totalTime={currentStep?.duration_seconds || 0}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border p-4 space-y-4">
        <div className="flex justify-center gap-4">
          <button
            onClick={previousStep}
            disabled={currentStepIndex === 0}
            className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center disabled:opacity-30"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={isPlaying ? pauseRoutine : startRoutine}
            className="w-20 h-20 rounded-full bg-foreground text-background flex items-center justify-center"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          <button
            onClick={nextStep}
            className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
