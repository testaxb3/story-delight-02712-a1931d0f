import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { PostgrestError } from '@supabase/supabase-js';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Star, Check, Sparkles, TrendingUp, Flame, Clock3, FolderPlus, Folder, ListPlus, MessageCircleHeart, Loader2, Heart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
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
import { EnhancedScriptCard } from '@/components/scripts/EnhancedScriptCard';
import { useCelebration } from '@/hooks/useCelebration';
import { useSOSDetection } from '@/hooks/useSOSDetection';
import { getTotalScriptCount } from '@/lib/celebrationStats';
import { QuickAccessBar } from '@/components/scripts/QuickAccessBar';
import { intelligentSearch, detectEmergency } from '@/lib/intelligentSearch';
import { convertToScriptItem, formatCategory, CATEGORY_EMOJIS, type ScriptItem } from '@/lib/scriptUtils';
import { ScriptsHeader } from '@/components/scripts/ScriptsHeader';
import { EmptyState } from '@/components/scripts/EmptyState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { RequestScriptModal } from '@/components/Scripts/RequestScriptModal';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];
type ScriptFeedbackRow = Database['public']['Tables']['script_feedback']['Row'];

const SEARCH_PLACEHOLDERS = [
  'Try: bedtime, tantrums, picky eating...',
  'Search: car seat, homework, public meltdown...',
  'Find: morning routine, screen time, siblings...',
  'Explore: transitions, hygiene, mealtime...'
];

function ScriptsContent() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedScript, setSelectedScript] = useState<ScriptItem | null>(null);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const { activeChild, onboardingRequired } = useChildProfiles();

  // ✅ PERFORMANCE: React Query for caching and automatic refetching
  const currentBrain = activeChild?.brain_profile ?? 'INTENSE';
  const { scripts, isLoading: loadingScripts } = useScripts({
    brainProfile: currentBrain,
    enabled: !onboardingRequired,
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {
    scopedCollections,
    createCollection,
    addScriptToCollection,
    removeScriptFromCollection,
    refresh: refreshCollections,
  } = useScriptCollections();
  const {
    recommendations: personalizedRecommendations,
    loading: loadingPersonalizedRecommendations,
    hasPersonalizedHistory,
    refresh: refreshChildRecommendations,
  } = useChildRecommendations(6);
  const { favorites: favoriteScriptIds, toggleFavorite, isFavorite } = useFavoriteScripts();
  const [feedbackHistory, setFeedbackHistory] = useState<ScriptFeedbackRow[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedbackOutcome, setFeedbackOutcome] = useState<'worked' | 'progress' | 'not_yet'>('worked');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [savingFeedback, setSavingFeedback] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [creatingCollection, setCreatingCollection] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedScriptRow, setSelectedScriptRow] = useState<ScriptRow | null>(null);
  const [requestScriptModalOpen, setRequestScriptModalOpen] = useState(false);

  // Celebration hook for auto-celebrations
  const {
    showCelebration,
    celebrationData,
    triggerCelebration,
    closeCelebration,
    checkMilestones,
  } = useCelebration();

  // Get location state BEFORE using it
  const locationState = location.state as { crisis?: string; autoFocus?: boolean } | undefined;

  // SOS Mode detection
  const { isSOS, sosScript, reason: sosReason, dismissSOS } = useSOSDetection({
    searchQuery,
    crisisMode: locationState?.crisis ? true : false,
    enabled: !!user?.id,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (locationState?.crisis) {
      setSelectedCategory(null);
      // ✅ SECURITY: Sanitize crisis input to prevent XSS
      const sanitizedCrisis = locationState.crisis
        .replace(/[<>]/g, '') // Remove HTML tags
        .replace(/[^\w\s\-']/g, '') // Only alphanumeric, spaces, hyphens, apostrophes
        .replace(/[-_]/g, ' ')
        .trim()
        .substring(0, 100); // Max length
      setSearchQuery(sanitizedCrisis);
    }
    if (locationState?.autoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (locationState) {
      navigate(location.pathname, { replace: true, state: undefined });
    }
  }, [locationState, navigate, location.pathname]);

  const categories = [
    { name: 'All', emoji: '📚', value: null },
    { name: 'Bedtime', emoji: '🛏️', value: 'Bedtime' },
    { name: 'Screens', emoji: '📱', value: 'Screens' },
    { name: 'Mealtime', emoji: '🍽️', value: 'Mealtime' },
    { name: 'Transitions', emoji: '🔄', value: 'Transitions' },
    { name: 'Tantrums', emoji: '😤', value: 'Tantrums' },
    { name: 'Morning Routine', emoji: '☀️', value: 'Morning Routines' },
    { name: 'Social', emoji: '👥', value: 'Social' },
    { name: 'Hygiene', emoji: '🪥', value: 'Hygiene' },
  ];

  const getCategoryCount = useCallback(
    (category: string | null, scopedScripts: ScriptItem[]) => {
      if (!category) return scopedScripts.length;
      return scopedScripts.filter(
        (script) => script.category.toLowerCase() === category.toLowerCase(),
      ).length;
    },
    [],
  );


  const getContextBadgeIcon = (badge: string | null) => {
    switch (badge) {
      case 'MOST USED': return <TrendingUp className="w-3 h-3" />;
      case 'TRY FIRST': return <Flame className="w-3 h-3" />;
      case 'NEW': return <Sparkles className="w-3 h-3" />;
      default: return null;
    }
  };

  const getContextBadgeColor = (badge: string | null) => {
    switch (badge) {
      case 'MOST USED': return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      case 'TRY FIRST': return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'NEW': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      default: return '';
    }
  };


  const loadFeedback = useCallback(async (scriptId: string) => {
    if (!activeChild?.id || !user?.id) {
      setFeedbackHistory([]);
      return;
    }

    setLoadingFeedback(true);
    const { data, error } = await supabase
      .from('script_feedback')
      .select('id, outcome, notes, created_at')
      .eq('child_id', activeChild.id)
      .eq('script_id', scriptId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Failed to load script feedback', error);
      setFeedbackHistory([]);
    } else {
      setFeedbackHistory((data ?? []) as ScriptFeedbackRow[]);
      if (data && data.length > 0) {
        const latestOutcome = data[0].outcome as 'worked' | 'progress' | 'not_yet';
        setFeedbackOutcome(latestOutcome);
      }
    }

    setLoadingFeedback(false);
  }, [activeChild?.id, user?.id]);

  // ✅ Removed: fetchScripts and useEffect - React Query handles this automatically

  // Load scripts used today
  useEffect(() => {
    const loadUsedToday = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('script_usage')
          .select('script_id')
          .eq('user_id', user.id)
          .gte('used_at', new Date().toISOString().split('T')[0]); // Today's date

        if (error) {
          console.error('Error loading used scripts:', error);
          return;
        }

        if (data) {
          const usedIds = new Set(data.map(item => item.script_id));
          setUsed(usedIds);
        }
      } catch (error) {
        console.error('Error loading used scripts:', error);
      }
    };

    loadUsedToday();
  }, [user?.id]);

  useEffect(() => {
    if (selectedScript) {
      loadFeedback(selectedScript.id);
      setFeedbackOutcome('worked');
      setFeedbackNotes('');
    } else {
      setFeedbackHistory([]);
    }
  }, [loadFeedback, selectedScript]);

  // Separate effect to update selectedScriptRow when scripts change
  useEffect(() => {
    if (selectedScript && Array.isArray(scripts)) {
      const scriptRow = scripts.find(s => s.id === selectedScript.id);
      setSelectedScriptRow(scriptRow || null);
    } else {
      setSelectedScriptRow(null);
    }
  }, [selectedScript?.id, scripts]);

  const formattedScripts = useMemo<ScriptItem[]>(() => {
    if (!Array.isArray(scripts)) return [];
    return scripts.map((script) => ({
      id: script.id,
      title: script.title,
      category: script.category,
      displayCategory: formatCategory(script.category),
      brainType: script.profile,
      preview: script.phrase_1_action || script.phrase_1,
      emoji: CATEGORY_EMOJIS[script.category.toLowerCase()] ?? '🧠',
      badge: null,
      wrongWay: script.wrong_way,
      neurologicalTip: script.neurological_tip,
      tags: script.tags ?? [],
      estimatedTimeMinutes: script.estimated_time_minutes ?? null,
      steps: [
        { action: script.phrase_1_action, phrase: script.phrase_1 },
        { action: script.phrase_2_action, phrase: script.phrase_2 },
        { action: script.phrase_3_action, phrase: script.phrase_3 },
      ],
    }));
  }, [scripts]);

  // INÍCIO DO CÓDIGO CORRIGIDO DO CONFLITO
  const scriptMap = useMemo(() => {
    const entries = formattedScripts.map((script) => [script.id, script] as const);
    return new Map(entries);
  }, [formattedScripts]);

  const brainScopedScripts = useMemo(() => {
    // ✅ PERFORMANCE: Scripts already filtered by profile on server
    return formattedScripts;
  }, [formattedScripts]);

  const recommendationMeta = useMemo(() => {
    const meta = new Map<string, { successScore: number | null; feedbackCount: number | null }>();
    personalizedRecommendations.forEach((recommendation) => {
      meta.set(recommendation.scriptId, {
        successScore: recommendation.successScore,
        feedbackCount: recommendation.feedbackCount,
      });
    });
    return meta;
  }, [personalizedRecommendations]);

  const recommendedScripts = useMemo(() => {
    if (personalizedRecommendations.length > 0) {
      return personalizedRecommendations
        .map((recommendation) => scriptMap.get(recommendation.scriptId))
        .filter((script): script is ScriptItem => Boolean(script));
    }
    return brainScopedScripts.slice(0, 6);
  }, [brainScopedScripts, personalizedRecommendations, scriptMap]);

  const scriptCollectionsIndex = useMemo(() => {
    const index = new Map<string, string[]>();
    scopedCollections.forEach((collection) => {
      collection.scriptIds.forEach((id) => {
        const existing = index.get(id) ?? [];
        index.set(id, [...existing, collection.name]);
      });
    });
    return index;
  }, [scopedCollections]);

  // FIM DO CÓDIGO CORRIGIDO DO CONFLITO

  const filteredScripts = useMemo(() => {
    // ✅ PERFORMANCE: No need to filter by profile - already filtered on server
    // Apply category filter first
    if (!Array.isArray(scripts)) return [];
    const categoryFiltered = selectedCategory
      ? scripts.filter(
          (script) => script.category.toLowerCase() === selectedCategory.toLowerCase(),
        )
      : scripts;

    // If no search query, return category filtered
    if (!searchQuery.trim()) {
      return categoryFiltered;
    }

    // Use intelligent search if query exists
    return intelligentSearch(searchQuery, categoryFiltered);
  }, [scripts, searchQuery, selectedCategory]);

  // Removed old toggleFavorite function - now using useFavoriteScripts hook

  const markAsUsed = async (script: ScriptItem) => {
    setUsed((prev) => new Set(prev).add(script.id));

    // Save to database
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('script_usage')
          .insert({
            user_id: user.id,
            script_id: script.id,
          });

        if (error) {
          console.error('Failed to save script usage:', error);
          return;
        }

        // Check for milestone celebrations after successful save
        const milestoneType = await checkMilestones();
        if (milestoneType) {
          // Get total count for celebration data
          const totalCount = await getTotalScriptCount(user.id);
          await triggerCelebration(milestoneType, {
            scriptTitle: script.title,
            totalScriptsUsed: totalCount,
          });
        }
      } catch (err) {
        console.error('Error saving script usage:', err);
      }
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      toast({ title: 'Enter a name for the collection' });
      return;
    }
    setCreatingCollection(true);
    const created = await createCollection(newCollectionName, undefined, true);
    setCreatingCollection(false);
    if (created) {
      setNewCollectionName('');
      await refreshCollections();
    }
  };

  const handleToggleCollection = async (collectionId: string, scriptId: string) => {
    const names = scriptCollectionsIndex.get(scriptId) ?? [];
    if (names.length && scopedCollections.find((collection) => collection.id === collectionId && collection.scriptIds.includes(scriptId))) {
      await removeScriptFromCollection(collectionId, scriptId);
    } else {
      await addScriptToCollection(collectionId, scriptId);
    }
    await refreshCollections();
  };

  const handleNavigateToScript = (scriptId: string) => {
    const script = formattedScripts.find(s => s.id === scriptId);
    if (script) {
      setSelectedScript(script);
      // Also set the ScriptRow for the modal
      if (Array.isArray(scripts)) {
        const scriptRow = scripts.find(s => s.id === scriptId);
        setSelectedScriptRow(scriptRow || null);
      }
    }
  };

  // Helper function to handle script selection (opens modal with both ScriptItem and ScriptRow)
  const handleSelectScript = (scriptItem: ScriptItem) => {
    setSelectedScript(scriptItem);
    // Find the corresponding ScriptRow
    if (Array.isArray(scripts)) {
      const scriptRow = scripts.find(s => s.id === scriptItem.id);
      setSelectedScriptRow(scriptRow || null);
    }
  };

  const getRelatedScripts = (scriptIds: string[] | null) => {
    if (!scriptIds || scriptIds.length === 0) return [];
    return scriptIds
      .map(id => formattedScripts.find(s => s.id === id))
      .filter((s): s is ScriptItem => s !== undefined)
      .slice(0, 3);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedScript || !activeChild?.id || !user?.id) {
      toast({ title: 'Please select a script and a child profile before submitting.' });
      return;
    }

    setSavingFeedback(true);
    const payload: Database['public']['Tables']['script_feedback']['Insert'] = {
      user_id: user.id,
      child_id: activeChild.id,
      script_id: selectedScript.id,
      outcome: feedbackOutcome,
      notes: feedbackNotes.trim() ? feedbackNotes.trim() : null,
    };

    const { data, error } = await supabase
      .from('script_feedback')
      .insert(payload)
      .select('id, outcome, notes, created_at')
      .single();

    setSavingFeedback(false);

    if (error) {
      console.error('Failed to record feedback', error);
      toast({
        title: t.scripts.errors.saveFeedbackFailed,
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    const inserted = data as ScriptFeedbackRow;
    setFeedbackHistory((prev) => [inserted, ...prev]);
    setFeedbackNotes('');

    // Show appropriate modal based on feedback outcome
    if (feedbackOutcome === 'worked' && user?.id) {
      // Trigger script success celebration
      const totalCount = await getTotalScriptCount(user.id);
      await triggerCelebration('script_success', {
        scriptTitle: selectedScript.title,
        totalScriptsUsed: totalCount,
      });
    } else if (feedbackOutcome === 'not_yet') {
      setShowAlternatives(true);
    } else {
      toast({ title: 'Feedback registrado! Obrigado por compartilhar.' });
    }

    refreshChildRecommendations();
  };

  if (!activeChild && onboardingRequired) {
    return (
      <MainLayout>
        <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-purple-600/10 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-500/20 dark:border-purple-700/40 text-center">
          <h2 className="text-2xl font-bold mb-3">Let's personalize your scripts</h2>
          <p className="text-muted-foreground mb-4">
            Add your child to unlock tailored NEP scripts.
          </p>
          <Button onClick={() => navigate('/quiz')} className="bg-primary text-white">
            Take the quiz →
          </Button>
        </Card>
      </MainLayout>
    );
  }

  if (!activeChild) {
    return (
      <MainLayout>
        <div className="space-y-6 text-center">
          <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-purple-600/10 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-500/20 dark:border-purple-700/40">
            <h2 className="text-2xl font-bold mb-2">Create your first child profile</h2>
            <p className="text-muted-foreground mb-6">
              Select a child from the header to view their personalized scripts.
            </p>
            <Button onClick={() => navigate('/quiz')} size="lg" className="bg-primary text-white">
              Start the NEP quiz →
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* SOS Mode Overlay */}
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

      <div className="min-h-screen bg-background pb-32 relative overflow-hidden">
        {/* Fixed Header Background for Status Bar */}
        <div className="fixed top-0 left-0 right-0 z-40 h-[calc(env(safe-area-inset-top)+80px)] bg-gradient-to-b from-background via-background to-transparent pointer-events-none" />

        <div className="relative z-50 px-4 pt-[calc(env(safe-area-inset-top)+8px)] space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <ScriptsHeader
            totalScripts={brainScopedScripts.length}
            usedToday={used.size}
            brainType={currentBrain}
            loading={loadingScripts}
          />
          <Button
            onClick={() => setRequestScriptModalOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <MessageCircleHeart className="w-4 h-4 mr-2" />
            <span>Request Script</span>
          </Button>
        </div>

        <Card className="p-6 bg-card border-border shadow-xl rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          
          <div className="flex items-center justify-between gap-3 flex-wrap relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg shadow-sm border-border">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Smart suggestions for {activeChild?.name ?? 'your family'}</h2>
            </div>
            <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10 font-medium px-3 py-1">
              {hasPersonalizedHistory ? '✨ ' + t.scripts.personalizedHistory : `🧠 ${t.scripts.profileBased} ${currentBrain}`}
            </Badge>
          </div>
          {loadingPersonalizedRecommendations ? (
            <div className="flex items-center justify-center py-6 text-muted-foreground">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating recommendations…
            </div>
          ) : recommendedScripts.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-4">
              Add scripts to your workflow to receive personalized suggestions.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 mt-5">
              {recommendedScripts.map((script) => {
                const meta = recommendationMeta.get(script.id);
                return (
                  <div
                    key={script.id}
                    className="relative text-left rounded-xl bg-card border-border p-5 transition-all hover:bg-muted/50 hover:border-muted-foreground/20 group"
                  >
                    <button
                      onClick={() => handleSelectScript(script)}
                      className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl shrink-0 group-hover:scale-110 transition-transform grayscale group-hover:grayscale-0">{script.emoji}</div>
                        <div className="flex-1 pr-8">
                        <p className="font-bold text-base text-foreground group-hover:text-purple-400 transition-colors">{script.title}</p>
                        <p className="text-xs text-muted-foreground mt-1.5 font-medium">{script.displayCategory}</p>
                        {meta?.feedbackCount ? (
                          <p className="text-[11px] text-muted-foreground mt-1">
                            {meta.feedbackCount} registro(s) positivo(s)
                          </p>
                        ) : null}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {script.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="border-border text-muted-foreground bg-muted">
                              #{tag}
                            </Badge>
                          ))}
                          {script.estimatedTimeMinutes && (
                            <Badge className="bg-muted text-foreground border-border">
                              ⏱️ {script.estimatedTimeMinutes} min
                            </Badge>
                          )}
                          {meta?.successScore !== undefined && meta.successScore !== null && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                              {(
                                (meta.successScore > 1 ? meta.successScore : meta.successScore * 100)
                              ).toFixed(0)}% sucesso
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(script.id);
                    }}
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-primary/10 transition-colors"
                    aria-label={isFavorite(script.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart
                      className={`w-4 h-4 transition-all ${
                        isFavorite(script.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-muted-foreground hover:text-red-500'
                      }`}
                    />
                  </button>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 w-5 h-5 transition-colors z-10" />
          <Input
            placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-base border-border bg-background text-foreground placeholder:text-muted-foreground rounded-2xl focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all shadow-lg"
            ref={searchInputRef}
          />
        </div>

        {/* Quick Access Bar */}
        <QuickAccessBar
          onScriptSelect={(script) => {
            setSelectedScriptRow(script);
            setSelectedScript(convertToScriptItem(script));
          }}
        />

        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Button
              key={cat.name}
              variant="ghost"
              className={`
                whitespace-nowrap justify-start h-12 text-sm font-medium rounded-xl border
                transition-all duration-300
                ${selectedCategory === cat.value
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg hover:bg-primary/90'
                  : 'bg-card text-muted-foreground border-border hover:border-muted-foreground/50 hover:text-foreground'
                }
              `}
              onClick={() => setSelectedCategory(cat.value)}
            >
              <span className="mr-3 text-lg grayscale opacity-80">{cat.emoji}</span>
              <span className="flex-1 text-left">{cat.name}</span>
              {getCategoryCount(cat.value, brainScopedScripts) > 0 && (
                <Badge
                  variant="secondary"
                  className={`ml-2 text-[10px] h-5 min-w-[20px] flex items-center justify-center px-1 ${
                    selectedCategory === cat.value 
                      ? 'bg-primary-foreground text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {getCategoryCount(cat.value, brainScopedScripts)}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Scripts Grid */}
        <div className="grid grid-cols-1 gap-4">
          {loadingScripts ? (
            <ScriptCardSkeletonList count={6} />
          ) : (
            filteredScripts.map((script) => (
              <EnhancedScriptCard
                key={script.id}
                script={script}
                emoji={CATEGORY_EMOJIS[script.category.toLowerCase()] ?? '🧠'}
                displayCategory={formatCategory(script.category)}
                onClick={() => {
                  setSelectedScriptRow(script);
                  setSelectedScript(convertToScriptItem(script));
                }}
                isFavorite={isFavorite(script.id)}
                onToggleFavorite={(e) => {
                  e.stopPropagation();
                  toggleFavorite(script.id);
                }}
                collectionsNames={scriptCollectionsIndex.get(script.id) ?? []}
              />
            ))
          )}
          {filteredScripts.length === 0 && !loadingScripts && (
            <EmptyState
              type={searchQuery ? 'no-results' : 'no-scripts'}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
            />
          )}
        </div>

        {/* Script Modal - Using new ScriptModal component */}
        <ScriptModal
          open={!!selectedScript}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedScript(null);
              setSelectedScriptRow(null);
            }
          }}
          script={selectedScriptRow}
          isFavorite={selectedScript ? isFavorite(selectedScript.id) : false}
          onToggleFavorite={() => selectedScript && toggleFavorite(selectedScript.id)}
          onMarkUsed={() => selectedScript && markAsUsed(selectedScript)}
          onNavigateToScript={handleNavigateToScript}
        />

        {/* Celebration Modal */}
        <CelebrationModal
          open={showCelebration}
          onOpenChange={closeCelebration}
          celebrationData={celebrationData}
        />

        {/* Alternatives Modal */}
        <AlternativesModal
          open={showAlternatives}
          onOpenChange={setShowAlternatives}
          relatedScripts={selectedScriptRow ? getRelatedScripts((selectedScriptRow as any).related_script_ids) : []}
          onNavigateToScript={handleNavigateToScript}
          onOpenSOS={() => navigate('/sos')}
          onClose={() => setShowAlternatives(false)}
        />

          {/* Request Script Modal */}
          <RequestScriptModal
            open={requestScriptModalOpen}
            onOpenChange={setRequestScriptModalOpen}
          />
        </div>
      </div>
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