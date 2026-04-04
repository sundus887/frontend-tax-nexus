import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/Sidebar';
import AdminNavbar from '../../components/admin/Navbar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1">
          <AdminNavbar />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
