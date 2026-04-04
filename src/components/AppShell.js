import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell({ activePage, children }) {
  return (
    <div className="appRoot">
      <Sidebar activePage={activePage} />
      <div className="appMain">
        <Topbar />
        <main className="appContent">{children}</main>
      </div>
    </div>
  );
}
