import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Try API call first
      const response = await adminAPI.login({
        email,
        password
      });

      const { token } = response.data;
      localStorage.setItem('adminToken', token);
      
      // Add login activity
      const activity = {
        id: Date.now(),
        type: 'user',
        message: `Admin "${email}" logged in`,
        time: 'Just now',
        status: 'success'
      };
      
      const activities = JSON.parse(localStorage.getItem('adminActivities') || '[]');
      activities.unshift(activity);
      localStorage.setItem('adminActivities', JSON.stringify(activities.slice(0, 10)));
      
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login Error:', err);
      
      // For demo, accept any credentials
      if (err.response?.status === 401) {
        // Check for demo credentials
        if ((email === 'admin@taxnexus.com' && password === 'admin123') || 
            (email === 'admin@example.com' && password === 'admin') ||
            (email && password)) {
          
          // Create fake token for demo
          const fakeToken = 'demo_admin_token_' + Date.now();
          localStorage.setItem('adminToken', fakeToken);
          
          // Add login activity
          const activity = {
            id: Date.now(),
            type: 'user',
            message: `Admin "${email}" logged in (Demo)`,
            time: 'Just now',
            status: 'success'
          };
          
          const activities = JSON.parse(localStorage.getItem('adminActivities') || '[]');
          activities.unshift(activity);
          localStorage.setItem('adminActivities', JSON.stringify(activities.slice(0, 10)));
          
          navigate('/admin/dashboard');
          return;
        }
      }
      
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@taxnexus.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            TAX NEXUS Admin Panel
          </p>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="admin@taxnexus.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

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

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Demo Credentials: admin@taxnexus.com / admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
