import { ContractAnalysis } from '../types/contract';
import { 
  getReports, 
  deleteReport, 
  closeReport, 
  restoreReport 
} from './backendApiService';

/**
 * In-memory runtime cache for the active session (no localStorage used)
 */
let inMemoryContractHistory: ContractAnalysis[] = [];

/**
 * ============================================================
 * BACKEND IMPLEMENTATION: SAVE CONTRACT ANALYSIS
 * ============================================================
 * Stores newly analyzed contract in session cache and allows backend sync.
 */
export async function saveContractAnalysis(contract: ContractAnalysis): Promise<void> {
  // Update in-memory session cache
  inMemoryContractHistory = [
    contract,
    ...inMemoryContractHistory.filter(c => c.id !== contract.id)
  ];
}

/**
 * ============================================================
 * LOAD CONTRACT HISTORY FROM BACKEND (/api/reports)
 * ============================================================
 * Fetches saved reports for the authenticated user via /api/reports with credentials: 'include'.
 */
export async function loadContractHistory(): Promise<ContractAnalysis[]> {
  try {
    const backendReports = await getReports();
    if (backendReports && backendReports.length > 0) {
      // Merge with in-memory contracts (e.g. freshly analyzed contracts)
      const mergedMap = new Map<string, ContractAnalysis>();
      backendReports.forEach(r => mergedMap.set(r.id, r));
      inMemoryContractHistory.forEach(r => {
        if (!mergedMap.has(r.id)) mergedMap.set(r.id, r);
      });

      inMemoryContractHistory = Array.from(mergedMap.values()).sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      return inMemoryContractHistory;
    }
  } catch (err) {
    console.error('[storageService] Error loading backend history from /api/reports:', err);
  }

  // Returns current in-memory contracts if backend returns empty or guest
  return inMemoryContractHistory;
}

/**
 * ============================================================
 * BACKEND IMPLEMENTATION: CLOSE CONTRACT (PATCH /api/reports/:id/close)
 * ============================================================
 */
export async function closeContractInHistory(id: string): Promise<void> {
  try {
    await closeReport(id);
    inMemoryContractHistory = inMemoryContractHistory.map(c => 
      c.id === id ? { ...c, status: 'Closed' } : c
    );
  } catch (err) {
    console.error('[storageService] Failed to close report on backend:', err);
    throw err;
  }
}

/**
 * ============================================================
 * BACKEND IMPLEMENTATION: RESTORE CONTRACT (PATCH /api/reports/:id/restore)
 * ============================================================
 */
export async function restoreContractInHistory(id: string): Promise<void> {
  try {
    await restoreReport(id);
    inMemoryContractHistory = inMemoryContractHistory.map(c => 
      c.id === id ? { ...c, status: c.overallRiskScore >= 61 ? 'Risk Detected' : c.overallRiskScore >= 31 ? 'Needs Review' : 'In Progress' } : c
    );
  } catch (err) {
    console.error('[storageService] Failed to restore report on backend:', err);
    throw err;
  }
}

/**
 * ============================================================
 * BACKEND IMPLEMENTATION: DELETE SINGLE CONTRACT (DELETE /api/reports/:id)
 * ============================================================
 */
export async function deleteContractFromHistory(id: string): Promise<void> {
  try {
    await deleteReport(id);
    inMemoryContractHistory = inMemoryContractHistory.filter(c => c.id !== id);
  } catch (err) {
    console.error('[storageService] Failed to delete report on backend:', err);
    // Still remove from in-memory if needed or propagate error
    inMemoryContractHistory = inMemoryContractHistory.filter(c => c.id !== id);
    throw err;
  }
}

/**
 * ============================================================
 * BACKEND IMPLEMENTATION: CLEAR ALL CONTRACTS
 * ============================================================
 */
export async function clearAllContractsFromHistory(): Promise<void> {
  // Wipe in-memory session
  inMemoryContractHistory = [];
}
