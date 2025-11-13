import React, { useEffect, useState } from 'react';
import { X, MessageCircle, Heart, TrendingUp, Award, UserPlus, UserMinus, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  photo_url: string | null;
  bio: string | null;
  badges: string[] | null;
  followers_count: number;
}

interface UserStats {
  postsCount: number;
  likesReceived: number;
  commentsCount: number;
}

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  currentUserId: string | null;
}

export function UserProfileModal({ open, onOpenChange, userId, currentUserId }: UserProfileModalProps) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({ postsCount: 0, likesReceived: 0, commentsCount: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    if (open && userId) {
      fetchUserProfile();
    }
  }, [open, userId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email, photo_url, bio, badges, followers_count')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData as UserProfile);

      // Fetch stats
      const [postsRes, commentsRes] = await Promise.all([
        supabase.from('community_posts').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('post_comments').select('id', { count: 'exact' }).eq('user_id', userId),
      ]);

      // Fetch likes using RPC function for correct count
      const { data: likesCount, error: likesError } = await supabase
        .rpc('get_user_likes_count', { target_user_id: userId });

      if (likesError) {
        console.error('Error fetching likes:', likesError);
      }

      setStats({
        postsCount: postsRes.count || 0,
        likesReceived: likesCount || 0,
        commentsCount: commentsRes.count || 0,
      });

      // Fetch recent posts
      const { data: posts } = await supabase
        .from('community_posts')
        .select('id, content, created_at, image_url')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(6);

      setRecentPosts(posts || []);

      // Check if following
      if (currentUserId && currentUserId !== userId) {
        const { data: followData } = await supabase
          .from('user_followers')
          .select('id')
          .eq('follower_id', currentUserId)
          .eq('following_id', userId)
          .maybeSingle();

        setIsFollowing(!!followData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUserId) {
      toast.error('You must be signed in to follow users');
      return;
    }

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('user_followers')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', userId);

        if (error) throw error;

        setIsFollowing(false);
        setProfile((prev) => prev ? { ...prev, followers_count: Math.max(0, prev.followers_count - 1) } : null);
        toast.success('Unfollowed user');
      } else {
        // Follow
        const { error } = await supabase
          .from('user_followers')
          .insert({ follower_id: currentUserId, following_id: userId });

        if (error) throw error;

        setIsFollowing(true);
        setProfile((prev) => prev ? { ...prev, followers_count: prev.followers_count + 1 } : null);
        toast.success('Following user');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    }
  };

  const getBadgeInfo = (badge: string) => {
    const badges: Record<string, { icon: string; color: string; label: string }> = {
      active_member: { icon: '🌟', color: 'bg-blue-500/10 text-blue-700 border-blue-500/20', label: 'Active Member' },
      helpful_parent: { icon: '💬', color: 'bg-green-500/10 text-green-700 border-green-500/20', label: 'Helpful Parent' },
      top_contributor: { icon: '🏆', color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20', label: 'Top Contributor' },
    };
    return badges[badge] || { icon: '⭐', color: 'bg-gray-500/10 text-gray-700 border-gray-500/20', label: badge };
  };

  const getInitials = (name: string | null, email: string | null) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    }
    return email?.slice(0, 2).toUpperCase() || 'U';
  };

  const isOwnProfile = currentUserId === userId;

  if (!profile && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">User Profile</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                <AvatarImage src={profile.photo_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-2xl">
                  {getInitials(profile.name, profile.email)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h2 className="text-2xl font-bold">{profile.name || profile.email?.split('@')[0] || 'User'}</h2>
                {profile.bio && <p className="text-muted-foreground mt-1">{profile.bio}</p>}

                {/* Stats */}
                <div className="flex gap-4 mt-3">
                  <div className="text-center">
                    <div className="font-bold text-lg">{stats.postsCount}</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{profile.followers_count}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{stats.likesReceived}</div>
                    <div className="text-xs text-muted-foreground">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{stats.commentsCount}</div>
                    <div className="text-xs text-muted-foreground">Comments</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  {isOwnProfile ? (
                    <Button onClick={() => navigate('/profile/edit')} variant="outline" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <Button onClick={handleFollowToggle} variant={isFollowing ? 'outline' : 'default'} className="gap-2">
                      {isFollowing ? (
                        <>
                          <UserMinus className="w-4 h-4" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Follow
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Badges */}
            {profile.badges && profile.badges.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Badges
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.badges.map((badge) => {
                    const badgeInfo = getBadgeInfo(badge);
                    return (
                      <Badge key={badge} variant="outline" className={badgeInfo.color}>
                        {badgeInfo.icon} {badgeInfo.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Posts */}
            {recentPosts.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Recent Posts</h3>
                <div className="grid grid-cols-2 gap-3">
                  {recentPosts.map((post) => (
                    <Card key={post.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                      {post.image_url && (
                        <img src={post.image_url} alt="" className="w-full h-32 object-cover rounded mb-2" />
                      )}
                      <p className="text-sm line-clamp-3">{post.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
