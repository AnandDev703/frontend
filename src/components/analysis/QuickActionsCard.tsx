import React, { useState } from 'react';
import { ContractAnalysis } from '../../types/contract';
import { 
  GitCompare, 
  Download, 
  Share2, 
  Check,
  Zap
} from 'lucide-react';
import { generatePdfRiskReport } from '../../services/pdfReportService';

interface QuickActionsCardProps {
  contract: ContractAnalysis;
  onAskAI: () => void;
  onCompare: () => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  contract,
  onAskAI,
  onCompare
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-[#141d33] text-slate-800 dark:text-slate-100 flex flex-col justify-between shadow-sm dark:shadow-xl transition-colors space-y-3.5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Quick Actions</h3>
        <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Zap size={11} />
          <span>4 Tools</span>
        </span>
      </div>

      {/* 4 Action Tiles - Stretched & Fitted evenly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
        {/* Action 1: Ask AI Assistant */}
        <button
          onClick={onAskAI}
          className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101729] hover:bg-purple-50/50 dark:hover:bg-[#141e33] border border-slate-200 dark:border-[#182440] hover:border-purple-300 dark:hover:border-purple-500/40 transition-all text-left group flex items-start gap-3 cursor-pointer shadow-2xs h-full"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-purple-200 dark:border-purple-800/60 shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <img src="/ai-logo.png" alt="AI Assistant" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Ask AI Assistant
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-[#8a99ad] mt-1 leading-snug">
              Ask questions about this contract
            </p>
          </div>
        </button>

        {/* Action 2: Compare Contracts */}
        <button
          onClick={onCompare}
          className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101729] hover:bg-blue-50/50 dark:hover:bg-[#141e33] border border-slate-200 dark:border-[#182440] hover:border-blue-300 dark:hover:border-blue-500/40 transition-all text-left group flex items-start gap-3 cursor-pointer shadow-2xs h-full"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <GitCompare size={20} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Compare Contracts
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-[#8a99ad] mt-1 leading-snug">
              Compare with another contract
            </p>
          </div>
        </button>

        {/* Action 3: Download Report */}
        <button
          onClick={() => generatePdfRiskReport(contract)}
          className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101729] hover:bg-emerald-50/50 dark:hover:bg-[#141e33] border border-slate-200 dark:border-[#182440] hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all text-left group flex items-start gap-3 cursor-pointer shadow-2xs h-full"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <Download size={20} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Download Report
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-[#8a99ad] mt-1 leading-snug">
              Download detailed analysis report
            </p>
          </div>
        </button>

        {/* Action 4: Share Analysis */}
        <button
          onClick={handleShare}
          className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101729] hover:bg-cyan-50/50 dark:hover:bg-[#141e33] border border-slate-200 dark:border-[#182440] hover:border-cyan-300 dark:hover:border-cyan-500/40 transition-all text-left group flex items-start gap-3 cursor-pointer shadow-2xs h-full"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-800/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            {copiedLink ? <Check size={20} className="text-emerald-500" /> : <Share2 size={20} />}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              {copiedLink ? 'Link Copied!' : 'Share Analysis'}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-[#8a99ad] mt-1 leading-snug">
              Share this analysis with your team
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
