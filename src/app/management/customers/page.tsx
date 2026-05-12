"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SearchAndFilter } from "@/components/CustomerManagement/SearchAndFilter";
import { CustomerTable } from "@/components/CustomerManagement/CustomerTable";
import { getCustomers, type CustomerFilters, type CustomerResponse } from "@/services/customerManagement.services";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";

const CustomerManagementPage = () => {
  const { accessToken } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNext: false,
    hasPrevious: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CustomerFilters>({
    searchTerm: "",
    deletedStatus: "ALL",
    sortBy: "displayName",
    sortOrder: "ASC",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    fetchCustomers();
  }, [filters, accessToken]);

  const fetchCustomers = async () => {
    if (!accessToken) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching customers with filters:', filters);
      console.log('Using access token:', accessToken ? 'Present' : 'Missing');
      console.log('API URL:', process.env.NEXT_PUBLIC_BACKEND_API_BASE || 'http://localhost:8080');
      
      const response: CustomerResponse = await getCustomers(filters, accessToken);
      
      console.log('API Response:', response);
      
      // Handle the response structure based on your backend
      if (response.customers && Array.isArray(response.customers)) {
        setCustomers(response.customers);
        setPagination(response.pagination);
        console.log('Successfully loaded customers:', response.customers.length);
      } else {
        console.warn('No customers data in response:', response);
        setCustomers([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          limit: 10,
          hasNext: false,
          hasPrevious: false
        });
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch customers';
      console.error("Error fetching customers:", error);
      setError(errorMessage);
      
      // Reset data on error
      setCustomers([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 10,
        hasNext: false,
        hasPrevious: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    setFilters(prev => ({ ...prev, searchTerm: query, page: 1 }));
  };

  const handleFilterChange = (status: string) => {
    console.log('Filter status:', status);
    // Ensure the status matches backend expectations
    const validStatus = ["ALL", "ACTIVE", "DELETED"].includes(status) 
      ? status as "ALL" | "ACTIVE" | "DELETED" 
      : "ALL";
    setFilters(prev => ({ ...prev, deletedStatus: validStatus, page: 1 }));
  };

  const handleSort = (column: string, direction: "ASC" | "DESC") => {
    console.log('Sort:', column, direction);
    // Map frontend column names to backend expected names
    let backendColumn = column;
    if (column === 'displayName') {
      backendColumn = 'name'; // Backend expects 'name' instead of 'displayName'
    }
    
    const validSortBy = ["name", "firstLogin", "createdAt"].includes(backendColumn)
      ? backendColumn as "displayName" | "name" | "firstLogin" | "createdAt"
      : "name";
    
    setFilters(prev => ({ ...prev, sortBy: validSortBy, sortOrder: direction }));
  };

  const handlePageChange = (page: number) => {
    console.log('Page change:', page);
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <>
        <Breadcrumb pageName="Customers" />

        <div className="space-y-6">
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6 py-5.5 dark:border-dark-3">
              <h2 className="text-2xl font-bold text-dark dark:text-white">
                Customer Management
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                View and manage all customers from the mobile application
              </p>
            </div>
            
            <div className="p-6">
              {/* Search and Filter */}
              <SearchAndFilter
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
              />

              {/* Customer Table */}
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <div className="text-gray-500 dark:text-gray-400">Loading customers...</div>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-10">
                  <div className="text-center">
                    <div className="text-red-500 dark:text-red-400 mb-2">
                      Error: {error}
                    </div>
                    <button 
                      onClick={fetchCustomers}
                      className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : customers.length === 0 ? (
                <div className="flex items-center justify-center py-10">
                  <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400 mb-2">
                      No customers found
                    </div>
                    {filters.searchTerm && (
                      <div className="text-sm text-gray-400">
                        Try adjusting your search or filters
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <CustomerTable
                  customers={customers}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  onSort={handleSort}
                  sortColumn={filters.sortBy}
                  sortDirection={filters.sortOrder}
                />
              )}
            </div>
          </div>
        </div>
      </>
    </ProtectedRoute>
  );
};

export default CustomerManagementPage;