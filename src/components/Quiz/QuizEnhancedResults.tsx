import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { QuizResultRings } from './QuizResultRings';
import { Sparkles, TrendingUp, Users, Target, Zap, Brain, Activity } from 'lucide-react';
import { QuizProgressTimeline } from './QuizProgressTimeline';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';

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
    description: 'Highly sensitive nervous systems that feel everything more deeply.',
    longDescription: 'Your child\'s brain is a Ferrari engine with bicycle brakes. They aren\'t ignoring you on purpose; their brain is just chasing the next dopamine hit.',
    gradient: 'from-orange-500/40 via-red-500/30 to-pink-500/30'
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
    description: 'Brains that seek constant novelty and stimulation to stay engaged.',
    longDescription: 'Your child\'s brain is a Ferrari engine with bicycle brakes. They aren\'t ignoring you on purpose; their brain is just chasing the next dopamine hit.',
    gradient: 'from-blue-500/40 via-cyan-500/30 to-teal-500/30'
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
    description: 'Strong-willed brains that need to understand the \'why\' behind rules.',
    longDescription: 'Your child isn\'t just stubborn; they have a leadership brain. They need collaboration, not control. Once they buy in, they are unstoppable.',
    gradient: 'from-purple-500/40 via-violet-500/30 to-indigo-500/30'
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 24 }
  }
};

const StatCard = memo(({
  icon: Icon,
  label,
  value,
  subtext,
  color,
  className
}: {
  icon: any;
  label: string;
  value: string;
  subtext?: string;
  color: string;
  className?: string;
}) => {
  const { triggerHaptic } = useHaptic();

  return (
    <motion.div
      variants={itemVariants}
      whileTap={{ scale: 0.98 }}
      onClick={() => triggerHaptic('light')}
      className={cn(
        "relative overflow-hidden rounded-3xl bg-white/5 dark:bg-black/20 backdrop-blur-2xl border border-white/10 p-5 flex flex-col justify-between shadow-sm transition-all hover:bg-white/10 hover:shadow-md hover:border-white/20 group",
        className
      )}
    >
      <div className="absolute top-0 right-0 p-3 opacity-50 group-hover:opacity-100 transition-opacity">
        <div className="p-2 rounded-full bg-white/5">
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/80 mb-1">{label}</p>
        <p className="text-3xl font-black tracking-tight text-foreground">{value}</p>
      </div>
      
      {subtext && (
        <p className="text-xs text-muted-foreground/70 mt-2 leading-tight">{subtext}</p>
      )}

      {/* Dynamic background glow */}
      <div 
        className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"
        style={{ backgroundColor: color }} 
      />
    </motion.div>
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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-12"
    >
      {/* HERO SECTION */}
      <motion.div variants={itemVariants} className="relative">
        {/* Ambient Background Light */}
        <div className={`absolute inset-0 bg-gradient-to-br ${data.gradient} blur-[80px] opacity-40 rounded-full transform -translate-y-10 scale-110`} />

        <div className="relative z-10 overflow-hidden rounded-[2.5rem] bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-2xl p-8">
          <div className="flex flex-col items-center text-center">
            
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 dark:bg-black/20 border border-white/10 backdrop-blur-md shadow-sm">
              <Zap className="w-3.5 h-3.5" style={{ color: data.color }} />
              <span className="text-xs font-bold tracking-wide uppercase" style={{ color: data.color }}>
                {brainType} Profile
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-4 leading-[0.95]">
              <span className="block text-lg md:text-xl font-medium tracking-normal text-muted-foreground mb-2 opacity-80">The results are in for {childName}</span>
              {brainType}
            </h1>

            <p className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-xl mx-auto font-medium">
              {data.description}
            </p>
            
            <div className="mt-6 p-4 rounded-2xl bg-background/30 border border-white/10 backdrop-blur-md">
              <p className="text-sm text-muted-foreground italic">
                "{data.longDescription}"
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* RINGS SECTION - WRAPPED IN GLASS */}
      <motion.div variants={itemVariants} className="rounded-3xl bg-card/30 backdrop-blur-xl border border-border/30 p-6 shadow-lg">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6 text-center">Your Personalized Plan</h3>
        <QuizResultRings
          brainType={brainType}
          scriptsCount={data.scriptsCount}
          videosCount={data.videosCount}
          ebooksCount={data.ebooksCount}
        />
      </motion.div>

      {/* BENTO GRID STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Brain}
          label="Match"
          value={`${data.percentile}%`}
          subtext={`Parents with ${brainType} children`}
          color={data.color}
          className="md:col-span-2 bg-gradient-to-br from-card/50 to-transparent"
        />
        <StatCard
          icon={TrendingUp}
          label="First Results"
          value={data.averageImprovement}
          subtext="Expected timeline"
          color={data.color}
        />
        <StatCard
          icon={Activity}
          label="Success Rate"
          value={`${data.successRate}%`}
          subtext="Parent satisfaction"
          color={data.color}
        />
      </div>

      {/* IMPACT METRICS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {[ 
            { label: 'Sleep Quality', value: data.sleepImprovement, icon: Sparkles },
            { label: 'Calmer Home', value: data.tantrumsReduction, icon: Users },
            { label: 'Parent Confidence', value: data.stressReduction, icon: Target }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-card/40 border border-border/30 backdrop-blur-lg">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-background/50 text-foreground">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-foreground">{item.value}%</div>
                <div className="text-xs text-muted-foreground font-medium">{item.label}</div>
              </div>
              {/* Mini progress bar */}
              <div className="ml-auto w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: data.color }}
                />
              </div>
            </div>
          ))}
      </motion.div>

      {/* TIMELINE */}
      <motion.div variants={itemVariants} className="pt-4">
        <div className="rounded-[2.5rem] bg-white/60 dark:bg-black/40 backdrop-blur-3xl border border-white/20 p-1 shadow-xl">
           <div className="rounded-[2.2rem] bg-background/50 p-6 border border-white/10">
             <QuizProgressTimeline brainType={brainType} />
           </div>
        </div>
      </motion.div>

      {/* DISCLAIMER / EMPATHY CARD */}
      {challengeLevel && challengeLevel >= 7 && (
        <motion.div 
          variants={itemVariants}
          className="mt-8 p-6 rounded-2xl bg-red-500/5 border border-red-500/10 text-center"
        >
          <p className="text-sm text-muted-foreground">
            We noticed your challenge level is high <strong>({challengeLevel}/10)</strong>. 
            The generated plan prioritizes <em>immediate relief scripts</em> to help you regain control today.
          </p>
        </motion.div>
      )}

      {/* Spacer for floating button */}
      <div className="h-24" />
    </motion.div>
  );
});

QuizEnhancedResults.displayName = 'QuizEnhancedResults';