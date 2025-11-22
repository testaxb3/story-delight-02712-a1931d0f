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
      {/* Cal AI Header - Integrated */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-foreground text-background px-4 py-3 flex items-center justify-between">
        {/* Left: Brain Icon */}
        <div className="text-3xl">🧠</div>

        {/* Center: Child Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 rounded-full bg-muted/20 px-4 py-2 font-semibold text-background"
              type="button"
            >
              <span className="truncate max-w-[14rem] text-sm">{activeLabel}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="center" className="w-72">
            <DropdownMenuLabel className="text-center text-xs font-medium uppercase text-muted-foreground">
              Active child profile
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {childProfiles.length > 0 ? (
                childProfiles.map((child) => (
                  <DropdownMenuItem
                    key={child.id}
                    className="flex items-center justify-between gap-3"
                    onSelect={() => setActiveChild(child.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-muted">
                        <AvatarImage src={child.photo_url || undefined} alt={child.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {child.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{child.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Brain: {child.brain_profile}
                        </span>
                      </div>
                    </div>
                    {activeChild?.id === child.id && (
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        Active
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No child profiles yet. Add your first child.
                </div>
              )}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex items-center gap-2"
              onSelect={() => navigate('/quiz')}
            >
              <Plus className="h-4 w-4" />
              Add Child
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right: Icons */}
        <div className="flex items-center gap-2">
          {/* Script Requests */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/script-requests')}
            aria-label="My Script Requests"
            className="rounded-full bg-muted/20 hover:bg-muted/30 text-background h-10 w-10"
          >
            <MessageCircleHeart className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full bg-muted/20 hover:bg-muted/30 text-background h-10 w-10"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Profile Avatar */}
          <button
            onClick={() => navigate('/profile')}
            className="rounded-full focus:outline-none"
            aria-label="Go to profile"
          >
            <Avatar className="h-10 w-10 border-2 border-background/20">
              <AvatarImage src={user?.photo_url || undefined} alt="Profile" />
              <AvatarFallback className="bg-muted text-foreground font-bold">
                {profileInitials}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>

      {/* Content - Push down to account for fixed header */}
      <div className="space-y-6 pb-24 px-4 pt-20">
        {/* Top Header - Logo + Streak Badge */}
        <div className="flex items-center justify-between">
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
