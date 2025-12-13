import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, TrendingUp, Target, Zap,
  CheckCircle2, Star, Shield, Heart, Clock, Gift,
  Flame, Trophy, BookOpen, Video, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLiveStats } from '@/hooks/useLiveStats';
import { useContentCounts } from '@/hooks/useContentCounts';

interface QuizEnhancedResultsProps {
  brainType: 'INTENSE' | 'DISTRACTED' | 'DEFIANT';
  childName: string;
  challengeLevel?: number;
  parentGoals?: string[];
}

const brainTypeData = {
  INTENSE: {
    color: 'hsl(var(--intense))',
    emoji: '🔥',
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
    title: 'The Intense Brain',
    subtitle: 'Highly Sensitive Nervous System',
    description: 'Your child feels everything more deeply. Their brain is like a Ferrari engine – powerful but needs the right handling.',
    tips: [
      'Validate feelings before solving problems',
      'Use calm, predictable routines',
      'Give warnings before transitions'
    ],
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    bgGradient: 'from-orange-500/20 via-red-500/10 to-pink-500/10'
  },
  DISTRACTED: {
    color: 'hsl(var(--distracted))',
    emoji: '⚡',
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
    title: 'The Explorer Brain',
    subtitle: 'Novelty-Seeking Mind',
    description: 'Your child\'s brain is constantly seeking stimulation. They aren\'t ignoring you – their brain is just chasing the next exciting thing.',
    tips: [
      'Make tasks into games',
      'Use visual timers and checklists',
      'Break big tasks into tiny steps'
    ],
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    bgGradient: 'from-blue-500/20 via-cyan-500/10 to-teal-500/10'
  },
  DEFIANT: {
    color: 'hsl(var(--defiant))',
    emoji: '👑',
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
    title: 'The Leader Brain',
    subtitle: 'Strong-Willed Thinker',
    description: 'Your child has a leadership brain. They need to understand the "why" behind rules. Once they buy in, they\'re unstoppable.',
    tips: [
      'Offer choices instead of commands',
      'Explain the reason behind rules',
      'Let them lead when possible'
    ],
    gradient: 'from-purple-500 via-violet-500 to-indigo-500',
    bgGradient: 'from-purple-500/20 via-violet-500/10 to-indigo-500/10'
  }
};

const goalLabels: Record<string, string> = {
  tantrums: 'Less Tantrums',
  sleep: 'Better Sleep',
  listening: 'Better Listening',
  anxiety: 'Less Anxiety',
  siblings: 'Sibling Harmony',
  screen: 'Screen Balance',
  eating: 'Better Eating',
  confidence: 'More Confidence'
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 }
  }
};

// ============================================
// SOCIAL PROOF COMPONENT
// ============================================
const avatarUrls = [
  'https://i.pravatar.cc/100?img=1',
  'https://i.pravatar.cc/100?img=5',
  'https://i.pravatar.cc/100?img=9',
  'https://i.pravatar.cc/100?img=16',
  'https://i.pravatar.cc/100?img=20',
];

const SocialProofBanner = memo(({ totalMembers }: { totalMembers: number }) => (
  <motion.div
    variants={itemVariants}
    className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-green-500/10 border border-green-500/20"
  >
    <div className="flex -space-x-2">
      {avatarUrls.map((url, i) => (
        <img
          key={i}
          src={url}
          alt="Parent"
          className="w-8 h-8 rounded-full border-2 border-background object-cover"
        />
      ))}
    </div>
    <div className="text-left">
      <p className="text-sm font-bold text-foreground">
        {totalMembers > 0 ? totalMembers.toLocaleString() : '1,000'}+ parents
      </p>
      <p className="text-xs text-muted-foreground">transformed their home</p>
    </div>
    <div className="flex gap-0.5 ml-auto">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
      ))}
    </div>
  </motion.div>
));

SocialProofBanner.displayName = 'SocialProofBanner';

// ============================================
// BRAIN TYPE HERO
// ============================================
const BrainTypeHero = memo(({
  brainType,
  childName,
  data
}: {
  brainType: string;
  childName: string;
  data: typeof brainTypeData.INTENSE;
}) => (
  <motion.div variants={itemVariants} className="relative">
    {/* Ambient glow */}
    <div className={`absolute inset-0 bg-gradient-to-br ${data.bgGradient} blur-3xl opacity-60 rounded-full scale-150`} />

    <div className="relative z-10 overflow-hidden rounded-[2rem] bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl">
      {/* Top gradient bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${data.gradient}`} />

      <div className="p-6 text-center">
        {/* Emoji + Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative inline-block mb-4"
        >
          <div className="text-7xl">{data.emoji}</div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
          </motion.div>
        </motion.div>

        {/* Type badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${data.gradient} mb-3`}
        >
          <Zap className="w-4 h-4 text-white" />
          <span className="text-sm font-bold text-white uppercase tracking-wide">
            {brainType} PROFILE
          </span>
        </motion.div>

        {/* Name callout */}
        <p className="text-sm text-muted-foreground mb-2">
          Results for <span className="font-bold text-foreground">{childName}</span>
        </p>

        {/* Title */}
        <h1 className="text-3xl font-black text-foreground mb-1">
          {data.title}
        </h1>
        <p className="text-base text-muted-foreground mb-4">
          {data.subtitle}
        </p>

        {/* Description */}
        <p className="text-sm text-foreground/80 leading-relaxed max-w-md mx-auto">
          {data.description}
        </p>
      </div>
    </div>
  </motion.div>
));

BrainTypeHero.displayName = 'BrainTypeHero';

// ============================================
// WHAT YOU GET SECTION
// ============================================
const WhatYouGetSection = memo(({
  scriptsCount,
  videosCount,
  ebooksCount
}: {
  scriptsCount: number;
  videosCount: number;
  ebooksCount: number;
}) => (
  <motion.div variants={itemVariants}>
    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
      <Gift className="w-5 h-5 text-primary" />
      What's Waiting For You
    </h3>

    <div className="grid grid-cols-3 gap-3">
      {[
        { icon: FileText, count: scriptsCount, label: 'Scripts', color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { icon: Video, count: videosCount, label: 'Videos', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { icon: BookOpen, count: ebooksCount, label: 'Ebooks', color: 'text-purple-500', bg: 'bg-purple-500/10' },
      ].map((item) => (
        <motion.div
          key={item.label}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`p-4 rounded-2xl ${item.bg} border border-border/50 text-center`}
        >
          <item.icon className={`w-8 h-8 mx-auto mb-2 ${item.color}`} />
          <p className="text-2xl font-black text-foreground">{item.count}</p>
          <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
));

WhatYouGetSection.displayName = 'WhatYouGetSection';

// ============================================
// YOUR GOALS SECTION
// ============================================
const YourGoalsSection = memo(({ goals }: { goals: string[] }) => {
  if (!goals || goals.length === 0) return null;

  return (
    <motion.div variants={itemVariants}>
      <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        Your Goals
      </h3>

      <div className="flex flex-wrap gap-2">
        {goals.map((goal) => (
          <div
            key={goal}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 border border-primary/20"
          >
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {goalLabels[goal] || goal}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

YourGoalsSection.displayName = 'YourGoalsSection';

// ============================================
// QUICK TIPS SECTION
// ============================================
const QuickTipsSection = memo(({ data }: { data: typeof brainTypeData.INTENSE }) => (
  <motion.div variants={itemVariants}>
    <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
      <Sparkles className="w-5 h-5 text-amber-500" />
      Quick Tips for {data.title.replace('The ', '')}s
    </h3>

    <div className="space-y-2">
      {data.tips.map((tip, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.1 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50"
        >
          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${data.gradient} flex items-center justify-center text-white text-sm font-bold`}>
            {i + 1}
          </div>
          <p className="text-sm text-foreground">{tip}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
));

QuickTipsSection.displayName = 'QuickTipsSection';

// ============================================
// SUCCESS METRICS
// ============================================
const SuccessMetrics = memo(({ data }: { data: typeof brainTypeData.INTENSE }) => (
  <motion.div variants={itemVariants}>
    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
      <TrendingUp className="w-5 h-5 text-green-500" />
      What Parents Like You Achieved
    </h3>

    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'See Results In', value: data.averageImprovement, icon: Clock, color: 'text-blue-500' },
        { label: 'Success Rate', value: `${data.successRate}%`, icon: Trophy, color: 'text-amber-500' },
        { label: 'Calmer Home', value: `${data.tantrumsReduction}%`, icon: Heart, color: 'text-pink-500' },
        { label: 'Parent Confidence', value: `${data.stressReduction}%`, icon: Shield, color: 'text-green-500' },
      ].map((stat) => (
        <motion.div
          key={stat.label}
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden p-4 rounded-2xl bg-card/50 border border-border/50"
        >
          <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
          <p className="text-2xl font-black text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
));

SuccessMetrics.displayName = 'SuccessMetrics';

// ============================================
// TESTIMONIAL CARD
// ============================================
const TestimonialCard = memo(() => (
  <motion.div
    variants={itemVariants}
    className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
  >
    <div className="flex gap-0.5 mb-3">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
      ))}
    </div>

    <p className="text-sm text-foreground/90 italic mb-4 leading-relaxed">
      "After just one week, my daughter's tantrums reduced by half. The scripts gave me exactly the words I needed in the moment."
    </p>

    <div className="flex items-center gap-3">
      <img
        src="https://i.pravatar.cc/100?img=32"
        alt="Sarah M."
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <p className="text-sm font-bold text-foreground">Sarah M.</p>
        <p className="text-xs text-muted-foreground">Mom of 4-year-old</p>
      </div>
    </div>
  </motion.div>
));

TestimonialCard.displayName = 'TestimonialCard';

// ============================================
// CHALLENGE LEVEL WARNING
// ============================================
const ChallengeLevelCard = memo(({ level }: { level: number }) => {
  if (level < 7) return null;

  return (
    <motion.div
      variants={itemVariants}
      className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Flame className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground mb-1">
            High Challenge Level ({level}/10)
          </p>
          <p className="text-xs text-muted-foreground">
            Your plan prioritizes <strong>immediate relief scripts</strong> to help you regain control today.
          </p>
        </div>
      </div>
    </motion.div>
  );
});

ChallengeLevelCard.displayName = 'ChallengeLevelCard';

// ============================================
// MAIN COMPONENT
// ============================================
export const QuizEnhancedResults = memo(({
  brainType,
  childName,
  challengeLevel,
  parentGoals
}: QuizEnhancedResultsProps) => {
  const data = brainTypeData[brainType];
  const { stats } = useLiveStats();
  const { data: contentCounts } = useContentCounts(brainType);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5 pb-32"
    >
      {/* Social Proof */}
      <SocialProofBanner totalMembers={stats.totalMembers} />

      {/* Hero Card */}
      <BrainTypeHero brainType={brainType} childName={childName} data={data} />

      {/* What You Get */}
      <WhatYouGetSection
        scriptsCount={contentCounts?.scripts || data.scriptsCount}
        videosCount={contentCounts?.videos || data.videosCount}
        ebooksCount={contentCounts?.ebooks || data.ebooksCount}
      />

      {/* Your Goals */}
      <YourGoalsSection goals={parentGoals || []} />

      {/* Quick Tips */}
      <QuickTipsSection data={data} />

      {/* Success Metrics */}
      <SuccessMetrics data={data} />

      {/* Testimonial */}
      <TestimonialCard />

      {/* Challenge Level Warning */}
      {challengeLevel && <ChallengeLevelCard level={challengeLevel} />}
    </motion.div>
  );
});

QuizEnhancedResults.displayName = 'QuizEnhancedResults';