import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminProtectedRoute from './pages/admin/AdminProtectedRoute';
import AdminDashboard from './pages/admin/Dashboard';
import CreateCompany from './pages/admin/CreateCompany';
import CreateUser from './pages/admin/CreateUser';
import './admin.css';

function AdminApp() {
  return (
    <Router>
      <div className="admin-container">
        <Routes>
          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="create-company" element={<CreateCompany />} />
            <Route path="create-user" element={<CreateUser />} />
          </Route>
          
          {/* Catch all - redirect to admin login */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AdminApp;
