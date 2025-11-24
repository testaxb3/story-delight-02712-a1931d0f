import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PostReactionsSheet } from '@/components/Community/PostReactionsSheet';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCommunityFeed } from '@/hooks/useCommunityFeed';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { usePostActions } from '@/hooks/usePostActions';
import { CommunityHeader } from '@/components/Community/CommunityHeader';
import { MembersList } from '@/components/Community/MembersList';
import { PostCard } from '@/components/Community/PostCard';
import { EmptyState } from '@/components/Community/EmptyState';
import { PostsFeedSkeleton, MembersListSkeleton } from '@/components/Community/LoadingStates';

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
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  // Use custom hooks for data management
  const { posts, postReactions, loading: postsLoading } = useCommunityFeed(currentCommunity?.id || null);
  const { members, loading: membersLoading } = useCommunityMembers(currentCommunity?.id || null, user?.profileId || null);
  const { addReaction, deletePost, deletingPostId } = usePostActions();

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
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-gradient-to-b dark:from-background dark:via-background dark:to-primary/5 dark:dark:to-primary/10 pb-24 relative overflow-hidden">
        {/* Ambient Background Glows - Only Dark Mode */}
        <div className="hidden dark:block fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="hidden dark:block fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-0" />

        {/* Fixed Header Background for Status Bar */}
        <div className="fixed top-0 left-0 right-0 z-40 h-20 bg-gradient-to-b from-[#F8F9FA] via-[#F8F9FA]/80 to-transparent dark:from-background dark:via-background dark:to-transparent pointer-events-none" />

        {/* Header */}
        <CommunityHeader
          communities={communities}
          currentCommunity={currentCommunity}
          memberCount={members.length}
          onCommunityChange={setCurrentCommunity}
        />

        <div className="px-4 space-y-4 relative z-10">
          {/* Members List */}
          <AnimatePresence mode="wait">
            {membersLoading ? (
              <MembersListSkeleton />
            ) : (
              currentCommunity && members.length > 0 && (
                <MembersList members={members} />
              )
            )}
          </AnimatePresence>

          {/* Posts Feed */}
          <AnimatePresence mode="wait">
            {postsLoading ? (
              <PostsFeedSkeleton count={3} />
            ) : posts.length === 0 ? (
              <EmptyState onCreatePost={() => handleOpenReactions('')} />
            ) : (
              <div className="space-y-5">
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
        </div>
      </div>

      {/* Reactions Sheet */}
      <PostReactionsSheet
        open={showReactionsSheet}
        onOpenChange={setShowReactionsSheet}
        postId={selectedPostId || ''}
        userAvatar={undefined}
        userName={user?.email || 'User'}
        onAddReaction={handleAddReaction}
        onAddComment={() => {}}
      />

      {/* Floating Add Post Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/community/create-post', { state: { communityId: currentCommunity?.id } })}
        className="fixed right-6 w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center z-50 hover:shadow-xl hover:shadow-orange-500/40 transition-shadow"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 120px)' }}
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </motion.button>
    </MainLayout>
  );
}
