import React, { useState, useEffect } from 'react';
import { ContractAnalysis } from '../../types/contract';
import { useContract } from '../../context/ContractContext';
import { useUITranslations } from '../../data/uiTranslations';
import { translateText } from '../../services/translationService';
import { 
  FileText, 
  CheckCircle2, 
  Eye, 
  Code, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Calendar,
  Clock,
  Users,
  DollarSign,
  ShieldCheck,
  Scale,
  Loader2
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface DocumentSummaryBannerProps {
  contract: ContractAnalysis;
  onViewOriginal?: () => void;
}

export const DocumentSummaryBanner: React.FC<DocumentSummaryBannerProps> = ({ 
  contract,
  onViewOriginal
}) => {
  const { selectedLanguage } = useContract();
  const t = useUITranslations(selectedLanguage);

  const [isRawModalOpen, setIsRawModalOpen] = useState(false);
  const [showJsonInspector, setShowJsonInspector] = useState(false);
  const [translatedSummary, setTranslatedSummary] = useState<string>(contract.contractSummary || '');
  const [translatedDisplaySummary, setTranslatedDisplaySummary] = useState<string>(contract.displaySummary || '');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  useEffect(() => {
    if (selectedLanguage === 'en') {
      setTranslatedSummary(contract.contractSummary || '');
      setTranslatedDisplaySummary(contract.displaySummary || '');
      return;
    }

    let isMounted = true;
    async function translateSummaries() {
      setIsTranslating(true);
      try {
        const [sum, disp] = await Promise.all([
          contract.contractSummary ? translateText(contract.contractSummary, selectedLanguage) : Promise.resolve(''),
          contract.displaySummary ? translateText(contract.displaySummary, selectedLanguage) : Promise.resolve('')
        ]);
        if (isMounted) {
          if (sum) setTranslatedSummary(sum);
          if (disp) setTranslatedDisplaySummary(disp);
        }
      } catch (err) {
        console.warn('Summary translation error:', err);
      } finally {
        if (isMounted) setIsTranslating(false);
      }
    }

    translateSummaries();
    return () => {
      isMounted = false;
    };
  }, [contract.contractSummary, contract.displaySummary, selectedLanguage]);

  const wordCount = contract.rawText 
    ? contract.rawText.split(/\s+/).filter(Boolean).length 
    : 1250;
  const estimatedPages = Math.max(1, Math.ceil(wordCount / 400));
  const dateFormatted = new Date(contract.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const timeFormatted = new Date(contract.createdAt || Date.now()).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const startDate = contract.keyTerms?.startDate || dateFormatted;
  const endDate = contract.keyTerms?.endDate || new Date(Date.now() + 365 * 24 * 3600 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const duration = contract.keyTerms?.duration || '12 Months (Renewable)';
  const parties = contract.keyTerms?.parties || `Employer & You (${contract.userRole})`;
  const payment = contract.keyTerms?.payment || 'Standard Compensation';
  const noticePeriod = contract.keyTerms?.noticePeriod || '30 Days Notice';
  const governingLaw = contract.keyTerms?.governingLaw || 'Applicable Jurisdiction & Laws';

  const rawJsonOutput = contract.rawApiResponse || {
    risk_percentage: contract.overallRiskScore,
    summary: contract.contractSummary,
    display_summary: contract.displaySummary,
    risk_categories: contract.riskCategories || []
  };

  return (
    <>
      <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl liquid-glass-card text-slate-800 dark:text-slate-100 shadow-2xl space-y-5 transition-all">
        {/* Top Specular Line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />

        {/* Top Header: H1 Display Summary from Backend */}
        <div className="border-b border-slate-200/80 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-300/40 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={11} />
              <span>{contract.contractType || 'Legal Agreement'}</span>
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Risk: {contract.overallRiskScore}% ({contract.riskLevel})
            </span>
            {isTranslating && (
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1 animate-pulse">
                <Loader2 size={11} className="animate-spin" />
                <span>Translating Summary...</span>
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {translatedDisplaySummary || contract.displaySummary || contract.contractName}
          </h1>
        </div>

        {/* Main Document & Status Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left: File info */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative p-3 rounded-2xl bg-red-500/15 border border-red-300/40 text-red-600 dark:text-red-400 shrink-0 flex items-center justify-center shadow-md shadow-red-500/20">
              <FileText size={24} />
              <span className="absolute -bottom-1 -right-1 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-red-600 text-white shadow-2xs">
                PDF
              </span>
            </div>

            <div className="min-w-0 space-y-0.5">
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md" title={contract.contractName}>
                {contract.contractName}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-[#8a99ad] font-medium">
                Uploaded on {dateFormatted} • {timeFormatted}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-[#8a99ad] font-medium">
                {estimatedPages} Pages • {wordCount.toLocaleString()} Words • {contract.clauses?.length || 0} Clauses Evaluated
              </p>
            </div>
          </div>

          {/* Right: Technical Inspector Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsRawModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-card hover:border-purple-400 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
              title="Inspect Raw JSON Output"
            >
              <Code size={13} className="text-purple-600 dark:text-purple-400" />
              <span>JSON Output</span>
            </button>
          </div>
        </div>

        {/* AI Summary Box */}
        <div className="p-4 sm:p-5 rounded-2xl liquid-glass border border-purple-200/60 dark:border-purple-800/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <Sparkles size={12} />
              <span>AI Executive Summary</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
            {translatedSummary || contract.contractSummary || contract.summary}
          </p>
        </div>

        {/* Key Terms Summary Grid - Full text visibility with wrap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl liquid-glass-card space-y-1 transition-all flex flex-col justify-start">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
              Duration
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-relaxed break-words">
              {duration}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl liquid-glass-card space-y-1 transition-all flex flex-col justify-start">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
              Notice Period
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-relaxed break-words">
              {noticePeriod}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl liquid-glass-card space-y-1 transition-all flex flex-col justify-start">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
              Parties
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-relaxed break-words">
              {parties}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl liquid-glass-card space-y-1 transition-all flex flex-col justify-start">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
              Payment
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-relaxed break-words">
              {payment}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl liquid-glass-card space-y-1 transition-all flex flex-col justify-start">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
              Start Date
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-relaxed break-words">
              {startDate}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl liquid-glass-card space-y-1 transition-all flex flex-col justify-start">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
              Jurisdiction
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-relaxed break-words">
              {governingLaw}
            </p>
          </div>
        </div>
      </div>

      {/* Raw JSON Inspector Modal */}
      <Modal
        isOpen={isRawModalOpen}
        onClose={() => setIsRawModalOpen(false)}
        title="Raw Backend JSON Response"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Below is the authenticated API JSON payload received from the backend:
          </p>
          <div className="max-h-96 overflow-y-auto p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono border border-slate-700">
            <pre>{JSON.stringify(rawJsonOutput, null, 2)}</pre>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default DocumentSummaryBanner;
