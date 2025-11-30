import { memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { CATEGORY_EMOJIS } from '@/lib/scriptUtils';
import { itemVariants } from './animations';

interface Script {
  id: string;
  title: string;
  category: string;
}

interface RecentActivityProps {
  scripts: Script[];
  onScriptPress: (id: string) => void;
  onSeeAll: () => void;
}

export const RecentActivity = memo(function RecentActivity({
  scripts,
  onScriptPress,
  onSeeAll,
}: RecentActivityProps) {
  const getCategoryEmoji = (category: string) => {
    const categoryKey = category?.toLowerCase().replace(/\s+/g, '_') || '';
    return CATEGORY_EMOJIS[categoryKey] || '🧠';
  };

  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSeeAll}
          className="flex items-center gap-1 text-sm text-muted-foreground"
        >
          See all
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="space-y-3">
        {scripts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative p-6 rounded-2xl overflow-hidden text-center"
          >
            <div className="absolute inset-0 bg-card/30" />
            <div className="absolute inset-0 rounded-2xl border border-dashed border-border" />
            <div className="relative z-10">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-sm text-muted-foreground">No scripts read yet today</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Tap + to start your journey</p>
            </div>
          </motion.div>
        ) : (
          scripts.slice(0, 3).map((script, index) => (
            <motion.button
              key={script.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onScriptPress(script.id)}
              className="relative w-full p-4 rounded-item overflow-hidden text-left"
            >
              <div className="absolute inset-0 bg-card/50" />
              <div className="absolute inset-0 rounded-item border border-border" />

              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center text-2xl">
                  {getCategoryEmoji(script.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground truncate">{script.title}</h4>
                  <p className="text-xs text-muted-foreground capitalize">{script.category}</p>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground/30 flex-shrink-0" />
              </div>
            </motion.button>
          ))
        )}
      </div>
    </motion.div>
  );
});
