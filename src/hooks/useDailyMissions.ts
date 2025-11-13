import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'script' | 'video' | 'tracker' | 'community' | 'profile';
  brainTypeSpecific?: 'INTENSE' | 'DISTRACTED' | 'DEFIANT';
  xpReward: number;
  completed: boolean;
  progress: number;
  target: number;
  actionUrl?: string;
}

const MISSION_TEMPLATES = {
  INTENSE: [
    {
      id: 'intense-script',
      title: 'Try a Calming Script',
      description: 'Use 1 INTENSE brain script today',
      icon: '🧘',
      category: 'script' as const,
      xpReward: 50,
      target: 1,
      actionUrl: '/scripts',
    },
    {
      id: 'intense-tracker',
      title: 'Track Emotional Regulation',
      description: 'Log how your child handled big emotions today',
      icon: '📊',
      category: 'tracker' as const,
      xpReward: 30,
      target: 1,
      actionUrl: '/my-plan',
    },
    {
      id: 'intense-video',
      title: 'Learn About Intense Brains',
      description: 'Watch a video about emotional regulation',
      icon: '📺',
      category: 'video' as const,
      xpReward: 40,
      target: 1,
      actionUrl: '/videos',
    },
  ],
  DISTRACTED: [
    {
      id: 'distracted-script',
      title: 'Practice Focus Techniques',
      description: 'Use 1 DISTRACTED brain script today',
      icon: '🎯',
      category: 'script' as const,
      xpReward: 50,
      target: 1,
      actionUrl: '/scripts',
    },
    {
      id: 'distracted-tracker',
      title: 'Track Attention Wins',
      description: 'Log moments of sustained focus today',
      icon: '✨',
      category: 'tracker' as const,
      xpReward: 30,
      target: 1,
      actionUrl: '/my-plan',
    },
    {
      id: 'distracted-video',
      title: 'Understand Attention Patterns',
      description: 'Watch a video about focus and attention',
      icon: '📺',
      category: 'video' as const,
      xpReward: 40,
      target: 1,
      actionUrl: '/videos',
    },
  ],
  DEFIANT: [
    {
      id: 'defiant-script',
      title: 'Collaborative Solutions',
      description: 'Use 1 DEFIANT brain script today',
      icon: '🤝',
      category: 'script' as const,
      xpReward: 50,
      target: 1,
      actionUrl: '/scripts',
    },
    {
      id: 'defiant-tracker',
      title: 'Track Cooperation Moments',
      description: 'Log instances of collaboration today',
      icon: '🌟',
      category: 'tracker' as const,
      xpReward: 30,
      target: 1,
      actionUrl: '/my-plan',
    },
    {
      id: 'defiant-video',
      title: 'Learn Collaborative Strategies',
      description: 'Watch a video about defiant brain patterns',
      icon: '📺',
      category: 'video' as const,
      xpReward: 40,
      target: 1,
      actionUrl: '/videos',
    },
  ],
  UNIVERSAL: [
    {
      id: 'share-story',
      title: 'Connect with Community',
      description: 'Share your story or comment on another parent\'s post',
      icon: '💬',
      category: 'community' as const,
      xpReward: 60,
      target: 1,
      actionUrl: '/community',
    },
    {
      id: 'complete-profile',
      title: 'Update Child Profile',
      description: 'Keep your child\'s profile information current',
      icon: '👶',
      category: 'profile' as const,
      xpReward: 40,
      target: 1,
      actionUrl: '/profiles',
    },
    {
      id: 'daily-practice',
      title: 'Daily Consistency',
      description: 'Complete your daily tracker to maintain your streak',
      icon: '🔥',
      category: 'tracker' as const,
      xpReward: 25,
      target: 1,
      actionUrl: '/my-plan',
    },
  ],
};

export function useDailyMissions(userId?: string, childBrainType?: 'INTENSE' | 'DISTRACTED' | 'DEFIANT') {
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalXP, setTotalXP] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);

  useEffect(() => {
    async function generateDailyMissions() {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const today = new Date().toISOString().split('T')[0];

        // Get today's activity
        const [scriptsResult, trackerResult, videosResult, postsResult] = await Promise.all([
          // Scripts used today (assuming there's a usage tracking table)
          supabase
            .from('tracker_days')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('date', today)
            .eq('completed', true),

          // Tracker entries today
          supabase
            .from('tracker_days')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('date', today),

          // Videos watched (you might not have this table, so handle gracefully)
          supabase
            .from('user_activity')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('activity_type', 'video_watched')
            .gte('created_at', `${today}T00:00:00`)
            .then(r => r)
            .catch(() => ({ count: 0, error: null })),

          // Community posts today
          supabase
            .from('community_posts')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', `${today}T00:00:00`)
            .then(r => r)
            .catch(() => ({ count: 0, error: null })),
        ]);

        const scriptsUsedToday = scriptsResult.count || 0;
        const trackerEntriesToday = trackerResult.count || 0;
        const videosWatchedToday = videosResult.count || 0;
        const postsCreatedToday = postsResult.count || 0;

        // Generate missions based on brain type
        const brainSpecificMissions = childBrainType
          ? MISSION_TEMPLATES[childBrainType]
          : [];

        const universalMissions = MISSION_TEMPLATES.UNIVERSAL;

        // Select 3 brain-specific + 2 universal missions
        const selectedMissions: DailyMission[] = [
          ...brainSpecificMissions.slice(0, 2),
          ...universalMissions.slice(0, 2),
        ].map(template => {
          let progress = 0;
          let completed = false;

          // Calculate progress based on category
          switch (template.category) {
            case 'script':
              progress = scriptsUsedToday;
              completed = scriptsUsedToday >= template.target;
              break;
            case 'tracker':
              progress = trackerEntriesToday;
              completed = trackerEntriesToday >= template.target;
              break;
            case 'video':
              progress = videosWatchedToday;
              completed = videosWatchedToday >= template.target;
              break;
            case 'community':
              progress = postsCreatedToday;
              completed = postsCreatedToday >= template.target;
              break;
            case 'profile':
              // This would require checking if profile was updated today
              progress = 0;
              completed = false;
              break;
          }

          return {
            ...template,
            brainTypeSpecific: childBrainType,
            completed,
            progress: Math.min(progress, template.target),
          };
        });

        setMissions(selectedMissions);

        const completedCount = selectedMissions.filter(m => m.completed).length;
        const earnedXP = selectedMissions
          .filter(m => m.completed)
          .reduce((sum, m) => sum + m.xpReward, 0);

        setCompletedToday(completedCount);
        setTotalXP(earnedXP);
      } catch (error) {
        console.error('Error generating daily missions:', error);
      } finally {
        setLoading(false);
      }
    }

    generateDailyMissions();
  }, [userId, childBrainType]);

  return {
    missions,
    loading,
    totalXP,
    completedToday,
    totalMissions: missions.length,
  };
}
