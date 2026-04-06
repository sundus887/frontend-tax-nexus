import React from 'react';
import { isAdmin } from '../utils/auth';

export default function AdminDashboardPage() {
  const userIsAdmin = isAdmin();

  if (!userIsAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="pageTitle">Admin Dashboard</div>
          <div className="pageSubtitle">Manage your system and users</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div className="card">
          <div className="cardHeader">
            <div className="cardTitle">Quick Actions</div>
          </div>
          <div className="form">
            <div className="formRow">
              <div className="field">
                <div className="label">Admin Actions</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    type="button" 
                    className="primaryBtn"
                    onClick={() => window.location.href = '/admin/create-company'}
                  >
                    Create Company
                  </button>
                  <button 
                    type="button" 
                    className="primaryBtn"
                    onClick={() => window.location.href = '/admin/create-user'}
                  >
                    Create User
                  </button>
                  <button type="button" className="ghostBtn">
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <div className="cardTitle">Company List</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { id: 1, name: 'ABC Trading Company', ntn: '1234567-8', status: 'Active', users: 3 },
            { id: 2, name: 'XYZ Industries', ntn: '8765432-1', status: 'Active', users: 5 },
            { id: 3, name: 'Tech Solutions Pvt Ltd', ntn: '4567890-2', status: 'Pending', users: 0 },
            { id: 4, name: 'Global Exports Ltd', ntn: '9876543-0', status: 'Active', users: 2 }
          ].map((company) => (
            <div key={company.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{company.name}</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>NTN: {company.ntn}</div>
              </div>
              <div style={{ textAlign: 'center', marginRight: '20px' }}>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Users</div>
                <div style={{ fontWeight: '600', fontSize: '18px' }}>{company.users}</div>
              </div>
              <div className={company.status === 'Active' ? 'pill pillOk' : 'pill pillBad'}>
                {company.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="card">
          <div className="cardHeader">
            <div className="cardTitle">System Statistics</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>4</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Total Companies</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>10</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Total Users</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>1</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Pending</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>3</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Active</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div className="cardTitle">Recent Activity</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>New company registered</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Tech Solutions Pvt Ltd - 2 hours ago</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>User account created</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>john@company.com - 4 hours ago</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>System backup completed</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Daily backup - 6 hours ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
