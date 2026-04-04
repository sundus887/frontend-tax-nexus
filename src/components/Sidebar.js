import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DashboardIcon,
  UploadIcon,
  HistoryIcon,
  SettingsIcon,
  LogoutIcon,
} from './icons';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: DashboardIcon, href: '/dashboard' },
  { key: 'upload', label: 'Upload Invoice', icon: UploadIcon, href: '/upload' },
  { key: 'history', label: 'Invoice History', icon: HistoryIcon, href: '/history' },
  { key: 'settings', label: 'Settings', icon: SettingsIcon, href: '/settings' },
];

export default function Sidebar({ activePage }) {
  const [collapsed, setCollapsed] = useState(false);

  const brand = useMemo(
    () => ({
      name: 'TAX NEXUS',
      subtitle: 'E-Invoicing',
    }),
    []
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
        <Link to="/logout" className="navItem logout">
          <span className="navIcon" aria-hidden="true">
            <LogoutIcon size={18} />
          </span>
          {!collapsed && <span className="navLabel">Logout</span>}
        </Link>
      </div>
    </aside>
  );
}
