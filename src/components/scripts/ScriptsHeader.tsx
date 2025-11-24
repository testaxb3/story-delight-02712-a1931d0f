import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import logo from '@/assets/logo-nep-ai.svg';
import { motion } from 'framer-motion';

interface ScriptsHeaderProps {
  totalScripts: number;
  usedToday: number;
  brainType: string;
  loading: boolean;
  onShowStats?: () => void;
}

const getBrainTypeColor = (brainType: string) => {
  switch (brainType) {
    case 'INTENSE':
      return {
        bg: 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20',
        text: 'text-red-700 dark:text-red-400',
        emoji: '🔥'
      };
    case 'DISTRACTED':
      return {
        bg: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
        text: 'text-blue-700 dark:text-blue-400',
        emoji: '💭'
      };
    case 'DEFIANT':
      return {
        bg: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
        text: 'text-purple-700 dark:text-purple-400',
        emoji: '⚡'
      };
    default:
      return {
        bg: 'bg-muted',
        text: 'text-muted-foreground',
        emoji: '🧠'
      };
  }
};

export function ScriptsHeader({
  totalScripts,
  usedToday,
  brainType,
  loading,
  onShowStats,
}: ScriptsHeaderProps) {
  const brainStyle = getBrainTypeColor(brainType);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Logo */}
      <div className="flex items-center justify-between">
        <img src={logo} alt="NEP AI" className="h-10 w-auto" />
        {onShowStats && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowStats}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Stats Cards - Clean Grid Layout */}
      <div className="grid grid-cols-3 gap-3">
        {/* Total Scripts */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm"
        >
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground">
              {loading ? (
                <div className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                totalScripts
              )}
            </span>
            <span className="text-xs text-muted-foreground font-medium mt-1">
              Scripts
            </span>
          </div>
        </motion.div>

        {/* Used Today */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-4 border border-green-200/50 dark:border-green-800/30 shadow-sm"
        >
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-green-700 dark:text-green-400">
              {usedToday}
            </span>
            <span className="text-xs text-green-600/70 dark:text-green-400/70 font-medium mt-1">
              Used Today
            </span>
          </div>
        </motion.div>

        {/* Brain Type */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`${brainStyle.bg} rounded-2xl p-4 border border-border/30 shadow-sm`}
        >
          <div className="flex flex-col">
            <span className="text-xl mb-0.5">{brainStyle.emoji}</span>
            <span className={`text-xs font-semibold ${brainStyle.text} uppercase tracking-wide mt-1`}>
              {brainType}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
