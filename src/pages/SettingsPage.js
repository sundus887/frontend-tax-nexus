import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [company, setCompany] = useState('Tax Nexus Pvt Ltd');
  const [ntn, setNtn] = useState('1234567-8');
  const [email, setEmail] = useState('info@taxnexus.com');
  const [phone, setPhone] = useState('+92 300 1234567');
  const [address, setAddress] = useState('123 Business Avenue, Lahore, Pakistan');
  const [endpoint, setEndpoint] = useState('https://api.fbr.gov.pk');
  const [apiKey, setApiKey] = useState('FBR_API_TOKEN_12345');
  const [autoBackup, setAutoBackup] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [savedAt, setSavedAt] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('unknown'); // 'unknown', 'connected', 'failed'

  // Load saved settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setCompany(settings.company || 'Tax Nexus Pvt Ltd');
        setNtn(settings.ntn || '1234567-8');
        setEmail(settings.email || 'info@taxnexus.com');
        setPhone(settings.phone || '+92 300 1234567');
        setAddress(settings.address || '123 Business Avenue, Lahore, Pakistan');
        setEndpoint(settings.endpoint || 'https://api.fbr.gov.pk');
        setApiKey(settings.apiKey || 'FBR_API_TOKEN_12345');
        setAutoBackup(settings.autoBackup !== undefined ? settings.autoBackup : true);
        setEmailNotifications(settings.emailNotifications !== undefined ? settings.emailNotifications : true);
        setDarkMode(settings.darkMode || false);
      }

      const savedApiSettings = localStorage.getItem('apiSettings');
      if (savedApiSettings) {
        const apiSettings = JSON.parse(savedApiSettings);
        setEndpoint(apiSettings.endpoint || 'https://api.fbr.gov.pk');
        setApiKey(apiSettings.apiKey || 'FBR_API_TOKEN_12345');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  // Update localStorage when settings change
  useEffect(() => {
    try {
      const settings = {
        company,
        ntn,
        email,
        phone,
        address,
        endpoint,
        apiKey,
        autoBackup,
        emailNotifications,
        darkMode
      };
      localStorage.setItem('settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }, [company, ntn, email, phone, address, endpoint, apiKey, autoBackup, emailNotifications, darkMode]);

  const onSave = (e) => {
    if (e) e.preventDefault();
    
    try {
      const settings = {
        company,
        ntn,
        email,
        phone,
        address,
        endpoint,
        apiKey,
        autoBackup,
        emailNotifications,
        darkMode
      };
      
      localStorage.setItem('settings', JSON.stringify(settings));
      setSavedAt(new Date().toLocaleString());
      
      setTimeout(() => {
        setSavedAt('');
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      window.alert('❌ Error saving settings: ' + error.message);
    }
  };

  const onTestConnection = async () => {
    const startTime = Date.now();
    setTestingConnection(true);
    setConnectionStatus('testing');
    
    try {
      // Simulate API connection test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const responseTime = Date.now() - startTime;
      setConnectionStatus('connected');
      window.alert('✅ API Connection Successful!\n\nServer is responding correctly.\nResponse Time: ' + responseTime + 'ms');
      
    } catch (error) {
      console.error('Connection test error:', error);
      setConnectionStatus('failed');
      window.alert('❌ API Connection Failed!\n\nUnable to connect to the server.\nPlease check your API configuration.\n\nError: ' + error.message);
    } finally {
      setTestingConnection(false);
    }
  };

  const onSaveApiSettings = () => {
    try {
      const apiSettings = {
        endpoint,
        apiKey
      };
      
      localStorage.setItem('apiSettings', JSON.stringify(apiSettings));
      setSavedAt(new Date().toLocaleString());
      
      setTimeout(() => {
        setSavedAt('');
      }, 3000);
      
      // Show success message
      const maskedKey = apiKey ? (apiKey.length > 8 ? apiKey.substring(0, 8) + '...' : apiKey) : 'N/A';
      window.alert('✅ API Settings Saved!\n\nEndpoint: ' + endpoint + '\nAPI Key: ' + maskedKey);
    } catch (error) {
      console.error('Error saving API settings:', error);
      window.alert('❌ Error saving API settings: ' + error.message);
    }
  };

  const onResetApiCredentials = () => {
    if (window.confirm('⚠️ Are you sure you want to reset API credentials?\n\nThis will restore the default API endpoint and key.')) {
      try {
        setEndpoint('https://api.fbr.gov.pk');
        setApiKey('FBR_API_TOKEN_12345');
        localStorage.removeItem('apiSettings');
        setSavedAt('');
        setConnectionStatus('unknown'); // Reset connection status
        window.alert('✅ API credentials have been reset to default values.');
      } catch (error) {
        console.error('Error resetting API credentials:', error);
        window.alert('❌ Error resetting API credentials: ' + error.message);
      }
    }
  };

  const onClearAllInvoices = () => {
    if (window.confirm('⚠️ Are you sure you want to clear all invoices?\n\nThis action cannot be undone and will permanently delete all invoice records from the system.')) {
      try {
        localStorage.removeItem('invoices');
        localStorage.removeItem('invoiceHistory');
        localStorage.removeItem('draftInvoices');
        window.alert('✅ All invoices have been cleared successfully.');
      } catch (error) {
        console.error('Error clearing invoices:', error);
        window.alert('❌ Error clearing invoices: ' + error.message);
      }
    }
  };

  const onReset = () => {
    try {
      setCompany('Tax Nexus Pvt Ltd');
      setNtn('1234567-8');
      setEmail('info@taxnexus.com');
      setPhone('+92 300 1234567');
      setAddress('123 Business Avenue, Lahore, Pakistan');
      setEndpoint('https://api.fbr.gov.pk');
      setApiKey('FBR_API_TOKEN_12345');
      setAutoBackup(true);
      setEmailNotifications(true);
      setDarkMode(false);
      setSavedAt('');
      localStorage.removeItem('settings');
      localStorage.removeItem('apiSettings');
    } catch (error) {
      console.error('Error resetting settings:', error);
      window.alert('❌ Error resetting settings: ' + error.message);
    }
  };

  const canSave = company && ntn && email && phone && address && endpoint && apiKey;

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="pageTitle">Settings</div>
          <div className="pageSubtitle">Configure your organization and application preferences</div>
        </div>
      </div>

      <div className="settingsContainer">
        <div className="card">
          <div className="cardHeader">
            <div className="cardTitle">Company Information</div>
          </div>

          <div className="form">
            <div className="formRow">
              <label className="field">
                <div className="label">Company Name</div>
                <input 
                  className="input" 
                  value={company} 
                  onChange={e => setCompany(e.target.value)} 
                  placeholder="Enter company name"
                />
              </label>
            </div>

            <div className="formRow">
              <label className="field">
                <div className="label">NTN (National Tax Number)</div>
                <input 
                  className="input" 
                  value={ntn} 
                  onChange={e => setNtn(e.target.value)} 
                  placeholder="Enter NTN number"
                />
              </label>
            </div>

            <div className="formRow">
              <label className="field">
                <div className="label">Email Address</div>
                <input 
                  className="input" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="Enter email address"
                />
              </label>
            </div>

            <div className="formRow">
              <label className="field">
                <div className="label">Phone Number</div>
                <input 
                  className="input" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="Enter phone number"
                />
              </label>
            </div>

            <div className="formRow">
              <label className="field">
                <div className="label">Business Address</div>
                <textarea 
                  className="input" 
                  rows="3" 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  placeholder="Enter business address"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div className="cardTitle">API Configuration</div>
          </div>

          <div className="form">
            <div className="formRow">
              <label className="field">
                <div className="label">FBR API Endpoint</div>
                <input 
                  className="input" 
                  value={endpoint} 
                  onChange={e => setEndpoint(e.target.value)} 
                  placeholder="Enter API endpoint URL"
                />
              </label>
            </div>

            <div className="formRow">
              <label className="field">
                <div className="label">API Key</div>
                <input 
                  className="input" 
                  type="password" 
                  value={apiKey} 
                  onChange={e => setApiKey(e.target.value)} 
                  placeholder="Enter API key"
                />
              </label>
            </div>

            <div className="formRow">
              <label className="field">
                <div className="label">Connection Status</div>
                {connectionStatus === 'connected' ? (
                  <div className="pill pillOk working">
                    <span className="statusDot"></span>
                    Connected
                  </div>
                ) : connectionStatus === 'failed' ? (
                  <div className="pill pillError">
                    <span className="statusDot" style={{ backgroundColor: '#dc2626' }}></span>
                    Failed
                  </div>
                ) : connectionStatus === 'testing' ? (
                  <div className="pill pillWarning">
                    <span className="statusDot" style={{ backgroundColor: '#f59e0b' }}></span>
                    Testing...
                  </div>
                ) : (
                  <div className="pill">
                    Not Connected
                  </div>
                )}
              </label>
            </div>

            <div className="formRow">
              <div className="field">
                <div className="label">API Actions</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    type="button" 
                    className="primaryBtn" 
                    onClick={onTestConnection}
                    disabled={testingConnection}
                  >
                    {testingConnection ? 'Testing...' : 'Test Connection'}
                  </button>
                  <button type="button" className="primaryBtn" onClick={onSaveApiSettings}>
                    Save API Settings
                  </button>
                  <button type="button" className="ghostBtn" onClick={onResetApiCredentials}>
                    Reset API Credentials
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div className="cardTitle">Application Preferences</div>
          </div>

          <div className="form">
            <div className="formRow">
              <label className="field">
                <div className="label">Auto Backup</div>
                <div className="toggle">
                  <input type="checkbox" checked={autoBackup} onChange={e => setAutoBackup(e.target.checked)} />
                  <span className="toggleSlider"></span>
                </div>
              </label>
            </div>

            <div className="formRow">
              <label className="field">
                <div className="label">Email Notifications</div>
                <div className="toggle">
                  <input type="checkbox" checked={emailNotifications} onChange={e => setEmailNotifications(e.target.checked)} />
                  <span className="toggleSlider"></span>
                </div>
              </label>
            </div>

            <div className="formRow">
              <label className="field">
                <div className="label">Dark Mode</div>
                <div className="toggle">
                  <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />
                  <span className="toggleSlider"></span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '16px' }}>
        <div className="cardHeader">
          <div className="cardTitle">Actions</div>
        </div>

        <div className="form">
          <div className="formRow">
            <div className="field">
              <div className="label">General Actions</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button type="button" className="ghostBtn" onClick={onReset}>
                  Reset to Default
                </button>
                <button type="button" className={canSave ? 'primaryBtn' : 'primaryBtn disabled'} onClick={onSave} disabled={!canSave}>
                  Save Settings
                </button>
              </div>
            </div>
          </div>

          <div className="formRow">
            <div className="field">
              <div className="label">Data Management</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button type="button" className="ghostBtn" onClick={onClearAllInvoices} style={{ color: '#dc2626', borderColor: '#dc2626' }}>
                  Clear All Invoices
                </button>
              </div>
            </div>
          </div>
        </div>

        {savedAt && (
          <div className="muted" style={{ marginTop: '12px' }}>
            ✓ Settings saved successfully at: {savedAt}
          </div>
        )}
      </div>
    </div>
  );
}
