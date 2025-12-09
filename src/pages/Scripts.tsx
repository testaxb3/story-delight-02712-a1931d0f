import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, Heart, TrendingUp, Flame, Clock, MessageCircleHeart, ArrowRight, X } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useScriptCollections } from '@/hooks/useScriptCollections';
import { useChildRecommendations } from '@/hooks/useChildRecommendations';
import { useTranslation } from '@/hooks/useTranslation';
import { useFavoriteScripts } from '@/hooks/useFavoriteScripts';
import { useScripts } from '@/hooks/useScripts';
import { ScriptCardSkeletonList } from '@/components/Skeletons/ScriptCardSkeleton';
import { ScriptModal } from '@/components/scripts/ScriptModal';
import { CelebrationModal } from '@/components/scripts/CelebrationModal';
import { AlternativesModal } from '@/components/scripts/AlternativesModal';
import { SOSMode } from '@/components/scripts/SOSMode';
import { useCelebration } from '@/hooks/useCelebration';
import { useSOSDetection } from '@/hooks/useSOSDetection';
import { getTotalScriptCount } from '@/lib/celebrationStats';
import { intelligentSearch } from '@/lib/intelligentSearch';
import { convertToScriptItem, formatCategory, CATEGORY_EMOJIS, type ScriptItem } from '@/lib/scriptUtils';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { RequestScriptModal } from '@/components/Scripts/RequestScriptModal';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { StickyHeader } from '@/components/Navigation/StickyHeader';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';

// Apple-style categories with colors
const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  'bedtime': { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20', icon: '🌙' },
  'screens': { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20', icon: '📱' },
  'mealtime': { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/20', icon: '🥦' },
  'tantrums': { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/20', icon: '😤' },
  'morning routines': { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/20', icon: '☀️' },
  'social': { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/20', icon: '👋' },
  'hygiene': { bg: 'bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-500/20', icon: '🦷' },
  'homework': { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20', icon: '📚' },
  'transitions': { bg: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/20', icon: '🔄' },
  'public behavior': { bg: 'bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-500/20', icon: '🏪' },
  'daily responsibilities': { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20', icon: '✅' },
  'school': { bg: 'bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-500/20', icon: '🏫' },
  'learning': { bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-500/20', icon: '🧠' },
  'default': { bg: 'bg-secondary/50', text: 'text-foreground', border: 'border-border/50', icon: '📝' }
};

const SEARCH_PLACEHOLDERS = [
  'Bedtime refusal...', 
  'Hitting siblings...', 
  'Won\'t eat veggies...', 
  'Screen time limits...', 
  'Public meltdown...', 
  'Morning chaos...'
];

function ScriptsContent() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize category from URL param
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    const urlCategory = searchParams.get('category');
    if (!urlCategory) return null;
    // Match exact category or case-insensitive
    const categories = ['Tantrums', 'Bedtime', 'Screens', 'Mealtime', 'Morning Routines', 'Social', 'Hygiene', 'Homework', 'Transitions', 'Public Behavior', 'Daily Responsibilities', 'School', 'Learning'];
    return categories.find(c => c.toLowerCase() === urlCategory.toLowerCase()) || null;
  });
  const [selectedScript, setSelectedScript] = useState<ScriptItem | null>(null);
  const [selectedScriptRow, setSelectedScriptRow] = useState<any | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const { activeChild } = useChildProfiles();
  const { triggerHaptic } = useHaptic();

  const currentBrain = activeChild?.brain_profile ?? 'INTENSE';
  const { scripts, isLoading: loadingScripts } = useScripts({
    brainProfile: currentBrain,
    childAge: activeChild?.age,
    enabled: !!activeChild,
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { favorites: favoriteScriptIds, toggleFavorite, isFavorite } = useFavoriteScripts();
  const [requestScriptModalOpen, setRequestScriptModalOpen] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  // Celebration & SOS
  const { showCelebration, celebrationData, triggerCelebration, closeCelebration, checkMilestones } = useCelebration();
  const locationState = location.state as { crisis?: string; autoFocus?: boolean } | undefined;
  const { isSOS, sosScript, dismissSOS } = useSOSDetection({
    searchQuery,
    crisisMode: locationState?.crisis ? true : false,
    enabled: !!user?.id,
  });

  // Placeholder animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle location state (Crisis mode)
  useEffect(() => {
    if (locationState?.crisis) {
      setSelectedCategory(null);
      setSearchQuery(locationState.crisis);
    }
    if (locationState?.autoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [locationState]);

  // Logic for Categories
  const categories = useMemo(() => [
    { name: 'All', value: null, emoji: '♾️' },
    { name: 'Tantrums', value: 'Tantrums', emoji: '😤' },
    { name: 'Bedtime', value: 'Bedtime', emoji: '😴' },
    { name: 'Screens', value: 'Screens', emoji: '📱' },
    { name: 'Mealtime', value: 'Mealtime', emoji: '🥦' },
    { name: 'Morning', value: 'Morning Routines', emoji: '☀️' },
    { name: 'Social', value: 'Social', emoji: '👋' },
    { name: 'Hygiene', value: 'Hygiene', emoji: '🦷' },
    { name: 'Homework', value: 'Homework', emoji: '📚' },
    { name: 'Transitions', value: 'Transitions', emoji: '🔄' },
    { name: 'Public', value: 'Public Behavior', emoji: '🏪' },
    { name: 'Tasks', value: 'Daily Responsibilities', emoji: '✅' },
    { name: 'School', value: 'School', emoji: '🏫' },
    { name: 'Learning', value: 'Learning', emoji: '🧠' },
  ], []);

  // Prepare Scripts
  const formattedScripts = useMemo<ScriptItem[]>(() => {
    if (!Array.isArray(scripts)) return [];
    return scripts.map(script => convertToScriptItem(script));
  }, [scripts]);

  const filteredScripts = useMemo(() => {
    if (!Array.isArray(scripts)) return [];
    
    let filtered = scripts;

    // Category Filter
    if (selectedCategory) {
      filtered = filtered.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search Filter (Intelligent)
    if (searchQuery.trim()) {
      filtered = intelligentSearch(searchQuery, filtered);
    }

    return filtered.map(script => convertToScriptItem(script));
  }, [scripts, searchQuery, selectedCategory]);

  // Handlers
  const handleScriptClick = (script: ScriptItem) => {
    triggerHaptic('light');
    setSelectedScript(script);
    // Find raw row for modal
    const row = scripts.find(s => s.id === script.id);
    setSelectedScriptRow(row || null);
  };

  const markAsUsed = async (script: ScriptItem) => {
    if (!user?.id) return;
    try {
      await supabase.from('script_usage').insert({ user_id: user.id, script_id: script.id });
      const milestone = await checkMilestones();
      if (milestone) {
        const count = await getTotalScriptCount(user.id);
        triggerCelebration(milestone, { scriptTitle: script.title, totalScriptsUsed: count });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MainLayout>
      {isSOS && sosScript && (
        <SOSMode
          script={sosScript}
          onUse={() => {
            setSelectedScriptRow(sosScript);
            setSelectedScript(convertToScriptItem(sosScript));
          }}
          onExit={dismissSOS}
        />
      )}

      <div className="min-h-screen bg-background pb-32 relative">
        {/* Ambient Background */}
        <div className="fixed top-[-20%] left-[-20%] w-[80%] h-[80%] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0" />
        <div className="fixed bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none z-0" />



        {/* Sticky Header */}
        <StickyHeader>
          <div className="space-y-4">
            {/* Apple Style Header Title */}
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Library</h1>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-secondary/50"
                onClick={() => setRequestScriptModalOpen(true)}
                aria-label="Request a new script"
              >
                <MessageCircleHeart className="w-6 h-6 text-primary" />
              </Button>
            </div>
            
            {/* Search Bar (Spotlight Style) */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-primary w-5 h-5 transition-colors z-10" />
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
                className="pl-12 h-14 text-[17px] bg-secondary/50 border-transparent focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/10 rounded-2xl transition-all shadow-sm placeholder:text-muted-foreground/50"
                aria-label="Search scripts"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 bg-muted-foreground/20 rounded-full hover:bg-muted-foreground/30 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Horizontal Categories (Pills) */}
            <div 
              className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide snap-x"
              role="tablist"
              aria-label="Script categories"
            >
              {categories.map((cat) => (
                <motion.button
                  key={cat.name}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedCategory(selectedCategory === cat.value ? null : cat.value);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full text-[15px] font-medium transition-all border snap-start whitespace-nowrap",
                    selectedCategory === cat.value
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                      : "bg-background border-border/60 text-muted-foreground hover:bg-secondary/50"
                  )}
                  role="tab"
                  aria-selected={selectedCategory === cat.value}
                >
                  <span>{cat.emoji}</span>
                  {cat.name}
                </motion.button>
              ))}
            </div>
          </div>
        </StickyHeader>

        {/* Scrollable Content */}
        <div className="px-5 pt-4 space-y-6 relative z-10">
          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
            <span>{filteredScripts.length} scripts found</span>
            {activeChild && (
              <span className="flex items-center gap-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-md text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                {activeChild.brain_profile} Mode
              </span>
            )}
          </div>

          {/* Scripts Grid (Masonry/Bento) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
            <AnimatePresence mode="popLayout">
              {loadingScripts ? (
                <ScriptCardSkeletonList count={4} />
              ) : filteredScripts.length > 0 ? (
                filteredScripts.map((script, index) => {
                  const style = CATEGORY_STYLES[script.category.toLowerCase()] || CATEGORY_STYLES['default'];
                  const isFav = isFavorite(script.id);

                  return (
                    <motion.div
                      key={script.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => handleScriptClick(script)}
                      className="group relative bg-card hover:bg-accent/5 rounded-[24px] p-5 border border-border/60 hover:border-primary/30 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                    >
                      {/* Category Icon & Badge */}
                      <div className="flex justify-between items-start mb-3">
                        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-xl", style.bg)}>
                          {style.icon}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerHaptic('medium');
                            toggleFavorite(script.id);
                          }}
                          className="p-2 rounded-full hover:bg-secondary transition-colors"
                        >
                          <Heart className={cn("w-5 h-5 transition-colors", isFav ? "fill-red-500 text-red-500" : "text-muted-foreground/40")} />
                        </button>
                      </div>

                      {/* Content */}
                      <h3 className="text-[17px] font-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
                        {script.title}
                      </h3>
                      <p className="text-[14px] text-muted-foreground line-clamp-2 leading-relaxed">
                        "{script.preview}"
                      </p>

                      {/* Footer Meta */}
                      <div className="mt-4 flex items-center gap-3 text-xs font-medium text-muted-foreground/70">
                        <span className={cn("px-2 py-0.5 rounded-md border bg-opacity-50", style.bg, style.text, style.border)}>
                          {script.displayCategory}
                        </span>
                        {script.estimatedTimeMinutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {script.estimatedTimeMinutes}m
                          </span>
                        )}
                      </div>
                      
                      {/* Hover Arrow */}
                      <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                        <ArrowRight className="w-5 h-5 text-primary" />
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">No scripts found</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mt-2">
                    Try adjusting your search or filters. We can't find a match for "{searchQuery}".
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-6 rounded-xl"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ScriptModal
        open={!!selectedScript}
        onOpenChange={(open) => !open && setSelectedScript(null)}
        script={selectedScriptRow}
        isFavorite={selectedScript ? isFavorite(selectedScript.id) : false}
        onToggleFavorite={() => selectedScript && toggleFavorite(selectedScript.id)}
        onMarkUsed={() => selectedScript && markAsUsed(selectedScript)}
        onNavigateToScript={() => {}}
      />

      <CelebrationModal
        open={showCelebration}
        onOpenChange={closeCelebration}
        celebrationData={celebrationData}
      />

      <AlternativesModal
        open={showAlternatives}
        onOpenChange={setShowAlternatives}
        relatedScripts={[]}
        onNavigateToScript={() => {}}
        onOpenSOS={() => navigate('/sos')}
        onClose={() => setShowAlternatives(false)}
      />

      <RequestScriptModal
        open={requestScriptModalOpen}
        onOpenChange={setRequestScriptModalOpen}
      />
    </MainLayout>
  );
}

export default function Scripts() {
  return (
    <ErrorBoundary>
      <ScriptsContent />
    </ErrorBoundary>
  );
}