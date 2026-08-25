import { 
  ContractAnalysis, 
  ClauseAnalysis, 
  UserRole, 
  RiskLevel, 
  BackendReviewResponse,
  BackendRiskCategory,
  ContractReport,
  ReportsResponse,
  ReportResponse,
  ReportHighlightItem,
  ReportHighlightsResponse,
  ReportComparisonPayload,
  ReportComparisonResponse
} from '../types/contract';

const BACKEND_BASE_URL = 'https://backend-contract-risk-clause-detect.vercel.app';
const BACKEND_API_URL = `${BACKEND_BASE_URL}/api/review`;
const BACKEND_REPORTS_URL = `${BACKEND_BASE_URL}/api/reports`;

export function formatCategoryName(name: string): string {
  if (!name) return 'General';
  return name
    .split(/[\s_]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function safeParseJSON(input: any): any {
  if (!input) return {};
  if (typeof input === 'object' && input !== null) {
    return input;
  }
  if (typeof input !== 'string') return {};

  let cleaned = input.trim();
  // Remove markdown code fences if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  try {
    const parsed = JSON.parse(cleaned);
    if (typeof parsed === 'string') {
      return safeParseJSON(parsed); // Handles double-stringified JSON
    }
    return parsed;
  } catch {
    try {
      const unescaped = cleaned.replace(/\\n/g, '\n').replace(/\\"/g, '"');
      const parsed2 = JSON.parse(unescaped);
      if (typeof parsed2 === 'string') return safeParseJSON(parsed2);
      return parsed2;
    } catch (e2) {
      console.error('[safeParseJSON] Could not parse backend response string:', cleaned);
      return {};
    }
  }
}

/**
 * ============================================================
 * POST /api/review
 * ============================================================
 * Uploads a PDF to the backend review endpoint using FormData.
 * Do not manually set Content-Type header so the browser sets the boundary.
 */
export async function reviewContract(
  file: File,
  userRole: UserRole = 'freelancer'
): Promise<ContractAnalysis> {
  const formData = new FormData();
  formData.append('pdf', file, file.name);

  console.log(`[ClauseX] POST /api/review uploading "${file.name}"...`);

  const response = await fetch(BACKEND_API_URL, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('401: Authentication required. Please sign in to analyze contracts.');
    }
    let errorMessage = `Backend API returned HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorBody = await response.json();
      if (errorBody?.error) {
        errorMessage = errorBody.error;
      }
    } catch {
      // Keep original status error message
    }
    throw new Error(errorMessage);
  }

  const rawText = await response.text();
  const parsedData = safeParseJSON(rawText);

  console.log('===== POST /api/review RESPONSE =====', parsedData);

  return convertBackendResponseToContract(parsedData, file.name, formatFileSize(file.size), userRole);
}

// Alias for backward compatibility
export const reviewContractWithBackend = reviewContract;

/**
 * ============================================================
 * GET /api/reports
 * ============================================================
 * Fetches all reports belonging to the authenticated user.
 */
export async function getReports(): Promise<ContractAnalysis[]> {
  try {
    const response = await fetch(BACKEND_REPORTS_URL, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.warn('[getReports] 401 Unauthorized: User not authenticated.');
        return [];
      }
      throw new Error(`Failed to fetch reports: ${response.status}`);
    }

    const data: ReportsResponse | any = await response.json();
    console.log('===== GET /api/reports RESPONSE =====', data);

    let list: any[] = [];
    if (Array.isArray(data)) {
      list = data;
    } else if (Array.isArray(data?.reports)) {
      list = data.reports;
    } else if (Array.isArray(data?.data)) {
      list = data.data;
    } else if (Array.isArray(data?.contracts)) {
      list = data.contracts;
    } else if (data?.report) {
      list = [data.report];
    } else if (typeof data === 'object' && data !== null && Object.keys(data).length > 0) {
      list = [data];
    }

    return list.map((item, idx) => {
      const rep = item?.report || item;
      const fileName = rep.title || rep.contractName || rep.contract_name || rep.filename || rep.name || `Contract_Report_${rep.report_id || idx + 1}.pdf`;
      const userRole = (rep.userRole || rep.user_role || 'employee') as UserRole;
      const fileSize = rep.fileSize || rep.file_size || '1.8 MB';

      return convertBackendResponseToContract(
        item,
        fileName,
        fileSize,
        userRole
      );
    });
  } catch (err) {
    console.error('[getReports] Failed to fetch /api/reports:', err);
    return [];
  }
}

// Alias for backward compatibility
export const fetchUserReportsFromBackend = getReports;

/**
 * ============================================================
 * GET /api/reports/:reportId
 * ============================================================
 * Fetches a single report by reportId.
 */
export async function getReport(reportId: number | string): Promise<ContractAnalysis> {
  const cleanId = String(reportId).replace(/^[^\d]+/, '') || String(reportId);
  const response = await fetch(`${BACKEND_REPORTS_URL}/${cleanId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('401: Authentication required.');
    }
    if (response.status === 404) {
      throw new Error(`Report #${cleanId} not found or does not belong to you.`);
    }
    throw new Error(`Failed to fetch report #${cleanId}: ${response.status}`);
  }

  const data: ReportResponse | any = await response.json();
  console.log(`===== GET /api/reports/${cleanId} RESPONSE =====`, data);

  const reportItem = data?.report || data;
  return convertBackendResponseToContract(
    reportItem,
    reportItem?.title || `Report #${cleanId}`,
    '1.8 MB',
    'employee'
  );
}

/**
 * ============================================================
 * PATCH /api/reports/:reportId/close
 * ============================================================
 * Closes an active report.
 */
export async function closeReport(reportId: number | string): Promise<any> {
  const cleanId = String(reportId).replace(/^[^\d]+/, '') || String(reportId);
  const response = await fetch(`${BACKEND_REPORTS_URL}/${cleanId}/close`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('401: Authentication required.');
    }
    throw new Error(`Failed to close report #${cleanId}: ${response.status}`);
  }

  const data = await response.json();
  console.log(`===== PATCH /api/reports/${cleanId}/close RESPONSE =====`, data);
  return data;
}

/**
 * ============================================================
 * PATCH /api/reports/:reportId/restore
 * ============================================================
 * Restores a closed report back to active.
 */
export async function restoreReport(reportId: number | string): Promise<any> {
  const cleanId = String(reportId).replace(/^[^\d]+/, '') || String(reportId);
  const response = await fetch(`${BACKEND_REPORTS_URL}/${cleanId}/restore`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('401: Authentication required.');
    }
    throw new Error(`Failed to restore report #${cleanId}: ${response.status}`);
  }

  const data = await response.json();
  console.log(`===== PATCH /api/reports/${cleanId}/restore RESPONSE =====`, data);
  return data;
}

/**
 * ============================================================
 * DELETE /api/reports/:reportId
 * ============================================================
 * Permanently deletes a report.
 */
export async function deleteReport(reportId: number | string): Promise<any> {
  const cleanId = String(reportId).replace(/^[^\d]+/, '') || String(reportId);
  const response = await fetch(`${BACKEND_REPORTS_URL}/${cleanId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('401: Authentication required.');
    }
    throw new Error(`Failed to delete report #${cleanId}: ${response.status}`);
  }

  const data = await response.json();
  console.log(`===== DELETE /api/reports/${cleanId} RESPONSE =====`, data);
  return data;
}

/**
 * ============================================================
 * POST /api/reports/:reportId/highlights
 * ============================================================
 * Generates and fetches contract highlight locations & text.
 */
export async function generateReportHighlights(
  reportId: number | string
): Promise<ReportHighlightsResponse | any> {
  const cleanId = String(reportId).replace(/^[^\d]+/, '') || String(reportId);
  const response = await fetch(
    `${BACKEND_REPORTS_URL}/${cleanId}/highlights`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    let errorMessage = `Highlight API failed: ${response.status}`;

    try {
      const error = await response.json();
      console.error("Highlight API error:", error);
      errorMessage = error?.message || errorMessage;
    } catch {
      // Keep the HTTP status error
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();

  return data;
}

/**
 * ============================================================
 * POST /api/reports/compare
 * ============================================================
 * Compares two existing contract reports by ID.
 * 
 * Request body: { reportId1: number, reportId2: number }
 */
export async function compareReports(
  reportId1: number | string,
  reportId2: number | string
): Promise<ReportComparisonPayload> {
  const numId1 = typeof reportId1 === 'number' ? reportId1 : parseInt(String(reportId1).replace(/[^\d]/g, ''), 10) || reportId1;
  const numId2 = typeof reportId2 === 'number' ? reportId2 : parseInt(String(reportId2).replace(/[^\d]/g, ''), 10) || reportId2;

  const response = await fetch(`${BACKEND_REPORTS_URL}/compare`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      reportId1: numId1,
      reportId2: numId2
    })
  });

  if (!response.ok) {
    let errorMessage = `Compare API failed: ${response.status}`;
    try {
      const error = await response.json();
      console.error("Compare API error:", error);
      errorMessage = error?.message || errorMessage;
    } catch {
      // Keep default status
    }
    throw new Error(errorMessage);
  }

  const data: ReportComparisonResponse | any = await response.json();
  console.log("REPORT COMPARISON:", data);

  const payload: ReportComparisonPayload = data?.comparison || data;
  return payload;
}

/**
 * ============================================================
 * POST /api/reports/:reportId/question
 * ============================================================
 * Submits a question about a specific report to the backend API.
 * Request body: { "question": string }
 */
export async function askReportQuestion(
  reportId: number | string,
  question: string
): Promise<{ text: string; referencedClause?: string }> {
  const cleanId = String(reportId).replace(/^[^\d]+/, '') || String(reportId);
  const response = await fetch(`${BACKEND_REPORTS_URL}/${cleanId}/question`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ question })
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('401: Authentication required.');
    }
    const errText = await response.text().catch(() => '');
    throw new Error(`Question API failed (${response.status}): ${errText || response.statusText}`);
  }

  const data = await response.json();
  console.log(`===== POST /api/reports/${cleanId}/question RESPONSE =====`, data);

  // Extract answer text from diverse possible backend response structures
  let answerText = '';
  if (typeof data === 'string') {
    answerText = data;
  } else if (typeof data === 'object' && data !== null) {
    answerText = 
      data.answer || 
      data.response || 
      data.text || 
      data.reply || 
      data.message || 
      data.result || 
      data.data?.answer || 
      data.data?.response || 
      data.data?.text ||
      (typeof data.data === 'string' ? data.data : '') ||
      JSON.stringify(data);
  }

  const clauseMatch = answerText.match(/Clause\s+[0-9]+(\.[0-9]+)?/i) || answerText.match(/Section\s+[0-9]+/i);

  return {
    text: answerText.trim(),
    referencedClause: clauseMatch ? clauseMatch[0] : undefined
  };
}

function formatFileSize(bytes: number): string {
  if (!bytes) return '1.2 MB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * ============================================================
 * CONVERTS ANY BACKEND REPORT OR REVIEW PAYLOAD INTO CONTRACT
 * ============================================================
 */
export function convertBackendResponseToContract(
  rawInput: any,
  fileName: string,
  fileSize: string,
  userRole: UserRole
): ContractAnalysis {
  const rootObj = safeParseJSON(rawInput);
  
  // 1. Unwrap report wrapper if present
  const reportObj = rootObj?.report || rootObj;

  // 2. Unwrap report_content if present (could be object or string)
  let contentObj = reportObj?.report_content || reportObj?.content || rootObj?.report_content || reportObj;
  if (typeof contentObj === 'string') {
    contentObj = safeParseJSON(contentObj);
  }

  // 3. Extract core text
  const summaryText = 
    contentObj?.summary || 
    reportObj?.summary || 
    rootObj?.summary || 
    'Comprehensive contract review completed.';

  const displaySummaryText = 
    contentObj?.display_summary || 
    reportObj?.display_summary || 
    rootObj?.display_summary;

  // 4. Extract risk categories
  const rawCategories = 
    contentObj?.risk_categories || 
    reportObj?.risk_categories || 
    rootObj?.risk_categories || 
    rootObj?.riskCategories || 
    [];

  const riskCategories: BackendRiskCategory[] = Array.isArray(rawCategories) ? rawCategories : [];

  const categoryScores: Record<string, number> = {};
  const clauses: ClauseAnalysis[] = [];
  let globalClauseIdx = 1;

  riskCategories.forEach((catItem) => {
    const formattedCat = formatCategoryName(catItem.category || 'General');
    const catRisk = Math.min(100, Math.max(0, Math.round(Number(catItem.risk_percentage || catItem.risk || 0))));
    categoryScores[formattedCat] = catRisk;

    if (Array.isArray(catItem.clauses)) {
      catItem.clauses.forEach((cItem: any) => {
        const rawClauseRisk = cItem.risk !== undefined ? cItem.risk : (cItem.riskScore !== undefined ? cItem.riskScore : catRisk);
        const clauseRisk = Math.min(100, Math.max(0, Math.round(Number(rawClauseRisk) || 0)));
        const clauseLevel: RiskLevel = clauseRisk >= 61 ? 'HIGH' : clauseRisk >= 31 ? 'MEDIUM' : 'LOW';

        const originalText = cItem.clause || cItem.originalText || cItem.text || `Provision for ${formattedCat}`;
        const plainText = cItem.display_text || cItem.plainExplanation || cItem.summary || originalText;
        const whyText = cItem.display_text || cItem.whyRisky || `Risk score of ${clauseRisk}% detected in this ${formattedCat} provision.`;

        clauses.push({
          id: `clause-${globalClauseIdx}`,
          clauseNumber: `Clause ${globalClauseIdx}`,
          category: formattedCat,
          title: `${formattedCat} Provision`,
          originalText: originalText,
          plainExplanation: plainText,
          whyRisky: whyText,
          potentialImpact: clauseLevel === 'HIGH' ? 'High exposure to unexpected legal, financial, or employment liability.' : 'Moderate operational risk.',
          suggestedAlternative: `Mutually agreed terms limiting ${formattedCat.toLowerCase()} obligations.`,
          riskScore: clauseRisk,
          riskLevel: clauseLevel,
          confidence: 95
        });

        globalClauseIdx++;
      });
    }
  });

  // 5. Extract scores with comprehensive fallbacks
  let rawScore = 
    contentObj?.risk_percentage ?? 
    contentObj?.overall_risk_score ??
    contentObj?.risk_score ??
    contentObj?.overallRiskScore ??
    contentObj?.riskPercentage ??
    contentObj?.risk ??
    reportObj?.risk_percentage ?? 
    reportObj?.overall_risk_score ?? 
    reportObj?.risk_score ?? 
    reportObj?.overallRiskScore ?? 
    reportObj?.riskPercentage ?? 
    reportObj?.risk ?? 
    rootObj?.risk_percentage ?? 
    rootObj?.overall_risk_score ?? 
    rootObj?.risk_score ?? 
    rootObj?.overallRiskScore ?? 
    rootObj?.riskPercentage ?? 
    rootObj?.risk;

  // If top-level risk score is not specified but categories exist, calculate from category averages
  if ((rawScore === undefined || rawScore === null || Number(rawScore) === 0) && riskCategories.length > 0) {
    const validCatRisks = riskCategories
      .map(c => Number(c.risk_percentage || c.risk || 0))
      .filter(r => r > 0);
    if (validCatRisks.length > 0) {
      rawScore = Math.round(validCatRisks.reduce((a, b) => a + b, 0) / validCatRisks.length);
    }
  }

  // If still 0 and clauses exist, calculate from clause risks
  if ((rawScore === undefined || rawScore === null || Number(rawScore) === 0) && clauses.length > 0) {
    const validClauseRisks = clauses
      .map(c => Number(c.riskScore || 0))
      .filter(r => r > 0);
    if (validClauseRisks.length > 0) {
      rawScore = Math.round(validClauseRisks.reduce((a, b) => a + b, 0) / validClauseRisks.length);
    }
  }

  const overallRisk = Math.min(100, Math.max(0, Math.round(Number(rawScore) || 0)));
  const riskLevel: RiskLevel = overallRisk >= 61 ? 'HIGH' : overallRisk >= 31 ? 'MEDIUM' : 'LOW';

  const sortedClauses = [...clauses].sort((a, b) => b.riskScore - a.riskScore);

  const highCount = sortedClauses.filter(c => c.riskLevel === 'HIGH').length;
  const medCount = sortedClauses.filter(c => c.riskLevel === 'MEDIUM').length;
  const lowCount = sortedClauses.filter(c => c.riskLevel === 'LOW').length;

  const topRisks = sortedClauses.slice(0, 6).map(c => ({
    category: c.category,
    riskScore: c.riskScore,
    riskLevel: c.riskLevel,
    summary: c.plainExplanation,
    clauseNumber: c.clauseNumber
  }));

  const beforeYouSign = sortedClauses.length > 0 
    ? sortedClauses.filter(c => c.riskScore >= 70).slice(0, 5).map(c => `${c.category}: ${c.plainExplanation}`)
    : [
      'Verify liability limitation cap before signing',
      'Confirm payment terms and statutory deductions',
      'Review intellectual property rights and personal projects carve-out',
      'Check notice periods during and after probation',
      'Confirm dispute resolution and governing law'
    ];

  // Derive contract title & dates
  const resolvedContractName = reportObj?.title || reportObj?.contractName || rootObj?.contractName || fileName || 'Employment Agreement';
  const reportId = String(reportObj?.report_id || reportObj?.id || rootObj?.id || ('contract-' + Date.now()));
  const createdAt = reportObj?.created_at || reportObj?.createdAt || rootObj?.createdAt || new Date().toISOString();

  const startDateStr = reportObj?.start_date 
    ? new Date(reportObj.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : (reportObj?.keyTerms?.startDate || new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));

  const endDateStr = reportObj?.end_date 
    ? new Date(reportObj.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : (reportObj?.keyTerms?.endDate || 'Not Specified / At-Will');

  // Derive contract type
  let contractType = reportObj?.title || reportObj?.contractType || 'Employment Agreement';
  const sumLower = summaryText.toLowerCase();
  const nameLower = resolvedContractName.toLowerCase();

  if (nameLower.includes('employ') || sumLower.includes('employ') || nameLower.includes('offer')) {
    contractType = 'Employment Agreement';
  } else if (nameLower.includes('lease') || sumLower.includes('lease') || nameLower.includes('rent')) {
    contractType = 'Lease Agreement';
  } else if (nameLower.includes('service') || sumLower.includes('service') || nameLower.includes('consult')) {
    contractType = 'Service Agreement';
  } else if (nameLower.includes('nda') || sumLower.includes('nda') || sumLower.includes('confidential')) {
    contractType = 'Non-Disclosure Agreement';
  }

  // Notice period from termination clauses
  const terminationClause = clauses.find(c => c.category.toLowerCase().includes('terminat') || c.category.toLowerCase().includes('notice'));
  const noticePeriodVal = terminationClause?.plainExplanation || '180 Days Notice / Discretionary';

  // Compensation / payment from compensation clauses
  const compensationClause = clauses.find(c => c.category.toLowerCase().includes('compensat') || c.category.toLowerCase().includes('pay'));
  const paymentVal = compensationClause?.plainExplanation || 'Discretionary / Target Salary';

  // Governing law / dispute resolution
  const disputeClause = clauses.find(c => c.category.toLowerCase().includes('other') || c.category.toLowerCase().includes('dispute') || c.category.toLowerCase().includes('liabil'));
  const governingLawVal = disputeClause?.plainExplanation || 'Company Discretion / Local Jurisdiction';

  // Status computation based on calculated risk score
  const isReportClosed = reportObj?.is_closed === true || reportObj?.status === 'closed' || reportObj?.status === 'Closed';
  const statusVal = isReportClosed 
    ? 'Closed' 
    : (overallRisk >= 61 ? 'Risk Detected' : overallRisk >= 31 ? 'Medium Risk' : 'Low Risk');

  return {
    id: reportId,
    contractName: resolvedContractName,
    userRole: userRole,
    createdAt: createdAt,
    fileSize: fileSize,
    rawText: clauses.map(c => `${c.clauseNumber}: ${c.originalText}`).join('\n\n'),
    contractSummary: summaryText,
    displaySummary: displaySummaryText || summaryText,
    contractType: contractType,
    overallRiskScore: overallRisk,
    riskLevel: riskLevel,
    status: statusVal,
    riskExplanation: displaySummaryText || summaryText || `Overall risk level evaluated as ${riskLevel} (${overallRisk}%).`,
    keyTerms: {
      duration: reportObj?.keyTerms?.duration || (startDateStr && endDateStr !== 'Not Specified / At-Will' ? `${startDateStr} to ${endDateStr}` : '12 Months (Renewable)'),
      startDate: startDateStr,
      endDate: endDateStr,
      parties: reportObj?.keyTerms?.parties || `Company & Employee (${userRole})`,
      payment: paymentVal,
      noticePeriod: noticePeriodVal,
      renewal: reportObj?.keyTerms?.renewal || 'Continuous / Automatic',
      governingLaw: governingLawVal
    },
    riskCounts: {
      high: highCount,
      medium: medCount,
      low: lowCount,
      total: sortedClauses.length || 1
    },
    categoryScores: categoryScores,
    riskCategories: riskCategories.map(rc => ({
      ...rc,
      category: formatCategoryName(rc.category)
    })),
    topRisks: topRisks,
    beforeYouSign: beforeYouSign,
    clauses: sortedClauses,
    rawApiResponse: rawInput
  };
}