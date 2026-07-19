import api from './api';

export const getStudentProfileApi = async () => {
  const response = await api.get('/students/profile');
  return response.data;
};

export const updateStudentProfileApi = async (profileData) => {
  const response = await api.put('/students/profile', profileData);
  return response.data;
};

export const uploadAvatarApi = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/students/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadDocumentApi = async (file, type, title = '') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  if (title) {
    formData.append('title', title);
  }

  const response = await api.post('/students/profile/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteDocumentApi = async (documentId) => {
  const response = await api.delete(`/students/profile/documents/${documentId}`);
  return response;
};

export const getProfileCompletionApi = async () => {
  const response = await api.get('/students/profile/completion');
  return response.data;
};

export const getEligibilityEvaluationApi = async () => {
  const response = await api.get('/students/profile/eligibility');
  return response.data;
};
