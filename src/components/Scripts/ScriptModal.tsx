import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Share2, Clock, AlertTriangle, Brain, CheckCircle2, XCircle, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/integrations/supabase/types";
import { CrisisView } from "./CrisisView";
import { FeedbackModal } from "./FeedbackModal";
import { AlternativesModal } from "./AlternativesModal";
import { showEncouragementToast } from "./EncouragementToast";
import { toast } from "@/components/ui/use-toast";
import { HyperSpecificScriptView } from "./HyperSpecificScriptView";
import { isHyperSpecificScript } from "@/types/script-structure";
import { ScriptActionButtons } from "./ScriptActionButtons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

export const ScriptModal = ({
  open,
  onOpenChange,
  script,
  isFavorite,
  onToggleFavorite,
  onMarkUsed,
  onNavigateToScript,
}: ScriptModalProps) => {
  // Feedback flow state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  if (!script) return null;

  const crisisMode = false; // Always use Full Details mode for now

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: script.title,
        text: `Check out this NEP script: ${script.title}`,
      });
    } else {
      toast({ title: "Link Copied!", description: "Share this script with others." });
    }
  };

  const handleMarkUsed = () => {
    onMarkUsed();
    setShowFeedbackModal(true);
  };

  const handleWorked = () => {
    setShowFeedbackModal(false);
    toast({
      title: "🎉 Amazing work!",
      description: `Keep up the consistency!`,
      className: "bg-green-50 border-green-200 text-green-900",
    });
    onOpenChange(false);
  };

  const handleProgress = () => {
    setShowFeedbackModal(false);
    showEncouragementToast();
    onOpenChange(false);
  };

  const handleNotYet = () => {
    setShowFeedbackModal(false);
    setShowAlternatives(true);
  };

  const getRelatedScripts = () => {
    const relatedIds = (script as any).related_script_ids as string[] | null;
    if (!relatedIds || relatedIds.length === 0) return [];
    return relatedIds.slice(0, 3).map(id => ({
      id,
      title: `Related Script...`
    }));
  };

  const sequence = [
    {
      label: "Connect",
      phrase: script.phrase_1,
      action: script.phrase_1_action,
      tip: (script as any).say_it_like_this_step1,
      color: "bg-blue-500",
      lightColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-700 dark:text-blue-300"
    },
    {
      label: "Validate",
      phrase: script.phrase_2,
      action: script.phrase_2_action,
      tip: (script as any).say_it_like_this_step2,
      color: "bg-purple-500",
      lightColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      textColor: "text-purple-700 dark:text-purple-300"
    },
    {
      label: "Redirect",
      phrase: script.phrase_3,
      action: script.phrase_3_action,
      tip: (script as any).say_it_like_this_step3,
      color: "bg-green-500",
      lightColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      textColor: "text-green-700 dark:text-green-300"
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full h-[90vh] p-0 gap-0 flex flex-col bg-background overflow-hidden rounded-3xl border-0">
        
        {/* 1. FIXED HEADER */}
        <div className="px-5 py-4 border-b border-border/40 bg-background/80 backdrop-blur-md z-20 flex items-start justify-between gap-4">
          <div>
            <div className="flex gap-2 mb-2">
              <Badge variant="secondary" className="text-[10px] h-5 px-2 font-bold uppercase tracking-wider text-muted-foreground bg-secondary/50">
                {script.category}
              </Badge>
              {script.profile && (
                <Badge className="text-[10px] h-5 px-2 font-bold uppercase tracking-wider bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none">
                  {script.profile}
                </Badge>
              )}
            </div>
            <DialogTitle className="text-xl font-bold leading-tight text-foreground pr-4">
              {script.title}
            </DialogTitle>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleFavorite}
              className="h-9 w-9 rounded-full"
            >
              <Star className={cn("w-5 h-5", isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-9 w-9 rounded-full"
            >
              <Share2 className="w-5 h-5 text-muted-foreground" />
            </Button>
            {/* Explicit Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-9 w-9 rounded-full"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* 2. SCROLLABLE CONTENT */}
        <ScrollArea className="flex-1 w-full bg-[#F5F5F7] dark:bg-black">
          <div className="px-5 py-6 space-y-6 pb-[calc(env(safe-area-inset-bottom)+1rem+8rem)]"> {/* Added pb for ScriptActionButtons */}
            
            {isHyperSpecificScript(script) ? (
              <HyperSpecificScriptView script={script} crisisMode={crisisMode} />
            ) : (
              <>
                {/* Context Card */}
                <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-2xl shadow-sm border border-black/5">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Brain className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wide">Why this works</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {script.neurological_tip || "This script helps regulate the nervous system by acknowledging feelings before setting boundaries."}
                  </p>
                </div>

                {/* The Script Sequence */}
                <div className="space-y-4">
                  {sequence.map((step, i) => {
                    if (!step.phrase) return null;
                    return (
                      <div key={i} className="relative">
                        {/* Connector Line */}
                        {i < sequence.length - 1 && (
                          <div className="absolute left-[19px] top-10 bottom-[-20px] w-[2px] bg-gray-200 dark:bg-gray-800 z-0" />
                        )}
                        
                        <div className="relative z-10 flex gap-4">
                          {/* Number Bubble */}
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm shrink-0 text-sm",
                            step.color
                          )}>
                            {i + 1}
                          </div>

                          {/* Card */}
                          <div className="flex-1 bg-white dark:bg-[#1C1C1E] rounded-2xl p-5 shadow-sm border border-black/5 dark:border-white/5">
                            <div className={cn("text-xs font-bold uppercase tracking-wider mb-2", step.textColor)}>
                              {step.label}
                            </div>
                            <p className="text-lg font-semibold text-foreground leading-snug mb-3">
                              "{step.phrase}"
                            </p>
                            
                            {(step.action || step.tip) && (
                              <div className={cn("text-sm p-3 rounded-xl", step.lightColor)}>
                                {step.action && (
                                  <div className="flex items-start gap-2 mb-1 last:mb-0">
                                    <Clock className="w-3.5 h-3.5 mt-0.5 opacity-70" />
                                    <span className="font-medium opacity-90">{step.action}</span>
                                  </div>
                                )}
                                {step.tip && (
                                  <div className="flex items-start gap-2 mt-2 pt-2 border-t border-black/5 dark:border-white/5">
                                    <Sparkles className="w-3.5 h-3.5 mt-0.5 opacity-70" />
                                    <span className="italic opacity-80 text-xs">{step.tip}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Avoid Card */}
                <div className="bg-red-50 dark:bg-red-950/20 p-5 rounded-2xl border border-red-100 dark:border-red-900/30 flex gap-4">
                  <div className="bg-white dark:bg-red-900/50 w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-red-500 shadow-sm">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-red-700 dark:text-red-300 uppercase tracking-wide mb-1">Avoid Saying</h4>
                    <p className="text-base text-red-900 dark:text-red-100 italic">"{script.wrong_way}"</p>
                  </div>
                </div>

                {/* Action Buttons - Now part of scrollable content */}
                {/* Removed from here */}
              </>
            )}

            {/* Action Buttons - Common for all types */}
            <div className="pt-4">
              <ScriptActionButtons
                scriptId={script.id}
                scriptTitle={script.title}
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
                onMarkUsed={handleMarkUsed}
              />
            </div>
          </div>
        </ScrollArea>

      </DialogContent>

      {/* Support Modals */}
      <FeedbackModal
        open={showFeedbackModal}
        onOpenChange={setShowFeedbackModal}
        scriptId={script.id}
        scriptTitle={script.title}
        onWorked={handleWorked}
        onProgress={handleProgress}
        onNotYet={handleNotYet}
      />

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
        }}
        onClose={() => setShowAlternatives(false)}
      />
    </Dialog>
  );
};