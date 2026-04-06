import React, { useEffect } from 'react';
import { isClient } from '../utils/auth';
import api from '../services/api';

export default function ClientDashboardPage() {
  const [userIsClient] = React.useState(() => isClient());

  // Test backend connection
  useEffect(() => {
    console.log('Testing backend connection...');
    
    // Test invoice endpoint
    api.get("/invoice")
      .then((res) => {
        console.log("✅ INVOICE DATA:", res.data);
      })
      .catch((err) => {
        console.log("❌ INVOICE ERROR:", err);
        console.log("Error details:", err.response?.data || err.message);
      });

    // Test health endpoint
    api.get("/health")
      .then((res) => {
        console.log("✅ HEALTH CHECK:", res.data);
      })
      .catch((err) => {
        console.log("❌ HEALTH ERROR:", err);
      });
  }, []);

  if (!userIsClient) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="pageTitle">Dashboard</div>
          <div className="pageSubtitle">Manage your invoices and tax filings</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div className="card statCard">
          <div className="statTitle">Total Invoices</div>
          <div className="statValue">1,847</div>
          <div className="statSub">
            <span className="statChange good">+12%</span>
            <span className="statText">vs last month</span>
          </div>
        </div>

        <div className="card statCard">
          <div className="statTitle">Valid Invoices</div>
          <div className="statValue">1,751</div>
          <div className="statSub">
            <span className="statChange good">+8%</span>
            <span className="statText">vs last month</span>
          </div>
        </div>

        <div className="card statCard">
          <div className="statTitle">Invalid Invoices</div>
          <div className="statValue">96</div>
          <div className="statSub">
            <span className="statChange bad">+4%</span>
            <span className="statText">vs last month</span>
          </div>
        </div>

        <div className="card statCard">
          <div className="statTitle">Total Tax</div>
          <div className="statValue">₨1.25M</div>
          <div className="statSub">
            <span className="statChange good">+15%</span>
            <span className="statText">vs last month</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        <div className="card">
          <div className="cardHeader">
            <div className="cardTitle">Invoice Management</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="primaryBtn"
                onClick={() => window.location.href = '/upload'}
              >
                Upload Excel
              </button>
              <button 
                type="button" 
                className="primaryBtn"
                onClick={() => window.location.href = '/invoices'}
              >
                View Invoices
              </button>
              <button type="button" className="ghostBtn">
                Send to FBR
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardHeader">
          <div className="cardTitle">Recent Invoices</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { id: 'INV-001', company: 'ABC Trading', amount: '₨45,000', status: 'Valid', date: '2024-01-15' },
            { id: 'INV-002', company: 'XYZ Industries', amount: '₨78,000', status: 'Valid', date: '2024-01-14' },
            { id: 'INV-003', company: 'Tech Solutions', amount: '₨23,000', status: 'Invalid', date: '2024-01-13' },
            { id: 'INV-004', company: 'Global Exports', amount: '₨92,000', status: 'Valid', date: '2024-01-12' },
            { id: 'INV-005', company: 'Local Suppliers', amount: '₨34,000', status: 'Valid', date: '2024-01-11' }
          ].map((invoice) => (
            <div key={invoice.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <div>
                <div style={{ fontWeight: '500', fontSize: '14px' }}>{invoice.id}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{invoice.company}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '500', fontSize: '14px' }}>{invoice.amount}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{invoice.date}</div>
              </div>
              <div className={invoice.status === 'Valid' ? 'pill pillOk' : 'pill pillBad'}>
                {invoice.status}
              </div>
              <button 
                type="button" 
                className="ghostBtn"
                style={{ marginLeft: '8px', padding: '4px 8px', fontSize: '12px' }}
              >
                Send
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
