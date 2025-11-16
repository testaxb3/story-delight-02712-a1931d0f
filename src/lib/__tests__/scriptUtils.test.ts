import { describe, it, expect } from 'vitest';
import { formatCategory, CATEGORY_EMOJIS, convertToScriptItem } from '../scriptUtils';
import type { Database } from '@/integrations/supabase/types';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];

describe('scriptUtils', () => {
  describe('formatCategory', () => {
    it('should format category with emoji', () => {
      const result = formatCategory('sleep');
      expect(result).toContain('😴');
      expect(result).toContain('Sleep');
    });

    it('should handle unknown categories', () => {
      const result = formatCategory('unknown');
      expect(result).toContain('📚');
      expect(result).toContain('Unknown');
    });

    it('should capitalize first letter', () => {
      const result = formatCategory('behavior');
      expect(result).toMatch(/^[📚]\s+[A-Z]/);
    });
  });

  describe('CATEGORY_EMOJIS', () => {
    it('should contain sleep emoji', () => {
      expect(CATEGORY_EMOJIS.sleep).toBe('😴');
    });

    it('should contain behavior emoji', () => {
      expect(CATEGORY_EMOJIS.behavior).toBe('🎭');
    });

    it('should have default emoji', () => {
      expect(CATEGORY_EMOJIS.default).toBe('📚');
    });
  });

  describe('convertToScriptItem', () => {
    it('should convert script row to script item', () => {
      const mockScript: ScriptRow = {
        id: 'script-1',
        title: 'Test Script',
        category: 'sleep',
        profile: 'DEFIANT',
        created_at: '2023-01-01',
        phrase_1: 'Test phrase 1',
        phrase_2: 'Test phrase 2',
        phrase_3: 'Test phrase 3',
        age_range: '3-5',
        the_situation: 'Test situation',
        why_this_works: 'Test reason',
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
        tags: null,
        time_optimal: null,
        what_doesnt_work: null,
        works_in_public: null,
        wrong_way: null,
      };

      const result = convertToScriptItem(mockScript);

      expect(result.id).toBe('script-1');
      expect(result.title).toBe('Test Script');
      expect(result.category).toBe('sleep');
      expect(result.brainType).toBe('DEFIANT');
    });

    it('should handle optional fields', () => {
      const mockScript: ScriptRow = {
        id: 'script-2',
        title: 'Minimal Script',
        category: 'behavior',
        created_at: '2023-01-01',
        profile: null,
        phrase_1: null,
        phrase_2: null,
        phrase_3: null,
        age_range: null,
        the_situation: null,
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
        tags: null,
        time_optimal: null,
        what_doesnt_work: null,
        works_in_public: null,
        wrong_way: null,
      };

      const result = convertToScriptItem(mockScript);

      expect(result.id).toBe('script-2');
      expect(result.brainType).toBeUndefined();
    });
  });
});
