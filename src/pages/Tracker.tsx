import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { supabase } from '@/integrations/supabase/client';
import { toast as showToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { Target, Plus, CheckCircle2, Sparkles, Heart } from 'lucide-react';
import { useCelebration } from '@/hooks/useCelebration';
import { CelebrationModal } from '@/components/scripts/CelebrationModal';
import { getStreakDays } from '@/lib/celebrationStats';
import { VisualCalendar } from '@/components/Tracker/VisualCalendar';
import { ProgressDashboard } from '@/components/Tracker/ProgressDashboard';
import { InsightsCard } from '@/components/Tracker/InsightsCard';

interface TrackerDayRow {
  id: string;
  day_number: number;
  date: string;
  completed: boolean | null;
  completed_at: string | null;
  stress_level: number | null;
  meltdown_count: string | null;
}

const TOTAL_DAYS = 30;
const MELTDOWN_OPTIONS = ['0', '1-2', '3-5', '5+'] as const;
type MeltdownOption = (typeof MELTDOWN_OPTIONS)[number];

export default function MyPlan() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { activeChild, onboardingRequired, refreshChildren } = useChildProfiles();
  const [trackerRows, setTrackerRows] = useState<TrackerDayRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [stressLevel, setStressLevel] = useState<number>(3);
  const [meltdownCount, setMeltdownCount] = useState<MeltdownOption>('0');
  const [saving, setSaving] = useState(false);
  const highStressNotifiedKey = useRef<string | null>(null);

  // Celebration hook for streak celebrations
  const {
    showCelebration,
    celebrationData,
    triggerCelebration,
    closeCelebration,
  } = useCelebration();

  const fetchTracker = async () => {
    if (!user?.profileId || !activeChild?.id) {
      setTrackerRows([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('tracker_days')
      .select('id, day_number, date, completed, completed_at, stress_level, meltdown_count')
      .eq('user_id', user.profileId)
      .eq('child_profile_id', activeChild.id)
      .order('day_number');

    if (error) {
      console.error('Failed to load tracker days', error);
      setTrackerRows([]);
    } else {
      setTrackerRows(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTracker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChild?.id, user?.profileId]);

  useEffect(() => {
    if (location.state?.refreshChildren) {
      refreshChildren();
    }
  }, [location.state, refreshChildren]);

  const trackerRowByDay = useMemo(() => {
    return trackerRows.reduce<Map<number, TrackerDayRow>>((accumulator, row) => {
      accumulator.set(row.day_number, row);
      return accumulator;
    }, new Map());
  }, [trackerRows]);

  const planDays = useMemo(() => {
    return Array.from({ length: TOTAL_DAYS }, (_, index) => {
      const dayNumber = index + 1;
      const dbRow = trackerRowByDay.get(dayNumber);

      return {
        dayNumber,
        completed: dbRow?.completed ?? false,
        completedAt: dbRow?.completed_at ?? null,
        stressLevel: dbRow?.stress_level ?? null,
        meltdownCount: dbRow?.meltdown_count ?? null,
        id: dbRow?.id ?? null,
      };
    });
  }, [trackerRowByDay]);

  const completedDays = planDays.filter((day) => day.completed).length;
  const nextIncompleteDay = planDays.find((day) => !day.completed)?.dayNumber ?? null;
  const nextDay = nextIncompleteDay ?? TOTAL_DAYS + 1;
  const planCompleted = nextDay > TOTAL_DAYS;

  const recentEntries = useMemo(() => {
    return planDays
      .filter((day) => day.completed && day.completedAt)
      .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime());
  }, [planDays]);

  const lastCompletedEntry = recentEntries.at(-1) ?? null;
  const unlockDelayMs = 24 * 60 * 60 * 1000;
  const nextUnlockTimestamp =
    lastCompletedEntry?.completedAt
      ? new Date(lastCompletedEntry.completedAt).getTime() + unlockDelayMs
      : null;
  const nextDayLockedUntil =
    nextUnlockTimestamp && Date.now() < nextUnlockTimestamp ? nextUnlockTimestamp : null;
  const hoursUntilUnlock = nextDayLockedUntil
    ? Math.max(1, Math.ceil((nextDayLockedUntil - Date.now()) / (1000 * 60 * 60)))
    : null;

  useEffect(() => {
    if (!activeChild || recentEntries.length < 2) return;
    const lastTwo = recentEntries.slice(-2);
    const bothHighStress = lastTwo.every(
      (entry) => (entry.stressLevel ?? 0) >= 4 || entry.meltdownCount === '5+'
    );

    if (bothHighStress) {
      const latestKey = `${activeChild.id}-${lastTwo[lastTwo.length - 1].completedAt}`;
      if (highStressNotifiedKey.current !== latestKey) {
        highStressNotifiedKey.current = latestKey;
        showToast({
          title: "It looks like the last few days were tough.",
          description: "How about asking for help in the community? You're not alone.",
          action: (
            <ToastAction
              altText="Ask for help"
              onClick={() =>
                navigate('/community', {
                  state: {
                    defaultTab: 'help',
                    prefill: `💬 I could use some support after a tough couple of days with ${activeChild.name}.`,
                  },
                })
              }
            >
              Ask for help
            </ToastAction>
          ),
        });
      }
    }
  }, [activeChild, recentEntries, navigate]);

  const handleSaveDay = async () => {
    if (!user?.profileId || !activeChild?.id || selectedDay === null) return;
    setSaving(true);

    const existing = trackerRowByDay.get(selectedDay);

    const now = new Date();
    const completedAt = existing?.completed_at ?? now.toISOString();
    // Calculate date: use existing date or current date
    const dateValue = existing?.date ?? now.toISOString().split('T')[0];

    try {
      let error;

      if (existing?.id) {
        // UPDATE existing record
        const { error: updateError } = await supabase
          .from('tracker_days')
          .update({
            completed: true,
            completed_at: completedAt,
            stress_level: stressLevel,
            meltdown_count: meltdownCount,
            date: dateValue, // Update date if it was null
          })
          .eq('id', existing.id);
        error = updateError;
      } else {
        // INSERT new record
        // Note: date field will be auto-populated by DB trigger if column exists
        const { error: insertError } = await supabase
          .from('tracker_days')
          .insert({
            user_id: user.profileId,
            child_profile_id: activeChild.id,
            day_number: selectedDay,
            completed: true,
            completed_at: completedAt,
            stress_level: stressLevel,
            meltdown_count: meltdownCount,
          });
        error = insertError;
      }

      if (error) {
        console.error('Failed to save tracker day', error);
        showToast({ title: 'Unable to save progress', description: error.message, variant: 'destructive' });
        return;
      }

      showToast({
        title: 'Day completed! 🎉',
        description: `Logged Day ${selectedDay} for ${activeChild.name}.`,
        action: (
          <ToastAction
            altText="Share win"
            onClick={() =>
              navigate('/community', {
                state: {
                  defaultTab: 'win',
                  prefill: `🎉 #WIN: Just completed Day ${selectedDay} of My Plan with ${activeChild.name} (${activeChild.brain_profile})!`,
                },
              })
            }
          >
            Share your win
          </ToastAction>
        ),
      });

      setSelectedDay(null);
      await fetchTracker();
    } finally {
      setSaving(false);
    }
  };

  const handleDayClick = (dayNumber: number) => {
    const dayInfo = planDays.find((day) => day.dayNumber === dayNumber);
    if (!dayInfo) return;

    if (!dayInfo.completed) {
      if (nextIncompleteDay === null) {
        showToast({
          title: 'Plan complete',
          description: 'All days have been logged. Great job staying consistent!'
        });
        return;
      }

      if (dayNumber !== nextIncompleteDay) {
        showToast({
          title: 'Keep the streak going',
          description: `Please log Day ${nextIncompleteDay} before moving ahead.`,
          variant: 'destructive'
        });
        return;
      }

      if (nextDayLockedUntil && dayNumber === nextIncompleteDay) {
        const unlockDate = new Date(nextDayLockedUntil);
        showToast({
          title: 'Day not unlocked yet',
          description: `Log Day ${dayNumber} after ${unlockDate.toLocaleDateString()} at ${unlockDate.toLocaleTimeString()}.`,
          variant: 'destructive'
        });
        return;
      }
    }

    setSelectedDay(dayNumber);
    const entry = trackerRowByDay.get(dayNumber);
    setStressLevel(entry?.stress_level ?? 3);
    setMeltdownCount((entry?.meltdown_count as MeltdownOption) ?? '0');
  };

  if (!activeChild) {
    return (
      <MainLayout>
        <div className="space-y-6 text-center">
          <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
            <h2 className="text-2xl font-bold mb-2">Create your first child profile</h2>
            <p className="text-muted-foreground mb-6">
              {onboardingRequired
                ? "Let's discover your child's brain profile to unlock a personalized plan."
                : 'Select a child from the header to view their personalized My Plan.'}
            </p>
            <Button onClick={() => navigate('/quiz')} size="lg" className="bg-primary text-white">
              Start the NEP quiz →
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const currentDayEntry = planCompleted
    ? planDays[planDays.length - 1]
    : planDays.find((day) => day.dayNumber === nextDay) ?? planDays[planDays.length - 1];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Plan for {activeChild.name}</h1>
            <p className="text-muted-foreground">Brain profile: {activeChild.brain_profile}</p>
          </div>
          <Badge className="bg-primary text-white">Day {planCompleted ? TOTAL_DAYS : nextDay} of {TOTAL_DAYS}</Badge>
        </div>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 via-primary/10 to-amber-100 border-none shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Target className="w-5 h-5" />
                Today's Mission
              </div>
              <h2 className="text-xl font-bold mt-2">
                {loading
                  ? 'Loading personalized plan…'
                  : planCompleted
                    ? 'Plan complete! Keep celebrating the wins'
                    : nextDayLockedUntil
                      ? `Day ${nextDay} unlocks soon`
                      : `Day ${nextDay}: Keep the momentum going`}
              </h2>
              {currentDayEntry.completed && currentDayEntry.completedAt ? (
                <p className="text-sm text-muted-foreground mt-2">
                  Completed on {new Date(currentDayEntry.completedAt).toLocaleDateString()} • Stress {currentDayEntry.stressLevel ?? '—'}/5 • Meltdowns {currentDayEntry.meltdownCount ?? '—'}
                </p>
              ) : planCompleted ? (
                <p className="text-sm text-muted-foreground mt-2">
                  All 30 days are logged. Revisit any day below to review or update your entries.
                </p>
              ) : nextDayLockedUntil ? (
                <p className="text-sm text-muted-foreground mt-2">
                  Next mission unlocks in approximately {hoursUntilUnlock} hour{hoursUntilUnlock === 1 ? '' : 's'}.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">
                  Log how today went to unlock tomorrow's guidance.
                </p>
              )}
            </div>
            <Button
              className="bg-primary text-white"
              size="lg"
              onClick={() => !planCompleted && nextIncompleteDay && handleDayClick(nextIncompleteDay)}
              disabled={planCompleted || !!nextDayLockedUntil}
            >
              {planCompleted
                ? 'All days logged'
                : nextDayLockedUntil
                  ? `Unlocks soon`
                  : `Log Day ${nextDay}`}
            </Button>
          </div>
          <div className="mt-6">
            <Progress value={(completedDays / TOTAL_DAYS) * 100} />
            <p className="text-xs text-muted-foreground mt-2">
              {completedDays} of {TOTAL_DAYS} days completed • {TOTAL_DAYS - completedDays} days remaining
            </p>
          </div>
        </Card>

        {/* Progress Dashboard */}
        <ProgressDashboard days={planDays} totalDays={TOTAL_DAYS} />

        {/* Insights */}
        <InsightsCard days={planDays} />

        {/* Visual Calendar */}
        <VisualCalendar days={planDays} onDayClick={handleDayClick} />

        {/* Quick Tips */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4 bg-white/90 backdrop-blur">
            <div className="flex items-center gap-2 text-primary font-semibold mb-2">
              <Sparkles className="w-4 h-4" />
              Wins this week
            </div>
            <p className="text-sm text-muted-foreground">
              Keep noting what works. Celebrate every small win with {activeChild.name} to reinforce calm routines.
            </p>
          </Card>
          <Card className="p-4 bg-white/90 backdrop-blur">
            <div className="flex items-center gap-2 text-primary font-semibold mb-2">
              <Heart className="w-4 h-4" />
              Stress trend
            </div>
            <p className="text-sm text-muted-foreground">
              Last logged stress level: {recentEntries.at(-1)?.stressLevel ?? '—'}/5 • Meltdowns {recentEntries.at(-1)?.meltdownCount ?? '—'}
            </p>
          </Card>
        </div>
      </div>

      <Dialog open={selectedDay !== null} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Day {selectedDay}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Stress level today</Label>
              <RadioGroup value={String(stressLevel)} onValueChange={(value) => setStressLevel(Number(value))} className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Label key={level} className="flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer" htmlFor={`stress-${level}`}>
                    <RadioGroupItem value={String(level)} id={`stress-${level}`} />
                    <span className="text-sm">{level}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">How many meltdowns/crises today?</Label>
              <RadioGroup value={meltdownCount} onValueChange={(value) => setMeltdownCount(value as MeltdownOption)} className="grid grid-cols-2 gap-2">
                {MELTDOWN_OPTIONS.map((option) => (
                  <Label key={option} className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer" htmlFor={`meltdown-${option}`}>
                    <RadioGroupItem value={option} id={`meltdown-${option}`} />
                    <span className="text-sm">{option}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDay(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDay} disabled={saving}>
              {saving ? 'Saving...' : 'Save day'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Celebration Modal */}
      <CelebrationModal
        open={showCelebration}
        onOpenChange={closeCelebration}
        celebrationData={celebrationData}
      />
    </MainLayout>
  );
}
