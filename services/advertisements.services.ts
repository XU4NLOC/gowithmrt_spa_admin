export type Advertisement = {
  adId: string;
  name: string;
  description?: string;
  bannerUrl?: string;
  destinationLink: string;
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'EXPIRED' | 'ARCHIVED' | 'DISABLED';
  publishType: 'IMMEDIATE' | 'SCHEDULED';
  startDate?: string;
  endDate?: string;
  analytics?: {
    totalClicks: number;
    uniqueUsers: number;
    lastClickAt?: string | null;
    averageClicksPerDay: number;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  bannerSize?: {
    width: number;
    height: number;
    fileSize: number;
    format: string;
  };
};

export type AdvertisementsListResponse = {
  advertisements: Advertisement[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
  summary?: {
    statusCounts: Record<string, number>;
    todayClicks: number;
    totalActive: number;
  };
};

import { API_ENDPOINTS } from '@/config/api';

const BASE_URL = API_ENDPOINTS.admin.advertisements;

export async function fetchAdvertisements(
  params: {
    status?: 'ALL' | 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'EXPIRED' | 'ARCHIVED' | 'DISABLED';
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'status' | 'createdAt' | 'updatedAt' | 'publishedAt';
    sortOrder?: 'ASC' | 'DESC';
  } = {},
  accessToken?: string
): Promise<AdvertisementsListResponse> {
  const searchParams = new URLSearchParams();
  
  // FIXED: Only add status parameter if it's not 'ALL'
  if (params.status && params.status !== 'ALL') {
    searchParams.set('status', params.status);
    console.log('🔍 Adding status filter:', params.status);
  } else {
    console.log('🔍 No status filter (showing ALL)');
  }
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  const fullUrl = `${BASE_URL}?${searchParams.toString()}`;
  console.log('📡 Fetching advertisements from:', fullUrl);

  const res = await fetch(fullUrl, { headers });
  
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('session-expired'));
    }
    const errorText = await res.text().catch(() => 'Unknown error');
    console.error('❌ API Error:', res.status, errorText);
    throw new Error(`Failed to fetch advertisements: ${res.status} - ${errorText}`);
  }
  
  const json = await res.json();
  console.log('✅ API Response:', json);
  
  return {
    advertisements: json.advertisements ?? [],
    pagination: json.pagination ?? {
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
  limit: 10,
    },
    summary: json.summary,
  };
}

export async function publishAdvertisement(adId: string, accessToken?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  
  console.log('📤 Publishing advertisement:', adId);
  
  const res = await fetch(`${BASE_URL}/${adId}/publish`, { method: 'POST', headers });
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('session-expired'));
    }
    const errorText = await res.text().catch(() => 'Unknown error');
    console.error('❌ Publish failed:', res.status, errorText);
    throw new Error(`Failed to publish advertisement: ${res.status} - ${errorText}`);
  }
  
  const result = await res.json();
  console.log('✅ Advertisement published successfully');
  return result;
}

export async function unpublishAdvertisement(adId: string, accessToken?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  
  console.log('📤 Unpublishing advertisement:', adId);
  
  const res = await fetch(`${BASE_URL}/${adId}/unpublish`, { method: 'POST', headers });
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('session-expired'));
    }
    const errorText = await res.text().catch(() => 'Unknown error');
    console.error('❌ Unpublish failed:', res.status, errorText);
    throw new Error(`Failed to unpublish advertisement: ${res.status} - ${errorText}`);
  }
  
  const result = await res.json();
  console.log('✅ Advertisement unpublished successfully');
  return result;
}

export async function uploadAdvertisementBanner(file: File, accessToken?: string) {
  const form = new FormData();
  form.append('file', file);
  const headers: Record<string, string> = {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  
  console.log('📤 Uploading banner:', file.name, `(${(file.size / 1024 / 1024).toFixed(2)}MB)`);
  
  const res = await fetch(`${BASE_URL}/upload-banner`, { method: 'POST', headers, body: form });
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('session-expired'));
    }
    const errorText = await res.text().catch(() => 'Unknown error');
    console.error('❌ Banner upload failed:', res.status, errorText);
    throw new Error(`Failed to upload banner: ${res.status} - ${errorText}`);
  }
  
  const result = await res.json();
  console.log('✅ Banner uploaded successfully:', result.fileName);
  return result as {
    message: string;
    fileName: string;
    downloadUrl: string;
    fileInfo: { width: number; height: number; fileSize: number; format: string; originalName: string };
  };
}

export type CreateAdvertisementPayload = {
  name: string;
  description?: string;
  destinationLink: string;
  publishType: 'IMMEDIATE' | 'SCHEDULED';
  startDate?: string; // ISO string when SCHEDULED
  endDate?: string;   // ISO string when SCHEDULED
  bannerFileName?: string; // from upload API
};

export async function createAdvertisement(payload: CreateAdvertisementPayload, accessToken?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  
  console.log('📤 Creating advertisement:', payload.name);
  
  const res = await fetch(`${BASE_URL}`, { method: 'POST', headers, body: JSON.stringify(payload) });
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('session-expired'));
    }
    const errorText = await res.text().catch(() => 'Unknown error');
    console.error('❌ Create advertisement failed:', res.status, errorText);
    throw new Error(`Failed to create advertisement: ${res.status} - ${errorText}`);
  }
  
  const result = await res.json();
  console.log('✅ Advertisement created successfully:', result.adId);
  return result;
}

export type UpdateAdvertisementPayload = Partial<CreateAdvertisementPayload> & {
  status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'EXPIRED' | 'ARCHIVED' | 'DISABLED';
};

export async function updateAdvertisement(adId: string, payload: UpdateAdvertisementPayload, accessToken?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  
  console.log('📤 Updating advertisement:', adId);
  
  const res = await fetch(`${BASE_URL}/${adId}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('session-expired'));
    }
    const errorText = await res.text().catch(() => 'Unknown error');
    console.error('❌ Update advertisement failed:', res.status, errorText);
    throw new Error(`Failed to update advertisement: ${res.status} - ${errorText}`);
  }
  
  const result = await res.json();
  console.log('✅ Advertisement updated successfully');
  return result;
}

export async function deleteAdvertisement(adId: string, accessToken?: string) {
  const headers: Record<string, string> = {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  
  console.log('📤 Deleting advertisement:', adId);
  
  const res = await fetch(`${BASE_URL}/${adId}`, { method: 'DELETE', headers });
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('session-expired'));
    }
    const errorText = await res.text().catch(() => 'Unknown error');
    console.error('❌ Delete advertisement failed:', res.status, errorText);
    throw new Error(`Failed to delete advertisement: ${res.status} - ${errorText}`);
  }
  
  const result = await res.json();
  console.log('✅ Advertisement deleted successfully');
  return result;
}