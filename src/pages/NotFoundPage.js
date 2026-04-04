import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="pageTitle">Page not found</div>
          <div className="pageSubtitle">The requested page does not exist.</div>
        </div>
      </div>

      <div className="card">
        <div className="emptyState">
          <div className="emptyTitle">404</div>
          <div className="muted">Use the sidebar to navigate.</div>
          <Link to="/dashboard" className="primaryBtn">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
