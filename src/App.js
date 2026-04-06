import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import AdminRoute from './components/AdminRoute';
import UserRoute from './components/UserRoute';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import CreateCompany from './pages/admin/CreateCompany';
import CreateUser from './pages/admin/CreateUser';
import ClientDashboard from './pages/client/Dashboard';
import UploadInvoice from './pages/client/UploadInvoice';
import InvoiceHistory from './pages/client/InvoiceHistory';

// Check authentication
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Auth wrapper component
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* ADMIN ROUTES */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/create-company" element={
          <ProtectedRoute>
            <AdminRoute>
              <CreateCompany />
            </AdminRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/create-user" element={
          <ProtectedRoute>
            <AdminRoute>
              <CreateUser />
            </AdminRoute>
          </ProtectedRoute>
        } />

        {/* CLIENT ROUTES */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <UserRoute>
              <ClientDashboard />
            </UserRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/upload" element={
          <ProtectedRoute>
            <UserRoute>
              <UploadInvoice />
            </UserRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/invoices" element={
          <ProtectedRoute>
            <UserRoute>
              <InvoiceHistory />
            </UserRoute>
          </ProtectedRoute>
        } />

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
