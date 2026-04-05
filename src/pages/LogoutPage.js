import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../utils/auth';

export default function LogoutPage() {
  React.useEffect(() => {
    // Use the logout function from auth utils
    logout();
  }, []);

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="pageTitle">Logged out</div>
          <div className="pageSubtitle">You have been logged out successfully.</div>
        </div>
      </div>

      <div className="card">
        <div className="emptyState">
          <div className="emptyTitle">Session ended</div>
          <div className="muted">Click below to go back to Dashboard.</div>
          <Link to="/dashboard" className="primaryBtn">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
