import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { AuthModal } from '../auth/AuthModal';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7fb] dark:bg-[#060913] text-slate-900 dark:text-slate-100 flex font-sans transition-colors duration-300 overflow-hidden relative selection:bg-purple-500 selection:text-white">
      {/* ============================================================ */}
      {/* AMBIENT LIQUID GLASS LIGHTING & MORPHING REFRACTION BLOBS   */}
      {/* ============================================================ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-40 left-1/4 w-[650px] h-[550px] bg-gradient-to-br from-purple-600/25 via-indigo-500/20 to-transparent dark:from-purple-600/30 dark:via-indigo-600/20 rounded-full blur-[130px] liquid-blob-1" />
        
        {/* Ambient Right Glow */}
        <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-gradient-to-bl from-pink-500/15 via-purple-600/20 to-transparent dark:from-pink-600/20 dark:via-purple-800/25 rounded-full blur-[140px] liquid-blob-2" />
        
        {/* Ambient Bottom Left Glow */}
        <div className="absolute -bottom-40 left-10 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-sky-500/15 to-transparent dark:from-indigo-900/30 dark:via-purple-950/30 rounded-full blur-[150px] liquid-blob-3" />

        {/* Liquid Glass Radial Mesh Background Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.18),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(6,9,19,0))]" />
      </div>

      {/* Left Sidebar spanning full height from top 0 */}
      <div className="relative z-20 shrink-0">
        <Sidebar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </div>

      {/* Right Content Area with Top Navbar */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        {/* Top Navbar */}
        <Navbar
          onOpenAuthModal={() => setIsAuthOpen(true)}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Scrollable Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto w-full scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
};
export default Layout;
