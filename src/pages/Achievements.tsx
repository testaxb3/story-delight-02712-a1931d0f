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
      <div className="bg-background pt-4 pb-2 px-4">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-card hover:bg-card/80"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10" /> {/* Spacer to keep title centered if needed, or just empty */}
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-foreground mb-5"
        >
          Milestones
        </motion.h1>
      </div>

      <div className="px-4 max-w-md mx-auto">

        {/* Stats Cards */}
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-6"
          >
            <BadgeStats stats={data.stats} />
          </motion.div>
        )}

        {/* Badges Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
