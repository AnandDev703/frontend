import React, { useState } from 'react';
import { useContract } from '../../context/ContractContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { SUPPORTED_LANGUAGES } from '../../data/riskCategories';
import { SupportedLanguage } from '../../types/contract';
import { useUITranslations } from '../../data/uiTranslations';
import { 
  Globe, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onOpenAuthModal: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuthModal,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const { selectedLanguage, setSelectedLanguage, setCurrentView } = useContract();
  const { theme, toggleTheme } = useTheme();
  const { user, isGuest, logout } = useAuth();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const t = useUITranslations(selectedLanguage);
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-xl transition-all shadow-xs">
      {/* Specular Liquid Top Line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent pointer-events-none" />

      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div 
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 cursor-pointer group md:hidden"
            title="Go to Index / Home Page"
          >
            <img 
              src="/logo.png" 
              alt="ClauseX Logo" 
              className="h-8 w-8 object-contain drop-shadow-md group-hover:scale-105 transition-transform" 
            />
            <div>
              <span className="font-black text-base tracking-tight text-slate-900 dark:text-white">
                ClauseX
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex items-center gap-2 sm:gap-2.5 ml-auto">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-all shadow-xs cursor-pointer backdrop-blur-md"
              title="Change Interface & Explanation Language"
            >
              <Globe size={13} className="text-purple-600 dark:text-purple-400" />
              <span>{currentLangObj.flag} {currentLangObj.nativeName}</span>
              <ChevronDown size={12} className="text-slate-400 opacity-70" />
            </button>

            {langDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 rounded-2xl bg-white/95 dark:bg-[#0c1222]/95 shadow-2xl border border-slate-200/80 dark:border-white/10 py-1.5 z-50 text-xs animate-fade-in backdrop-blur-xl"
                onMouseLeave={() => setLangDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-white/10 mb-1">
                  {t('translate_explanations')}
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.code as SupportedLanguage);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${
                      selectedLanguage === lang.code ? 'font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </span>
                    {selectedLanguage === lang.code && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-all shadow-xs cursor-pointer backdrop-blur-md"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun size={15} className="text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon size={15} className="text-purple-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* User Profile / Auth Button */}
          {user && !isGuest ? (() => {
            const initialLetter = (
              user.email ? user.email.trim().charAt(0) :
              user.displayName ? user.displayName.trim().charAt(0) :
              user.username ? user.username.trim().charAt(0) :
              'U'
            ).toUpperCase();

            const displayName = user.displayName || user.username || (user.email ? user.email.split('@')[0] : 'User');

            return (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200/80 dark:border-purple-800/60 transition-all shadow-xs cursor-pointer backdrop-blur-md"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={displayName} className="w-6 h-6 rounded-full object-cover border border-purple-400" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-black text-xs shadow-xs uppercase">
                      {initialLetter}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-bold text-purple-950 dark:text-purple-200 max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown size={12} className="text-purple-400 opacity-70" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-2xl bg-white/95 dark:bg-[#0c1222]/95 shadow-2xl border border-slate-200/80 dark:border-white/10 py-1.5 z-50 text-xs animate-fade-in backdrop-blur-xl"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10 mb-1">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
                      {user.email && <p className="text-[10px] text-slate-400 truncate">{user.email}</p>}
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer font-bold"
                    >
                      <LogOut size={13} />
                      <span>{t('auth_logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })() : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <User size={13} />
              <span>{t('auth_signin')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
