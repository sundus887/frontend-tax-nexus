import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import AppShell from './components/AppShell';
import DashboardPage from './pages/DashboardPage';
import UploadInvoicePage from './pages/UploadInvoicePage';
import InvoiceHistoryPage from './pages/InvoiceHistoryPage';
import SettingsPage from './pages/SettingsPage';
import LogoutPage from './pages/LogoutPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';

function AuthWrapper({ children }) {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return !!localStorage.getItem('authToken');
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        setIsLoggedIn(!!localStorage.getItem('authToken'));
      } catch {
        setIsLoggedIn(false);
      }
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
        <Route path="/*" element={
          <AuthWrapper>
            <Routes>
              <Route path="/" element={
                <AppShell activePage="dashboard">
                  <DashboardPage />
                </AppShell>
              } />
              <Route path="/dashboard" element={
                <AppShell activePage="dashboard">
                  <DashboardPage />
                </AppShell>
              } />
              <Route path="/upload" element={
                <AppShell activePage="upload">
                  <UploadInvoicePage />
                </AppShell>
              } />
              <Route path="/history" element={
                <AppShell activePage="history">
                  <InvoiceHistoryPage />
                </AppShell>
              } />
              <Route path="/settings" element={
                <AppShell activePage="settings">
                  <SettingsPage />
                </AppShell>
              } />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthWrapper>
        } />
      </Routes>
    </BrowserRouter>
  );
}
