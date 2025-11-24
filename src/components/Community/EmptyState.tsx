import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreatePost: () => void;
}

export const EmptyState = React.memo(function EmptyState({ onCreatePost }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center py-20 px-6 bg-white dark:bg-white/5 backdrop-blur-xl border border-[#E5E7EB] dark:border-white/10 rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-xl"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center shadow-lg shadow-orange-500/10"
      >
        <MessageCircle className="w-10 h-10 text-orange-400" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold mb-2 text-[#1A1A1A] dark:text-white"
      >
        No posts yet
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-[#6B7280] dark:text-white/60 mb-8 max-w-xs mx-auto"
      >
        Be the first to share your parenting win with the community!
      </motion.p>
      
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCreatePost}
        className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-orange-500/25 transition-shadow flex items-center gap-2 mx-auto"
      >
        <Plus className="w-5 h-5" />
        Share Your Story
      </motion.button>
    </motion.div>
  );
});
