import { useState, useEffect, useRef, useMemo } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Flame, Target, Trophy, Calendar, ChevronLeft, ChevronRight, X, Zap, Plus, Lock, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useTrackerDays, type TrackerDay } from '@/hooks/useTrackerDays';
import { TrackerFAB } from '@/components/Tracker/TrackerFAB';

const TOTAL_DAYS = 30;

// --- UTILITY COMPONENTS ---

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: "spring", stiffness: 300, damping: 30 }}
    className="bg-white/5 dark:bg-[#1C1C1E] backdrop-blur-xl border border-white/10 p-4 rounded-[20px] flex flex-col justify-between h-32 relative overflow-hidden group"
  >
    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110", color)}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <div className="text-3xl font-black tracking-tight text-foreground font-relative mb-1">{value}</div>
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</div>
    </div>
    {/* Ambient Glow */}
    <div className={cn("absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-20", color)} />
  </motion.div>
);

const DayCell = ({ 
  day, 
  dayNumber, 
  isToday, 
  isPastUncompleted, 
  isFuture, 
  onClick 
}: { 
  day?: TrackerDay; 
  dayNumber: number; 
  isToday: boolean; 
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
        "aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border",
        isCompleted 
          ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30" 
          : isToday
            ? "bg-primary/10 border-primary text-primary ring-2 ring-primary/20"
            : isLocked
              ? "bg-muted/20 border-transparent text-muted-foreground/40 opacity-50"
              : "bg-card/50 border-transparent text-muted-foreground hover:bg-card"
      )}>
        <span className="text-[10px] font-bold uppercase opacity-60">
          {isCompleted ? "Done" : isLocked ? "Locked" : "Day"}
        </span>
        <span className={cn("text-xl font-black font-relative", isCompleted ? "text-white" : "text-foreground")}>
          {dayNumber}
        </span>
        {isCompleted && (
          <motion.div 
            initial={{ scale: 0, rotate: -180 }} 
            animate={{ scale: 1, rotate: 0 }} 
            className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-2xl backdrop-blur-[1px]"
          >
            <Check className="w-6 h-6 text-white stroke-[4]" />
          </motion.div>
        )}
        {isLocked && !isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1"
          >
            <Lock className="w-3 h-3 text-muted-foreground" />
          </motion.div>
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
  const scrollRef = useRef(null);
  const { scrollY } = useScroll({ container: scrollRef });
  
  // Header animations
  const headerOpacity = useTransform(scrollY, [0, 50], [1, 0]);
  const stickyHeaderOpacity = useTransform(scrollY, [40, 60], [0, 1]);
  const headerY = useTransform(scrollY, [0, 50], [0, -20]);

  // Fetch tracker data using new hook
  const { data: trackerStats, isLoading: loading, refetch } = useTrackerDays(user?.id, activeChild?.id);
  
  // Extract data from hook
  const trackerDays = useMemo(() => {
    if (!trackerStats) return [];
    return [...trackerStats.completedDays, trackerStats.nextDay].filter(Boolean) as TrackerDay[];
  }, [trackerStats]);

  // Stats Calculation - Use dashboard stats as source of truth
  const { data: dashboardStats } = useDashboardStats();
  
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

  return (
    <MainLayout>
      <div 
        ref={scrollRef}
        className="h-screen overflow-y-auto bg-background no-scrollbar relative"
        style={{ scrollPaddingTop: '100px' }}
      >
        {/* Sticky Header Blur */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-[110px] bg-background/80 backdrop-blur-xl z-40 border-b border-white/5 pointer-events-none"
          style={{ opacity: stickyHeaderOpacity }}
        >
          <div className="absolute bottom-4 left-0 right-0 text-center font-bold text-lg text-foreground">Summary</div>
        </motion.div>

        <div className="px-6 pt-[calc(env(safe-area-inset-top)+20px)] pb-40 max-w-2xl mx-auto">
          
          {/* Large Header */}
          <motion.div 
            style={{ opacity: headerOpacity, y: headerY }}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground font-relative">
                Summary
              </h1>
            </div>
            <div className="w-12 h-12 rounded-full bg-muted border-2 border-background ring-2 ring-border overflow-hidden shadow-xl">
               {(user?.user_metadata as any)?.avatar_url ? (
                 <img src={(user.user_metadata as any).avatar_url} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-lg font-bold bg-primary/10 text-primary">
                   {user?.email?.[0].toUpperCase()}
                 </div>
               )}
            </div>
          </motion.div>


          {/* Bento Grid Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Main Hero Card */}
            <div className="col-span-2 bg-card dark:bg-[#1C1C1E] border border-border/40 p-6 rounded-[24px] relative overflow-hidden shadow-lg">
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
              delay={0.1} 
            />
            <StatCard 
              title="Days Left" 
              value={TOTAL_DAYS - stats.completed} 
              icon={Target} 
              color="bg-blue-500" 
              delay={0.2} 
            />
          </div>

          {/* Calendar Grid */}
          <div className="mb-24">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xl font-bold text-foreground">History</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-transparent border-border/40">
                   <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-transparent border-border/40">
                   <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="bg-card/40 dark:bg-[#1C1C1E]/50 backdrop-blur-md border border-border/40 rounded-[32px] p-6">
               <div className="grid grid-cols-7 gap-3">
                  {['S','M','T','W','T','F','S'].map((d, i) => (
                    <div key={i} className="text-center text-xs font-bold text-muted-foreground mb-2">{d}</div>
                  ))}
                  
                  {loading ? (
                    Array.from({ length: 30 }).map((_, i) => (
                      <div key={i} className="aspect-square rounded-2xl bg-muted/20 animate-pulse" />
                    ))
                  ) : (
                  Array.from({ length: TOTAL_DAYS }).map((_, i) => {
                      const dayNumber = i + 1;
                      const day = trackerDays.find(d => d.day_number === dayNumber);
                      const isNextDay = nextDay?.day_number === dayNumber;
                      const isPastUncompleted = nextDay && dayNumber < nextDay.day_number && !day?.completed;
                      const isFuture = nextDay && dayNumber > nextDay.day_number;

                      return (
                        <DayCell 
                          key={dayNumber}
                          day={day}
                          dayNumber={dayNumber}
                          isToday={isNextDay}
                          isPastUncompleted={isPastUncompleted}
                          isFuture={isFuture}
                          onClick={() => handleDayClick(dayNumber)}
                        />
                      );
                    })
                  )}
               </div>
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
                className="relative w-full max-w-md bg-background dark:bg-[#1C1C1E] border-t border-white/10 rounded-t-[32px] sm:rounded-[32px] p-6 pb-10 shadow-2xl overflow-hidden"
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
                
                <div className="flex justify-between items-center mb-8 mt-4">
                  <div>
                    <div className="text-sm text-muted-foreground font-medium">Logging Progress</div>
                    <h2 className="text-3xl font-black font-relative">Day {selectedDay}</h2>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setSelectedDay(null)}
                    className="rounded-full hover:bg-muted/20"
                    disabled={saving}
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-medium px-2">
                      <span className="text-muted-foreground">Stress Level</span>
                      <span className={cn(
                        "font-bold",
                        stressLevel <= 2 ? "text-green-500" : stressLevel === 3 ? "text-yellow-500" : "text-red-500"
                      )}>
                        {stressLevel === 1 ? "Zen Mode" : stressLevel === 5 ? "Chaos" : "Moderate"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <motion.button
                          key={level}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            triggerHaptic('light');
                            setStressLevel(level);
                          }}
                          disabled={saving}
                          className={cn(
                            "flex-1 aspect-[4/5] rounded-2xl flex items-center justify-center text-xl font-bold transition-all duration-200",
                            stressLevel === level
                              ? "bg-foreground text-background shadow-lg scale-105"
                              : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                          )}
                        >
                          {level}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full h-16 text-lg font-bold rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {saving ? (
                      <span className="animate-pulse">Syncing...</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6" />
                        <span>Complete Day</span>
                      </div>
                    )}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
