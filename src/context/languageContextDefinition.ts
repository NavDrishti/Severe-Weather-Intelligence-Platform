import { createContext } from 'react';
import { SupportedLanguage } from '../services/translationService';

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  t: (key: string, fallbackDefault?: string) => string;
  translateAsync: (text: string) => Promise<string>;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
