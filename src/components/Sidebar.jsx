import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ userType }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const adminMenu = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '◻' },
    { path: '/admin/create-company', label: 'Create Company', icon: '+' },
    { path: '/admin/create-user', label: 'Create User', icon: '👤' },
  ];

  const clientMenu = [
    { path: '/dashboard', label: 'Dashboard', icon: '◻' },
    { path: '/upload', label: 'Upload Invoice', icon: '⬆' },
    { path: '/invoices', label: 'Invoice History', icon: '📄' },
  ];

  const menuItems = userType === 'admin' ? adminMenu : clientMenu;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div style={{
      width: '260px',
      minHeight: '100vh',
      backgroundColor: '#1e293b',
      color: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Logo Section */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <img
          src="/logo.jpg"
          alt="Tax Nexus"
          style={{ height: '40px', width: '40px', objectFit: 'contain' }}
        />
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>TAX NEXUS</span>
      </div>

      {/* Navigation Menu */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '4px',
              backgroundColor: isActive(item.path) ? '#2563eb' : 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              textAlign: 'left',
              transition: 'background-color 0.2s'
            }}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid #334155' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: 'transparent',
            color: '#ef4444',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            textAlign: 'left'
          }}
        >
          <span style={{ fontSize: '18px' }}>→</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
