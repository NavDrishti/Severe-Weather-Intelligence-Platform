import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import {
  SupportedLanguage,
  getDictionaryTranslation,
  translateDynamicText
} from '../services/translationService';
import { LanguageContext } from './languageContextDefinition';

const LANGUAGE_STORAGE_KEY = 'navdrishti-language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'hi' || saved === 'en') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      document.documentElement.setAttribute('lang', newLang);
    } catch {
      // ignore
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  }, [language, setLanguage]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = useCallback(
    (key: string, fallbackDefault?: string): string => {
      const translated = getDictionaryTranslation(key, language);
      if (translated !== key) {
        return translated;
      }
      return fallbackDefault || key;
    },
    [language]
  );

  const translateAsync = useCallback(
    async (text: string): Promise<string> => {
      if (language === 'en') return text;
      return translateDynamicText(text, 'hi', 'en');
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        translateAsync
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
