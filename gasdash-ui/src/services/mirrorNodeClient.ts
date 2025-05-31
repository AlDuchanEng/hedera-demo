/**
 * Mirror Node client for interacting with Hedera testnet
 * API Reference: https://testnet.mirrornode.hedera.com/api/v1/docs/
 */

const MIRROR_NODE_BASE_URL = 'https://testnet.mirrornode.hedera.com/api/v1';

export interface HederaTransaction {
  bytes: any;
  charged_tx_fee: number;
  consensus_timestamp: string;
  entity_id: string | null;
  max_fee: string;
  memo_base64: string | null;
  name: string;
  node: string;
  nonce: number;
  parent_consensus_timestamp: string | null;
  result: string;
  scheduled: boolean;
  staking_reward_transfers: any[];
  transaction_hash: string;
  transaction_id: string;
  transfers: any[];
  valid_duration_seconds: string;
  valid_start_timestamp: string;
}

export interface MirrorNodeTransactionResponse {
  transactions: HederaTransaction[];
  links: {
    next: string | null;
  };
}

/**
 * Fetch transactions for a specific Hedera account
 * Endpoint: /api/v1/accounts/{id}/transactions
 * @param accountId - Hedera account ID (format: 0.0.xxxxx)
 * @param limit - Number of transactions to fetch (default: 10)
 * @returns Promise containing transaction data
 */
export async function fetchAccountTransactions(
  accountId: string, 
  limit: number = 10
): Promise<MirrorNodeTransactionResponse> {
  // Clean and validate account ID
  const cleanAccountId = accountId.trim();
  
  if (!cleanAccountId) {
    throw new Error('Account ID is required');
  }
    // Validate account ID format (should be like 0.0.xxxxx)
  if (!/^0\.0\.\d+$/.test(cleanAccountId)) {
    throw new Error('Invalid account ID format. Expected format: 0.0.xxxxx');
  }
  
  // Use the correct transactions endpoint format
  const url = `${MIRROR_NODE_BASE_URL}/transactions?account.id=${cleanAccountId}&limit=${limit}&order=desc`;
  
  console.log('Fetching transactions from:', url);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Account ${cleanAccountId} not found or has no transactions`);
      }
      throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Raw API response:', data);
    
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Unable to connect to Hedera Mirror Node. Please check your internet connection.');
    }
    throw error;
  }
}

/**
 * Format timestamp from consensus_timestamp to readable date
 * @param timestamp - Consensus timestamp (seconds.nanoseconds format)
 * @returns Formatted date string
 */
export function formatTimestamp(timestamp: string): string {
  const [seconds] = timestamp.split('.');
  const date = new Date(parseInt(seconds) * 1000);
  return date.toLocaleString();
}

/**
 * Convert tinybars to HBAR (1 HBAR = 100,000,000 tinybars)
 * @param tinybars - Amount in tinybars
 * @returns Amount in HBAR
 */
export function tinybarsToHbar(tinybars: number): number {
  return tinybars / 100_000_000;
}
