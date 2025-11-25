import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserAchievements } from '@/hooks/useUserAchievements';
import { BadgesGrid } from '@/components/Badges/BadgesGrid';
import { BadgeStats } from '@/components/Badges/BadgeStats';
import { StickyHeader } from '@/components/Navigation/StickyHeader';

export default function Achievements() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useUserAchievements(user?.id);

  return (
    <div className="min-h-screen bg-background">
      <StickyHeader
        title="Milestones"
        leftAction={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-card hover:bg-card/80"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        }
      />

      <main className="px-4 max-w-md mx-auto pt-4">
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
      </main>
    </div>
  );
}
