
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
    
    // Get users from localStorage to validate against dynamic user list
    const savedUsers = localStorage.getItem('dentsu_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    // Find user by email and validate password (in real app, password would be hashed)
    const foundUser = users.find(u => u.email === email && u.status === 'active');
    
    if (foundUser) {
      // In a real app, you'd validate the password properly
      // For demo purposes, we'll use simple password validation
      let isValidPassword = false;
      
      if (email === 'admin@dentsu.com' && password === 'admin123') {
        isValidPassword = true;
      } else if (email === 'user@dentsu.com' && password === 'user123') {
        isValidPassword = true;
      } else {
        // For other users, use a default password pattern
        isValidPassword = password === 'password123';
      }
      
      if (isValidPassword) {
        // Get team information
        const savedTeams = localStorage.getItem('dentsu_teams');
        const teams = savedTeams ? JSON.parse(savedTeams) : [];
        const userTeam = teams.find(t => t.id === foundUser.teamId);
        
        const userWithTeam = {
          ...foundUser,
          team: userTeam ? userTeam.name : null,
          instance: userTeam ? userTeam.instance : null
        };
        
        setUser(userWithTeam);
        localStorage.setItem('dentsu_user', JSON.stringify(userWithTeam));
      } else {
        throw new Error('Invalid credentials');
      }
    } else {
      // Fallback to original hardcoded users for backward compatibility
      if (email === 'admin@dentsu.com' && password === 'admin123') {
        const adminUser = {
          id: '1',
          name: 'Admin User',
          email: 'admin@dentsu.com',
          role: 'admin',
          team: 'Admin',
          instance: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem('dentsu_user', JSON.stringify(adminUser));
      } else if (email === 'user@dentsu.com' && password === 'user123') {
        const regularUser = {
          id: '2',
          name: 'John Doe',
          email: 'user@dentsu.com',
          role: 'user',
          team: 'Creative',
          instance: 'creative'
        };
        setUser(regularUser);
        localStorage.setItem('dentsu_user', JSON.stringify(regularUser));
      } else {
        throw new Error('Invalid credentials');
      }
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
