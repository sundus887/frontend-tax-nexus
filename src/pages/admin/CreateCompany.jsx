import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';

export default function CreateCompany() {
  const [formData, setFormData] = useState({
    companyName: '',
    ntn: '',
    address: '',
    province: '',
    apiToken: '',
    environment: 'sandbox'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.companyName.trim()) {
      setError('Company name is required');
      return false;
    }
    if (!formData.ntn.trim()) {
      setError('NTN is required');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return false;
    }
    if (!formData.province) {
      setError('Province is required');
      return false;
    }
    if (!formData.apiToken.trim()) {
      setError('API Token is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // API call to create company
      const response = await adminAPI.createCompany(formData);
      
      setSuccess('Company created successfully!');
      
      // Add to recent activity
      const activity = {
        id: Date.now(),
        type: 'company',
        message: `Company "${formData.companyName}" created`,
        time: 'Just now',
        status: 'success'
      };
      
      const activities = JSON.parse(localStorage.getItem('adminActivities') || '[]');
      activities.unshift(activity);
      localStorage.setItem('adminActivities', JSON.stringify(activities.slice(0, 10)));
      
      // Reset form
      setFormData({
        companyName: '',
        ntn: '',
        address: '',
        province: '',
        apiToken: '',
        environment: 'sandbox'
      });

      // Redirect after delay
      setTimeout(() => {
        navigate('/admin/create-user');
      }, 1500);

    } catch (err) {
      console.error('API Error:', err);
      
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create company. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateApiToken = () => {
    const token = 'TK_' + Math.random().toString(36).substr(2, 9).toUpperCase() + '_' + Date.now();
    setFormData(prev => ({ ...prev, apiToken: token }));
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Company</h1>
        <p className="mt-2 text-gray-600">Add a new company to the TAX NEXUS system</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4 fade-in">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4 fade-in">
                <div className="flex">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-green-800">{success}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label htmlFor="ntn" className="block text-sm font-medium text-gray-700">
                  NTN (National Tax Number) *
                </label>
                <input
                  type="text"
                  name="ntn"
                  id="ntn"
                  required
                  value={formData.ntn}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="1234567-8"
                />
              </div>

              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                  Province *
                </label>
                <select
                  name="province"
                  id="province"
                  required
                  value={formData.province}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Province</option>
                  <option value="punjab">Punjab</option>
                  <option value="sindh">Sindh</option>
                  <option value="balochistan">Balochistan</option>
                  <option value="kpk">Khyber Pakhtunkhwa</option>
                  <option value="islamabad">Islamabad Capital Territory</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address *
                </label>
                <textarea
                  name="address"
                  id="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter complete address"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="apiToken" className="block text-sm font-medium text-gray-700">
                  FBR API Token *
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="apiToken"
                    id="apiToken"
                    required
                    value={formData.apiToken}
                    onChange={handleChange}
                    className="flex-1 block w-full border-gray-300 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter FBR API token"
                  />
                  <button
                    type="button"
                    onClick={generateApiToken}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="environment" className="block text-sm font-medium text-gray-700">
                  Environment *
                </label>
                <select
                  name="environment"
                  id="environment"
                  required
                  value={formData.environment}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="sandbox">Sandbox</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Company'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
