import { useNavigate } from 'react-router-dom';
import { BookOpen, Video, Flame, Calendar } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { UnifiedStatsCard } from '@/components/Dashboard/UnifiedStatsCard';
import { FABButton } from '@/components/Dashboard/FABButton';
import { cn } from '@/lib/utils';

export default function DashboardCalAI() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeChild } = useChildProfiles();
  const { data: dashboardStats } = useDashboardStats();

  const scriptsAvailable = dashboardStats?.totalScripts ?? 0;
  const scriptsUsed = dashboardStats?.uniqueScriptsUsed ?? 0;
  const currentStreak = Math.max(dashboardStats?.totalTrackerEntries ?? 0, 1);

  // Week calendar - today is highlighted
  const today = new Date();
  const dayOfWeek = today.getDay();
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
    <MainLayout hideSideNav>
      <div className="min-h-screen bg-background text-foreground">
        {/* Cal AI Header - Logo + Streak */}
        <header className="px-6 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold font-relative tracking-tight">NEP</h1>
          <div className="flex items-center gap-2 bg-card px-5 py-2.5 rounded-full shadow-sm">
            <Flame className="w-5 h-5 text-accent" />
            <span className="font-bold text-lg">{currentStreak}</span>
          </div>
        </header>

        {/* Weekly Calendar - Horizontal */}
        <div className="px-6 mb-8">
          <div className="flex justify-between items-center">
            {weekDays.map((day) => (
              <button
                key={day.label}
                className={cn(
                  "flex flex-col items-center gap-2 transition-all",
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
                  "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all relative",
                  day.isToday 
                    ? "bg-foreground text-background" 
                    : "text-foreground"
                )}>
                  {day.date}
                  {/* Activity dots for past days */}
                  {day.isPast && !day.isToday && (
                    <div className="absolute bottom-1.5 flex gap-0.5">
                      <div className="w-1 h-1 rounded-full bg-accent" />
                      <div className="w-1 h-1 rounded-full bg-accent" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Unified Stats Card */}
        <div className="px-6 mb-8">
          <UnifiedStatsCard 
            scriptsUsed={scriptsUsed}
            scriptsTotal={scriptsAvailable}
          />
        </div>

        {/* Tracker Card - Horizontal */}
        <div className="px-6 mb-8">
          <div 
            className="bg-card rounded-[24px] p-5 cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => navigate('/tracker')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-base mb-0.5">My Plan Tracker</p>
                  <p className="text-sm text-muted-foreground">{currentStreak} days logged</p>
                </div>
              </div>
              <div className="text-2xl text-muted-foreground">→</div>
            </div>
          </div>
        </div>

        {/* Page Indicators */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-muted" />
          <div className="w-2 h-2 rounded-full bg-muted" />
          <div className="w-6 h-2 rounded-full bg-foreground" />
        </div>

        {/* Recently Added Section with Thumbnails */}
        <div className="px-6 pb-32">
          <h2 className="text-xl font-bold mb-4 font-relative">Recently added</h2>
          <div className="space-y-3">
            <div 
              className="bg-card rounded-[24px] overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => navigate('/scripts')}
            >
              <div className="flex">
                {/* Thumbnail */}
                <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-10 h-10 text-accent" />
                </div>
                {/* Content */}
                <div className="flex-1 p-4 min-w-0">
                  <h3 className="font-bold text-sm mb-1 truncate">New Bedtime Scripts</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {scriptsAvailable} scripts for {activeChild?.brain_profile || 'your'} profile
                  </p>
                  <div className="mt-2 inline-block px-2 py-0.5 bg-accent/10 rounded text-[10px] text-accent font-medium">
                    NEW
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              className="bg-card rounded-[24px] overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => navigate('/videos')}
            >
              <div className="flex">
                {/* Thumbnail */}
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center flex-shrink-0">
                  <Video className="w-10 h-10 text-blue-500" />
                </div>
                {/* Content */}
                <div className="flex-1 p-4 min-w-0">
                  <h3 className="font-bold text-sm mb-1 truncate">Video Library</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    Expert guidance and strategies
                  </p>
                  <div className="mt-2 inline-block px-2 py-0.5 bg-blue-500/10 rounded text-[10px] text-blue-500 font-medium">
                    UPDATED
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAB Button */}
        <FABButton onClick={() => navigate('/scripts')} />
      </div>
    </MainLayout>
  );
}
