"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

// Utility function to decode JWT token without external library
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
}

// Utility function to check if token is expired
function isTokenExpired(token: string): boolean {
  if (!token) return true;
  
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}

interface User {
  uid: string;
  email: string;
  fname?: string;
  lname?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: (clearRememberedCredentials?: boolean) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  isTokenExpired: (token?: string) => boolean;
  getTokenExpirationTime: (token?: string) => Date | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Check for existing tokens on app load
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");

    if (storedAccessToken && storedRefreshToken && storedUser) {
      try {
        // Check if the access token is expired
        if (isTokenExpired(storedAccessToken)) {
          console.log('Access token expired, clearing stored authentication data');
          // Token is expired, clear all stored data
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        } else {
          // Token is still valid, restore user session
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
        }
      } catch (error) {
        console.error('Error processing stored authentication data:', error);
        // Invalid stored data, clear it
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    }
    
    // Always set loading to false after checking
    setIsLoading(false);
    
    // Failsafe: ensure loading never stays true indefinitely
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [mounted]);

  const login = (userData: User, accessTokenData: string, refreshTokenData: string) => {
    setUser(userData);
    setAccessToken(accessTokenData);
    setRefreshToken(refreshTokenData);
    
    localStorage.setItem("accessToken", accessTokenData);
    localStorage.setItem("refreshToken", refreshTokenData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = useCallback((clearRememberedCredentials = true) => {
    // Clear state
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setIsLoading(false); // Ensure loading is false
    
    // Clear authentication tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    
    // Only clear remembered credentials if explicitly requested (manual logout)
    // Don't clear them on automatic logout due to token expiration
    if (clearRememberedCredentials) {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
      localStorage.removeItem("rememberMe");
    }
  }, []);

  const updateTokens = (newAccessToken: string, newRefreshToken: string) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
  };

  // Helper function to check token expiration (uses current accessToken if no token provided)
  const checkTokenExpired = (token?: string): boolean => {
    const tokenToCheck = token || accessToken;
    return isTokenExpired(tokenToCheck || '');
  };

  // Helper function to get token expiration time
  const getTokenExpirationTime = (token?: string): Date | null => {
    const tokenToCheck = token || accessToken;
    if (!tokenToCheck) return null;
    
    const decoded = decodeJWT(tokenToCheck);
    if (!decoded || !decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  };

  const isAuthenticated = !!user && !!accessToken && !isTokenExpired(accessToken || '');

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateTokens,
    isTokenExpired: checkTokenExpired,
    getTokenExpirationTime,
  };

  // Add global logout function for testing
  useEffect(() => {
    (window as any).forceLogout = () => {
      logout();
      window.location.href = '/auth/sign-in';
    };

    // Add global function to check token info for debugging
    (window as any).getTokenInfo = () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log('No access token found');
        return null;
      }
      
      const decoded = decodeJWT(token);
      if (!decoded) {
        console.log('Invalid token format');
        return null;
      }
      
      const expirationDate = decoded.exp ? new Date(decoded.exp * 1000) : null;
      const isExpired = isTokenExpired(token);
      const timeUntilExpiration = expirationDate ? expirationDate.getTime() - Date.now() : null;
      
      const info = {
        isExpired,
        expirationDate: expirationDate?.toISOString(),
        timeUntilExpirationMs: timeUntilExpiration,
        timeUntilExpirationMin: timeUntilExpiration ? Math.floor(timeUntilExpiration / (1000 * 60)) : null,
        decodedPayload: decoded
      };
      
      console.log('🔍 Token Information:', info);
      return info;
    };
  }, [logout]);

  // Listen for 401 events from services and show session expired modal
  useEffect(() => {
    const onSessionExpired = () => setSessionExpired(true);
    if (typeof window !== 'undefined') {
      window.addEventListener('session-expired', onSessionExpired as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('session-expired', onSessionExpired as EventListener);
      }
    };
  }, []);

  // Periodic token expiration check
  useEffect(() => {
    if (!accessToken || !user) return;

    const checkTokenPeriodically = () => {
      if (accessToken && isTokenExpired(accessToken)) {
        console.log('Token expired during session, logging out user');
        logout(false); // Don't clear remembered credentials on automatic logout
      }
    };

    // Check token expiration every 30 seconds
    const intervalId = setInterval(checkTokenPeriodically, 30000);

    return () => clearInterval(intervalId);
  }, [accessToken, user, logout]);

  const handleSignInRedirect = () => {
    setSessionExpired(false);
    logout(false); // Don't clear remembered credentials when redirecting from session expiry
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/sign-in';
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {sessionExpired && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-dark">
            <h3 className="text-lg font-semibold text-dark dark:text-white">Session expired</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              Your session has expired. Please sign in again to continue.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSessionExpired(false)}
                className="rounded-md border px-3 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSignInRedirect}
                className="rounded-md bg-primary px-3 py-2 text-sm text-white"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
} 