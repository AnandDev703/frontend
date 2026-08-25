import React, { useState } from 'react';
import { ContractAnalysis, ClauseAnalysis } from '../../types/contract';
import { ClauseDetailCard } from './ClauseDetailCard';
import { useContract } from '../../context/ContractContext';
import { useUITranslations } from '../../data/uiTranslations';
import { 
  Search, 
  FileText, 
  Layers, 
  AlignLeft,
  Filter,
  Flame,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface ContractViewerProps {
  contract: ContractAnalysis;
  onAskAIAboutClause: (clause: ClauseAnalysis) => void;
}

export const ContractViewer: React.FC<ContractViewerProps> = ({
  contract,
  onAskAIAboutClause
}) => {
  const { 
    selectedClause, 
    setSelectedClause, 
    selectedLanguage, 
    setSelectedLanguage 
  } = useContract();
  const t = useUITranslations(selectedLanguage);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [activeTab, setActiveTab] = useState<'clauses' | 'fulltext'>('clauses');

  // Filter clauses
  const filteredClauses = contract.clauses.filter(clause => {
    const matchesSearch = 
      clause.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clause.clauseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clause.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clause.plainExplanation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = 
      filterSeverity === 'ALL' || clause.riskLevel === filterSeverity;

    return matchesSearch && matchesSeverity;
  });

  return (
    <div id="contract-viewer-section" className="space-y-4">
      {/* Viewer Header & Controls */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-3xl liquid-glass-card shadow-2xl transition-all">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-500/15 border border-purple-300/40 text-purple-600 dark:text-purple-400 shadow-md shadow-purple-500/20">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              {t('inspector_title')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8a99ad] font-medium">
              {t('inspector_sub')}
            </p>
          </div>
        </div>

        {/* View mode toggle tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex p-1 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold backdrop-blur-md">
            <button
              onClick={() => setActiveTab('clauses')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'clauses'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers size={13} />
              <span>{t('tab_structured')} ({filteredClauses.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('fulltext')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'fulltext'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <AlignLeft size={13} />
              <span>{t('tab_fulltext')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search_clauses')}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0c1222]/90 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:border-purple-500 shadow-xs backdrop-blur-md"
          />
        </div>

        {/* Severity filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => {
            const count = sev === 'ALL' 
              ? contract.clauses.length 
              : contract.clauses.filter(c => c.riskLevel === sev).length;
            
            return (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterSeverity === sev
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                    : 'liquid-glass-card text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sev === 'ALL' ? 'All' : sev} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Clause List or Full Text Document */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-3">
          {activeTab === 'clauses' ? (
            filteredClauses.length === 0 ? (
              <div className="p-8 rounded-3xl liquid-glass-card text-center text-xs text-slate-400">
                No clauses match your filter criteria.
              </div>
            ) : (
              filteredClauses.map((clause, idx) => {
                const isSelected = selectedClause?.clauseNumber === clause.clauseNumber;
                return (
                  <div
                    key={clause.clauseNumber || idx}
                    onClick={() => setSelectedClause(clause)}
                    className={`relative overflow-hidden p-4 rounded-3xl liquid-glass-card cursor-pointer transition-all space-y-2 group ${
                      isSelected
                        ? 'ring-2 ring-purple-500 scale-[1.01] shadow-xl'
                        : 'hover:scale-[1.008]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-black text-purple-600 dark:text-purple-400 px-2.5 py-0.5 rounded-lg bg-purple-500/15 border border-purple-300/40">
                        {clause.clauseNumber}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          {clause.category}
                        </span>
                        <RiskBadge level={clause.riskLevel} />
                      </div>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-3 leading-relaxed font-sans">
                      {clause.originalText}
                    </p>
                  </div>
                );
              })
            )
          ) : (
            <div className="relative overflow-hidden p-6 rounded-3xl liquid-glass-card shadow-2xl space-y-4">
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Full Document Text
              </h4>
              <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-wrap max-h-[600px] overflow-y-auto p-4 rounded-2xl bg-slate-50/50 dark:bg-[#070b14]/50 border border-slate-200 dark:border-white/10">
                {contract.rawText}
              </div>
            </div>
          )}
        </div>

        {/* Right: Selected Clause Detail Inspector */}
        <div className="lg:col-span-6 xl:col-span-5 sticky top-20">
          <ClauseDetailCard
            clause={selectedClause}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            onAskAI={onAskAIAboutClause}
          />
        </div>
      </div>
    </div>
  );
};
export default ContractViewer;
