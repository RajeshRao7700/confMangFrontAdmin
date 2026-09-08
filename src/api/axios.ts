import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://confmangsys.onrender.com';
const DEFAULT_TENANT_DOMAIN = import.meta.env.VITE_TENANT_DOMAIN || 'apex.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const isPublicEndpoint =
      config.url?.startsWith('/api/auth/master/login') ||
      config.url?.startsWith('/api/auth/conference/request-otp') ||
      config.url?.startsWith('/api/public/');

    const token = localStorage.getItem('conference_admin_token');
    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach tenant domain header if not present
    if (!config.headers['X-Tenant-Domain']) {
      config.headers['X-Tenant-Domain'] = DEFAULT_TENANT_DOMAIN;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear authentication state if session expired / invalid
      localStorage.removeItem('conference_admin_token');
      localStorage.removeItem('conference_admin_user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);
