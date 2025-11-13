import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Share2, Check, Timer, Wand2, ArrowRight, Lightbulb, AlertCircle, MessageCircle, Clock, Target, AlertTriangle, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Database } from "@/integrations/supabase/types";
import { CrisisView } from "./CrisisView";
import { FeedbackModal } from "./FeedbackModal";
import { AlternativesModal } from "./AlternativesModal";
import { showEncouragementToast } from "./EncouragementToast";
import { toast } from "@/components/ui/use-toast";
import { HyperSpecificScriptView } from "./HyperSpecificScriptView";
import { isHyperSpecificScript } from "@/types/script-structure";
import { ScriptActionButtons } from "./ScriptActionButtons";

type Script = Database["public"]["Tables"]["scripts"]["Row"];

interface ScriptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  script: Script | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onMarkUsed: () => void;
  onNavigateToScript?: (scriptId: string) => void;
}

// Helper function to get difficulty with color
const getDifficultyInfo = (difficulty: string | null) => {
  switch (difficulty) {
    case 'Easy':
      return { stars: '⭐', label: 'Easy', color: 'text-green-600 dark:text-green-400' };
    case 'Moderate':
      return { stars: '⭐⭐', label: 'Moderate', color: 'text-yellow-600 dark:text-yellow-400' };
    case 'Hard':
      return { stars: '⭐⭐⭐', label: 'Challenging', color: 'text-orange-600 dark:text-orange-400' };
    default:
      return { stars: '⭐⭐', label: 'Moderate', color: 'text-yellow-600 dark:text-yellow-400' };
  }
};

export const ScriptModal = ({
  open,
  onOpenChange,
  script,
  isFavorite,
  onToggleFavorite,
  onMarkUsed,
  onNavigateToScript,
}: ScriptModalProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Feedback flow state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  // Early return AFTER all hooks
  if (!script) return null;

  // Always use Full Details mode (crisisMode = false)
  const crisisMode = false;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: script.title,
        text: `Check out this NEP script: ${script.title}`,
      });
    }
  };

  // Handle Mark as Used with feedback flow
  const handleMarkUsed = () => {
    // Call original onMarkUsed (saves to script_usage table)
    onMarkUsed();

    // Show Feedback Modal immediately (will appear on top of script modal)
    // Script modal stays open until user completes feedback
    setShowFeedbackModal(true);
  };

  // Handle feedback outcomes
  const handleWorked = () => {
    // Close feedback modal
    setShowFeedbackModal(false);

    // Show celebration toast
    toast({
      title: "🎉 Amazing work!",
      description: `You just handled "${script.title}" successfully! Keep up the great parenting.`,
      duration: 5000,
      className: "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 dark:from-green-600/20 dark:to-emerald-600/20 dark:border-green-500/50",
    });

    // Close script modal after feedback
    onOpenChange(false);
  };

  const handleProgress = () => {
    // Close feedback modal
    setShowFeedbackModal(false);

    showEncouragementToast();

    // Close script modal after feedback
    onOpenChange(false);
  };

  const handleNotYet = () => {
    // Close feedback modal and show alternatives
    setShowFeedbackModal(false);
    setShowAlternatives(true);
  };

  // Get related scripts for modals
  const getRelatedScripts = () => {
    const relatedIds = (script as any).related_script_ids as string[] | null;
    if (!relatedIds || relatedIds.length === 0) return [];

    // Return script IDs and placeholder titles
    // In a real implementation, you'd fetch the actual scripts
    return relatedIds.slice(0, 3).map(id => ({
      id,
      title: `Related Script ${id.substring(0, 8)}...`
    }));
  };

  const sequence = [
    {
      phrase: script.phrase_1,
      action: script.phrase_1_action,
      sayItLikeThis: (script as any).say_it_like_this_step1,
      avoid: (script as any).avoid_step1,
    },
    {
      phrase: script.phrase_2,
      action: script.phrase_2_action,
      sayItLikeThis: (script as any).say_it_like_this_step2,
      avoid: (script as any).avoid_step2,
    },
    {
      phrase: script.phrase_3,
      action: script.phrase_3_action,
      sayItLikeThis: (script as any).say_it_like_this_step3,
      avoid: (script as any).avoid_step3,
    },
  ];

  const whatToExpect = (script as any).what_to_expect as string[] | null;
  const relatedScriptIds = (script as any).related_script_ids as string[] | null;
  const difficultyLevel = (script as any).difficulty_level as string | null;
  const ageRange = (script as any).age_range as string | null;
  const durationMinutes = (script as any).duration_minutes as number | null || script.estimated_time_minutes || 5;

  const difficultyInfo = getDifficultyInfo(difficultyLevel);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap flex-1">
              <Badge variant="secondary" className="text-sm px-3 py-1">{script.category}</Badge>
              {script.profile && (
                <Badge className="text-sm px-3 py-1 bg-primary/90 hover:bg-primary">{script.profile} Brain</Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleFavorite}
                aria-label={isFavorite ? "Remove favorite" : "Save favorite"}
                className="hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors"
              >
                <Star className={`w-5 h-5 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                aria-label="Share script"
                className="hover:bg-primary/10 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <DialogTitle className="text-3xl font-bold mt-4 leading-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {script.title}
          </DialogTitle>
        </DialogHeader>

        {/* Conditional Content with Transition */}
        <div
          className={`space-y-6 mt-6 transition-opacity duration-200 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {isHyperSpecificScript(script) ? (
            // NEW HYPER-SPECIFIC STRUCTURE
            <HyperSpecificScriptView script={script} crisisMode={crisisMode} />
          ) : crisisMode ? (
            // OLD STRUCTURE - CRISIS MODE VIEW - Just the 3 phrases
            <CrisisView script={script} />
          ) : (
            // OLD STRUCTURE - FULL SCRIPT VIEW - All details
            <>
          {/* QUICK CONTEXT - IMPROVED DESIGN */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100">Quick Context</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                  <Target className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase">Best For</span>
                </div>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">Ages {ageRange || "3-10"}</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase">Duration</span>
                </div>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{durationMinutes} min</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                  <span className="text-xs font-semibold uppercase">Difficulty</span>
                </div>
                <p className={`text-lg font-bold ${difficultyInfo.color}`}>
                  {difficultyInfo.stars} {difficultyInfo.label}
                </p>
              </div>
            </div>
          </div>

          {/* WRONG WAY - IMPROVED DESIGN */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-2 border-red-200 dark:border-red-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-500 rounded-lg shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-red-900 dark:text-red-100 mb-2">❌ Wrong Way</h3>
                <p className="text-sm leading-relaxed text-red-800 dark:text-red-200 italic">"{script.wrong_way}"</p>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* NEP SYSTEM - IMPROVED DESIGN */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-green-500 rounded-lg">
                <Check className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-xl text-green-900 dark:text-green-100">✅ NEP 3-Phrase Sequence</h3>
            </div>

            {sequence.map((step, index) => {
              if (!step.phrase) return null;

              const stepColors = [
                { bg: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30', border: 'border-violet-200 dark:border-violet-800', badge: 'bg-violet-500', text: 'text-violet-900 dark:text-violet-100' },
                { bg: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30', border: 'border-blue-200 dark:border-blue-800', badge: 'bg-blue-500', text: 'text-blue-900 dark:text-blue-100' },
                { bg: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30', border: 'border-emerald-200 dark:border-emerald-800', badge: 'bg-emerald-500', text: 'text-emerald-900 dark:text-emerald-100' },
              ];

              const color = stepColors[index];

              return (
                <div key={index} className="space-y-3">
                  <div className={`bg-gradient-to-br ${color.bg} border ${color.border} rounded-xl p-5 shadow-sm transition-all hover:shadow-md`}>
                    <div className="flex items-start gap-4">
                      <div className={`${color.badge} text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-lg shrink-0 shadow-md`}>
                        {index + 1}
                      </div>
                      <div className="space-y-2 flex-1">
                        <p className={`text-base font-semibold leading-relaxed ${color.text}`}>"{step.phrase}"</p>
                        {step.action && (
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              <Timer className="h-3 w-3 mr-1" />
                              {step.action}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* STEP GUIDANCE - IMPROVED DESIGN */}
                  {(step.sayItLikeThis || step.avoid) && (
                    <div className="ml-12 space-y-3">
                      {step.sayItLikeThis && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-l-4 border-green-500 dark:border-green-400 rounded-r-lg p-4 shadow-sm">
                          <div className="flex items-start gap-2">
                            <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wide mb-1">
                                Say it like this
                              </p>
                              <p className="text-sm text-green-900 dark:text-green-100 leading-relaxed">{step.sayItLikeThis}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {step.avoid && (
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/40 dark:to-red-950/40 border-l-4 border-orange-500 dark:border-orange-400 rounded-r-lg p-4 shadow-sm">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wide mb-1">
                                Avoid
                              </p>
                              <p className="text-sm text-orange-900 dark:text-orange-100 leading-relaxed">{step.avoid}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Separator className="my-8" />

          {/* NEUROLOGICAL TIP - IMPROVED DESIGN */}
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-6 shadow-md">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shrink-0 shadow-md">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-purple-900 dark:text-purple-100 mb-2">💡 Neurological Insight</h3>
                <p className="text-sm leading-relaxed text-purple-800 dark:text-purple-200">{script.neurological_tip}</p>
              </div>
            </div>
          </div>

          {/* WHAT TO EXPECT - IMPROVED DESIGN */}
          {whatToExpect && whatToExpect.length > 0 && (
            <>
              <Separator className="my-8" />
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-amber-900 dark:text-amber-100">What to Expect</h3>
                </div>
                <div className="grid gap-3">
                  {whatToExpect.map((expectation, index) => (
                    <div key={index} className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 backdrop-blur-sm border border-amber-200/50 dark:border-amber-700/50 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                          {index + 1}
                        </div>
                        <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">{expectation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* RELATED SCRIPTS - IMPROVED DESIGN */}
          {relatedScriptIds && relatedScriptIds.length > 0 && onNavigateToScript && (
            <>
              <Separator className="my-8" />
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-indigo-500 rounded-lg">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-100">If This Doesn't Work, Try:</h3>
                </div>
                <div className="grid gap-3">
                  {relatedScriptIds.slice(0, 3).map((scriptId) => (
                    <button
                      key={scriptId}
                      onClick={() => onNavigateToScript(scriptId)}
                      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-indigo-200/50 dark:border-indigo-700/50 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors">
                          <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                          Related Script • {scriptId.substring(0, 8)}...
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ACTION BUTTONS - NEW COMPONENT */}
          <ScriptActionButtons
            scriptId={script.id}
            scriptTitle={script.title}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            onMarkUsed={handleMarkUsed}
          />
            </>
          )}
        </div>

        {/* Action Buttons - Crisis Mode / Hyper-Specific */}
        {(crisisMode || isHyperSpecificScript(script)) && (
          <div className="pt-4 border-t border-border mt-6">
            <ScriptActionButtons
              scriptId={script.id}
              scriptTitle={script.title}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
              onMarkUsed={handleMarkUsed}
            />
          </div>
        )}
      </DialogContent>

      {/* Feedback Modal - Opens 1 second after Mark as Used */}
      <FeedbackModal
        open={showFeedbackModal}
        onOpenChange={setShowFeedbackModal}
        scriptId={script.id}
        scriptTitle={script.title}
        onWorked={handleWorked}
        onProgress={handleProgress}
        onNotYet={handleNotYet}
      />

      {/* Alternatives Modal - Opens when feedback is "not_yet" */}
      <AlternativesModal
        open={showAlternatives}
        onOpenChange={setShowAlternatives}
        relatedScripts={getRelatedScripts()}
        onNavigateToScript={(scriptId) => {
          setShowAlternatives(false);
          onNavigateToScript?.(scriptId);
        }}
        onOpenSOS={() => {
          setShowAlternatives(false);
          // Navigate to SOS page would be handled by parent component
        }}
        onClose={() => setShowAlternatives(false)}
      />
    </Dialog>
  );
};
