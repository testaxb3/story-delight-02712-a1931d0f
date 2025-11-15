import { describe, it, expect } from 'vitest';
import { quizQuestions, calculateBrainProfile } from '../lib/quizQuestions';

describe('Quiz Questions', () => {
  describe('quiz structure', () => {
    it('should have 20 questions', () => {
      expect(quizQuestions).toHaveLength(20);
    });

    it('should have valid question structure', () => {
      quizQuestions.forEach((question, index) => {
        expect(question.question, `Question ${index + 1} should have text`).toBeTruthy();
        expect(question.options).toBeDefined();
        expect(question.options.length).toBe(4);
      });
    });

    it('should have valid score values', () => {
      quizQuestions.forEach((question) => {
        question.options.forEach((option) => {
          Object.values(option.scores).forEach((score) => {
            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(4);
          });
        });
      });
    });
  });

  describe('calculateBrainProfile', () => {
    it('should calculate INTENSE profile correctly', () => {
      const answers: Record<number, string> = {};
      for (let i = 0; i < 20; i++) answers[i] = 'A';
      
      const result = calculateBrainProfile(answers);
      expect(result.type).toBe('INTENSE');
      expect(result.score).toBeGreaterThan(0);
    });

    it('should calculate DISTRACTED profile correctly', () => {
      const answers: Record<number, string> = {};
      for (let i = 0; i < 20; i++) answers[i] = 'B';
      
      const result = calculateBrainProfile(answers);
      expect(result.type).toBe('DISTRACTED');
      expect(result.score).toBeGreaterThan(0);
    });

    it('should calculate DEFIANT profile correctly', () => {
      const answers: Record<number, string> = {};
      for (let i = 0; i < 20; i++) answers[i] = 'C';
      
      const result = calculateBrainProfile(answers);
      expect(result.type).toBe('DEFIANT');
      expect(result.score).toBeGreaterThan(0);
    });

    it('should include confidence level', () => {
      const answers: Record<number, string> = {};
      for (let i = 0; i < 20; i++) answers[i] = 'A';
      
      const result = calculateBrainProfile(answers);
      expect(['high', 'medium', 'low']).toContain(result.confidence);
    });

    it('should return default INTENSE for empty answers', () => {
      const result = calculateBrainProfile({});
      expect(result.type).toBe('INTENSE');
    });
  });
});
