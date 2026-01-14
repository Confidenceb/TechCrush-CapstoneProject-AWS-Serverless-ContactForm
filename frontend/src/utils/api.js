import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============ FILE OPERATIONS ============

/**
 * Upload file to S3 via backend (using multer)
 * @param {File} file 
 * @returns {Promise<{file: object}>}
 */
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * Get all user's files from DynamoDB
 * @returns {Promise<{files: array}>}
 */
export const getUserFiles = async () => {
  const response = await api.get('/protected');
  return response.data;
};

/**
 * Get file download/preview URL
 * @param {string} fileId 
 * @returns {Promise<string>} - Signed S3 URL
 */
export const getFileUrl = async (fileId) => {
  const response = await api.get(`/files/${fileId}`);
  return response.data.downloadUrl;
};

/**
 * Delete file
 * @param {string} fileId 
 * @returns {Promise<{message: string}>}
 */
export const deleteFile = async (fileId) => {
  const response = await api.delete(`/files/${fileId}`);
  return response.data;
};

export default api;