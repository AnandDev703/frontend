import { ClauseAnalysis, SupportedLanguage, ContractAnalysis } from '../types/contract';

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  ta: 'Tamil',
  hi: 'Hindi',
  te: 'Telugu',
  ml: 'Malayalam'
};

const translationCache = new Map<string, { plainExplanation: string; whyRisky: string; suggestedAlternative: string }>();
const genericTextCache = new Map<string, string>();
const beforeYouSignCache = new Map<string, string[]>();

export async function translateClauseExplanation(
  clause: ClauseAnalysis,
  targetLang: SupportedLanguage
): Promise<{ plainExplanation: string; whyRisky: string; suggestedAlternative: string }> {
  if (targetLang === 'en') {
    return {
      plainExplanation: clause.plainExplanation,
      whyRisky: clause.whyRisky,
      suggestedAlternative: clause.suggestedAlternative
    };
  }

  // Check pre-computed translation in clause data
  if (clause.translations && clause.translations[targetLang]) {
    return clause.translations[targetLang];
  }

  // Check cache
  const cacheKey = `${clause.clauseNumber}-${clause.riskScore}-${targetLang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  return {
    plainExplanation: clause.plainExplanation,
    whyRisky: clause.whyRisky,
    suggestedAlternative: clause.suggestedAlternative
  };
}

export async function translateBeforeYouSign(
  contract: ContractAnalysis,
  targetLang: SupportedLanguage
): Promise<string[]> {
  if (targetLang === 'en' || !contract.beforeYouSign || contract.beforeYouSign.length === 0) {
    return contract.beforeYouSign || [];
  }

  // Pre-computed translations in demo contract
  if (contract.beforeYouSignTranslations && contract.beforeYouSignTranslations[targetLang]) {
    return contract.beforeYouSignTranslations[targetLang];
  }

  const cacheKey = `${contract.id}-before-sign-${targetLang}`;
  if (beforeYouSignCache.has(cacheKey)) {
    return beforeYouSignCache.get(cacheKey)!;
  }

  return contract.beforeYouSign;
}

export async function translateText(
  text: string,
  targetLang: SupportedLanguage
): Promise<string> {
  if (targetLang === 'en' || !text) return text;

  const cacheKey = `${text.slice(0, 40)}-${targetLang}`;
  if (genericTextCache.has(cacheKey)) {
    return genericTextCache.get(cacheKey)!;
  }

  return text;
}
