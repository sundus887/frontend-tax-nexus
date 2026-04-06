import React, { useMemo } from 'react';
import { getUserInfo } from '../utils/auth';

export default function Topbar() {
  const userInfo = useMemo(() => {
    const user = getUserInfo();
    if (user) {
      return {
        role: user.role,
        userName: user.name,
        userEmail: user.email
      };
    }
    
    // Fallback for demo purposes
    try {
      const role = localStorage.getItem('role') || 'client';
      const userName = localStorage.getItem('userName') || 'User';
      const userEmail = role === 'admin' ? 'admin@company.com' : 'client@company.com';
      
      return {
        role,
        userName,
        userEmail
      };
    } catch {
      return {
        role: 'client',
        userName: 'User',
        userEmail: 'client@company.com'
      };
    }
  }, []);

  // Show environment switcher only for admin users
  const showEnvironmentSwitcher = userInfo.role === 'admin';

  return (
    <div className="topbar">
      <div className="topbarLeft">
        <div className="topbarTitle">FBR E-Invoicing Portal</div>
      </div>

      <div className="topbarRight">
        {showEnvironmentSwitcher && (
          <div className="envSwitch">
            <button
              type="button"
              className="envBtn envBtnActive"
            >
              Sandbox
            </button>
            <button
              type="button"
              className="envBtn"
            >
              Production
            </button>
          </div>
        )}

        <div className="topbarUser">
          <div className="topbarUserText">
            <div className="topbarUserName">{userInfo.userName}</div>
            <div className="topbarUserEmail">{userInfo.userEmail}</div>
          </div>
          <div className="avatar" aria-label="User avatar">
            {userInfo.role === 'admin' ? 'A' : 'C'}
          </div>
        </div>
      </div>
    </div>
  );
}
