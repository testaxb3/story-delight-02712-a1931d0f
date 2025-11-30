import { memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Zap, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const SPRING = {
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  bouncy: { type: "spring", stiffness: 300, damping: 20, mass: 0.8 },
} as const;

// ============================================================================
// NEW USER HERO - First time experience
// Replaces HeroMetricsCard when scriptsRead === 0
// ============================================================================
export const NewUserHeroCard = memo(function NewUserHeroCard({
  childName,
  onPress,
}: {
  childName?: string;
  onPress: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING.gentle}
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
      className="relative w-full p-6 rounded-3xl overflow-hidden text-left"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent" />
      <div className="absolute inset-0 rounded-3xl border border-orange-500/20" />
      
      {/* Animated glow */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-orange-500/20 blur-3xl"
      />

      <div className="relative z-10">
        {/* Icon with pulse */}
        <div className="relative w-16 h-16 mb-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl bg-orange-500/20 blur-xl"
          />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Text content */}
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Ready to help {childName || 'your child'}?
        </h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-[280px]">
          Discover scripts that turn difficult moments into connection opportunities.
        </p>

        {/* CTA */}
        <div className="flex items-center gap-2 text-orange-500 font-semibold">
          <span>Find your first script</span>
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </div>
      </div>
    </motion.button>
  );
});

// ============================================================================
// MOTIVATION INSIGHT CARD - Replaces InsightCard when value is 0
// ============================================================================
export const MotivationInsightCard = memo(function MotivationInsightCard({
  type,
  onPress,
}: {
  type: 'weekly' | 'total';
  onPress: () => void;
}) {
  const config = {
    weekly: {
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: "This week",
      message: "Use your first script",
      color: "bg-amber-500",
    },
    total: {
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      title: "Moments helped",
      message: "Start helping today",
      color: "bg-rose-500",
    },
  };

  const { icon, title, message, color } = config[type];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, ...SPRING.gentle }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
      className="relative flex-1 p-4 rounded-2xl overflow-hidden text-left"
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-card/50 backdrop-blur-xl" />
      <div className="absolute inset-0 rounded-2xl border border-border" />

      {/* Colored accent glow */}
      <div className={cn("absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-20", color)} />

      <div className="relative z-10">
        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-3", color + '/20')}>
          {icon}
        </div>

        <p className="text-xs text-muted-foreground font-medium mb-1">{title}</p>
        <p className="text-sm font-semibold text-foreground">{message}</p>
        
        <motion.div
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-2"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </div>
    </motion.button>
  );
});

// ============================================================================
// EMPTY RECENT ACTIVITY - More engaging than "No scripts read"
// ============================================================================
export const EmptyRecentActivity = memo(function EmptyRecentActivity({
  onPress,
}: {
  onPress: () => void;
}) {
  const suggestions = [
    { emoji: '😤', label: 'Tantrums' },
    { emoji: '🌙', label: 'Bedtime' },
    { emoji: '🍽️', label: 'Mealtime' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, ...SPRING.gentle }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Quick Start</h3>
      </div>

      <motion.button
        whileTap={{ scale: 0.99 }}
        onClick={onPress}
        className="relative w-full p-5 rounded-3xl overflow-hidden text-left"
      >
        <div className="absolute inset-0 bg-card/30" />
        <div className="absolute inset-0 rounded-3xl border border-dashed border-border" />

        <div className="relative z-10">
          <p className="text-sm text-foreground font-medium mb-4">
            What's challenging today?
          </p>

          <div className="flex gap-2 flex-wrap">
            {suggestions.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-full"
              >
                <span>{s.emoji}</span>
                <span className="text-xs font-medium text-foreground">{s.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-1 mt-4 text-primary text-sm font-medium">
            <span>Browse all scripts</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
});
