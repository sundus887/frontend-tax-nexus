import React, { useState, useEffect } from 'react';
import { isAdmin } from '../utils/auth';

export default function CreateCompanyPage() {
  const [companies, setCompanies] = useState([]);
  const [companyData, setCompanyData] = useState({
    name: '',
    ntn: '',
    address: '',
    province: '',
    api_token: '',
    environment: 'sandbox'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!companyData.name || !companyData.ntn || !companyData.address || !companyData.province) {
      setMessage('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      // Mock API call - in real app, this would be POST /api/admin/company
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the company data (in real app, this would be sent to backend)
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      companies.push({
        ...companyData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('companies', JSON.stringify(companies));

      setMessage('Company created successfully!');
      setCompanyData({
        name: '',
        ntn: '',
        address: '',
        province: '',
        api_token: '',
        environment: 'sandbox'
      });
    } catch (error) {
      setMessage('Error creating company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCompanyData({
      ...companyData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="pageTitle">Create Company</div>
          <div className="pageSubtitle">Register a new company in the system</div>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="form">
          <div className="formRow">
            <label className="field">
              <div className="label">Company Name *</div>
              <input
                className="input"
                name="name"
                value={companyData.name}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />
            </label>
          </div>

          <div className="formRow">
            <label className="field">
              <div className="label">NTN Number *</div>
              <input
                className="input"
                name="ntn"
                value={companyData.ntn}
                onChange={handleChange}
                placeholder="Enter NTN number"
                required
              />
            </label>
          </div>

          <div className="formRow">
            <label className="field">
              <div className="label">Address *</div>
              <textarea
                className="input"
                name="address"
                value={companyData.address}
                onChange={handleChange}
                placeholder="Enter business address"
                rows="3"
                required
              />
            </label>
          </div>

          <div className="formRow">
            <label className="field">
              <div className="label">Province *</div>
              <input
                className="input"
                name="province"
                value={companyData.province}
                onChange={handleChange}
                placeholder="Enter province"
                required
              />
            </label>
          </div>

          <div className="formRow">
            <label className="field">
              <div className="label">API Token</div>
              <input
                className="input"
                name="api_token"
                value={companyData.api_token}
                onChange={handleChange}
                placeholder="Enter API token (optional)"
              />
            </label>
          </div>

          <div className="formRow">
            <label className="field">
              <div className="label">Environment</div>
              <select
                className="input"
                name="environment"
                value={companyData.environment}
                onChange={handleChange}
              >
                <option value="sandbox">Sandbox</option>
                <option value="production">Production</option>
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
              {loading ? 'Creating Company...' : 'Create Company'}
            </button>
            <button type="button" className="ghostBtn" onClick={() => window.history.back()}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
