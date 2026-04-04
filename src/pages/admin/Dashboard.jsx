import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalUsers: 0,
    totalInvoices: 0,
    apiCallsToday: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const [testingConnection, setTestingConnection] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const testConnection = async () => {
    const startTime = Date.now();
    setTestingConnection(true);
    setConnectionStatus('testing');
    
    try {
      // Test API connectivity
      const response = await adminAPI.testConnection();
      
      // Add connection test activity
      const activity = {
        id: Date.now(),
        type: 'api',
        message: 'API connection test successful',
        time: 'Just now',
        status: 'success'
      };
      
      const activities = JSON.parse(localStorage.getItem('adminActivities') || '[]');
      activities.unshift(activity);
      localStorage.setItem('adminActivities', JSON.stringify(activities.slice(0, 10)));
      
      setConnectionStatus('connected');
      setRecentActivity(activities.slice(0, 10));
      
      // Show success message
      setTimeout(() => {
        alert('✅ API Connection Successful!\n\nServer is responding correctly.\n\nResponse Time: ' + (Date.now() - startTime) + 'ms');
      }, 500);
      
    } catch (error) {
      console.error('Connection test failed:', error);
      
      // Add connection test activity
      const activity = {
        id: Date.now(),
        type: 'api',
        message: 'API connection test failed',
        time: 'Just now',
        status: 'error'
      };
      
      const activities = JSON.parse(localStorage.getItem('adminActivities') || '[]');
      activities.unshift(activity);
      localStorage.setItem('adminActivities', JSON.stringify(activities.slice(0, 10)));
      
      setConnectionStatus('failed');
      setRecentActivity(activities.slice(0, 10));
      
      // Show error message
      setTimeout(() => {
        alert('❌ API Connection Failed!\n\nUnable to connect to the server.\n\nError: ' + (error.message || 'Unknown error') + '\n\nPlease check:\n• Backend server is running\n• API endpoint is correct\n• Network connection is stable\n• CORS is configured properly');
      }, 500);
    } finally {
      setTestingConnection(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Try API calls first
      const [statsResponse, activityResponse] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getRecentActivity()
      ]);
      
      setStats(statsResponse.data || {
        totalCompanies: 12,
        totalUsers: 48,
        totalInvoices: 1247,
        apiCallsToday: 3842
      });
      
      // Get activities from localStorage or API
      const storedActivities = JSON.parse(localStorage.getItem('adminActivities') || '[]');
      setRecentActivity(activityResponse.data || storedActivities.length > 0 ? storedActivities : [
        { id: 1, type: 'company', message: 'Company "ABC Corp" created', time: '2 hours ago', status: 'success' },
        { id: 2, type: 'user', message: 'User "john@example.com" added', time: '4 hours ago', status: 'info' },
        { id: 3, type: 'api', message: 'API token regenerated for XYZ Ltd', time: '6 hours ago', status: 'warning' }
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      
      // Get data from localStorage for demo
      const storedActivities = JSON.parse(localStorage.getItem('adminActivities') || '[]');
      
      // Set mock data for demo
      setStats({
        totalCompanies: 12,
        totalUsers: 48,
        totalInvoices: 1247,
        apiCallsToday: 3842
      });
      setRecentActivity(storedActivities.length > 0 ? storedActivities : [
        { id: 1, type: 'company', message: 'Company "ABC Corp" created', time: '2 hours ago', status: 'success' },
        { id: 2, type: 'user', message: 'User "john@example.com" added', time: '4 hours ago', status: 'info' },
        { id: 3, type: 'api', message: 'API token regenerated for XYZ Ltd', time: '6 hours ago', status: 'warning' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'company':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'user':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'api':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusDot = (status) => {
    const colors = {
      success: 'bg-green-400',
      info: 'bg-blue-400',
      warning: 'bg-yellow-400',
      error: 'bg-red-400'
    };
    return `w-2 h-2 ${colors[status] || 'bg-gray-400'} rounded-full`;
  };

  const getConnectionStatusColor = () => {
    switch(connectionStatus) {
      case 'connected': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'testing': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConnectionStatusText = () => {
    switch(connectionStatus) {
      case 'connected': return 'Connected';
      case 'failed': return 'Failed';
      case 'testing': return 'Testing...';
      default: return 'Unknown';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage companies and users for TAX NEXUS</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button 
            onClick={fetchDashboardData}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
          <button 
            onClick={testConnection}
            disabled={testingConnection}
            className={`inline-flex items-center px-3 py-1 border shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              testingConnection 
                ? 'bg-yellow-50 border-yellow-300 text-yellow-700 cursor-not-allowed' 
                : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
            }`}
          >
            {testingConnection ? (
              <>
                <div className="loading-spinner mr-1"></div>
                Testing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Test Connection
              </>
            )}
          </button>
          <div className={`inline-flex items-center px-3 py-1 border rounded-md text-sm font-medium ${getConnectionStatusColor()}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              connectionStatus === 'connected' ? 'bg-green-400' :
              connectionStatus === 'failed' ? 'bg-red-400' :
              connectionStatus === 'testing' ? 'bg-yellow-400' :
              'bg-gray-400'
            }`}></div>
            {getConnectionStatusText()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg hover-lift">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Companies</dt>
                  <dd className="text-lg font-semibold text-gray-900">{loading ? '...' : stats.totalCompanies}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg hover-lift">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-semibold text-gray-900">{loading ? '...' : stats.totalUsers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg hover-lift">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Invoices</dt>
                  <dd className="text-lg font-semibold text-gray-900">{loading ? '...' : stats.totalInvoices.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg hover-lift">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">API Calls Today</dt>
                  <dd className="text-lg font-semibold text-gray-900">{loading ? '...' : stats.apiCallsToday.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/admin/create-company"
                className="block w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors hover-lift"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Create New Company</span>
                </div>
              </Link>
              <Link
                to="/admin/create-user"
                className="block w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors hover-lift"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Create New User</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
              <div className="flex gap-2">
                <button 
                  onClick={testConnection}
                  disabled={testingConnection}
                  className={`inline-flex items-center px-2 py-1 border text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    testingConnection 
                      ? 'bg-yellow-50 border-yellow-300 text-yellow-700 cursor-not-allowed' 
                      : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  {testingConnection ? (
                    <>
                      <div className="loading-spinner mr-1" style={{width: '12px', height: '12px'}}></div>
                      Testing...
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Test API
                    </>
                  )}
                </button>
                <button 
                  onClick={fetchDashboardData}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Refresh
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="loading-spinner"></div>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={getStatusDot(activity.status)}></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
