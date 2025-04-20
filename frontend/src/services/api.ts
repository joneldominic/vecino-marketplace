import axios, { AxiosError } from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Add a timeout to fail fast when the backend is not available
  timeout: 5000,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor for handling errors
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    // Check if error is due to connection issues
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('API Connection Error: Backend may not be running', error.message);
      return Promise.reject(new Error('Backend connection failed. Backend may not be running.'));
    }

    // Handle common errors here (e.g., 401 unauthorized, etc.)
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.error('Authentication Error: Not authenticated', error);
        // Could do something with auth here, like redirect to login
      } else if (status === 403) {
        console.error('Authorization Error: Not authorized', error);
      } else if (status === 404) {
        console.error('Not Found Error: Resource not found', error);
      } else if (status >= 500) {
        console.error('Server Error: Internal server error', error);
      }
    }

    return Promise.reject(error);
  },
);

// API endpoints
export const testApi = {
  getTestData: () =>
    api.get('/test').catch(error => {
      console.error('Failed to get test data', error);
      throw error;
    }),
};

export default api;
