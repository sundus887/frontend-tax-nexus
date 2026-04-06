import React from 'react';
import { Navigate } from 'react-router-dom';

// Check if user has admin role
const isAdmin = () => {
  const role = localStorage.getItem('role');
  return role === 'admin';
};

export default function AdminRoute({ children }) {
  const userIsAdmin = isAdmin();

  if (!userIsAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
