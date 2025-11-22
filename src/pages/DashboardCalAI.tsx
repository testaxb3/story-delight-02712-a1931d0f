import { useNavigate } from 'react-router-dom';
import { BookOpen, Video, Flame, Target, Calendar } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { SectionCard } from '@/components/CalAI/SectionCard';
import { SectionHeader } from '@/components/CalAI/SectionHeader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function DashboardCalAI() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeChild } = useChildProfiles();
  const { data: dashboardStats } = useDashboardStats();

  const getName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Friend';
  };

  const scriptsAvailable = dashboardStats?.totalScripts ?? 0;
  const scriptsUsed = dashboardStats?.uniqueScriptsUsed ?? 0;
  const currentStreak = Math.max(dashboardStats?.totalTrackerEntries ?? 0, 1);

  // Week calendar - today is highlighted
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - dayOfWeek + index);
    return {
      label,
      date: date.getDate(),
      isToday: index === dayOfWeek,
      isPast: index < dayOfWeek,
    };
  });

  return (
    <MainLayout>
      <div className="space-y-6 pb-24 px-4">
        {/* Top Header - Logo + Streak Badge */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🧠</span>
            <h1 className="text-3xl font-bold font-relative">NEP</h1>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-card px-4 py-2 rounded-full shadow-sm">
            <Flame className="w-5 h-5 text-accent" />
            <span className="font-bold">{currentStreak}</span>
          </div>
        </div>

        {/* Weekly Calendar - Horizontal */}
        <div className="flex justify-between items-center px-2">
          {weekDays.map((day) => (
            <button
              key={day.label}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                day.isToday && "scale-110"
              )}
            >
              <span className={cn(
                "text-xs font-medium",
                day.isToday ? "text-foreground" : "text-muted-foreground"
              )}>
                {day.label}
              </span>
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all",
                day.isToday 
                  ? "bg-foreground text-background" 
                  : day.isPast
                    ? "text-foreground"
                    : "text-muted-foreground"
              )}>
                {day.date}
              </div>
            </button>
          ))}
        </div>

        {/* Large Stats Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Scripts Available Card */}
          <SectionCard className="min-h-[180px] bg-muted/30">
            <div className="flex flex-col justify-between h-full p-2">
              <div className="flex items-start justify-between">
                <BookOpen className="w-8 h-8 text-foreground/60" />
              </div>
              <div>
                <p className="text-5xl font-bold mb-1">{scriptsAvailable}</p>
                <p className="text-sm text-muted-foreground font-medium">Scripts Available</p>
              </div>
            </div>
          </SectionCard>

          {/* Scripts Used Card */}
          <SectionCard className="min-h-[180px]">
            <div className="flex flex-col justify-between h-full p-2">
              <div className="flex items-start justify-between">
                <Target className="w-8 h-8 text-foreground/60" />
              </div>
              <div>
                <p className="text-5xl font-bold mb-1">{scriptsUsed}</p>
                <p className="text-sm text-muted-foreground font-medium">Scripts Used</p>
                <div className="flex items-center gap-2 mt-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-xs font-medium">+{scriptsUsed}</span>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Tracker Card - Horizontal */}
        <SectionCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-bold text-lg">My Plan Tracker</p>
                <p className="text-sm text-muted-foreground">{currentStreak} days logged</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-10 h-10"
                onClick={() => navigate('/tracker')}
              >
                <span className="text-xl">→</span>
              </Button>
            </div>
          </div>
        </SectionCard>

        {/* Page Indicators */}
        <div className="flex justify-center gap-2 py-2">
          <div className="w-2 h-2 rounded-full bg-muted" />
          <div className="w-2 h-2 rounded-full bg-muted" />
          <div className="w-2 h-2 rounded-full bg-foreground" />
        </div>

        {/* Recent Scripts Section */}
        <div>
          <h2 className="text-xl font-bold mb-3 px-2">Recent Scripts</h2>
          <SectionCard className="p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Tap <span className="font-bold">Scripts</span> to find your first strategy
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </MainLayout>
  );
}
