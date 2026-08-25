import React, { useState, useEffect } from 'react';
import { useContract } from '../../context/ContractContext';
import { ContractAnalysis, ReportComparisonPayload } from '../../types/contract';
import { compareReports } from '../../services/backendApiService';
import { useUITranslations } from '../../data/uiTranslations';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitCompare, 
  Scale,
  FileUp,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Trophy,
  Check,
  XCircle,
  HelpCircle,
  RefreshCw,
  Award,
  Flame,
  ThumbsUp,
  ThumbsDown,
  Layers
} from 'lucide-react';

export const ContractCompare: React.FC = () => {
  const { contractHistory, setCurrentView, selectedLanguage } = useContract();
  const t = useUITranslations(selectedLanguage);

  // Available reports from application history
  const availableReports = contractHistory || [];

  // Report selection state (IDs)
  const [selectedReportId1, setSelectedReportId1] = useState<string>(
    availableReports[0]?.id || ''
  );
  const [selectedReportId2, setSelectedReportId2] = useState<string>(
    availableReports[1]?.id || ''
  );

  // Comparison execution states
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [comparisonResult, setComparisonResult] = useState<ReportComparisonPayload | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-sync initial selection when reports load
  useEffect(() => {
    if (availableReports.length >= 2) {
      if (!selectedReportId1) setSelectedReportId1(availableReports[0].id);
      if (!selectedReportId2 || selectedReportId2 === availableReports[0].id) {
        setSelectedReportId2(availableReports[1].id);
      }
    } else if (availableReports.length === 1 && !selectedReportId1) {
      setSelectedReportId1(availableReports[0].id);
    }
  }, [availableReports]);

  // Execute Comparison API
  const handleCompare = async () => {
    if (!selectedReportId1 || !selectedReportId2) {
      setErrorMessage('Please select two distinct reports to compare.');
      return;
    }

    if (selectedReportId1 === selectedReportId2) {
      setErrorMessage('Please select two different reports. You cannot compare a report with itself.');
      return;
    }

    setErrorMessage(null);
    setIsComparing(true);

    try {
      const result = await compareReports(selectedReportId1, selectedReportId2);
      setComparisonResult(result);
    } catch (err: any) {
      console.error('[ContractCompare] Error calling /api/reports/compare:', err);
      // Clean user-friendly message without exposing raw API errors
      setErrorMessage('Unable to compare these reports. Please try again.');
      setComparisonResult(null);
    } finally {
      setIsComparing(false);
    }
  };

  // If user has fewer than 2 reports
  if (availableReports.length < 2) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl liquid-glass-card text-center space-y-4 shadow-2xl animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />
        <div className="w-14 h-14 mx-auto rounded-3xl bg-purple-500/15 border border-purple-300/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <GitCompare size={26} />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          {t('compare_title')}
        </h3>
        <p className="text-xs text-slate-600 dark:text-[#8a99ad] max-w-sm mx-auto leading-relaxed">
          You need at least 2 analyzed contracts in your account to generate an automated AI report comparison.
        </p>
        <button
          onClick={() => setCurrentView('upload')}
          className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-2"
        >
          <FileUp size={15} />
          <span>{t('nav_analyze')}</span>
        </button>
      </div>
    );
  }

  const doc1Details = comparisonResult?.document1;
  const doc2Details = comparisonResult?.document2;
  const comp = comparisonResult?.comparison;

  const isDoc1Winner = comp?.better_document === 'document_1';
  const isDoc2Winner = comp?.better_document === 'document_2';
  const isTie = comp?.better_document === 'tie';

  const doc1Title = doc1Details?.title || availableReports.find(c => String(c.id) === String(selectedReportId1))?.contractName || 'Document 1';
  const doc2Title = doc2Details?.title || availableReports.find(c => String(c.id) === String(selectedReportId2))?.contractName || 'Document 2';

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in px-2 sm:px-4">
      {/* 1. SELECTION & CONTROL BAR */}
      <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl liquid-glass-card shadow-2xl transition-all space-y-5">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/15 border border-purple-300/40 text-purple-600 dark:text-purple-400 shadow-md shadow-purple-500/20">
              <GitCompare size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Contract Report Comparison
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-300/40">
                  AI POWERED
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8a99ad] mt-0.5 font-medium">
                Select two existing reports to evaluate risk scores, strengths, weaknesses, and key clause differences.
              </p>
            </div>
          </div>
        </div>

        {/* Document Selectors & Compare Trigger */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Document 1 Selector */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Select Document 1
            </label>
            <select
              value={selectedReportId1}
              onChange={(e) => {
                setSelectedReportId1(e.target.value);
                setComparisonResult(null);
                setErrorMessage(null);
              }}
              className="w-full text-xs sm:text-sm font-bold py-3 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0c1222]/90 text-slate-900 dark:text-white cursor-pointer shadow-xs focus:outline-hidden focus:border-purple-500 transition-all"
            >
              {availableReports.map((c) => (
                <option key={`doc1-${c.id}`} value={c.id} disabled={c.id === selectedReportId2}>
                  {c.contractName} ({c.overallRiskScore}% Risk) {c.id === selectedReportId2 ? '— (Selected as Doc 2)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* VS Divider */}
          <div className="md:col-span-2 flex items-center justify-center pt-2 md:pt-6">
            <div className="w-10 h-10 rounded-full bg-purple-500/15 border border-purple-300/40 text-purple-600 dark:text-purple-400 font-black text-xs flex items-center justify-center shadow-xs">
              VS
            </div>
          </div>

          {/* Document 2 Selector */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Select Document 2
            </label>
            <select
              value={selectedReportId2}
              onChange={(e) => {
                setSelectedReportId2(e.target.value);
                setComparisonResult(null);
                setErrorMessage(null);
              }}
              className="w-full text-xs sm:text-sm font-bold py-3 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0c1222]/90 text-slate-900 dark:text-white cursor-pointer shadow-xs focus:outline-hidden focus:border-purple-500 transition-all"
            >
              {availableReports.map((c) => (
                <option key={`doc2-${c.id}`} value={c.id} disabled={c.id === selectedReportId1}>
                  {c.contractName} ({c.overallRiskScore}% Risk) {c.id === selectedReportId1 ? '— (Selected as Doc 1)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button & Feedback */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          {errorMessage && (
            <div className="w-full sm:w-auto p-3 rounded-2xl bg-rose-500/10 border border-rose-300 dark:border-rose-800/80 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertTriangle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            onClick={handleCompare}
            disabled={isComparing || !selectedReportId1 || !selectedReportId2 || selectedReportId1 === selectedReportId2}
            className="w-full sm:w-auto sm:ml-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isComparing ? (
              <>
                <RefreshCw size={16} className="animate-spin text-white" />
                <span>Comparing Documents with AI...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                <span>Compare Documents</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. LOADING STATE */}
      {isComparing && (
        <div className="p-12 rounded-3xl liquid-glass-card text-center space-y-4 shadow-2xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />
          <RefreshCw size={36} className="mx-auto text-purple-600 dark:text-purple-400 animate-spin" />
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Generating Side-by-Side Analysis
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8a99ad] max-w-sm mx-auto mt-1 leading-relaxed">
              Evaluating risk scores, weighting favorable clauses, and comparing contractual obligations...
            </p>
          </div>
        </div>
      )}

      {/* 3. COMPARISON DASHBOARD RESULTS */}
      {comp && !isComparing && (
        <div className="space-y-6 animate-fade-in">
          {/* A. HEADER: DOCUMENT 1 VS DOCUMENT 2 & OVERALL WINNER */}
          <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl liquid-glass-card shadow-2xl transition-all space-y-4">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />

            {/* Document Titles Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Head-to-Head Comparison
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                  {doc1Title} <span className="text-purple-500 font-normal">vs</span> {doc2Title}
                </h2>
              </div>

              {/* Winner Pill Badge */}
              <div className={`px-4 py-2 rounded-2xl border font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm ${
                isDoc1Winner
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/50'
                  : isDoc2Winner
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/50'
                  : 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-400/50'
              }`}>
                <Trophy size={16} className={isTie ? 'text-purple-500' : 'text-emerald-500'} />
                <span>
                  {isDoc1Winner 
                    ? 'Document 1 is more favorable' 
                    : isDoc2Winner 
                    ? 'Document 2 is more favorable' 
                    : 'Both documents are similarly favorable'}
                </span>
              </div>
            </div>
          </div>

          {/* B. SCORE SECTION: SIDE-BY-SIDE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Document 1 Score Card */}
            <div className={`relative overflow-hidden p-6 rounded-3xl liquid-glass-card shadow-2xl flex flex-col justify-between space-y-4 transition-all ${
              isDoc1Winner ? 'ring-2 ring-emerald-500 scale-[1.01]' : ''
            }`}>
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />

              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-300/40">
                  Document 1
                </span>
                {isDoc1Winner && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/50 flex items-center gap-1">
                    <Award size={12} />
                    <span>WINNER</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white truncate" title={doc1Title}>
                  {doc1Title}
                </h3>
              </div>

              <div className="p-4 rounded-2xl liquid-glass border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Favorability Score
                  </span>
                  <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-0.5">
                    {comp.document_1_score} <span className="text-sm font-bold text-slate-400">/ 100</span>
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-300/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-mono font-black text-lg">
                  {comp.document_1_score}%
                </div>
              </div>
            </div>

            {/* Document 2 Score Card */}
            <div className={`relative overflow-hidden p-6 rounded-3xl liquid-glass-card shadow-2xl flex flex-col justify-between space-y-4 transition-all ${
              isDoc2Winner ? 'ring-2 ring-emerald-500 scale-[1.01]' : ''
            }`}>
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent pointer-events-none" />

              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-300/40">
                  Document 2
                </span>
                {isDoc2Winner && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/50 flex items-center gap-1">
                    <Award size={12} />
                    <span>WINNER</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white truncate" title={doc2Title}>
                  {doc2Title}
                </h3>
              </div>

              <div className="p-4 rounded-2xl liquid-glass border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Favorability Score
                  </span>
                  <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-0.5">
                    {comp.document_2_score} <span className="text-sm font-bold text-slate-400">/ 100</span>
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-300/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-lg">
                  {comp.document_2_score}%
                </div>
              </div>
            </div>
          </div>

          {/* C. SUMMARY SECTION */}
          {comp.summary && (
            <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl liquid-glass-card shadow-2xl space-y-2.5">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Overall Comparison
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                {comp.summary}
              </p>
            </div>
          )}

          {/* D. STRENGTHS AND WEAKNESSES: 2 COLUMNS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Column 1: Document 1 Strengths & Weaknesses */}
            <div className="relative overflow-hidden p-6 rounded-3xl liquid-glass-card shadow-2xl space-y-4">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Document 1 Breakdown
                </h4>
                <span className="text-[10px] font-bold text-slate-400">
                  {doc1Title}
                </span>
              </div>

              {/* Strengths */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <ThumbsUp size={13} />
                  <span>Strengths</span>
                </label>
                {comp.document_1?.strengths && comp.document_1.strengths.length > 0 ? (
                  <ul className="space-y-1.5">
                    {comp.document_1.strengths.map((s, idx) => (
                      <li key={`doc1-str-${idx}`} className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-300/40 text-xs font-semibold text-emerald-950 dark:text-emerald-200 flex items-start gap-2">
                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No specific strengths listed.</p>
                )}
              </div>

              {/* Weaknesses */}
              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <ThumbsDown size={13} />
                  <span>Weaknesses</span>
                </label>
                {comp.document_1?.weaknesses && comp.document_1.weaknesses.length > 0 ? (
                  <ul className="space-y-1.5">
                    {comp.document_1.weaknesses.map((w, idx) => (
                      <li key={`doc1-wk-${idx}`} className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-300/40 text-xs font-semibold text-rose-950 dark:text-rose-200 flex items-start gap-2">
                        <AlertTriangle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No specific weaknesses listed.</p>
                )}
              </div>
            </div>

            {/* Column 2: Document 2 Strengths & Weaknesses */}
            <div className="relative overflow-hidden p-6 rounded-3xl liquid-glass-card shadow-2xl space-y-4">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Document 2 Breakdown
                </h4>
                <span className="text-[10px] font-bold text-slate-400">
                  {doc2Title}
                </span>
              </div>

              {/* Strengths */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <ThumbsUp size={13} />
                  <span>Strengths</span>
                </label>
                {comp.document_2?.strengths && comp.document_2.strengths.length > 0 ? (
                  <ul className="space-y-1.5">
                    {comp.document_2.strengths.map((s, idx) => (
                      <li key={`doc2-str-${idx}`} className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-300/40 text-xs font-semibold text-emerald-950 dark:text-emerald-200 flex items-start gap-2">
                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No specific strengths listed.</p>
                )}
              </div>

              {/* Weaknesses */}
              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <ThumbsDown size={13} />
                  <span>Weaknesses</span>
                </label>
                {comp.document_2?.weaknesses && comp.document_2.weaknesses.length > 0 ? (
                  <ul className="space-y-1.5">
                    {comp.document_2.weaknesses.map((w, idx) => (
                      <li key={`doc2-wk-${idx}`} className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-300/40 text-xs font-semibold text-rose-950 dark:text-rose-200 flex items-start gap-2">
                        <AlertTriangle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No specific weaknesses listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ContractCompare;

