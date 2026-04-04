import React, { useMemo, useState } from 'react';

export default function Topbar() {
  const [environment, setEnvironment] = useState('Sandbox');

  const userEmail = useMemo(() => 'admin@company.com', []);

  return (
    <div className="topbar">
      <div className="topbarLeft">
        <div className="topbarTitle">FBR E-Invoicing Portal</div>
      </div>

      <div className="topbarRight">
        <div className="envSwitch">
          <button
            type="button"
            className={environment === 'Sandbox' ? 'envBtn envBtnActive' : 'envBtn'}
            onClick={() => setEnvironment('Sandbox')}
          >
            Sandbox
          </button>
          <button
            type="button"
            className={environment === 'Production' ? 'envBtn envBtnActive' : 'envBtn'}
            onClick={() => setEnvironment('Production')}
          >
            Production
          </button>
        </div>

        <div className="topbarUser">
          <div className="topbarUserText">
            <div className="topbarUserName">Admin User</div>
            <div className="topbarUserEmail">{userEmail}</div>
          </div>
          <div className="avatar" aria-label="User avatar">
            A
          </div>
        </div>
      </div>
    </div>
  );
}
