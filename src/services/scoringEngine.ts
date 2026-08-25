import { ClauseAnalysis, ClauseCategory, RiskCounts, RiskLevel, TopRiskItem, UserRole } from '../types/contract';
import { getRiskLevelFromScore, RISK_CATEGORIES } from '../data/riskCategories';

// Role-specific risk multipliers
const ROLE_WEIGHT_MODIFIERS: Record<UserRole, Partial<Record<ClauseCategory, number>>> = {
  freelancer: {
    'Liability': 1.3,
    'Intellectual Property': 1.3,
    'Termination': 1.25,
    'Payment': 1.2,
    'Non-Compete': 1.3,
    'Indemnification': 1.2
  },
  tenant: {
    'Penalties': 1.4,
    'Privacy / Data': 1.35,
    'Auto Renewal': 1.3,
    'Warranty': 1.25,
    'Termination': 1.2
  },
  employee: {
    'Non-Compete': 1.4,
    'Termination': 1.3,
    'Confidentiality': 1.2,
    'Intellectual Property': 1.25,
    'Dispute Resolution': 1.15
  },
  gig_worker: {
    'Payment': 1.4,
    'Termination': 1.35,
    'Liability': 1.3,
    'Penalties': 1.25
  },
  small_business: {
    'Liability': 1.4,
    'Indemnification': 1.35,
    'Payment': 1.3,
    'Dispute Resolution': 1.25,
    'Auto Renewal': 1.2
  },
  other: {}
};

export interface ScoringResult {
  overallRiskScore: number;
  riskLevel: RiskLevel;
  riskExplanation: string;
  riskCounts: RiskCounts;
  categoryScores: Record<string, number>;
  topRisks: TopRiskItem[];
}

export function calculateContractRisk(clauses: ClauseAnalysis[], role: UserRole = 'freelancer'): ScoringResult {
  if (!clauses || clauses.length === 0) {
    return {
      overallRiskScore: 0,
      riskLevel: 'LOW',
      riskExplanation: 'No clauses evaluated in this document.',
      riskCounts: { high: 0, medium: 0, low: 0, total: 0 },
      categoryScores: {},
      topRisks: []
    };
  }

  let totalWeightedScore = 0;
  let totalWeight = 0;
  const categoryScoreMap: Record<string, { total: number; count: number }> = {};

  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  const roleModifiers = ROLE_WEIGHT_MODIFIERS[role] || {};

  const analyzedClauses = clauses.map(clause => {
    const category = (clause.category || 'Other') as ClauseCategory;
    const baseWeight = RISK_CATEGORIES[category]?.weight || 1.0;
    const roleMod = roleModifiers[category] || 1.0;
    const effectiveWeight = baseWeight * roleMod;

    const riskScore = Math.max(0, Math.min(100, clause.riskScore));
    const level = getRiskLevelFromScore(riskScore);

    if (level === 'HIGH') highCount++;
    else if (level === 'MEDIUM') mediumCount++;
    else lowCount++;

    // Track category averages
    if (!categoryScoreMap[category]) {
      categoryScoreMap[category] = { total: 0, count: 0 };
    }
    categoryScoreMap[category].total += riskScore;
    categoryScoreMap[category].count += 1;

    // Weight quadratic boost for severe clauses (>70)
    const severityMultiplier = riskScore >= 70 ? 1.4 : riskScore >= 50 ? 1.1 : 0.9;
    const weightedItem = riskScore * effectiveWeight * severityMultiplier;

    totalWeightedScore += weightedItem;
    totalWeight += effectiveWeight * severityMultiplier;

    return {
      ...clause,
      riskLevel: level,
      effectiveWeight
    };
  });

  const rawAverage = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
  
  // Cap and ensure high risk clauses pull score realistically
  let calculatedScore = rawAverage;
  if (highCount >= 3 && calculatedScore < 70) {
    calculatedScore = Math.min(95, calculatedScore + (highCount * 5));
  } else if (highCount === 0 && mediumCount <= 2 && calculatedScore > 40) {
    calculatedScore = Math.max(15, calculatedScore - 10);
  }

  const overallRiskScore = Math.max(5, Math.min(98, calculatedScore));
  const riskLevel = getRiskLevelFromScore(overallRiskScore);

  // Compute category averages
  const categoryScores: Record<string, number> = {};
  Object.keys(categoryScoreMap).forEach(cat => {
    categoryScores[cat] = Math.round(categoryScoreMap[cat].total / categoryScoreMap[cat].count);
  });

  // Top risks sorted by highest risk score
  const topRisks: TopRiskItem[] = analyzedClauses
    .slice()
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5)
    .map(c => ({
      category: c.category,
      riskScore: c.riskScore,
      riskLevel: c.riskLevel,
      summary: c.whyRisky || c.plainExplanation,
      clauseNumber: c.clauseNumber
    }));

  // Explainable sentence construction
  const highRiskTopics = topRisks
    .filter(r => r.riskScore >= 60)
    .map(r => r.category.toLowerCase());
  const uniqueHighTopics = Array.from(new Set(highRiskTopics));

  let riskExplanation = '';
  if (highCount > 0 && uniqueHighTopics.length > 0) {
    const topicList = uniqueHighTopics.slice(0, 3).join(', ');
    riskExplanation = `Overall risk is ${overallRiskScore}% (${riskLevel}) because the contract contains ${highCount} high-impact clause${highCount > 1 ? 's' : ''} specifically involving ${topicList}.`;
  } else if (mediumCount > 0) {
    riskExplanation = `Overall risk is ${overallRiskScore}% (${riskLevel}) with ${mediumCount} moderate clauses requiring negotiation or clarification before signing.`;
  } else {
    riskExplanation = `Overall risk is ${overallRiskScore}% (${riskLevel}). The contract appears generally balanced with standard commercial protections.`;
  }

  return {
    overallRiskScore,
    riskLevel,
    riskExplanation,
    riskCounts: {
      high: highCount,
      medium: mediumCount,
      low: lowCount,
      total: clauses.length
    },
    categoryScores,
    topRisks
  };
}
