import { useNavigate } from 'react-router-dom';
import { BookOpen, Video, Flame, Calendar, Play, ChevronRight } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useScriptsByProfile } from '@/hooks/useScriptsByProfile';
import { UnifiedStatsCard } from '@/components/Dashboard/UnifiedStatsCard';
import { FABButton } from '@/components/Dashboard/FABButton';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function DashboardCalAI() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeChild } = useChildProfiles();
  const { data: dashboardStats } = useDashboardStats();
  const { data: scriptsForProfile } = useScriptsByProfile(activeChild?.brain_profile);
  const [recentScripts, setRecentScripts] = useState<any[]>([]);
  const [latestVideo, setLatestVideo] = useState<any>(null);

  const scriptsAvailable = scriptsForProfile ?? 0;
  const scriptsUsed = dashboardStats?.uniqueScriptsUsed ?? 0;
  const currentStreak = Math.max(dashboardStats?.totalTrackerEntries ?? 0, 1);

  // Fetch recent content
  useEffect(() => {
    const fetchData = async () => {
      // Recent scripts for profile
      const { data: scripts } = await supabase
        .from('scripts')
        .select('*')
        .eq('profile', activeChild?.brain_profile || 'INTENSE') // Fallback
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (scripts) setRecentScripts(scripts);

      // Latest video (bonus)
      const { data: videos } = await supabase
        .from('bonuses')
        .select('*')
        .eq('category', 'video')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (videos) setLatestVideo(videos);
    };

    if (activeChild) fetchData();
  }, [activeChild]);

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
      <div className="min-h-screen bg-background pb-32 relative overflow-hidden">

        {/* Ambient Background Effect */}
        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-0" />

        {/* Fixed Header Background for Status Bar */}
        <div className="fixed top-0 left-0 right-0 z-40 h-[calc(env(safe-area-inset-top)+80px)] bg-gradient-to-b from-background via-background to-transparent pointer-events-none" />

        {/* Header - Logo & Streak */}
        <header className="relative z-50 px-6 pt-[calc(env(safe-area-inset-top)+8px)] pb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white tracking-tight">Cal AI</h1>
          <div className="flex items-center gap-2 bg-[#1C1C1E]/80 backdrop-blur-md border border-white/5 px-4 py-2 rounded-full shadow-lg">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            <span className="font-bold text-lg text-white">{currentStreak}</span>
          </div>
        </header>

        {/* Weekly Calendar */}
        <div className="px-4 mb-8">
          <div className="flex justify-between items-center bg-[#1C1C1E]/50 backdrop-blur-sm p-4 rounded-3xl border border-white/5">
            {weekDays.map((day) => (
              <button
                key={day.label}
                className="flex flex-col items-center gap-2 group"
              >
                <span className={cn(
                  "text-[11px] font-medium uppercase tracking-wider transition-colors",
                  day.isToday ? "text-white" : "text-gray-500 group-hover:text-gray-400"
                )}>
                  {day.label}
                </span>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-base font-bold transition-all relative",
                  day.isToday 
                    ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-110" 
                    : "text-gray-400 group-hover:bg-white/5"
                )}>
                  {day.date}
                  {/* Activity indicator dots */}
                  {day.isPast && !day.isToday && (
                    <div className="absolute -bottom-1 flex gap-0.5">
                      <div className="w-1 h-1 rounded-full bg-green-500/50" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Scroll Carousel */}
        <div className="mb-8 overflow-x-auto pb-4 px-6 scrollbar-hide snap-x snap-mandatory flex gap-4">
          
          {/* Card 1: Main Stats (Always visible) */}
          <div className="snap-center shrink-0 w-[85vw] max-w-sm">
            <UnifiedStatsCard 
              scriptsUsed={scriptsUsed}
              scriptsTotal={scriptsAvailable}
            />
          </div>

          {/* Card 2: Tracker CTA */}
          <div className="snap-center shrink-0 w-[85vw] max-w-sm">
            <div 
              onClick={() => navigate('/tracker')}
              className="h-full bg-[#1C1C1E] border border-[#333] rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden group active:scale-[0.98] transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#2C2C2E] rounded-2xl">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                  TRACK
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Daily Log</h3>
                <p className="text-gray-400 text-sm mb-4">Track meltdowns and progress.</p>
                <div className="w-full bg-[#2C2C2E] h-12 rounded-xl flex items-center justify-center text-sm font-medium text-white group-hover:bg-[#3C3C3E] transition-colors">
                  Log Today
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Latest Video (Continue Watching) */}
          {latestVideo && (
            <div className="snap-center shrink-0 w-[85vw] max-w-sm">
              <div 
              onClick={() => navigate('/bonuses?category=video')}
              className="h-full bg-[#1C1C1E] border border-[#333] rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden group active:scale-[0.98] transition-all duration-300"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-[#2C2C2E] rounded-2xl">
                    <Play className="w-6 h-6 text-purple-400 fill-purple-400" />
                  </div>
                  <div className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-xs font-bold">
                    NEW
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{latestVideo.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-1">Latest expert guidance</p>
                  <div className="w-full bg-[#2C2C2E] h-12 rounded-xl flex items-center justify-center text-sm font-medium text-white group-hover:bg-[#3C3C3E] transition-colors">
                    Watch Now
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dots Indicator (Static for visual flair, logic would require scroll listener) */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-white" />
          <div className="w-2 h-2 rounded-full bg-[#333]" />
          <div className="w-2 h-2 rounded-full bg-[#333]" />
        </div>

        {/* Recently Added Section */}
        <div className="px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recently Added</h2>
            <button onClick={() => navigate('/scripts')} className="text-xs font-bold text-gray-500 hover:text-white transition-colors">
              SEE ALL
            </button>
          </div>
          
          <div className="space-y-4">
            {recentScripts.length > 0 ? (
              recentScripts.map((script) => (
                <div 
                  key={script.id}
                  onClick={() => navigate('/scripts')}
                  className="bg-[#1C1C1E] border border-[#333] rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform hover:bg-[#2C2C2E]"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#2C2C2E] flex items-center justify-center text-2xl shadow-inner">
                    {/* Fallback emoji logic or specific category icons */}
                    {script.category === 'Bedtime' ? '🌙' : 
                     script.category === 'Tantrums' ? '😤' : '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm truncate">{script.title}</h3>
                    <p className="text-gray-500 text-xs truncate">
                      {script.duration_minutes} min • {script.category}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No recent scripts found.
              </div>
            )}
          </div>
        </div>

        {/* FAB Button */}
        <FABButton onClick={() => navigate('/scripts')} />
      </div>
    </MainLayout>
  );
}
