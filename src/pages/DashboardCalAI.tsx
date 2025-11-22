import { useNavigate } from 'react-router-dom';
import { BookOpen, Video, Flame, Target, Calendar, ChevronDown, Plus, MessageCircleHeart, Moon, Sun } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { SectionCard } from '@/components/CalAI/SectionCard';
import { SectionHeader } from '@/components/CalAI/SectionHeader';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { getUserInitials } from '@/lib/profileUtils';

export default function DashboardCalAI() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeChild, childProfiles, setActiveChild, onboardingRequired } = useChildProfiles();
  const { theme, toggleTheme } = useTheme();
  const { data: dashboardStats } = useDashboardStats();

  const profileInitials = useMemo(() => getUserInitials(user), [user]);

  const activeLabel = useMemo(() => {
    if (activeChild) {
      return `${activeChild.name} (${activeChild.brain_profile})`;
    }
    if (onboardingRequired) {
      return 'Add your child profile';
    }
    return 'Select a child';
  }, [activeChild, onboardingRequired]);

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
      <div className="space-y-6 pb-24 px-4 pt-4">
        {/* Top Header - Logo + Streak Badge */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-relative">NEP</h1>
          <div className="flex items-center gap-2 bg-white dark:bg-card px-4 py-2 rounded-full shadow-sm">
            <Flame className="w-5 h-5 text-accent" />
            <span className="font-bold">{currentStreak}</span>
          </div>
        </div>

        {/* Weekly Calendar - Horizontal com pontilhados */}
        <div className="flex justify-between items-center px-2">
          {weekDays.map((day) => (
            <button
              key={day.label}
              className={cn(
                "flex flex-col items-center gap-1 transition-all relative",
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
                "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all relative",
                day.isToday 
                  ? "bg-foreground text-background" 
                  : day.isPast
                    ? "text-foreground"
                    : "text-muted-foreground"
              )}>
                {day.date}
                {/* Pontilhados para dias com atividade */}
                {day.isPast && (
                  <div className="absolute bottom-1 flex gap-0.5">
                    <div className="w-1 h-1 rounded-full bg-accent" />
                    <div className="w-1 h-1 rounded-full bg-accent" />
                  </div>
                )}
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

        {/* Recently Added Section - Cal AI style */}
        <div>
          <h2 className="text-xl font-bold mb-3 px-2">Recently added</h2>
          <div className="space-y-3">
            <SectionCard 
              className="p-4 cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => navigate('/scripts')}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm mb-0.5 truncate">New Bedtime Scripts</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {scriptsAvailable} scripts available for {activeChild?.brain_profile || 'your'} profile
                  </p>
                </div>
              </div>
            </SectionCard>
            
            <SectionCard 
              className="p-4 cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => navigate('/tracker')}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm mb-0.5 truncate">Track Your Progress</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentStreak} day streak - Keep it going!
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
