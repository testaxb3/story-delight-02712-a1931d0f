import { motion } from 'framer-motion';
import { QuizResultRings } from './QuizResultRings';
import { Sparkles, TrendingUp, Users, Target } from 'lucide-react';
import { QuizProgressTimeline } from './QuizProgressTimeline';

interface QuizEnhancedResultsProps {
  brainType: 'INTENSE' | 'DISTRACTED' | 'DEFIANT';
  childName: string;
  challengeLevel?: number;
  parentGoals?: string[];
}

const brainTypeData = {
  INTENSE: {
    color: 'hsl(var(--intense))',
    scriptsCount: 45,
    videosCount: 12,
    ebooksCount: 3,
    averageImprovement: '3-7 days',
    monthlySuccess: 67,
    percentile: 23,
    successRate: 89,
    sleepImprovement: 78,
    tantrumsReduction: 65,
    stressReduction: 90,
    description: 'Children with INTENSE profiles have highly sensitive nervous systems that feel everything more deeply.'
  },
  DISTRACTED: {
    color: 'hsl(var(--distracted))',
    scriptsCount: 42,
    videosCount: 15,
    ebooksCount: 3,
    averageImprovement: '2-5 days',
    monthlySuccess: 72,
    percentile: 18,
    successRate: 85,
    sleepImprovement: 68,
    tantrumsReduction: 55,
    stressReduction: 85,
    description: 'Children with DISTRACTED profiles have brains that seek constant novelty and stimulation.'
  },
  DEFIANT: {
    color: 'hsl(var(--defiant))',
    scriptsCount: 38,
    videosCount: 14,
    ebooksCount: 3,
    averageImprovement: '5-10 days',
    monthlySuccess: 63,
    percentile: 15,
    successRate: 82,
    sleepImprovement: 71,
    tantrumsReduction: 58,
    stressReduction: 88,
    description: 'Children with DEFIANT profiles have strong-willed brains that need to understand the "why" behind rules.'
  }
};

export const QuizEnhancedResults = ({ 
  brainType, 
  childName,
  challengeLevel,
  parentGoals 
}: QuizEnhancedResultsProps) => {
  const data = brainTypeData[brainType];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Profile Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-2"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-foreground font-relative">
          {childName}'s Brain Profile
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          {data.description}
        </p>
      </motion.div>

      {/* Result Rings */}
      <QuizResultRings
        brainType={brainType}
        scriptsCount={data.scriptsCount}
        videosCount={data.videosCount}
        ebooksCount={data.ebooksCount}
      />

      {/* Personalized Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h3 className="text-lg md:text-xl font-bold text-center text-foreground font-relative">
          What to Expect with NEP System
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* Time to First Improvement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-card/50 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-border/30"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" style={{ color: data.color }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">First Improvement</p>
                <p className="text-xl md:text-2xl font-bold" style={{ color: data.color }}>
                  {data.averageImprovement}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Average time until parents see noticeable positive changes
            </p>
          </motion.div>

          {/* 30-Day Success Rate */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-card/50 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-border/30"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5" style={{ color: data.color }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">30-Day Improvement</p>
                <p className="text-xl md:text-2xl font-bold" style={{ color: data.color }}>
                  {data.monthlySuccess}%
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Expected improvement rate after one month
            </p>
          </motion.div>

          {/* Percentile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-card/50 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-border/30"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5" style={{ color: data.color }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Profile Distribution</p>
                <p className="text-xl md:text-2xl font-bold" style={{ color: data.color }}>
                  {data.percentile}%
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              You're among the {data.percentile}% of parents with {brainType} profile children
            </p>
          </motion.div>

          {/* Success Rate */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-card/50 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-border/30"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5" style={{ color: data.color }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Overall Success Rate</p>
                <p className="text-xl md:text-2xl font-bold" style={{ color: data.color }}>
                  {data.successRate}%
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Parent satisfaction rate with NEP System strategies
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Outcome Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-4 md:p-6 border border-border/30"
      >
        <h3 className="text-base md:text-lg font-bold text-center mb-4 text-foreground font-relative">
          Children with {brainType} profile typically see:
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm md:text-base text-muted-foreground">Sleep improvements in 2 weeks</span>
            <div className="flex items-center gap-2">
              <div className="w-24 md:w-32 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.sleepImprovement}%` }}
                  transition={{ delay: 1, duration: 1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: data.color }}
                />
              </div>
              <span className="text-sm md:text-base font-bold w-10 text-right" style={{ color: data.color }}>
                {data.sleepImprovement}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm md:text-base text-muted-foreground">Tantrum reduction in 1 month</span>
            <div className="flex items-center gap-2">
              <div className="w-24 md:w-32 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.tantrumsReduction}%` }}
                  transition={{ delay: 1.2, duration: 1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: data.color }}
                />
              </div>
              <span className="text-sm md:text-base font-bold w-10 text-right" style={{ color: data.color }}>
                {data.tantrumsReduction}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm md:text-base text-muted-foreground">Parent stress reduction</span>
            <div className="flex items-center gap-2">
              <div className="w-24 md:w-32 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.stressReduction}%` }}
                  transition={{ delay: 1.4, duration: 1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: data.color }}
                />
              </div>
              <span className="text-sm md:text-base font-bold w-10 text-right" style={{ color: data.color }}>
                {data.stressReduction}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Long-Term Progress Timeline */}
      <QuizProgressTimeline brainType={brainType} />

      {/* Challenge Level Context (if provided) */}
      {challengeLevel && challengeLevel >= 7 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="bg-primary/10 dark:bg-primary/5 rounded-xl p-4 border border-primary/20 text-center"
        >
          <p className="text-sm md:text-base text-foreground">
            <strong>We understand this is really hard right now.</strong> With your challenge level ({challengeLevel}/10), 
            you'll find immediate relief strategies in the "Emergency Scripts" section of your dashboard.
          </p>
        </motion.div>
      )}
    </div>
  );
};
