import React, { useState, useEffect, useMemo } from 'react';
import { useContract } from '../../context/ContractContext';
import { ContractAnalysis } from '../../types/contract';
import { generatePdfRiskReport } from '../../services/pdfReportService';
import { ContractDetailModal } from './ContractDetailModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  Eye,
  Trash2,
  FileText,
  ShieldAlert,
  CheckCircle2,
  PieChart,
  Filter,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ChevronDown,
  FolderOpen,
  RefreshCw,
  Archive,
  ArchiveRestore
} from 'lucide-react';

interface OverviewContractItem {
  id: string;
  name: string;
  fileExt: 'pdf' | 'docx';
  fileSize: string;
  uploadedAt: string;
  type: string;
  typeColor: string;
  riskScore: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'Risk Detected' | 'Medium Risk' | 'Low Risk' | 'Closed';
  rawContract: ContractAnalysis;
}

export const ContractHistory: React.FC = () => {
  const {
    contractHistory,
    loadContract,
    deleteContract,
    closeContract,
    restoreContract,
    clearAllHistory,
    refreshHistory,
    setCurrentView,
    selectedLanguage
  } = useContract();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'risk' | 'closed'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'risk_high' | 'risk_low'>('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDetailContract, setSelectedDetailContract] = useState<ContractAnalysis | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [closedContractIds, setClosedContractIds] = useState<Set<string>>(new Set());
  const rowsPerPage = 5;

  // ------------------------------------------------------------
  // FETCH USER REPORTS FROM BACKEND API (/api/reports) ON MOUNT
  // ------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;
    async function loadReports() {
      setIsLoadingReports(true);
      try {
        await refreshHistory();
      } catch (err) {
        console.error('[ContractHistory] Failed to fetch /api/reports:', err);
      } finally {
        if (isMounted) setIsLoadingReports(false);
      }
    }

    loadReports();
    return () => { isMounted = false; };
  }, []);

  // Toggle Close (PATCH /api/reports/:id/close) or Restore (PATCH /api/reports/:id/restore)
  const toggleCloseContract = async (id: string) => {
    const isCurrentlyClosed = closedContractIds.has(id) || 
      contractHistory.find(c => c.id === id)?.status === 'Closed';

    try {
      if (isCurrentlyClosed) {
        await restoreContract(id);
        setClosedContractIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        await closeContract(id);
        setClosedContractIds(prev => {
          const next = new Set(prev);
          next.add(id);
          return next;
        });
      }
    } catch (err) {
      console.error('[ContractHistory] Error toggling report close/restore:', err);
    }
  };

  // Type badge styling with liquid frosted glass pill look
  const getTypeBadgeStyle = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('employment') || t.includes('offer')) {
      return 'bg-purple-500/10 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-300/60 dark:border-purple-600/40 shadow-xs';
    }
    if (t.includes('vendor') || t.includes('consult')) {
      return 'bg-blue-500/10 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300/60 dark:border-blue-600/40 shadow-xs';
    }
    if (t.includes('nda') || t.includes('confidential') || t.includes('disclosure')) {
      return 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-600/40 shadow-xs';
    }
    if (t.includes('service')) {
      return 'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-300/60 dark:border-indigo-600/40 shadow-xs';
    }
    return 'bg-slate-500/10 dark:bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-slate-600/40 shadow-xs';
  };

  // Status badge styling with true dynamic risk value
  const getStatusBadge = (status: string, score: number) => {
    if (status === 'Closed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/12 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-300/60 dark:border-blue-700/50 backdrop-blur-md shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-xs shadow-blue-500/50" />
          <span>Closed</span>
        </span>
      );
    }
    if (score >= 61 || status === 'Risk Detected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/12 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-300/60 dark:border-rose-700/50 backdrop-blur-md shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-xs shadow-rose-500/50" />
          <span>Risk Detected</span>
        </span>
      );
    }
    if (score >= 31 || status === 'Medium Risk') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/12 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-300/60 dark:border-amber-700/50 backdrop-blur-md shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-xs shadow-amber-500/50" />
          <span>Medium Risk</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/12 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-300/60 dark:border-emerald-700/50 backdrop-blur-md shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
        <span>Low Risk</span>
      </span>
    );
  };

  // Map contracts directly from backend / context history with true calculated values
  const allContracts: OverviewContractItem[] = useMemo(() => {
    if (contractHistory.length > 0) {
      return contractHistory.map((c, idx) => {
        const isDocx = (c.contractName || '').endsWith('.docx');
        
        // Robust risk score calculation with deep property fallbacks
        const rawScore = 
          c.overallRiskScore ?? 
          (c as any).risk_percentage ??
          (c as any).risk_score ??
          (c as any).overall_risk_score ??
          (c as any).report_content?.risk_percentage ??
          (c as any).report?.report_content?.risk_percentage ??
          (c.clauses && c.clauses.length > 0 ? Math.round(c.clauses.reduce((a, b) => a + (b.riskScore || 0), 0) / c.clauses.length) : 0);

        const score = Math.min(100, Math.max(0, Math.round(Number(rawScore) || 0)));
        const isClosed = closedContractIds.has(c.id) || (c.status && c.status.toLowerCase() === 'closed');

        let computedStatus: 'Risk Detected' | 'Medium Risk' | 'Low Risk' | 'Closed';
        if (isClosed) {
          computedStatus = 'Closed';
        } else if (score >= 61) {
          computedStatus = 'Risk Detected';
        } else if (score >= 31) {
          computedStatus = 'Medium Risk';
        } else {
          computedStatus = 'Low Risk';
        }

        let timeAgo = 'Recent';
        if (c.createdAt) {
          const diffMs = Date.now() - new Date(c.createdAt).getTime();
          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
          const diffDays = Math.floor(diffHrs / 24);
          if (diffDays > 0) timeAgo = `${diffDays}d ago`;
          else if (diffHrs > 0) timeAgo = `${diffHrs}h ago`;
          else timeAgo = 'Just now';
        } else {
          timeAgo = idx === 0 ? 'Just now' : `${idx + 1}d ago`;
        }

        return {
          id: c.id,
          name: c.contractName,
          fileExt: isDocx ? 'docx' : 'pdf',
          fileSize: c.fileSize || '1.8 MB',
          uploadedAt: timeAgo,
          type: c.contractType || 'Legal Agreement',
          typeColor: getTypeBadgeStyle(c.contractType || ''),
          riskScore: score,
          riskLevel: score >= 61 ? 'HIGH' : score >= 31 ? 'MEDIUM' : 'LOW',
          status: computedStatus,
          rawContract: {
            ...c,
            overallRiskScore: score,
            riskLevel: score >= 61 ? 'HIGH' : score >= 31 ? 'MEDIUM' : 'LOW',
            status: computedStatus
          }
        };
      });
    }

    return [];
  }, [contractHistory, closedContractIds]);

  // Dynamic 4 KPI counts: Active, Risk Detected, Closed, Total Contracts
  const totalCount = allContracts.length;
  const closedCount = allContracts.filter(c => c.status === 'Closed').length;
  const riskCount = allContracts.filter(c => c.status === 'Risk Detected').length;
  const activeCount = allContracts.filter(c => c.status !== 'Closed' && c.status !== 'Risk Detected').length;

  // Clean all handler - triggers backend clear hook
  const handleCleanAllContracts = async () => {
    if (window.confirm('Are you sure you want to clean and delete all contracts from history? This action cannot be undone.')) {
      await clearAllHistory();
    }
  };

  // Filtered & Sorted List
  const filteredList = useMemo(() => {
    let list = allContracts.filter(c => {
      const matchSearch = 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.type.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (activeTab === 'active') return c.status !== 'Closed' && c.riskScore < 61;
      if (activeTab === 'risk') return c.status === 'Risk Detected';
      if (activeTab === 'closed') return c.status === 'Closed';

      return true;
    });

    if (sortOrder === 'risk_high') {
      list.sort((a, b) => b.riskScore - a.riskScore);
    } else if (sortOrder === 'risk_low') {
      list.sort((a, b) => a.riskScore - b.riskScore);
    }

    return list;
  }, [allContracts, searchTerm, activeTab, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / rowsPerPage));
  const paginatedContracts = filteredList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Opens the small dialogue box with all contract specifications & metadata
  const handleOpenContractModal = (item: OverviewContractItem) => {
    setSelectedDetailContract(item.rawContract);
    setIsDetailModalOpen(true);
  };

  const handleDownloadReport = (item: OverviewContractItem) => {
    generatePdfRiskReport(item.rawContract);
  };

    const overviewTitle = selectedLanguage === 'ta' ? 'ஒப்பந்தங்கள் கண்ணோட்டம்' :
      selectedLanguage === 'hi' ? 'अनुबंध अवलोकन' :
      selectedLanguage === 'te' ? 'ఒప్పందాల అవలోకనం' :
      selectedLanguage === 'ml' ? 'കരാറുകളുടെ അവലോകനം' :
      'Contracts Overview';

    const overviewSub = selectedLanguage === 'ta' ? 'பின்னணியில் இருந்து பெறப்பட்ட அனைத்து ஒப்பந்த அறிக்கைகளும்.' :
      selectedLanguage === 'hi' ? 'बैकएंड से आपकी सभी अनुबंध रिपोर्ट एक नज़र में।' :
      selectedLanguage === 'te' ? 'బ్యాకెండ్ నుండి మీ అన్ని కాంట్రాక్ట్ రిపోర్టులు.' :
      selectedLanguage === 'ml' ? 'ബാക്കെൻഡിൽ നിന്നുള്ള നിങ്ങളുടെ എല്ലാ കരാർ റിപ്പോർട്ടുകളും.' :
      'All your contract reports from backend at a glance.';

    const kpiActive = selectedLanguage === 'ta' ? 'செயலில்' : selectedLanguage === 'hi' ? 'सक्रिय' : 'Active';
    const kpiRisk = selectedLanguage === 'ta' ? 'அபாயம் கண்டறியப்பட்டது' : selectedLanguage === 'hi' ? 'जोखिम का पता चला' : 'Risk Detected';
    const kpiClosed = selectedLanguage === 'ta' ? 'மூடப்பட்டது' : selectedLanguage === 'hi' ? 'बंद' : 'Closed';
    const kpiTotal = selectedLanguage === 'ta' ? 'மொத்த ஒப்பந்தங்கள்' : selectedLanguage === 'hi' ? 'कुल अनुबंध' : 'Total Contracts';
    const searchPlaceholder = selectedLanguage === 'ta' ? 'ஒப்பந்தங்களைத் தேடுங்கள்...' : selectedLanguage === 'hi' ? 'अनुबंध खोजें...' : 'Search contracts...';
    const cleanAllLabel = selectedLanguage === 'ta' ? 'அனைத்தையும் நீக்கு' : selectedLanguage === 'hi' ? 'सभी साफ़ करें' : 'Clean All';
    const uploadLabel = selectedLanguage === 'ta' ? 'ஒப்பந்தத்தைப் பதிவேற்றவும்' : selectedLanguage === 'hi' ? 'अनुबंध अपलोड करें' : 'Upload Contract';

  return (
    <div className="relative space-y-6 pb-16 animate-fade-in max-w-7xl mx-auto px-1 sm:px-2">
      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {overviewTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8a99ad] font-medium mt-0.5">
            {overviewSub}
          </p>
        </div>

        {/* Search, Filter, Refresh, Clean All & Upload Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          {/* Search Box with Liquid Glass effect */}
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 rounded-2xl liquid-glass-card text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 transition-all"
            />
          </div>

          {/* Refresh Reports Button */}
          <button
            onClick={async () => {
              setIsLoadingReports(true);
              await refreshHistory();
              setIsLoadingReports(false);
            }}
            disabled={isLoadingReports}
            className="p-2.5 rounded-2xl liquid-glass-card text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 transition-all cursor-pointer hover:scale-105 disabled:opacity-50"
            title="Refresh reports from backend"
          >
            <RefreshCw size={15} className={isLoadingReports ? 'animate-spin text-purple-600' : ''} />
          </button>

          {/* Clean All Contracts Button */}
          {allContracts.length > 0 && (
            <button
              onClick={handleCleanAllContracts}
              className="relative overflow-hidden flex items-center gap-1.5 px-4 py-2.5 rounded-2xl liquid-glass-card hover:bg-rose-500/15 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 border border-slate-200/80 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-800 text-xs font-bold transition-all cursor-pointer hover:scale-105 group"
              title="Clean all saved contracts"
            >
              <Trash2 size={14} className="text-rose-500 group-hover:rotate-12 transition-transform" />
              <span>{cleanAllLabel}</span>
            </button>
          )}

          {/* Upload Contract Button with Specular Liquid Sheen */}
          <button
            onClick={() => setCurrentView('upload')}
            className="relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-purple-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer group"
          >
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
            <UploadCloud size={16} className="group-hover:scale-110 transition-transform" />
            <span>{uploadLabel}</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 KPI Summary Cards with Liquid Glass Effect (Active, Risk Detected, Closed, Total) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Active Contracts */}
        <div 
          onClick={() => setActiveTab('active')}
          className={`p-5 rounded-3xl relative overflow-hidden liquid-glass-card cursor-pointer flex flex-col justify-between items-center text-center space-y-2 group ${
            activeTab === 'active' ? 'ring-2 ring-emerald-500/60 shadow-lg shadow-emerald-500/20' : ''
          }`}
        >
          {/* Specular Liquid Top Line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <FileText size={16} />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{kpiActive}</span>
          </div>

          <p className="text-3xl font-black text-slate-900 dark:text-white leading-none pt-1">
            {activeCount}
          </p>

          <div className="w-10 h-1 rounded-full bg-emerald-500 mt-1 shadow-xs" />
        </div>

        {/* Card 2: Risk Detected */}
        <div 
          onClick={() => setActiveTab('risk')}
          className={`p-5 rounded-3xl relative overflow-hidden liquid-glass-card cursor-pointer flex flex-col justify-between items-center text-center space-y-2 group ${
            activeTab === 'risk' ? 'ring-2 ring-rose-500/60 shadow-lg shadow-rose-500/20' : ''
          }`}
        >
          {/* Specular Liquid Top Line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/30 group-hover:scale-110 transition-transform">
              <ShieldAlert size={16} />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{kpiRisk}</span>
          </div>

          <p className="text-3xl font-black text-slate-900 dark:text-white leading-none pt-1">
            {riskCount}
          </p>

          <div className="w-10 h-1 rounded-full bg-rose-500 mt-1 shadow-xs" />
        </div>

        {/* Card 3: Closed Contracts */}
        <div 
          onClick={() => setActiveTab('closed')}
          className={`p-5 rounded-3xl relative overflow-hidden liquid-glass-card cursor-pointer flex flex-col justify-between items-center text-center space-y-2 group ${
            activeTab === 'closed' ? 'ring-2 ring-blue-500/60 shadow-lg shadow-blue-500/20' : ''
          }`}
        >
          {/* Specular Liquid Top Line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <CheckCircle2 size={16} />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{kpiClosed}</span>
          </div>

          <p className="text-3xl font-black text-slate-900 dark:text-white leading-none pt-1">
            {closedCount}
          </p>

          <div className="w-10 h-1 rounded-full bg-blue-500 mt-1 shadow-xs" />
        </div>

        {/* Card 4: Total Contracts */}
        <div 
          onClick={() => setActiveTab('all')}
          className={`p-5 rounded-3xl relative overflow-hidden liquid-glass-card cursor-pointer flex flex-col justify-between items-center text-center space-y-2 group ${
            activeTab === 'all' ? 'ring-2 ring-purple-500/60 shadow-lg shadow-purple-500/20' : ''
          }`}
        >
          {/* Specular Liquid Top Line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30 group-hover:scale-110 transition-transform">
              <PieChart size={16} />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{kpiTotal}</span>
          </div>

          <p className="text-3xl font-black text-slate-900 dark:text-white leading-none pt-1">
            {totalCount}
          </p>

          <div className="w-10 h-1 rounded-full bg-purple-600 mt-1 shadow-xs" />
        </div>
      </div>

      {/* 3. Sort Dropdown Bar */}
      {allContracts.length > 0 && (
        <div className="flex items-center justify-end">
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl liquid-glass-card text-xs font-semibold text-slate-700 dark:text-slate-200 hover:scale-105 transition-all cursor-pointer"
            >
              <SlidersHorizontal size={13} className="text-slate-500" />
              <span>
                {sortOrder === 'newest' ? 'Newest First' : sortOrder === 'oldest' ? 'Oldest First' : sortOrder === 'risk_high' ? 'Highest Risk' : 'Lowest Risk'}
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 mt-1.5 w-40 liquid-glass-card rounded-2xl shadow-xl z-30 py-1.5 text-xs overflow-hidden"
                >
                  <button
                    onClick={() => { setSortOrder('newest'); setIsSortOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-500/10 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    Newest First
                  </button>
                  <button
                    onClick={() => { setSortOrder('risk_high'); setIsSortOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-500/10 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    Highest Risk
                  </button>
                  <button
                    onClick={() => { setSortOrder('risk_low'); setIsSortOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-500/10 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    Lowest Risk
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 4. Main Liquid Glass Contracts Table Container OR Empty/Loading State */}
      {isLoadingReports ? (
        /* Loading reports indicator */
        <div className="p-12 rounded-3xl liquid-glass text-center space-y-3 shadow-sm animate-pulse">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <RefreshCw size={24} className="animate-spin" />
          </div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Fetching your contract reports from backend...
          </p>
        </div>
      ) : allContracts.length === 0 ? (
        /* Empty Clean State */
        <div className="p-12 rounded-3xl liquid-glass text-center space-y-4 shadow-sm animate-scale-in">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-500/15 border border-purple-300/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <FolderOpen size={30} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              No Reports Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8a99ad] max-w-sm mx-auto mt-1 leading-relaxed">
              No contracts have been analyzed yet for your account. Upload any agreement to run a detailed risk audit and generate reports.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('upload')}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-2"
          >
            <UploadCloud size={16} />
            <span>Upload New Contract</span>
          </button>
        </div>
      ) : (
        <div className="rounded-3xl relative overflow-hidden liquid-glass transition-all">
          {/* Specular Liquid Top Highlight Line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none z-10" />

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/20 dark:border-white/5 bg-white/30 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                  <th className="py-4 px-6 font-semibold">Contract Name</th>
                  <th className="py-4 px-4 font-semibold whitespace-nowrap">Type</th>
                  <th className="py-4 px-4 font-semibold whitespace-nowrap text-center">Risk Score</th>
                  <th className="py-4 px-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="py-4 px-6 font-semibold text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 dark:divide-white/5">
                {paginatedContracts.map((item, idx) => {
                  const isHighRisk = item.riskScore >= 61;
                  const isMedRisk = item.riskScore >= 31 && item.riskScore < 61;
                  const scoreColor = isHighRisk ? '#f43f5e' : isMedRisk ? '#f97316' : '#22c55e';
                  const isClosed = item.status === 'Closed';

                  const fileBadgeColor = 
                    idx % 3 === 0 ? 'border-rose-300/60 text-rose-500 bg-rose-500/10' :
                    idx % 3 === 1 ? 'border-blue-300/60 text-blue-500 bg-blue-500/10' :
                    'border-emerald-300/60 text-emerald-500 bg-emerald-500/10';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                      onClick={() => handleOpenContractModal(item)}
                    >
                      {/* 1. Contract Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-9 h-10 rounded-xl border flex flex-col items-center justify-center shrink-0 backdrop-blur-sm ${fileBadgeColor}`}>
                            <FileText size={15} />
                            <span className="text-[8px] font-black uppercase leading-tight mt-0.5">
                              {item.fileExt}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-xs sm:text-sm">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                              {item.fileExt.toUpperCase()} • {item.fileSize} • {item.uploadedAt}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 2. Type */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap border backdrop-blur-sm ${item.typeColor}`}>
                          {item.type}
                        </span>
                      </td>

                      {/* 3. Risk Score */}
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center justify-center">
                          <span className="font-black text-slate-900 dark:text-white leading-none block text-sm" style={{ color: scoreColor }}>
                            {item.riskScore}%
                          </span>
                          <span className="text-[10px] font-bold block mt-1" style={{ color: scoreColor }}>
                            {isHighRisk ? 'High Risk' : isMedRisk ? 'Medium Risk' : 'Low Risk'}
                          </span>
                        </div>
                      </td>

                      {/* 4. Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {getStatusBadge(item.status, item.riskScore)}
                      </td>

                      {/* 5. Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2 relative">
                          <button
                            onClick={() => handleOpenContractModal(item)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 font-bold text-xs transition-all border border-purple-300/40 dark:border-purple-700/40 backdrop-blur-md cursor-pointer hover:scale-105"
                            title="Open Contract Details & Specifications"
                          >
                            <Eye size={13} />
                            <span>View Details</span>
                          </button>

                          {/* Close / Reopen Contract Option Button */}
                          <button
                            onClick={() => toggleCloseContract(item.id)}
                            className={`p-2 rounded-xl transition-all border backdrop-blur-sm cursor-pointer hover:scale-105 ${
                              isClosed
                                ? 'text-blue-600 dark:text-blue-400 bg-blue-500/15 border-blue-300/60 dark:border-blue-700/60'
                                : 'text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 border-transparent hover:border-blue-300/40 dark:hover:border-blue-800/40'
                            }`}
                            title={isClosed ? 'Reopen Contract' : 'Close Contract'}
                          >
                            {isClosed ? <ArchiveRestore size={15} /> : <Archive size={15} />}
                          </button>

                          <button
                            onClick={() => handleDownloadReport(item)}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/30 dark:hover:bg-white/10 transition-all border border-transparent hover:border-white/20 backdrop-blur-sm cursor-pointer hover:scale-105"
                            title="Download PDF Report"
                          >
                            <Download size={15} />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
                                deleteContract(item.id);
                              }
                            }}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-300/40 dark:hover:border-rose-800/40 backdrop-blur-sm cursor-pointer hover:scale-105 group"
                            title="Delete contract from history"
                          >
                            <Trash2 size={15} className="group-hover:rotate-12 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer: Count & Pagination */}
          <div className="py-4 px-6 border-t border-white/20 dark:border-white/5 bg-white/20 dark:bg-white/5 flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-slate-400 font-medium">
              Showing 1 to {filteredList.length} of {totalCount} contracts
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-xl liquid-glass-card text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setCurrentPage(1)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  currentPage === 1 
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                    : 'liquid-glass-card text-slate-600 dark:text-slate-300'
                }`}
              >
                1
              </button>
              {totalPages > 1 && (
                <button
                  onClick={() => setCurrentPage(2)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                    currentPage === 2 
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                      : 'liquid-glass-card text-slate-600 dark:text-slate-300'
                  }`}
                >
                  2
                </button>
              )}
              {totalPages > 2 && (
                <button
                  onClick={() => setCurrentPage(3)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                    currentPage === 3 
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                      : 'liquid-glass-card text-slate-600 dark:text-slate-300'
                  }`}
                >
                  3
                </button>
              )}
              {totalPages > 4 && (
                <>
                  <span className="text-slate-400 px-1 text-xs">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      currentPage === totalPages 
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                        : 'liquid-glass-card text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-xl liquid-glass-card text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Small Dialogue Box Modal with 6 Specifications Cards & Summary */}
      <ContractDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        contract={selectedDetailContract}
        isClosed={closedContractIds.has(selectedDetailContract?.id || '') || selectedDetailContract?.status === 'Closed'}
        onToggleClose={toggleCloseContract}
        onOpenDashboard={(contract) => {
          loadContract(contract);
          setCurrentView('dashboard');
        }}
        onDownloadReport={(contract) => {
          generatePdfRiskReport(contract);
        }}
        onDeleteContract={(id) => {
          deleteContract(id);
        }}
      />
    </div>
  );
};
