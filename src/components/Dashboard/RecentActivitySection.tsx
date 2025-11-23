import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { RecentScript } from '@/hooks/useDashboardStats';
import { CATEGORY_EMOJIS } from '@/lib/scriptUtils';

interface RecentActivitySectionProps {
  recentScripts: RecentScript[];
  onScriptClick: () => void;
}

export function RecentActivitySection({ recentScripts, onScriptClick }: RecentActivitySectionProps) {
  if (!recentScripts || recentScripts.length === 0) return null;

  const getCategoryEmoji = (category: string) => {
    const categoryKey = category.toLowerCase().replace(/\s+/g, '_');
    return CATEGORY_EMOJIS[categoryKey] || '🧠';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="px-6 mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/10 rounded-xl">
          <Clock className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
      </div>

      <div className="space-y-3">
        {recentScripts.slice(0, 5).map((script, index) => (
          <motion.div
            key={script.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + (index * 0.1) }}
            onClick={onScriptClick}
            className="bg-[#1C1C1E] border border-[#333] rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all hover:bg-[#2C2C2E] hover:border-[#444]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#2C2C2E] flex items-center justify-center text-2xl shadow-inner">
              {getCategoryEmoji(script.scriptCategory)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm truncate">{script.scriptTitle}</h3>
              <p className="text-gray-500 text-xs truncate">
                {script.profile && `${script.profile} • `}
                {formatDistanceToNow(new Date(script.usedAt), { addSuffix: true })}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 flex-shrink-0" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
