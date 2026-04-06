import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import AppShell from './components/AppShell';
import UploadInvoicePage from './pages/UploadInvoicePage';
import InvoiceHistoryPage from './pages/InvoiceHistoryPage';
import SettingsPage from './pages/SettingsPage';
import LogoutPage from './pages/LogoutPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import AdminRoute from './components/AdminRoute';
import UserRoute from './components/UserRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CreateCompanyPage from './pages/CreateCompanyPage';
import CreateUserPage from './pages/CreateUserPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import { isAuthenticated } from './utils/auth';

function AuthWrapper({ children }) {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return isAuthenticated();
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(isAuthenticated());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, []);

  if (location.pathname === '/login' || location.pathname === '/logout') {
    return children;
  }

  return isLoggedIn ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* ADMIN ROUTES */}
        <Route path="/admin/dashboard" element={
          <AuthWrapper>
            <AdminRoute>
              <AppShell activePage="dashboard">
                <AdminDashboardPage />
              </AppShell>
            </AdminRoute>
          </AuthWrapper>
        } />
        
        <Route path="/admin/create-company" element={
          <AuthWrapper>
            <AdminRoute>
              <AppShell activePage="create-company">
                <CreateCompanyPage />
              </AppShell>
            </AdminRoute>
          </AuthWrapper>
        } />

        <Route path="/admin/create-user" element={
          <AuthWrapper>
            <AdminRoute>
              <AppShell activePage="create-user">
                <CreateUserPage />
              </AppShell>
            </AdminRoute>
          </AuthWrapper>
        } />

        {/* CLIENT ROUTES */}
        <Route path="/dashboard" element={
          <AuthWrapper>
            <UserRoute>
              <AppShell activePage="dashboard">
                <ClientDashboardPage />
              </AppShell>
            </UserRoute>
          </AuthWrapper>
        } />
        
        <Route path="/upload" element={
          <AuthWrapper>
            <UserRoute>
              <AppShell activePage="upload">
                <UploadInvoicePage />
              </AppShell>
            </UserRoute>
          </AuthWrapper>
        } />
        
        <Route path="/invoices" element={
          <AuthWrapper>
            <UserRoute>
              <AppShell activePage="invoices">
                <InvoiceHistoryPage />
              </AppShell>
            </UserRoute>
          </AuthWrapper>
        } />
        
        <Route path="/history" element={
          <AuthWrapper>
            <UserRoute>
              <AppShell activePage="history">
                <InvoiceHistoryPage />
              </AppShell>
            </UserRoute>
          </AuthWrapper>
        } />
        
        <Route path="/settings" element={
          <AuthWrapper>
            <UserRoute>
              <AppShell activePage="settings">
                <SettingsPage />
              </AppShell>
            </UserRoute>
          </AuthWrapper>
        } />

        {/* LEGACY ROUTES - Redirect to role-specific routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
