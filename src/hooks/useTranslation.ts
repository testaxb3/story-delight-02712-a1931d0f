import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { en, TranslationKeys } from '@/lib/translations/en';
import { pt } from '@/lib/translations/pt';

type Language = 'en' | 'pt';

interface TranslationStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const translations: Record<Language, TranslationKeys> = {
  en,
  pt,
};

export const useTranslation = create<TranslationStore>()(
  persist(
    (set, get) => ({
      language: 'pt', // Default to Portuguese
      setLanguage: (lang: Language) => set({ language: lang, t: translations[lang] }),
      t: translations['pt'],
    }),
    {
      name: 'nep-language',
      onRehydrateStorage: () => (state) => {
        // Update translations after rehydration
        if (state) {
          state.t = translations[state.language];
        }
      },
    }
  )
);

/**
 * Simple helper to get nested translation keys
 * Usage: t.common.loading, t.auth.errors.invalidCredentials
 */
export const t = () => useTranslation.getState().t;
