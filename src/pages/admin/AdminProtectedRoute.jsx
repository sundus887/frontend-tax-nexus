import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('adminToken');

  if (!token) {
    // Redirect to admin login with return url
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
