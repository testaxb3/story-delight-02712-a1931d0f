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
      // Fetch real members
      const { data: realMembers } = await supabase
        .from('community_members')
        .select('id, user_id, role, profiles:user_id(name, photo_url)')
        .eq('community_id', communityId);

      // Fetch unique seed post authors
      const { data: seedPosts } = await supabase
        .from('community_posts')
        .select('author_name, author_photo_url')
        .eq('community_id', communityId)
        .eq('is_seed_post', true)
        .not('author_name', 'is', null);

      // Create map of unique seed authors
      const seedAuthorsMap = new Map();
      seedPosts?.forEach(post => {
        if (post.author_name && !seedAuthorsMap.has(post.author_name)) {
          seedAuthorsMap.set(post.author_name, {
            id: `seed-${post.author_name.replace(/\s/g, '-').toLowerCase()}`,
            user_id: null,
            role: 'member',
            profiles: {
              name: post.author_name,
              photo_url: post.author_photo_url
            }
          });
        }
      });

      // Combine and sort (leaders first)
      const allLeaders = [
        ...(realMembers || []),
        ...Array.from(seedAuthorsMap.values())
      ].sort((a, b) => (a.role === 'leader' ? -1 : 1))
       .slice(0, 10);

      setLeaders(allLeaders as any[]);
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
