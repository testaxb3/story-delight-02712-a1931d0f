import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Trophy } from 'lucide-react';
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
        .select('id, name, photo_url, username, created_at')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
      return data;
    },
    enabled: !!userId && !isOwnProfile
  });

  const { data: achievementsData, isLoading } = useUserAchievements(userId);

  if (isOwnProfile) {
    return null; // Will redirect
  }

  const unlockedBadges = achievementsData?.badges.filter(b => b.unlocked) || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header com botão voltar */}
      <div className="bg-background pt-4 pb-2 px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card hover:bg-card/80"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="px-4 max-w-md mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-6"
        >
          {/* Avatar com streak ring (estilo MyFitnessPal) */}
          <div className="relative mb-4">
            {/* Gradient ring background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 p-1">
              <div className="w-full h-full rounded-full bg-background" />
            </div>

            {/* Avatar */}
            <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center p-1">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                {profile?.photo_url ? (
                  <img src={profile.photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl">👤</span>
                )}
              </div>
            </div>

            {/* Streak badge - estilo flutuante */}
            {achievementsData && achievementsData.stats.longestStreak > 0 && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-card px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border-2 border-orange-500">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span className="text-sm font-bold text-foreground">{achievementsData.stats.longestStreak}</span>
              </div>
            )}
          </div>

          {/* Nome e username */}
          <h2 className="text-3xl font-black text-foreground mb-1">
            {profile?.name || 'Anonymous User'}
          </h2>

          {profile?.username && (
            <p className="text-sm text-muted-foreground">
              @{profile.username}
            </p>
          )}
        </motion.div>

        {/* Stats Cards - 2 colunas estilo MyFitnessPal */}
        {achievementsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-3 mb-6"
          >
            {/* Longest Streak Card */}
            <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xl font-bold text-foreground leading-tight">
                    {achievementsData.stats.longestStreak} days
                  </div>
                  <div className="text-xs text-muted-foreground">longest streak</div>
                </div>
              </div>
            </div>

            {/* Badges Earned Card */}
            <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-indigo-500 fill-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xl font-bold text-foreground leading-tight">
                    {achievementsData.stats.unlockedCount}/{achievementsData.stats.totalCount} badges
                  </div>
                  <div className="text-xs text-muted-foreground">•</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Milestones Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-foreground mb-4">
            Milestones
          </h3>

          {isLoading ? (
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className="w-20 h-20 bg-muted/50 animate-pulse"
                    style={{
                      clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
                    }}
                  />
                  <div className="w-16 h-3 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : unlockedBadges.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
              <p className="text-muted-foreground">No badges unlocked yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-x-4 gap-y-6 justify-items-center">
              {unlockedBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03, type: 'spring', stiffness: 200 }}
                >
                  <BadgeCard badge={badge} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
