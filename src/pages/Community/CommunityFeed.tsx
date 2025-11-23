import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronDown, Users, Plus, Share2, MessageCircle, 
  Copy, Flame, Check, Camera, X, Crown, Heart, Sparkles, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PostReactionsSheet } from '@/components/Community/PostReactionsSheet';
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
  joined_at: string;
  name: string;
  username: string | null;
  photo_url: string | null;
  brain_profile: string | null;
}

interface Post {
  id: string;
  title: string | null;
  content: string;
  image_url: string | null;
  script_used: string | null;
  duration_minutes: number | null;
  result_type: 'success' | 'partial' | 'needs_practice' | null;
  created_at: string;
  user_id: string;
  profiles: {
    username: string | null;
    name: string;
    photo_url: string | null;
    brain_profile: string | null;
  };
}

export default function CommunityFeed() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const communityId = location.state?.communityId;
  const shouldRefresh = location.state?.refresh;

  const [communities, setCommunities] = useState<Community[]>([]);
  const [currentCommunity, setCurrentCommunity] = useState<Community | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLeader, setIsLeader] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [postScript, setPostScript] = useState('');
  const [postDuration, setPostDuration] = useState('');
  const [postResult, setPostResult] = useState<'success' | 'partial' | 'needs_practice'>('success');
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showReactionsSheet, setShowReactionsSheet] = useState(false);

  useEffect(() => {
    if (user?.profileId) {
      loadCommunities();
    }
  }, [user?.profileId, shouldRefresh]);

  useEffect(() => {
    if (currentCommunity) {
      loadMembers();
      loadPosts();
      checkLeaderStatus();
    }
  }, [currentCommunity]);

  const loadCommunities = async () => {
    if (!user?.profileId) return;

    const { data, error } = await supabase
      .from('community_members')
      .select('community_id, communities!inner(id, name, logo_emoji, logo_url, invite_code)')
      .eq('user_id', user.profileId);

    if (error || !data || data.length === 0) {
      console.error('Error loading communities:', error);
      return;
    }

    const communityList = data
      .map((item: any) => item.communities)
      .filter(Boolean);
    
    if (communityList.length === 0) return;

    setCommunities(communityList);
    
    const selectedCommunity = communityId 
      ? communityList.find((c: Community) => c.id === communityId) || communityList[0]
      : communityList[0];
    
    setCurrentCommunity(selectedCommunity);
  };

  const loadMembers = async () => {
    if (!currentCommunity) return;
    
    // Use RPC function instead of direct join to avoid PostgREST cache issues
    const { data, error } = await supabase.rpc('get_community_members', {
      p_community_id: currentCommunity.id
    });

    if (error) {
      console.error('Error loading members:', error);
      return;
    }

    setMembers((data || []) as any);
  };

  const loadPosts = async () => {
    if (!currentCommunity) return;

    const { data, error } = await supabase
      .from('group_posts')
      .select('id, title, content, image_url, script_used, duration_minutes, result_type, created_at, user_id, profiles(username, name, photo_url, brain_profile)')
      .eq('community_id', currentCommunity.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading posts:', error);
      return;
    }

    setPosts((data || []) as any);
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
    if (!postTitle.trim()) {
      toast.error('❌ Title is required');
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
      // Upload image if exists
      let imageUrl: string | null = null;
      if (postImageFile) {
        toast.info('📤 Uploading image...');
        imageUrl = await uploadImageToStorage();
      }

      const { error } = await supabase
        .from('group_posts')
        .insert({
          community_id: currentCommunity.id,
          user_id: user.profileId,
          title: postTitle.trim(),
          content: postContent.trim() || null,
          image_url: imageUrl,
          script_used: postScript.trim() || null,
          duration_minutes: postDuration ? parseInt(postDuration) : null,
          result_type: postResult,
        });

      if (error) throw error;

      toast.success('✅ Post created!');
      
      // Clean up
      if (postImage.startsWith('blob:')) {
        URL.revokeObjectURL(postImage);
      }
      
      setPostTitle('');
      setPostContent('');
      setPostImage('');
      setPostImageFile(null);
      setPostScript('');
      setPostDuration('');
      setPostResult('success');
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

  const handleOpenReactions = (postId: string) => {
    setSelectedPostId(postId);
    setShowReactionsSheet(true);
  };

  const handleAddReaction = async (emoji: string) => {
    if (!selectedPostId || !user?.profileId) return;
    
    try {
      const { data, error } = await supabase
        .rpc('toggle_group_reaction', {
          p_post_id: selectedPostId,
          p_emoji: emoji
        });

      if (error) throw error;
      
      if (data?.success) {
        toast.success(data.message);
      } else {
        toast.error(data?.message || 'Failed to update reaction');
        return;
      }

      // Reload posts to show updated reaction count
      await loadPosts();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!selectedPostId || !user?.profileId || !content.trim()) return;
    
    try {
      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: selectedPostId,
          user_id: user.profileId,
          content: content.trim(),
        });
      
      if (error) throw error;
      
      toast.success('Comment added!');
      await loadPosts();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('❌ Please select a valid image (JPEG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('❌ Image must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPostImage(previewUrl);
      setPostImageFile(file);
      toast.success('✅ Image ready to upload');
    } catch (error: any) {
      toast.error(`❌ Error: ${error.message}`);
      setPostImage('');
      setPostImageFile(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    if (postImage.startsWith('blob:')) {
      URL.revokeObjectURL(postImage);
    }
    setPostImage('');
    setPostImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImageToStorage = async (): Promise<string | null> => {
    if (!postImageFile || !user?.profileId) return null;

    try {
      const fileExt = postImageFile.name.split('.').pop();
      const fileName = `${user.profileId}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('community-posts')
        .upload(fileName, postImageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('community-posts')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error: any) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  return (
    <MainLayout>
      <div className="pb-24 bg-background min-h-screen">
        {/* Enhanced Header with glassmorphism */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
        >
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  {currentCommunity?.logo_url ? (
                    <img src={currentCommunity.logo_url} alt="" className="w-10 h-10 rounded-full ring-2 ring-orange-500/20" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-xl shadow-lg">
                      {currentCommunity?.logo_emoji || '💪'}
                    </div>
                  )}
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-base">{currentCommunity?.name || 'Select Community'}</span>
                    <span className="text-xs text-muted-foreground">{members.length} members</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
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

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/community/members', { state: { communityId: currentCommunity?.id } })}
                className="w-11 h-11 rounded-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
              >
                <Users className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="px-4 py-6 space-y-6">
          {/* Enhanced Leaderboard with CalAI aesthetic */}
          <AnimatePresence>
            {currentCommunity && members.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-br from-card to-card/95 border border-border/50 rounded-2xl p-5 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    Community Stars
                  </h3>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                    {members.length} members
                  </div>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                  {members
                    .sort((a, b) => {
                      if (a.role === 'leader' && b.role !== 'leader') return -1;
                      if (a.role !== 'leader' && b.role === 'leader') return 1;
                      return 0;
                    })
                    .map((member, idx) => (
                      <motion.div 
                        key={member.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
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
                              <img src={member.photo_url} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <span className="text-white">{getInitials(member.name || 'U')}</span>
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
            )}
          </AnimatePresence>


          {/* Enhanced Posts Feed with CalAI design */}
          <motion.div 
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {posts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 px-6"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 flex items-center justify-center">
                  <MessageCircle className="w-10 h-10 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-6">Be the first to share your parenting win!</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPostModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
                >
                  Share Your Story
                </motion.button>
              </motion.div>
            ) : (
              posts.map((post, idx) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-gradient-to-br from-card to-card/95 border border-border/50 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Enhanced Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center font-bold text-sm relative shadow-md ring-2 ring-purple-500/20">
                      {post.profiles?.photo_url ? (
                        <img src={post.profiles.photo_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-white">{getInitials(post.profiles?.username || post.profiles?.name || 'U')}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-sm">{post.profiles?.username || post.profiles?.name || 'User'}</p>
                        {post.profiles?.brain_profile && (
                          <span className={cn(
                            "text-xs px-2.5 py-0.5 rounded-full font-semibold",
                            post.profiles.brain_profile === 'INTENSE' && "bg-gradient-to-r from-orange-500/10 to-orange-600/10 text-orange-600 dark:text-orange-400 border border-orange-500/20",
                            post.profiles.brain_profile === 'DISTRACTED' && "bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
                            post.profiles.brain_profile === 'DEFIANT' && "bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-600 dark:text-red-400 border border-red-500/20"
                          )}>
                            {post.profiles.brain_profile}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">
                        {new Date(post.created_at).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Title */}
                  {post.title && (
                    <h3 className="text-lg font-bold mb-3 leading-snug">{post.title}</h3>
                  )}

                  {/* Enhanced Image with better styling */}
                  {post.image_url && (
                    <div className="relative mb-4 -mx-1 overflow-hidden rounded-xl">
                      <img 
                        src={post.image_url} 
                        alt="" 
                        className="w-full object-cover max-h-[320px] hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Enhanced Content */}
                  {post.content && (
                    <p className="text-sm mb-4 text-foreground/80 leading-relaxed">{post.content}</p>
                  )}

                  {/* Enhanced Metrics with CalAI style */}
                  {(post.script_used || post.duration_minutes || post.result_type) && (
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      {post.script_used && (
                        <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-full border border-blue-500/20 font-semibold">
                          <span>🎯</span>
                          <span>{post.script_used}</span>
                        </div>
                      )}
                      {post.duration_minutes && (
                        <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-purple-500/10 to-purple-600/10 text-purple-600 dark:text-purple-400 px-3 py-2 rounded-full border border-purple-500/20 font-semibold">
                          <span>⏱️</span>
                          <span>{post.duration_minutes}min</span>
                        </div>
                      )}
                      {post.result_type && (
                        <div className={cn(
                          "flex items-center gap-2 text-xs px-3 py-2 rounded-full border font-semibold",
                          post.result_type === 'success' && "bg-gradient-to-r from-green-500/10 to-green-600/10 text-green-600 dark:text-green-400 border-green-500/20",
                          post.result_type === 'partial' && "bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
                          post.result_type === 'needs_practice' && "bg-gradient-to-r from-orange-500/10 to-orange-600/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
                        )}>
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>
                            {post.result_type === 'success' && 'Success'}
                            {post.result_type === 'partial' && 'Partial'}
                            {post.result_type === 'needs_practice' && 'Practice'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Enhanced Actions with better interaction feedback */}
                  <div className="flex gap-2.5 pt-2 border-t border-border/50">
                    <motion.button 
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleOpenReactions(post.id)}
                      className="flex-1 h-11 rounded-xl bg-gradient-to-r from-muted to-muted/80 border border-border/50 flex items-center justify-center gap-2.5 hover:shadow-md transition-all font-semibold"
                    >
                      <Heart className="w-4.5 h-4.5 text-orange-500" />
                      <span className="text-sm">React</span>
                    </motion.button>
                    <motion.button 
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleOpenReactions(post.id)}
                      className="flex-1 h-11 rounded-xl bg-gradient-to-r from-muted to-muted/80 border border-border/50 flex items-center justify-center gap-2.5 hover:shadow-md transition-all font-semibold"
                    >
                      <MessageCircle className="w-4.5 h-4.5" />
                      <span className="text-sm">Comment</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>

        {/* Enhanced FAB Button with animation */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPostModal(true)}
          className="fixed bottom-24 right-5 w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-2xl hover:shadow-orange-500/50 transition-all duration-200 z-50 ring-4 ring-orange-500/20"
        >
          <Plus className="w-7 h-7" strokeWidth={2.5} />
        </motion.button>

        {/* Create Post Modal */}
        <Dialog open={showPostModal} onOpenChange={setShowPostModal}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Share your win</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title *</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g., Finally got him to sleep without a fight!"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description (optional)</label>
                <Textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Tell your story..."
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Photo (optional)</label>
                
                {!postImage ? (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full px-4 py-3 border border-border rounded-lg flex items-center justify-center gap-2 hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      <Camera className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {uploadingImage ? 'Processing...' : 'Add Photo'}
                      </span>
                    </button>
                  </>
                ) : (
                  <div className="relative">
                    <img
                      src={postImage}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-border"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Script Used (optional)</label>
                <input
                  type="text"
                  value={postScript}
                  onChange={(e) => setPostScript(e.target.value)}
                  placeholder="e.g., Bedtime Routine"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Duration (minutes, optional)</label>
                <input
                  type="number"
                  value={postDuration}
                  onChange={(e) => setPostDuration(e.target.value)}
                  placeholder="15"
                  min="1"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Result</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPostResult('success')}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors",
                      postResult === 'success'
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-500"
                        : "bg-muted border-border"
                    )}
                  >
                    Success
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostResult('partial')}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors",
                      postResult === 'partial'
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-500"
                        : "bg-muted border-border"
                    )}
                  >
                    Partial
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostResult('needs_practice')}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors",
                      postResult === 'needs_practice'
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-500"
                        : "bg-muted border-border"
                    )}
                  >
                    Needs Practice
                  </button>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCreatePost}
              disabled={!postTitle.trim() || posting}
              className="w-full"
            >
              {posting ? 'Posting...' : 'Post'}
            </Button>
          </DialogContent>
        </Dialog>

        {/* Reactions/Comments Bottom Sheet */}
        <PostReactionsSheet
          open={showReactionsSheet}
          onOpenChange={setShowReactionsSheet}
          postId={selectedPostId || ''}
          userAvatar={user?.profileId ? undefined : undefined}
          userName={user?.profileId ? 'User' : undefined}
          onAddReaction={handleAddReaction}
          onAddComment={handleAddComment}
        />
      </div>
    </MainLayout>
  );
}
