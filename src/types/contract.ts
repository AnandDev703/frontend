export type UserRole = 
  | 'freelancer' 
  | 'tenant' 
  | 'employee' 
  | 'gig_worker' 
  | 'small_business' 
  | 'other';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type ClauseCategory = 
  | 'Termination'
  | 'Payment'
  | 'Penalties'
  | 'Liability'
  | 'Indemnification'
  | 'Refund'
  | 'Auto Renewal'
  | 'Notice Period'
  | 'Non-Compete'
  | 'Confidentiality'
  | 'Intellectual Property'
  | 'Dispute Resolution'
  | 'Governing Law'
  | 'Privacy / Data'
  | 'Cancellation'
  | 'Warranty'
  | 'Hidden Fees'
  | 'Other';

export interface BackendClauseItem {
  clause: string;
  display_text: string;
  risk: number;
}

export interface BackendRiskCategory {
  category: string;
  risk_percentage: number;
  clauses: BackendClauseItem[];
}

export interface BackendReviewResponse {
  risk_percentage: number;
  summary: string;
  display_summary: string;
  risk_categories: BackendRiskCategory[];
}

export type ReportClause = {
  clause: string;
  display_text: string;
  risk: number;
};

export type RiskCategory = {
  category: string;
  risk_percentage: number;
  clauses: ReportClause[];
};

export type ReportContent = {
  risk_percentage: number;
  summary: string;
  display_summary: string;
  risk_categories: RiskCategory[];
};

export type ContractReport = {
  report_id: number;
  user_id: number;
  title: string;
  start_date: string | null;
  end_date: string | null;
  report_content: ReportContent;
  created_at: string;
  is_closed?: boolean;
  status?: string;
};

export type ReportsResponse = {
  status: string;
  reports: ContractReport[];
};

export type ReportResponse = {
  status: string;
  report: ContractReport;
  message?: string;
};

export interface ReportHighlightItem {
  page: number;
  text: string;
  risk: string;
}

export interface ReportHighlightsResponse {
  status: string;
  highlights: ReportHighlightItem[];
}

export interface ClauseAnalysis {
  id?: string;
  clauseNumber: string;
  category: ClauseCategory | string;
  title?: string;
  originalText: string;
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  plainExplanation: string;
  whyRisky: string;
  potentialImpact: string;
  suggestedAlternative: string;
  confidence: number; // percentage (e.g., 95)
  highlightSnippet?: string;
  translations?: Record<string, {
    plainExplanation: string;
    whyRisky: string;
    suggestedAlternative: string;
  }>;
}

export interface KeyTerms {
  duration: string;
  payment: string;
  noticePeriod: string;
  renewal: string;
  governingLaw: string;
  liabilityLimit?: string;
  ipOwnership?: string;
  startDate?: string;
  endDate?: string;
  parties?: string;
}

export interface RiskCounts {
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface TopRiskItem {
  category: string;
  riskScore: number;
  riskLevel: RiskLevel;
  summary: string;
  clauseNumber: string;
}

export interface ContractAnalysis {
  id: string;
  contractName: string;
  userRole: UserRole;
  createdAt: string;
  fileSize?: string;
  rawText: string;
  contractSummary: string;
  displaySummary?: string;
  contractType: string;
  overallRiskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  status?: 'In Progress' | 'Needs Review' | 'Risk Detected' | 'Closed';
  riskExplanation: string;
  keyTerms: KeyTerms;
  riskCounts: RiskCounts;
  categoryScores?: Record<string, number>;
  riskCategories?: BackendRiskCategory[];
  topRisks: TopRiskItem[];
  rawApiResponse?: any;
  beforeYouSign: string[]; // 5 most critical items
  clauses: ClauseAnalysis[];
  pdfUrl?: string;
  pdfFile?: File;
  highlights?: ReportHighlightItem[];
  isDemo?: boolean;
  beforeYouSignTranslations?: Record<string, string[]>;
  riskExplanationTranslations?: Record<string, string>;
  contractSummaryTranslations?: Record<string, string>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  referencedClause?: string;
  timestamp: string;
}

export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'te' | 'ml';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

// ------------------------------------------------------------
// CONTRACT REPORT COMPARISON INTERFACES (POST /api/reports/compare)
// ------------------------------------------------------------
export interface ReportComparisonDocInfo {
  reportId: number | string;
  title: string;
}

export interface ReportComparisonDocAssessment {
  strengths: string[];
  weaknesses: string[];
}

export interface ReportComparisonDifference {
  category: string;
  document_1: string;
  document_2: string;
  better: 'document_1' | 'document_2' | 'tie';
  explanation: string;
}

export interface ReportComparisonDetail {
  better_document: 'document_1' | 'document_2' | 'tie';
  document_1_score: number;
  document_2_score: number;
  summary: string;
  document_1: ReportComparisonDocAssessment;
  document_2: ReportComparisonDocAssessment;
  key_differences: ReportComparisonDifference[];
}

export interface ReportComparisonPayload {
  document1: ReportComparisonDocInfo;
  document2: ReportComparisonDocInfo;
  comparison: ReportComparisonDetail;
}

export interface ReportComparisonResponse {
  status: 'good';
  comparison: ReportComparisonPayload;
}

