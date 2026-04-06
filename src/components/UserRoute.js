import React from 'react';
import { Navigate } from 'react-router-dom';
import { isClient } from '../utils/auth';

export default function UserRoute({ children }) {
  const userIsClient = isClient();

  if (!userIsClient) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
