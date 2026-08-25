import { ContractAnalysis, ClauseAnalysis, UserRole, ChatMessage } from '../types/contract';
import { calculateContractRisk } from './scoringEngine';
import { DEMO_FREELANCE_CONTRACT } from '../data/demoContracts';
import { askReportQuestion } from './backendApiService';

export const CANDIDATE_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro'
];

export function getGeminiApiKey(): string {
  const customKey = localStorage.getItem('contract_risk_ai_gemini_key');
  if (customKey && customKey.trim().length > 10) {
    return customKey.trim();
  }
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function setGeminiApiKey(key: string): void {
  if (key && key.trim()) {
    localStorage.setItem('contract_risk_ai_gemini_key', key.trim());
  } else {
    localStorage.removeItem('contract_risk_ai_gemini_key');
  }
}

export function getSelectedModel(): string {
  return localStorage.getItem('contract_risk_ai_model') || 'gemini-2.0-flash';
}

export function setSelectedModel(model: string): void {
  localStorage.setItem('contract_risk_ai_model', model);
}

async function callGeminiAPI(payload: any, apiKey: string): Promise<string> {
  const preferredModel = getSelectedModel();
  const modelsToTry = [
    preferredModel,
    ...CANDIDATE_MODELS.filter(m => m !== preferredModel)
  ];

  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    // Try v1beta first, then v1
    const apiVersions = ['v1beta', 'v1'];
    
    for (const version of apiVersions) {
      try {
        const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            // Save successful model for subsequent calls
            setSelectedModel(model);
            return text;
          }
        } else {
          const errBody = await response.text();
          console.warn(`Attempt with ${model} (${version}) failed (${response.status}):`, errBody);
          lastError = new Error(`Gemini API Error (${response.status}): ${errBody}`);
        }
      } catch (err: any) {
        console.warn(`Network attempt with ${model} (${version}) failed:`, err);
        lastError = err;
      }
    }
  }

  throw lastError || new Error('Failed to generate content with available Gemini models.');
}

export async function analyzeContractWithGemini(
  contractText: string,
  userRole: UserRole,
  fileName: string = 'Uploaded_Contract.pdf'
): Promise<ContractAnalysis> {
  const apiKey = getGeminiApiKey();

  // If no API key provided, warn and provide demo analysis
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('No Gemini API Key provided. Returning sample structured analysis.');
    return {
      ...DEMO_FREELANCE_CONTRACT,
      id: 'analysis-' + Date.now(),
      contractName: fileName,
      userRole: userRole,
      createdAt: new Date().toISOString(),
      rawText: contractText,
      isDemo: true
    };
  }

  const systemPrompt = `You are an elite legal tech contract analysis AI specializing in contract risk detection, clause plain-language translation, and negotiating safer terms.
Your client is in the role of: "${userRole.toUpperCase()}".
Analyze this legal document from their perspective to protect their legal and financial interests.

STRICT INSTRUCTIONS:
1. Break the contract down into substantive clauses (at least 5-15 distinct clauses if present).
2. For each clause, determine:
   - "clauseNumber": The clause number or section heading (e.g., "Clause 3.2" or "Section 4").
   - "category": MUST be one of these exact categories: ["Termination", "Payment", "Penalties", "Liability", "Indemnification", "Refund", "Auto Renewal", "Notice Period", "Non-Compete", "Confidentiality", "Intellectual Property", "Dispute Resolution", "Governing Law", "Privacy / Data", "Cancellation", "Warranty", "Hidden Fees", "Other"].
   - "title": A clear 2-5 word description of the clause topic.
   - "originalText": The exact quotation of the clause from the contract.
   - "riskScore": An integer from 0 (completely safe/standard) to 100 (catastrophic legal/financial hazard).
   - "plainExplanation": Explain the clause in simple, jargon-free plain English that anyone can understand in 5 seconds.
   - "whyRisky": Why this specific clause is dangerous or unfavorable from the perspective of a ${userRole}.
   - "potentialImpact": Real-world consequences or worst-case scenarios if signed as-is.
   - "suggestedAlternative": A professional, fair, and balanced alternative clause wording the user can propose to the other party.
   - "confidence": Integer 80-99 representing AI confidence.

3. Extract overall Key Terms (if not mentioned in the text, write "Not specified in the contract"):
   - "duration": Duration or term length.
   - "payment": Compensation/rent/rate and terms.
   - "noticePeriod": Required termination or non-renewal notice.
   - "renewal": Automatic or mutual renewal terms.
   - "governingLaw": Jurisdiction state/country.
   - "liabilityLimit": Liability caps.
   - "ipOwnership": Who owns created deliverables and background tools.

4. Provide:
   - "contractType": Exact classification (e.g. Freelance MSA, Residential Lease, Employment Agreement, NDA).
   - "contractSummary": 2-3 sentence executive summary.
   - "beforeYouSign": An array of the top 5 most critical things the user MUST know before signing.

5. ACCURACY RULES:
   - NEVER invent clauses, monetary values, or dates.
   - If something is missing, explicitly state "Not specified in the contract".
   - Distinguish facts from legal interpretations.

Return ONLY valid JSON matching this schema:
{
  "contractType": "string",
  "contractSummary": "string",
  "keyTerms": {
    "duration": "string",
    "payment": "string",
    "noticePeriod": "string",
    "renewal": "string",
    "governingLaw": "string",
    "liabilityLimit": "string",
    "ipOwnership": "string"
  },
  "beforeYouSign": ["string", "string", "string", "string", "string"],
  "clauses": [
    {
      "clauseNumber": "string",
      "category": "string",
      "title": "string",
      "originalText": "string",
      "riskScore": 0,
      "plainExplanation": "string",
      "whyRisky": "string",
      "potentialImpact": "string",
      "suggestedAlternative": "string",
      "confidence": 95
    }
  ]
}`;

  const payload = {
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { text: `CONTRACT TEXT TO ANALYZE:\n\n${contractText.slice(0, 45000)}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      topP: 0.95,
      responseMimeType: "application/json"
    }
  };

  try {
    const rawContent = await callGeminiAPI(payload, apiKey);
    const parsed = cleanAndParseJSON(rawContent);

    const clauses: ClauseAnalysis[] = (parsed.clauses || []).map((c: any) => ({
      ...c,
      riskScore: typeof c.riskScore === 'number' ? c.riskScore : parseInt(c.riskScore) || 30
    }));

    const scoring = calculateContractRisk(clauses, userRole);

    const fullAnalysis: ContractAnalysis = {
      id: 'analysis-' + Date.now(),
      contractName: fileName,
      userRole: userRole,
      createdAt: new Date().toISOString(),
      rawText: contractText,
      contractType: parsed.contractType || 'Legal Agreement',
      contractSummary: parsed.contractSummary || 'AI-analyzed contract.',
      overallRiskScore: scoring.overallRiskScore,
      riskLevel: scoring.riskLevel,
      riskExplanation: scoring.riskExplanation,
      keyTerms: parsed.keyTerms || {
        duration: 'Not specified in the contract',
        payment: 'Not specified in the contract',
        noticePeriod: 'Not specified in the contract',
        renewal: 'Not specified in the contract',
        governingLaw: 'Not specified in the contract'
      },
      riskCounts: scoring.riskCounts,
      categoryScores: scoring.categoryScores,
      topRisks: scoring.topRisks,
      beforeYouSign: parsed.beforeYouSign || [
        'Review all liability and indemnification clauses carefully.',
        'Verify termination notice and payment milestone schedules.',
        'Check for automatic renewal lock-ins.'
      ],
      clauses: clauses
    };

    return fullAnalysis;
  } catch (error: any) {
    console.error('Gemini contract analysis error:', error);
    throw new Error(error.message || 'Failed to analyze contract with AI. Please check your Gemini API key or select another model in Settings.');
  }
}

export async function askContractAI(
  question: string,
  contract: ContractAnalysis,
  _chatHistory: ChatMessage[] = []
): Promise<{ text: string; referencedClause?: string }> {
  // 1. Primary: Use backend API endpoint POST /api/reports/:reportId/question
  if (contract?.id) {
    try {
      const backendReply = await askReportQuestion(contract.id, question);
      if (backendReply && backendReply.text) {
        return backendReply;
      }
    } catch (err: any) {
      console.warn('[askContractAI] Backend question API failed, falling back to local grounded reasoning:', err);
    }
  }

  // 2. Fallback: Local grounded legal reasoning without Gemini API dependency
  return getOfflineChatResponse(question, contract);
}

function getOfflineChatResponse(question: string, contract: ContractAnalysis): { text: string; referencedClause?: string } {
  const q = question.toLowerCase();
  const clauses = contract.clauses || [];

  // 1. Direct clause number lookup (e.g. "Clause 3.1", "Section 4", "Clause 2")
  const specificClauseMatch = q.match(/clause\s*([0-9]+(\.[0-9]+)?)/i) || q.match(/section\s*([0-9]+(\.[0-9]+)?)/i);
  if (specificClauseMatch) {
    const targetNum = specificClauseMatch[1];
    const foundClause = clauses.find(c => c.clauseNumber.toLowerCase().includes(targetNum) || c.id === targetNum);
    if (foundClause) {
      if (q.includes('counter') || q.includes('negotiat') || q.includes('propos') || q.includes('alternat')) {
        return {
          text: `For ${foundClause.clauseNumber} (${foundClause.category} - ${foundClause.riskScore}% Risk), here is the recommended counter-proposal you should propose:\n\n"${foundClause.suggestedAlternative || 'The parties agree to mutual standard terms aligned with industry practice.'}"\n\nStrategy: Cite this alternative to cap your legal exposure while keeping terms balanced.`,
          referencedClause: foundClause.clauseNumber
        };
      }
      return {
        text: `According to ${foundClause.clauseNumber} (${foundClause.category}):\n• Plain Meaning: ${foundClause.plainExplanation}\n• Risk Assessment (${foundClause.riskScore}%): ${foundClause.whyRisky}\n• Recommended Alternative: "${foundClause.suggestedAlternative || 'Mutual standard terms'}"`,
        referencedClause: foundClause.clauseNumber
      };
    }
  }

  // 2. Counter-proposal & negotiation queries
  if (q.includes('counter') || q.includes('negotiat') || q.includes('propos') || q.includes('change')) {
    const highRisks = clauses.filter(c => c.riskScore >= 60);
    const target = highRisks[0] || clauses[0];
    if (target) {
      return {
        text: `Based on your contract, the most critical term to renegotiate is ${target.clauseNumber} (${target.category}, ${target.riskScore}% Risk).\n\nRecommended Counter-Clause:\n"${target.suggestedAlternative || 'Liability and obligations shall be mutually limited to standard industry caps.'}"\n\nWhy propose this: ${target.whyRisky}`,
        referencedClause: target.clauseNumber
      };
    }
  }

  // 3. Overall Top Risk / Worst-Case Scenarios
  if (q.includes('biggest risk') || q.includes('top risk') || q.includes('worst') || q.includes('danger') || q.includes('hazard')) {
    const topClauses = [...clauses].sort((a, b) => b.riskScore - a.riskScore).slice(0, 3);
    const breakdown = topClauses.map((c, i) => `${i + 1}. ${c.clauseNumber} (${c.category}, ${c.riskScore}% Risk): ${c.plainExplanation}`).join('\n');
    return {
      text: `Here are the top ${topClauses.length} critical risks detected in this ${contract.contractType}:\n\n${breakdown}\n\nAsk me about any specific clause to get negotiation counter-clauses.`,
      referencedClause: topClauses[0]?.clauseNumber
    };
  }

  // 4. Termination & Notice Period & Early Exit
  if (q.includes('cancel') || q.includes('terminat') || q.includes('end') || q.includes('quit') || q.includes('resign') || q.includes('notice') || q.includes('leave')) {
    const termClause = clauses.find(c => c.category.toLowerCase().includes('terminat') || c.category.toLowerCase().includes('notice'));
    if (termClause) {
      return {
        text: `Under ${termClause.clauseNumber} (${termClause.category}): ${termClause.plainExplanation}\n\n⚠️ Risk Warning: ${termClause.whyRisky}\n\nNegotiation tip: Propose a balanced 30-day mutual notice period without unilateral penalty deductions.`,
        referencedClause: termClause.clauseNumber
      };
    }
  }

  // 5. Payment, Salary, Invoices, Fees & Deductions
  if (q.includes('pay') || q.includes('money') || q.includes('fee') || q.includes('salary') || q.includes('invoice') || q.includes('deduct') || q.includes('bonus')) {
    const payClause = clauses.find(c => c.category.toLowerCase().includes('pay') || c.category.toLowerCase().includes('compensation') || c.category.toLowerCase().includes('fee'));
    if (payClause) {
      return {
        text: `Regarding compensation in ${payClause.clauseNumber} (${payClause.category}): ${payClause.plainExplanation}\n\nFinancial Exposure: ${payClause.whyRisky}`,
        referencedClause: payClause.clauseNumber
      };
    }
  }

  // 6. Liability, Indemnification & Lawsuits
  if (q.includes('liabilit') || q.includes('sue') || q.includes('damage') || q.includes('loss') || q.includes('reimburse') || q.includes('indemnif')) {
    const liabClause = clauses.find(c => c.category.toLowerCase().includes('liabilit') || c.category.toLowerCase().includes('indemnif'));
    if (liabClause) {
      return {
        text: `Regarding legal liability in ${liabClause.clauseNumber} (${liabClause.category}): ${liabClause.plainExplanation}\n\n⚠️ Exposure: ${liabClause.whyRisky}\n\nSafer Alternative:\n"${liabClause.suggestedAlternative || 'Neither party shall be liable for indirect or consequential damages, and total liability shall be capped at the fees paid.'}"`,
        referencedClause: liabClause.clauseNumber
      };
    }
  }

  // 7. Intellectual Property & Code Ownership
  if (q.includes('ip') || q.includes('code') || q.includes('intellectual') || q.includes('own') || q.includes('project') || q.includes('patent') || q.includes('copyright')) {
    const ipClause = clauses.find(c => c.category.toLowerCase().includes('intellectual') || c.category.toLowerCase().includes('ip') || c.category.toLowerCase().includes('property'));
    if (ipClause) {
      return {
        text: `Per ${ipClause.clauseNumber} (${ipClause.category}): ${ipClause.plainExplanation}\n\nIP Protection Tip: Ensure you retain background tools, pre-existing frameworks, and code developed prior to or independently of this engagement.`,
        referencedClause: ipClause.clauseNumber
      };
    }
  }

  // 8. Non-Compete & Restrictive Covenants
  if (q.includes('non-compete') || q.includes('compete') || q.includes('restrict') || q.includes('lock') || q.includes('moonlight') || q.includes('solicit')) {
    const ncClause = clauses.find(c => c.category.toLowerCase().includes('compete') || c.category.toLowerCase().includes('restrict') || c.category.toLowerCase().includes('solicit'));
    if (ncClause) {
      return {
        text: `Under ${ncClause.clauseNumber} (${ncClause.category}): ${ncClause.plainExplanation}\n\nAnalysis: ${ncClause.whyRisky}`,
        referencedClause: ncClause.clauseNumber
      };
    }
  }

  // 9. Confidentiality & Non-Disclosure
  if (q.includes('secret') || q.includes('confidential') || q.includes('nda') || q.includes('disclose') || q.includes('privacy')) {
    const confClause = clauses.find(c => c.category.toLowerCase().includes('confidential') || c.category.toLowerCase().includes('privacy'));
    if (confClause) {
      return {
        text: `Under ${confClause.clauseNumber} (${confClause.category}): ${confClause.plainExplanation}\n\nDuration & Scope: Confidentiality obligations should exclude publicly available information and have a reasonable time limit (typically 1–2 years).`,
        referencedClause: confClause.clauseNumber
      };
    }
  }

  // 10. Grounded contract synthesis overview
  return {
    text: `Based on your ${contract.contractType} analyzed for your ${contract.userRole.toUpperCase()} perspective:\n\n• Overall Risk Score: ${contract.overallRiskScore}% (${contract.riskLevel} Risk)\n• Evaluated Clauses: ${clauses.length} clauses audited.\n• Executive Summary: "${contract.displaySummary || contract.contractSummary}"\n\nYou can ask me specific tactical questions about negotiation counter-proposals, termination notice penalties, liability caps, or intellectual property rights.`
  };
}

function cleanAndParseJSON(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}
