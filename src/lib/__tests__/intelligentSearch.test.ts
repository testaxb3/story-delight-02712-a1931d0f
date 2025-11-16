import { describe, it, expect } from 'vitest';
import { intelligentSearch, detectEmergency } from '../intelligentSearch';
import type { Database } from '@/integrations/supabase/types';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];

const mockScripts: ScriptRow[] = [
  {
    id: 'script-1',
    title: 'Bedtime Routine',
    category: 'sleep',
    profile: 'DEFIANT',
    created_at: '2023-01-01',
    the_situation: 'Child refuses to go to bed',
    tags: ['bedtime', 'sleep', 'routine'],
    phrase_1: null,
    phrase_2: null,
    phrase_3: null,
    age_range: null,
    why_this_works: null,
    what_to_expect: null,
    age_min: null,
    age_max: null,
    avoid_step1: null,
    avoid_step2: null,
    avoid_step3: null,
    backup_plan: null,
    common_mistakes: null,
    common_variations: null,
    difficulty: null,
    difficulty_level: null,
    duration_minutes: null,
    emergency_suitable: null,
    estimated_time_minutes: null,
    expected_time_seconds: null,
    intensity_level: null,
    location_type: null,
    neurological_tip: null,
    parent_state: null,
    parent_state_needed: null,
    pause_after_phrase_1: null,
    pause_after_phrase_2: null,
    phrase_1_action: null,
    phrase_2_action: null,
    phrase_3_action: null,
    related_script_ids: null,
    requires_preparation: null,
    say_it_like_this_step1: null,
    say_it_like_this_step2: null,
    say_it_like_this_step3: null,
    situation_trigger: null,
    strategy_steps: null,
    success_speed: null,
    time_optimal: null,
    what_doesnt_work: null,
    works_in_public: null,
    wrong_way: null,
  },
  {
    id: 'script-2',
    title: 'Meltdown Management',
    category: 'behavior',
    profile: 'INTENSE',
    created_at: '2023-01-02',
    the_situation: 'Child is having a meltdown',
    tags: ['meltdown', 'tantrum', 'emergency'],
    phrase_1: null,
    phrase_2: null,
    phrase_3: null,
    age_range: null,
    why_this_works: null,
    what_to_expect: null,
    age_min: null,
    age_max: null,
    avoid_step1: null,
    avoid_step2: null,
    avoid_step3: null,
    backup_plan: null,
    common_mistakes: null,
    common_variations: null,
    difficulty: null,
    difficulty_level: null,
    duration_minutes: null,
    emergency_suitable: null,
    estimated_time_minutes: null,
    expected_time_seconds: null,
    intensity_level: null,
    location_type: null,
    neurological_tip: null,
    parent_state: null,
    parent_state_needed: null,
    pause_after_phrase_1: null,
    pause_after_phrase_2: null,
    phrase_1_action: null,
    phrase_2_action: null,
    phrase_3_action: null,
    related_script_ids: null,
    requires_preparation: null,
    say_it_like_this_step1: null,
    say_it_like_this_step2: null,
    say_it_like_this_step3: null,
    situation_trigger: null,
    strategy_steps: null,
    success_speed: null,
    time_optimal: null,
    what_doesnt_work: null,
    works_in_public: null,
    wrong_way: null,
  },
];

describe('intelligentSearch', () => {
  it('should return all scripts when query is empty', () => {
    const result = intelligentSearch('', mockScripts);
    expect(result).toHaveLength(2);
  });

  it('should search by title', () => {
    const result = intelligentSearch('bedtime', mockScripts);
    expect(result.length).toBeGreaterThan(0);
    expect(result.some(s => s.title.toLowerCase().includes('bedtime'))).toBe(true);
  });

  it('should search by category', () => {
    const result = intelligentSearch('sleep', mockScripts);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should search by tags', () => {
    const result = intelligentSearch('meltdown', mockScripts);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should be case insensitive', () => {
    const result = intelligentSearch('BEDTIME', mockScripts);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should search by situation', () => {
    const result = intelligentSearch('refuses', mockScripts);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return empty array when no matches', () => {
    const result = intelligentSearch('nonexistentxyz123', mockScripts);
    expect(result).toHaveLength(0);
  });
});

describe('detectEmergency', () => {
  it('should detect emergency keywords', () => {
    expect(detectEmergency('help meltdown')).toBe(true);
    expect(detectEmergency('emergency tantrum')).toBe(true);
    expect(detectEmergency('sos behavior')).toBe(true);
  });

  it('should be case insensitive', () => {
    expect(detectEmergency('MELTDOWN')).toBe(true);
    expect(detectEmergency('Emergency')).toBe(true);
  });

  it('should return false for non-emergency queries', () => {
    expect(detectEmergency('bedtime')).toBe(false);
    expect(detectEmergency('routine')).toBe(false);
    expect(detectEmergency('')).toBe(false);
  });

  it('should handle partial matches', () => {
    expect(detectEmergency('having a meltdown right now')).toBe(true);
    expect(detectEmergency('need help urgently')).toBe(true);
  });
});
