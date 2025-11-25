import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Flame, Target, Trophy, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';

interface TrackerDay {
  id: string;
  day_number: number;
  date: string;
  completed: boolean;
  stress_level: number | null;
}

const TOTAL_DAYS = 30;

export default function TrackerCalAI() {
  const { user } = useAuth();
  const { activeChild } = useChildProfiles();
  const [trackerDays, setTrackerDays] = useState<TrackerDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [stressLevel, setStressLevel] = useState<number>(3);
  const [saving, setSaving] = useState(false);
  const { triggerHaptic } = useHaptic();

  useEffect(() => {
    if (user && activeChild) {
      fetchTracker();
    }
  }, [user, activeChild]);

  const fetchTracker = async () => {
    if (!user?.id || !activeChild?.id) return;

    const { data, error } = await supabase
      .from('tracker_days')
      .select('*')
      .eq('user_id', user.id)
      .eq('child_profile_id', activeChild.id)
      .order('day_number');

    if (!error && data) {
      setTrackerDays(data);
    }
    setLoading(false);
  };

  const completedDays = trackerDays.filter(d => d.completed).length;
  const progressPercent = (completedDays / TOTAL_DAYS) * 100;
  const currentStreak = calculateStreak(trackerDays);

  function calculateStreak(days: TrackerDay[]): number {
    const sorted = [...days].sort((a, b) => b.day_number - a.day_number);
    let streak = 0;
    for (const day of sorted) {
      if (day.completed) streak++;
      else break;
    }
    return streak;
  }

  const handleDayClick = (dayNumber: number) => {
    triggerHaptic('light');
    const day = trackerDays.find(d => d.day_number === dayNumber);
    if (day?.completed) return;
    
    setSelectedDay(dayNumber);
    setStressLevel(3);
  };

  const handleSave = async () => {
    if (!selectedDay || !user?.id || !activeChild?.id) return;

    setSaving(true);
    triggerHaptic('medium');
    
    // Simulate update locally first for instant feedback
    const updatedDays = trackerDays.map(d => 
      d.day_number === selectedDay 
        ? { ...d, completed: true, stress_level: stressLevel }
        : d
    );
    setTrackerDays(updatedDays);

    const day = trackerDays.find(d => d.day_number === selectedDay);

    if (day) {
      const { error } = await supabase
        .from('tracker_days')
        .update({
          completed: true,
          stress_level: stressLevel,
          completed_at: new Date().toISOString(),
        })
        .eq('id', day.id);

      if (!error) {
        setSelectedDay(null);
        toast.success('Day completed!');
      } else {
        // Revert on error
        fetchTracker();
        toast.error('Failed to save progress');
      }
    }
    setSaving(false);
  };

  // Circular Progress Component
  const CircularProgress = ({ value, size = 120, strokeWidth = 10, children }: any) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200 dark:text-gray-800"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            className="text-primary"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-black pb-32 overflow-x-hidden">
        
        {/* Header Spacer */}
        <div className="w-full h-[calc(env(safe-area-inset-top)+20px)]" />

        <div className="px-5 mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Summary</h1>
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
               {user?.user_metadata?.avatar_url ? (
                 <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-gray-500 font-semibold">{user?.email?.[0].toUpperCase()}</span>
               )}
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Hero Activity Rings Card */}
        <div className="px-4 mb-6">
          <Card className="bg-white dark:bg-[#1C1C1E] border-none shadow-sm rounded-[24px] p-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Activity</h2>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">{completedDays}</span>
                    <span className="text-gray-500 text-sm font-medium">/ {TOTAL_DAYS} days</span>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Move</span>
                    <span className="text-xl font-bold text-red-500">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Streak</span>
                    <span className="text-xl font-bold text-green-500">{currentStreak}d</span>
                  </div>
                </div>
              </div>

              {/* Rings */}
              <div className="relative">
                <CircularProgress value={progressPercent} size={100} strokeWidth={12}>
                  <Flame className="w-8 h-8 text-primary fill-primary/20" />
                </CircularProgress>
              </div>
            </div>
          </Card>
        </div>

        {/* Monthly View - Bento Grid */}
        <div className="px-4 mb-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">History</h3>
          <Card className="bg-white dark:bg-[#1C1C1E] border-none shadow-sm rounded-[24px] p-5">
            {loading ? (
              <div className="grid grid-cols-7 gap-3">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-x-2 gap-y-4">
                {/* Weekday Headers */}
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <div key={i} className="text-center text-xs font-semibold text-gray-400">{d}</div>
                ))}
                
                {/* Days */}
                {Array.from({ length: TOTAL_DAYS }).map((_, i) => {
                  const dayNumber = i + 1;
                  const day = trackerDays.find(d => d.day_number === dayNumber);
                  const isCompleted = day?.completed || false;
                  const isToday = false; // Logic for today highlighting can be added

                  return (
                    <motion.button
                      key={dayNumber}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDayClick(dayNumber)}
                      className={cn(
                        "aspect-square rounded-full flex items-center justify-center relative",
                        isCompleted 
                          ? "bg-gradient-to-br from-primary to-purple-600 shadow-md shadow-primary/30" 
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                      )}
                    >
                      {isCompleted ? (
                        <Trophy className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <span className="text-xs font-medium">{dayNumber}</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Insights / Trends Section */}
        <div className="px-4 grid grid-cols-2 gap-4">
          <Card className="bg-white dark:bg-[#1C1C1E] border-none shadow-sm rounded-[24px] p-5 flex flex-col justify-between h-32">
            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{currentStreak}</span>
              <p className="text-xs text-gray-500 font-medium">Current Streak</p>
            </div>
          </Card>

          <Card className="bg-white dark:bg-[#1C1C1E] border-none shadow-sm rounded-[24px] p-5 flex flex-col justify-between h-32">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{TOTAL_DAYS - completedDays}</span>
              <p className="text-xs text-gray-500 font-medium">Days Left</p>
            </div>
          </Card>
        </div>

        {/* Log Day Modal */}
        <Dialog open={selectedDay !== null} onOpenChange={() => setSelectedDay(null)}>
          <DialogContent className="bg-[#F2F2F7] dark:bg-[#1C1C1E] border-none rounded-[24px] w-[90%] max-w-sm p-0 overflow-hidden">
            <DialogHeader className="pt-6 px-6 pb-2">
              <DialogTitle className="text-2xl font-bold text-center">Log Day {selectedDay}</DialogTitle>
            </DialogHeader>

            <div className="px-6 pb-6 space-y-6">
              <p className="text-center text-gray-500 text-sm">How was your stress level today?</p>
              
              <div className="flex justify-between items-center px-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <motion.button
                    key={level}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      triggerHaptic('selection');
                      setStressLevel(level);
                    }}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all shadow-sm",
                      stressLevel === level
                        ? "bg-primary text-white scale-110 ring-4 ring-primary/20"
                        : "bg-white dark:bg-gray-800 text-gray-400"
                    )}
                  >
                    {level}
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 px-2 font-medium">
                <span>Zen</span>
                <span>Chaos</span>
              </div>

              <Button 
                onClick={handleSave} 
                disabled={saving} 
                className="w-full h-14 text-lg font-semibold rounded-[18px] shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
              >
                {saving ? 'Saving...' : 'Complete Day'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </MainLayout>
  );
}