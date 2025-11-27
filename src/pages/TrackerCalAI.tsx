import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Flame, Target, X, Zap, Plus, Lock, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useTrackerDays, type TrackerDay } from '@/hooks/useTrackerDays';
import { TrackerFAB } from '@/components/Tracker/TrackerFAB';

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
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [stressLevel, setStressLevel] = useState<number>(3);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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
  const nextDay = trackerStats?.nextDay;
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
    setSelectedDay(dayNumber);
    setStressLevel(3);
    setShowSuccess(false);
  };

  const handleFABClick = () => {
    if (nextDay && canLog) {
      handleDayClick(nextDay.day_number);
    }
  };

  const handleSave = async () => {
    if (!selectedDay || !user?.id || !activeChild?.id) return;

    setSaving(true);
    triggerHaptic('success');
    
    // 1. SHOW SUCCESS UI
    setShowSuccess(true);
    
    // 2. TRIGGER CONFETTI
    const end = Date.now() + 1000;
    const colors = ['#bb0000', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        zIndex: 9999
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        zIndex: 9999
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // 3. DB UPDATE
    const day = nextDay;
    if (day) {
      const { error } = await supabase
        .from('tracker_days')
        .update({
          completed: true,
          stress_level: stressLevel,
          completed_at: new Date().toISOString(),
        })
        .eq('id', day.id);

      if (error) {
        toast.error('Connection error. Please check your internet.');
        setSaving(false);
        setShowSuccess(false);
        setSelectedDay(null);
        return;
      }

      // Refetch data to update UI
      refetch();
    }

    // 4. CLOSE MODAL AFTER DELAY
    setTimeout(() => {
      setSelectedDay(null);
      setSaving(false);
      setShowSuccess(false);
    }, 1800);
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

        {/* Log Interaction Overlay */}
        <AnimatePresence>
          {selectedDay !== null && (
            <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !saving && !showSuccess && setSelectedDay(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ y: "100%", scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: "100%", scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-md bg-card border-t border-border/40 rounded-t-[32px] sm:rounded-[32px] p-6 pb-10 shadow-2xl overflow-hidden"
              >
                {/* Success View Overlay */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 bg-green-500 flex flex-col items-center justify-center text-white p-6 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md"
                      >
                        <Check className="w-12 h-12 stroke-[4]" />
                      </motion.div>
                      <h3 className="text-3xl font-black font-relative mb-2">Day Completed!</h3>
                      <p className="text-white/90 font-medium">Streak updated successfully.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-muted/30 rounded-full" />
                
                <button
                  onClick={() => !saving && !showSuccess && setSelectedDay(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/20 transition-colors"
                  disabled={saving || showSuccess}
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>

                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black font-relative text-foreground">Day {selectedDay}</h3>
                      <p className="text-sm text-muted-foreground font-medium">Log your progress</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-3">
                        How was your stress level today?
                      </label>
                      <div className="flex gap-2 justify-between">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            onClick={() => !saving && setStressLevel(level)}
                            disabled={saving}
                            className={cn(
                              "flex-1 aspect-square rounded-2xl border-2 font-bold text-lg transition-all",
                              stressLevel === level
                                ? "bg-primary border-primary text-primary-foreground shadow-lg scale-105"
                                : "bg-card border-border/40 text-muted-foreground hover:border-primary/50 hover:bg-card/80"
                            )}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 px-1">
                        <span className="text-xs text-muted-foreground font-medium">Calm</span>
                        <span className="text-xs text-muted-foreground font-medium">Stressed</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-2xl shadow-xl"
                    >
                      {saving ? "Saving..." : "Complete Day"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
