import axios from 'axios';

const API_BASE_URL = 'https://taxnexus-backend.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin API endpoints
export const adminAPI = {
  // Authentication
  login: (credentials) => api.post('/api/admin/login', credentials),
  
  // Companies
  createCompany: (companyData) => api.post('/api/admin/company', companyData),
  getCompanies: () => api.get('/api/admin/companies'),
  updateCompany: (id, data) => api.put(`/api/admin/company/${id}`, data),
  deleteCompany: (id) => api.delete(`/api/admin/company/${id}`),
  
  // Users
  createUser: (userData) => api.post('/api/admin/create-user', userData),
  getUsers: () => api.get('/api/admin/users'),
  updateUser: (id, data) => api.put(`/api/admin/user/${id}`, data),
  deleteUser: (id) => api.delete(`/api/admin/user/${id}`),
  
  // Dashboard stats
  getStats: () => api.get('/api/admin/stats'),
  getRecentActivity: () => api.get('/api/admin/activity'),
  
  // Connection test
  testConnection: () => api.get('/api/health'),
};

// Client API endpoints (for regular users)
export const clientAPI = {
  // Authentication
  login: (credentials) => api.post('/api/client/login', credentials),
  
  // Invoices
  getInvoices: () => api.get('/api/client/invoices'),
  createInvoice: (invoiceData) => api.post('/api/client/invoice', invoiceData),
  updateInvoice: (id, data) => api.put(`/api/client/invoice/${id}`, data),
  deleteInvoice: (id) => api.delete(`/api/client/invoice/${id}`),
  
  // Company info
  getCompanyInfo: () => api.get('/api/client/company'),
  updateCompanyInfo: (data) => api.put('/api/client/company', data),
};

export default api;
