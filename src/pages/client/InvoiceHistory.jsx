import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';

export default function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await clientAPI.getInvoices();
      
      // Debug: log the response structure
      console.log('API Response:', response);
      setDebugInfo(JSON.stringify(response.data, null, 2));
      
      // Handle different response formats
      let invoicesData = [];
      if (response.data?.invoices) {
        invoicesData = response.data.invoices;
      } else if (Array.isArray(response.data)) {
        invoicesData = response.data;
      } else if (response.data?.data?.invoices) {
        invoicesData = response.data.data.invoices;
      } else if (response.data?.data) {
        invoicesData = response.data.data;
      }
      
      setInvoices(invoicesData);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
      setError('Failed to load invoices: ' + (err.message || 'Unknown error'));
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

  // Helper function to get field value with multiple possible field names
  const getFieldValue = (invoice, possibleFields) => {
    for (const field of possibleFields) {
      if (invoice[field] !== undefined && invoice[field] !== null && invoice[field] !== '') {
        return invoice[field];
      }
    }
    return '-';
  };

  // Helper to format date
  const formatDate = (dateValue) => {
    if (!dateValue) return '-';
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return dateValue;
      return date.toLocaleDateString('en-GB');
    } catch {
      return dateValue;
    }
  };

  // Helper to format amount
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null || amount === '') return '-';
    const num = Number(amount);
    if (isNaN(num)) return amount;
    return 'PKR ' + num.toLocaleString();
  };

  // Helper to get status
  const getStatus = (invoice) => {
    const possibleStatusFields = ['status', 'fbr_status', 'fbrStatus', 'Status', 'state', 'State'];
    const status = getFieldValue(invoice, possibleStatusFields);
    return status !== '-' ? status : 'pending';
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
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>All Invoices ({invoices.length})</h2>
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
              <div style={{ padding: '40px', textAlign: 'center', color: '#dc2626' }}>
                <p>{error}</p>
                {debugInfo && (
                  <details style={{ marginTop: '16px', textAlign: 'left' }}>
                    <summary style={{ cursor: 'pointer', color: '#6b7280' }}>Debug Info</summary>
                    <pre style={{ fontSize: '12px', background: '#f3f4f6', padding: '12px', borderRadius: '4px', overflow: 'auto', maxHeight: '200px' }}>
                      {debugInfo}
                    </pre>
                  </details>
                )}
              </div>
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
                    {invoices.map((invoice, index) => {
                      // Try multiple possible field names
                      const invoiceNumber = getFieldValue(invoice, [
                        'invoice_number', 'invoiceNumber', 'invoice_no', 'invoiceNo', 
                        'Invoice_Number', 'InvoiceNumber', 'Invoice_No', 'invoice', 
                        'Invoice', 'id', 'ID', 'Id'
                      ]);
                      
                      const date = getFieldValue(invoice, [
                        'created_at', 'createdAt', 'date', 'Date', 'invoice_date', 
                        'invoiceDate', 'Invoice_Date', 'timestamp', 'Timestamp'
                      ]);
                      
                      const customer = getFieldValue(invoice, [
                        'customer_name', 'customerName', 'customer', 'Customer', 
                        'buyer_name', 'buyerName', 'buyer', 'Buyer', 'party', 
                        'Party', 'client', 'Client', 'name', 'Name'
                      ]);
                      
                      const amount = getFieldValue(invoice, [
                        'amount', 'Amount', 'total', 'Total', 'total_amount', 
                        'totalAmount', 'value', 'Value', 'price', 'Price'
                      ]);
                      
                      const status = getStatus(invoice);
                      const invoiceId = invoice.id || invoice.ID || invoice._id || invoice.invoice_id || index;
                      
                      return (
                        <tr key={invoiceId} style={{ borderTop: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                            {invoiceNumber}
                          </td>
                          <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7280' }}>
                            {formatDate(date)}
                          </td>
                          <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7280' }}>
                            {customer}
                          </td>
                          <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7280' }}>
                            {formatAmount(amount)}
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: status === 'sent' || status === 'validated' || status === 'submitted' ? '#d1fae5' : status === 'invalid' || status === 'error' ? '#fee2e2' : '#fef3c7',
                              color: status === 'sent' || status === 'validated' || status === 'submitted' ? '#065f46' : status === 'invalid' || status === 'error' ? '#991b1b' : '#92400e'
                            }}>
                              {status}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px', fontSize: '14px' }}>
                            {(status === 'pending' || status === 'validated') && (
                              <button
                                onClick={() => handleSendToFBR(invoiceId)}
                                style={{ 
                                  color: '#2563eb', 
                                  fontWeight: '500', 
                                  background: 'none', 
                                  border: 'none', 
                                  cursor: 'pointer',
                                  padding: '4px 8px',
                                  borderRadius: '4px'
                                }}
                              >
                                Send to FBR
                              </button>
                            )}
                            {(status === 'sent' || status === 'submitted') && (
                              <span style={{ color: '#16a34a', fontSize: '12px' }}>
                                ✓ Sent
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Debug Section - Shows raw data for troubleshooting */}
          {!loading && invoices.length > 0 && (
            <div style={{ marginTop: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px' }}>
              <details>
                <summary style={{ cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Show Raw Data (Debug)
                </summary>
                <pre style={{ marginTop: '12px', fontSize: '12px', background: '#f3f4f6', padding: '12px', borderRadius: '4px', overflow: 'auto', maxHeight: '300px' }}>
                  {JSON.stringify(invoices.slice(0, 3), null, 2)}
                </pre>
              </details>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
