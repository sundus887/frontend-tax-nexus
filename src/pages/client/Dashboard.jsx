import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';

export default function ClientDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({ total: 0, sent: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await clientAPI.getInvoices();
      const invoicesData = response.data?.invoices || response.data || [];
      setInvoices(invoicesData.slice(0, 5));
      
      setStats({
        total: invoicesData.length,
        sent: invoicesData.filter(inv => {
          const status = inv.status || inv.fbr_status || inv.fbrStatus || inv['Status'] || 'pending';
          return status === 'sent' || status === 'validated';
        }).length,
        pending: invoicesData.filter(inv => {
          const status = inv.status || inv.fbr_status || inv.fbrStatus || inv['Status'] || 'pending';
          return status === 'pending';
        }).length
      });
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar userType="client" />

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
        {/* Header */}
        <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px 24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Dashboard</h1>
        </header>

        <main style={{ padding: '24px' }}>
          {/* Quick Actions */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Quick Actions</h2>
            <button
              onClick={() => navigate('/upload')}
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
              + Upload Excel
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px' }}>Total Invoices</h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{stats.total}</p>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px' }}>Sent to FBR</h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>{stats.sent}</p>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px' }}>Pending</h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ca8a04' }}>{stats.pending}</p>
            </div>
          </div>

          {/* Recent Invoices */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Recent Invoices</h2>
              <button
                onClick={() => navigate('/invoices')}
                style={{ color: '#2563eb', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                View All
              </button>
            </div>
            
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading...</div>
            ) : invoices.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                No invoices found. Upload your first invoice!
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Invoice #</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Customer</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Amount</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, index) => {
                    // Handle different field name formats from backend
                    const invoiceNumber = invoice.invoice_number || invoice.invoiceNo || invoice.invoice_no || invoice.invoiceNumber || invoice['Invoice_No'] || `INV-${index + 1}`;
                    const customerName = invoice.customer_name || invoice.customerName || invoice.customer || invoice['Customer'] || invoice.buyer_name || invoice.buyerName || '-';
                    const amount = invoice.amount || invoice.total || invoice.total_amount || invoice.totalAmount || invoice['Amount'] || 0;
                    const status = invoice.status || invoice.fbr_status || invoice.fbrStatus || invoice['Status'] || 'pending';
                    
                    return (
                      <tr key={invoice.id || index} style={{ borderTop: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                          {invoiceNumber}
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7280' }}>
                          {customerName}
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7280' }}>
                          PKR {Number(amount).toLocaleString()}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: status === 'sent' || status === 'validated' ? '#d1fae5' : status === 'invalid' ? '#fee2e2' : '#fef3c7',
                            color: status === 'sent' || status === 'validated' ? '#065f46' : status === 'invalid' ? '#991b1b' : '#92400e'
                          }}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
