import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, clientAPI } from '../services/api';

// Test backend connection
const testBackendConnection = async () => {
  try {
    console.log('🔍 Testing backend connection...');
    const response = await fetch('https://taxnexus-backend.onrender.com/api/health');
    const data = await response.json();
    console.log('✅ Backend is running:', data);
    return true;
  } catch (error) {
    console.log('❌ Backend connection failed:', error);
    return false;
  }
};

export default function LoginPage() {
  const [loginType, setLoginType] = useState("company");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Auto-fill credentials when login type changes
  React.useEffect(() => {
    if (loginType === "admin") {
      setEmail('admin@company.com');
      setPassword('admin');
    } else {
      setEmail('client@company.com');
      setPassword('client');
    }
    setError(''); // Clear error when switching types
  }, [loginType]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    setError('');

    // Test backend connection first
    const isBackendReachable = await testBackendConnection();
    
    try {
      // Try backend login first
      let response;
      let role;

      try {
        console.log('🔍 Attempting backend login...');
        console.log('📧 Email:', email);
        console.log('🔐 Login Type:', loginType);
        console.log('🌐 Backend URL:', 'https://taxnexus-backend.onrender.com/api');
        console.log('🔌 Backend Reachable:', isBackendReachable);
        
        if (loginType === "admin") {
          console.log('👤 Trying admin login...');
          response = await adminAPI.login({ email, password });
          console.log('✅ Admin login response:', response);
          role = response.data.user.role;
        } else {
          console.log('👤 Trying client login...');
          response = await clientAPI.login({ email, password });
          console.log('✅ Client login response:', response);
          role = response.data.user.role;
        }
      } catch (backendError) {
        // Fallback to mock login with STRICT role-specific validation
        console.log('❌ Backend login failed!');
        console.log('🔍 Backend Error Details:', backendError);
        console.log('📊 Error Status:', backendError.response?.status);
        console.log('📝 Error Message:', backendError.response?.data?.message || backendError.message);
        console.log('🌐 Request URL:', backendError.config?.baseURL + backendError.config?.url);
        
        if (backendError.response?.status === 404) {
          console.log('🚫 Backend endpoint not found - using mock login');
        } else if (backendError.response?.status === 500) {
          console.log('💥 Backend server error - using mock login');
        } else if (backendError.code === 'NETWORK_ERROR') {
          console.log('🌐 Network error - backend not reachable');
        } else {
          console.log('❓ Unknown error - using mock login');
        }
        
        if (loginType === "admin") {
          // STRICT: Only allow admin credentials when admin is selected
          if (email === 'admin@company.com' && password === 'admin') {
            role = 'admin';
          } else {
            setError('Admin login failed. Only admin credentials are allowed in admin mode.');
            setLoading(false);
            return;
          }
        } else {
          // STRICT: Only allow client credentials when company is selected
          if (email === 'client@company.com' && password === 'client') {
            role = 'client';
          } else {
            setError('Company login failed. Only company credentials are allowed in company mode.');
            setLoading(false);
            return;
          }
        }
      }

      // 🔐 STRICT VALIDATION - No cross-role login allowed
      if (loginType === "admin" && role !== "admin") {
        setError('Access denied. This is an admin-only login portal.');
        setLoading(false);
        return;
      }

      if (loginType === "company" && role !== "client") {
        setError('Access denied. This is a company-only login portal.');
        setLoading(false);
        return;
      }

      // STORE DATA
      if (response) {
        // Backend login data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", role);
        localStorage.setItem("userName", response.data.user.name || (role === 'admin' ? 'Admin User' : 'Client User'));
        localStorage.setItem("userEmail", response.data.user.email || email);
      } else {
        // Mock login data
        localStorage.setItem("token", role === 'admin' ? 'mock-token-123' : 'mock-token-456');
        localStorage.setItem("role", role);
        localStorage.setItem("userName", role === 'admin' ? 'Admin User' : 'Client User');
        localStorage.setItem("userEmail", email);
      }

      // 🔁 REDIRECT TO CORRECT DASHBOARD
      if (role === "admin") {
        navigate("/admin/dashboard"); // Admin dashboard with admin features
      } else {
        navigate("/dashboard"); // Client dashboard with client features
      }

    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      <div className="card" style={{ 
        width: '100%', 
        maxWidth: '400px',
        padding: '32px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            TAX NEXUS LOGIN
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Sign in to your account
          </p>
        </div>

        {/* TOGGLE */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginBottom: '24px',
          padding: '4px',
          backgroundColor: '#f1f5f9',
          borderRadius: '8px'
        }}>
          <label style={{ 
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: loginType === "admin" ? '#3b82f6' : 'transparent',
            color: loginType === "admin" ? 'white' : '#64748b',
            transition: 'all 0.2s'
          }}>
            <input
              type="radio"
              checked={loginType === "admin"}
              onChange={() => setLoginType("admin")}
              style={{ display: 'none' }}
            />
            Admin
          </label>

          <label style={{ 
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: loginType === "company" ? '#3b82f6' : 'transparent',
            color: loginType === "company" ? 'white' : '#64748b',
            transition: 'all 0.2s'
          }}>
            <input
              type="radio"
              checked={loginType === "company"}
              onChange={() => setLoginType("company")}
              style={{ display: 'none' }}
            />
            Company
          </label>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Email
            </label>
            <input
              type="email"
              placeholder={loginType === "admin" ? "admin@company.com" : "client@company.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Password
            </label>
            <input
              type="password"
              placeholder={loginType === "admin" ? "admin" : "client"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              color: '#dc2626',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </div>

        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
            Demo Credentials:
          </h3>
          <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5' }}>
            {loginType === "admin" ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    backgroundColor: '#ef4444', 
                    color: 'white', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    ADMIN ONLY
                  </span>
                  <div>
                    <div><strong>admin@company.com</strong> / <strong>admin</strong></div>
                    <div style={{ marginTop: '2px', color: '#ef4444' }}>Only works in Admin mode</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    CLIENT ONLY
                  </span>
                  <div>
                    <div><strong>client@company.com</strong> / <strong>client</strong></div>
                    <div style={{ marginTop: '2px', color: '#3b82f6' }}>Only works in Company mode</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
