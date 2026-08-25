import React, { useState } from 'react';
import { ContractAnalysis } from '../../types/contract';
import { Sparkles, ArrowRight, Info } from 'lucide-react';
import { Modal } from '../common/Modal';

interface OverallRiskScoreCardProps {
  contract: ContractAnalysis;
  onViewAISummary?: () => void;
}

export const OverallRiskScoreCard: React.FC<OverallRiskScoreCardProps> = ({ 
  contract,
  onViewAISummary
}) => {
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const score = contract.overallRiskScore || 0;
  const isHigh = score >= 61;
  const isMed = score >= 31 && score < 61;

  const ringColor = isHigh ? '#f43f5e' : isMed ? '#f97316' : '#22c55e';

  const summaryText = contract.contractSummary || contract.riskExplanation || 
    `This agreement contains several clauses that may expose you to financial, legal, and operational risks. Review the critical issues and recommended changes carefully.`;

  const displaySummaryHeadline = contract.displaySummary || 
    `This contract poses a ${contract.riskLevel.toLowerCase()} level of risk.`;

  // SVG circular gauge math with heroic scale
  const radius = 54;
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <>
      <div className="relative overflow-hidden p-5 sm:p-6 rounded-3xl liquid-glass-card text-slate-800 dark:text-slate-100 flex flex-col justify-between shadow-2xl space-y-4 transition-all">
        {/* Specular Liquid Top Line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />

        {/* Card Title */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Overall Risk Score</h3>
            <Info size={13} className="text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {/* Center Percentage Circular Gauge - Large Heroic Display */}
        <div className="flex flex-col items-center justify-center my-auto space-y-4 py-1">
          <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
            {/* Ambient liquid glow behind gauge */}
            <div 
              className="absolute inset-4 rounded-full blur-2xl opacity-30 pointer-events-none transition-all"
              style={{ backgroundColor: ringColor }}
            />

            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
              {/* Background track */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="stroke-slate-200/80 dark:stroke-white/10"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Active progress arc */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke={ringColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: isHigh ? 'drop-shadow(0 0 14px rgba(244, 63, 94, 0.55))' : isMed ? 'drop-shadow(0 0 14px rgba(249, 115, 22, 0.55))' : 'drop-shadow(0 0 14px rgba(34, 197, 94, 0.55))'
                }}
              />
            </svg>

            {/* Centered Large Bold Percentage & Risk Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                {score}%
              </span>
              <span 
                className="text-[11px] sm:text-xs font-black uppercase tracking-wider mt-2 px-3.5 py-1 rounded-full border shadow-sm"
                style={{ 
                  color: ringColor,
                  backgroundColor: isHigh ? 'rgba(244, 63, 94, 0.12)' : isMed ? 'rgba(249, 115, 22, 0.12)' : 'rgba(34, 197, 94, 0.12)',
                  borderColor: isHigh ? 'rgba(244, 63, 94, 0.35)' : isMed ? 'rgba(249, 115, 22, 0.35)' : 'rgba(34, 197, 94, 0.35)'
                }}
              >
                {contract.riskLevel} RISK
              </span>
            </div>
          </div>

          {/* Down Wording: Display Summary Headline & AI Summary */}
          <div className="text-center space-y-2 max-w-sm">
            <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
              {contract.displaySummary ? (
                <span className="text-slate-900 dark:text-white">{contract.displaySummary}</span>
              ) : (
                <span>This contract poses a <span style={{ color: ringColor }}>{contract.riskLevel.toLowerCase()} level of risk.</span></span>
              )}
            </h4>

            <div className="p-3.5 rounded-2xl liquid-glass border border-purple-200/60 dark:border-purple-800/40 text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-purple-600 dark:text-purple-400">
                <Sparkles size={13} />
                <span>AI Summary</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed break-words">
                {summaryText}
              </p>
            </div>
          </div>
        </div>

        {/* Card Footer Action */}
        <div className="pt-3 border-t border-slate-100 dark:border-[#141d33] flex items-center justify-between">
          <button
            onClick={() => onViewAISummary ? onViewAISummary() : setIsSummaryModalOpen(true)}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View AI Summary</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* AI Summary Full Modal */}
      <Modal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        title="Executive AI Risk Summary"
        subtitle={`Evaluation perspective: ${contract.userRole.toUpperCase()}`}
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090d1a] border border-slate-200 dark:border-[#182440] space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles size={14} className="text-purple-600 dark:text-purple-400" />
              <span>Comprehensive Risk Overview</span>
            </h4>
            <p className="leading-relaxed">{summaryText}</p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setIsSummaryModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-[#101729] hover:bg-slate-300 dark:hover:bg-[#182440] text-slate-900 dark:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
