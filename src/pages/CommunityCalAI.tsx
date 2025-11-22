import { useState, useEffect, useMemo } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Send, Search, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  author_name: string | null;
  author_brain_type: string | null;
  likes_count: number;
  comments_count: number;
  user_has_liked: boolean;
}

const FILTERS = [
  { id: 'recent', label: 'Recent', icon: Clock },
  { id: 'popular', label: 'Popular', icon: TrendingUp },
];

export default function CommunityCalAI() {
  const { user } = useAuth();
  const { activeChild } = useChildProfiles();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('recent');
  const [newPostContent, setNewPostContent] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
    
    const channel = supabase
      .channel('community_posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('community_posts_with_stats')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      // Check which posts the user has liked
      let userLikes: Set<string> = new Set();
      if (user?.id) {
        const { data: likesData } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);
        
        if (likesData) {
          userLikes = new Set(likesData.map(l => l.post_id));
        }
      }

      const formattedPosts = (data as any[]).map((post: any) => ({
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        user_id: post.user_id,
        author_name: post.author_name || post.profile_name || 'Anonymous',
        author_brain_type: post.author_brain_type || null,
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0,
        user_has_liked: userLikes.has(post.id),
      }));
      setPosts(formattedPosts);
    }
    setLoading(false);
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !user) return;

    setPosting(true);
    const { error } = await supabase
      .from('community_posts')
      .insert({
        content: newPostContent.trim(),
        user_id: user.id,
        author_name: user.user_metadata?.full_name || 'Anonymous',
        author_brain_type: activeChild?.brain_profile || null,
      });

    if (!error) {
      setNewPostContent('');
      toast.success('Post created!');
      fetchPosts();
    }
    setPosting(false);
  };

  const handleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) return;

    if (currentlyLiked) {
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: user.id });
    }

    fetchPosts();
  };

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.content.toLowerCase().includes(query)
      );
    }

    if (selectedFilter === 'popular') {
      result = [...result].sort((a, b) => b.likes_count - a.likes_count);
    }

    return result;
  }, [posts, searchQuery, selectedFilter]);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">Share experiences and support each other</p>
        </div>

        {/* Create Post */}
        <Card className="p-6 mb-6 bg-card border-border">
          <Textarea
            placeholder="Share your experience..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="mb-3 min-h-[100px] bg-background border-border"
          />
          <Button
            onClick={handleCreatePost}
            disabled={!newPostContent.trim() || posting}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {posting ? 'Posting...' : 'Post'}
          </Button>
        </Card>

        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          <div className="flex gap-2">
            {FILTERS.map(filter => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "ghost"}
                onClick={() => setSelectedFilter(filter.id)}
                className="flex-shrink-0"
              >
                <filter.icon className="w-4 h-4 mr-2" />
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-6 h-32 animate-pulse bg-card/50" />
            ))
          ) : filteredPosts.length === 0 ? (
            <Card className="p-12 text-center bg-card">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No posts found</h3>
              <p className="text-muted-foreground">Be the first to share!</p>
            </Card>
          ) : (
            filteredPosts.map(post => (
              <Card key={post.id} className="p-6 bg-card border-border">
                {/* Author */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {post.author_name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{post.author_name || 'Anonymous'}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {post.author_brain_type && (
                        <Badge variant="secondary" className="text-xs">
                          {post.author_brain_type}
                        </Badge>
                      )}
                      <span>
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.id, post.user_has_liked)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${post.user_has_liked ? 'fill-accent text-accent' : ''}`}
                    />
                    <span>{post.likes_count}</span>
                  </button>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments_count}</span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
