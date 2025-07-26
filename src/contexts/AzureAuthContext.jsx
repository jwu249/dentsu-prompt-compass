import React, { createContext, useContext, useState, useEffect } from 'react';

const AzureAuthContext = createContext(undefined);

const AUTHORIZED_EMAILS = [
  'admin@dentsu.com',
  'user@dentsu.com',
  // Add more authorized emails here
];

export const AzureAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Fetch user info from Azure Static Web Apps authentication
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/.auth/me');
      const payload = await response.json();
      const { clientPrincipal } = payload;

      if (clientPrincipal && AUTHORIZED_EMAILS.includes(clientPrincipal.userDetails)) {
        const userData = {
          id: clientPrincipal.userId,
          name: clientPrincipal.userDetails,
          email: clientPrincipal.userDetails,
          role: clientPrincipal.userDetails === 'admin@dentsu.com' ? 'admin' : 'user'
        };
        setUser(userData);
        setIsAdmin(userData.role === 'admin');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      // For development, use mock data
      if (process.env.NODE_ENV === 'development') {
        const mockUser = {
          id: '1',
          name: 'Development User',
          email: 'dev@dentsu.com',
          role: 'admin'
        };
        setUser(mockUser);
        setIsAdmin(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdminMode = () => {
    if (user?.email === 'admin@dentsu.com' || process.env.NODE_ENV === 'development') {
      setIsAdmin(!isAdmin);
    }
  };

  const login = () => {
    window.location.href = '/.auth/login/aad';
  };

  const logout = () => {
    window.location.href = '/.auth/logout';
  };

  return (
    <AzureAuthContext.Provider value={{ 
      user, 
      isAdmin, 
      toggleAdminMode, 
      login, 
      logout, 
      isLoading 
    }}>
      {children}
    </AzureAuthContext.Provider>
  );
};

export const useAzureAuth = () => {
  const context = useContext(AzureAuthContext);
  if (context === undefined) {
    throw new Error('useAzureAuth must be used within an AzureAuthProvider');
  }
  return context;
};