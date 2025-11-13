// @ts-nocheck
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Filter, MessageCircle, ThumbsUp, Trash2, Users, Flag, Info, Heart, Send, MoreHorizontal, TrendingUp, Clock, Star, Image as ImageIcon, Smile, Edit2, Pin } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';
import { PostImageUpload } from '@/components/Community/PostImageUpload';
import { ReactionPicker, ReactionType, REACTIONS } from '@/components/Community/ReactionPicker';
import { ReactionsList, ReactionCount } from '@/components/Community/ReactionsList';
import { CommentThread } from '@/components/Community/CommentThread';
import { UserProfileModal } from '@/components/Community/UserProfileModal';
import { SearchBar, SearchFilters } from '@/components/Community/SearchBar';
import { ErrorBoundary } from '@/components/ErrorBoundary';

import { MainLayout } from '@/components/Layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useRateLimit } from '@/hooks/useRateLimit';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { mockCommunityPosts } from '@/lib/mockData';
import { CommunityPostSkeletonList } from '@/components/Skeletons/CommunityPostSkeleton';
import { CommunityGuidelines } from '@/components/CommunityGuidelines';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type CommunityPost = typeof mockCommunityPosts[number];

type SupabasePost = {
  id: string;
  content: string;
  created_at: string | null;
  user_id: string | null;
  image_url?: string | null;
  image_thumbnail_url?: string | null;
  is_seed_post?: boolean;
  author_name?: string | null;
  author_brain_type?: string | null;
  author_photo_url?: string | null;
  post_type?: string | null;
  profiles: {
    name: string | null;
    email: string | null;
    photo_url: string | null;
  } | null;
};

type PostComment = Database['public']['Tables']['post_comments']['Row'] & {
  profiles: {
    name: string | null;
    email: string | null;
    photo_url: string | null;
  } | null;
};

const defaultLikeSummary = { count: 0, liked: false } as const;

const getInitialsFromName = (name: string) => {
  const parts = name.trim().split(' ');
  if (!parts.length) return 'ME';
  return parts
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const buildCommunityPost = (
  post: SupabasePost,
  commentCount = 0,
  isSpotlight = false,
  fallbackBrain: string = 'INTENSE',
  likeSummary: { count: number; liked: boolean } = defaultLikeSummary
): CommunityPost => {
  // For seed posts, use the stored author_name and author_brain_type
  // For real posts, use the profile data
  const isSeedPost = (post as any).is_seed_post === true;
  const authorName = isSeedPost
    ? ((post as any).author_name || 'Community Member')
    : (post.profiles?.name || post.profiles?.email?.split('@')[0] || 'Community Member');
  const brainType = isSeedPost
    ? ((post as any).author_brain_type || fallbackBrain)
    : fallbackBrain;

  // For seed posts, use author_photo_url; for real posts, use profiles.photo_url
  const authorPhotoUrl = isSeedPost
    ? ((post as any).author_photo_url || null)
    : (post.profiles?.photo_url || null);

  return {
    id: post.id,
    author: authorName,
    initials: getInitialsFromName(authorName),
    dayNumber: 1,
    brainType,
    role: 'Parent',
    content: post.content,
    timestamp: post.created_at || new Date().toISOString(),
    likesCount: likeSummary.count,
    userHasLiked: likeSummary.liked,
    commentsCount: commentCount,
    imageUrl: post.image_url || null,
    isSpotlight,
    userId: post.user_id ?? null,
    photoUrl: authorPhotoUrl,
  };
};

type SortOption = 'recent' | 'popular' | 'discussed' | 'trending';

const POSTS_PER_PAGE = 20;

export default function Community() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { activeChild } = useChildProfiles();
  const currentBrain = activeChild?.brain_profile ?? 'INTENSE';
  const postRateLimit = useRateLimit(3, 60000); // 3 posts per minute
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [brainTypeFilter, setBrainTypeFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [comments, setComments] = useState<Record<string, PostComment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [composerMode, setComposerMode] = useState<'general' | 'win' | 'help'>('general');
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [flaggedPosts, setFlaggedPosts] = useState<Set<string>>(new Set());
  const [likeAnimations, setLikeAnimations] = useState<Set<string>>(new Set());
  const [postImageUrl, setPostImageUrl] = useState<string>('');
  const [postImageThumbnailUrl, setPostImageThumbnailUrl] = useState<string>('');
  const [openReactionPicker, setOpenReactionPicker] = useState<string | null>(null);
  const [postReactions, setPostReactions] = useState<Record<string, ReactionCount[]>>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    brainTypes: [],
    postTypes: [],
    dateRange: 'all',
  });

  const placeholders = useMemo(() => [
    "What's on your mind? Share your parenting journey...",
    'Celebrate a win! Which script worked today?',
    'Need support? Ask the community...',
    `Share your progress! How's it going?`,
    'Struggling with something? Let us help...',
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [placeholders]);

  useEffect(() => {
    const state = location.state as { prefill?: string; defaultTab?: 'win' | 'help' } | undefined;
    if (!state) return;

    if (state.prefill) setNewPost(state.prefill);
    if (state.defaultTab) setComposerMode(state.defaultTab);
    setTimeout(() => textareaRef.current?.focus(), 0);

    navigate(location.pathname, { replace: true, state: undefined });
  }, [location, navigate]);

  const composerLabel =
    composerMode === 'help'
      ? 'Ask for Help'
      : composerMode === 'win'
        ? 'Share a Win'
        : 'Create Post';

  const composerHelper =
    composerMode === 'help'
      ? "You're not alone—share what's happening and we'll support you."
      : composerMode === 'win'
        ? 'Celebrate your progress and inspire other parents! 🎉'
        : 'Share your thoughts, wins, or questions with the community.';

  const composerPlaceholder =
    composerMode === 'help'
      ? 'What do you need help with right now?'
      : composerMode === 'win'
        ? '🎉 Share the script or strategy that worked today...'
        : placeholders[placeholderIndex];

  const fetchPosts = useCallback(async (pageNum = 0, append = false) => {
    setLoadingPosts(true);

    try {
      const currentUserId = user?.profileId ?? null;
      const from = pageNum * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      // Query to show:
      // 1. User's own posts (real)
      // 2. Seed posts (fake community posts for social proof)
      // This hides other users' real posts to create isolated experience
      // PERFORMANCE FIX: Use single query with aggregations instead of N+1 queries
      // This query fetches posts, comment counts, and like counts in one go
      const { data, error, count } = await supabase
        .from('community_posts')
        .select(`
          id,
          content,
          created_at,
          user_id,
          is_seed_post,
          author_name,
          author_brain_type,
          author_photo_url,
          post_type,
          image_url,
          image_thumbnail_url,
          profiles:user_id (name, email, photo_url)
        `, { count: 'exact' })
        .or(`user_id.eq.${currentUserId},is_seed_post.eq.true`)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error || !data) {
        throw error ?? new Error('No community posts found');
      }

      // Check if there are more posts to load
      setHasMore((count || 0) > (from + data.length));

      const postIds = data.map((post) => post.id);
      const likeSummaryByPost = new Map<string, { count: number; liked: boolean }>();
      const commentCountByPost = new Map<string, number>();

      if (postIds.length > 0) {
        // PERFORMANCE FIX: Batch fetch likes and comments in parallel
        const [likesResult, commentsResult] = await Promise.all([
          supabase
            .from('post_likes')
            .select('post_id, user_id')
            .in('post_id', postIds),
          supabase
            .from('post_comments')
            .select('post_id')
            .in('post_id', postIds)
        ]);

        const { data: likeRows, error: likesError } = likesResult;
        const { data: commentRows, error: commentsError } = commentsResult;

        if (likesError) {
          console.error('Failed to load post likes', likesError);
        } else {
          likeRows?.forEach((like) => {
            const summary = likeSummaryByPost.get(like.post_id) ?? { count: 0, liked: false };
            summary.count += 1;
            if (currentUserId && like.user_id === currentUserId) {
              summary.liked = true;
            }
            likeSummaryByPost.set(like.post_id, summary);
          });
        }

        if (commentsError) {
          console.error('Failed to load comment counts', commentsError);
        } else {
          commentRows?.forEach((row) => {
            commentCountByPost.set(row.post_id, (commentCountByPost.get(row.post_id) ?? 0) + 1);
          });
        }
      }

      const postsWithCounts = data.map((post, index) => {
        const likeSummary = likeSummaryByPost.get(post.id);
        const commentCount = commentCountByPost.get(post.id) ?? 0;

        return buildCommunityPost(
          post as SupabasePost,
          commentCount,
          index === 0 && pageNum === 0, // Only first post on first page is spotlight
          currentBrain,
          {
            count: likeSummary?.count ?? 0,
            liked: likeSummary?.liked ?? false,
          }
        );
      });

      if (append) {
        // Append new posts for pagination
        setPosts(prev => [...prev, ...postsWithCounts]);
      } else {
        // Replace posts (initial load)
        setPosts(postsWithCounts.length > 0 ? postsWithCounts : [...mockCommunityPosts]);
      }
    } catch (fetchError) {
      console.error('Failed to load community posts', fetchError);
      if (!append) {
        setPosts(mockCommunityPosts.map((post) => ({ ...post, userHasLiked: false })));
      }
    } finally {
      setLoadingPosts(false);
    }
  }, [currentBrain, user?.profileId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loadingPosts) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage(p => {
            const nextPage = p + 1;
            fetchPosts(nextPage, true);
            return nextPage;
          });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingPosts, fetchPosts]);

  const handlePost = () => {
    if (!newPost.trim()) return;
    if (!user?.email) {
      toast.error('You must be signed in to share a post.');
      return;
    }

    // Check rate limit
    if (!postRateLimit.canMakeCall()) {
      const remainingSeconds = Math.ceil(postRateLimit.getRemainingTime() / 1000);
      toast.error(`Please wait ${remainingSeconds}s before posting again`);
      return;
    }

    const createPost = async () => {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email, photo_url')
        .eq('email', user.email)
        .maybeSingle();

      if (profileError || !profile) {
        toast.error('Complete your profile before posting.');
        return;
      }

      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          user_id: profile.id,
          content: newPost.trim(),
          image_url: postImageUrl || null,
          image_thumbnail_url: postImageThumbnailUrl || null,
        })
        .select(`
          id,
          content,
          created_at,
          user_id,
          image_url,
          image_thumbnail_url,
          profiles:user_id (name, email, photo_url)
        `)
        .single();

      if (error || !data) {
        toast.error('Unable to publish your update. Please try again.');
        return;
      }

      const newCommunityPost = buildCommunityPost(
        data as SupabasePost,
        0,
        false,
        currentBrain,
        { count: 0, liked: false }
      );
      setPosts(prev => [newCommunityPost, ...prev]);
      setNewPost('');
      setPostImageUrl('');
      setPostImageThumbnailUrl('');
      setComposerMode('general');
      toast.success('Post shared with the community! 🎉');
      fetchPosts();
    };

    createPost();
  };

  const handleToggleLike = async (postId: string) => {
    const targetPost = posts.find((post) => post.id === postId);
    if (!targetPost) return;

    if (!user?.profileId) {
      toast.error('You must be signed in to like posts.');
      return;
    }

    // Add animation
    setLikeAnimations(prev => new Set(prev).add(postId));
    setTimeout(() => {
      setLikeAnimations(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }, 600);

    const hasLiked = targetPost.userHasLiked;
    const mutation = hasLiked
      ? supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.profileId)
      : supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.profileId });

    const { error } = await mutation;

    if (error) {
      console.error('Failed to toggle like', error);
      toast.error(hasLiked ? 'Unable to remove your like.' : 'Unable to like this post.');
      return;
    }

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              userHasLiked: !hasLiked,
              likesCount: Math.max(0, post.likesCount + (hasLiked ? -1 : 1)),
            }
          : post
      )
    );
  };

  const handleDeletePost = async (postId: string) => {
    if (!user?.profileId) {
      toast.error('You must be signed in to manage posts.');
      return;
    }

    const post = posts.find((item) => item.id === postId);
    if (!post) return;

    if (post.userId !== user.profileId) {
      toast.error('You can only delete your own posts.');
      return;
    }

    // SECURITY: Add confirmation dialog to prevent accidental/malicious deletions (CSRF protection)
    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );

    if (!confirmed) {
      return; // User cancelled
    }

    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', user.profileId);

    if (error) {
      console.error('Failed to delete post', error);
      toast.error('Unable to delete post right now.');
      return;
    }

    setPosts((prev) => prev.filter((item) => item.id !== postId));
    setExpandedComments((prev) => {
      if (!prev.has(postId)) return prev;
      const next = new Set(prev);
      next.delete(postId);
      return next;
    });
    setComments((prev) => {
      if (!(postId in prev)) return prev;
      const { [postId]: _removed, ...rest } = prev;
      return rest;
    });
    toast.success('Post removed.');
  };

  const handleFlagPost = async (postId: string) => {
    if (!user?.profileId) {
      toast.error('You must be signed in to flag posts.');
      return;
    }

    if (flaggedPosts.has(postId)) {
      toast.info('You have already flagged this post.');
      return;
    }

    const { error } = await supabase.from('post_flags').insert({
      post_id: postId,
      user_id: user.profileId,
      reason: 'User-reported inappropriate content',
    });

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation - already flagged
        toast.info('You have already flagged this post.');
        setFlaggedPosts((prev) => new Set(prev).add(postId));
        return;
      }
      console.error('Error flagging post:', error);
      toast.error('Failed to flag post.');
      return;
    }

    setFlaggedPosts((prev) => new Set(prev).add(postId));
    toast.success('Post flagged for review. Thank you for keeping our community safe.');
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!user?.profileId) {
      toast.error('You must be signed in to manage comments.');
      return;
    }

    // SECURITY: Add confirmation dialog to prevent accidental/malicious deletions (CSRF protection)
    const confirmed = window.confirm(
      'Are you sure you want to delete this comment? This action cannot be undone.'
    );

    if (!confirmed) {
      return; // User cancelled
    }

    const { error } = await supabase
      .from('post_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.profileId);

    if (error) {
      console.error('Failed to delete comment', error);
      toast.error('Unable to delete comment.');
      return;
    }

    setComments((prev) => {
      const existing = prev[postId];
      if (!existing) return prev;
      const updated = existing.filter((comment) => comment.id !== commentId);
      if (updated.length === existing.length) return prev;
      if (updated.length === 0) {
        const { [postId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [postId]: updated };
    });

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, commentsCount: Math.max(0, post.commentsCount - 1) }
          : post
      )
    );
    toast.success('Comment deleted.');
  };

  const toggleComments = async (postId: string) => {
    const newSet = new Set(expandedComments);
    if (newSet.has(postId)) {
      newSet.delete(postId);
    } else {
      newSet.add(postId);
      if (!comments[postId]) {
        const { data, error } = await supabase
          .from('post_comments')
          .select(`
            *,
            profiles:user_id (name, email, photo_url)
          `)
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (!error && data) {
          const typedComments = data as PostComment[];
          setComments(prev => ({ ...prev, [postId]: typedComments }));
          setPosts(prev =>
            prev.map(post =>
              post.id === postId ? { ...post, commentsCount: typedComments.length } : post
            )
          );
        }
      }
    }
    setExpandedComments(newSet);
  };

  const handleAddComment = async (postId: string) => {
    const content = newComment[postId]?.trim();
    if (!content || !user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, photo_url')
      .eq('email', user.email)
      .maybeSingle();

    if (!profile) return;

    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: profile.id,
        content,
      })
      .select(`
        *,
        profiles:user_id (name, email, photo_url)
      `)
      .single();

    if (data && !error) {
      const typedComment = data as PostComment;
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), typedComment],
      }));
      setNewComment(prev => ({ ...prev, [postId]: '' }));
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, commentsCount: post.commentsCount + 1 }
            : post
        )
      );
      toast.success('Comment added!');
    }
  };

  const toggleExpandPost = (postId: string) => {
    setExpandedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const getBrainTypeBadgeColor = (brainType: string) => {
    switch (brainType) {
      case 'INTENSE':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      case 'DISTRACTED':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'DEFIANT':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const highlightContent = (content: string, maxLength = 300, postId: string) => {
    const isExpanded = expandedPosts.has(postId);
    const shouldTruncate = content.length > maxLength;

    // SANITIZE content first to prevent XSS attacks
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [], // Remove all HTML tags
      ALLOWED_ATTR: []
    });

    const displayContent = (!isExpanded && shouldTruncate)
      ? sanitizedContent.slice(0, maxLength) + '...'
      : sanitizedContent;

    const highlighted = displayContent
      .split(
        /(\bDay \d+\b|\bINTENSE\b|\bDISTRACTED\b|\bDEFIANT\b|\d+\s*hours?.*?→.*?\d+\s*minutes?)/gi
      )
      .map((part, index) => {
        if (/Day \d+/i.test(part)) {
          return (
            <Badge
              key={index}
              variant="outline"
              className="bg-blue-500/10 text-blue-700 border-blue-500/20 mx-1"
            >
              {part}
            </Badge>
          );
        }
        if (/INTENSE/i.test(part)) {
          return (
            <Badge
              key={index}
              variant="outline"
              className="bg-purple-500/10 text-purple-700 border-purple-500/20 mx-1 cursor-pointer hover:bg-purple-500/20"
            >
              🧠 {part}
            </Badge>
          );
        }
        if (/DISTRACTED/i.test(part)) {
          return (
            <Badge
              key={index}
              variant="outline"
              className="bg-blue-500/10 text-blue-700 border-blue-500/20 mx-1 cursor-pointer hover:bg-blue-500/20"
            >
              ⚡ {part}
            </Badge>
          );
        }
        if (/DEFIANT/i.test(part)) {
          return (
            <Badge
              key={index}
              variant="outline"
              className="bg-green-500/10 text-green-700 border-green-500/20 mx-1 cursor-pointer hover:bg-green-500/20"
            >
              💪 {part}
            </Badge>
          );
        }
        if (/\d+\s*hours?.*?→.*?\d+\s*minutes?/i.test(part)) {
          const [before, after] = part.split('→');
          return (
            <span key={index} className="inline-flex items-center gap-1 mx-1">
              <span className="line-through text-destructive">{before.trim()}</span>
              <span>→</span>
              <span className="text-green-600 font-semibold">{after.trim()}</span>
            </span>
          );
        }
        return part;
      });

    return (
      <>
        {highlighted}
        {shouldTruncate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpandPost(postId);
            }}
            className="text-primary hover:underline ml-2 font-medium text-sm"
          >
            {isExpanded ? 'See less' : 'See more'}
          </button>
        )}
      </>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const brainTypeFilters = [
    { label: 'All', value: null, icon: '🌐' },
    { label: 'INTENSE', value: 'INTENSE', color: 'bg-purple-500/10 text-purple-700 border-purple-500/20', icon: '🧠' },
    { label: 'DISTRACTED', value: 'DISTRACTED', color: 'bg-blue-500/10 text-blue-700 border-blue-500/20', icon: '⚡' },
    { label: 'DEFIANT', value: 'DEFIANT', color: 'bg-green-500/10 text-green-700 border-green-500/20', icon: '💪' },
  ];

  const sortOptions: { label: string; value: SortOption; icon: any }[] = [
    { label: 'Most Recent', value: 'recent', icon: Clock },
    { label: 'Most Popular', value: 'popular', icon: Star },
    { label: 'Most Discussed', value: 'discussed', icon: MessageCircle },
    { label: 'Trending', value: 'trending', icon: TrendingUp },
  ];

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // Apply search query (full-text search)
    if (searchFilters.query.trim()) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter((post) => {
        const contentMatch = post.content.toLowerCase().includes(query);
        const authorMatch = post.author.toLowerCase().includes(query);
        return contentMatch || authorMatch;
      });
    }

    // Apply brain type filters
    if (searchFilters.brainTypes.length > 0) {
      filtered = filtered.filter((post) =>
        searchFilters.brainTypes.includes(post.brainType)
      );
    } else if (brainTypeFilter) {
      // Fallback to old filter if no search filters
      filtered = filtered.filter((post) => post.brainType === brainTypeFilter);
    }

    // Apply post type filters (if available in post data)
    // Note: This requires post_type field in the database
    if (searchFilters.postTypes.length > 0) {
      // For now, we'll skip this as post_type might not be in all posts
      // In production, ensure all posts have a post_type field
    }

    // Apply date range filter
    if (searchFilters.dateRange !== 'all') {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      filtered = filtered.filter((post) => {
        const postDate = new Date(post.timestamp);
        switch (searchFilters.dateRange) {
          case 'today':
            return postDate >= startOfDay;
          case 'week':
            return postDate >= startOfWeek;
          case 'month':
            return postDate >= startOfMonth;
          default:
            return true;
        }
      });
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered = [...filtered].sort((a, b) => b.likesCount - a.likesCount);
        break;
      case 'discussed':
        filtered = [...filtered].sort((a, b) => b.commentsCount - a.commentsCount);
        break;
      case 'trending':
        // Simple trending: recent posts with high engagement
        filtered = [...filtered].sort((a, b) => {
          const aScore = a.likesCount + a.commentsCount * 2;
          const bScore = b.likesCount + b.commentsCount * 2;
          const aTime = new Date(a.timestamp).getTime();
          const bTime = new Date(b.timestamp).getTime();
          const aRecency = (Date.now() - aTime) / (1000 * 60 * 60); // hours ago
          const bRecency = (Date.now() - bTime) / (1000 * 60 * 60);
          const aTrending = aScore / Math.max(aRecency, 1);
          const bTrending = bScore / Math.max(bRecency, 1);
          return bTrending - aTrending;
        });
        break;
      case 'recent':
      default:
        filtered = [...filtered].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        break;
    }

    return filtered;
  }, [brainTypeFilter, posts, sortBy, searchFilters]);

  const spotlightPost = useMemo(
    () => posts.find((post) => post.isSpotlight),
    [posts]
  );
  const regularPosts = filteredAndSortedPosts.filter((post) => !post.isSpotlight);

  const userInitials = useMemo(() => {
    if (user?.user_metadata?.full_name) {
      return getInitialsFromName(user.user_metadata.full_name);
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'ME';
  }, [user]);

  const PostCard = ({ post, isSpotlight = false }: { post: CommunityPost; isSpotlight?: boolean }) => {
    const postComments = comments[post.id] || [];
    const isCommentsExpanded = expandedComments.has(post.id);
    const isLiking = likeAnimations.has(post.id);

    return (
      <Card className={`glass border-none shadow-lg hover:shadow-xl transition-all duration-300 ${
        isSpotlight ? 'border-2 border-yellow-400/50 dark:border-yellow-600/50' : ''
      }`}>
        {isSpotlight && (
          <div className="px-6 pt-4 pb-2">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none shadow-md">
              ⭐ Featured Post
            </Badge>
          </div>
        )}

        <div className="p-6">
          {/* Post Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              {/* Profile Picture */}
              <div
                className="relative cursor-pointer"
                onClick={() => {
                  if (post.userId) {
                    setSelectedUserId(post.userId);
                    setShowUserProfile(true);
                  }
                }}
              >
                {post.photoUrl ? (
                  <img
                    src={post.photoUrl}
                    alt={post.author}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md hover:ring-primary transition-all"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-md hover:ring-2 hover:ring-primary transition-all">
                    {post.initials}
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  post.brainType === 'INTENSE' ? 'bg-purple-500' :
                  post.brainType === 'DISTRACTED' ? 'bg-blue-500' :
                  'bg-green-500'
                }`} />
              </div>

              {/* Author Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className="font-bold text-base cursor-pointer hover:underline"
                    onClick={() => {
                      if (post.userId) {
                        setSelectedUserId(post.userId);
                        setShowUserProfile(true);
                      }
                    }}
                  >
                    {post.author}
                  </h3>
                  <Badge variant="outline" className={`text-xs ${getBrainTypeBadgeColor(post.brainType)}`}>
                    {post.brainType}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(post.timestamp)}
                  {post.dayNumber && <span className="ml-1">• Day {post.dayNumber}</span>}
                </p>
              </div>
            </div>

            {/* More Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {post.userId && user?.profileId === post.userId ? (
                  <>
                    <DropdownMenuItem onClick={() => handleDeletePost(post.id)} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem
                    onClick={() => handleFlagPost(post.id)}
                    disabled={flaggedPosts.has(post.id)}
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    {flaggedPosts.has(post.id) ? 'Flagged' : 'Report Post'}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Post Content */}
          <div className="mb-4 text-sm leading-relaxed">
            {highlightContent(post.content, 300, post.id)}
          </div>

          {/* Post Image */}
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post attachment"
              className="w-full rounded-lg mb-4 shadow-md"
            />
          )}

          {/* Engagement Stats */}
          {(post.likesCount > 0 || post.commentsCount > 0) && (
            <div className="flex items-center justify-between py-2 mb-2 border-t border-b">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {post.likesCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    {post.likesCount}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {post.commentsCount > 0 && `${post.commentsCount} ${post.commentsCount === 1 ? 'comment' : 'comments'}`}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleLike(post.id)}
              className={`flex-1 gap-2 ${post.userHasLiked ? 'text-red-500 hover:text-red-600' : 'hover:bg-red-50'} ${
                isLiking ? 'scale-110' : ''
              } transition-all duration-300`}
            >
              <Heart className={`w-4 h-4 ${post.userHasLiked ? 'fill-red-500' : ''}`} />
              <span className="font-medium">{post.userHasLiked ? 'Liked' : 'Like'}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleComments(post.id)}
              className="flex-1 gap-2 hover:bg-blue-50"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium">Comment</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex-1 gap-2 hover:bg-green-50"
            >
              <Send className="w-4 h-4" />
              <span className="font-medium">Share</span>
            </Button>
          </div>

          {/* Comments Section */}
          {isCommentsExpanded && (
            <CommentThread
              postId={post.id}
              currentUserId={user?.profileId ?? null}
              userPhotoUrl={user?.photo_url ?? null}
              userInitials={userInitials}
              formatTimestamp={formatTimestamp}
              getInitialsFromName={getInitialsFromName}
              onCommentCountChange={(newCount) => {
                setPosts((prev) =>
                  prev.map((p) =>
                    p.id === post.id ? { ...p, commentsCount: newCount } : p
                  )
                );
              }}
            />
          )}
        </div>
      </Card>
    );
  };

  return (
    <MainLayout>
      <ErrorBoundary>
        <div className="space-y-4">
          {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Community</h1>
            <p className="text-sm text-muted-foreground">Connect, share, and grow together</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGuidelines(true)}
            className="gap-2"
          >
            <Info className="w-4 h-4" />
            Guidelines
          </Button>
        </div>

        {/* Post Composer */}
        <Card className="p-4 glass border-none shadow-lg">
          <div className="flex gap-3 mb-3">
            {user?.photo_url ? (
              <img
                src={user.photo_url}
                alt="You"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                {userInitials}
              </div>
            )}
            <Textarea
              ref={textareaRef}
              placeholder={composerPlaceholder}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="flex-1 min-h-[80px] resize-none border-none bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary rounded-2xl"
            />
          </div>

          {/* Image Upload */}
          <div className="pl-[52px] mb-3">
            <PostImageUpload
              onImageSelected={(imageUrl, thumbnailUrl) => {
                setPostImageUrl(imageUrl);
                setPostImageThumbnailUrl(thumbnailUrl);
              }}
              onImageRemoved={() => {
                setPostImageUrl('');
                setPostImageThumbnailUrl('');
              }}
              currentImageUrl={postImageUrl}
            />
          </div>

          <div className="flex items-center justify-between pl-[52px]">
            <div className="flex gap-2">
              <Button
                variant={composerMode === 'general' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setComposerMode('general')}
                className="text-xs"
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                General
              </Button>
              <Button
                variant={composerMode === 'win' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setComposerMode('win')}
                className="text-xs"
              >
                🎉 Win
              </Button>
              <Button
                variant={composerMode === 'help' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setComposerMode('help')}
                className="text-xs"
              >
                ❓ Help
              </Button>
            </div>

            <Button onClick={handlePost} disabled={!newPost.trim()} size="sm" className="gap-2">
              <Send className="w-4 h-4" />
              Post
            </Button>
          </div>
        </Card>

        {/* Search Bar */}
        <SearchBar
          onFiltersChange={setSearchFilters}
          placeholder="Search posts by content or author..."
        />

        {/* Filters and Sort */}
        <div className="flex flex-wrap gap-2 items-center justify-between">
          {/* Brain Type Filters (Legacy - still visible but integrated with search) */}
          <div className="flex gap-2 flex-wrap">
            {brainTypeFilters.map((filter) => (
              <Badge
                key={filter.label}
                variant={brainTypeFilter === filter.value ? 'default' : 'outline'}
                className={`cursor-pointer whitespace-nowrap ${
                  filter.value && brainTypeFilter === filter.value ? filter.color : ''
                }`}
                onClick={() => setBrainTypeFilter(filter.value)}
              >
                <span className="mr-1">{filter.icon}</span>
                {filter.label}
              </Badge>
            ))}
          </div>

          {/* Sort Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {React.createElement(
                  sortOptions.find(o => o.value === sortBy)?.icon || Clock,
                  { className: 'w-4 h-4' }
                )}
                {sortOptions.find(o => o.value === sortBy)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={sortBy === option.value ? 'bg-muted' : ''}
                >
                  {React.createElement(option.icon, { className: 'w-4 h-4 mr-2' })}
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Posts Feed */}
        {loadingPosts ? (
          <CommunityPostSkeletonList count={5} />
        ) : regularPosts.length === 0 ? (
          <Card className="p-12 text-center glass border-none shadow-lg">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {brainTypeFilter
                ? `No posts found for ${brainTypeFilter}. Try a different filter!`
                : 'Be the first to share your journey with the community!'}
            </p>
            {!brainTypeFilter && (
              <Button onClick={() => textareaRef.current?.focus()} size="lg" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Create Your First Post
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Spotlight Post */}
            {spotlightPost && !brainTypeFilter && (
              <PostCard post={spotlightPost} isSpotlight />
            )}

            {/* Regular Posts */}
            {regularPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Infinite Scroll Loader */}
            {hasMore && !loadingPosts && (
              <div ref={loadMoreRef} className="py-8 text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Loading more posts...</p>
              </div>
            )}
          </div>
        )}
        </div>

        {/* Community Guidelines Modal */}
        <CommunityGuidelines open={showGuidelines} onOpenChange={setShowGuidelines} />

        {/* User Profile Modal */}
        {selectedUserId && (
          <UserProfileModal
            open={showUserProfile}
            onOpenChange={setShowUserProfile}
            userId={selectedUserId}
            currentUserId={user?.profileId ?? null}
          />
        )}
      </ErrorBoundary>
    </MainLayout>
  );
}
