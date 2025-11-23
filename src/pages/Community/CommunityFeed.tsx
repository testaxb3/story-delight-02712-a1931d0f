import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronDown, Users, Plus, Share2, MessageCircle, 
  Copy, Flame, Check, Camera, X, Crown
} from 'lucide-react';
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
  profiles: {
    name: string;
    photo_url: string | null;
  };
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
    
    const { data, error } = await supabase
      .from('community_members')
      .select('id, user_id, role, profiles(name, photo_url)')
      .eq('community_id', currentCommunity.id)
      .order('role', { ascending: true });

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
      // Check if reaction already exists
      const { data: existing } = await supabase
        .from('group_reactions')
        .select('id')
        .eq('post_id', selectedPostId)
        .eq('user_id', user.profileId)
        .eq('emoji', emoji)
        .single();

      if (existing) {
        // Remove reaction if already exists
        const { error } = await supabase
          .from('group_reactions')
          .delete()
          .eq('id', existing.id);
        
        if (error) throw error;
        toast.success('Reaction removed');
      } else {
        // Add new reaction
        const { error } = await supabase
          .from('group_reactions')
          .insert({
            post_id: selectedPostId,
            user_id: user.profileId,
            emoji: emoji,
          });
        
        if (error) throw error;
        toast.success('Reaction added!');
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
          {/* Leaderboard - Horizontal scrollable member list */}
          {currentCommunity && members.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Crown className="w-5 h-5 text-orange-500" />
                Members
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                {members.map((member, idx) => (
                  <div
                    key={member.id}
                    className="flex flex-col items-center gap-1 min-w-[60px]"
                  >
                    <div className="relative">
                      {idx === 0 && member.role === 'leader' && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center z-10">
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-sm font-bold border-2 border-background">
                        {member.profiles?.photo_url ? (
                          <img 
                            src={member.profiles.photo_url} 
                            alt={member.profiles?.name || 'User'} 
                            className="w-full h-full rounded-full object-cover" 
                          />
                        ) : (
                          <span className="text-white">
                            {getInitials(member.profiles?.name || 'U')}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-center line-clamp-1 max-w-[60px]">
                      {member.profiles?.name?.split(' ')[0] || 'User'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members Leaderboard */}
          {(() => {
            console.log('🎯 Rendering leaderboard check:', { membersLength: members.length, members });
            return members.length > 0 ? (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-3 px-1">Community Members ({members.length})</h3>
                <div className="flex gap-4 overflow-x-auto pb-2 px-1">
                  {members
                    .sort((a, b) => {
                      // Leaders first, then by streak (currently 0 for all)
                      if (a.role === 'leader' && b.role !== 'leader') return -1;
                      if (a.role !== 'leader' && b.role === 'leader') return 1;
                      return 0;
                    })
                    .map((member, index) => (
              <div key={member.id} className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="relative">
                  {member.role === 'leader' && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                      <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    </div>
                  )}
                  <div className={cn(
                    "w-[70px] h-[70px] rounded-full flex items-center justify-center font-bold text-lg",
                    member.role === 'leader' 
                      ? "bg-gradient-to-br from-yellow-400 to-yellow-600" 
                      : "bg-gradient-to-br from-purple-500 to-purple-600"
                  )}>
                    {member.profiles?.photo_url ? (
                      <img src={member.profiles.photo_url} alt="" className="w-full h-full rounded-full" />
                    ) : (
                      getInitials(member.profiles?.name || 'U')
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-xs font-bold">0</span>
                </div>
                <span className="text-xs text-muted-foreground max-w-[70px] truncate text-center">
                  {member.profiles?.name?.split(' ')[0] || 'User'}
                </span>
                  </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-card border border-border rounded-xl p-4">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center font-bold text-sm relative">
                      {post.profiles?.photo_url ? (
                        <img src={post.profiles.photo_url} alt="" className="w-full h-full rounded-full" />
                      ) : (
                        getInitials(post.profiles?.username || post.profiles?.name || 'U')
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{post.profiles?.username || post.profiles?.name || 'User'}</p>
                        {post.profiles?.brain_profile && (
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            post.profiles.brain_profile === 'INTENSE' && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                            post.profiles.brain_profile === 'DISTRACTED' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                            post.profiles.brain_profile === 'DEFIANT' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          )}>
                            {post.profiles.brain_profile}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  {post.title && (
                    <h3 className="text-base font-bold mb-2">{post.title}</h3>
                  )}

                  {/* Image */}
                  {post.image_url && (
                    <img 
                      src={post.image_url} 
                      alt="" 
                      className="w-full rounded-xl mb-3 object-cover max-h-[300px]"
                    />
                  )}

                  {/* Content */}
                  {post.content && (
                    <p className="text-sm mb-3 text-muted-foreground">{post.content}</p>
                  )}

                  {/* Metrics */}
                  {(post.script_used || post.duration_minutes || post.result_type) && (
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      {post.script_used && (
                        <div className="flex items-center gap-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full">
                          <span>🎯</span>
                          <span className="font-medium">{post.script_used}</span>
                        </div>
                      )}
                      {post.duration_minutes && (
                        <div className="flex items-center gap-1.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1.5 rounded-full">
                          <span>⏱️</span>
                          <span className="font-medium">{post.duration_minutes} min</span>
                        </div>
                      )}
                      {post.result_type && (
                        <div className={cn(
                          "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium",
                          post.result_type === 'success' && "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
                          post.result_type === 'partial' && "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
                          post.result_type === 'needs_practice' && "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                        )}>
                          <span>📈</span>
                          <span>
                            {post.result_type === 'success' && 'Success'}
                            {post.result_type === 'partial' && 'Partial'}
                            {post.result_type === 'needs_practice' && 'Needs Practice'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenReactions(post.id)}
                      className="flex-1 h-10 rounded-lg border border-border flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                    >
                      <span className="text-lg">😊</span>
                      <span className="text-sm font-medium">React</span>
                    </button>
                    <button 
                      onClick={() => handleOpenReactions(post.id)}
                      className="flex-1 h-10 rounded-lg border border-border flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Comment</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* FAB Button */}
        <button
          onClick={() => setShowPostModal(true)}
          className="fixed bottom-24 right-5 w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-200 z-50"
        >
          <Plus className="w-7 h-7" />
        </button>

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
