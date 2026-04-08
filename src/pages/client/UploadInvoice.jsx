import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

export default function UploadInvoice() {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: 'Upload', desc: 'Upload Excel file' },
    { number: 2, title: 'Preview', desc: 'Review data' },
    { number: 3, title: 'Map', desc: 'Map columns' },
    { number: 4, title: 'Validate', desc: 'Check for errors' },
    { number: 5, title: 'Submit', desc: 'Send to FBR' },
  ];

  // Sample data for preview (in real app, this comes from backend)
  const generatePreviewData = () => {
    return [
      { row: 1, status: 'Pending', invoiceNo: 'INV-2024-001', date: '2024-04-01', customer: 'ABC Traders', ntn: '1234567', hsCode: '8471.30.00' },
      { row: 2, status: 'Pending', invoiceNo: 'INV-2024-002', date: '2024-04-01', customer: 'XYZ Corp', ntn: '7654321', hsCode: '8517.62.00' },
      { row: 3, status: 'Pending', invoiceNo: 'INV-2024-003', date: '2024-04-01', customer: 'DEF Industries', ntn: '123', hsCode: '9999' },
      { row: 4, status: 'Pending', invoiceNo: 'INV-2024-004', date: '2024-04-01', customer: 'GHI Enterprises', ntn: '9876543', hsCode: '8528.72.00' },
      { row: 5, status: 'Pending', invoiceNo: 'INV-2024-005', date: '2024-04-01', customer: 'JKL Suppliers', ntn: '5555555', hsCode: '8471.50.00' },
    ];
  };

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
      setPreviewData(null);
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
      setPreviewData(null);
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

    try {
      // Simulate API call for preview
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate preview data
      const data = generatePreviewData();
      setPreviewData(data);
      setCurrentStep(2);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleBack = () => {
    setFile(null);
    setPreviewData(null);
    setCurrentStep(1);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleContinue = () => {
    setCurrentStep(3);
    // Navigate to mapping or show mapping UI
  };

  const handleSubmitToFBR = () => {
    // Simulate submitting to FBR
    alert('Invoices submitted to FBR successfully!');
    navigate('/dashboard');
  };

  const goHome = () => {
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar userType="client" />

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
        {/* Header */}
        <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Upload & Validate Invoice</h1>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Upload Excel file, map columns, validate data, and submit to FBR</p>
          </div>
          <button
            onClick={goHome}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🏠</span> Home
          </button>
        </header>

        <main style={{ padding: '24px', maxWidth: '1000px' }}>
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

          {/* Upload Area - Step 1 */}
          {currentStep === 1 && (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Upload Excel File</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Drag and drop your invoice Excel file or click to browse</p>

              {error && (
                <div style={{ marginBottom: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '6px' }}>
                  {error}
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
                  {uploading ? 'Uploading...' : 'Upload & Preview'}
                </button>
              )}
            </div>
          )}

          {/* Preview Data - Step 2 */}
          {currentStep === 2 && previewData && (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
              {/* Header with file name */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Excel Data Preview</h2>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>Review your uploaded data before mapping</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>📊</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{file?.name}</span>
                </div>
              </div>

              {/* Info Banner */}
              <div style={{ 
                backgroundColor: '#eff6ff', 
                border: '1px solid #dbeafe', 
                borderRadius: '8px', 
                padding: '16px', 
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af' }}>{previewData.length} rows detected in Excel file</p>
                  <p style={{ fontSize: '14px', color: '#3b82f6' }}>6 columns will be mapped to FBR fields</p>
                </div>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'white', fontSize: '20px' }}>✓</span>
                </div>
              </div>

              {/* Data Table */}
              <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Row</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Invoice_No</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Date</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Customer</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>NTN</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>HS_Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row) => (
                      <tr key={row.row} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827' }}>{row.row}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: '#9ca3af',
                            color: 'white'
                          }}>
                            {row.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827' }}>{row.invoiceNo}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>{row.date}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827' }}>{row.customer}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>{row.ntn}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>{row.hsCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                <button
                  onClick={handleBack}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  <span>←</span> Back
                </button>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleSubmitToFBR}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 24px',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Submit to FBR <span>📤</span>
                  </button>
                  <button
                    onClick={handleContinue}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 24px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Continue to Mapping <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
