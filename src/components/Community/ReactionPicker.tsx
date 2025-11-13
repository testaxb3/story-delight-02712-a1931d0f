import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type ReactionType = 'like' | 'love' | 'strong' | 'empathy' | 'celebrate' | 'insightful' | 'helpful';

export interface Reaction {
  type: ReactionType;
  emoji: string;
  label: string;
  color: string;
}

export const REACTIONS: Reaction[] = [
  { type: 'like', emoji: '❤️', label: 'Like', color: 'hover:bg-red-50' },
  { type: 'love', emoji: '💕', label: 'Love', color: 'hover:bg-pink-50' },
  { type: 'strong', emoji: '💪', label: 'Strong', color: 'hover:bg-orange-50' },
  { type: 'empathy', emoji: '🤗', label: 'Empathy', color: 'hover:bg-yellow-50' },
  { type: 'celebrate', emoji: '🎉', label: 'Celebrate', color: 'hover:bg-green-50' },
  { type: 'insightful', emoji: '💡', label: 'Insightful', color: 'hover:bg-blue-50' },
  { type: 'helpful', emoji: '🙌', label: 'Helpful', color: 'hover:bg-purple-50' },
];

interface ReactionPickerProps {
  isOpen: boolean;
  onSelect: (reactionType: ReactionType) => void;
  onClose: () => void;
  currentReaction?: ReactionType | null;
}

export function ReactionPicker({ isOpen, onSelect, onClose, currentReaction }: ReactionPickerProps) {
  const [hoveredReaction, setHoveredReaction] = useState<ReactionType | null>(null);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Reaction Picker */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute bottom-full left-0 mb-2 z-50 bg-white rounded-full shadow-2xl border border-border px-2 py-2 flex gap-1"
          >
            {REACTIONS.map((reaction) => (
              <motion.button
                key={reaction.type}
                onClick={() => {
                  onSelect(reaction.type);
                  onClose();
                }}
                onMouseEnter={() => setHoveredReaction(reaction.type)}
                onMouseLeave={() => setHoveredReaction(null)}
                className={cn(
                  'relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
                  reaction.color,
                  currentReaction === reaction.type && 'bg-primary/10 ring-2 ring-primary'
                )}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-2xl">{reaction.emoji}</span>

                {/* Label tooltip */}
                <AnimatePresence>
                  {hoveredReaction === reaction.type && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute bottom-full mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap"
                    >
                      {reaction.label}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
