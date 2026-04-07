import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../../services/api';

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
      const invoicesData = response.data.invoices || response.data || [];
      setInvoices(invoicesData.slice(0, 5)); // Show last 5
      
      // Calculate stats
      setStats({
        total: invoicesData.length,
        sent: invoicesData.filter(inv => inv.status === 'sent' || inv.fbr_status === 'sent').length,
        pending: invoicesData.filter(inv => inv.status === 'pending' || inv.fbr_status === 'pending').length
      });
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="/logo.jpg"
              alt="Tax Nexus Logo"
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TAX NEXUS</h1>
              <p className="text-sm text-gray-500">E-Invoicing</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <button
            onClick={() => navigate('/upload')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            + Upload Excel
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Invoices</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Sent to FBR</h3>
            <p className="text-3xl font-bold text-green-600">{stats.sent}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
            <button
              onClick={() => navigate('/invoices')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View All
            </button>
          </div>
          
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : invoices.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No invoices found. Upload your first invoice!
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoice_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      PKR {invoice.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${
                        invoice.status === 'sent' 
                          ? 'bg-green-100 text-green-800' 
                          : invoice.status === 'invalid'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status}
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
