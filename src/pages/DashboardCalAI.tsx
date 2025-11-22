import { useNavigate } from 'react-router-dom';
import { BookOpen, Video, Flame, Target, TrendingUp, ChevronRight, Calendar } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { SectionCard } from '@/components/CalAI/SectionCard';
import { StatWidget } from '@/components/CalAI/StatWidget';
import { SectionHeader } from '@/components/CalAI/SectionHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  const videosAvailable = dashboardStats?.totalVideos ?? 0;
  const currentStreak = Math.max(dashboardStats?.totalTrackerEntries ?? 0, 1);
  const scriptsUsed = dashboardStats?.uniqueScriptsUsed ?? 0;

  // Week calendar mock data
  const weekDays = [
    { label: 'MON', date: 18, active: true },
    { label: 'TUE', date: 19, active: true },
    { label: 'WED', date: 20, active: true },
    { label: 'THU', date: 21, active: false },
    { label: 'FRI', date: 22, active: false },
    { label: 'SAT', date: 23, active: false },
    { label: 'SUN', date: 24, active: false },
  ];

  // Recent scripts mock data
  const recentScripts = [
    { id: '1', title: 'Morning Routine Resistance', category: 'Morning Routines' },
    { id: '2', title: 'Bedtime Battles', category: 'Bedtime' },
    { id: '3', title: 'Mealtime Meltdowns', category: 'Mealtime' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 pb-24">
        {/* Hero Welcome Card */}
        <SectionCard className="bg-foreground text-background border-0">
          <div className="flex items-center justify-between p-2">
            <div>
              <h1 className="text-2xl font-bold font-relative mb-1">
                Welcome back, {getName()}!
              </h1>
              <p className="text-sm opacity-70">
                Managing: {activeChild?.name || 'Your Child'}
              </p>
            </div>
            <Avatar className="w-16 h-16 border-2 border-border">
              <AvatarImage src={activeChild?.photo_url || undefined} />
              <AvatarFallback className="bg-muted text-foreground text-lg">
                {(activeChild?.name?.[0] || getName()[0]).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </SectionCard>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatWidget
            icon={BookOpen}
            value={scriptsAvailable}
            label="Scripts Available"
            gradient="bg-primary/10"
            onClick={() => navigate('/scripts')}
          />
          <StatWidget
            icon={Video}
            value={videosAvailable}
            label="Videos"
            gradient="bg-accent/10"
            onClick={() => navigate('/videos')}
          />
          <StatWidget
            icon={Flame}
            value={currentStreak}
            label="Day Streak"
            gradient="bg-orange-500/10"
            onClick={() => navigate('/tracker')}
          />
          <StatWidget
            icon={Target}
            value={scriptsUsed}
            label="Scripts Used"
            gradient="bg-success/10"
          />
        </div>

        {/* Weekly Activity Calendar */}
        <SectionCard>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold font-relative text-base">Weekly Activity</h3>
            <Flame className="w-6 h-6 text-primary" />
          </div>
          <div className="flex justify-between">
            {weekDays.map((day) => (
              <div
                key={day.label}
                className={cn(
                  "flex flex-col items-center transition-all",
                  day.active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <span className="text-xs font-medium mb-1">{day.label}</span>
                <span className="text-xl font-bold mb-1">{day.date}</span>
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    day.active ? "bg-primary" : "bg-border"
                  )}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Recent Scripts Section */}
        <div>
          <SectionHeader title="Recent Scripts" />
          <SectionCard className="p-0">
            <div className="divide-y divide-border/50">
              {recentScripts.map((script) => (
                <button
                  key={script.id}
                  onClick={() => navigate(`/scripts/${script.id}`)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-sm">{script.title}</h4>
                    <p className="text-xs text-muted-foreground">{script.category}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            className="h-24 flex flex-col gap-2 rounded-2xl border-border/50"
            onClick={() => navigate('/scripts')}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-sm font-medium">Find Script</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-24 flex flex-col gap-2 rounded-2xl border-border/50"
            onClick={() => navigate('/videos')}
          >
            <Video className="w-6 h-6" />
            <span className="text-sm font-medium">Watch Video</span>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
