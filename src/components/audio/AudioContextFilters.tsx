import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Headphones, Brain, Moon, Smartphone, Sparkles, Crown } from 'lucide-react';

export type AudioFilterCategory =
  | 'all'
  | 'understanding'
  | 'bedtime'
  | 'screens'
  | 'calm'
  | 'premium';

interface FilterChip {
  id: AudioFilterCategory;
  label: string;
  icon: string;
  lucideIcon: typeof Headphones;
}

const filterChips: FilterChip[] = [
  { id: 'all', label: 'All', icon: '🎧', lucideIcon: Headphones },
  { id: 'understanding', label: 'Understanding', icon: '🧠', lucideIcon: Brain },
  { id: 'bedtime', label: 'Bedtime', icon: '🌙', lucideIcon: Moon },
  { id: 'screens', label: 'Screen Time', icon: '📱', lucideIcon: Smartphone },
  { id: 'calm', label: 'Calm Parent', icon: '🧘', lucideIcon: Sparkles },
  { id: 'premium', label: 'Premium', icon: '👑', lucideIcon: Crown },
];

interface AudioContextFiltersProps {
  activeFilter: AudioFilterCategory;
  onFilterChange: (filter: AudioFilterCategory) => void;
}

export function AudioContextFilters({ activeFilter, onFilterChange }: AudioContextFiltersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Scroll active chip into view
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const activeChip = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const chipRect = activeChip.getBoundingClientRect();

      if (chipRect.left < containerRect.left || chipRect.right > containerRect.right) {
        activeChip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div
        ref={scrollRef}
        className="flex items-center gap-2.5 overflow-x-auto scrollbar-none pb-1 -mx-2 px-2 snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {filterChips.map((chip, index) => {
          const isActive = activeFilter === chip.id;

          return (
            <motion.button
              key={chip.id}
              ref={isActive ? activeRef : undefined}
              onClick={() => onFilterChange(chip.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative flex items-center gap-2 px-4 py-2.5 rounded-full 
                text-sm font-semibold whitespace-nowrap snap-start
                transition-all duration-300 border
                ${isActive
                  ? 'bg-gradient-to-r from-[#FF6631] to-[#FFA300] text-white border-transparent shadow-lg shadow-orange-500/25'
                  : 'bg-white text-[#666] border-[#E8E8E6] hover:border-[#FF6631]/30 hover:bg-[#FFF5ED]'
                }
              `}
            >
              <span className="text-base">{chip.icon}</span>
              <span>{chip.label}</span>

              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="filter-active-indicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
