import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function ActivityStreak() {
  const { user } = useAuth();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [todayActive, setTodayActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.profileId) {
      fetchStreakData();
    }
  }, [user?.profileId]);

  const fetchStreakData = async () => {
    if (!user?.profileId) return;

    try {
      // Get user's community activity (posts and comments) ordered by date
      const { data: posts } = await supabase
        .from('community_posts')
        .select('created_at')
        .eq('user_id', user.profileId)
        .order('created_at', { ascending: false });

      const { data: comments } = await supabase
        .from('post_comments')
        .select('created_at')
        .eq('user_id', user.profileId)
        .order('created_at', { ascending: false });

      // Combine and sort all activity
      const allActivity = [
        ...(posts || []).map(p => new Date(p.created_at!)),
        ...(comments || []).map(c => new Date(c.created_at!)),
      ].sort((a, b) => b.getTime() - a.getTime());

      if (allActivity.length === 0) {
        setLoading(false);
        return;
      }

      // Check if active today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayActivity = allActivity.some(
        date => date.getTime() >= today.getTime()
      );
      setTodayActive(todayActivity);

      // Calculate current streak
      let streak = 0;
      let checkDate = new Date();
      checkDate.setHours(0, 0, 0, 0);

      while (true) {
        const hasActivity = allActivity.some(date => {
          const activityDate = new Date(date);
          activityDate.setHours(0, 0, 0, 0);
          return activityDate.getTime() === checkDate.getTime();
        });

        if (hasActivity) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          // Allow one day gap
          const previousDay = new Date(checkDate);
          previousDay.setDate(previousDay.getDate() - 1);

          const hasPreviousActivity = allActivity.some(date => {
            const activityDate = new Date(date);
            activityDate.setHours(0, 0, 0, 0);
            return activityDate.getTime() === previousDay.getTime();
          });

          if (hasPreviousActivity && streak > 0) {
            checkDate = previousDay;
            continue;
          }
          break;
        }
      }

      setCurrentStreak(streak);

      // Calculate longest streak (simplified)
      let maxStreak = streak;
      let tempStreak = 0;
      let prevDate: Date | null = null;

      for (const date of allActivity) {
        const currentDate = new Date(date);
        currentDate.setHours(0, 0, 0, 0);

        if (!prevDate) {
          tempStreak = 1;
        } else {
          const diffDays = Math.floor(
            (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diffDays === 1) {
            tempStreak++;
          } else if (diffDays > 1) {
            maxStreak = Math.max(maxStreak, tempStreak);
            tempStreak = 1;
          }
        }

        prevDate = currentDate;
      }

      maxStreak = Math.max(maxStreak, tempStreak);
      setLongestStreak(maxStreak);
    } catch (error) {
      console.error('Error fetching streak:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <Card className="p-6 glass border-none shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold">Activity Streak</h3>
        </div>
        {todayActive && (
          <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white border-none">
            Active Today! 🔥
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Current Streak */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <p className="text-xs font-medium text-muted-foreground">Current</p>
            </div>
            <motion.p
              key={currentStreak}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-black text-orange-500"
            >
              {currentStreak}
            </motion.p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        </motion.div>

        {/* Longest Streak */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-500" />
              <p className="text-xs font-medium text-muted-foreground">Best</p>
            </div>
            <p className="text-3xl font-black text-purple-500">{longestStreak}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        </motion.div>
      </div>

      {/* Motivational Message */}
      {currentStreak >= 7 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20"
        >
          <p className="text-sm text-center">
            {currentStreak >= 30
              ? '🔥 Amazing! You\'re on fire! Keep the momentum going! 🔥'
              : currentStreak >= 14
              ? '⭐ Two weeks strong! You\'re a community champion!'
              : '💪 One week streak! You\'re building great habits!'}
          </p>
        </motion.div>
      )}
    </Card>
  );
}
