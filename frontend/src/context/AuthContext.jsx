import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const MOCK_PROFILES = {
  student: {
    email: 'student@scholarai.com',
    role: 'student',
    full_name: 'Amit Kumar',
    gpa: '9.2',
    income: '240,000 INR',
    category: 'OBC',
    state: 'Maharashtra',
    savedCount: 5,
    appliedCount: 2,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
  },
  admin: {
    email: 'admin@scholarai.com',
    role: 'admin',
    full_name: 'Dr. Rajesh Sharma',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = async (email, password) => {
    // Simulated mock authentication logic
    let mockProfile = null;
    if (email.includes('admin')) {
      mockProfile = MOCK_PROFILES.admin;
    } else {
      mockProfile = MOCK_PROFILES.student;
    }

    const mockToken = `mock_jwt_token_${mockProfile.role}`;
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockProfile));
    
    setUser(mockProfile);
    setToken(mockToken);
    return mockProfile;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  const switchRole = (role) => {
    if (!role) {
      logout();
      return;
    }
    const profile = MOCK_PROFILES[role];
    if (profile) {
      const mockToken = `mock_jwt_token_${role}`;
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(profile));
      setUser(profile);
      setToken(mockToken);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};
