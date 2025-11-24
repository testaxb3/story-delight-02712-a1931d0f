import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserAchievements } from '@/hooks/useUserAchievements';
import { BadgesGrid } from '@/components/Badges/BadgesGrid';
import { BadgeStats } from '@/components/Badges/BadgeStats';

export default function Achievements() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useUserAchievements(user?.id);

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
          
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold">My Achievements</h1>
          </div>
          
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section with Avatar and Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="relative inline-block mb-4">
            {/* Avatar with Streak Ring */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-4xl">
                  {(user?.user_metadata as any)?.avatar_emoji || '👤'}
                </span>
              </div>
              
              {/* Streak Badge */}
              {data && data.stats.currentStreak > 0 && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                  <span>🔥</span>
                  <span>{data.stats.currentStreak}</span>
                </div>
              )}
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2">
            {(user?.user_metadata as any)?.display_name || 'Your Achievements'}
          </h2>
          <p className="text-muted-foreground">
            Track your progress and unlock new badges
          </p>
        </motion.div>

        {/* Stats Cards */}
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <BadgeStats stats={data.stats} />
          </motion.div>
        )}

        {/* Next Goal Section */}
        {data?.stats.nextGoal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{data.stats.nextGoal.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-1">
                  Next Goal: {data.stats.nextGoal.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {data.stats.nextGoal.description}
                </p>
                
                {data.stats.nextGoal.progress && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {data.stats.nextGoal.progress.current}/{data.stats.nextGoal.progress.required} {data.stats.nextGoal.progress.label}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((data.stats.nextGoal.progress.current / data.stats.nextGoal.progress.required) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ 
                          width: `${Math.min((data.stats.nextGoal.progress.current / data.stats.nextGoal.progress.required) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Badges Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BadgesGrid 
            badges={data?.badges || []} 
            loading={isLoading}
          />
        </motion.div>
      </div>
    </div>
  );
}
