import api from './api';

// Student Public APIs
export const getScholarshipsApi = async (params = {}) => {
  const response = await api.get('/scholarships', { params });
  return response.data;
};

export const searchScholarshipsApi = async (query, page = 1, limit = 10) => {
  const response = await api.get('/scholarships/search', { params: { query, page, limit } });
  return response.data;
};

export const filterScholarshipsApi = async (params = {}) => {
  const response = await api.get('/scholarships/filter', { params });
  return response.data;
};

export const getScholarshipBySlugApi = async (slug) => {
  const response = await api.get(`/scholarships/${slug}`);
  return response.data;
};

export const getScholarshipCategoriesApi = async () => {
  const response = await api.get('/scholarships/categories');
  return response.data;
};

export const getScholarshipProvidersApi = async () => {
  const response = await api.get('/scholarships/providers');
  return response.data;
};

// Admin Management APIs
export const getAdminScholarshipsApi = async (params = {}) => {
  const response = await api.get('/admin/scholarships', { params });
  return response.data;
};

export const getAdminScholarshipDetailApi = async (id) => {
  const response = await api.get(`/admin/scholarships/${id}`);
  return response.data;
};

export const createScholarshipApi = async (scholarshipData) => {
  const response = await api.post('/admin/scholarships', scholarshipData);
  return response.data;
};

export const updateScholarshipApi = async (id, scholarshipData) => {
  const response = await api.put(`/admin/scholarships/${id}`, scholarshipData);
  return response.data;
};

export const archiveScholarshipApi = async (id) => {
  const response = await api.delete(`/admin/scholarships/${id}`);
  return response;
};

export const publishScholarshipApi = async (id, publish = true) => {
  const response = await api.post(`/admin/scholarships/${id}/publish`, { publish });
  return response.data;
};

export const importScholarshipsCsvApi = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/admin/scholarships/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const exportScholarshipsCsvApi = async () => {
  const response = await api.get('/admin/scholarships/export', {
    responseType: 'blob',
  });
  return response;
};
