import axios from 'axios';

const API_BASE_URL = 'https://taxnexus-backend.onrender.com/api';

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
    // Try adminToken first (for admin routes), then token (for client routes)
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
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
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin API endpoints
export const adminAPI = {
  // Authentication
  login: (credentials) => api.post('/admin/login', credentials),
  
  // Companies
  createCompany: (companyData) => api.post('/admin/company', companyData),
  getCompanies: () => api.get('/admin/companies'),
  updateCompany: (id, data) => api.put(`/admin/company/${id}`, data),
  deleteCompany: (id) => api.delete(`/admin/company/${id}`),
  
  // Users
  createUser: (userData) => api.post('/admin/create-user', userData),
  getUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/user/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
  
  // Dashboard stats
  getStats: () => api.get('/admin/stats'),
  getRecentActivity: () => api.get('/admin/activity'),
  
  // Connection test
  testConnection: () => api.get('/health'),
};

// Client API endpoints (for regular users)
export const clientAPI = {
  // Authentication
  login: (credentials) => api.post('/client/login', credentials),
  
  // Invoices
  getInvoices: () => api.get('/client/invoices'),
  createInvoice: (invoiceData) => api.post('/client/invoice', invoiceData),
  updateInvoice: (id, data) => api.put(`/client/invoice/${id}`, data),
  deleteInvoice: (id) => api.delete(`/client/invoice/${id}`),
  
  // Company info
  getCompanyInfo: () => api.get('/client/company'),
  updateCompanyInfo: (data) => api.put('/client/company', data),
};

export default api;
