import { useNavigate } from 'react-router-dom';
import { Flame, Sparkles, Activity, MessageSquare, ArrowRight, PlusCircle, ChevronDown, Book, ChevronRight, Play } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useScriptsByProfile } from '@/hooks/useScriptsByProfile';
import { DashboardSkeletonPremium } from '@/components/Dashboard/DashboardSkeletonPremium';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CATEGORY_EMOJIS } from '@/lib/scriptUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardCalAI() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeChild, childProfiles, setActiveChild } = useChildProfiles();
  const { data: dashboardStats, isLoading, error } = useDashboardStats();
  const { data: scriptsForProfile } = useScriptsByProfile(activeChild?.brain_profile);
  const [recentScripts, setRecentScripts] = useState<any[]>([]);
  const [ebooks, setEbooks] = useState<any[]>([]);
  const { triggerHaptic } = useHaptic();

  const currentStreak = Math.max(dashboardStats?.totalTrackerEntries ?? 0, 1);
  
  // Helper function to get category emoji
  const getCategoryEmoji = (category: string) => {
    const categoryKey = category.toLowerCase().replace(/\s+/g, '_');
    return CATEGORY_EMOJIS[categoryKey] || '🧠';
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      // Recent scripts for profile
      const { data: scripts } = await supabase
        .from('scripts')
        .select('*')
        .eq('profile', activeChild?.brain_profile || 'INTENSE')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (scripts) setRecentScripts(scripts);

      // Featured Ebooks (Cover Flow) from 'ebooks' table
      const { data: ebookData } = await supabase
        .from('ebooks')
        .select('id, title, slug, thumbnail_url')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(5);

      if (ebookData) {
        // Fetch progress for these ebooks
        const { data: progressData } = await supabase
          .from('user_ebook_progress')
          .select('ebook_id, current_chapter, completed_chapters')
          .eq('user_id', user.id)
          .in('ebook_id', ebookData.map(e => e.id));

        // Merge progress info
        const ebooksWithProgress = ebookData.map(ebook => {
          const progress = progressData?.find(p => p.ebook_id === ebook.id);
          const isStarted = progress && (progress.current_chapter > 0 || (progress.completed_chapters && progress.completed_chapters.length > 0));
          return {
            ...ebook,
            isStarted: !!isStarted,
            thumbnail: ebook.thumbnail_url // Normalize field name for UI
          };
        });
        
        setEbooks(ebooksWithProgress);
      }
    };

    if (activeChild) fetchData();
  }, [activeChild, user?.id]);

  // Date Formatting and Greeting
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase();
  
  const hour = today.getHours();
  let greeting = "Good Morning";
  if (hour >= 12 && hour < 18) {
    greeting = "Good Afternoon";
  } else if (hour >= 18) {
    greeting = "Good Evening";
  }

  const handleSwitchProfile = (childId: string) => {
    triggerHaptic('light');
    setActiveChild(childId);
  };

  // Show skeleton while loading
  if (isLoading) {
    return (
      <MainLayout hideSideNav>
        <DashboardSkeletonPremium />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout hideSideNav>
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-foreground mb-2">Unable to load dashboard</h2>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm">Retry</button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideSideNav>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background pb-32 relative overflow-hidden"
      >
        {/* Ambient Background */}
        <div className="fixed top-[-20%] right-[-20%] w-[80%] h-[80%] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0" />
        <div className="fixed bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none z-0" />

        {/* Header Spacer for Status Bar */}
        <div className="w-full h-[env(safe-area-inset-top)] bg-background/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50" />

        {/* Main Content */}
        <main className="px-5 pt-[calc(env(safe-area-inset-top)+4px)] relative z-10 space-y-8">
          
          {/* Header Section */}
          <header className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground tracking-widest">{dateString}</p>
              
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground leading-none">
                  {greeting},
                </h1>
                
                {/* Apple-Style Child Selector Pill */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-secondary/50 backdrop-blur-sm pl-1 pr-3 py-1 rounded-full w-fit border border-border/50 hover:bg-secondary/80 transition-colors"
                    >
                      <Avatar className="h-6 w-6 border border-background">
                        <AvatarImage src={activeChild?.photo_url || undefined} />
                        <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                          {activeChild?.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-semibold text-foreground">{activeChild?.name}</span>
                      <ChevronDown className="w-3 h-3 text-muted-foreground" />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 rounded-xl p-2 bg-popover/90 backdrop-blur-xl border-border/50 shadow-xl">
                    <DropdownMenuLabel className="text-xs font-medium text-muted-foreground ml-2">Switch Profile</DropdownMenuLabel>
                    {childProfiles.map((child) => (
                      <DropdownMenuItem 
                        key={child.id}
                        onClick={() => handleSwitchProfile(child.id)}
                        className="flex items-center gap-3 p-2 rounded-lg cursor-pointer focus:bg-accent focus:text-accent-foreground"
                      >
                        <Avatar className="h-8 w-8 border border-border/50">
                          <AvatarImage src={child.photo_url || undefined} />
                          <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                            {child.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{child.name}</span>
                          <span className="text-[10px] text-muted-foreground capitalize">{child.brain_profile?.toLowerCase()}</span>
                        </div>
                        {activeChild?.id === child.id && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                        )}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="bg-border/50 my-1" />
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="p-2 rounded-lg cursor-pointer text-primary font-medium">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Child
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Streak Badge */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/achievements')}
              className="flex flex-col items-center justify-center bg-card border border-border/50 rounded-2xl w-14 h-14 shadow-sm"
            >
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500 mb-0.5" />
              <span className="text-xs font-bold">{currentStreak}</span>
            </motion.button>
          </header>

          {/* Hero Section: Ebook Cover Flow (Apple Books Style) */}
          <section className="relative">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-bold tracking-tight">For You</h2>
              <button onClick={() => navigate('/bonuses?category=ebook')} className="text-primary text-sm font-semibold">View All</button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-8 -mx-5 px-5 scrollbar-hide snap-x snap-mandatory">
              {ebooks.length > 0 ? (
                ebooks.map((ebook, index) => {
                  const isSiblingsFight = ebook.title?.toLowerCase().includes('siblings fight');
                  return (
                  <motion.div
                    key={ebook.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/ebook-v2/${ebook.slug}`)}
                    className="relative min-w-[220px] w-[220px] snap-center group cursor-pointer"
                  >
                    {/* Book Cover Shadow */}
                    <div className="absolute inset-0 bg-black/20 blur-xl translate-y-4 scale-90 rounded-lg z-0 group-hover:bg-black/30 transition-all duration-500" />
                    
                    {/* Book Cover */}
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg border border-white/10 bg-card z-10 transition-transform duration-500 group-hover:-translate-y-2">
                      {ebook.thumbnail ? (
                        <img 
                          src={ebook.thumbnail} 
                          alt={ebook.title} 
                          className={cn(
                            "w-full h-full object-cover",
                            isSiblingsFight && "scale-110 -translate-y-2"
                          )}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4 text-center">
                          <Book className="w-8 h-8 text-white/50 mb-2" />
                          <span className="text-white font-bold text-xs line-clamp-3">{ebook.title}</span>
                        </div>
                      )}
                      
                      {/* Glass Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                      
                      {/* Continue Badge */}
                      {ebook.isStarted && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md py-1 px-2">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-white">
                            <Play className="w-2 h-2 fill-white" /> Continue
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Title */}
                    <div className="mt-3 text-center px-1">
                      <h3 className="text-xs font-bold text-foreground line-clamp-2 leading-tight">{ebook.title}</h3>
                    </div>
                  </motion.div>
                )})
              ) : (
                // Skeleton/Empty State
                <div className="w-full h-64 flex items-center justify-center bg-muted/20 rounded-3xl border border-dashed border-muted">
                  <p className="text-muted-foreground text-sm">No books available</p>
                </div>
              )}
            </div>
          </section>

          {/* Quick Actions (Bento Grid) */}
          <section>
            <h3 className="text-lg font-bold mb-4 tracking-tight">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              
              {/* Primary Action: LOG DAY */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/progress')}
                className="col-span-2 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground p-5 rounded-[2rem] shadow-lg shadow-primary/20 flex items-center justify-between h-24 relative overflow-hidden group"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <PlusCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="text-lg font-bold block">Log Today's Progress</span>
                    <span className="text-sm opacity-90">Keep your streak alive!</span>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-white/70 group-hover:translate-x-1 transition-transform" />
                
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8" />
              </motion.button>

              {/* Scripts */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/scripts')}
                className="bg-card p-5 rounded-[2rem] border border-border/50 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-6 -mt-6" />
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-left relative z-10">
                  <span className="text-2xl font-bold block">{dashboardStats?.totalScripts || 0}</span>
                  <span className="text-sm font-medium text-muted-foreground">Scripts</span>
                </div>
              </motion.button>

              {/* Community */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/community')}
                className="bg-card p-5 rounded-[2rem] border border-border/50 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -mr-6 -mt-6" />
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-left relative z-10">
                  <span className="text-lg font-bold block text-foreground leading-tight mb-1">Community</span>
                  <span className="text-xs text-muted-foreground">Join discussion</span>
                </div>
              </motion.button>
            </div>
          </section>

          {/* Recent Activity (Shelf) */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold tracking-tight">Jump Back In</h3>
              <button onClick={() => navigate('/scripts')} className="text-primary text-sm font-semibold">See All</button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
              {recentScripts.length > 0 ? (
                recentScripts.map((script) => (
                  <motion.div
                    key={script.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/scripts')}
                    className="min-w-[240px] bg-card border border-border/50 p-4 rounded-[1.5rem] shadow-sm snap-center"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getCategoryEmoji(script.category)}</span>
                      <div className="px-2 py-1 rounded-md bg-secondary text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
                        {script.category}
                      </div>
                    </div>
                    <h4 className="font-bold text-foreground mb-1 line-clamp-2 h-10 leading-tight">
                      {script.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center">
                      <ClockIcon className="w-3 h-3 mr-1" /> {script.duration_minutes} min read
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="w-full text-center py-8 bg-card/50 rounded-3xl border border-border/30 border-dashed">
                  <p className="text-muted-foreground text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </section>

        </main>
      </motion.div>
    </MainLayout>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}