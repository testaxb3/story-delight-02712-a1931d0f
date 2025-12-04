import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';

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
}

const filterChips: FilterChip[] = [
  { id: 'all', label: 'All', icon: '🎧' },
  { id: 'understanding', label: 'Understanding', icon: '🧠' },
  { id: 'bedtime', label: 'Bedtime', icon: '🌙' },
  { id: 'screens', label: 'Screen Time', icon: '📱' },
  { id: 'calm', label: 'Calm Parent', icon: '🧘' },
  { id: 'premium', label: 'Premium', icon: '👑' },
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
        className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-2 px-2 snap-x snap-mandatory"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {filterChips.map((chip) => {
          const isActive = activeFilter === chip.id;
          
          return (
            <motion.button
              key={chip.id}
              ref={isActive ? activeRef : undefined}
              onClick={() => onFilterChange(chip.id)}
              whileTap={{ scale: 0.95 }}
              className={`
                relative flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                text-sm font-medium whitespace-nowrap snap-start
                transition-colors duration-200
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
            >
              <span className="text-sm">{chip.icon}</span>
              <span>{chip.label}</span>
              
              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="filter-active-indicator"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-foreground"
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
