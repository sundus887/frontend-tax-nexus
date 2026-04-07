import axios from 'axios';

const API_BASE_URL = 'https://taxnexus-backend.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints using fetch (no CORS issues)
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return { data: await response.json() };
  },
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Registration failed');
    return { data: await response.json() };
  },
};

// Helper function for authenticated fetch
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = new Error(`API error: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  
  const data = await response.json();
  return { data };
};

// Admin API endpoints
export const adminAPI = {
  // Companies
  createCompany: (companyData) => authFetch('/admin/company', {
    method: 'POST',
    body: JSON.stringify(companyData),
  }),
  getCompanies: () => authFetch('/admin/companies'),
  
  // Users
  createUser: (userData) => authFetch('/admin/create-user', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
};

// Client API endpoints
export const clientAPI = {
  // Invoices
  getInvoices: () => api.get('/invoice/history'),
  getInvoice: (id) => api.get(`/invoice/${id}`),
  uploadInvoice: (formData) => api.post('/invoice/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  sendToFBR: (id) => api.post(`/invoice/send/${id}`),
};

export default api;
