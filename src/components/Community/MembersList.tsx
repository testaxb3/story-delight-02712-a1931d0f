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
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl relative overflow-hidden"
    >
      {/* Background gradient accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl -z-10" />
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base flex items-center gap-2 text-white">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <Crown className="w-4 h-4 text-white" />
          </div>
          Community Stars
        </h3>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/80 backdrop-blur-sm">
          <Users className="w-3.5 h-3.5 text-yellow-400" />
          {members.length} members
        </div>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {sortedMembers.map((member, idx) => (
          <motion.div 
            key={member.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05, duration: 0.2 }}
            className="flex flex-col items-center gap-2 flex-shrink-0"
          >
            <div className="relative">
              {member.role === 'leader' && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute -top-2 left-1/2 -translate-x-1/2 z-10"
                >
                  <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow-lg" />
                </motion.div>
              )}
              <div className={cn(
                "w-[72px] h-[72px] rounded-full flex items-center justify-center font-bold text-lg shadow-xl ring-2 ring-offset-2 ring-offset-background transition-transform hover:scale-105",
                member.role === 'leader' 
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-600 ring-yellow-500/20" 
                  : "bg-gradient-to-br from-purple-500 to-purple-600 ring-purple-500/20"
              )}>
                {member.photo_url ? (
                  <img 
                    src={member.photo_url} 
                    alt="" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <span className="text-white">
                    {getInitials(member.name || 'U')}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500/10 to-orange-600/10 px-2.5 py-1 rounded-full border border-orange-500/20">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">0</span>
            </div>
            <span className="text-xs font-medium text-foreground/80 max-w-[72px] truncate text-center">
              {member.name?.split(' ')[0] || 'User'}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});
