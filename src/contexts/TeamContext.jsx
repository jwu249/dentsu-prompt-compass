
import React, { createContext, useContext, useState, useEffect } from 'react';

const TeamContext = createContext(undefined);

export const TeamProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Load teams and users from localStorage
    const savedTeams = localStorage.getItem('dentsu_teams');
    const savedUsers = localStorage.getItem('dentsu_users');

    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    } else {
      // Initialize with default teams
      const defaultTeams = [
        { id: '1', name: 'Creative Team', description: 'Creative and design professionals', instance: 'creative', color: 'bg-blue-500' },
        { id: '2', name: 'Strategy Team', description: 'Strategic planning and analysis', instance: 'strategy', color: 'bg-green-500' },
        { id: '3', name: 'Technology Team', description: 'Technical development and innovation', instance: 'tech', color: 'bg-purple-500' },
        { id: '4', name: 'Admin Team', description: 'Administrative and management', instance: 'admin', color: 'bg-red-500' }
      ];
      setTeams(defaultTeams);
      localStorage.setItem('dentsu_teams', JSON.stringify(defaultTeams));
    }

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Initialize with default users
      const defaultUsers = [
        { 
          id: '1', 
          name: 'Admin User', 
          email: 'admin@dentsu.com', 
          role: 'admin', 
          teamId: '4',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'John Doe', 
          email: 'user@dentsu.com', 
          role: 'user', 
          teamId: '1',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('dentsu_users', JSON.stringify(defaultUsers));
    }
  }, []);

  const saveTeams = (newTeams) => {
    setTeams(newTeams);
    localStorage.setItem('dentsu_teams', JSON.stringify(newTeams));
  };

  const saveUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem('dentsu_users', JSON.stringify(newUsers));
  };

  const createTeam = (teamData) => {
    const newTeam = {
      id: Date.now().toString(),
      ...teamData,
      createdAt: new Date().toISOString()
    };
    const updatedTeams = [...teams, newTeam];
    saveTeams(updatedTeams);
    return newTeam;
  };

  const updateTeam = (teamId, teamData) => {
    const updatedTeams = teams.map(team => 
      team.id === teamId ? { ...team, ...teamData } : team
    );
    saveTeams(updatedTeams);
  };

  const deleteTeam = (teamId) => {
    const updatedTeams = teams.filter(team => team.id !== teamId);
    saveTeams(updatedTeams);
    
    // Remove users from deleted team
    const updatedUsers = users.map(user => 
      user.teamId === teamId ? { ...user, teamId: null } : user
    );
    saveUsers(updatedUsers);
  };

  const createUser = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    return newUser;
  };

  const updateUser = (userId, userData) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    );
    saveUsers(updatedUsers);
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    saveUsers(updatedUsers);
  };

  const assignUserToTeam = (userId, teamId) => {
    updateUser(userId, { teamId });
  };

  const removeUserFromTeam = (userId) => {
    updateUser(userId, { teamId: null });
  };

  const getTeamById = (teamId) => {
    return teams.find(team => team.id === teamId);
  };

  const getUsersByTeam = (teamId) => {
    return users.filter(user => user.teamId === teamId);
  };

  return (
    <TeamContext.Provider value={{
      teams,
      users,
      createTeam,
      updateTeam,
      deleteTeam,
      createUser,
      updateUser,
      deleteUser,
      assignUserToTeam,
      removeUserFromTeam,
      getTeamById,
      getUsersByTeam
    }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
