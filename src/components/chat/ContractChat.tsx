import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useContract } from '../../context/ContractContext';
import { askReportQuestion } from '../../services/backendApiService';
import { ChatMessage, ClauseAnalysis, ContractAnalysis } from '../../types/contract';
import { useUITranslations } from '../../data/uiTranslations';
import { Modal } from '../common/Modal';
import { 
  Send, 
  User, 
  Trash2, 
  ArrowUpRight,
  Loader2,
  Sparkles,
  Bot,
  FileText,
  MessageSquare,
  Copy,
  Check,
  ShieldAlert,
  Scale,
  PlusCircle,
  Search,
  ChevronRight,
  Flame,
  CheckCircle2,
  FolderOpen,
  RotateCw,
  HelpCircle
} from 'lucide-react';

interface ContractChatProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const ContractChat: React.FC<ContractChatProps> = ({
  initialPrompt,
  onClearInitialPrompt
}) => {
  const { 
    activeContract, 
    contractHistory,
    selectContract,
    chatMessages, 
    addChatMessage, 
    clearChat, 
    setCurrentView,
    selectedLanguage 
  } = useContract();
  const t = useUITranslations(selectedLanguage);

  const [inputQuery, setInputQuery] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [contractSearch, setContractSearch] = useState<string>('');
  const [mobileListOpen, setMobileListOpen] = useState<boolean>(false);
  const [inspectedClause, setInspectedClause] = useState<ClauseAnalysis | null>(null);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Default to first contract if none active
  useEffect(() => {
    if (!activeContract && contractHistory.length > 0) {
      selectContract(contractHistory[0]);
    }
  }, [activeContract, contractHistory, selectContract]);

  useEffect(() => {
    if (initialPrompt) {
      setInputQuery(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt, onClearInitialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentContract = activeContract || contractHistory[0];

  // Dynamically fetch tailored questions from the chat API for this specific contract
  const fetchDynamicSuggestions = useCallback(async (contract: ContractAnalysis) => {
    if (!contract || !contract.id) return;
    setIsLoadingSuggestions(true);

    try {
      const prompt = `Based on this contract, generate exactly 4 short, specific, high-risk questions I should ask about its clauses. Return ONLY the 4 questions, one question per line, with no introductory text.`;
      const response = await askReportQuestion(contract.id, prompt);

      if (response && response.text) {
        const lines = response.text
          .split('\n')
          .map(line => line.replace(/^[\d\.\-\*\•\s"']+|["']+$/g, '').trim())
          .filter(line => line.length > 10 && line.length < 130 && !line.toLowerCase().startsWith('here are') && !line.toLowerCase().startsWith('based on'));

        if (lines.length >= 2) {
          setDynamicSuggestions(lines.slice(0, 4));
          return;
        }
      }
    } catch (err) {
      console.warn('[ContractChat] Could not generate dynamic suggestions from API:', err);
    } finally {
      setIsLoadingSuggestions(false);
    }

    // Contextual fallback questions
    setDynamicSuggestions([
      'How much am I getting paid for this work?',
      'Can I terminate this contract early without paying penalties?',
      'What is my maximum legal liability exposure?',
      'Who owns the software code and intellectual property?'
    ]);
  }, []);

  // Fetch dynamic suggestions whenever the active contract changes
  useEffect(() => {
    if (currentContract?.id) {
      fetchDynamicSuggestions(currentContract);
    }
  }, [currentContract?.id, fetchDynamicSuggestions]);

  // Filter available contracts
  const filteredContracts = contractHistory.filter((c) => 
    c.contractName.toLowerCase().includes(contractSearch.toLowerCase()) ||
    c.contractType.toLowerCase().includes(contractSearch.toLowerCase()) ||
    c.userRole.toLowerCase().includes(contractSearch.toLowerCase())
  );

  // Switch active contract WITHOUT navigating away from chat
  const handleSelectContract = (contract: ContractAnalysis) => {
    selectContract(contract);
    setMobileListOpen(false);
  };

  // If no contracts exist in account history
  if (contractHistory.length === 0 && !activeContract) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl liquid-glass-card text-center space-y-5 shadow-2xl animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />
        
        <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-500/15 border border-purple-300/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Bot size={32} />
        </div>

        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            AI Contract Assistant
          </h3>
          <p className="text-xs text-slate-600 dark:text-[#8a99ad] max-w-sm mx-auto mt-1 leading-relaxed font-medium">
            To ask questions, negotiate counter-proposals, or check liability traps, please upload a contract first.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setCurrentView('upload')}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-2"
          >
            <PlusCircle size={15} />
            <span>Upload Contract</span>
          </button>
        </div>
      </div>
    );
  }

  // Core function to send question to Backend Chat API POST /api/reports/:reportId/question
  const handleSendPrompt = async (promptToSend: string) => {
    if (!promptToSend.trim() || isLoading || !currentContract) return;

    const userText = promptToSend.trim();
    setInputQuery('');

    // 1. Show user's question immediately
    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addChatMessage(userMsg);
    setIsLoading(true);

    try {
      // 2. Send question to POST /api/reports/:reportId/question with { question }
      const aiResponse = await askReportQuestion(currentContract.id, userText);
      
      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: aiResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      addChatMessage(aiMsg);
    } catch (err: any) {
      console.error("QUESTION API REQUEST\nreportId:", currentContract.id, "\nquestion:", userText);
      console.error("QUESTION API ERROR\n", err);

      const errorAiMsg: ChatMessage = {
        id: 'ai-err-' + Date.now(),
        sender: 'ai',
        text: "I couldn't get an answer right now. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      addChatMessage(errorAiMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleSendPrompt(inputQuery);
  };

  const handleClauseClick = (clauseNum: string) => {
    if (!currentContract) return;
    const target = currentContract.clauses?.find(
      c => c.clauseNumber.toLowerCase() === clauseNum.toLowerCase() ||
           clauseNum.toLowerCase().includes(c.clauseNumber.toLowerCase())
    );
    if (target) {
      setInspectedClause(target);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-8 animate-fade-in px-1 sm:px-2">
      {/* Split Interface: Left Contract List + Right Chat Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ============================================================ */}
        {/* 1. LEFT SIDEBAR: CONTRACT LIST SELECTOR                      */}
        {/* ============================================================ */}
        <div className={`lg:col-span-4 rounded-3xl liquid-glass-card shadow-2xl overflow-hidden relative transition-all ${
          mobileListOpen ? 'block' : 'hidden lg:block'
        }`}>
          {/* Specular Liquid Top Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />

          {/* List Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen size={16} className="text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Contracts
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-300/40">
                {contractHistory.length} Available
              </span>
            </div>

            {/* Contract Search Input */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={contractSearch}
                onChange={(e) => setContractSearch(e.target.value)}
                placeholder="Search contracts..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0c1222]/80 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-purple-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Contracts Scrollable List */}
          <div className="p-3 space-y-2 max-h-[480px] lg:max-h-[520px] overflow-y-auto">
            {filteredContracts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No matching contracts found.</p>
            ) : (
              filteredContracts.map((c) => {
                const isActive = currentContract?.id === c.id;
                const isHighRisk = c.overallRiskScore >= 61;
                const isMedRisk = c.overallRiskScore >= 31 && c.overallRiskScore < 61;
                const scoreColor = isHighRisk ? '#f43f5e' : isMedRisk ? '#f97316' : '#22c55e';

                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectContract(c)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all relative group overflow-hidden border ${
                      isActive
                        ? 'bg-purple-500/15 border-purple-400/80 shadow-md shadow-purple-500/20'
                        : 'liquid-glass border-slate-200/80 dark:border-white/10 hover:border-purple-400/50 hover:bg-slate-100/80 dark:hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-600" />
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <FileText size={13} className={isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'} />
                          <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {c.contractName}
                          </h4>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-bold px-2 py-0.2 rounded-md bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-slate-300 uppercase">
                            {c.userRole}
                          </span>
                          <span className="text-[9px] font-medium text-slate-400">
                            {c.clauses?.length || 0} Clauses
                          </span>
                        </div>
                      </div>

                      {/* Risk Score Pill */}
                      <span 
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black border shrink-0"
                        style={{
                          backgroundColor: `${scoreColor}15`,
                          color: scoreColor,
                          borderColor: `${scoreColor}40`
                        }}
                      >
                        {c.overallRiskScore}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Upload CTA at sidebar bottom */}
          <div className="p-3 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
            <button
              onClick={() => setCurrentView('upload')}
              className="w-full py-2.5 rounded-2xl liquid-glass-card hover:border-purple-400 text-xs font-black text-purple-600 dark:text-purple-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PlusCircle size={14} />
              <span>Upload New Contract</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. RIGHT PANEL: AI CHAT CONSOLE                             */}
        {/* ============================================================ */}
        <div className="lg:col-span-8 space-y-4">
          {/* Header */}
          <div className="relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl liquid-glass-card shadow-2xl transition-all">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />

            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-300/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-md shadow-purple-500/20">
                  <Bot size={22} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0c1222]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
                    {currentContract?.contractName || 'AI Assistant'}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-300/40 uppercase shrink-0">
                    {currentContract?.userRole} PERSPECTIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#8a99ad] font-medium mt-0.5">
                  Risk Score: {currentContract?.overallRiskScore}% ({currentContract?.riskLevel}) • Report #{currentContract?.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Mobile Contract Switcher Toggle */}
              <button
                onClick={() => setMobileListOpen(!mobileListOpen)}
                className="lg:hidden px-3 py-1.5 rounded-xl liquid-glass-card text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                <FolderOpen size={13} className="text-purple-600" />
                <span>Contracts ({contractHistory.length})</span>
              </button>

              <button
                onClick={clearChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
                title="Clear Conversation History"
              >
                <Trash2 size={13} />
                <span className="hidden sm:inline">{t('chat_clear')}</span>
              </button>
            </div>
          </div>

          {/* Main Chat Container */}
          <div className="relative overflow-hidden rounded-3xl liquid-glass-card shadow-2xl flex flex-col h-[520px] lg:h-[550px] transition-all">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none" />

            {/* Messages List */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    Chatting with "{currentContract?.contractName}"
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
                    Ask questions about hidden penalties, liability caps, payment terms, or counter-proposals.
                  </p>
                </div>
              )}

              {chatMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-300/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Bot size={17} />
                      </div>
                    )}

                    <div className="max-w-[88%] sm:max-w-[80%] space-y-1.5">
                      <div
                        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed relative group ${
                          isUser
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-xs shadow-lg shadow-purple-500/25 font-medium'
                            : 'liquid-glass text-slate-900 dark:text-slate-100 rounded-tl-xs border border-slate-200/80 dark:border-white/10 font-medium'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {/* Referenced Clause Badge & Copy Action */}
                        {!isUser && (
                          <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between gap-2 flex-wrap">
                            {msg.referencedClause ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Citation:</span>
                                <button
                                  onClick={() => handleClauseClick(msg.referencedClause!)}
                                  className="inline-flex items-center gap-1 text-xs font-mono font-black px-2.5 py-0.5 rounded-lg bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-300/40 hover:scale-105 transition-transform cursor-pointer"
                                >
                                  <span>{msg.referencedClause}</span>
                                  <ArrowUpRight size={12} />
                                </button>
                              </div>
                            ) : <span />}

                            <button
                              onClick={() => handleCopy(msg.id, msg.text)}
                              className="text-[11px] font-bold text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 cursor-pointer transition-colors"
                              title="Copy message text"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check size={12} className="text-emerald-500" />
                                  <span className="text-emerald-500">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      <span className={`block text-[10px] text-slate-400 font-mono ${isUser ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp}
                      </span>
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-slate-800 dark:bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm border border-slate-700 dark:border-white/20">
                        <User size={15} />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loading bubble with animated bouncing dots */}
              {isLoading && (
                <div className="flex gap-3 justify-start items-center animate-fade-in">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-300/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Bot size={17} />
                  </div>
                  <div className="p-3.5 px-4 rounded-2xl rounded-tl-xs liquid-glass border border-slate-200/80 dark:border-white/10 flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400">
                    <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="ml-2 font-bold text-[11px]">Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* DYNAMIC SUGGESTIONS GENERATED SPECIFICALLY VIA CHAT API */}
            <div className="p-3 border-t border-slate-200/60 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 overflow-x-auto flex gap-2 scrollbar-none backdrop-blur-md items-center">
              <div className="flex items-center gap-1.5 shrink-0 pl-1">
                <span className="text-[11px] font-black text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  <Sparkles size={13} />
                  <span>Suggestions:</span>
                </span>
                <button
                  type="button"
                  onClick={() => currentContract && fetchDynamicSuggestions(currentContract)}
                  disabled={isLoadingSuggestions || isLoading}
                  className="p-1 rounded-lg hover:bg-purple-500/15 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer disabled:opacity-40"
                  title="Generate new suggestions from Chat API"
                >
                  <RotateCw size={12} className={isLoadingSuggestions ? 'animate-spin text-purple-600' : ''} />
                </button>
              </div>

              {isLoadingSuggestions ? (
                <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 px-3 py-1.5 animate-pulse">
                  <Loader2 size={13} className="animate-spin" />
                  <span>Loading tailored questions...</span>
                </div>
              ) : (
                dynamicSuggestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendPrompt(q)}
                    disabled={isLoading}
                    className="text-xs px-3.5 py-1.5 rounded-xl liquid-glass-card text-slate-700 dark:text-slate-300 hover:border-purple-400 dark:hover:border-purple-400/50 shrink-0 transition-all transform hover:-translate-y-0.5 cursor-pointer font-medium disabled:opacity-50"
                    title="Click to ask this question"
                  >
                    {q}
                  </button>
                ))
              )}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSend} className="p-3.5 sm:p-4 border-t border-slate-200/80 dark:border-white/10 flex items-center gap-2.5 bg-white/80 dark:bg-[#0c1222]/80 backdrop-blur-xl">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={isLoading}
                placeholder={`Ask backend AI about ${currentContract?.contractName || 'this contract'}...`}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070b14] text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 shadow-inner font-medium disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 disabled:opacity-40 transition-all transform hover:scale-105 cursor-pointer shrink-0"
              >
                {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Inline Clause Details Modal (keeps user right in Chat) */}
      {inspectedClause && (
        <Modal
          isOpen={!!inspectedClause}
          onClose={() => setInspectedClause(null)}
          title={`Clause ${inspectedClause.clauseNumber} • ${inspectedClause.category}`}
          subtitle={`Risk Rating: ${inspectedClause.riskScore}% (${inspectedClause.riskScore >= 61 ? 'High Risk' : inspectedClause.riskScore >= 31 ? 'Medium Risk' : 'Low Risk'})`}
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Original Contract Text
              </label>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#080d1a] font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 leading-relaxed">
                {inspectedClause.originalText}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                Plain English Explanation
              </label>
              <div className="p-3.5 rounded-2xl bg-purple-500/10 text-xs font-semibold text-purple-950 dark:text-purple-200 border border-purple-300/40 leading-relaxed">
                {inspectedClause.plainExplanation}
              </div>
            </div>

            {inspectedClause.suggestedAlternative && (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                  Recommended Counter-Clause
                </label>
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-xs font-mono text-emerald-950 dark:text-emerald-200 border border-emerald-300/40 leading-relaxed">
                  {inspectedClause.suggestedAlternative}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
export default ContractChat;
