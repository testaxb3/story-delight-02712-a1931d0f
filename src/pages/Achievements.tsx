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
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground mb-6"
        >
          Milestones
        </motion.h1>

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

        {/* Badges Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
