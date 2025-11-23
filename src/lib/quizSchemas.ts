import { z } from 'zod';

// Child name validation
export const childNameSchema = z
  .string()
  .min(2, 'Nome muito curto (mínimo 2 caracteres)')
  .max(50, 'Nome muito longo (máximo 50 caracteres)')
  .regex(/^[\w\s\-']+$/, 'Caracteres inválidos. Use apenas letras, espaços, hífens e apóstrofos');

// Child age validation
export const childAgeSchema = z
  .number()
  .int('Idade deve ser um número inteiro')
  .min(1, 'Idade mínima é 1 ano')
  .max(18, 'Idade máxima é 18 anos');

// Parent goals validation
export const parentGoalsSchema = z
  .array(z.string())
  .min(1, 'Selecione pelo menos um objetivo');

// Challenge level validation
export const challengeLevelSchema = z
  .number()
  .int()
  .min(1)
  .max(10);

// Challenge duration validation
export const challengeDurationSchema = z
  .string()
  .min(1, 'Selecione uma duração');

// Result speed validation
export const resultSpeedSchema = z.enum(['slow', 'balanced', 'intensive']);

// Complete quiz submission schema
export const quizSubmissionSchema = z.object({
  childName: childNameSchema,
  childAge: childAgeSchema,
  parentGoals: parentGoalsSchema,
  challengeLevel: challengeLevelSchema,
  challengeDuration: challengeDurationSchema,
  triedApproaches: z.array(z.string()),
  resultSpeed: resultSpeedSchema,
  answers: z.record(z.string(), z.string()),
});

export type QuizSubmission = z.infer<typeof quizSubmissionSchema>;