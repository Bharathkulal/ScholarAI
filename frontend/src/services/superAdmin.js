import api from './api';

export const listAdminsApi = async () => {
  const response = await api.get('/super-admin/admins');
  return response.data;
};

export const createAdminApi = async (adminData) => {
  const response = await api.post('/super-admin/admins', adminData);
  return response.data;
};

export const updateAdminApi = async (id, adminData) => {
  const response = await api.put(`/super-admin/admins/${id}`, adminData);
  return response.data;
};

export const toggleAdminStatusApi = async (id, isActive) => {
  const response = await api.patch(`/super-admin/admins/${id}/status`, { is_active: isActive });
  return response.data;
};

export const deleteAdminApi = async (id) => {
  const response = await api.delete(`/super-admin/admins/${id}`);
  return response.data;
};

export const resetAdminPasswordApi = async (id, newPassword) => {
  const response = await api.post(`/super-admin/admins/${id}/reset-password`, { new_password: newPassword });
  return response.data;
};

export const getAuditLogsApi = async () => {
  const response = await api.get('/super-admin/audit-logs');
  return response.data;
};

export const getSystemSettingsApi = async () => {
  const response = await api.get('/super-admin/system-settings');
  return response.data;
};

export const updateSystemSettingsApi = async (settings) => {
  const response = await api.put('/super-admin/system-settings', settings);
  return response.data;
};

export const getSuperAdminAnalyticsApi = async () => {
  const response = await api.get('/super-admin/analytics');
  return response.data;
};
