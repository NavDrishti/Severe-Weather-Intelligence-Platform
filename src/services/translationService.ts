// =====================================================================
// NavDrishti AI: Bilingual Translation & Open-Source/Gemini API Engine
// Supports instant dictionary + Open-Source MyMemory & Gemini 1.5 APIs
// =====================================================================

export type SupportedLanguage = 'en' | 'hi';

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    hi: string;
  };
}

// Built-in meteorological & UI dictionary for zero-latency instant rendering
export const DICTIONARY: TranslationDictionary = {
  // Navigation Links
  'nav.overview': { en: 'Overview', hi: 'अवलोकन' },
  'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
  'nav.liveMap': { en: 'Live GIS Map', hi: 'लाइव जीआईएस मानचित्र' },
  'nav.forecast': { en: 'Forecast', hi: 'पूर्वानुमान' },
  'nav.storms': { en: 'Active Storms', hi: 'सक्रिय तूफान' },
  'nav.alerts': { en: 'Alert Centre', hi: 'चेतावनी केंद्र' },
  'nav.locations': { en: 'Locations', hi: 'स्थान' },
  'nav.replay': { en: 'Case Replay', hi: 'घटना रीप्ले' },
  'nav.analytics': { en: 'Verification', hi: 'सत्यापन' },
  'nav.dataHealth': { en: 'Data Health', hi: 'डेटा स्थिति' },
  'nav.about': { en: 'Methodology', hi: 'कार्यप्रणाली' },
  'nav.help': { en: 'Help & Safety', hi: 'सहायता एवं सुरक्षा' },
  'nav.admin': { en: 'Admin', hi: 'व्यवस्थापक' },

  // Government & Header Strip
  'header.govTitle': {
    en: 'Government of India — Disaster Management Decision Support',
    hi: 'भारत सरकार — आपदा प्रबंधन निर्णय सहयोग प्रणाली'
  },
  'header.sihTag': {
    en: 'SIH PS 26084: Convective-Scale Nowcasting (0–6 hr)',
    hi: 'एसआईएच पीएस 26084: संवहनी मौसम अब-कास्टिंग (0–6 घंटे)'
  },
  'header.releaseTag': {
    en: 'Research & Prototype Release v1.4',
    hi: 'अनुसंधान एवं प्रोटोटाइप संस्करण 1.4'
  },
  'header.brandTitle': {
    en: 'NavDrishti AI',
    hi: 'नवदृष्टि एआई'
  },
  'header.brandSubtitle': {
    en: 'Severe Weather Intelligence Platform',
    hi: 'तीव्र मौसम आसूचना मंच'
  },
  'header.systemHealth': {
    en: 'System Health',
    hi: 'प्रणाली स्वास्थ्य'
  },
  'header.allOperational': {
    en: 'All Systems Operational',
    hi: 'सभी प्रणालियाँ सक्रिय हैं'
  },
  'header.lightMode': {
    en: 'Light Mode',
    hi: 'लाइट मोड'
  },
  'header.darkMode': {
    en: 'Dark Mode',
    hi: 'डार्क मोड'
  },
  'header.language': {
    en: 'Language',
    hi: 'भाषा'
  },

  // Disclaimer
  'disclaimer.bold': {
    en: 'Demonstration data — Not an official warning.',
    hi: 'प्रदर्शन डेटा — आधिकारिक चेतावनी नहीं।'
  },
  'disclaimer.body': {
    en: 'Forecasts are AI-assisted probabilistic decision support and do not replace statutory advisories issued by IMD or disaster management authorities.',
    hi: 'पूर्वानुमान एआई-सहायता प्राप्त संभाव्य निर्णय समर्थन हैं और आईएमडी या आपदा प्रबंधन प्राधिकरणों द्वारा जारी वैधानिक सलाह का स्थान नहीं लेते हैं।'
  },

  // Hazard Types
  'hazard.all': { en: 'All Hazards', hi: 'सभी खतरे' },
  'hazard.lightning': { en: 'Lightning', hi: 'आकाशीय बिजली' },
  'hazard.cloudburst': { en: 'Cloudburst', hi: 'बादल फटना' },
  'hazard.hail': { en: 'Hailstorm', hi: 'ओलावृष्टि' },
  'hazard.downburst': { en: 'Downburst & Squall', hi: 'तेज आंधी एवं डाउनबर्स्ट' },

  // Risk Levels
  'risk.all': { en: 'All Levels', hi: 'सभी स्तर' },
  'risk.very_high': { en: 'Very High', hi: 'अति उच्च' },
  'risk.high': { en: 'High', hi: 'उच्च' },
  'risk.medium': { en: 'Medium', hi: 'मध्यम' },
  'risk.low': { en: 'Low', hi: 'निम्न' },

  // Common Actions
  'action.reset': { en: 'Reset', hi: 'रीसेट' },
  'action.filter': { en: 'Filters', hi: 'फ़िल्टर' },
  'action.refresh': { en: 'Refresh', hi: 'ताज़ा करें' },
  'action.search': { en: 'Search', hi: 'खोजें' },
  'action.cancel': { en: 'Cancel', hi: 'रद्द करें' },
  'action.apply': { en: 'Apply', hi: 'लागू करें' },
  'action.close': { en: 'Close', hi: 'बंद करें' },
  'action.open': { en: 'Open', hi: 'खोलें' },
  'action.launch': { en: 'Launch', hi: 'आरंभ करें' },
  'action.review': { en: 'Review', hi: 'समीक्षा' },

  // Dashboard & Overview
  'dash.title': {
    en: 'Convective Weather Nowcasting Console',
    hi: 'संवहनी मौसम अब-कास्टिंग कंसोल'
  },
  'dash.subtitle': {
    en: 'Fused Doppler Radar, INSAT-3DS Rapid Scan, Ground Lightning & Surface AWS (0–6 Hours Horizon)',
    hi: 'संलयित डॉपलर रडार, इनसैट-3डीएस रैपिड स्कैन, ग्राउंड लाइटनिंग एवं सतही एडब्ल्यूएस (0–6 घंटे का क्षितिज)'
  },
  'dash.activeCells': {
    en: 'Active Convective Storms',
    hi: 'सक्रिय संवहनी तूफान'
  },
  'dash.severeAlerts': {
    en: 'Severe Weather Alerts',
    hi: 'तीव्र मौसम चेतावनियाँ'
  },
  'dash.pipelineCadence': {
    en: 'Pipeline Cadence',
    hi: 'पाइपलाइन गति'
  },
  'dash.estConfidence': {
    en: 'Estimated Confidence',
    hi: 'अनुमानित विश्वसनीयता'
  }
};

// In-memory cache to avoid duplicate network requests
const translationCache = new Map<string, string>();

/**
 * Get instant translation for a registered dictionary key.
 * Falls back to English text if key or translation is missing.
 */
export function getDictionaryTranslation(key: string, lang: SupportedLanguage): string {
  const item = DICTIONARY[key];
  if (!item) return key;
  return item[lang] || item.en || key;
}

/**
 * Dynamic translator utilizing Google Gemini API or free open-source MyMemory API.
 * Automatically caches results in memory and LocalStorage.
 */
export async function translateDynamicText(
  text: string,
  targetLang: SupportedLanguage,
  sourceLang: SupportedLanguage = 'en'
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed || targetLang === sourceLang) return trimmed;

  const cacheKey = `${sourceLang}->${targetLang}:${trimmed}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  // Check LocalStorage cache
  try {
    const stored = localStorage.getItem(`trans_${cacheKey}`);
    if (stored) {
      translationCache.set(cacheKey, stored);
      return stored;
    }
  } catch {
    // ignore storage access errors
  }

  // 1. Try Gemini API if an API key is available in environment or local storage
  const geminiApiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || localStorage.getItem('navdrishti_gemini_api_key');
  if (geminiApiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a real-time meteorological translator. Translate the following short text to ${
                      targetLang === 'hi' ? 'Hindi (Devanagari script)' : 'English'
                    }. Output ONLY the direct translated string without quotes or preamble:\n\n${trimmed}`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 150
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (translated) {
          translationCache.set(cacheKey, translated);
          try {
            localStorage.setItem(`trans_${cacheKey}`, translated);
          } catch {
            // ignore
          }
          return translated;
        }
      }
    } catch {
      // Fallback to open-source API below
    }
  }

  // 2. Open-Source MyMemory Translation API fallback (Free, no API key required)
  try {
    const pair = `${sourceLang}|${targetLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${pair}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data?.responseData?.translatedText) {
        const translated = data.responseData.translatedText.trim();
        translationCache.set(cacheKey, translated);
        try {
          localStorage.setItem(`trans_${cacheKey}`, translated);
        } catch {
          // ignore
        }
        return translated;
      }
    }
  } catch {
    // Network offline or CORS fallback
  }

  // Return original text if dynamic services are unavailable
  return trimmed;
}
