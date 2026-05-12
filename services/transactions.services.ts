export type TransactionItem = {
  index: number;
  transactionId: string;
  sender: string;
  receiver: string;
  senderId: string;
  receiverId: string;
  startTime: string | null;
  startTimeFormatted: string | null;
  endTime: string | null;
  endTimeFormatted: string | null;
  status: string;
  totalCost: number;
  senderCost: number;
  receiverCost: number;
  costCalculated: boolean;
  groupId: string | null;
  broadcastId: string | null;
};

export type TransactionListResponse = {
  data: TransactionItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};

import { API_ENDPOINTS } from '@/config/api';

const BASE_URL = API_ENDPOINTS.admin.transactions;

export async function fetchTransactions(
  params: {
    senderName?: string;
    status?: string;
    page?: number;
    limit?: number;
  },
  accessToken?: string
): Promise<TransactionListResponse> {
  const searchParams = new URLSearchParams();
  if (params.senderName) searchParams.set('senderName', params.senderName);
  if (params.status && params.status !== 'ALL') searchParams.set('status', params.status);
  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('limit', String(params.limit ?? 20));

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  const res = await fetch(`${BASE_URL}?${searchParams.toString()}`, { headers });
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('session-expired'));
    }
    const errorText = await res.text().catch(() => 'Unknown error');
    throw new Error(`Failed to fetch transactions: ${res.status} - ${errorText}`);
  }
  const json = await res.json();
  return {
    data: json.data ?? [],
    pagination: json.pagination ?? {
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
  limit: 10,
      hasNext: false,
      hasPrevious: false,
    },
  };
}

export async function fetchTransactionStatistics(accessToken?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  const res = await fetch(`${BASE_URL}/statistics`, { headers });
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('session-expired'));
    }
    const errorText = await res.text().catch(() => 'Unknown error');
    throw new Error(`Failed to fetch transaction statistics: ${res.status} - ${errorText}`);
  }
  const json = await res.json();
  return json.data;
}

export async function fetchTransactionDetails(transactionId: string, accessToken?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  const res = await fetch(`${BASE_URL}/${transactionId}`, { headers });
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('session-expired'));
    }
    const errorText = await res.text().catch(() => 'Unknown error');
    throw new Error(`Failed to fetch transaction details: ${res.status} - ${errorText}`);
  }
  const json = await res.json();
  return json.data;
}

