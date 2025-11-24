import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, TrendingDown, Calendar, Award, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHaptic } from '@/hooks/useHaptic';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface TrackerDay {
  id: string;
  date: string;
  day_number: number;
  completed: boolean;
  stress_level: number | null;
  meltdown_count: string | null;
  created_at: string;
}

interface DayData {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  hasData: boolean;
  stress_level?: number;
  entry?: TrackerEntry;
}

type TimePeriod = '90D' | '6M' | '1Y' | 'ALL';

export default function ProgressCalAI() {
  const { user } = useAuth();
  const { activeChild } = useChildProfiles();
  const { data: dashboardStats, refetch: refetchStats } = useDashboardStats();
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();
  const [searchParams, setSearchParams] = useSearchParams();

  const [trackerEntries, setTrackerEntries] = useState<TrackerDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('90D');
  const [selectedDate, setSelectedDate] = useState<string | null>(searchParams.get('date'));
  const [showLogModal, setShowLogModal] = useState(false);
  const [stressLevel, setStressLevel] = useState<number>(3);
  const [meltdownsCount, setMeltdownsCount] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && activeChild) {
      fetchTrackerHistory();
    }
  }, [user, activeChild, selectedPeriod]);

  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setSelectedDate(dateParam);
    }
  }, [searchParams]);

  const fetchTrackerHistory = async () => {
    if (!user?.id || !activeChild?.id) return;

    const now = new Date();
    let startDate = new Date();

    switch (selectedPeriod) {
      case '90D':
        startDate.setDate(now.getDate() - 90);
        break;
      case '6M':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'ALL':
        startDate = new Date('2020-01-01');
        break;
    }

    const { data, error } = await supabase
      .from('tracker_days')
      .select('*')
      .eq('user_id', user.id)
      .eq('child_profile_id', activeChild.id)
      .eq('completed', true)
      .gte('date', startDate.toISOString())
      .order('date', { ascending: true });

    if (!error && data) {
      setTrackerEntries(data);
    }
    setLoading(false);
  };

  const handleLogToday = async () => {
    console.log('=== handleLogToday called ===');
    console.log('user:', user);
    console.log('activeChild:', activeChild);

    if (!user?.id || !activeChild?.id) {
      console.log('Missing user or activeChild, returning early');
      toast.error('Missing user or child profile');
      return;
    }

    setSaving(true);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    console.log('todayStr:', todayStr);

    // Find or create today's tracker day
    const { data: existingDay, error: checkError } = await supabase
      .from('tracker_days')
      .select('*')
      .eq('user_id', user.id)
      .eq('child_profile_id', activeChild.id)
      .eq('date', todayStr)
      .single();

    console.log('existingDay:', existingDay);
    console.log('checkError:', checkError);

    let error;

    if (existingDay) {
      // Update existing day
      console.log('Updating existing day...');
      const { error: updateError } = await supabase
        .from('tracker_days')
        .update({
          completed: true,
          stress_level: stressLevel,
          meltdown_count: String(meltdownsCount),
          completed_at: new Date().toISOString(),
        })
        .eq('id', existingDay.id);
      error = updateError;
      console.log('Update error:', updateError);
    } else {
      // Get the highest day_number for this user/child to determine the next day
      console.log('Creating new day entry...');
      const { data: lastDay } = await supabase
        .from('tracker_days')
        .select('day_number')
        .eq('user_id', user.id)
        .eq('child_profile_id', activeChild.id)
        .order('day_number', { ascending: false })
        .limit(1)
        .single();

      console.log('lastDay:', lastDay);
      const nextDayNumber = lastDay ? lastDay.day_number + 1 : 1;
      console.log('nextDayNumber:', nextDayNumber);

      // Create new day
      const { error: insertError } = await supabase
        .from('tracker_days')
        .insert({
          user_id: user.id,
          child_profile_id: activeChild.id,
          date: todayStr,
          day_number: nextDayNumber,
          completed: true,
          stress_level: stressLevel,
          meltdown_count: String(meltdownsCount),
          completed_at: new Date().toISOString(),
        });
      error = insertError;
      console.log('Insert error:', insertError);
    }

    console.log('Final error:', error);

    if (!error) {
      console.log('Success! Fetching tracker history...');
      await fetchTrackerHistory();
      await refetchStats();
      setShowLogModal(false);
      setStressLevel(3);
      setMeltdownsCount(0);
      toast.success('Day logged successfully!');
      triggerHaptic('success');
    } else {
      console.log('Error saving:', error);
      toast.error('Failed to log day: ' + error.message);
    }

    setSaving(false);
    console.log('=== handleLogToday finished ===');
  };

  // Generate week calendar
  const getWeekDays = (): DayData[] => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const weekDays: DayData[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - dayOfWeek + i);
      const dateStr = date.toISOString().split('T')[0];
      const entry = trackerEntries.find(e => e.date === dateStr);

      weekDays.push({
        date,
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        dayNumber: date.getDate(),
        isToday: i === dayOfWeek,
        hasData: !!entry,
        stress_level: entry?.stress_level,
        entry,
      });
    }

    return weekDays;
  };

  const weekDays = getWeekDays();

  // Check if already logged today
  const todayStr = new Date().toISOString().split('T')[0];
  const hasLoggedToday = trackerEntries.some(entry => entry.date === todayStr && entry.completed);

  const currentStress = dashboardStats?.averageStress ?? 3;
  const goalStress = 2;
  const currentStreak = dashboardStats?.currentStreak ?? 0;
  const meltdownsBefore = dashboardStats?.meltdownsBefore ?? 0;
  const meltdownsAfter = dashboardStats?.meltdownsAfter ?? 0;
  const totalEntries = dashboardStats?.totalTrackerEntries ?? 0;

  const progressPercent = currentStress <= goalStress ? 100 : Math.max(0, ((5 - currentStress) / (5 - goalStress)) * 100);
  const meltdownReduction = meltdownsBefore > 0 ? Math.round(((meltdownsBefore - meltdownsAfter) / meltdownsBefore) * 100) : 0;

  // Calculate chart data - filter by selected date if present
  const getChartData = () => {
    let filteredEntries = trackerEntries;

    if (selectedDate) {
      const selectedEntry = trackerEntries.find(e => e.date === selectedDate);
      if (selectedEntry) {
        filteredEntries = [selectedEntry];
      } else {
        return [];
      }
    }

    if (filteredEntries.length === 0) return [];

    const maxDataPoints = 30;
    const step = Math.ceil(filteredEntries.length / maxDataPoints);

    return filteredEntries
      .filter((_, index) => index % step === 0)
      .map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        stress: entry.stress_level
      }));
  };

  const chartData = getChartData();
  const maxStress = 5;
  const chartHeight = 200;

  const handleDateClick = (date: Date, hasData: boolean) => {
    if (!hasData) return;

    triggerHaptic('light');
    const dateStr = date.toISOString().split('T')[0];

    if (selectedDate === dateStr) {
      setSelectedDate(null);
      setSearchParams({});
    } else {
      setSelectedDate(dateStr);
      setSearchParams({ date: dateStr });
    }
  };

  const selectedDayEntry = selectedDate ? trackerEntries.find(e => e.date === selectedDate) : null;

  return (
    <MainLayout hideSideNav>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-background pb-32 relative overflow-hidden"
      >
        {/* Ambient Background */}
        <div className="fixed top-[-15%] left-[-15%] w-[60%] h-[60%] bg-green-500/5 dark:bg-green-900/10 rounded-full blur-[140px] pointer-events-none z-0" />
        <div className="fixed bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[140px] pointer-events-none z-0" />

        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 px-6 pt-[calc(env(safe-area-inset-top)+16px)] pb-6"
        >
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Progress</h1>
          <p className="text-muted-foreground/80 text-sm mt-1">Track your improvement journey</p>
        </motion.header>

        {/* Apple-Style Weekly Calendar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="px-6 mb-6 relative z-10"
        >
          <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 shadow-xl p-1">
            <div className="flex justify-between items-center gap-1">
              {weekDays.map((day, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateClick(day.date, day.hasData)}
                  disabled={!day.hasData}
                  className={cn(
                    "flex-1 flex flex-col items-center py-3 px-2 rounded-2xl transition-all duration-200",
                    day.isToday && "bg-foreground",
                    selectedDate === day.date.toISOString().split('T')[0] && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    !day.isToday && day.hasData && "hover:bg-muted/50 cursor-pointer",
                    !day.hasData && "opacity-40 cursor-default"
                  )}
                >
                  <span className={cn(
                    "text-xs font-medium mb-1",
                    day.isToday ? "text-background" : "text-muted-foreground"
                  )}>
                    {day.dayName}
                  </span>
                  <span className={cn(
                    "text-2xl font-bold",
                    day.isToday ? "text-background" : "text-foreground"
                  )}>
                    {day.dayNumber}
                  </span>
                  {day.hasData && !day.isToday && (
                    <div className="mt-1 w-1 h-1 rounded-full bg-primary" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {selectedDayEntry && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-4 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">
                  {new Date(selectedDate!).toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </p>
                <button
                  onClick={() => {
                    setSelectedDate(null);
                    setSearchParams({});
                  }}
                  className="p-1 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Stress Level</p>
                  <p className="text-2xl font-bold text-foreground">{selectedDayEntry.stress_level}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Meltdowns</p>
                  <p className="text-2xl font-bold text-foreground">{selectedDayEntry.meltdown_count ?? '0'}</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Cards Grid */}
        <div className="px-6 mb-6 grid grid-cols-2 gap-4 relative z-10">
          {/* My Stress Level Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1 bg-gradient-to-br from-card via-card to-card/80 border border-border/50 rounded-3xl p-6 relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 dark:bg-green-500/15 rounded-full blur-3xl -mr-10 -mt-10" />

            <div className="relative z-10">
              <p className="text-muted-foreground/70 text-xs font-medium mb-2">My Stress Level</p>
              <p className="text-4xl font-bold text-foreground mb-1">
                {currentStress.toFixed(1)}
              </p>
              <div className="w-full h-2 bg-muted/60 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </div>
              <p className="text-muted-foreground/60 text-xs">Goal {goalStress.toFixed(1)}</p>

              <motion.button
                whileTap={!hasLoggedToday ? { scale: 0.95 } : {}}
                onClick={() => {
                  if (!hasLoggedToday) {
                    triggerHaptic('light');
                    setShowLogModal(true);
                  }
                }}
                disabled={hasLoggedToday}
                className={cn(
                  "w-full mt-4 h-10 rounded-xl flex items-center justify-center text-sm font-semibold shadow-lg transition-all",
                  hasLoggedToday
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-foreground text-background hover:shadow-xl"
                )}
              >
                {hasLoggedToday ? '✓ Logged today' : 'Log today'}
              </motion.button>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="col-span-1 bg-gradient-to-br from-card via-card to-card/80 border border-border/50 rounded-3xl p-6 relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 dark:bg-orange-500/15 rounded-full blur-3xl -mr-10 -mt-10" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <div className="mb-3 p-3 bg-gradient-to-br from-orange-500/15 to-orange-500/5 rounded-2xl">
                <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">{currentStreak}</p>
              <p className="text-orange-600 dark:text-orange-400 font-bold text-xs">Day Streak</p>
            </div>
          </motion.div>
        </div>

        {/* Stress Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 mb-6 relative z-10"
        >
          <div className="bg-gradient-to-br from-card via-card to-card/80 border border-border/50 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground tracking-tight">Stress Progress</h2>
              <div className="flex items-center gap-1 text-xs">
                <TrendingDown className="w-4 h-4 text-green-500" />
                <span className="font-bold text-green-600 dark:text-green-400">
                  {meltdownReduction}% of goal
                </span>
              </div>
            </div>

            {/* Simple Line Chart */}
            <div className="relative" style={{ height: chartHeight }}>
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-pulse text-muted-foreground">Loading chart...</div>
                </div>
              ) : chartData.length > 0 ? (
                <svg className="w-full h-full">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4, 5].map((level) => (
                    <g key={level}>
                      <line
                        x1="0"
                        y1={(chartHeight / maxStress) * (maxStress - level)}
                        x2="100%"
                        y2={(chartHeight / maxStress) * (maxStress - level)}
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-muted/20"
                        strokeDasharray="4 4"
                      />
                      <text
                        x="0"
                        y={(chartHeight / maxStress) * (maxStress - level) - 4}
                        className="text-muted-foreground text-xs fill-current"
                      >
                        {level}
                      </text>
                    </g>
                  ))}

                  {/* Line path */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    d={chartData
                      .map((point, index) => {
                        const x = chartData.length === 1 ? 50 : (index / (chartData.length - 1)) * 100;
                        const y = ((maxStress - point.stress) / maxStress) * chartHeight;
                        return `${index === 0 ? 'M' : 'L'} ${x}% ${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-primary"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data points */}
                  {chartData.map((point, index) => {
                    const x = chartData.length === 1 ? 50 : (index / (chartData.length - 1)) * 100;
                    const y = ((maxStress - point.stress) / maxStress) * chartHeight;
                    return (
                      <circle
                        key={index}
                        cx={`${x}%`}
                        cy={y}
                        r="4"
                        className="fill-primary"
                      />
                    );
                  })}
                </svg>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  No data yet. Start tracking to see your progress!
                </div>
              )}
            </div>

            {/* Time Period Filters */}
            <div className="flex gap-2 mt-6 bg-muted/30 p-1.5 rounded-2xl">
              {(['90D', '6M', '1Y', 'ALL'] as TimePeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedPeriod(period);
                    setSelectedDate(null);
                    setSearchParams({});
                  }}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-xs font-bold transition-all",
                    selectedPeriod === period
                      ? "bg-card text-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Milestone Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-6 mb-6 relative z-10"
        >
          <h2 className="text-lg font-bold text-foreground mb-4 tracking-tight">Milestones</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-card via-card to-card/80 border border-border/50 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <Calendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-foreground">{totalEntries}</p>
              </div>
              <p className="text-xs text-muted-foreground/70">Total Days Logged</p>
            </div>

            <div className="bg-gradient-to-br from-card via-card to-card/80 border border-border/50 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-xl">
                  <Award className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-foreground">{meltdownReduction}%</p>
              </div>
              <p className="text-xs text-muted-foreground/70">Meltdown Reduction</p>
            </div>
          </div>
        </motion.div>

        {/* Log Today Modal */}
        <Dialog open={showLogModal} onOpenChange={setShowLogModal}>
          <DialogContent className="bg-card border-border/50 max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-foreground">Log Today's Progress</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div>
                <Label className="mb-3 block text-foreground">How was your stress level today?</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setStressLevel(level)}
                      className={cn(
                        "flex-1 py-3 rounded-xl font-bold text-sm transition-all",
                        stressLevel === level
                          ? "bg-primary text-primary-foreground shadow-lg scale-105"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  1 = Low stress • 5 = High stress
                </p>
              </div>

              <div>
                <Label className="mb-3 block text-foreground">Number of meltdowns today?</Label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map((count) => (
                    <button
                      key={count}
                      onClick={() => setMeltdownsCount(count)}
                      className={cn(
                        "flex-1 py-3 rounded-xl font-bold text-sm transition-all",
                        meltdownsCount === count
                          ? "bg-primary text-primary-foreground shadow-lg scale-105"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleLogToday}
                disabled={saving}
                className="w-full h-12 text-base font-bold"
              >
                {saving ? 'Saving...' : 'Log Today'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </MainLayout>
  );
}
