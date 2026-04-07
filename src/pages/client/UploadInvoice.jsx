import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';

export default function UploadInvoice() {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationResults, setValidationResults] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: 'Upload', desc: 'Upload Excel file' },
    { number: 2, title: 'Preview', desc: 'Review data' },
    { number: 3, title: 'Map', desc: 'Map columns' },
    { number: 4, title: 'Validate', desc: 'Check for errors' },
    { number: 5, title: 'Submit', desc: 'Send to FBR' },
  ];

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
      setCurrentStep(1);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      if (!validTypes.includes(droppedFile.type) && !droppedFile.name.endsWith('.xlsx') && !droppedFile.name.endsWith('.xls')) {
        setError('Please select a valid Excel file (.xlsx or .xls)');
        return;
      }
      setFile(droppedFile);
      setError('');
      setSuccess('');
      setValidationResults(null);
      setCurrentStep(1);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setCurrentStep(4);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await clientAPI.uploadInvoice(formData);
      
      setSuccess('File uploaded and validated successfully!');
      setValidationResults(response.data);
      setCurrentStep(5);
      
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload file');
      setCurrentStep(1);
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
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Upload & Validate Invoice</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Upload Excel file, map columns, validate data, and submit to FBR</p>
        </header>

        <main style={{ padding: '24px', maxWidth: '900px' }}>
          {/* Progress Steps */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {steps.map((step, index) => (
                <div key={step.number} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: currentStep >= step.number ? '#2563eb' : '#e5e7eb',
                      color: currentStep >= step.number ? 'white' : '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      margin: '0 auto 8px'
                    }}>
                      {step.number}
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>{step.title}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>{step.desc}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div style={{
                      flex: 1,
                      height: '2px',
                      backgroundColor: currentStep > step.number ? '#2563eb' : '#e5e7eb',
                      margin: '0 16px',
                      marginBottom: '30px'
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Upload Excel File</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Drag and drop your invoice Excel file or click to browse</p>

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

            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #d1d5db',
                borderRadius: '12px',
                padding: '48px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: file ? '#f0fdf4' : '#f9fafb',
                transition: 'all 0.2s'
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              
              {file ? (
                <div>
                  <p style={{ fontSize: '48px', marginBottom: '8px' }}>📄</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#111827' }}>{file.name}</p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '48px', marginBottom: '16px' }}>⬆</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Drop your Excel file here or click to browse</p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>Supports .xlsx and .xls files</p>
                </div>
              )}
            </div>

            {/* Upload Button */}
            {file && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                style={{
                  width: '100%',
                  marginTop: '24px',
                  padding: '12px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  opacity: uploading ? 0.5 : 1
                }}
              >
                {uploading ? 'Uploading & Validating...' : 'Upload & Validate'}
              </button>
            )}

            {/* Validation Results */}
            {validationResults && (
              <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Validation Results</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'white', borderRadius: '8px' }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{validationResults.total}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Total Records</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{validationResults.valid}</p>
                    <p style={{ fontSize: '12px', color: '#16a34a' }}>Valid</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
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
                  <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => navigate('/invoices')}
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Submit to FBR
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
