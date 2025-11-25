import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PostReactionsSheet } from '@/components/Community/PostReactionsSheet';
import { CreatePostModal } from '@/components/Community/CreatePostModal';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCommunityFeed } from '@/hooks/useCommunityFeed';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { usePostActions } from '@/hooks/usePostActions';
import { CommunityLeaderboard } from '@/components/Community/CommunityLeaderboard';
import { PostCard } from '@/components/Community/PostCard';
import { EmptyState } from '@/components/Community/EmptyState';
import { PostsFeedSkeleton, MembersListSkeleton } from '@/components/Community/LoadingStates';
import { ChevronDown, PenSquare, MessageSquare } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Community {
  id: string;
  name: string;
  logo_emoji: string | null;
  logo_url: string | null;
  invite_code: string;
}

export default function CommunityFeed() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const communityId = location.state?.communityId;
  const shouldRefresh = location.state?.refresh;

  const [communities, setCommunities] = useState<Community[]>([]);
  const [currentCommunity, setCurrentCommunity] = useState<Community | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showReactionsSheet, setShowReactionsSheet] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  // Use custom hooks for data management
  const { posts, postReactions, loading: postsLoading, loadPosts } = useCommunityFeed(currentCommunity?.id || null);
  const { members, loading: membersLoading } = useCommunityMembers(currentCommunity?.id || null, user?.profileId || null);
  const { addReaction, addComment, deleteComment, deletePost, deletingPostId } = usePostActions();

  useEffect(() => {
    if (user?.profileId) {
      loadCommunities();
      checkIfAdmin();
    }
  }, [user?.profileId, shouldRefresh]);

  const checkIfAdmin = useCallback(async () => {
    if (!user?.profileId) return;

    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.profileId)
      .single();

    setIsUserAdmin(data?.is_admin || false);
  }, [user?.profileId]);

  const loadCommunities = useCallback(async () => {
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
  }, [user?.profileId, communityId]);

  const handleOpenReactions = useCallback((postId: string) => {
    setSelectedPostId(postId);
    setShowReactionsSheet(true);
  }, []);

  const handleAddReaction = useCallback(async (emoji: string) => {
    if (!selectedPostId) return;
    await addReaction(selectedPostId, emoji);
    setShowReactionsSheet(false);
  }, [selectedPostId, addReaction]);

  const handleAddComment = useCallback(async (content: string) => {
    if (!selectedPostId) return;
    await addComment(selectedPostId, content);
  }, [selectedPostId, addComment]);

  const handleDeleteComment = useCallback(async (commentId: string) => {
    return await deleteComment(commentId);
  }, [deleteComment]);

  const handleDeletePost = useCallback(async (postId: string) => {
    await deletePost(postId);
  }, [deletePost]);

  // Redirect if no communities
  useEffect(() => {
    if (!user?.profileId) return;
    
    const timer = setTimeout(() => {
      if (communities.length === 0 && !currentCommunity) {
        navigate('/community');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [communities, currentCommunity, user?.profileId, navigate]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-background pb-24 relative">
        {/* Apple Style Header */}
        <header className="px-5 pt-[calc(env(safe-area-inset-top)+8px)] pb-4 sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="flex items-center justify-between">
            {/* Community Selector (Pill) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3"
                >
                  {currentCommunity ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl border border-border/50">
                        {currentCommunity.logo_url ? (
                          <img src={currentCommunity.logo_url} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          currentCommunity.logo_emoji || '💬'
                        )}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <h1 className="text-lg font-bold text-foreground leading-none">{currentCommunity.name}</h1>
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">{members.length} members</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-10 w-32 bg-secondary/50 rounded-full animate-pulse" />
                  )}
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 rounded-xl p-2 bg-popover/95 backdrop-blur-xl border-border/50 shadow-xl">
                {communities.map((comm) => (
                  <DropdownMenuItem
                    key={comm.id}
                    onClick={() => setCurrentCommunity(comm)}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-lg border border-border/50">
                      {comm.logo_url ? (
                        <img src={comm.logo_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        comm.logo_emoji || '💬'
                      )}
                    </div>
                    <span className="font-semibold text-sm">{comm.name}</span>
                    {currentCommunity?.id === comm.id && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Top Action */}
            <button 
              onClick={() => setShowCreateModal(true)}
              className="w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors"
            >
              <PenSquare className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </header>

        <main className="px-4 space-y-6 relative z-10 mt-4">
          {/* Leaderboard (Stories Style) */}
          {currentCommunity && (
            <CommunityLeaderboard communityId={currentCommunity.id} />
          )}

          {/* Posts Feed */}
          <AnimatePresence mode="wait">
            {postsLoading ? (
              <PostsFeedSkeleton count={3} />
            ) : posts.length === 0 ? (
              <EmptyState onCreatePost={() => setShowCreateModal(true)} />
            ) : (
              <div className="space-y-6 pb-32">
                {posts.map((post, idx) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    reactions={postReactions[post.id] || []}
                    currentUserId={user?.profileId || null}
                    isAdmin={isUserAdmin}
                    onDelete={handleDeletePost}
                    onReact={handleOpenReactions}
                    onComment={handleOpenReactions}
                    isDeletingPost={deletingPostId === post.id}
                    index={idx}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Reactions Sheet */}
      <PostReactionsSheet
        open={showReactionsSheet}
        onOpenChange={setShowReactionsSheet}
        postId={selectedPostId || ''}
        userAvatar={(user?.user_metadata as any)?.avatar_url || undefined}
        userName={user?.email || 'User'}
        currentUserId={user?.profileId || null}
        isAdmin={isUserAdmin}
        onAddReaction={handleAddReaction}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
      />

      {/* Create Post Modal */}
      {currentCommunity && user?.profileId && (
        <CreatePostModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          communityId={currentCommunity.id}
          userId={user.profileId}
          onSuccess={loadPosts}
        />
      )}

      {/* FAB (Only visible when scrolling down, logic can be added later) */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCreateModal(true)}
        className="fixed right-6 bottom-24 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 flex items-center justify-center z-50 hover:shadow-xl transition-all"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>
    </MainLayout>
  );
}