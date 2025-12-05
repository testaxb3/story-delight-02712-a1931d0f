import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Trash2 } from 'lucide-react';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';

interface SearchSuggestionsProps {
  isVisible: boolean;
  onSelect: (query: string) => void;
  className?: string;
}

export function SearchSuggestions({ isVisible, onSelect, className }: SearchSuggestionsProps) {
  const { recentQueries, removeFromHistory, clearHistory, hasHistory } = useSearchHistory();
  const { triggerHaptic } = useHaptic();

  if (!isVisible || !hasHistory) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'absolute top-full left-0 right-0 mt-2 bg-card border border-border/60 rounded-2xl shadow-xl overflow-hidden z-50',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Recent Searches
          </span>
          <button
            onClick={() => {
              triggerHaptic('light');
              clearHistory();
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        </div>

        {/* Recent queries list */}
        <ul className="py-1 max-h-64 overflow-y-auto">
          {recentQueries.map((query, index) => (
            <motion.li
              key={query}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center group">
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    onSelect(query);
                  }}
                  className="flex-1 flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
                >
                  <Clock className="w-4 h-4 text-muted-foreground/60 flex-shrink-0" />
                  <span className="text-sm text-foreground truncate">{query}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic('light');
                    removeFromHistory(query);
                  }}
                  className="p-3 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all"
                  aria-label={`Remove "${query}" from history`}
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
}
