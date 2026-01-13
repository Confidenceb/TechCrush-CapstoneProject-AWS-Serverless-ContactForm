import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock flag - easy to toggle when backend is ready
const USE_MOCK = true;

/**
 * Get a pre-signed URL for uploading a file
 * @param {string} filename 
 * @param {string} fileType 
 * @returns {Promise<{uploadUrl: string, key: string, fileId: string}>}
 */
export const getUploadUrl = async (filename, fileType) => {
  if (USE_MOCK) {
    console.log(`[MOCK] getUploadUrl for ${filename} (${fileType})`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          uploadUrl: 'https://httpbin.org/put', // Public echo service that accepts PUT
          key: `uploads/${Date.now()}-${filename}`,
          fileId: `file-${Date.now()}`
        });
      }, 800); // Simulate network delay
    });
  }
  
  const response = await api.post('/files/upload-url', { filename, fileType });
  return response.data;
};

/**
 * Get a pre-signed URL for downloading/viewing a file
 * @param {string} fileId 
 * @returns {Promise<{downloadUrl: string}>}
 */
export const getDownloadUrl = async (fileId) => {
  if (USE_MOCK) {
    console.log(`[MOCK] getDownloadUrl for ${fileId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return a placeholder image for preview purposes
        resolve({
          downloadUrl: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=800&q=80' 
        });
      }, 500);
    });
  }

  const response = await api.get(`/files/${fileId}/download-url`);
  return response.data;
};

// Add request interceptor to attach token if we have one
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

export default api;
