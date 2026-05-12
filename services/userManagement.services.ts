export interface Customer {
  index: number;
  userId: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  totalTransactions: number;
  firstLoginTime: string;
  firstLoginTimeFormatted: string;
  latestTransactionTime: string;
  latestTransactionTimeFormatted: string;
  deletedStatus: "ACTIVE" | "DELETED";
  status: string;
  photoUrl: string;
  role: string;
  languagePreference: string;
}

export interface CustomerFilters {
  searchTerm: string;
  deletedStatus: string;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  page: number;
  limit: number;
}

export interface CustomerResponse {
  customers: Customer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  filters: {
    searchTerm: string;
    deletedStatus: string;
    sortBy: string;
    sortOrder: string;
  };
}

// Mock data for fallback
const mockCustomers: Customer[] = [
  {
    index: 1,
    userId: "user_mock_001",
    displayName: "Nguyen Van An",
    firstName: "An",
    lastName: "Nguyen Van",
    phoneNumber: "+84901234567",
    totalTransactions: 45,
    firstLoginTime: "2024-01-15T10:30:00Z",
    firstLoginTimeFormatted: "2024-01-15 10:30:00",
    latestTransactionTime: "2024-12-20T14:25:00Z",
    latestTransactionTimeFormatted: "2024-12-20 14:25:00",
    deletedStatus: "ACTIVE",
    status: "ACTIVE",
    photoUrl: "/images/user/user-01.png",
    role: "MRT_PASSENGER",
    languagePreference: "vi"
  },
  {
    index: 2,
    userId: "user_mock_002",
    displayName: "Tran Thi Binh",
    firstName: "Binh",
    lastName: "Tran Thi",
    phoneNumber: "+84902345678",
    totalTransactions: 32,
    firstLoginTime: "2024-02-20T14:15:00Z",
    firstLoginTimeFormatted: "2024-02-20 14:15:00",
    latestTransactionTime: "2024-12-19T09:45:00Z",
    latestTransactionTimeFormatted: "2024-12-19 09:45:00",
    deletedStatus: "ACTIVE",
    status: "ACTIVE",
    photoUrl: "/images/user/user-02.png",
    role: "MRT_PASSENGER",
    languagePreference: "en"
  },
  {
    index: 3,
    userId: "user_mock_003",
    displayName: "Le Van Cuong",
    firstName: "Cuong",
    lastName: "Le Van",
    phoneNumber: "+84903456789",
    totalTransactions: 28,
    firstLoginTime: "2024-03-01T09:45:00Z",
    firstLoginTimeFormatted: "2024-03-01 09:45:00",
    latestTransactionTime: "2024-12-18T16:30:00Z",
    latestTransactionTimeFormatted: "2024-12-18 16:30:00",
    deletedStatus: "DELETED",
    status: "DISABLED",
    photoUrl: "/images/user/user-03.png",
    role: "MRT_PASSENGER",
    languagePreference: "vi"
  },
  {
    index: 4,
    userId: "user_mock_004",
    displayName: "Pham Thi Dung",
    firstName: "Dung",
    lastName: "Pham Thi",
    phoneNumber: "+84904567890",
    totalTransactions: 67,
    firstLoginTime: "2024-01-10T11:20:00Z",
    firstLoginTimeFormatted: "2024-01-10 11:20:00",
    latestTransactionTime: "2024-12-20T12:15:00Z",
    latestTransactionTimeFormatted: "2024-12-20 12:15:00",
    deletedStatus: "ACTIVE",
    status: "ACTIVE",
    photoUrl: "/images/user/user-04.png",
    role: "MRT_PASSENGER",
    languagePreference: "vi"
  },
  {
    index: 5,
    userId: "user_mock_005",
    displayName: "Hoang Van Minh",
    firstName: "Minh",
    lastName: "Hoang Van",
    phoneNumber: "+84905678901",
    totalTransactions: 23,
    firstLoginTime: "2024-04-05T15:30:00Z",
    firstLoginTimeFormatted: "2024-04-05 15:30:00",
    latestTransactionTime: "2024-12-17T10:20:00Z",
    latestTransactionTimeFormatted: "2024-12-17 10:20:00",
    deletedStatus: "ACTIVE",
    status: "ACTIVE",
    photoUrl: "/images/user/user-05.png",
    role: "MRT_PASSENGER",
    languagePreference: "en"
  }
];

export async function getCustomers(
  filters: CustomerFilters,
  accessToken?: string
): Promise<CustomerResponse> {
  try {
    const baseUrl = '/api/admin/customers';
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json' 
    };
    
    // Add authorization header if accessToken is provided
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Build query parameters
    const params = new URLSearchParams();
    
    if (filters.searchTerm) {
      params.append('searchTerm', filters.searchTerm);
    }
    
    if (filters.deletedStatus && filters.deletedStatus !== 'ALL') {
      params.append('deletedStatus', filters.deletedStatus);
    }
    
    if (filters.sortBy) {
      // Map frontend sortBy values to backend expected values
      let backendSortBy = filters.sortBy;
      if (filters.sortBy === 'displayName' || filters.sortBy === 'name') {
        backendSortBy = 'name';
      } else if (filters.sortBy === 'firstLoginTime') {
        backendSortBy = 'firstLogin';
      }
      params.append('sortBy', backendSortBy);
    }
    
    if (filters.sortOrder) {
      params.append('sortOrder', filters.sortOrder);
    }
    
    params.append('page', filters.page.toString());
    params.append('limit', filters.limit.toString());

    const endpoint = `${baseUrl}?${params.toString()}`;
    console.log('Fetching customers from:', endpoint);
    
    const response = await fetch(endpoint, { headers });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`Customer API error ${response.status}:`, errorText);
      if (response.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('session-expired'));
      }
      throw new Error(`Failed to fetch customers: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Customer API response:', result);
    
    return {
      customers: result.data,
      pagination: result.pagination,
      filters: result.filters
    };

  } catch (error) {
    console.error('Error fetching customers:', error);
    
    // Fallback to mock data if API fails
    const mockResponse: CustomerResponse = {
      customers: mockCustomers.slice(0, filters.limit),
      pagination: {
        currentPage: filters.page,
        totalPages: Math.ceil(mockCustomers.length / filters.limit),
        totalCount: mockCustomers.length,
        limit: filters.limit,
        hasNext: filters.page < Math.ceil(mockCustomers.length / filters.limit),
        hasPrevious: filters.page > 1
      },
      filters: {
        searchTerm: filters.searchTerm,
        deletedStatus: filters.deletedStatus,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      }
    };
    
    return mockResponse;
  }
}

// Additional customer management functions

export async function getCustomerDetails(
  userId: string, 
  accessToken?: string
): Promise<Customer | null> {
  try {
    const baseUrl = '/api/admin/customers';
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json' 
    };
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${baseUrl}/${userId}`, { headers });

    if (!response.ok) {
      if (response.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('session-expired'));
      }
      throw new Error(`Failed to fetch customer details: ${response.status}`);
    }

    const result = await response.json();
    return result.data;

  } catch (error) {
    console.error('Error fetching customer details:', error);
    return null;
  }
}

export async function updateCustomerStatus(
  userId: string,
  newStatus: "ACTIVE" | "DISABLED",
  accessToken?: string
): Promise<boolean> {
  try {
    const baseUrl = '/api/admin/customers';
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json' 
    };
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${baseUrl}/${userId}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) {
      if (response.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('session-expired'));
      }
      throw new Error(`Failed to update customer status: ${response.status}`);
    }

    return true;

  } catch (error) {
    console.error('Error updating customer status:', error);
    return false;
  }
}

export async function getCustomerStatistics(
  accessToken?: string
): Promise<{
  totalCustomers: number;
  activeCustomers: number;
  deletedCustomers: number;
  newCustomersLast30Days: number;
} | null> {
  try {
    const baseUrl = '/api/admin/customers';
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json' 
    };
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${baseUrl}/statistics`, { headers });

    if (!response.ok) {
      if (response.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('session-expired'));
      }
      throw new Error(`Failed to fetch customer statistics: ${response.status}`);
    }

    const result = await response.json();
    return result.data;

  } catch (error) {
    console.error('Error fetching customer statistics:', error);
    return null;
  }
} 