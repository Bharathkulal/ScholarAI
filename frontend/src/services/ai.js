import api from './api';

export const getAIRecommendationsApi = async (limit = 10) => {
  const response = await api.get('/ai/recommendations', { params: { limit } });
  return response;
};

export const getAIProfileAnalysisApi = async () => {
  const response = await api.get('/ai/profile-analysis');
  return response;
};

export const getAIEligibilityReportApi = async () => {
  const response = await api.get('/ai/eligibility-report');
  return response;
};

export const sendAIChatQuestionApi = async (question) => {
  const response = await api.post('/ai/chat', { question });
  return response;
};

export const compareScholarshipsApi = async (scholarshipIds) => {
  const response = await api.post('/ai/compare', { scholarship_ids: scholarshipIds });
  return response;
};

export const nlSearchApi = async (query) => {
  const response = await api.post('/ai/nl-search', { query });
  return response;
};
