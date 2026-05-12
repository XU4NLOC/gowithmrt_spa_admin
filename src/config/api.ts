/**
 * Centralized API configuration
 * This file contains all API endpoints and base URLs
 */

// Backend server base URL - for server-side API routes
// Note: This will be undefined on client-side, which is expected
export const BACKEND_API_BASE = process.env.BACKEND_API_BASE || "http://localhost:8080";

// Client-side accessible backend URL - for services that run in browser
export const CLIENT_BACKEND_API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_BASE || "http://localhost:8080";

// Frontend API base URL - for mobile app consumption
// Use window.location.origin when available (client-side) to auto-detect the current domain
export const FRONTEND_API_BASE = typeof window !== 'undefined' 
  ? window.location.origin 
  : process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

// Temporary debug log - remove after testing
if (typeof window !== 'undefined') {
  console.log('🔍 Client-side Environment Variables Check:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('NEXT_PUBLIC_BACKEND_API_BASE:', process.env.NEXT_PUBLIC_BACKEND_API_BASE);
  console.log('CLIENT_BACKEND_API_BASE:', CLIENT_BACKEND_API_BASE);
  console.log('FRONTEND_API_BASE:', FRONTEND_API_BASE);
} else {
  console.log('🔍 Server-side Environment Variables Check:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('BACKEND_API_BASE:', process.env.BACKEND_API_BASE);
  console.log('Final BACKEND_API_BASE:', BACKEND_API_BASE);
  console.log('FRONTEND_API_BASE:', FRONTEND_API_BASE);
}

// API endpoint builders
export const API_ENDPOINTS = {
  // Auth endpoints - used by client-side components
  auth: {
    admin: {
      signup: `${CLIENT_BACKEND_API_BASE}/api/auth/admin/signup`,
      login: `${CLIENT_BACKEND_API_BASE}/api/auth/admin/login`,
    }
  },

  // Admin endpoints - used by client-side services
  admin: {
    customers: `${CLIENT_BACKEND_API_BASE}/api/admin/customers`,
    // Use proxy API routes in production (Vercel) to avoid CORS, direct backend in development
    advertisements: process.env.NODE_ENV === 'production' 
      ? `${FRONTEND_API_BASE}/api/admin/advertisements`
      : `${CLIENT_BACKEND_API_BASE}/api/admin/advertisements`,
    transactions: `${CLIENT_BACKEND_API_BASE}/api/admin/transactions`,
    analytics: {
      // Unified dashboard API (NEW - recommended)
      dashboard: `${CLIENT_BACKEND_API_BASE}/api/admin/analytics/dashboard`,
      // Individual metric endpoints (existing - for backward compatibility)
      userGrowth: `${CLIENT_BACKEND_API_BASE}/api/admin/analytics/user-growth`,
      transactionGrowth: `${CLIENT_BACKEND_API_BASE}/api/admin/analytics/transaction-growth`,
      revenueGrowth: `${CLIENT_BACKEND_API_BASE}/api/admin/analytics/revenue-growth`,
      gateDistribution: `${CLIENT_BACKEND_API_BASE}/api/admin/analytics/gate-distribution`,
    }
  },
  
  // Mobile endpoints (these go through our Next.js API routes)
  mobile: {
    advertisements: {
      next: `${FRONTEND_API_BASE}/api/mobile/advertisements/next`,
      dismiss: (adId: string) => `${FRONTEND_API_BASE}/api/mobile/advertisements/${adId}/dismiss`,
      click: (adId: string) => `${FRONTEND_API_BASE}/api/mobile/advertisements/${adId}/click`,
    }
  }
} as const;

// Debug log for advertisements endpoint
if (typeof window !== 'undefined') {
  console.log('🎯 Advertisements endpoint will use:', API_ENDPOINTS.admin.advertisements);
}

// Helper function to get backend base URL (for API routes)
export function getBackendApiBase(): string {
  return BACKEND_API_BASE;
}

// Helper function to get frontend base URL (for mobile app)
export function getFrontendApiBase(): string {
  return FRONTEND_API_BASE;
}
