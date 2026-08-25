import React, { useState, useEffect } from 'react';
import { ClauseAnalysis, SupportedLanguage } from '../../types/contract';
import { RiskBadge } from '../common/RiskBadge';
import { SUPPORTED_LANGUAGES } from '../../data/riskCategories';
import { translateClauseExplanation } from '../../services/translationService';
import { useUITranslations } from '../../data/uiTranslations';
import { 
  Copy, 
  Check, 
  MessageSquare, 
  Sparkles, 
  Scale, 
  AlertTriangle, 
  ShieldAlert, 
  Info,
  Globe,
  Loader2
} from 'lucide-react';

interface ClauseDetailCardProps {
  clause: ClauseAnalysis | null;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onAskAI: (clause: ClauseAnalysis) => void;
}

export const ClauseDetailCard: React.FC<ClauseDetailCardProps> = ({
  clause,
  selectedLanguage,
  onLanguageChange,
  onAskAI
}) => {
  const t = useUITranslations(selectedLanguage);
  const [copied, setCopied] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState({
    plainExplanation: '',
    whyRisky: '',
    suggestedAlternative: ''
  });

  useEffect(() => {
    if (!clause) return;

    let isMounted = true;
    const fetchTranslation = async () => {
      setIsTranslating(true);
      try {
        const res = await translateClauseExplanation(clause, selectedLanguage);
        if (isMounted) {
          setTranslatedContent(res);
        }
      } catch (err) {
        if (isMounted) {
          setTranslatedContent({
            plainExplanation: clause.plainExplanation,
            whyRisky: clause.whyRisky,
            suggestedAlternative: clause.suggestedAlternative
          });
        }
      } finally {
        if (isMounted) setIsTranslating(false);
      }
    };

    fetchTranslation();

    return () => {
      isMounted = false;
    };
  }, [clause, selectedLanguage]);

  if (!clause) {
    return (
      <div className="relative overflow-hidden p-8 rounded-3xl liquid-glass-card text-center flex flex-col items-center justify-center min-h-[420px] text-slate-400 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent pointer-events-none" />
        <Scale size={40} className="mb-3 opacity-40 text-purple-600 dark:text-purple-400" />
        <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-[#8a99ad] max-w-xs leading-relaxed">
          Select any clause from the list on the left to inspect its risk breakdown and plain-English translation.
        </p>
      </div>
    );
  }

  const handleCopyAlternative = () => {
    const textToCopy = translatedContent.suggestedAlternative || clause.suggestedAlternative;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative overflow-hidden p-6 rounded-3xl liquid-glass-card shadow-2xl space-y-5 animate-fade-in">
      {/* Top Specular Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />

      {/* Header with Badges & Language Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-black text-purple-600 dark:text-purple-400 px-2.5 py-0.5 rounded-lg bg-purple-500/15 border border-purple-300/40">
            {clause.clauseNumber}
          </span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 px-2.5 py-0.5 rounded-lg liquid-glass">
            {clause.category}
          </span>
        </div>

        <RiskBadge level={clause.riskLevel} />
      </div>

      {/* 1. Original Text */}
      <div className="space-y-1.5">
        <label className="text-[11px] uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5">
          <Info size={13} className="text-slate-400" />
          <span>{t('original_legal_text')}</span>
        </label>
        <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-[#070b14]/70 border border-slate-200/80 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono">
          {clause.originalText}
        </div>
      </div>

      {/* 2. Plain Language Explanation */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] uppercase font-black tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>{t('plain_english')}</span>
          </label>
          {isTranslating && (
            <span className="text-[10px] text-purple-600 flex items-center gap-1">
              <Loader2 size={11} className="animate-spin" />
              <span>Translating...</span>
            </span>
          )}
        </div>
        <div className="p-4 rounded-2xl liquid-glass border border-purple-200/60 dark:border-purple-800/40 text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-semibold">
          {translatedContent.plainExplanation || clause.plainExplanation}
        </div>
      </div>

      {/* 3. Why It's Risky */}
      <div className="space-y-1.5">
        <label className="text-[11px] uppercase font-black tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
          <AlertTriangle size={13} />
          <span>{t('why_risky')}</span>
        </label>
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-300/60 dark:border-rose-800/60 text-xs text-rose-900 dark:text-rose-200 leading-relaxed font-medium">
          {translatedContent.whyRisky || clause.whyRisky}
        </div>
      </div>

      {/* 4. Suggested Counter-Alternative */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] uppercase font-black tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Scale size={13} />
            <span>{t('suggested_counter')}</span>
          </label>
          <button
            onClick={handleCopyAlternative}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-500" />
                <span className="text-emerald-500">{t('copied')}</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>{t('copy_clause')}</span>
              </>
            )}
          </button>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-300/60 dark:border-emerald-800/60 text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 leading-relaxed font-mono">
          {translatedContent.suggestedAlternative || clause.suggestedAlternative}
        </div>
      </div>

      {/* 5. Action Buttons */}
      <div className="pt-2">
        <button
          onClick={() => onAskAI(clause)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <MessageSquare size={15} />
          <span>Ask AI About This Clause</span>
        </button>
      </div>
    </div>
  );
};
export default ClauseDetailCard;
