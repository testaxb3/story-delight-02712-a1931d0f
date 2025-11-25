import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown } from 'lucide-react';

interface LeaderboardMember {
  id: string;
  user_id: string;
  role: string;
  profiles: {
    name: string;
    photo_url: string | null;
  };
}

export function CommunityLeaderboard({ communityId }: { communityId: string }) {
  const [leaders, setLeaders] = useState<LeaderboardMember[]>([]);

  useEffect(() => {
    if (!communityId) return;

    const fetchLeaders = async () => {
      // For now, just fetch members. In a real leaderboard, we'd join with stats.
      // Prioritize leaders/admins first.
      const { data, error } = await supabase
        .from('community_members')
        .select('id, user_id, role, profiles:user_id(name, photo_url)')
        .eq('community_id', communityId)
        .order('role', { ascending: true }) // 'leader' < 'member' alphabetically? No, 'leader' > 'member'. Need custom sort or just fetch.
        .limit(10);

      if (!error && data) {
        // Sort manually: leader first
        const sorted = (data as any[]).sort((a, b) => (a.role === 'leader' ? -1 : 1));
        setLeaders(sorted);
      }
    };

    fetchLeaders();
  }, [communityId]);

  if (leaders.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="px-1 mb-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
        Top Contributors
      </h3>
      <div className="flex gap-4 overflow-x-auto px-1 pb-2 scrollbar-hide">
        {leaders.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center gap-1 min-w-[64px]"
          >
            <div className="relative">
              <div className={`p-[2px] rounded-full ${
                member.role === 'leader' 
                  ? 'bg-gradient-to-tr from-yellow-400 to-orange-500' 
                  : 'bg-gradient-to-tr from-blue-400 to-purple-500'
              }`}>
                <Avatar className="w-14 h-14 border-2 border-background">
                  <AvatarImage src={member.profiles?.photo_url || undefined} />
                  <AvatarFallback className="bg-secondary text-[10px]">
                    {member.profiles?.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              {index < 3 && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-background rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-[10px]">
                    {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
                  </span>
                </div>
              )}
            </div>
            <span className="text-[10px] font-medium text-center truncate w-full max-w-[70px]">
              {member.profiles?.name?.split(' ')[0]}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
