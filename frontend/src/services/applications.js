import api from './api';

// Student Application APIs
export const getStudentDashboardApi = async () => {
  const response = await api.get('/applications/dashboard');
  return response;
};

export const getStudentApplicationsApi = async (status) => {
  const response = await api.get('/applications', { params: { status } });
  return response;
};

export const getApplicationDetailApi = async (id) => {
  const response = await api.get(`/applications/${id}`);
  return response;
};

export const submitApplicationApi = async (payload) => {
  const response = await api.post('/applications', payload);
  return response;
};

export const withdrawApplicationApi = async (id) => {
  const response = await api.delete(`/applications/${id}`);
  return response;
};

export const toggleSaveScholarshipApi = async (scholarshipId) => {
  const response = await api.post('/applications/save', { scholarship_id: scholarshipId });
  return response;
};

export const removeSavedScholarshipApi = async (scholarshipId) => {
  const response = await api.delete(`/applications/save/${scholarshipId}`);
  return response;
};

export const getSavedScholarshipsApi = async () => {
  const response = await api.get('/applications/saved');
  return response;
};

// Admin Application Review APIs
export const getAdminApplicationsApi = async (params = {}) => {
  const response = await api.get('/admin/applications', { params });
  return response;
};

export const getAdminApplicationDetailApi = async (id) => {
  const response = await api.get(`/admin/applications/${id}`);
  return response;
};

export const reviewApplicationStatusApi = async (id, reviewData) => {
  const response = await api.put(`/admin/applications/${id}/status`, reviewData);
  return response;
};
