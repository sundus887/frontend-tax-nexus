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
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('authToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('authToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    // Also listen for manual changes (e.g., from login)
    const interval = setInterval(() => {
      setIsLoggedIn(!!localStorage.getItem('authToken'));
    }, 500);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (!isLoggedIn && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  if (isLoggedIn && location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  return <AppShell activePage={location.pathname.slice(1) || 'dashboard'}>{children}</AppShell>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={
          <AuthWrapper>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/upload" element={<UploadInvoicePage />} />
              <Route path="/history" element={<InvoiceHistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthWrapper>
        } />
      </Routes>
    </BrowserRouter>
  );
}
