import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '../utils/auth';

export default function AdminRoute({ children }) {
  const userIsAdmin = isAdmin();

  if (!userIsAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
