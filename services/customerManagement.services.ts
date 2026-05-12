export interface CustomerFilters {
  searchTerm: string;
  deletedStatus: "ALL" | "ACTIVE" | "DELETED";
  sortBy: "displayName" | "name" | "firstLogin" | "createdAt";
  sortOrder: "ASC" | "DESC";
  page: number;
  limit: number;
}

export interface Customer {
  userId: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  firstLoginTime?: string;
  lastLoginTime?: string;
  totalTransactions: number;
  latestTransactionTime?: string;
  latestTransactionTimeFormatted?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CustomerResponse {
  message: string;
  customers: Customer[];  // Updated: was 'data' in old API, now 'customers'
  pagination: Pagination;
  performance?: {
    queryTimeMs: number;
    cacheHit: boolean;
  };
  filters?: CustomerFilters;
  timestamp: number;
}

// Base API URL - adjust this to match your backend
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE || 'http://localhost:8080';

// Updated API endpoint path
const CUSTOMERS_API = `${API_BASE_URL}/api/admin/customers`;

export const getCustomers = async (
  filters: CustomerFilters,
  accessToken?: string
): Promise<CustomerResponse> => {
  try {
    // Build query parameters - updated to match backend expectations
    const queryParams = new URLSearchParams({
      searchTerm: filters.searchTerm || '',
      deletedStatus: filters.deletedStatus || 'ALL',
      sortBy: filters.sortBy === 'displayName' ? 'name' : filters.sortBy, // Map displayName to name
      sortOrder: filters.sortOrder || 'ASC',
      page: filters.page?.toString() || '1',
      limit: filters.limit?.toString() || '10'
    });

    const url = `${CUSTOMERS_API}?${queryParams.toString()}`;
    
    console.log('Making API request to:', url);
    console.log('Access token available:', accessToken ? 'Yes' : 'No');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw API response data:', data);
    
    // Updated: Handle new API response structure
    return {
      message: data.message || 'Customers retrieved successfully',
      customers: data.customers || data.data || [], // Handle both possible response structures
      pagination: data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 10,
        hasNext: false,
        hasPrevious: false
      },
      performance: data.performance,
      filters: data.filters,
      timestamp: data.timestamp || Date.now()
    };
    
  } catch (error) {
    console.error('Error in getCustomers:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};

export const getCustomerById = async (
  userId: string,
  accessToken?: string
): Promise<{ customer: Customer }> => {
  try {
    const url = `${CUSTOMERS_API}/${userId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      customer: data.data // Backend returns data.data for customer object
    };
    
  } catch (error) {
    console.error('Error in getCustomerById:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};

export const updateCustomerStatus = async (
  userId: string,
  status: 'ACTIVE' | 'DISABLED',
  accessToken?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const url = `${CUSTOMERS_API}/${userId}/status`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      message: data.message || 'Status updated successfully'
    };
    
  } catch (error) {
    console.error('Error in updateCustomerStatus:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};

export const searchCustomers = async (
  query: string,
  limit = 10,
  accessToken?: string
): Promise<{ results: Customer[]; count: number }> => {
  try {
    const queryParams = new URLSearchParams({
      q: query,
      limit: limit.toString()
    });

    const url = `${CUSTOMERS_API}/search?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      results: data.results || [],
      count: data.count || 0
    };
    
  } catch (error) {
    console.error('Error in searchCustomers:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};

export const getCustomerStatistics = async (
  accessToken?: string
): Promise<{
  totalCustomers: number;
  activeCustomers: number;
  deletedCustomers: number;
  newCustomersLast30Days: number;
  performance?: any;
}> => {
  try {
    const url = `${CUSTOMERS_API}/statistics`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return data.data; // Backend returns statistics in data field
    
  } catch (error) {
    console.error('Error in getCustomerStatistics:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};

// Bulk operations
export const bulkUpdateCustomerStatus = async (
  userIds: string[],
  status: 'ACTIVE' | 'DISABLED',
  accessToken?: string
): Promise<{
  successCount: number;
  errorCount: number;
  results: Array<{ userId: string; success: boolean; message: string }>;
}> => {
  try {
    const url = `${CUSTOMERS_API}/bulk-status`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ userIds, status })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      successCount: data.successCount || 0,
      errorCount: data.errorCount || 0,
      results: data.results || []
    };
    
  } catch (error) {
    console.error('Error in bulkUpdateCustomerStatus:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};