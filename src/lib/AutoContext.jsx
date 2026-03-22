import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/entities/User';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setAuthError(null);
      setIsLoadingAuth(true);
      const currentUser = await User.me();
      
      if (currentUser.isGuest) {
        // Guest user - not authenticated
        setUser(currentUser);
        setIsAuthenticated(false);
      } else {
        // Real authenticated user
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Not authenticated: set guest user state to allow browsing pages
      const guest = User.getGuestUser();
      setUser(guest);
      setIsAuthenticated(false);
      console.warn('User not authenticated, using guest account');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = async (shouldRedirect = true) => {
    await User.logout();
    setUser(null);
    setIsAuthenticated(false);

    if (shouldRedirect) {
      window.location.href = '/auth';
    }
  };

  const refreshAuth = async () => {
    await checkAppState();
  };

  const navigateToLogin = () => {
    window.location.href = '/auth';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      authError,
      logout,
      refreshAuth,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
