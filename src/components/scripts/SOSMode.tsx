import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, X, Clock } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];

interface SOSModeProps {
  script: ScriptRow;
  onUse: () => void;
  onExit: () => void;
}

export function SOSMode({ script, onUse, onExit }: SOSModeProps) {
  const CATEGORY_EMOJIS: Record<string, string> = {
    bedtime: '🛏️',
    screens: '📱',
    mealtime: '🍽️',
    transitions: '🔄',
    tantrums: '😤',
    morning_routines: '☀️',
    morning_routine: '☀️',
    social: '👥',
    hygiene: '🪥',
    emotional_regulation: '💚',
    cooperation: '🤝',
    chores: '🧹',
    connection: '💙',
    problem_solving: '🧩',
    regulation: '🎯',
    evening_routine: '🌙',
  };

  const emoji = CATEGORY_EMOJIS[script.category.toLowerCase()] || '🧠';

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 p-2 sm:p-4 flex items-center justify-center animate-in fade-in duration-300 overflow-y-auto">
      <Card className="max-w-2xl w-full p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-2xl animate-in slide-in-from-bottom-4 duration-500 my-auto max-h-[95vh] overflow-y-auto">
        {/* Exit Button */}
        <button
          onClick={onExit}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-muted/50 transition-colors bg-white/80 z-10"
          aria-label="Exit SOS mode"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 sm:space-y-3 pt-8 sm:pt-0">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <Zap className="w-6 h-6 sm:w-10 sm:h-10 text-red-600 fill-red-600 animate-pulse" />
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              SOS MODE
            </h2>
            <Zap className="w-6 h-6 sm:w-10 sm:h-10 text-red-600 fill-red-600 animate-pulse" />
          </div>
          <p className="text-sm sm:text-lg text-muted-foreground font-medium px-2">
            Based on your situation, <strong>try this first:</strong>
          </p>
        </div>

        {/* Script Card - LARGE & PROMINENT */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary p-3 sm:p-6 rounded-xl space-y-3 sm:space-y-5 shadow-lg">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="text-4xl sm:text-6xl animate-bounce" style={{ animationDuration: '2s' }}>
              {emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-2xl font-bold mb-2 break-words">{script.title}</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
                <Badge variant="outline" className="text-[10px] sm:text-xs bg-primary/10 border-primary/30 whitespace-nowrap">
                  🧠 {script.profile}
                </Badge>
                {script.success_speed && (
                  <Badge className="text-[10px] sm:text-xs bg-green-500/10 text-green-700 border-green-500/20 whitespace-nowrap">
                    ⚡ {script.success_speed}
                  </Badge>
                )}
                {script.expected_time_seconds && (
                  <Badge className="text-[10px] sm:text-xs bg-blue-500/10 text-blue-700 border-blue-500/20 whitespace-nowrap">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                    {script.expected_time_seconds}s expected
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Situation Trigger */}
          {script.situation_trigger && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
                WHEN TO USE:
              </p>
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                {script.situation_trigger}
              </p>
            </div>
          )}

          {/* Quick Preview of Phrases */}
          <div className="space-y-2 sm:space-y-3 bg-white/50 dark:bg-slate-800/50 p-3 sm:p-4 rounded-lg">
            <p className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wide">
              QUICK PREVIEW - 3 SIMPLE STEPS:
            </p>

            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="text-base sm:text-lg font-bold text-violet-600 shrink-0">1️⃣</span>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {script.phrase_1.substring(0, 80)}
                  {script.phrase_1.length > 80 ? '...' : ''}
                </p>
              </div>

              <div className="flex gap-2">
                <span className="text-base sm:text-lg font-bold text-blue-600 shrink-0">2️⃣</span>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {script.phrase_2.substring(0, 80)}
                  {script.phrase_2.length > 80 ? '...' : ''}
                </p>
              </div>

              <div className="flex gap-2">
                <span className="text-base sm:text-lg font-bold text-green-600 shrink-0">3️⃣</span>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {script.phrase_3.substring(0, 80)}
                  {script.phrase_3.length > 80 ? '...' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Why This Script */}
          {script.neurological_tip && (
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-2.5 sm:p-3">
              <p className="text-[10px] sm:text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                <strong className="font-semibold">💡 Why this works:</strong>{' '}
                {script.neurological_tip.substring(0, 150)}
                {script.neurological_tip.length > 150 ? '...' : ''}
              </p>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="space-y-2 sm:space-y-3">
          <Button
            onClick={onUse}
            size="lg"
            className="w-full h-12 sm:h-16 text-base sm:text-xl font-bold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-xl hover:shadow-2xl transition-all"
          >
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            USE THIS NOW
          </Button>

          <Button
            onClick={onExit}
            variant="ghost"
            className="w-full h-10 sm:h-auto text-sm sm:text-base text-muted-foreground hover:text-foreground"
          >
            No, show me all scripts
          </Button>
        </div>

        {/* Emergency Note */}
        <div className="bg-muted/30 border border-muted rounded-lg p-2.5 sm:p-3 text-center">
          <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
            <strong>SOS Mode:</strong> This script was selected because it works fast,
            even when you're already frustrated, and fits your current situation.
          </p>
        </div>
      </Card>
    </div>
  );
}
