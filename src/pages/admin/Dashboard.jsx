import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';

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
      const companiesRes = await adminAPI.getCompanies();
      setCompanies(companiesRes.data || []);
      setStats({
        totalCompanies: companiesRes.data?.length || 0,
        totalUsers: 0
      });
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar userType="admin" />

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
        {/* Header */}
        <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px 24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Admin Dashboard</h1>
        </header>

        <main style={{ padding: '24px' }}>
          {/* Quick Actions */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Quick Actions</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => navigate('/admin/create-company')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                + Create Company
              </button>
              <button
                onClick={() => navigate('/admin/create-user')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                + Create User
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px' }}>Total Companies</h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{stats.totalCompanies}</p>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px' }}>Total Users</h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{stats.totalUsers}</p>
            </div>
          </div>

          {/* Company List */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Company List</h2>
              <button
                onClick={fetchData}
                style={{ color: '#2563eb', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Refresh
              </button>
            </div>
            
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading...</div>
            ) : error ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#dc2626' }}>{error}</div>
            ) : companies.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                No companies found. Create your first company!
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Name</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>NTN</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Province</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Environment</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                        {company.name}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7280' }}>
                        {company.ntn}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7280' }}>
                        {company.province}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7280' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
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
    </div>
  );
}
