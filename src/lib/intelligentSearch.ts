import type { Database } from '@/integrations/supabase/types';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];

// Comprehensive problem synonyms mapping
const PROBLEM_SYNONYMS: Record<string, string[]> = {
  // Mealtime issues
  wont_eat: [
    "won't eat",
    "refuses food",
    "picky eater",
    "doesn't want to eat",
    'pushes plate away',
    'only wants snacks',
    "won't try new foods",
    'food refusal',
    'selective eating',
  ],
  throws_food: [
    'throws food',
    'tosses food',
    'makes mess',
    'plays with food',
    'spills intentionally',
    'food throwing',
  ],
  wont_sit: [
    "won't sit",
    'runs from table',
    "won't stay seated",
    'leaves table',
    'gets up constantly',
  ],

  // Bedtime issues
  wont_sleep: [
    "won't sleep",
    "won't go to bed",
    'keeps getting up',
    'not tired',
    'wants one more story',
    'scared of dark',
    'bedtime resistance',
    'sleep refusal',
  ],

  // Transitions
  wont_leave: [
    "won't leave",
    "won't stop playing",
    'ignores me',
    'one more minute',
    'having too much fun',
    'not ready to go',
    'transition difficulty',
    'leaving resistance',
  ],
  wont_get_ready: [
    "won't get dressed",
    "won't put shoes on",
    'refuses to get ready',
    'morning struggle',
    "won't cooperate",
  ],

  // Car seat / transportation
  car_seat: [
    "won't get in car seat",
    'car seat refusal',
    'fights car seat',
    'screams in car',
    'hates car seat',
    'car tantrum',
  ],

  // Screen time
  screen_tantrum: [
    "won't turn off tablet",
    "won't stop watching",
    'screen time battle',
    'device meltdown',
    'ipad tantrum',
    'youtube rage',
    'tv tantrum',
  ],

  // Tantrums / meltdowns
  public_meltdown: [
    'tantrum in store',
    'meltdown at store',
    'public tantrum',
    'screaming in public',
    'embarrassing meltdown',
    'grocery store tantrum',
    'restaurant meltdown',
  ],
  hitting: ['hits sibling', 'hitting', 'aggressive', 'punching', 'attacking', 'violence'],
  screaming: ['screaming', 'shrieking', 'yelling', 'loud', 'ear-piercing'],

  // Hygiene
  wont_brush_teeth: [
    "won't brush teeth",
    'teeth brushing fight',
    'refuses brushing',
    'hygiene battle',
    'toothbrush refusal',
  ],
  wont_bathe: ["won't take bath", 'bath refusal', 'hates bath', "won't shower", 'hygiene refusal'],

  // Homework / school
  homework_battle: [
    "won't do homework",
    'homework refusal',
    'school work fight',
    'refuses to study',
    'homework meltdown',
  ],

  // Sibling conflicts
  sibling_fighting: [
    'fighting with sibling',
    'sibling rivalry',
    'kids fighting',
    'brother sister fight',
    'constant fighting',
  ],
};

// Context keywords for understanding situation urgency and intensity
const CONTEXT_KEYWORDS = {
  urgency: ['late', 'rushed', 'hurry', 'now', 'quick', 'running late', 'already late', 'emergency'],
  intensity: [
    'screaming',
    'meltdown',
    'tantrum',
    'hitting',
    'violent',
    'explosive',
    'major',
    'severe',
    'out of control',
  ],
  location: [
    'public',
    'store',
    'car',
    'restaurant',
    'school',
    'playground',
    'grocery',
    'mall',
    'church',
    'doctor',
  ],
  frequency: [
    'again',
    'every time',
    'always',
    'third time today',
    'daily',
    'constantly',
    'repeatedly',
  ],
  parent_state: [
    'frustrated',
    'exhausted',
    'tired',
    "can't take it",
    'at my limit',
    'losing it',
    'angry',
    'embarrassed',
  ],
};

interface SearchContext {
  isUrgent: boolean;
  isIntense: boolean;
  isPublic: boolean;
  isRepeat: boolean;
  parentFrustrated: boolean;
  matchedProblem: string | null;
}

/**
 * Extracts context from search query
 */
function extractContext(query: string): SearchContext {
  const lowerQuery = query.toLowerCase();

  return {
    isUrgent: CONTEXT_KEYWORDS.urgency.some((k) => lowerQuery.includes(k)),
    isIntense: CONTEXT_KEYWORDS.intensity.some((k) => lowerQuery.includes(k)),
    isPublic: CONTEXT_KEYWORDS.location.some((k) => lowerQuery.includes(k)),
    isRepeat: CONTEXT_KEYWORDS.frequency.some((k) => lowerQuery.includes(k)),
    parentFrustrated: CONTEXT_KEYWORDS.parent_state.some((k) => lowerQuery.includes(k)),
    matchedProblem: null,
  };
}

/**
 * Finds matching problem type from query
 */
function findProblemType(query: string): string | null {
  const lowerQuery = query.toLowerCase();

  for (const [problem, synonyms] of Object.entries(PROBLEM_SYNONYMS)) {
    if (synonyms.some((syn) => lowerQuery.includes(syn.toLowerCase()))) {
      return problem;
    }
  }

  return null;
}

interface ScoredScript {
  script: ScriptRow;
  score: number;
  matchReasons: string[];
}

/**
 * Intelligent search that understands context and parent state
 */
export function intelligentSearch(query: string, scripts: ScriptRow[]): ScriptRow[] {
  if (!query.trim()) {
    return scripts;
  }

  const lowerQuery = query.toLowerCase();
  const context = extractContext(lowerQuery);
  const matchedProblem = findProblemType(lowerQuery);

  // Score each script
  const scored: ScoredScript[] = scripts.map((script) => {
    let score = 0;
    const matchReasons: string[] = [];

    // Basic text match - Title
    if (script.title.toLowerCase().includes(lowerQuery)) {
      score += 15;
      matchReasons.push('title match');
    }

    // Situation trigger match (high value)
    if (script.situation_trigger && script.situation_trigger.toLowerCase().includes(lowerQuery)) {
      score += 25;
      matchReasons.push('situation match');
    }

    // Category match
    if (script.category.toLowerCase().replace(/_/g, ' ').includes(lowerQuery)) {
      score += 10;
      matchReasons.push('category match');
    }

    // Tags match
    if (script.tags && script.tags.some((tag) => lowerQuery.includes(tag.toLowerCase()))) {
      score += 8;
      matchReasons.push('tag match');
    }

    // Problem type match
    if (matchedProblem) {
      // Check if script tags or category relate to problem
      const problemInTags = script.tags?.some((tag) =>
        tag.toLowerCase().includes(matchedProblem.replace(/_/g, ' ')),
      );
      const problemInCategory = script.category
        .toLowerCase()
        .includes(matchedProblem.replace(/_/g, ' '));

      if (problemInTags || problemInCategory) {
        score += 20;
        matchReasons.push('problem type match');
      }
    }

    // Context-based scoring

    // URGENCY: Need fast scripts
    if (context.isUrgent) {
      if (script.expected_time_seconds && script.expected_time_seconds <= 60) {
        score += 15;
        matchReasons.push('fast execution');
      }
      if (script.emergency_suitable) {
        score += 20;
        matchReasons.push('emergency suitable');
      }
    }

    // INTENSITY: Need scripts for severe situations
    if (context.isIntense) {
      if (script.intensity_level === 'severe') {
        score += 20;
        matchReasons.push('handles severe intensity');
      } else if (script.intensity_level === 'moderate') {
        score += 10;
      }
    }

    // PUBLIC: Need scripts that work in public
    if (context.isPublic) {
      if (script.location_type && script.location_type.includes('public')) {
        score += 15;
        matchReasons.push('works in public');
      }
      if (script.works_in_public) {
        score += 10;
      }
    }

    // PARENT FRUSTRATED: Need scripts that work when parent is stressed
    if (context.parentFrustrated) {
      if (script.parent_state && script.parent_state.includes('frustrated')) {
        score += 20;
        matchReasons.push('works when frustrated');
      }
      if (script.parent_state && script.parent_state.includes('exhausted')) {
        score += 15;
      }
      if (script.emergency_suitable) {
        score += 10;
      }
    }

    // REPEAT ISSUE: Prioritize scripts user hasn't overused
    if (context.isRepeat) {
      // This could be enhanced with usage history
      score += 5;
    }

    return { script, score, matchReasons };
  });

  // Filter scripts with score > 0 and sort by score
  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      // Primary sort by score
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // Secondary sort by emergency suitable (for ties)
      if (a.script.emergency_suitable && !b.script.emergency_suitable) {
        return -1;
      }
      if (!a.script.emergency_suitable && b.script.emergency_suitable) {
        return 1;
      }
      // Tertiary sort by expected time (faster first)
      const aTime = a.script.expected_time_seconds || 999;
      const bTime = b.script.expected_time_seconds || 999;
      return aTime - bTime;
    })
    .map((item) => item.script);
}

/**
 * Get search suggestions based on partial query
 */
export function getSearchSuggestions(query: string): string[] {
  if (!query || query.length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  const suggestions: string[] = [];

  // Search through problem synonyms
  for (const synonyms of Object.values(PROBLEM_SYNONYMS)) {
    for (const synonym of synonyms) {
      if (synonym.toLowerCase().includes(lowerQuery) && !suggestions.includes(synonym)) {
        suggestions.push(synonym);
      }
    }
  }

  return suggestions.slice(0, 5);
}

/**
 * Detects if user is in emergency/SOS situation based on search query
 */
export function detectEmergency(query: string): boolean {
  const lowerQuery = query.toLowerCase();

  const emergencyKeywords = [
    'emergency',
    'help',
    'crisis',
    'sos',
    'desperate',
    'screaming',
    'hitting',
    'meltdown',
    'out of control',
    'violent',
    'major tantrum',
    'public meltdown',
    'explosive',
  ];

  return emergencyKeywords.some((keyword) => lowerQuery.includes(keyword));
}
