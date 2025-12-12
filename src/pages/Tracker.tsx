import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Flame, Target, Zap, Lock, Check, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useTrackerDays, type TrackerDay } from '@/hooks/useTrackerDays';
import { TrackerFAB } from '@/components/Tracker/TrackerFAB';
import { TrackerLogModal } from '@/components/Tracker/TrackerLogModal';
const TOTAL_DAYS = 30;

// --- UTILITY FUNCTIONS ---

const formatCountdown = (ms: number | null): string => {
  if (!ms) return "Cooldown";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

// --- TYPES ---

interface UserMetadata {
  avatar_url?: string;
  full_name?: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// --- UTILITY COMPONENTS ---

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
  <div className="bg-card border border-border/40 backdrop-blur-xl p-4 rounded-[20px] flex flex-col justify-between h-32 relative overflow-hidden group">
    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110", color)}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <div className="text-3xl font-black tracking-tight text-foreground font-relative mb-1">{value}</div>
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</div>
    </div>
    {/* Ambient Glow */}
    <div className={cn("absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-20", color)} />
  </div>
);

const DayCell = ({ 
  day, 
  dayNumber, 
  isNext, 
  isPastUncompleted, 
  isFuture, 
  onClick 
}: { 
  day?: TrackerDay; 
  dayNumber: number; 
  isNext: boolean; 
  isPastUncompleted: boolean;
  isFuture: boolean;
  onClick: () => void 
}) => {
  const isCompleted = day?.completed;
  const isLocked = isPastUncompleted || isFuture;
  
  return (
    <motion.button
      whileTap={!isCompleted && !isLocked ? { scale: 0.9 } : undefined}
      onClick={!isCompleted && !isLocked ? onClick : undefined}
      className="relative group"
      disabled={isCompleted || isLocked}
    >
      <div className={cn(
        "aspect-square rounded-lg flex items-center justify-center transition-all duration-300 border relative",
        isCompleted 
          ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30" 
          : isNext
            ? "bg-primary/10 border-primary text-primary ring-2 ring-primary/20 animate-pulse"
            : isLocked
              ? "bg-muted/20 border-border/20 text-muted-foreground/40 opacity-50"
              : "bg-card/50 border-border/30 text-muted-foreground hover:bg-card hover:border-border"
      )}>
        <span className={cn("text-base font-bold", isCompleted ? "text-white" : "text-foreground")}>
          {dayNumber}
        </span>
        {isCompleted && (
          <motion.div 
            initial={{ scale: 0, rotate: -180 }} 
            animate={{ scale: 1, rotate: 0 }} 
            className="absolute inset-0 flex items-center justify-center"
          >
            <Check className="w-4 h-4 text-white stroke-[3]" />
          </motion.div>
        )}
        {isLocked && !isCompleted && (
          <Lock className="w-3 h-3 text-muted-foreground absolute top-1 right-1" />
        )}
      </div>
    </motion.button>
  );
};

// --- MAIN COMPONENT ---

export default function TrackerCalAI() {
  const { user } = useAuth();
  const { activeChild } = useChildProfiles();
  const [showLogModal, setShowLogModal] = useState(false);
  const { triggerHaptic } = useHaptic();

  // Fetch tracker data using new hook
  const { data: trackerStats, isLoading: loading, refetch } = useTrackerDays(user?.id, activeChild?.id);
  
  // Extract data from hook
  const trackerDays = useMemo(() => {
    if (!trackerStats) return [];
    return [...trackerStats.completedDays, trackerStats.nextDay].filter(Boolean) as TrackerDay[];
  }, [trackerStats]);

  // Stats Calculation - Use dashboard stats as source of truth
  const { data: dashboardStats } = useDashboardStats(activeChild?.id);
  
  const stats = useMemo(() => {
    const completed = trackerStats?.completedDays.length ?? 0;
    const progress = (completed / TOTAL_DAYS) * 100;
    const streak = dashboardStats?.currentStreak ?? 0;

    return { completed, progress, streak };
  }, [trackerStats, dashboardStats]);

  // Next day to log (sequence-based)
  const nextDay = trackerStats?.nextDay ?? null;
  const canLog = trackerStats?.canLogToday ?? false;
  const timeUntilNextLog = trackerStats?.timeUntilNextLog ?? null;

  const handleDayClick = (dayNumber: number) => {
    // Check if this is the next day in sequence
    if (!nextDay || dayNumber !== nextDay.day_number) {
      triggerHaptic('error');
      toast.error("You can only log the next day in your sequence");
      return;
    }

    // Check cooldown
    if (!canLog) {
      triggerHaptic('error');
      toast.error("Please wait before logging your next day");
      return;
    }
    
    triggerHaptic('light');
    setShowLogModal(true);
  };

  const handleFABClick = () => {
    if (nextDay && canLog) {
      setShowLogModal(true);
    }
  };


  const avatarUrl = (user?.user_metadata as UserMetadata)?.avatar_url;

  return (
    <MainLayout>
      <div className="h-screen overflow-y-auto bg-background no-scrollbar relative">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="flex items-center justify-center h-14">
            <h2 className="font-bold text-lg text-foreground">Summary</h2>
          </div>
        </header>

        <div className="px-4 pt-4 pb-40 max-w-2xl mx-auto">
          
          {/* Date Label */}
          <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>

          {/* Bento Grid Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            {/* Main Hero Card */}
            <div className="col-span-2 bg-card border border-border/40 p-6 rounded-[24px] relative overflow-hidden shadow-lg">
              <div className="relative z-10 flex justify-between items-end">
                <div>
                  <h2 className="text-lg font-semibold text-muted-foreground mb-2">Total Progress</h2>
                  <div className="text-5xl font-black font-relative tracking-tight">
                    {Math.round(stats.progress)}<span className="text-2xl text-muted-foreground">%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    {stats.completed} of {TOTAL_DAYS} days completed
                  </p>
                </div>
                <div className="w-24 h-24 relative">
                  {/* Simple SVG Ring */}
                  <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                    <motion.circle 
                      cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8"
                      className="text-primary"
                      strokeLinecap="round"
                      strokeDasharray={251.2}
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - (251.2 * stats.progress) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Flame className="w-8 h-8 text-primary fill-primary/20" />
                  </div>
                </div>
              </div>
              {/* Background Mesh Gradient */}
              <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            </div>

            <StatCard 
              title="Current Streak" 
              value={stats.streak} 
              icon={Zap} 
              color="bg-orange-500" 
            />
            <StatCard 
              title="Days Left" 
              value={TOTAL_DAYS - stats.completed} 
              icon={Target} 
              color="bg-blue-500" 
            />
          </motion.div>

          {/* Next Action Card */}
          {nextDay && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-primary/30 rounded-xl p-4 mb-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-primary font-bold uppercase tracking-wide">NEXT UP</p>
                  <p className="text-xl font-black text-foreground">Day {nextDay.day_number}</p>
                </div>
                <Button 
                  onClick={handleFABClick} 
                  disabled={!canLog}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-4 h-9 text-sm"
                >
                  {canLog ? (
                    <>
                      <Plus className="w-4 h-4 mr-1" />
                      Log Now
                    </>
                  ) : (
                    formatCountdown(timeUntilNextLog)
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* 30-Day Challenge Grid */}
          <div className="mb-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">30-Day Challenge Progress</h3>
            </div>
            
            <div className="bg-card/40 border border-border/40 rounded-2xl p-4">
              {loading ? (
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-muted/20 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map(dayNumber => {
                    const day = trackerDays.find(d => d.day_number === dayNumber);
                    const isNextDay = nextDay?.day_number === dayNumber;
                    const isPastUncompleted = nextDay && dayNumber < nextDay.day_number && !day?.completed;
                    const isFuture = nextDay && dayNumber > nextDay.day_number;

                    return (
                      <DayCell 
                        key={dayNumber}
                        day={day}
                        dayNumber={dayNumber}
                        isNext={isNextDay}
                        isPastUncompleted={isPastUncompleted}
                        isFuture={isFuture}
                        onClick={() => handleDayClick(dayNumber)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FLOATING ACTION BUTTON (FAB) - Always visible with countdown */}
        {nextDay && (
          <TrackerFAB
            isEnabled={canLog}
            timeUntilNextLog={timeUntilNextLog}
            onClick={handleFABClick}
          />
        )}

        {/* Log Modal */}
        <TrackerLogModal
          isOpen={showLogModal}
          onClose={() => setShowLogModal(false)}
          nextDay={nextDay}
          onComplete={() => refetch()}
        />
      </div>
    </MainLayout>
  );
}
