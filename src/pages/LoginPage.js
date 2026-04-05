import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, clientAPI } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Try admin login first
      try {
        const response = await adminAPI.login({ email, password });
        
        // Store token and role in frontend
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.user.role);
        localStorage.setItem("userName", response.data.user.name || 'Admin User');
        localStorage.setItem("userEmail", response.data.user.email || email);
        
        navigate('/dashboard');
        return;
      } catch (adminError) {
        // If admin login fails, try client login
        try {
          const response = await clientAPI.login({ email, password });
          
          // Store token and role in frontend
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("role", response.data.user.role);
          localStorage.setItem("userName", response.data.user.name || 'Client User');
          localStorage.setItem("userEmail", response.data.user.email || email);
          
          navigate('/dashboard');
          return;
        } catch (clientError) {
          // If both fail, use mock login for demo
          console.log('Backend login failed, using mock login for demo');
        }
      }

      // Mock login with role (for demo purposes)
      window.setTimeout(() => {
        if (email === 'admin@company.com' && password === 'admin') {
          localStorage.setItem("token", 'mock-token-123');
          localStorage.setItem("role", 'admin');
          localStorage.setItem("userName", 'Admin User');
          localStorage.setItem("userEmail", 'admin@company.com');
          navigate('/dashboard');
        } else if (email === 'client@company.com' && password === 'client') {
          localStorage.setItem("token", 'mock-token-456');
          localStorage.setItem("role", 'client');
          localStorage.setItem("userName", 'Client User');
          localStorage.setItem("userEmail", 'client@company.com');
          navigate('/dashboard');
        } else {
          setError('Invalid credentials. Use admin@company.com / admin or client@company.com / client');
        }
        setLoading(false);
      }, 800);

    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="loginPage">
      <div className="loginCard">
        <div className="loginHeader">
          <div className="loginLogo" aria-hidden="true">
            <img src="/custom-logo.png" alt="TAX NEXUS Logo" className="loginLogoImg" onError={(e) => {e.target.src='/logo192.png'}} />
          </div>
          <div className="loginBrand">
            <div className="loginTitle">TAX NEXUS</div>
            <div className="loginSub">FBR Digital Invoicing Made Simple</div>
          </div>
        </div>

        <form className="loginForm" onSubmit={onSubmit}>
          <div className="loginFormHeader">
            <div className="loginFormTitle">Login</div>
            <div className="loginFormSub">Enter your credentials to access your account</div>
          </div>

          <label className="loginField">
            <div className="loginLabel">Email</div>
            <input
              className="loginInput"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="company@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="loginField">
            <div className="loginLabel">Password</div>
            <input
              className="loginInput"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <div className="loginError">{error}</div> : null}

          <button type="submit" className={loading ? 'loginBtn disabled' : 'loginBtn'} disabled={loading}>
            {loading ? 'Logging in...' : 'Login to TAX NEXUS'}
          </button>

          <div className="loginSecurity">Secure FBR IRIS Portal Integration</div>
        </form>
      </div>

      <div className="loginFooter">© 2026 TAX NEXUS. All rights reserved.</div>
    </div>
  );
}
