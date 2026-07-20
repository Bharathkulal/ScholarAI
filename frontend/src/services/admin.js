import api from './api';

export const getAdminDashboardTelemetryApi = async () => {
  const response = await api.get('/admin/dashboard');
  return response;
};

export const getAdminAnalyticsChartsApi = async () => {
  const response = await api.get('/admin/analytics');
  return response;
};

export const downloadAdminReportApi = async (reportType = 'students', exportFormat = 'csv') => {
  const response = await api.get('/admin/reports', {
    params: { report_type: reportType, export_format: exportFormat },
    responseType: 'blob',
  });
  return response;
};

export const getAuditLogsApi = async (params = {}) => {
  const response = await api.get('/admin/audit-logs', { params });
  return response;
};

export const publishAnnouncementApi = async (announcementData) => {
  const response = await api.post('/admin/announcements', announcementData);
  return response;
};

export const getAnnouncementsApi = async () => {
  const response = await api.get('/admin/announcements');
  return response;
};
