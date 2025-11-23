import { useMemo, useCallback } from 'react';
import { z } from 'zod';
import type { QuizStep } from './useQuizState';

// Zod schemas for validation
export const childNameSchema = z
  .string()
  .min(2, 'Nome muito curto (mínimo 2 caracteres)')
  .max(50, 'Nome muito longo (máximo 50 caracteres)')
  .regex(/^[\w\s\-']+$/, 'Caracteres inválidos. Use apenas letras, espaços, hífens e apóstrofos');

export const childAgeSchema = z
  .number()
  .int('Idade deve ser um número inteiro')
  .min(1, 'Idade mínima é 1 ano')
  .max(18, 'Idade máxima é 18 anos');

export const parentGoalsSchema = z
  .array(z.string())
  .min(1, 'Selecione pelo menos um objetivo');

export const challengeLevelSchema = z
  .number()
  .int()
  .min(1)
  .max(10);

export const challengeDurationSchema = z
  .string()
  .min(1, 'Selecione uma duração');

// Sanitization function
export const sanitizeChildName = (name: string): string => {
  return name
    .trim()
    .replace(/[<>]/g, '')
    .replace(/[^\w\s\-']/g, '')
    .substring(0, 50);
};

interface UseQuizValidationProps {
  childName: string;
  childAge: number;
  parentGoals: string[];
  challengeDuration: string;
  currentAnswer?: string;
  quizStep: QuizStep;
}

export function useQuizValidation({
  childName,
  childAge,
  parentGoals,
  challengeDuration,
  currentAnswer,
  quizStep,
}: UseQuizValidationProps) {
  // Validate child name
  const nameValidation = useMemo(() => {
    try {
      childNameSchema.parse(childName);
      return { isValid: true, error: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0].message };
      }
      return { isValid: false, error: 'Nome inválido' };
    }
  }, [childName]);

  // Validate child age
  const ageValidation = useMemo(() => {
    try {
      childAgeSchema.parse(childAge);
      return { isValid: true, error: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0].message };
      }
      return { isValid: false, error: 'Idade inválida' };
    }
  }, [childAge]);

  // Validate parent goals
  const goalsValidation = useMemo(() => {
    try {
      parentGoalsSchema.parse(parentGoals);
      return { isValid: true, error: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0].message };
      }
      return { isValid: false, error: 'Objetivos inválidos' };
    }
  }, [parentGoals]);

  // Validate challenge duration
  const durationValidation = useMemo(() => {
    try {
      challengeDurationSchema.parse(challengeDuration);
      return { isValid: true, error: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0].message };
      }
      return { isValid: false, error: 'Duração inválida' };
    }
  }, [challengeDuration]);

  // Check if can proceed based on current step
  const canProceed = useMemo(() => {
    switch (quizStep) {
      case 'name':
        return nameValidation.isValid;
      case 'details':
        return ageValidation.isValid;
      case 'goals':
        return goalsValidation.isValid;
      case 'speed':
        return true;
      case 'challenge':
        return durationValidation.isValid;
      case 'questions':
        return currentAnswer !== undefined;
      default:
        return false;
    }
  }, [quizStep, nameValidation, ageValidation, goalsValidation, durationValidation, currentAnswer]);

  // Get validation error for current step
  const currentStepError = useMemo(() => {
    switch (quizStep) {
      case 'name':
        return nameValidation.error;
      case 'details':
        return ageValidation.error;
      case 'goals':
        return goalsValidation.error;
      case 'challenge':
        return durationValidation.error;
      default:
        return null;
    }
  }, [quizStep, nameValidation, ageValidation, goalsValidation, durationValidation]);

  // Sanitize name callback
  const sanitizeName = useCallback(() => {
    return sanitizeChildName(childName);
  }, [childName]);

  return {
    nameValidation,
    ageValidation,
    goalsValidation,
    durationValidation,
    canProceed,
    currentStepError,
    sanitizeName,
  };
}