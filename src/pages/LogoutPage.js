import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

export default function LogoutPage() {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Use the logout function from auth utils
    logout();
  }, []);

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="pageTitle">Logging out...</div>
          <div className="pageSubtitle">Please wait while we log you out.</div>
        </div>
      </div>

      <div className="card">
        <div className="emptyState">
          <div className="emptyTitle">Signing out</div>
          <div className="muted">You will be redirected to the login page shortly.</div>
          <div style={{ marginTop: '16px' }}>
            <button 
              type="button" 
              className="primaryBtn"
              onClick={() => navigate('/login')}
            >
              Go to Login Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
