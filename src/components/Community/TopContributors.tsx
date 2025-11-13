import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Award, Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Contributor {
  id: string;
  name: string;
  email: string;
  photo_url: string | null;
  postsCount: number;
  likesCount: number;
  commentsCount: number;
  totalEngagement: number;
}

export function TopContributors() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopContributors();
  }, []);

  const fetchTopContributors = async () => {
    try {
      // Get users with their post counts
      const { data: postsData } = await supabase
        .from('community_posts')
        .select('user_id, profiles(name, email, photo_url)')
        .not('user_id', 'is', null);

      if (!postsData) return;

      // Aggregate data by user
      const userMap = new Map<string, Contributor>();

      for (const post of postsData) {
        if (!post.user_id) continue;

        const profile = (post.profiles as any);
        if (!userMap.has(post.user_id)) {
          userMap.set(post.user_id, {
            id: post.user_id,
            name: profile?.name || profile?.email?.split('@')[0] || 'User',
            email: profile?.email || '',
            photo_url: profile?.photo_url || null,
            postsCount: 0,
            likesCount: 0,
            commentsCount: 0,
            totalEngagement: 0,
          });
        }

        const user = userMap.get(post.user_id)!;
        user.postsCount++;
      }

      // Get likes and comments counts
      for (const [userId, user] of userMap.entries()) {
        const { count: likesCount } = await supabase
          .from('post_likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', userId);

        const { count: commentsCount } = await supabase
          .from('post_comments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        user.likesCount = likesCount || 0;
        user.commentsCount = commentsCount || 0;
        user.totalEngagement = user.postsCount * 10 + user.likesCount * 2 + user.commentsCount * 5;
      }

      // Sort by engagement and get top 5
      const topUsers = Array.from(userMap.values())
        .sort((a, b) => b.totalEngagement - a.totalEngagement)
        .slice(0, 5);

      setContributors(topUsers);
    } catch (error) {
      console.error('Error fetching contributors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || contributors.length === 0) return null;

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <TrendingUp className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 2:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card className="p-6 glass border-none shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold">Top Contributors</h3>
      </div>

      <div className="space-y-3">
        {contributors.map((contributor, index) => (
          <motion.div
            key={contributor.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
          >
            {/* Rank */}
            <div className="flex-shrink-0">
              <Badge className={`${getRankBadge(index)} text-white border-none w-8 h-8 rounded-full flex items-center justify-center p-0`}>
                {getRankIcon(index)}
              </Badge>
            </div>

            {/* Avatar */}
            <Avatar className="w-12 h-12 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
              <AvatarImage src={contributor.photo_url || undefined} alt={contributor.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                {contributor.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{contributor.name}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{contributor.postsCount} posts</span>
                <span>•</span>
                <span>{contributor.likesCount} likes</span>
                <span>•</span>
                <span>{contributor.commentsCount} comments</span>
              </div>
            </div>

            {/* Engagement Score */}
            <div className="text-right">
              <p className="text-sm font-bold text-primary">{contributor.totalEngagement}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
