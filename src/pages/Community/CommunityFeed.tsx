import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronDown, Users, Plus, Share2, MessageCircle, 
  Copy, Flame, Check 
} from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Community {
  id: string;
  name: string;
  logo_emoji: string | null;
  logo_url: string | null;
  invite_code: string;
}

interface Member {
  id: string;
  user_id: string;
  role: string;
  profiles: {
    name: string;
    photo_url: string | null;
  };
}

interface Post {
  id: string;
  content: string;
  script_used: string | null;
  created_at: string;
  user_id: string;
  profiles: {
    username: string | null;
    name: string;
    photo_url: string | null;
  };
}

export default function CommunityFeed() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const communityId = location.state?.communityId;

  const [communities, setCommunities] = useState<Community[]>([]);
  const [currentCommunity, setCurrentCommunity] = useState<Community | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLeader, setIsLeader] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (user?.profileId) {
      loadCommunities();
    }
  }, [user?.profileId]);

  useEffect(() => {
    if (currentCommunity) {
      loadMembers();
      loadPosts();
      checkLeaderStatus();
    }
  }, [currentCommunity]);

  const loadCommunities = async () => {
    if (!user?.profileId) {
      toast.error('❌ User not found');
      return;
    }

    const { data, error } = await supabase
      .from('community_members')
      .select('community_id, communities!inner(id, name, logo_emoji, logo_url, invite_code)')
      .eq('user_id', user.profileId);

    if (error) {
      toast.error(`❌ Error loading communities: ${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      toast.error('❌ No communities found');
      return;
    }

    const communityList = data
      .map((item: any) => item.communities)
      .filter(Boolean);
    
    if (communityList.length === 0) {
      toast.error('❌ No community data');
      return;
    }

    setCommunities(communityList);
    
    const selectedCommunity = communityId 
      ? communityList.find((c: Community) => c.id === communityId) || communityList[0]
      : communityList[0];
    
    setCurrentCommunity(selectedCommunity);
    toast.success(`✅ Loaded: ${selectedCommunity.name}`);
  };

  const loadMembers = async () => {
    if (!currentCommunity) return;

    const { data, error } = await supabase
      .from('community_members')
      .select('id, user_id, role, profiles(name, photo_url)')
      .eq('community_id', currentCommunity.id)
      .order('role', { ascending: true });

    if (!error && data) {
      setMembers(data as any);
    }
  };

  const loadPosts = async () => {
    if (!currentCommunity) {
      toast.error('❌ No community selected');
      return;
    }

    const { data, error } = await supabase
      .from('group_posts')
      .select('id, content, script_used, created_at, user_id, profiles(username, name, photo_url)')
      .eq('community_id', currentCommunity.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(`❌ Error: ${error.message}`);
      return;
    }

    setPosts((data || []) as any);
    toast.success(`✅ ${data?.length || 0} posts loaded`);
  };

  const checkLeaderStatus = async () => {
    if (!currentCommunity || !user?.profileId) return;

    const { data } = await supabase
      .from('community_members')
      .select('role')
      .eq('community_id', currentCommunity.id)
      .eq('user_id', user.profileId)
      .single();

    setIsLeader(data?.role === 'leader');
  };

  const handleShare = () => {
    if (!currentCommunity) return;
    const link = `https://nepapp.com/community/${currentCommunity.invite_code}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Join ${currentCommunity.name}`,
        text: `Join our parenting community!`,
        url: link,
      });
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (!currentCommunity) return;
    const link = `https://nepapp.com/community/${currentCommunity.invite_code}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      toast.error('❌ Post cannot be empty');
      return;
    }
    
    if (!currentCommunity) {
      toast.error('❌ No community selected');
      return;
    }
    
    if (!user?.profileId) {
      toast.error('❌ User not found');
      return;
    }

    setPosting(true);

    try {
      const { error } = await supabase
        .from('group_posts')
        .insert({
          community_id: currentCommunity.id,
          user_id: user.profileId,
          content: postContent.trim(),
        });

      if (error) throw error;

      toast.success('✅ Post created!');
      setPostContent('');
      setShowPostModal(false);
      await loadPosts();
    } catch (error: any) {
      toast.error(`❌ Failed: ${error.message}`);
    } finally {
      setPosting(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <MainLayout>
      <div className="pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2">
                {currentCommunity?.logo_url ? (
                  <img src={currentCommunity.logo_url} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-lg">
                    {currentCommunity?.logo_emoji || '💪'}
                  </div>
                )}
                <span className="font-semibold">{currentCommunity?.name || 'Select Community'}</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {communities.map((community) => (
                  <DropdownMenuItem
                    key={community.id}
                    onClick={() => setCurrentCommunity(community)}
                    className="flex items-center gap-2"
                  >
                    {community.logo_url ? (
                      <img src={community.logo_url} alt="" className="w-6 h-6 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-sm">
                        {community.logo_emoji}
                      </div>
                    )}
                    <span>{community.name}</span>
                    {currentCommunity?.id === community.id && <Check className="w-4 h-4 ml-auto" />}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/community/join')}>
                  Join Community
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/community/create')}>
                  Create Community
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => navigate('/community/members', { state: { communityId: currentCommunity?.id } })}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            >
              <Users className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Leader Invite Card */}
          {isLeader && currentCommunity && (
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                {members.slice(0, 3).map((member, idx) => (
                  <div
                    key={member.id}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-xs font-bold -ml-2 first:ml-0 border-2 border-background"
                  >
                    {member.profiles?.photo_url ? (
                      <img src={member.profiles.photo_url} alt="" className="w-full h-full rounded-full" />
                    ) : (
                      getInitials(member.profiles?.name || 'U')
                    )}
                  </div>
                ))}
              </div>
              <h3 className="font-semibold mb-2">Invite your friends to the group</h3>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={`https://nepapp.com/community/${currentCommunity.invite_code}`}
                  readOnly
                  className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="flex-1 h-10 rounded-lg border border-border flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  className="flex-1 h-10 rounded-lg bg-green-600 text-white flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                  onClick={() => window.open(`sms:?&body=Join my parenting community: https://nepapp.com/community/${currentCommunity.invite_code}`)}
                >
                  <MessageCircle className="w-4 h-4" />
                  Messages
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex-1 h-10 rounded-lg border border-border flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* Members Leaderboard */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {members.map((member) => (
              <div key={member.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold">
                    {member.profiles?.photo_url ? (
                      <img src={member.profiles.photo_url} alt="" className="w-full h-full rounded-full" />
                    ) : (
                      getInitials(member.profiles?.name || 'U')
                    )}
                  </div>
                  {member.role === 'leader' && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs">
                      👑
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold">0</span>
                </div>
                <span className="text-xs text-muted-foreground max-w-[60px] truncate">
                  {member.profiles?.name?.split(' ')[0] || 'User'}
                </span>
              </div>
            ))}
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center font-bold text-sm">
                      {post.profiles?.photo_url ? (
                        <img src={post.profiles.photo_url} alt="" className="w-full h-full rounded-full" />
                      ) : (
                        getInitials(post.profiles?.username || post.profiles?.name || 'U')
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{post.profiles?.username || post.profiles?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{post.content}</p>
                  {post.script_used && (
                    <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-xs">
                      Used: {post.script_used}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* FAB Button */}
        <button
          onClick={() => setShowPostModal(true)}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Create Post Modal */}
        <Dialog open={showPostModal} onOpenChange={setShowPostModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share your win</DialogTitle>
            </DialogHeader>
            <Textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Share your parenting win..."
              className="min-h-[120px]"
            />
            <Button
              onClick={handleCreatePost}
              disabled={!postContent.trim() || posting}
              className="w-full"
            >
              {posting ? 'Posting...' : 'Post'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
