import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  loginApi,
  registerApi,
  getMeApi,
  refreshTokenApi,
  logoutApi,
  googleLoginApi,
  updateProfileApi,
} from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Synchronize authentication tokens & local storage
  const saveAuthSession = (userData, tokens) => {
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;

    localStorage.setItem('token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(accessToken);
    setUser(userData);
  };

  const clearAuthSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Restore authenticated session on application mount
  const checkAuth = useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    const savedRefreshToken = localStorage.getItem('refresh_token');

    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await getMeApi();
      if (res && res.user) {
        setUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      }
    } catch (error) {
      // Attempt token refresh if initial fetch fails
      if (savedRefreshToken) {
        try {
          const refreshRes = await refreshTokenApi(savedRefreshToken);
          if (refreshRes && refreshRes.access_token) {
            localStorage.setItem('token', refreshRes.access_token);
            setToken(refreshRes.access_token);
            
            const userRes = await getMeApi();
            if (userRes && userRes.user) {
              setUser(userRes.user);
              localStorage.setItem('user', JSON.stringify(userRes.user));
            }
          } else {
            clearAuthSession();
          }
        } catch (refreshErr) {
          clearAuthSession();
        }
      } else {
        clearAuthSession();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login with email & password
  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    const { user: userData, tokens } = res;
    saveAuthSession(userData, tokens);
    return userData;
  };

  // Register new student account
  const register = async (userData) => {
    const res = await registerApi(userData);
    const { user: createdUser, tokens } = res;
    saveAuthSession(createdUser, tokens);
    return createdUser;
  };

  // Google OAuth sign in
  const googleLogin = async (googlePayload) => {
    const res = await googleLoginApi(googlePayload);
    const { user: userData, tokens } = res;
    saveAuthSession(userData, tokens);
    return userData;
  };

  // Update student profile
  const updateUserProfile = async (profileData) => {
    const res = await updateProfileApi(profileData);
    if (res && res.profile) {
      setUser(res.profile);
      localStorage.setItem('user', JSON.stringify(res.profile));
      return res.profile;
    }
    return user;
  };

  // Logout current session
  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    await logoutApi(refreshToken);
    clearAuthSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
