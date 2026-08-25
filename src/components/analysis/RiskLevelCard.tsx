import React, { useState, useEffect } from 'react';
import { ClauseAnalysis, RiskLevel } from '../../types/contract';
import { useContract } from '../../context/ContractContext';
import { useUITranslations } from '../../data/uiTranslations';
import { translateClauseExplanation } from '../../services/translationService';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Flame,
  Sparkles,
  Scale,
  MessageSquare,
  Copy,
  Check
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface RiskLevelCardProps {
  level: RiskLevel;
  clauses: ClauseAnalysis[];
  rankOffset?: number;
  onSelectClause?: (clause: ClauseAnalysis) => void;
}

export const RiskLevelCard: React.FC<RiskLevelCardProps> = ({
  level,
  clauses,
  rankOffset = 1,
  onSelectClause
}) => {
  const { selectedLanguage } = useContract();
  const t = useUITranslations(selectedLanguage);

  const [selectedClauseModal, setSelectedClauseModal] = useState<ClauseAnalysis | null>(null);
  const [expandedClauseId, setExpandedClauseId] = useState<string | null>(null);
  const [translatedClauses, setTranslatedClauses] = useState<{ [key: string]: { plainExplanation: string; whyRisky: string; suggestedAlternative: string } }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedLanguage === 'en' || !clauses || clauses.length === 0) {
      setTranslatedClauses({});
      return;
    }

    let isMounted = true;
    async function loadTranslations() {
      const results: { [key: string]: { plainExplanation: string; whyRisky: string; suggestedAlternative: string } } = {};
      
      await Promise.all(
        clauses.slice(0, 8).map(async (c, idx) => {
          const key = c.id || String(idx);
          try {
            const tr = await translateClauseExplanation(c, selectedLanguage);
            results[key] = tr;
          } catch (e) {
            results[key] = {
              plainExplanation: c.plainExplanation,
              whyRisky: c.whyRisky,
              suggestedAlternative: c.suggestedAlternative
            };
          }
        })
      );

      if (isMounted) {
        setTranslatedClauses(results);
      }
    }

    loadTranslations();
    return () => {
      isMounted = false;
    };
  }, [clauses, selectedLanguage]);

  if (!clauses || clauses.length === 0) {
    return null;
  }

  // Ensure clauses are strictly ranked in descending order of risk score
  const sortedClauses = [...clauses].sort((a, b) => b.riskScore - a.riskScore);

  const isHigh = level === 'HIGH';
  const isMed = level === 'MEDIUM';

  const titleText = isHigh 
    ? (selectedLanguage === 'ta' ? 'அதிக ஆபத்துள்ள விதிமுறைகள்' : selectedLanguage === 'hi' ? 'उच्च जोखिम वाले खंड' : 'High Risk Clauses')
    : isMed 
    ? (selectedLanguage === 'ta' ? 'நடுத்தர ஆபத்துள்ள விதிமுறைகள்' : selectedLanguage === 'hi' ? 'मध्यम जोखिम वाले खंड' : 'Medium Risk Clauses')
    : (selectedLanguage === 'ta' ? 'குறைந்த ஆபத்து மற்றும் நிலையான விதிமுறைகள்' : selectedLanguage === 'hi' ? 'कम जोखिम और मानक खंड' : 'Low Risk & Standard Clauses');

  const subtitleText = isHigh
    ? (selectedLanguage === 'ta' ? 'உடனடி மறுஆய்வு அல்லது மறுபேச்சுவார்த்தை தேவைப்படும் முக்கியமான பிரிவுகள்' : selectedLanguage === 'hi' ? 'तत्काल समीक्षा या पुनर्वार्ता की आवश्यकता वाले महत्वपूर्ण खंड' : 'Critical clauses requiring immediate review or renegotiation')
    : isMed
    ? (selectedLanguage === 'ta' ? 'தெளிவுபடுத்தப்பட வேண்டிய மிதமான ஆபத்துள்ள விதிமுறைகள்' : selectedLanguage === 'hi' ? 'मध्यम जोखिम वाले प्रावधान जिन पर स्पष्टीकरण की आवश्यकता है' : 'Provisions with moderate exposure that warrant clarification')
    : (selectedLanguage === 'ta' ? 'வழக்கமான சட்டத் தரங்களுடன் இணங்கும் சீரான விதிமுறைகள்' : selectedLanguage === 'hi' ? 'मानक कानूनी नियमों के अनुरूप संतुलित शर्तें' : 'Balanced terms aligned with customary legal standards');

  const config = isHigh ? {
    title: titleText,
    subtitle: subtitleText,
    badgeText: 'HIGH RISK',
    badgeColor: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800/60',
    cardBorder: 'border-rose-200 dark:border-[#381522]',
    headerBg: 'bg-rose-50/60 dark:bg-[#1a0c14]',
    icon: <ShieldAlert size={18} className="text-rose-600 dark:text-rose-400" />,
    accentBar: 'bg-rose-500',
    scorePill: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800/60'
  } : isMed ? {
    title: titleText,
    subtitle: subtitleText,
    badgeText: 'MEDIUM RISK',
    badgeColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800/60',
    cardBorder: 'border-amber-200 dark:border-[#362111]',
    headerBg: 'bg-amber-50/60 dark:bg-[#181108]',
    icon: <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400" />,
    accentBar: 'bg-amber-500',
    scorePill: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800/60'
  } : {
    title: titleText,
    subtitle: subtitleText,
    badgeText: 'LOW RISK',
    badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60',
    cardBorder: 'border-emerald-200 dark:border-[#10291d]',
    headerBg: 'bg-emerald-50/60 dark:bg-[#071610]',
    icon: <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />,
    accentBar: 'bg-emerald-500',
    scorePill: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60'
  };

  const handleClauseClick = (clause: ClauseAnalysis) => {
    if (onSelectClause) {
      onSelectClause(clause);
    } else {
      setSelectedClauseModal(clause);
    }
  };

  const handleCopy = (e: React.MouseEvent, id: string, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <div className={`rounded-3xl liquid-glass-card border ${config.cardBorder} shadow-2xl overflow-hidden transition-all relative`}>
        {/* Top Accent Line */}
        <div className={`h-1 w-full ${config.accentBar}`} />

        {/* Card Header */}
        <div className={`p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${config.headerBg}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/90 dark:bg-[#0d1322]/90 border border-slate-200 dark:border-white/10 shadow-xs">
              {config.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {config.title}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${config.badgeColor}`}>
                  {sortedClauses.length} {sortedClauses.length === 1 ? 'Clause' : 'Clauses'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#8a99ad] mt-0.5 font-medium">
                {config.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Clauses List Ranked in Descending Order */}
        <div className="p-4 sm:p-5 space-y-3.5 divide-y divide-slate-200/60 dark:divide-white/10">
          {sortedClauses.map((clause, idx) => {
            const key = clause.id || String(idx);
            const isExpanded = expandedClauseId === key;
            const isCritical = clause.riskScore >= 80;
            const scoreColor = clause.riskScore >= 61 ? '#f43f5e' : clause.riskScore >= 31 ? '#f97316' : '#22c55e';
            const translation = translatedClauses[key];

            const displayExplanation = translation?.plainExplanation || clause.plainExplanation;
            const displayWhyRisky = translation?.whyRisky || clause.whyRisky;
            const displayAlt = translation?.suggestedAlternative || clause.suggestedAlternative;

            return (
              <div 
                key={key}
                className={idx > 0 ? 'pt-3.5' : ''}
              >
                <div 
                  className="p-4 rounded-2xl liquid-glass hover:bg-slate-100/90 dark:hover:bg-white/5 border border-slate-200/80 dark:border-white/10 transition-all cursor-pointer group space-y-2.5 shadow-xs"
                  onClick={() => handleClauseClick(clause)}
                >
                  {/* Category, Rank #, Clause # and Calculated Risk Pill */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      {/* Rank Indicator Badge */}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-300/60 dark:border-white/10 flex items-center gap-1">
                        {isCritical && <Flame size={10} className="text-rose-500" />}
                        <span>#{rankOffset + idx} Rank</span>
                      </span>

                      {/* Category Badge */}
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-300/40">
                        {clause.category}
                      </span>

                      {/* Clause Number */}
                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                        {clause.clauseNumber}
                      </span>
                    </div>

                    {/* Calculated Risk Percentage Pill & Mini Progress Bar */}
                    <div className="flex items-center gap-2">
                      <div className="hidden sm:flex items-center gap-1.5">
                        <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all" 
                            style={{ 
                              width: `${clause.riskScore}%`,
                              backgroundColor: scoreColor
                            }}
                          />
                        </div>
                      </div>

                      <span 
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-black border"
                        style={{
                          backgroundColor: `${scoreColor}18`,
                          color: scoreColor,
                          borderColor: `${scoreColor}40`
                        }}
                      >
                        {clause.riskScore}% RISK
                      </span>
                    </div>
                  </div>

                  {/* Summary / Plain Explanation */}
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                    {displayExplanation || clause.originalText}
                  </p>

                  {/* Footer metadata & actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-white/5 text-[11px]">
                    {level !== 'LOW' ? (
                      <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>{t('ask_ai_clause_btn')}</span>
                        <ChevronRight size={13} />
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        <span>Standard Term</span>
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedClauseId(isExpanded ? null : key);
                      }}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Full Clause'}</span>
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>

                  {/* Expandable Details Tray */}
                  {isExpanded && (
                    <div 
                      className="mt-3 pt-3 border-t border-slate-200/80 dark:border-white/10 space-y-3 animate-fade-in"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Original text */}
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                          Original Legal Clause
                        </label>
                        <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-[#070b14]/80 text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-white/10">
                          {clause.originalText}
                        </div>
                      </div>

                      {/* Why risky */}
                      {displayWhyRisky && (
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-black tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            <AlertTriangle size={11} />
                            <span>{t('why_risky')}</span>
                          </label>
                          <div className="p-3 rounded-xl bg-rose-500/10 text-xs font-medium text-rose-900 dark:text-rose-200 border border-rose-300/40">
                            {displayWhyRisky}
                          </div>
                        </div>
                      )}

                      {/* Suggested alternative */}
                      {displayAlt && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] uppercase font-black tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <Scale size={11} />
                              <span>{t('suggested_counter')}</span>
                            </label>
                            <button
                              onClick={(e) => handleCopy(e, key, displayAlt)}
                              className="text-[10px] font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
                            >
                              {copiedId === key ? (
                                <>
                                  <Check size={11} className="text-emerald-500" />
                                  <span className="text-emerald-500">{t('copied')}</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={11} />
                                  <span>{t('copy_clause')}</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="p-3 rounded-xl bg-emerald-500/10 text-xs font-mono text-emerald-950 dark:text-emerald-100 border border-emerald-300/40">
                            {displayAlt}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clause Detail Modal */}
      {selectedClauseModal && (
        <Modal
          isOpen={!!selectedClauseModal}
          onClose={() => setSelectedClauseModal(null)}
          title={`Clause Analysis • ${selectedClauseModal.clauseNumber}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300">
                {selectedClauseModal.category}
              </span>
              <span className="text-xs font-mono font-black text-purple-600">
                {selectedClauseModal.riskScore}% RISK
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Original Text</p>
              <p className="text-xs font-mono p-3 rounded-xl bg-slate-100 dark:bg-[#070b14] mt-1">
                {selectedClauseModal.originalText}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-purple-600 uppercase">Plain-English Explanation</p>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                {selectedClauseModal.plainExplanation}
              </p>
            </div>

            {selectedClauseModal.suggestedAlternative && (
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase">Suggested Alternative</p>
                <p className="text-xs font-mono p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 mt-1">
                  {selectedClauseModal.suggestedAlternative}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};
export default RiskLevelCard;
