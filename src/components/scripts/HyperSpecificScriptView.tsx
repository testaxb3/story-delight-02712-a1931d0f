import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Target, AlertCircle, Check, Lightbulb, Clock, MessageCircle, ChevronDown, ChevronUp, Wrench } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import {
  parseStrategySteps,
  parseWhatToExpect,
  parseCommonVariations,
  getDifficultyInfo,
  type StrategyStep,
  type WhatToExpect,
  type CommonVariation
} from "@/types/script-structure";
import { renderMarkdown } from "@/lib/markdownRenderer";

type Script = Database["public"]["Tables"]["scripts"]["Row"];

interface HyperSpecificScriptViewProps {
  script: Script;
  crisisMode: boolean;
}

export const HyperSpecificScriptView = ({ script, crisisMode }: HyperSpecificScriptViewProps) => {
  const [theSituationExpanded, setTheSituationExpanded] = useState(false); // Collapsed by default
  const [whatDoesntWorkExpanded, setWhatDoesntWorkExpanded] = useState(false); // Collapsed by default
  const [whyThisWorksExpanded, setWhyThisWorksExpanded] = useState(false);
  const [variationsExpanded, setVariationsExpanded] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]); // All steps collapsed by default

  // Parse JSON fields
  const strategySteps = parseStrategySteps(script.strategy_steps);
  const whatToExpect = parseWhatToExpect(script.what_to_expect);
  const commonVariations = parseCommonVariations(script.common_variations);

  // Safety check: If no new structure data, don't render
  if (!strategySteps && !whatToExpect && !script.the_situation && !script.why_this_works) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">This script uses the legacy format. Please refresh or select a different script.</p>
      </div>
    );
  }

  // Get display values with fallbacks
  const ageRange = script.age_min && script.age_max ? `${script.age_min}-${script.age_max}` : "3-10";
  const durationMinutes = script.duration_minutes || script.estimated_time_minutes || 5;
  const difficultyInfo = getDifficultyInfo(script.difficulty || script.difficulty_level);

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps(prev =>
      prev.includes(stepNumber)
        ? prev.filter(n => n !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  // CRISIS MODE: Show only strategy steps, all expanded
  if (crisisMode) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-2 border-red-300 dark:border-red-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-lg text-red-900 dark:text-red-100">🚨 Crisis Mode Active</h3>
          </div>
          <p className="text-sm text-red-800 dark:text-red-200">Showing strategy only. Toggle to Full Details for complete context.</p>
        </div>

        {strategySteps && strategySteps.length > 0 && (
          <div className="space-y-4">
            {strategySteps.map((step) => (
              <div key={step.step_number} className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-300 dark:border-green-700 rounded-xl p-5 shadow-lg">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-green-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-xl shrink-0 shadow-md">
                    {step.step_number}
                  </div>
                  <h4 className="text-xl font-bold text-green-900 dark:text-green-100 leading-tight">{step.step_title}</h4>
                </div>

                <div className="space-y-3 ml-13">
                  {step.what_to_say_examples && step.what_to_say_examples.map((example, idx) => (
                    <div key={idx} className="bg-white/90 dark:bg-slate-800/90 rounded-lg p-4 border border-green-200 dark:border-green-800 shadow-sm">
                      <div className="flex items-start gap-2">
                        <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                        <p className="text-lg text-green-900 dark:text-green-100 leading-relaxed font-medium">"{example}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // FULL VIEW: All 6 sections
  return (
    <div className="space-y-6">
      {/* QUICK CONTEXT */}
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
            <p className="text-lg font-bold text-blue-900 dark:text-blue-100">Ages {ageRange}</p>
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

      {/* 1. THE SITUATION */}
      {script.the_situation && (
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/50 dark:to-gray-950/50 border border-slate-200 dark:border-slate-800 rounded-xl shadow-md overflow-hidden">
          <button
            onClick={() => setTheSituationExpanded(!theSituationExpanded)}
            className="w-full p-6 text-left hover:bg-slate-100/50 dark:hover:bg-slate-900/20 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-600 rounded-lg shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">🎯 The Situation</h3>
              </div>
              {theSituationExpanded ? (
                <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0" />
              )}
            </div>
          </button>

          {theSituationExpanded && (
            <div className="px-6 pb-6 animate-in fade-in duration-200">
              <div className="space-y-3">
                {script.the_situation.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-base leading-relaxed text-slate-800 dark:text-slate-200">
                    {renderMarkdown(paragraph.trim())}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. WHAT DOESN'T WORK */}
      {script.what_doesnt_work && (
        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-2 border-red-200 dark:border-red-800 rounded-xl shadow-md overflow-hidden">
          <button
            onClick={() => setWhatDoesntWorkExpanded(!whatDoesntWorkExpanded)}
            className="w-full p-6 text-left hover:bg-red-100/50 dark:hover:bg-red-900/20 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-500 rounded-lg shrink-0">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-xl text-red-900 dark:text-red-100">❌ What Doesn't Work</h3>
              </div>
              {whatDoesntWorkExpanded ? (
                <ChevronUp className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
              )}
            </div>
          </button>

          {whatDoesntWorkExpanded && (
            <div className="px-6 pb-6 animate-in fade-in duration-200">
              {/* Parse and format the what_doesnt_work content */}
              <div className="space-y-3.5">
                {script.what_doesnt_work.split('\n\n').map((paragraph, idx) => {
                  const trimmed = paragraph.trim();
                  
                  // Check if it's a "Why these backfire" summary paragraph
                  if (trimmed.startsWith('→ Why these backfire:')) {
                    const text = trimmed.replace('→ Why these backfire:', '').trim();
                    return (
                      <div key={idx} className="mt-4 pt-4 border-t-2 border-red-300/50 dark:border-red-700/50">
                        <p className="text-sm font-semibold text-red-900 dark:text-red-100 leading-relaxed">
                          {renderMarkdown(text)}
                        </p>
                      </div>
                    );
                  }
                  
                  if (trimmed.startsWith('**Why')) {
                    return (
                      <div key={idx} className="mt-4 pt-4 border-t-2 border-red-300/50 dark:border-red-700/50">
                        <p className="text-sm font-semibold text-red-900 dark:text-red-100 leading-relaxed">
                          {renderMarkdown(trimmed)}
                        </p>
                      </div>
                    );
                  }

                  // Check if it's a bullet point (starts with ❌ or •)
                  if (trimmed.startsWith('❌') || trimmed.startsWith('•')) {
                    const lines = paragraph.split('\n');
                    const mainText = lines[0].replace(/^[❌•]\s*/, '').trim();
                    const explanation = lines.slice(1).join(' ').replace('→', '').trim();

                    return (
                      <div key={idx} className="bg-white/60 dark:bg-slate-900/60 rounded-lg p-4 border border-red-200 dark:border-red-800 shadow-sm">
                        <div className="flex items-start gap-3 mb-2">
                          <span className="text-red-600 dark:text-red-400 text-xl shrink-0 mt-0.5">
                            {trimmed.startsWith('❌') ? '❌' : '•'}
                          </span>
                          <p className="text-base font-medium text-red-900 dark:text-red-100 leading-relaxed">
                            {renderMarkdown(mainText)}
                          </p>
                        </div>
                        {explanation && (
                          <p className="text-sm text-red-700 dark:text-red-300 ml-9 leading-relaxed italic">
                            {renderMarkdown(explanation)}
                          </p>
                        )}
                      </div>
                    );
                  }

                  // Regular paragraph
                  return (
                    <p key={idx} className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
                      {renderMarkdown(trimmed)}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <Separator className="my-8" />

      {/* 3. THE STRATEGY (Main Section) */}
      {strategySteps && strategySteps.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-500 rounded-lg">
              <Check className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-2xl text-green-900 dark:text-green-100">✅ The Strategy</h3>
          </div>

          {strategySteps.map((step) => {
            const isExpanded = expandedSteps.includes(step.step_number);
            const stepColors = [
              { bg: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30', border: 'border-violet-200 dark:border-violet-800', badge: 'bg-violet-600', text: 'text-violet-900 dark:text-violet-100', lightBg: 'bg-violet-50/50 dark:bg-violet-950/20' },
              { bg: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30', border: 'border-blue-200 dark:border-blue-800', badge: 'bg-blue-600', text: 'text-blue-900 dark:text-blue-100', lightBg: 'bg-blue-50/50 dark:bg-blue-950/20' },
              { bg: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30', border: 'border-emerald-200 dark:border-emerald-800', badge: 'bg-emerald-600', text: 'text-emerald-900 dark:text-emerald-100', lightBg: 'bg-emerald-50/50 dark:bg-emerald-950/20' },
            ];
            const color = stepColors[(step.step_number - 1) % stepColors.length];

            return (
              <div key={step.step_number} className="space-y-4">
                <button
                  onClick={() => toggleStep(step.step_number)}
                  className={`w-full bg-gradient-to-br ${color.bg} border-2 ${color.border} rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-left`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`${color.badge} text-white font-bold rounded-full w-12 h-12 flex items-center justify-center text-xl shrink-0 shadow-md`}>
                      {step.step_number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-xl font-bold ${color.text} leading-tight`}>[STEP {step.step_number}] {step.step_title}</h4>
                        {isExpanded ? (
                          <ChevronUp className={`w-6 h-6 ${color.text} shrink-0`} />
                        ) : (
                          <ChevronDown className={`w-6 h-6 ${color.text} shrink-0`} />
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className={`${color.lightBg} rounded-xl p-6 border ${color.border} animate-in fade-in duration-200`}>
                    <div className="space-y-5">
                      {/* Step Explanation - Simple and Clean */}
                      <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                          {renderMarkdown(step.step_explanation)}
                        </p>
                      </div>

                      {/* What to Say Examples */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <p className="text-sm font-bold text-green-700 dark:text-green-300 uppercase tracking-wide">What to say:</p>
                        </div>
                        <div className="space-y-3">
                          {step.what_to_say_examples && step.what_to_say_examples.map((example, idx) => (
                            <div key={idx} className="bg-white/80 dark:bg-slate-800/80 border-l-4 border-green-500 dark:border-green-400 rounded-r-lg p-4 shadow-sm">
                              <p className="text-base text-green-900 dark:text-green-100 leading-relaxed font-medium">
                                <span className="text-green-600 dark:text-green-400 mr-2">"</span>
                                {example}
                                <span className="text-green-600 dark:text-green-400 ml-1">"</span>
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Separator className="my-8" />

      {/* 4. WHY THIS WORKS (Expandable, Collapsed by Default) */}
      {script.why_this_works && (
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30 border border-purple-200 dark:border-purple-800 rounded-xl shadow-md overflow-hidden">
          <button
            onClick={() => setWhyThisWorksExpanded(!whyThisWorksExpanded)}
            className="w-full p-5 text-left hover:bg-purple-100/50 dark:hover:bg-purple-900/20 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shrink-0 shadow-md">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg text-purple-900 dark:text-purple-100">🧠 Why This Works (Science Behind It)</h3>
              </div>
              {whyThisWorksExpanded ? (
                <ChevronUp className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
              )}
            </div>
          </button>

          {whyThisWorksExpanded && (
            <div className="px-5 pb-5 animate-in fade-in duration-200 space-y-5">
              {script.why_this_works.split('\n\n').map((paragraph, idx) => {
                const trimmed = paragraph.trim();
                
                // Check for numbered list item: "1. **Title** = explanation"
                const numberedMatch = trimmed.match(/^(\d+)\.\s+\*\*(.+?)\*\*\s*[=:]\s*(.+)$/s);
                if (numberedMatch) {
                  const explanation = numberedMatch[3].trim();
                  // Split explanation by bullet points or numbered sub-items
                  const explanationParts = explanation.split(/\s*[•→]\s+/).filter(p => p.trim());
                  
                  return (
                    <div key={idx} className="bg-purple-50/50 dark:bg-purple-950/20 rounded-lg p-4 border border-purple-200/50 dark:border-purple-800/50">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="font-bold text-lg text-purple-600 dark:text-purple-400 shrink-0">
                          {numberedMatch[1]}.
                        </span>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-purple-900 dark:text-purple-100 mb-2">
                            {numberedMatch[2]}
                          </h4>
                          <div className="space-y-2">
                            {explanationParts.map((part, partIdx) => (
                              <p key={partIdx} className="text-sm leading-relaxed text-purple-800 dark:text-purple-200 pl-4">
                                {partIdx > 0 && <span className="text-purple-500 dark:text-purple-400 mr-2">•</span>}
                                {renderMarkdown(part.trim())}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Check for bullet point: "• text"
                if (trimmed.startsWith('•')) {
                  // Split long bullet text by sub-bullets or sentences
                  const bulletText = trimmed.substring(1).trim();
                  const sentences = bulletText.split(/\s*[→•]\s+/).filter(s => s.trim());
                  
                  if (sentences.length > 1) {
                    return (
                      <div key={idx} className="bg-purple-50/30 dark:bg-purple-950/10 rounded-lg p-3 border-l-4 border-purple-400 dark:border-purple-600">
                        <div className="space-y-2">
                          <p className="text-sm leading-relaxed text-purple-800 dark:text-purple-200 font-medium">
                            {renderMarkdown(sentences[0].trim())}
                          </p>
                          {sentences.slice(1).map((sentence, sIdx) => (
                            <p key={sIdx} className="text-sm leading-relaxed text-purple-700 dark:text-purple-300 pl-4">
                              <span className="text-purple-500 dark:text-purple-400 mr-2">→</span>
                              {renderMarkdown(sentence.trim())}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={idx} className="flex items-start gap-2 pl-2">
                      <span className="text-purple-600 dark:text-purple-400 shrink-0 mt-1">•</span>
                      <p className="text-sm leading-relaxed text-purple-800 dark:text-purple-200">
                        {renderMarkdown(bulletText)}
                      </p>
                    </div>
                  );
                }

                // Check if paragraph starts with **bold text:** (subtitle)
                const subtitleMatch = trimmed.match(/^\*\*(.+?)\*\*:(.*)$/s);
                if (subtitleMatch) {
                  const content = subtitleMatch[2].trim();
                  const contentParts = content ? content.split(/\s*[•→]\s+/).filter(p => p.trim()) : [];
                  
                  return (
                    <div key={idx} className="bg-purple-50/30 dark:bg-purple-950/10 rounded-lg p-4 border-l-4 border-purple-300 dark:border-purple-700">
                      <h4 className="text-base font-bold text-purple-900 dark:text-purple-100 mb-3">
                        {subtitleMatch[1]}
                      </h4>
                      {contentParts.length > 0 && (
                        <div className="space-y-2">
                          {contentParts.map((part, partIdx) => (
                            <p key={partIdx} className="text-sm leading-relaxed text-purple-800 dark:text-purple-200 pl-4">
                              {partIdx > 0 && <span className="text-purple-500 dark:text-purple-400 mr-2">•</span>}
                              {renderMarkdown(part.trim())}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // Regular paragraph with inline markdown - split if very long
                if (trimmed.length > 200) {
                  const sentences = trimmed.split(/\.\s+/).filter(s => s.trim());
                  if (sentences.length > 2) {
                    return (
                      <div key={idx} className="space-y-2 pl-2">
                        {sentences.map((sentence, sIdx) => (
                          <p key={sIdx} className="text-sm leading-relaxed text-purple-800 dark:text-purple-200">
                            {renderMarkdown(sentence.trim() + (sentence.endsWith('.') ? '' : '.'))}
                          </p>
                        ))}
                      </div>
                    );
                  }
                }
                
                // Regular short paragraph
                return (
                  <p key={idx} className="text-sm leading-relaxed text-purple-800 dark:text-purple-200 pl-2">
                    {renderMarkdown(trimmed)}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. WHAT TO EXPECT */}
      {whatToExpect && (
        <>
          <Separator className="my-8" />
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-amber-500 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-xl text-amber-900 dark:text-amber-100">⏱️ What to Expect</h3>
            </div>

            <div className="space-y-4">
              {/* First timeline field - check all variations */}
              {(whatToExpect.first_30_seconds || whatToExpect.first_few_days || whatToExpect.first_week || whatToExpect.first_5_minutes || whatToExpect.first_few_weeks) && (
                <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 backdrop-blur-sm border border-amber-200/50 dark:border-amber-700/50 shadow-sm">
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide mb-2">
                    {whatToExpect.first_30_seconds ? 'First 30 Seconds:' :
                     whatToExpect.first_5_minutes ? 'First 5 Minutes:' :
                     whatToExpect.first_few_days ? 'First Few Days:' :
                     whatToExpect.first_week ? 'First Week:' :
                     'First Few Weeks:'}
                  </p>
                  <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
                    {renderMarkdown(whatToExpect.first_30_seconds || whatToExpect.first_5_minutes || whatToExpect.first_few_days || whatToExpect.first_week || whatToExpect.first_few_weeks || '')}
                  </p>
                </div>
              )}

              {/* Middle timeline field - check all variations */}
              {(whatToExpect.by_90_seconds || whatToExpect.by_2_minutes || whatToExpect.by_3_minutes || whatToExpect.by_10_minutes || whatToExpect.by_week_2 || whatToExpect.by_week_3 || whatToExpect.by_2_months || whatToExpect.by_x_weeks) && (
                <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 backdrop-blur-sm border border-amber-200/50 dark:border-amber-700/50 shadow-sm">
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide mb-2">
                    {whatToExpect.by_90_seconds ? 'By 90 Seconds:' :
                     whatToExpect.by_2_minutes ? 'By 2 Minutes:' :
                     whatToExpect.by_3_minutes ? 'By 3 Minutes:' :
                     whatToExpect.by_10_minutes ? 'By 10 Minutes:' :
                     whatToExpect.by_week_2 ? 'By Week 2:' :
                     whatToExpect.by_week_3 ? 'By Week 3:' :
                     whatToExpect.by_2_months ? 'By 2 Months:' :
                     'By X Weeks:'}
                  </p>
                  <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
                    {renderMarkdown(whatToExpect.by_90_seconds || whatToExpect.by_2_minutes || whatToExpect.by_3_minutes || whatToExpect.by_10_minutes || whatToExpect.by_week_2 || whatToExpect.by_week_3 || whatToExpect.by_2_months || whatToExpect.by_x_weeks || '')}
                  </p>
                </div>
              )}

              <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4 border border-red-200 dark:border-red-800 shadow-sm">
                <p className="text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-wide mb-2">Don't Expect:</p>
                <ul className="space-y-1">
                  {whatToExpect.dont_expect && Array.isArray(whatToExpect.dont_expect) && whatToExpect.dont_expect.map((item, idx) => (
                    <li key={idx} className="text-sm text-red-800 dark:text-red-200 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>{renderMarkdown(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 rounded-lg p-4 border-2 border-green-400 dark:border-green-600 shadow-sm">
                <p className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wide mb-2">✅ This Is Success:</p>
                <p className="text-sm font-medium text-green-900 dark:text-green-100 leading-relaxed">
                  {renderMarkdown(whatToExpect.this_is_success || '')}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 6. COMMON VARIATIONS (Expandable, Collapsed by Default) */}
      {commonVariations && commonVariations.length > 0 && (
        <>
          <Separator className="my-8" />
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 border border-orange-200 dark:border-orange-800 rounded-xl shadow-md overflow-hidden">
            <button
              onClick={() => setVariationsExpanded(!variationsExpanded)}
              className="w-full p-5 text-left hover:bg-orange-100/50 dark:hover:bg-orange-900/20 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500 rounded-lg shrink-0">
                    <Wrench className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-orange-900 dark:text-orange-100">🔧 Common Variations (What if...?)</h3>
                </div>
                {variationsExpanded ? (
                  <ChevronUp className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" />
                )}
              </div>
            </button>

            {variationsExpanded && (
              <div className="px-5 pb-5 space-y-3 animate-in fade-in duration-200">
                {commonVariations.map((variation, idx) => (
                  <div key={idx} className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 backdrop-blur-sm border border-orange-200/50 dark:border-orange-700/50 shadow-sm">
                    <p className="text-sm font-bold text-orange-900 dark:text-orange-100 mb-2">
                      {renderMarkdown(variation.variation_scenario)}
                    </p>
                    <div className="flex items-start gap-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 rounded-lg p-3 border-l-4 border-green-500">
                      <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-green-900 dark:text-green-100 leading-relaxed">
                        "{renderMarkdown(variation.variation_response)}"
                      </p>
                    </div>
                    {variation.why_this_works && (
                      <div className="mt-3 pt-3 border-t border-orange-200/50 dark:border-orange-700/50">
                        <p className="text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide mb-1">
                          Why This Works:
                        </p>
                        <p className="text-sm text-orange-800 dark:text-orange-200 leading-relaxed">
                          {renderMarkdown(variation.why_this_works)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* PARENT STATE NEEDED */}
      {script.parent_state_needed && (
        <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 border border-slate-300 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">📍 Parent State Needed:</p>
          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            {renderMarkdown(script.parent_state_needed)}
          </p>
        </div>
      )}
    </div>
  );
};
