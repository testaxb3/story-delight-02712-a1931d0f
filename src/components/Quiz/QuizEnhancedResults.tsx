import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { QuizResultRings } from './QuizResultRings';
import { Sparkles, TrendingUp, Users, Target, Zap } from 'lucide-react';
import { QuizProgressTimeline } from './QuizProgressTimeline';
import { useHaptic } from '@/hooks/useHaptic';

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
    description: 'Children with INTENSE profiles have highly sensitive nervous systems that feel everything more deeply.',
    gradient: 'from-orange-500/20 via-red-500/20 to-pink-500/20'
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
    description: 'Children with DISTRACTED profiles have brains that seek constant novelty and stimulation.',
    gradient: 'from-blue-500/20 via-cyan-500/20 to-teal-500/20'
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
    description: 'Children with DEFIANT profiles have strong-willed brains that need to understand the "why" behind rules.',
    gradient: 'from-purple-500/20 via-violet-500/20 to-indigo-500/20'
  }
};

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };
const softSpring = { type: "spring" as const, stiffness: 200, damping: 25 };

const StatCard = memo(({
  icon: Icon,
  label,
  value,
  description,
  color,
  delay
}: {
  icon: any;
  label: string;
  value: string;
  description: string;
  color: string;
  delay: number;
}) => {
  const { triggerHaptic } = useHaptic();

  const handlePress = useCallback(() => {
    triggerHaptic('light');
  }, [triggerHaptic]);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay }}
      whileTap={{ scale: 0.97 }}
      onClick={handlePress}
      className="relative group text-left w-full overflow-hidden"
    >
      {/* Glassmorphic card */}
      <div className="relative bg-card/60 dark:bg-card/40 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-border/40 shadow-lg dark:shadow-black/20 transition-all duration-300 group-hover:border-border/60 group-hover:shadow-xl">
        {/* Gradient glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl -z-10"
          style={{ background: `radial-gradient(circle at 50% 0%, ${color}40, transparent 70%)` }}
        />

        {/* Content */}
        <div className="flex items-start gap-3 md:gap-4 mb-2">
          <div
            className="w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {label}
            </p>
            <motion.p
              className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight"
              style={{ color }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ ...spring, delay: delay + 0.1 }}
            >
              {value}
            </motion.p>
          </div>
        </div>
        <p className="text-[11px] md:text-xs text-muted-foreground/80 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.button>
  );
});

StatCard.displayName = 'StatCard';

export const QuizEnhancedResults = memo(({
  brainType,
  childName,
  challengeLevel,
  parentGoals
}: QuizEnhancedResultsProps) => {
  const data = brainTypeData[brainType];
  const { triggerHaptic } = useHaptic();

  return (
    <div className="space-y-6 md:space-y-8">
      {/* HERO: Brain Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={spring}
        className="relative overflow-hidden"
      >
        {/* Animated gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${data.gradient} dark:opacity-50 opacity-70 blur-3xl`} />

        <div className="relative bg-card/80 dark:bg-card/60 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-border/50 shadow-2xl dark:shadow-black/40">
          {/* Brain type badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 shadow-lg"
            style={{ backgroundColor: `${data.color}20`, borderColor: `${data.color}40` }}
          >
            <Zap className="w-4 h-4" style={{ color: data.color }} />
            <span className="text-sm md:text-base font-bold" style={{ color: data.color }}>
              {brainType}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 leading-tight tracking-tight"
          >
            {childName}'s<br />Brain Profile
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl"
          >
            {data.description}
          </motion.p>
        </div>
      </motion.div>

      {/* Result Rings */}
      <QuizResultRings
        brainType={brainType}
        scriptsCount={data.scriptsCount}
        videosCount={data.videosCount}
        ebooksCount={data.ebooksCount}
      />

      {/* Stats Section Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <h2 className="text-xl md:text-2xl font-black text-foreground">
          What to Expect
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          with Nep System
        </p>
      </motion.div>

      {/* Interactive Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <StatCard
          icon={TrendingUp}
          label="First Improvement"
          value={data.averageImprovement}
          description="Average time until parents see noticeable positive changes"
          color={data.color}
          delay={0.5}
        />
        <StatCard
          icon={Target}
          label="30-Day Improvement"
          value={`${data.monthlySuccess}%`}
          description="Expected improvement rate after one month"
          color={data.color}
          delay={0.6}
        />
        <StatCard
          icon={Users}
          label="Profile Distribution"
          value={`${data.percentile}%`}
          description={`You're among the ${data.percentile}% of parents with ${brainType} profile children`}
          color={data.color}
          delay={0.7}
        />
        <StatCard
          icon={Sparkles}
          label="Overall Success Rate"
          value={`${data.successRate}%`}
          description="Parent satisfaction rate with Nep System strategies"
          color={data.color}
          delay={0.8}
        />
      </div>

      {/* Outcome Progress Bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...softSpring, delay: 0.9 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent rounded-3xl" />
        <div className="relative bg-card/60 dark:bg-card/40 backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-border/40 shadow-xl">
          <h3 className="text-base md:text-lg font-bold text-center mb-5 text-foreground">
            Typical Improvements
          </h3>

          <div className="space-y-4">
            {[
              { label: 'Sleep improvements in 2 weeks', value: data.sleepImprovement },
              { label: 'Tantrum reduction in 1 month', value: data.tantrumsReduction },
              { label: 'Parent stress reduction', value: data.stressReduction }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring, delay: 1 + index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground font-medium">{item.label}</span>
                  <motion.span
                    className="font-black text-lg md:text-xl"
                    style={{ color: data.color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...spring, delay: 1.2 + index * 0.1 }}
                  >
                    {item.value}%
                  </motion.span>
                </div>
                <div className="relative h-2.5 md:h-3 bg-muted/50 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full shadow-lg"
                    style={{ backgroundColor: data.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 1.3 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Long-Term Timeline */}
      <QuizProgressTimeline brainType={brainType} />

      {/* Challenge Level Alert */}
      {challengeLevel && challengeLevel >= 7 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 1.6 }}
          onClick={() => triggerHaptic('medium')}
          className="relative overflow-hidden cursor-pointer group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl" />
          <div className="relative bg-card/80 dark:bg-card/60 backdrop-blur-xl rounded-2xl p-4 md:p-5 border-2 border-primary/30 shadow-xl group-hover:border-primary/50 transition-all">
            <p className="text-sm md:text-base text-foreground text-center leading-relaxed">
              <strong className="font-black">We understand this is really hard right now.</strong>
              {' '}With your challenge level ({challengeLevel}/10), you'll find immediate relief strategies in the "Emergency Scripts" section.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
});

QuizEnhancedResults.displayName = 'QuizEnhancedResults';
