import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';

export default function UploadInvoice() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationResults, setValidationResults] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        setError('Please select a valid Excel file (.xlsx or .xls)');
        return;
      }
      setFile(selectedFile);
      setError('');
      setSuccess('');
      setValidationResults(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await clientAPI.uploadInvoice(formData);
      
      setSuccess('File uploaded and validated successfully!');
      setValidationResults(response.data);
      
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar userType="client" />

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
        {/* Header */}
        <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px 24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Upload Invoice</h1>
        </header>

        <main style={{ maxWidth: '600px', padding: '24px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
            {error && (
              <div style={{ marginBottom: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '6px' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ marginBottom: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px 16px', borderRadius: '6px' }}>
                {success}
              </div>
            )}

            {/* File Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Select Excel File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                style={{ display: 'block', width: '100%' }}
              />
              <p style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                Supported formats: .xlsx, .xls
              </p>
            </div>

            {/* Selected File Info */}
            {file && (
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Selected File:</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{file.name}</p>
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                  Size: {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: !file || uploading ? 'not-allowed' : 'pointer',
                opacity: !file || uploading ? 0.5 : 1
              }}
            >
              {uploading ? 'Uploading...' : 'Upload & Validate'}
            </button>

            {/* Validation Results */}
            {validationResults && (
              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Validation Results</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'white', borderRadius: '8px' }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{validationResults.total}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Total Records</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{validationResults.valid}</p>
                    <p style={{ fontSize: '12px', color: '#16a34a' }}>Valid</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>{validationResults.invalid}</p>
                    <p style={{ fontSize: '12px', color: '#dc2626' }}>Invalid</p>
                  </div>
                </div>

                {validationResults.errors && validationResults.errors.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Errors:</h4>
                    <ul style={{ fontSize: '14px', color: '#dc2626', paddingLeft: '16px' }}>
                      {validationResults.errors.map((err, index) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {validationResults.valid > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <button
                      onClick={() => navigate('/invoices')}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Send to FBR
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
