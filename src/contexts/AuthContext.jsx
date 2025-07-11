
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('dentsu_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    
    // Mock authentication - replace with real API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@dentsu.com' && password === 'admin123') {
      const adminUser = {
        id: '1',
        name: 'Admin User',
        email: 'admin@dentsu.com',
        role: 'admin',
        team: 'Admin'
      };
      setUser(adminUser);
      localStorage.setItem('dentsu_user', JSON.stringify(adminUser));
    } else if (email === 'user@dentsu.com' && password === 'user123') {
      const regularUser = {
        id: '2',
        name: 'John Doe',
        email: 'user@dentsu.com',
        role: 'user',
        team: 'Creative'
      };
      setUser(regularUser);
      localStorage.setItem('dentsu_user', JSON.stringify(regularUser));
    } else {
      throw new Error('Invalid credentials');
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dentsu_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
