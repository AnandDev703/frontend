import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ContractAnalysis,
  ClauseAnalysis,
  UserRole,
  SupportedLanguage,
  ChatMessage
} from '../types/contract';

import {
  saveContractAnalysis,
  loadContractHistory,
  deleteContractFromHistory,
  closeContractInHistory,
  restoreContractInHistory,
  clearAllContractsFromHistory
} from '../services/storageService';

export type AppView =
  | 'landing'
  | 'upload'
  | 'dashboard'
  | 'compare'
  | 'history'
  | 'chat';

interface ContractContextType {
  // Current contract data
  activeContract: ContractAnalysis | null;
  selectedClause: ClauseAnalysis | null;

  // User settings
  userRole: UserRole;
  selectedLanguage: SupportedLanguage;

  // Contract history
  contractHistory: ContractAnalysis[];

  // UI state
  isAnalyzing: boolean;
  analysisStep: number;
  analysisStatusText: string;
  currentView: AppView;

  // Comparison
  compareA: ContractAnalysis | null;
  compareB: ContractAnalysis | null;

  // AI chat
  chatMessages: ChatMessage[];

  // Actions
  setUserRole: (role: UserRole) => void;
  setSelectedLanguage: (lang: SupportedLanguage) => void;
  setCurrentView: (view: AppView) => void;
  setSelectedClause: (clause: ClauseAnalysis | null) => void;

  // Called after UploadZone receives backend result
  loadContract: (contract: ContractAnalysis, navigateToView?: AppView | null) => void;
  selectContract: (contract: ContractAnalysis) => void;

  // History
  deleteContract: (id: string) => Promise<void>;
  deleteHistoryItem: (id: string) => Promise<void>;
  closeContract: (id: string) => Promise<void>;
  restoreContract: (id: string) => Promise<void>;
  clearAllHistory: () => Promise<void>;
  refreshHistory: () => Promise<void>;

  // Comparison
  setComparison: (
    a: ContractAnalysis | null,
    b: ContractAnalysis | null
  ) => void;

  // Chat
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
}

const ContractContext = createContext<ContractContextType | undefined>(
  undefined
);

export const ContractProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  /*
   * ============================================================
   * CORE CONTRACT STATE
   * ============================================================
   */

  const [activeContract, setActiveContract] =
    useState<ContractAnalysis | null>(null);

  const [selectedClause, setSelectedClause] =
    useState<ClauseAnalysis | null>(null);

  /*
   * ============================================================
   * USER SETTINGS
   * ============================================================
   */

  const [userRole, setUserRole] =
    useState<UserRole>('freelancer');

  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguage>('en');

  /*
   * ============================================================
   * CONTRACT HISTORY
   * ============================================================
   */

  const [contractHistory, setContractHistory] =
    useState<ContractAnalysis[]>([]);

  /*
   * ============================================================
   * UI / ANALYSIS STATE
   *
   * UploadZone controls the actual backend request.
   * These values are kept only for UI compatibility.
   * ============================================================
   */

  const [isAnalyzing, setIsAnalyzing] =
    useState<boolean>(false);

  const [analysisStep, setAnalysisStep] =
    useState<number>(0);

  const [analysisStatusText, setAnalysisStatusText] =
    useState<string>('');

  const [currentView, setCurrentView] =
    useState<AppView>('landing');

  /*
   * ============================================================
   * CONTRACT COMPARISON
   * ============================================================
   */

  const [compareA, setCompareA] =
    useState<ContractAnalysis | null>(null);

  const [compareB, setCompareB] =
    useState<ContractAnalysis | null>(null);

  /*
   * ============================================================
   * AI CHAT
   * ============================================================
   */

  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>([
      {
        id: 'welcome-msg',
        sender: 'ai',
        text:
          'Hello! I am your AI Contract Risk Assistant. Once you upload and analyze a contract, you can ask me anything about risky clauses, liabilities, termination rights, and payment terms.',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    ]);

  /*
   * ============================================================
   * LOAD SAVED CONTRACT HISTORY
   * ============================================================
   */

  useEffect(() => {
    refreshHistory();
  }, []);

  const refreshHistory = async () => {
    try {
      const history = await loadContractHistory();

      setContractHistory(history);

      /*
       * If there is no active contract yet,
       * automatically use the most recent saved contract.
       */
      if (history.length > 0 && !activeContract) {
        const latestContract = history[0];

        setActiveContract(latestContract);

        if (latestContract.clauses?.length) {
          const highestRiskClause = [...latestContract.clauses].sort(
            (a, b) => b.riskScore - a.riskScore
          )[0];

          setSelectedClause(highestRiskClause);
        } else {
          setSelectedClause(null);
        }
      }
    } catch (error) {
      console.error(
        '[ContractContext] Failed to load contract history:',
        error
      );
    }
  };

  /*
   * ============================================================
   * LOAD NEW BACKEND ANALYSIS
   *
   * UploadZone calls:
   *
   *   loadContract(contractResult)
   *
   * The backend result becomes the application's
   * active contract here.
   *
   * Dashboard and other UI components that use
   * useContract() will automatically re-render.
   * ============================================================
   */

  const selectContract = (contract: ContractAnalysis) => {
    console.log('[ContractContext] Selecting contract for chat/inspect without redirect:', contract.id);
    setActiveContract(contract);

    if (contract.clauses?.length) {
      const highestRiskClause = [...contract.clauses].sort(
        (a, b) => b.riskScore - a.riskScore
      )[0];
      setSelectedClause(highestRiskClause);
    } else {
      setSelectedClause(null);
    }

    /*
     * Reset chat messages for the newly selected contract so previous messages go away
     */
    setChatMessages([
      {
        id: `contract-welcome-${Date.now()}`,
        sender: 'ai',
        text:
          `I have loaded "${contract.contractName}". ` +
          `Risk Score: ${contract.overallRiskScore}% (${contract.riskLevel} Risk). ` +
          `${contract.clauses?.length || 0} clauses evaluated. ` +
          `What would you like to know or negotiate in this contract?`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    ]);
  };

  const loadContract = (contract: ContractAnalysis, navigateToView: AppView | null = 'dashboard') => {
    console.log(
      '[ContractContext] Loading backend contract:',
      contract
    );

    setActiveContract(contract);

    if (contract.clauses?.length) {
      const highestRiskClause = [...contract.clauses].sort(
        (a, b) => b.riskScore - a.riskScore
      )[0];

      setSelectedClause(highestRiskClause);
    } else {
      setSelectedClause(null);
    }

    /*
     * Reset chat for the new contract.
     */
    setChatMessages([
      {
        id: `contract-welcome-${Date.now()}`,
        sender: 'ai',
        text:
          `I have loaded "${contract.contractName}". ` +
          `Risk Score: ${contract.overallRiskScore}% (${contract.riskLevel} Risk). ` +
          `${contract.clauses?.length || 0} clauses evaluated. ` +
          `What would you like to know or negotiate in this contract?`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    ]);

    /*
     * Move application to requested view if specified.
     */
    if (navigateToView) {
      setCurrentView(navigateToView);
    }
  };

  /*
   * ============================================================
   * DELETE CONTRACT FROM HISTORY
   * ============================================================
   */

  const deleteHistoryItem = async (id: string) => {
    try {
      await deleteContractFromHistory(id);

      /*
       * Reload history from storage.
       */
      const history = await loadContractHistory();

      setContractHistory(history);

      /*
       * If deleted contract was active,
       * switch to another saved contract.
       */
      if (activeContract?.id === id) {
        if (history.length > 0) {
          const nextContract = history[0];

          setActiveContract(nextContract);

          if (nextContract.clauses?.length) {
            const highestRiskClause = [...nextContract.clauses].sort(
              (a, b) => b.riskScore - a.riskScore
            )[0];

            setSelectedClause(highestRiskClause);
          } else {
            setSelectedClause(null);
          }
        } else {
          setActiveContract(null);
          setSelectedClause(null);
        }
      }
    } catch (error) {
      console.error(
        '[ContractContext] Failed to delete contract:',
        error
      );
      throw error;
    }
  };

  /*
   * ============================================================
   * CLOSE CONTRACT (PATCH /api/reports/:id/close)
   * ============================================================
   */
  const closeContract = async (id: string) => {
    try {
      await closeContractInHistory(id);
      const history = await loadContractHistory();
      setContractHistory(history);
      if (activeContract?.id === id) {
        setActiveContract(prev => prev ? { ...prev, status: 'Closed' } : null);
      }
    } catch (error) {
      console.error('[ContractContext] Failed to close contract:', error);
      throw error;
    }
  };

  /*
   * ============================================================
   * RESTORE CONTRACT (PATCH /api/reports/:id/restore)
   * ============================================================
   */
  const restoreContract = async (id: string) => {
    try {
      await restoreContractInHistory(id);
      const history = await loadContractHistory();
      setContractHistory(history);
      if (activeContract?.id === id) {
        setActiveContract(prev => prev ? { ...prev, status: prev.overallRiskScore >= 61 ? 'Risk Detected' : prev.overallRiskScore >= 31 ? 'Needs Review' : 'In Progress' } : null);
      }
    } catch (error) {
      console.error('[ContractContext] Failed to restore contract:', error);
      throw error;
    }
  };

  /*
   * ============================================================
   * CLEAR ALL HISTORY
   * ============================================================
   */

  const clearAllHistory = async () => {
    try {
      await clearAllContractsFromHistory();

      setContractHistory([]);
      setActiveContract(null);
      setSelectedClause(null);
      setCompareA(null);
      setCompareB(null);
    } catch (error) {
      console.error(
        '[ContractContext] Failed to clear history:',
        error
      );
    }
  };

  /*
   * ============================================================
   * CONTRACT COMPARISON
   * ============================================================
   */

  const setComparison = (
    a: ContractAnalysis | null,
    b: ContractAnalysis | null
  ) => {
    setCompareA(a);
    setCompareB(b);
  };

  /*
   * ============================================================
   * AI CHAT
   * ============================================================
   */

  const addChatMessage = (msg: ChatMessage) => {
    setChatMessages((previous) => [
      ...previous,
      msg
    ]);
  };

  const clearChat = () => {
    if (activeContract) {
      setChatMessages([
        {
          id: `cleared-${Date.now()}`,
          sender: 'ai',
          text:
            `Chat history cleared. You can ask any question about "${activeContract.contractName}".`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      ]);
    } else {
      setChatMessages([]);
    }
  };

  /*
   * ============================================================
   * PROVIDER
   * ============================================================
   */

  return (
    <ContractContext.Provider
      value={{
        activeContract,
        selectedClause,

        userRole,
        selectedLanguage,

        contractHistory,

        isAnalyzing,
        analysisStep,
        analysisStatusText,

        currentView,

        compareA,
        compareB,

        chatMessages,

        setUserRole,
        setSelectedLanguage,
        setCurrentView,
        setSelectedClause,

        loadContract,
        selectContract,

        deleteContract: deleteHistoryItem,
        deleteHistoryItem,
        closeContract,
        restoreContract,
        clearAllHistory,
        refreshHistory,

        setComparison,

        addChatMessage,
        clearChat
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

/*
 * ================================================================
 * HOOK
 * ================================================================
 */

export const useContract = () => {
  const context = useContext(ContractContext);

  if (!context) {
    throw new Error(
      'useContract must be used within a ContractProvider'
    );
  }

  return context;
};