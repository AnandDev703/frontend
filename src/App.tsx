import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ContractProvider, useContract } from './context/ContractContext';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './components/landing/LandingPage';
import { UploadZone } from './components/upload/UploadZone';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { ContractCompare } from './components/compare/ContractCompare';
import { ContractHistory } from './components/history/ContractHistory';
import { ContractChat } from './components/chat/ContractChat';
import { CallbackPage } from './components/auth/CallbackPage';
import { ClauseAnalysis } from './types/contract';

const MainAppContent: React.FC = () => {
  const { currentView, setCurrentView } = useContract();
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // When /callback route is reached, render ONLY the dedicated CallbackPage without Layout, Sidebar, or Navbar
  if (pathname === '/callback' || pathname.startsWith('/callback')) {
    return <CallbackPage />;
  }

  const handleAskAIAboutClause = (clause: ClauseAnalysis) => {
    setChatInitialPrompt(`Can you explain why ${clause.clauseNumber} (${clause.category}) is considered risky, and what counter-proposal I should negotiate?`);
    setCurrentView('chat');
  };

  return (
    <Layout>
      <div key={currentView} className="page-transition w-full">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'upload' && <UploadZone />}
        {currentView === 'dashboard' && (
          <DashboardPage onAskAIAboutClause={handleAskAIAboutClause} />
        )}
        {currentView === 'compare' && <ContractCompare />}
        {currentView === 'history' && <ContractHistory />}
        {currentView === 'chat' && (
          <ContractChat
            initialPrompt={chatInitialPrompt}
            onClearInitialPrompt={() => setChatInitialPrompt('')}
          />
        )}
      </div>
    </Layout>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ContractProvider>
          <MainAppContent />
        </ContractProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
