import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach bearer token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle standard API errors and JWT expirations
api.interceptors.response.use(
  (response) => {
    // Return standard response data directly
    return response.data;
  },
  (error) => {
    const customError = {
      success: false,
      message: error.response?.data?.message || 'A network error occurred. Please check your connection.',
      error: error.response?.data?.error || 'API_CONNECTION_ERROR',
      status: error.response?.status,
      details: error.response?.data?.details || null
    };

    // Auto-logout user on authentication expiration or invalid signatures
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?session_expired=true';
      }
    }

    return Promise.reject(customError);
  }
);

export default api;
