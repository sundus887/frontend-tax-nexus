import React, { useState, useEffect } from 'react';
import { isAdmin } from '../utils/auth';

export default function CreateUserPage() {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyId: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const userIsAdmin = isAdmin();

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  if (!userIsAdmin) {
    return <div>Access Denied</div>;
  }

  const fetchCompanies = async () => {
    try {
      // Mock companies data - in real app, this would be from API
      const mockCompanies = [
        { id: 1, name: 'ABC Trading Company', ntn: '1234567-8' },
        { id: 2, name: 'XYZ Industries', ntn: '8765432-1' },
        { id: 3, name: 'Tech Solutions Pvt Ltd', ntn: '4567890-2' }
      ];
      setCompanies(mockCompanies);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!formData.email || !formData.password || !formData.companyId) {
      setMessage('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      // Mock API call - in real app, this would be POST /api/admin/create-user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the user data (in real app, this would be sent to backend)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push({
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        role: 'client'
      });
      localStorage.setItem('users', JSON.stringify(users));

      setMessage('User created successfully!');
      setFormData({
        email: '',
        password: '',
        companyId: ''
      });
    } catch (error) {
      setMessage('Error creating user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="pageTitle">Create User</div>
          <div className="pageSubtitle">Create a new user account for a company</div>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="form">
          <div className="formRow">
            <label className="field">
              <div className="label">Email Address *</div>
              <input
                className="input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter user email"
                required
              />
            </label>
          </div>

          <div className="formRow">
            <label className="field">
              <div className="label">Password *</div>
              <input
                className="input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter user password"
                required
              />
            </label>
          </div>

          <div className="formRow">
            <label className="field">
              <div className="label">Company *</div>
              <select
                className="input"
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                required
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name} (NTN: {company.ntn})
                  </option>
                ))}
              </select>
            </label>
          </div>

          {message && (
            <div className="formRow">
              <div className="field">
                <div className={message.includes('success') ? 'success' : 'error'}>
                  {message}
                </div>
              </div>
            </div>
          )}

          <div className="formRow">
            <button type="submit" className="primaryBtn" disabled={loading}>
              {loading ? 'Creating User...' : 'Create User'}
            </button>
            <button type="button" className="ghostBtn" onClick={() => window.history.back()}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardHeader">
          <div className="cardTitle">Existing Companies</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {companies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
              No companies found. Please create a company first.
            </div>
          ) : (
            companies.map((company) => (
              <div key={company.id} style={{
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontWeight: '500', fontSize: '14px' }}>{company.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>NTN: {company.ntn}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
