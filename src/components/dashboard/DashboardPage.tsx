import React, { useState } from 'react';
import { useContract } from '../../context/ContractContext';
import { useUITranslations } from '../../data/uiTranslations';
import { DocumentSummaryBanner } from '../analysis/DocumentSummaryBanner';
import { OverallRiskScoreCard } from '../analysis/OverallRiskScoreCard';
import { CategoryRadarChart } from '../analysis/CategoryRadarChart';
import { ClauseRiskDonutChart } from '../analysis/ClauseRiskDonutChart';
import { RiskLevelCard } from '../analysis/RiskLevelCard';
import { HighlightedRiskModal } from '../analysis/HighlightedRiskModal';
import { QuickActionsCard } from '../analysis/QuickActionsCard';
import { ClauseAnalysis } from '../../types/contract';
import { generatePdfRiskReport } from '../../services/pdfReportService';
import { 
  Download, 
  PlusCircle, 
  FileUp,
  Layers,
  Highlighter,
  Trash2,
  Sparkles
} from 'lucide-react';

interface DashboardPageProps {
  onAskAIAboutClause: (clause: ClauseAnalysis) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onAskAIAboutClause
}) => {
  const { activeContract, setSelectedClause, setCurrentView, deleteContract, selectedLanguage } = useContract();
  const t = useUITranslations(selectedLanguage);
  const [isHighlightModalOpen, setIsHighlightModalOpen] = useState(false);

  const handleSelectClause = (clause: ClauseAnalysis) => {
    setSelectedClause(clause);
    onAskAIAboutClause(clause);
  };

  if (!activeContract) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl liquid-glass-card text-center space-y-4 shadow-2xl animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />
        <div className="w-14 h-14 mx-auto rounded-3xl bg-purple-500/15 border border-purple-300/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <FileUp size={26} />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          {t('no_contract_banner_title')}
        </h3>
        <p className="text-xs text-slate-600 dark:text-[#8a99ad] max-w-sm mx-auto leading-relaxed">
          {t('no_contract_banner_sub')}
        </p>
        <button
          onClick={() => setCurrentView('upload')}
          className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-2"
        >
          <PlusCircle size={15} />
          <span>{t('cta_analyze')}</span>
        </button>
      </div>
    );
  }

  // Group clauses dynamically into High, Medium, and Low risk tiers, strictly ranked by calculated risk score
  const allClauses = React.useMemo(() => {
    return [...(activeContract.clauses || [])].sort((a, b) => b.riskScore - a.riskScore);
  }, [activeContract.clauses]);

  const highRiskClauses = allClauses.filter(c => c.riskScore >= 61 || c.riskLevel === 'HIGH');
  const mediumRiskClauses = allClauses.filter(c => c.riskScore >= 31 && c.riskScore < 61 && c.riskLevel !== 'HIGH');
  const lowRiskClauses = allClauses.filter(c => c.riskScore < 31 && c.riskLevel !== 'HIGH');

  const highlightLabel = selectedLanguage === 'ta' ? 'அபாயக் குறிப்புகள்' :
    selectedLanguage === 'hi' ? 'हाइलाइट किए गए जोखिम' :
    selectedLanguage === 'te' ? 'హైలైట్ చేసిన నష్టాలు' :
    selectedLanguage === 'ml' ? 'ഹൈലൈറ്റ് ചെയ്ത അപകടങ്ങൾ' :
    'Highlighted Risks';

  const dashboardHeading = selectedLanguage === 'ta' ? 'ஒப்பந்த பகுப்பாய்வு டாஷ்போர்டு' :
    selectedLanguage === 'hi' ? 'अनुबंध विश्लेषण डैशबोर्ड' :
    selectedLanguage === 'te' ? 'ఒప్పంద విశ్లేషణ డాష్‌బోర్డ్' :
    selectedLanguage === 'ml' ? 'കരാർ വിശകലന ഡാഷ്‌ബോർഡ്' :
    'Analysis Dashboard';

  const findingsHeading = selectedLanguage === 'ta' ? `வகைப்படுத்தப்பட்ட விதிமுறைகள் (${allClauses.length} வரிசைப்படுத்தப்பட்டது)` :
    selectedLanguage === 'hi' ? `वर्गीकृत खंड निष्कर्ष (${allClauses.length} रैंक किए गए)` :
    selectedLanguage === 'te' ? `వర్గీకరించిన నిబంధనలు (${allClauses.length} ర్యాంక్ చేయబడింది)` :
    selectedLanguage === 'ml' ? `വർഗ്ഗീകരിച്ച നിബന്ധനകൾ (${allClauses.length} റാങ്ക് ചെയ്‌തത്)` :
    `Categorized Clause Findings (${allClauses.length} Ranked)`;

  const deleteLabel = selectedLanguage === 'ta' ? 'நீக்கு' :
    selectedLanguage === 'hi' ? 'हटाएं' :
    selectedLanguage === 'te' ? 'తొలగించు' :
    selectedLanguage === 'ml' ? 'ഇല്ലാതാക്കുക' :
    'Delete';

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-7xl mx-auto">
      {/* 1. Top Header Bar with Liquid Glass */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl liquid-glass-card shadow-2xl transition-all">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {dashboardHeading}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-300/40 uppercase">
              {activeContract.userRole} {t('perspective')}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#8a99ad] font-medium mt-0.5">
            {activeContract.contractName} • {activeContract.clauses?.length || 0} {t('total_evaluated')}
          </p>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          {/* Highlighted Risks Button */}
          <button
            onClick={() => setIsHighlightModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 border border-purple-300/50 text-xs font-bold shadow-sm transition-all cursor-pointer group"
          >
            <Highlighter size={14} className="text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform" />
            <span>{highlightLabel}</span>
          </button>

          {/* Export Report Button */}
          <button
            onClick={() => generatePdfRiskReport(activeContract)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl liquid-glass-card hover:border-purple-400 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Download size={14} className="text-slate-600 dark:text-slate-300" />
            <span>{t('btn_download_report')}</span>
          </button>

          {/* Delete Contract Button */}
          <button
            onClick={async () => {
              if (window.confirm(`Are you sure you want to delete "${activeContract.contractName}"?`)) {
                await deleteContract(activeContract.id);
                setCurrentView('history');
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl liquid-glass-card hover:border-rose-400 hover:text-rose-600 text-slate-500 dark:text-slate-400 text-xs font-bold shadow-sm transition-colors cursor-pointer"
            title="Delete this contract from history"
          >
            <Trash2 size={14} />
            <span>{deleteLabel}</span>
          </button>

          {/* New Analysis Button */}
          <button
            onClick={() => setCurrentView('upload')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-purple-500/25 transition-all transform hover:scale-105 cursor-pointer"
          >
            <PlusCircle size={14} />
            <span>{t('btn_upload_another')}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Document Summary Banner */}
      <DocumentSummaryBanner 
        contract={activeContract} 
      />

      {/* 3. Top Metrics Row (Overall Risk Score, Risk by Category Radar, Clause Donut Distribution) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <OverallRiskScoreCard 
          contract={activeContract} 
        />
        <CategoryRadarChart 
          contract={activeContract} 
        />
        <ClauseRiskDonutChart 
          contract={activeContract} 
        />
      </div>

      {/* 4. Dynamic Risk Tier Findings (HIGH / MEDIUM / LOW strictly ranked) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-purple-600 dark:text-purple-400" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              {findingsHeading}
            </h2>
          </div>

          <button
            onClick={() => setIsHighlightModalOpen(true)}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 flex items-center gap-1 cursor-pointer"
          >
            <Highlighter size={13} />
            <span>{highlightLabel}</span>
          </button>
        </div>

        {/* High Risk Tier */}
        {highRiskClauses.length > 0 && (
          <RiskLevelCard
            level="HIGH"
            clauses={highRiskClauses}
            rankOffset={1}
            onSelectClause={handleSelectClause}
          />
        )}

        {/* Medium Risk Tier */}
        {mediumRiskClauses.length > 0 && (
          <RiskLevelCard
            level="MEDIUM"
            clauses={mediumRiskClauses}
            rankOffset={highRiskClauses.length + 1}
            onSelectClause={handleSelectClause}
          />
        )}

        {/* Low Risk Tier */}
        {lowRiskClauses.length > 0 && (
          <RiskLevelCard
            level="LOW"
            clauses={lowRiskClauses}
            rankOffset={highRiskClauses.length + mediumRiskClauses.length + 1}
            onSelectClause={handleSelectClause}
          />
        )}
      </div>

      {/* 5. Interactive PDF Highlight Modal */}
      {isHighlightModalOpen && (
        <HighlightedRiskModal
          isOpen={isHighlightModalOpen}
          onClose={() => setIsHighlightModalOpen(false)}
          contract={activeContract}
          onSelectClause={handleSelectClause}
        />
      )}
    </div>
  );
};
export default DashboardPage;
