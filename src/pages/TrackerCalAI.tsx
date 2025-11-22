import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Flame, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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
    const day = trackerDays.find(d => d.day_number === dayNumber);
    if (day?.completed) return;
    
    setSelectedDay(dayNumber);
    setStressLevel(3);
  };

  const handleSave = async () => {
    if (!selectedDay || !user?.id || !activeChild?.id) return;

    setSaving(true);
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
        await fetchTracker();
        setSelectedDay(null);
        toast.success('Day completed!');
      }
    }
    setSaving(false);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Progress</h1>
          <p className="text-muted-foreground">Track your 30-day journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">{completedDays}</p>
                <p className="text-xs text-muted-foreground">Days Complete</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">{currentStreak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{Math.round(progressPercent)}%</p>
                <p className="text-xs text-muted-foreground">Progress</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 mb-8 bg-card border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{completedDays}/{TOTAL_DAYS} days</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </Card>

        {/* Calendar Grid */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-medium mb-4">30-Day Calendar</h2>
          
          {loading ? (
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse bg-muted/50 rounded" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: TOTAL_DAYS }).map((_, i) => {
                const dayNumber = i + 1;
                const day = trackerDays.find(d => d.day_number === dayNumber);
                const isCompleted = day?.completed || false;

                return (
                  <button
                    key={dayNumber}
                    onClick={() => handleDayClick(dayNumber)}
                    className={`
                      aspect-square rounded flex flex-col items-center justify-center
                      transition-all hover:scale-105 border
                      ${isCompleted 
                        ? 'bg-accent text-white border-accent' 
                        : 'bg-card border-border hover:bg-muted/5'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground" />
                    )}
                    <span className="text-xs mt-1">{dayNumber}</span>
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        {/* Complete Day Dialog */}
        <Dialog open={selectedDay !== null} onOpenChange={() => setSelectedDay(null)}>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>Complete Day {selectedDay}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div>
                <Label className="mb-3 block">How was your stress level today?</Label>
                <RadioGroup value={stressLevel.toString()} onValueChange={(v) => setStressLevel(Number(v))}>
                  {[1, 2, 3, 4, 5].map(level => (
                    <div key={level} className="flex items-center space-x-2">
                      <RadioGroupItem value={level.toString()} id={`stress-${level}`} />
                      <Label htmlFor={`stress-${level}`} className="cursor-pointer">
                        Level {level} {level === 1 ? '(Low)' : level === 5 ? '(High)' : ''}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Complete Day'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
