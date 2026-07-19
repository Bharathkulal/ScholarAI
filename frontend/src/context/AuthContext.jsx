import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const MOCK_PROFILES = {
  student: {
    email: 'student@scholarai.com',
    role: 'student',
    full_name: 'Ananya Gowda',
    gpa: '9.2 CGPA',
    income: '₹2,40,000 / year',
    category: 'OBC (Cat-3A)',
    state: 'Karnataka',
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

  const login = async (email, password, customProfile = null) => {
    let activeProfile = null;
    if (customProfile) {
      activeProfile = {
        ...MOCK_PROFILES.student,
        ...customProfile,
        role: 'student',
      };
    } else if (email && email.includes('admin')) {
      activeProfile = MOCK_PROFILES.admin;
    } else {
      activeProfile = {
        ...MOCK_PROFILES.student,
        email: email || MOCK_PROFILES.student.email,
      };
    }

    const mockToken = `jwt_token_${activeProfile.role}_${Date.now()}`;
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(activeProfile));
    
    setUser(activeProfile);
    setToken(mockToken);
    return activeProfile;
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
      const mockToken = `jwt_token_${role}_${Date.now()}`;
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
