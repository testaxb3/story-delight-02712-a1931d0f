import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Users, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Member } from '@/hooks/useCommunityMembers';

interface MembersListProps {
  members: Member[];
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const MembersList = React.memo(function MembersList({ members }: MembersListProps) {
  const sortedMembers = React.useMemo(() => {
    return [...members].sort((a, b) => {
      if (a.role === 'leader' && b.role !== 'leader') return -1;
      if (a.role !== 'leader' && b.role === 'leader') return 1;
      return 0;
    });
  }, [members]);

  if (members.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative"
    >
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {sortedMembers.map((member, idx) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.03, duration: 0.2 }}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            <div className="relative">
              {member.role === 'leader' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="absolute -top-1 -left-1 z-10"
                >
                  <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                    <Crown className="w-3 h-3 text-white fill-white drop-shadow-sm" />
                  </div>
                </motion.div>
              )}
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white dark:ring-background transition-transform hover:scale-105 overflow-hidden",
                member.role === 'leader'
                  ? "bg-gradient-to-br from-pink-400 to-pink-600"
                  : "bg-gradient-to-br from-orange-400 to-orange-600"
              )}>
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white">
                    {getInitials(member.name || 'U')}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white dark:bg-white/10 px-2 py-0.5 rounded-full border border-[#E5E7EB] dark:border-white/20">
              <Flame className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-bold text-[#1A1A1A] dark:text-white">{member.score || 0}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});
