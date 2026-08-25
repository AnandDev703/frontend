import React from 'react';
import { ContractAnalysis } from '../../types/contract';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  Timer,
  Users,
  ShieldAlert,
  Scale,
  FileText,
  Download,
  Eye,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Archive,
  ArchiveRestore
} from 'lucide-react';

interface ContractDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: ContractAnalysis | null;
  isClosed?: boolean;
  onToggleClose?: (id: string) => void;
  onOpenDashboard: (contract: ContractAnalysis) => void;
  onDownloadReport: (contract: ContractAnalysis) => void;
  onDeleteContract: (id: string) => void;
}

export const ContractDetailModal: React.FC<ContractDetailModalProps> = ({
  isOpen,
  onClose,
  contract,
  isClosed = false,
  onToggleClose,
  onOpenDashboard,
  onDownloadReport,
  onDeleteContract
}) => {
  if (!isOpen || !contract) return null;

  const score = contract.overallRiskScore || 0;
  const isHighRisk = score >= 61 || contract.riskLevel === 'HIGH';
  const isMedRisk = score >= 31 && score < 61;
  const riskColor = isHighRisk ? '#f43f5e' : isMedRisk ? '#f97316' : '#22c55e';

  // Format start date or fallback
  const startDateStr = 
    contract.keyTerms?.startDate || 
    (contract.createdAt ? new Date(contract.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Aug 25, 2026');

  // Format end / renewal or fallback
  const endDateStr = 
    contract.keyTerms?.endDate || 
    contract.keyTerms?.renewal || 
    'Aug 25, 2027';

  // Format duration
  const durationStr = 
    contract.keyTerms?.duration || 
    '12 Months (Renewable)';

  // Format parties
  const partiesStr = 
    contract.keyTerms?.parties || 
    (contract.userRole === 'employee' ? 'Employer & Employee' : contract.userRole === 'freelancer' ? 'Client & Contractor' : 'Disclosing & Receiving Parties');

  // Format notice period
  const noticePeriodStr = 
    contract.keyTerms?.noticePeriod || 
    'Either side can terminate with 30 days notice';

  // Format governing law
  const governingLawStr = 
    contract.keyTerms?.governingLaw || 
    'Disputes resolved under State / Commercial Jurisdiction';

  const riskCounts = contract.riskCounts || {
    high: contract.clauses?.filter(c => c.riskScore >= 61).length || 0,
    medium: contract.clauses?.filter(c => c.riskScore >= 31 && c.riskScore < 61).length || 0,
    low: contract.clauses?.filter(c => c.riskScore < 31).length || 0,
    total: contract.clauses?.length || 0
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Heavy Frosted Glass Backdrop Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/60 dark:bg-[#070b14]/80 backdrop-blur-xl transition-all"
          onClick={onClose}
        />

        {/* Small Dialogue Box Card with Liquid Glass Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-3xl rounded-3xl bg-white/95 dark:bg-[#0d1322]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl p-5 sm:p-6 overflow-hidden space-y-5"
        >
          {/* Specular Liquid Top Highlight Line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 dark:via-white/40 to-transparent pointer-events-none" />

          {/* 1. Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-12 rounded-2xl bg-purple-500/15 border border-purple-300/40 text-purple-600 dark:text-purple-400 flex flex-col items-center justify-center shrink-0 shadow-xs">
                <FileText size={18} />
                <span className="text-[8px] font-black uppercase tracking-tight">
                  {(contract.contractName || '').endsWith('.docx') ? 'DOCX' : 'PDF'}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {contract.contractName}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-300/40">
                    {contract.contractType || 'Legal Agreement'}
                  </span>
                  {isClosed && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-300/40">
                      Closed
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  {contract.userRole.toUpperCase()} Perspective • Uploaded {new Date(contract.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* 2. 6 Metadata Cards Grid (As Shown in Screenshot) */}
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
              Contract Specifications
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {/* Card 1: START DATE */}
              <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-1 hover:border-purple-300 transition-colors">
                <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                  <Calendar size={13} />
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    START DATE
                  </span>
                </div>
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {startDateStr}
                </p>
              </div>

              {/* Card 2: END / RENEWAL */}
              <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-1 hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                  <Clock size={13} />
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    END / RENEWAL
                  </span>
                </div>
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {endDateStr}
                </p>
              </div>

              {/* Card 3: DURATION */}
              <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-1 hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                  <Timer size={13} />
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    DURATION
                  </span>
                </div>
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {durationStr}
                </p>
              </div>

              {/* Card 4: PARTIES */}
              <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-1 hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Users size={13} />
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    PARTIES
                  </span>
                </div>
                <p className="text-xs font-black text-slate-900 dark:text-white truncate" title={partiesStr}>
                  {partiesStr}
                </p>
              </div>

              {/* Card 5: NOTICE PERIOD */}
              <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-1 hover:border-rose-300 transition-colors">
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                  <ShieldAlert size={13} />
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    NOTICE PERIOD
                  </span>
                </div>
                <p className="text-xs font-black text-slate-900 dark:text-white truncate" title={noticePeriodStr}>
                  {noticePeriodStr}
                </p>
              </div>

              {/* Card 6: GOVERNING LAW */}
              <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-1 hover:border-cyan-300 transition-colors">
                <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                  <Scale size={13} />
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    GOVERNING LAW
                  </span>
                </div>
                <p className="text-xs font-black text-slate-900 dark:text-white truncate" title={governingLawStr}>
                  {governingLawStr}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Risk Score & Summary Banner */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl font-black" style={{ color: riskColor }}>
                  {score}%
                </span>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wide block" style={{ color: riskColor }}>
                    {isHighRisk ? 'High Risk Detected' : isMedRisk ? 'Medium Risk' : 'Low Risk / Safe'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Overall Risk Rating
                  </span>
                </div>
              </div>

              {/* Clause Counts Pills */}
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-300/40">
                  {riskCounts.high} High
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-300/40">
                  {riskCounts.medium} Med
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-300/40">
                  {riskCounts.low} Low
                </span>
              </div>
            </div>

            {/* Summary Text */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {contract.displaySummary || contract.contractSummary || contract.riskExplanation || 'Comprehensive risk audit completed for this legal agreement.'}
            </p>
          </div>

          {/* 4. Action Buttons Footer */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${contract.contractName}"?`)) {
                    onDeleteContract(contract.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-500/15 border border-rose-200 dark:border-rose-900/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>

              {onToggleClose && (
                <button
                  onClick={() => {
                    onToggleClose(contract.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105 ${
                    isClosed
                      ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-300/60 dark:border-blue-700/60 hover:bg-blue-500/25'
                      : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:bg-blue-500/10 hover:text-blue-600'
                  }`}
                >
                  {isClosed ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                  <span>{isClosed ? 'Reopen Contract' : 'Close Contract'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onDownloadReport(contract);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105"
              >
                <Download size={14} />
                <span>Export PDF</span>
              </button>

              <button
                onClick={() => {
                  onOpenDashboard(contract);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-purple-500/30 transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105"
              >
                <Eye size={14} />
                <span>Open Full Analysis</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default ContractDetailModal;
