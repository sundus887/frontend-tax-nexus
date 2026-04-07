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

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Admin API endpoints
export const adminAPI = {
  // Companies
  createCompany: (companyData) => api.post('/admin/company', companyData),
  getCompanies: () => api.get('/admin/companies'),
  
  // Users
  createUser: (userData) => api.post('/admin/create-user', userData),
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
