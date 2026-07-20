import api from './api';

export const registerApi = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response;
};

export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response;
};

export const getMeApi = async () => {
  const response = await api.get('/auth/me');
  return response;
};

export const refreshTokenApi = async (refreshToken) => {
  const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
  return response;
};

export const logoutApi = async (refreshToken) => {
  try {
    const response = await api.post('/auth/logout', { refresh_token: refreshToken });
    return response;
  } catch (error) {
    // Ignore network error on logout
    return null;
  }
};

export const forgotPasswordApi = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response;
};

export const resetPasswordApi = async (token, newPassword) => {
  const response = await api.post('/auth/reset-password', {
    token,
    new_password: newPassword,
  });
  return response;
};

export const googleLoginApi = async (googlePayload) => {
  const response = await api.post('/auth/google', googlePayload);
  return response;
};

export const updateProfileApi = async (profileData) => {
  const response = await api.put('/students/profile', profileData);
  return response;
};
