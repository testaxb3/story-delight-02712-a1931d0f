import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Users, Share2, MessageSquare, Copy, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CommunityViewProps {
  communityId: string;
  onLeave: () => void;
}

export function CommunityView({ communityId, onLeave }: CommunityViewProps) {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLeader, setIsLeader] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkLeaderStatus = async () => {
      const { data, error } = await supabase
        .from('community_members')
        .select('role')
        .eq('community_id', communityId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setIsLeader(data.role === 'leader');
      }
    };

    checkLeaderStatus();
  }, [communityId, user]);

  // Mock data
  const community = {
    name: 'Moms defiant',
    logo: '💪',
    memberCount: 24,
    inviteLink: 'https://nepsystem.com/community/575125',
  };

  const posts = [
    {
      id: '1',
      author: 'Maria',
      initials: 'M',
      profile: 'INTENSE',
      timestamp: '2 hours ago',
      content: 'Just used the bedtime script with amazing results! My son fell asleep in 15 minutes.',
      likes: 12,
      comments: 3,
    },
  ];

  return (
    <div className="min-h-screen bg-background px-4 py-6 pb-24">
      <div className="max-w-3xl mx-auto">
        {/* Header with Dropdown */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-card hover:bg-card/80 transition-colors"
          >
            <span className="text-2xl">{community.logo}</span>
            <span className="text-white font-medium">{community.name}</span>
            <ChevronDown className="w-5 h-5 text-white" />
          </button>

          <button className="w-12 h-12 rounded-full bg-card flex items-center justify-center hover:bg-card/80 transition-colors">
            <Users className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <Card className="mb-8 bg-card border-border p-4">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-white/5 rounded-lg transition-colors">
              <span className="text-xl">{community.logo}</span>
              <span className="flex-1">{community.name}</span>
              <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                ✓
              </Badge>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-white/5 rounded-lg transition-colors">
              <Users className="w-5 h-5" />
              <span>Join Group</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-white/5 rounded-lg transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span>Create Group</span>
            </button>
          </Card>
        )}

        {/* Invite Card (if leader) */}
        {isLeader && (
          <Card className="mb-8 bg-card border-border p-6">
            <div className="flex items-start gap-4 mb-6">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <Crown className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex gap-2 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                      M1
                    </AvatarFallback>
                  </Avatar>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-xs">
                      M2
                    </AvatarFallback>
                  </Avatar>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-xs">
                      M3
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            <h3 className="text-white font-medium text-center mb-4">
              Invite your friends to the group
            </h3>

            <div className="bg-background rounded-lg px-4 py-3 mb-4 text-center">
              <p className="text-gray-400 text-sm">{community.inviteLink}</p>
            </div>

            <div className="flex justify-center gap-6">
              <button className="flex flex-col items-center gap-2 text-white">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-xs">Share</span>
              </button>

              <button className="flex flex-col items-center gap-2 text-white">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-xs">Messages</span>
              </button>

              <button className="flex flex-col items-center gap-2 text-white">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Copy className="w-5 h-5" />
                </div>
                <span className="text-xs">Copy</span>
              </button>
            </div>
          </Card>
        )}

        {/* Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="p-6 bg-card border-border">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    {post.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white">{post.author}</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-orange-500/10 text-orange-400 border-orange-500/20"
                    >
                      {post.profile}
                    </Badge>
                    <span className="text-xs text-gray-400">{post.timestamp}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">{post.content}</p>
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <button className="flex items-center gap-1 hover:text-orange-400 transition-colors">
                  ❤️ {post.likes}
                </button>
                <button className="flex items-center gap-1 hover:text-orange-400 transition-colors">
                  💬 {post.comments}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
