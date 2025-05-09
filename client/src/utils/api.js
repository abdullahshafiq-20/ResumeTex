import axios from 'axios';

// Create a base axios instance with common configuration
const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with an error status code
      if (error.response.status === 401) {
        // Handle unauthorized errors
        localStorage.removeItem('token');
        // You could redirect to login page here if needed
      }
    }
    return Promise.reject(error);
  }
);

export default api;