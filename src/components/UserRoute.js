import React from 'react';
import { Navigate } from 'react-router-dom';

// Check if user has user role (company user)
const isUser = () => {
  const role = localStorage.getItem('role');
  return role === 'user';
};

export default function UserRoute({ children }) {
  const userIsUser = isUser();

  if (!userIsUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
