import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';

export default function AdminDashboard() {
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState({ totalCompanies: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [companiesRes, statsRes] = await Promise.all([
        adminAPI.getCompanies(),
        adminAPI.getStats().catch(() => ({ data: { totalCompanies: 0, totalUsers: 0 } }))
      ]);
      
      setCompanies(companiesRes.data || []);
      setStats(statsRes.data || { totalCompanies: 0, totalUsers: 0 });
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src="/logo.jpg"
              alt="Tax Nexus Logo"
              style={{ height: '48px', width: 'auto' }}
            />
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>TAX NEXUS</h1>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Admin Panel</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Quick Actions */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => navigate('/admin/create-company')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              + Create Company
            </button>
            <button
              onClick={() => navigate('/admin/create-user')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              + Create User
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Total Companies</h3>
            <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827' }}>{stats.totalCompanies}</p>
          </div>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Total Users</h3>
            <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827' }}>{stats.totalUsers}</p>
          </div>
        </div>

        {/* Company List */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Company List</h2>
            <button
              onClick={fetchData}
              style={{ color: '#2563eb', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Refresh
            </button>
          </div>
          
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>Loading...</div>
          ) : error ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#dc2626' }}>{error}</div>
          ) : companies.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
              No companies found. Create your first company!
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Name</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>NTN</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Province</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Environment</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                      {company.name}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                      {company.ntn}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                      {company.province}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: company.environment === 'production' ? '#d1fae5' : '#fef3c7',
                        color: company.environment === 'production' ? '#065f46' : '#92400e'
                      }}>
                        {company.environment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
