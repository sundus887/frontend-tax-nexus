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

// Admin API endpoints
export const adminAPI = {
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
};

// Client API endpoints
export const clientAPI = {
  // Invoices
  getInvoices: () => api.get('/invoices'),
  uploadInvoice: (formData) => api.post('/invoice/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  // Company info
  getCompanyInfo: () => api.get('/company'),
};

export default api;
