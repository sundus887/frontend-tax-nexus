import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Sidebar from '../../components/Sidebar';

export default function UploadInvoice() {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [excelData, setExcelData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [validationResults, setValidationResults] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: 'Upload', desc: 'Upload Excel file' },
    { number: 2, title: 'Preview', desc: 'Review data' },
    { number: 3, title: 'Validate', desc: 'Check for errors' },
    { number: 4, title: 'Submit', desc: 'Send to FBR' },
  ];

  // FBR IRIS required fields (12 fields)
  const fbrFields = [
    { key: 'invoice_number', label: 'Invoice Number', required: true, description: 'Unique invoice identifier as per company\'s invoice numbering system' },
    { key: 'invoice_date', label: 'Invoice Date', required: true, description: 'Date when invoice was issued (format: YYYY-MM-DD)' },
    { key: 'customer_name', label: 'Customer Name', required: true, description: 'Full name of the customer/buyer' },
    { key: 'customer_ntn', label: 'Customer NTN', required: true, description: 'National Tax Number of the customer' },
    { key: 'customer_address', label: 'Customer Address', required: true, description: 'Complete address of the customer' },
    { key: 'item_description', label: 'Item Description', required: true, description: 'Description of goods or services sold' },
    { key: 'hs_code', label: 'HS Code', required: true, description: 'Harmonized System code for the product' },
    { key: 'quantity', label: 'Quantity', required: true, description: 'Number of units sold' },
    { key: 'unit_price', label: 'Unit Price', required: true, description: 'Price per unit' },
    { key: 'total_amount', label: 'Total Amount', required: true, description: 'Total invoice amount including tax' },
    { key: 'sales_tax_rate', label: 'Sales Tax Rate', required: true, description: 'Applicable sales tax percentage' },
    { key: 'sales_tax_amount', label: 'Sales Tax Amount', required: true, description: 'Calculated sales tax amount' },
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
      setExcelData(null);
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
      setExcelData(null);
      setCurrentStep(1);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const parseExcel = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      
      if (jsonData.length < 2) {
        setError('Excel file is empty or has no data');
        setUploading(false);
        return;
      }

      // First row is headers
      const headers = jsonData[0];
      // Rest is data
      const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== ''));
      
      setHeaders(headers);
      setExcelData(rows);
      
      // Auto-detect column mapping based on header names
      const autoMapping = {};
      headers.forEach((header, index) => {
        const headerLower = header.toString().toLowerCase();
        if (headerLower.includes('invoice') || headerLower.includes('inv')) {
          autoMapping['invoice_number'] = index;
        } else if (headerLower.includes('date') || headerLower.includes('time')) {
          autoMapping['date'] = index;
        } else if (headerLower.includes('customer') || headerLower.includes('buyer') || headerLower.includes('party')) {
          autoMapping['customer_name'] = index;
        } else if (headerLower.includes('ntn') || headerLower.includes('tax')) {
          autoMapping['ntn'] = index;
        } else if (headerLower.includes('amount') || headerLower.includes('total') || headerLower.includes('value')) {
          autoMapping['amount'] = index;
        } else if (headerLower.includes('hs') || headerLower.includes('code')) {
          autoMapping['hs_code'] = index;
        } else if (headerLower.includes('desc') || headerLower.includes('item') || headerLower.includes('product')) {
          autoMapping['description'] = index;
        }
      });
      setColumnMapping(autoMapping);
      
      setCurrentStep(2);
    } catch (err) {
      console.error('Parse error:', err);
      setError('Failed to parse Excel file. Please check the file format.');
    } finally {
      setUploading(false);
    }
  };

  // Helper function to format date as YYYY/MM/DD
  const formatDateToYYYYMMDD = (dateValue) => {
    if (!dateValue) return '-';
    
    try {
      // If it's already a Date object
      if (dateValue instanceof Date) {
        const year = dateValue.getFullYear();
        const month = String(dateValue.getMonth() + 1).padStart(2, '0');
        const day = String(dateValue.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
      }
      
      // If it's a string, try to parse it
      const dateStr = dateValue.toString();
      
      // Check if already in YYYY/MM/DD format
      if (/^\d{4}\/\d{2}\/\d{2}$/.test(dateStr)) {
        return dateStr;
      }
      
      // Check if in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr.replace(/-/g, '/');
      }
      
      // Check if in DD/MM/YYYY or DD-MM-YYYY format
      const ddmmyyyyMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if (ddmmyyyyMatch) {
        const day = ddmmyyyyMatch[1].padStart(2, '0');
        const month = ddmmyyyyMatch[2].padStart(2, '0');
        const year = ddmmyyyyMatch[3];
        return `${year}/${month}/${day}`;
      }
      
      // Check if in MM/DD/YYYY or MM-DD-YYYY format
      const mmddyyyyMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if (mmddyyyyMatch && parseInt(mmddyyyyMatch[1]) <= 12) {
        const month = mmddyyyyMatch[1].padStart(2, '0');
        const day = mmddyyyyMatch[2].padStart(2, '0');
        const year = mmddyyyyMatch[3];
        return `${year}/${month}/${day}`;
      }
      
      // Try parsing as Date
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
      }
      
      // If Excel serial number (like 45000)
      if (typeof dateValue === 'number' && dateValue > 30000 && dateValue < 60000) {
        // Excel dates are counted from 1900-01-01
        const excelEpoch = new Date(1900, 0, 1);
        const date = new Date(excelEpoch.getTime() + (dateValue - 1) * 24 * 60 * 60 * 1000);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
      }
      
      return dateStr;
    } catch {
      return dateValue.toString();
    }
  };

  const validateData = () => {
    const errors = [];
    const validRows = [];

    excelData.forEach((row, index) => {
      const rowErrors = [];
      const mappedRow = {};

      fbrFields.forEach(field => {
        if (columnMapping[field.key] !== undefined) {
          const value = row[columnMapping[field.key]];
          mappedRow[field.key] = value;
          
          if (field.required && (!value || value === '')) {
            rowErrors.push(`${field.label} is required`);
          }
        } else if (field.required) {
          rowErrors.push(`${field.label} is not mapped`);
        }
      });

      if (rowErrors.length > 0) {
        errors.push({ row: index + 1, errors: rowErrors });
      } else {
        validRows.push(mappedRow);
      }
    });

    setValidationResults({
      total: excelData.length,
      valid: validRows.length,
      invalid: errors.length,
      errors: errors,
      validRows: validRows
    });

    setCurrentStep(4);
  };

  const handleSubmitToFBR = () => {
    // Simulate submitting to FBR
    alert(`Successfully submitted ${validationResults.valid} invoices to FBR!`);
    navigate('/dashboard');
  };

  const goHome = () => {
    navigate('/dashboard');
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Upload Excel File</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Drag and drop your invoice Excel file or click to browse</p>

            {error && (
              <div style={{ marginBottom: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '6px' }}>
                {error}
              </div>
            )}

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

            {file && (
              <button
                onClick={parseExcel}
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
                {uploading ? 'Uploading & Parsing...' : 'Upload & Preview'}
              </button>
            )}
          </div>
        );

      case 2:
        return (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
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
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af' }}>{excelData?.length} rows detected in Excel file</p>
                <p style={{ fontSize: '14px', color: '#3b82f6' }}>{headers?.length} columns found</p>
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

            <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px', maxHeight: '400px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb', position: 'sticky', top: 0 }}>
                  <tr>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Row</th>
                    {headers.map((header, idx) => (
                      <th key={idx} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelData?.slice(0, 10).map((row, rowIdx) => (
                    <tr key={rowIdx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827' }}>{rowIdx + 1}</td>
                      {headers.map((header, colIdx) => {
                        const value = row[colIdx];
                        // Check if this column is a date column
                        const isDateColumn = header.toString().toLowerCase().includes('date') || 
                                            header.toString().toLowerCase().includes('time');
                        const displayValue = isDateColumn && value 
                          ? formatDateToYYYYMMDD(value)
                          : (value || '-');
                        return (
                          <td key={colIdx} style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>
                            {displayValue}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              {excelData?.length > 10 && (
                <div style={{ padding: '12px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                  ... and {excelData.length - 10} more rows
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button
                onClick={goBack}
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
              <button
                onClick={() => setCurrentStep(3)}
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
                Continue to Validation <span>→</span>
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Validate Data</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Check your data for errors before submitting to FBR</p>

            {!validationResults ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '16px', color: '#374151', marginBottom: '8px' }}>Ready to validate {excelData?.length || 0} records</p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>This will check for missing fields, invalid formats, and data errors</p>
                </div>
                <button
                  onClick={validateData}
                  style={{
                    padding: '12px 32px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Start Validation
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{validationResults.total}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Total Records</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{validationResults.valid}</p>
                    <p style={{ fontSize: '12px', color: '#16a34a' }}>Valid</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>{validationResults.invalid}</p>
                    <p style={{ fontSize: '12px', color: '#dc2626' }}>Invalid</p>
                  </div>
                </div>

                {validationResults.errors.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Errors Found:</h3>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {validationResults.errors.map((err, idx) => (
                        <div key={idx} style={{ padding: '12px', backgroundColor: '#fef2f2', borderRadius: '6px', marginBottom: '8px' }}>
                          <p style={{ fontSize: '14px', fontWeight: '500', color: '#dc2626' }}>Row {err.row}</p>
                          <ul style={{ margin: '4px 0 0 16px', fontSize: '13px', color: '#991b1b' }}>
                            {err.errors.map((e, i) => <li key={i}>{e}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    onClick={goBack}
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
                  <button
                    onClick={() => setCurrentStep(4)}
                    disabled={validationResults.valid === 0}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 24px',
                      backgroundColor: validationResults.valid === 0 ? '#9ca3af' : '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: validationResults.valid === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Continue to Submit <span>→</span>
                  </button>
                </div>
              </>
            )}
          </div>
        );

      case 4:
        return (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Submit to FBR</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Review and submit your invoices to FBR</p>

            <div style={{ 
              backgroundColor: '#f0fdf4', 
              border: '1px solid #bbf7d0', 
              borderRadius: '8px', 
              padding: '24px', 
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>📤</p>
              <p style={{ fontSize: '20px', fontWeight: '600', color: '#166534', marginBottom: '8px' }}>
                Ready to Submit
              </p>
              <p style={{ fontSize: '16px', color: '#16a34a' }}>
                {validationResults?.valid || 0} valid invoices will be submitted to FBR
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={goBack}
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
              <button
                onClick={handleSubmitToFBR}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 32px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Submit to FBR <span>📤</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar userType="client" />

      <div style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
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

          {/* Step Content */}
          {renderStepContent()}
        </main>
      </div>
    </div>
  );
}
