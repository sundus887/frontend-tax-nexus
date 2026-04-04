import React, { useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';

const STEPS = [
  { key: 'upload', title: 'Upload', sub: 'Upload Excel file' },
  { key: 'preview', title: 'Preview', sub: 'Review data' },
  { key: 'map', title: 'Map', sub: 'Map columns' },
  { key: 'validate', title: 'Validate', sub: 'Check for errors' },
  { key: 'submit', title: 'Submit', sub: 'Send to FBR' },
];

function WizardStepper({ activeIndex }) {
  return (
    <div className="stepperCard">
      <div className="stepper">
        {STEPS.map((s, idx) => {
          const isDone = idx < activeIndex;
          const isActive = idx === activeIndex;

          return (
            <div key={s.key} className="step">
              <div className={isDone ? 'stepCircle done' : isActive ? 'stepCircle active' : 'stepCircle'}>
                {idx + 1}
              </div>
              <div className="stepText">
                <div className="stepTitle">{s.title}</div>
                <div className="stepSub">{s.sub}</div>
              </div>
              {idx < STEPS.length - 1 ? <div className="stepLine" /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function pickFileFromEvent(e) {
  const files = e?.dataTransfer?.files || e?.target?.files;
  if (!files || !files.length) return null;
  return files[0];
}

function isExcelFile(file) {
  if (!file) return false;
  const name = (file.name || '').toLowerCase();
  return name.endsWith('.xlsx') || name.endsWith('.xls');
}

export default function UploadInvoicePage() {
  const fileInputRef = useRef(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);

  const [previewRows, setPreviewRows] = useState([]);
  const [mapping, setMapping] = useState({ invoiceNo: 'InvoiceNo', customer: 'Customer', amount: 'Amount' });
  const [validation, setValidation] = useState({ valid: 0, invalid: 0, errors: [] });
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' });

  const availableColumns = useMemo(() => {
    if (!previewRows.length) return [];
    const cols = Object.keys(previewRows[0]);
    return cols.filter(col => col !== undefined && col !== null && col !== '');
  }, [previewRows]);

  const canGoNext = useMemo(() => {
    const stepKey = STEPS[stepIndex]?.key;
    if (stepKey === 'upload') return Boolean(file);
    if (stepKey === 'preview') return previewRows.length > 0;
    if (stepKey === 'map') return mapping.invoiceNo && mapping.customer && mapping.amount;
    if (stepKey === 'validate') return true;
    return false;
  }, [file, mapping, previewRows.length, stepIndex]);

  function resetAll() {
    setStepIndex(0);
    setDragOver(false);
    setFile(null);
    setPreviewRows([]);
    setMapping({ invoiceNo: 'InvoiceNo', customer: 'Customer', amount: 'Amount' });
    setValidation({ valid: 0, invalid: 0, errors: [] });
    setSubmitState({ status: 'idle', message: '' });
  }

  async function onSelectFile(f) {
    if (!f) return;
    if (!isExcelFile(f)) {
      setSubmitState({ status: 'error', message: 'Please upload an Excel file (.xlsx or .xls).' });
      return;
    }

    setSubmitState({ status: 'idle', message: '' });
    setFile(f);

    try {
      const data = await f.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (!jsonData || jsonData.length < 2) {
        setSubmitState({ status: 'error', message: 'Excel file appears empty or invalid.' });
        return;
      }

      const [headers, ...rows] = jsonData;
      const headerRow = headers.map(h => String(h || '').trim()).filter(Boolean);
      const mappedRows = rows.map(row => {
        const obj = {};
        headerRow.forEach((col, idx) => {
          obj[col] = row[idx];
        });
        return obj;
      });

      setPreviewRows(mappedRows);
      const autoMapping = {};
      headerRow.forEach(col => {
        const lower = col.toLowerCase();
        if (lower.includes('invoice') || lower.includes('inv')) autoMapping.invoiceNo = col;
        if (lower.includes('customer') || lower.includes('client') || lower.includes('name')) autoMapping.customer = col;
        if (lower.includes('amount') || lower.includes('total') || lower.includes('price')) autoMapping.amount = col;
      });
      setMapping(prev => ({ ...prev, ...autoMapping }));
      setStepIndex(1);
    } catch (err) {
      setSubmitState({ status: 'error', message: 'Failed to parse Excel file. Please check the file format.' });
    }
  }

  function onBrowse() {
    fileInputRef.current?.click();
  }

  function onNext() {
    const current = STEPS[stepIndex]?.key;

    if (current === 'map') {
      setValidation({ valid: 0, invalid: 0, errors: [] });
    }

    if (current === 'validate') {
      setSubmitState({ status: 'idle', message: '' });
    }

    setStepIndex(i => Math.min(i + 1, STEPS.length - 1));
  }

  function onBack() {
    setStepIndex(i => Math.max(i - 1, 0));
  }

  function runValidation() {
    const errors = [];
    let valid = 0;
    let invalid = 0;

    for (let idx = 0; idx < previewRows.length; idx += 1) {
      const r = previewRows[idx];
      const invoiceNo = r[mapping.invoiceNo];
      const customer = r[mapping.customer];
      const amount = Number(r[mapping.amount]);

      const rowErrors = [];
      if (!String(invoiceNo ?? '').trim()) rowErrors.push('Invoice No is required');
      if (!String(customer ?? '').trim()) rowErrors.push('Customer is required');
      if (!Number.isFinite(amount) || amount <= 0) rowErrors.push('Amount must be > 0');

      if (rowErrors.length) {
        invalid += 1;
        errors.push({ row: idx + 1, invoiceNo: String(invoiceNo ?? '-'), issues: rowErrors });
      } else {
        valid += 1;
      }
    }

    setValidation({ valid, invalid, errors });
  }

  function submitToFbr() {
    setSubmitState({ status: 'submitting', message: 'Submitting to FBR...' });

    window.setTimeout(() => {
      const ok = validation.invalid === 0;
      setSubmitState({
        status: ok ? 'success' : 'error',
        message: ok ? 'Submitted successfully (mock).' : 'Submission blocked: please fix validation errors.',
      });
    }, 900);
  }

  const stepKey = STEPS[stepIndex]?.key;

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="pageTitle">Upload &amp; Validate Invoice</div>
          <div className="pageSubtitle">Upload Excel file, map columns, validate data, and submit to FBR</div>
        </div>
      </div>

      <WizardStepper activeIndex={stepIndex} />

      <div className="card">
        <div className="cardHeader">
          <div className="cardTitle">
            {stepKey === 'upload'
              ? 'Upload Excel File'
              : stepKey === 'preview'
                ? 'Preview'
                : stepKey === 'map'
                  ? 'Map Columns'
                  : stepKey === 'validate'
                    ? 'Validate'
                    : 'Submit'}
          </div>
        </div>

        {stepKey === 'upload' ? (
          <div className="uploadBody">
            <div className="muted">Drag and drop your invoice Excel file or click to browse</div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              onChange={e => onSelectFile(pickFileFromEvent(e))}
            />

            <div
              className={dragOver ? 'dropzone dropzoneActive' : 'dropzone'}
              role="button"
              tabIndex={0}
              onClick={onBrowse}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') onBrowse();
              }}
              onDragOver={e => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => {
                e.preventDefault();
                setDragOver(false);
                onSelectFile(pickFileFromEvent(e));
              }}
            >
              <div className="dropIcon">⇪</div>
              <div className="dropTitle">Drop your Excel file here or click to browse</div>
              <div className="dropSub">Supports .xlsx and .xls files</div>
            </div>

            {submitState.status === 'error' ? (
              <div className="inlineAlert error">{submitState.message}</div>
            ) : null}
          </div>
        ) : null}

        {stepKey === 'preview' ? (
          <div className="wizardBody">
            <div className="wizardMeta">
              <div className="kv">
                <div className="k">File</div>
                <div className="v">{file ? file.name : '-'}</div>
              </div>
              <div className="kv">
                <div className="k">Rows</div>
                <div className="v">{previewRows.length}</div>
              </div>
            </div>
            <div className="previewTable">
              <div className="tr th">
                {availableColumns.map(c => (
                  <div key={c}>{c}</div>
                ))}
              </div>
              {previewRows.slice(0, 5).map((r, idx) => (
                <div key={idx} className="tr">
                  {availableColumns.map(c => (
                    <div key={c}>{String(r[c] ?? '')}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {stepKey === 'map' ? (
          <div className="wizardBody">
            <div className="muted">Select how your Excel columns map to required fields.</div>
            <div className="mapGrid">
              <label className="field">
                <div className="label">Invoice No column</div>
                <select
                  className="input"
                  value={mapping.invoiceNo}
                  onChange={e => setMapping(m => ({ ...m, invoiceNo: e.target.value }))}
                >
                  {availableColumns.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <div className="label">Customer column</div>
                <select
                  className="input"
                  value={mapping.customer}
                  onChange={e => setMapping(m => ({ ...m, customer: e.target.value }))}
                >
                  {availableColumns.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <div className="label">Amount column</div>
                <select
                  className="input"
                  value={mapping.amount}
                  onChange={e => setMapping(m => ({ ...m, amount: e.target.value }))}
                >
                  {availableColumns.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        ) : null}

        {stepKey === 'validate' ? (
          <div className="wizardBody">
            <div className="validateTop">
              <div className="pill pillOk">Valid: {validation.valid}</div>
              <div className={validation.invalid ? 'pill pillBad' : 'pill'}>Invalid: {validation.invalid}</div>
              <button type="button" className="primaryBtn" onClick={runValidation}>
                Run Validation
              </button>
            </div>

            {validation.errors.length ? (
              <div className="errorList">
                {validation.errors.map(e => (
                  <div key={`${e.row}-${e.invoiceNo}`} className="errorRow">
                    <div className="mono">Row {e.row}</div>
                    <div className="muted">Invoice: {e.invoiceNo}</div>
                    <div className="issues">
                      {e.issues.map(issue => (
                        <div key={issue} className="issueItem">
                          {issue}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="inlineAlert">No errors found yet. Click “Run Validation”.</div>
            )}
          </div>
        ) : null}

        {stepKey === 'submit' ? (
          <div className="wizardBody">
            <div className="submitPanel">
              <div className="muted">Ready to submit validated invoices to FBR.</div>
              <div className="submitActions">
                <button
                  type="button"
                  className={submitState.status === 'submitting' ? 'primaryBtn disabled' : 'primaryBtn'}
                  onClick={submitToFbr}
                  disabled={submitState.status === 'submitting'}
                >
                  Submit to FBR
                </button>
                <button type="button" className="ghostBtn" onClick={resetAll}>
                  Start Over
                </button>
              </div>

              {submitState.status !== 'idle' ? (
                <div
                  className={
                    submitState.status === 'success'
                      ? 'inlineAlert success'
                      : submitState.status === 'error'
                        ? 'inlineAlert error'
                        : 'inlineAlert'
                  }
                >
                  {submitState.message}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="wizardFooter">
          <button type="button" className={stepIndex === 0 ? 'ghostBtn disabled' : 'ghostBtn'} onClick={onBack} disabled={stepIndex === 0}>
            Back
          </button>
          <div className="wizardFooterRight">
            <button type="button" className="ghostBtn" onClick={resetAll}>
              Reset
            </button>
            {stepKey !== 'submit' ? (
              <button type="button" className={canGoNext ? 'primaryBtn' : 'primaryBtn disabled'} onClick={onNext} disabled={!canGoNext}>
                Next
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
