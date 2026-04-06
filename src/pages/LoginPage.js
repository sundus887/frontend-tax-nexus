import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [loginType, setLoginType] = useState("company");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (loginType === "admin") {
      setEmail('admin@company.com');
      setPassword('admin');
    } else {
      setEmail('client@company.com');
      setPassword('client');
    }
    setError('');
  }, [loginType]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      console.log('🔍 Attempting backend login...');
      console.log('📧 Email:', email);
      console.log('🔐 Login Type:', loginType);
      console.log('🌐 Backend URL:', 'https://taxnexus-backend.onrender.com/api');
      
      const response = await fetch('https://taxnexus-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('✅ Login Response:', data);

      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('userName', data.user.name || (data.user.role === 'admin' ? 'Admin User' : 'Client User'));
      localStorage.setItem('userEmail', data.user.email || email);
      
      // Redirect based on role
      if (data.user.role === 'admin') {
        console.log('✅ Admin login successful');
        navigate('/admin/dashboard');
      } else if (data.user.role === 'client') {
        console.log('✅ Client login successful');
        navigate('/dashboard');
      } else {
        setError('Invalid user role');
        setLoading(false);
        return;
      }
    } catch (backendError) {
      console.log('❌ Backend login failed!');
      console.log('🔍 Backend Error Details:', backendError);
      console.log('📊 Error Status:', backendError.response?.status);
      console.log('📝 Error Message:', backendError.response?.data?.message || backendError.message);
      console.log('🌐 Request URL:', 'https://taxnexus-backend.onrender.com/api/auth/login');
      
      if (loginType === "admin") {
        if (email === 'admin@company.com' && password === 'admin') {
          localStorage.setItem("token", 'mock-token-123');
          localStorage.setItem("role", 'admin');
          localStorage.setItem("userName", 'Admin User');
          localStorage.setItem("userEmail", email);
          console.log('✅ Mock admin login successful');
          navigate('/admin/dashboard');
        } else {
          setError('Admin login failed. Only admin credentials are allowed in admin mode.');
          setLoading(false);
          return;
        }
      } else {
        if (email === 'client@company.com' && password === 'client') {
          localStorage.setItem("token", 'mock-token-456');
          localStorage.setItem("role", 'client');
          localStorage.setItem("userName", 'Client User');
          localStorage.setItem("userEmail", email);
          console.log('✅ Mock client login successful');
          navigate('/dashboard');
        } else {
          setError('Company login failed. Only company credentials are allowed in company mode.');
          setLoading(false);
          return;
        }
      }
    } finally {
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
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        backgroundColor: 'white'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            color: '#1f2937'
          }}>
            TAX NEXUS
          </h1>
          <p style={{ 
            margin: '0.5rem 0 0', 
            color: '#64748b',
            fontSize: '0.875rem'
          }}>
            E-Invoicing Portal
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          backgroundColor: '#f1f5f9', 
          borderRadius: '6px', 
          padding: '4px',
          marginBottom: '1.5rem'
        }}>
          <button
            type="button"
            onClick={() => setLoginType("admin")}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: loginType === "admin" ? '#3b82f6' : 'transparent',
              color: loginType === "admin" ? 'white' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => setLoginType("company")}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: loginType === "company" ? '#3b82f6' : 'transparent',
              color: loginType === "company" ? 'white' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Company
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '4px',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          backgroundColor: '#f8fafc', 
          borderRadius: '4px',
          fontSize: '0.75rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
            Demo Credentials:
          </div>
          {loginType === "admin" ? (
            <div>
              <div><strong style={{ color: '#dc2626' }}>ADMIN ONLY:</strong></div>
              <div>Email: admin@company.com</div>
              <div>Password: admin</div>
            </div>
          ) : (
            <div>
              <div><strong style={{ color: '#059669' }}>CLIENT ONLY:</strong></div>
              <div>Email: client@company.com</div>
              <div>Password: client</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
