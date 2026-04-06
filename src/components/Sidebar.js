import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isAdmin } from '../utils/auth';
import {
  DashboardIcon,
  UploadIcon,
  HistoryIcon,
  SettingsIcon,
  LogoutIcon,
  CompanyIcon,
} from './icons';

export default function Sidebar({ activePage }) {
  const [collapsed, setCollapsed] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(() => isAdmin());

  // Listen for storage changes to update role
  useEffect(() => {
    const handleStorageChange = () => {
      setUserIsAdmin(isAdmin());
    };

    window.addEventListener('storage', handleStorageChange);
    // Also check on mount
    setUserIsAdmin(isAdmin());
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Role-based navigation items
  const NAV_ITEMS = useMemo(() => {
    const baseItems = [
      { key: 'dashboard', label: 'Dashboard', icon: DashboardIcon, href: userIsAdmin ? '/admin/dashboard' : '/dashboard' },
    ];

    if (userIsAdmin) {
      // Add admin-specific items
      baseItems.push(
        { key: 'create-company', label: 'Create Company', icon: CompanyIcon, href: '/admin/create-company' },
        { key: 'create-user', label: 'Create User', icon: CompanyIcon, href: '/admin/create-user' }
      );
    } else {
      // Add client-specific items
      baseItems.push(
        { key: 'upload', label: 'Upload Excel', icon: UploadIcon, href: '/upload' },
        { key: 'invoices', label: 'Invoices', icon: HistoryIcon, href: '/invoices' }
      );
    }

    // Add common items
    baseItems.push(
      { key: 'settings', label: 'Settings', icon: SettingsIcon, href: '/settings' }
    );

    return baseItems;
  }, [userIsAdmin]);

  const brand = useMemo(
    () => ({
      name: 'TAX NEXUS',
      subtitle: userIsAdmin ? 'Admin Panel' : 'E-Invoicing',
    }),
    [userIsAdmin]
  );

  return (
    <aside className={collapsed ? 'sidebar sidebarCollapsed' : 'sidebar'}>
      <div className="sidebarHeader">
        <div className="brandIcon" aria-hidden="true">
          <div className="brandIconInner" />
        </div>
        {!collapsed && (
          <div className="brandText">
            <div className="brandName">{brand.name}</div>
            <div className="brandSub">{brand.subtitle}</div>
          </div>
        )}

        <button
          type="button"
          className="collapseBtn"
          onClick={() => setCollapsed(v => !v)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '>' : '<'}
        </button>
      </div>

      <nav className="nav">
        {NAV_ITEMS.map(item => {
          const IconComp = item.icon;
          const isActive = activePage === item.key;

          return (
            <Link key={item.key} to={item.href} className={isActive ? 'navItem navItemActive' : 'navItem'}>
              <span className="navIcon" aria-hidden="true">
                <IconComp size={18} />
              </span>
              {!collapsed && <span className="navLabel">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebarFooter">
        <button 
          type="button"
          className="navItem logout" 
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
            window.location.href = '/login';
          }}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'inherit', 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            padding: '12px 16px',
            cursor: 'pointer'
          }}
        >
          <span className="navIcon" aria-hidden="true">
            <LogoutIcon size={18} />
          </span>
          {!collapsed && <span className="navLabel">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
