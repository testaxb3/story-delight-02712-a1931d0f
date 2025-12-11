import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { ProgramBadge } from '@/hooks/useProgramDetail';

interface ProgramBadgesSectionProps {
  badges: ProgramBadge[];
}

export function ProgramBadgesSection({ badges }: ProgramBadgesSectionProps) {
  if (badges.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="px-4 py-4"
    >
      <h2 className="text-sm font-semibold text-foreground mb-3">Program Badges</h2>
      
      <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={`flex flex-col items-center gap-1.5 flex-shrink-0 ${
              badge.earned ? '' : 'opacity-50'
            }`}
          >
            {/* Badge Circle */}
            <div 
              className={`relative w-14 h-14 rounded-full flex items-center justify-center ${
                badge.earned 
                  ? 'bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/30' 
                  : 'bg-muted'
              }`}
            >
              <span className="text-2xl">{badge.icon || '🏆'}</span>
              
              {/* Lock overlay for unearned */}
              {!badge.earned && (
                <div className="absolute inset-0 rounded-full bg-background/50 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {/* Badge Name */}
            <span className="text-[10px] text-muted-foreground text-center max-w-16 line-clamp-1">
              {badge.name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
