import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';

export default function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getInvoices();
      setInvoices(response.data?.invoices || response.data || []);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
      setError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToFBR = async (invoiceId) => {
    try {
      await clientAPI.sendToFBR(invoiceId);
      alert('Invoice sent to FBR successfully!');
      fetchInvoices();
    } catch (err) {
      console.error('Failed to send to FBR:', err);
      alert('Failed to send invoice to FBR');
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
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Invoice History</h1>
        </header>

        <main style={{ padding: '24px' }}>
          {/* Navigation */}
          <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ color: '#2563eb', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/upload')}
              style={{ color: '#2563eb', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              + Upload New
            </button>
          </div>

          {/* Invoices Table */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>All Invoices</h2>
              <button
                onClick={fetchInvoices}
                style={{ color: '#2563eb', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Refresh
              </button>
            </div>
            
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading...</div>
            ) : error ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#dc2626' }}>{error}</div>
            ) : invoices.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                No invoices found. <button onClick={() => navigate('/upload')} style={{ color: '#2563eb', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Upload your first invoice</button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Invoice #</th>
                      <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Date</th>
                      <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Customer</th>
                      <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Amount</th>
                      <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                          {invoice.invoice_number}
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7280' }}>
                          {new Date(invoice.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7280' }}>
                          {invoice.customer_name}
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7280' }}>
                          PKR {invoice.amount?.toLocaleString()}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: invoice.status === 'sent' ? '#d1fae5' : invoice.status === 'invalid' ? '#fee2e2' : '#fef3c7',
                            color: invoice.status === 'sent' ? '#065f46' : invoice.status === 'invalid' ? '#991b1b' : '#92400e'
                          }}>
                            {invoice.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '14px' }}>
                          {invoice.status === 'pending' && (
                            <button
                              onClick={() => handleSendToFBR(invoice.id)}
                              style={{ color: '#2563eb', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              Send to FBR
                            </button>
                          )}
                          {invoice.status === 'sent' && (
                            <span style={{ color: '#16a34a', fontSize: '12px' }}>
                              FBR Ref: {invoice.fbr_reference}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
