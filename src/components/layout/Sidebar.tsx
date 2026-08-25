import React, { useState } from 'react';
import { useContract, AppView } from '../../context/ContractContext';
import { useUITranslations } from '../../data/uiTranslations';
import { 
  LayoutDashboard, 
  Bot, 
  BookOpen, 
  GitCompare, 
  HelpCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const { currentView, setCurrentView, selectedLanguage } = useContract();
  const t = useUITranslations(selectedLanguage);

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const navItems = [
    { id: 'history' as AppView, label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'upload' as AppView, label: 'Analyze Contract', icon: <BookOpen size={18} /> },
    { id: 'chat' as AppView, label: 'AI Assistant', icon: <Bot size={18} /> },
    { id: 'compare' as AppView, label: 'Comparison', icon: <GitCompare size={18} /> },
  ];

  const handleNav = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 shrink-0 border-r border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#070b14]/90 text-slate-800 dark:text-slate-300 flex flex-col justify-between transition-all duration-300 ease-in-out md:translate-x-0 backdrop-blur-2xl shadow-xl ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Specular Liquid Top Line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent pointer-events-none" />

        {/* Top: Logo Brand & Nav */}
        <div>
          {/* Logo Header */}
          <div className="h-16 flex items-center px-5 border-b border-slate-100 dark:border-white/10">
            <div 
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-3 cursor-pointer group"
              title="Go to Index / Home Page"
            >
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="ClauseX Logo" 
                  className="h-8 w-8 object-contain drop-shadow-md group-hover:scale-105 transition-transform" 
                />
                <div className="absolute -inset-1 bg-purple-500/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base tracking-tight text-slate-900 dark:text-white">
                    ClauseX
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-300/40">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-[#8a99ad] font-semibold leading-none mt-0.5">
                  Understand Before You Sign
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items List */}
          <nav className="space-y-1.5 p-4">
            {navItems.map((item, idx) => {
              const isActive = currentView === item.id || (item.id === 'upload' && currentView === 'dashboard');
              return (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative overflow-hidden group ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5'
                  }`}
                >
                  {/* Specular Highlight for Active Item */}
                  {isActive && (
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
                  )}

                  <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Help & Security Badge */}
        <div className="p-4 border-t border-slate-100 dark:border-white/10 space-y-3">
          {/* Privacy Capsule */}
          <div className="p-3 rounded-2xl liquid-glass-card space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-purple-600 dark:text-purple-400">
              <ShieldCheck size={14} />
              <span>100% Private & Secure</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-[#8a99ad] leading-relaxed">
              Documents are processed with authenticated zero-retention AI guards.
            </p>
          </div>

          {/* Help Button */}
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
          >
            <HelpCircle size={15} />
            <span>Need Help?</span>
          </button>
        </div>
      </aside>

      {/* Help Modal */}
      <Modal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title="About ClauseX"
      >
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong className="text-slate-900 dark:text-white">ClauseX</strong> is an advanced AI contract risk intelligence platform designed to help you analyze, understand, and negotiate contracts safely.
          </p>
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1">
            <p className="font-bold text-purple-900 dark:text-purple-300 text-xs">How it works:</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs text-purple-800 dark:text-purple-300">
              <li>Upload your contract (PDF or DOCX).</li>
              <li>Select your perspective (Employee, Freelancer, Tenant, etc.).</li>
              <li>Get immediate, colored-coded risk detection, plain-English translations, and actionable renegotiation counter-offers.</li>
            </ul>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            Disclaimer: ClauseX is an AI legal assistant designed for informational and educational purposes. Always consult licensed legal counsel for binding legal decisions.
          </p>
        </div>
      </Modal>
    </>
  );
};
export default Sidebar;
