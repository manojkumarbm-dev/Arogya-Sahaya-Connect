import axios from 'axios';
import { appParams } from '@/lib/app-params';

// Create an axios instance for API calls
export const apiClient = axios.create({
  baseURL: appParams.appBaseUrl || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    if (appParams.token) {
      config.headers.Authorization = `Bearer ${appParams.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Provide a simple auth object for compatibility
export const auth = {
  me: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      throw error;
    }
  }
};
