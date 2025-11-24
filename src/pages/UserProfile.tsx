import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Flame, Award, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserAchievements } from '@/hooks/useUserAchievements';
import { BadgeCard } from '@/components/Badges/BadgeCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const isOwnProfile = currentUser?.id === userId;

  // Redirect to /achievements if viewing own profile
  useEffect(() => {
    if (isOwnProfile) {
      navigate('/achievements', { replace: true });
    }
  }, [isOwnProfile, navigate]);

  // Fetch user profile data
  const { data: profile } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required');

      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, avatar_emoji, bio, created_at')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId && !isOwnProfile
  });

  const { data: achievementsData, isLoading } = useUserAchievements(userId);

  if (isOwnProfile) {
    return null; // Will redirect
  }

  const unlockedBadges = achievementsData?.badges.filter(b => b.unlocked) || [];
  const recentBadges = [...unlockedBadges]
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <h1 className="text-lg font-bold">Profile</h1>
          
          <div className="w-20" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Avatar with Streak Ring */}
          <div className="relative inline-block mb-4">
            <div className="relative">
              {/* Animated streak ring */}
              {achievementsData && achievementsData.stats.currentStreak > 0 && (
                <div className="absolute inset-0 rounded-full">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="4"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 46}`}
                      strokeDashoffset={`${2 * Math.PI * 46 * (1 - Math.min(achievementsData.stats.currentStreak / 100, 1))}`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}

              {/* Avatar */}
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-6xl">
                  {profile?.avatar_emoji || '👤'}
                </span>
              </div>

              {/* Streak badge */}
              {achievementsData && achievementsData.stats.currentStreak > 0 && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  <span>{achievementsData.stats.currentStreak}</span>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <h2 className="text-3xl font-black text-foreground mb-2">
            {profile?.display_name || 'Anonymous User'}
          </h2>
          
          {profile?.bio && (
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              {profile.bio}
            </p>
          )}

          {/* Join Date */}
          {profile?.created_at && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          )}
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-black text-foreground">
              {achievementsData?.stats.currentStreak || 0}
            </p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Award className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-black text-foreground">
              {achievementsData?.stats.unlockedCount || 0}
            </p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl mx-auto mb-2">📝</div>
            <p className="text-2xl font-black text-foreground">
              {achievementsData?.stats.currentStreak || 0}
            </p>
            <p className="text-xs text-muted-foreground">Days Done</p>
          </div>
        </motion.div>

        {/* Recent Achievements */}
        {recentBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Recent Achievements
            </h3>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              {recentBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <BadgeCard badge={badge} showProgress={false} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Badges - Only Unlocked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-foreground mb-4">
            All Badges ({unlockedBadges.length})
          </h3>
          
          {isLoading ? (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-28 h-28 rounded-full bg-muted animate-pulse" />
                  <div className="w-20 h-4 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : unlockedBadges.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
              <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No badges unlocked yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              {unlockedBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <BadgeCard badge={badge} showProgress={false} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
