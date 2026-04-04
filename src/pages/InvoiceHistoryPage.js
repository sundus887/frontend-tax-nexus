import React, { useMemo, useState } from 'react';
import { DownloadIcon } from '../components/icons';

function StatCard({ title, value, color = 'neutral' }) {
  return (
    <div className="card statCard">
      <div className="statTitle">{title}</div>
      <div className="statValue">{value}</div>
    </div>
  );
}

export default function InvoiceHistoryPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const rows = useMemo(
    () => [
      { date: '2026-04-01', invoiceId: 'INV-2024-001', customer: 'ABC Traders', amount: 125000, status: 'Sent to FBR', fbrRef: 'FBR-1711965432001' },
      { date: '2026-04-01', invoiceId: 'INV-2024-002', customer: 'XYZ Corporation', amount: 89500, status: 'Sent to FBR', fbrRef: 'FBR-1711965432002' },
      { date: '2026-04-01', invoiceId: 'INV-2024-003', customer: 'DEF Industries', amount: 245000, status: 'Invalid', fbrRef: '-' },
      { date: '2026-04-01', invoiceId: 'INV-2024-004', customer: 'GHI Enterprises', amount: 156000, status: 'Sent to FBR', fbrRef: 'FBR-1711965432004' },
      { date: '2026-04-01', invoiceId: 'INV-2024-005', customer: 'JKL Suppliers', amount: 92300, status: 'Invalid', fbrRef: '-' },
      { date: '2026-04-01', invoiceId: 'INV-2024-006', customer: 'MNO Traders', amount: 78000, status: 'Valid', fbrRef: 'FBR-1711965432006' },
      { date: '2026-04-01', invoiceId: 'INV-2024-007', customer: 'PQR Industries', amount: 112000, status: 'Pending', fbrRef: '-' },
    ],
    []
  );

  const stats = useMemo(() => {
    const total = rows.length;
    const sent = rows.filter(r => r.status === 'Sent to FBR').length;
    const valid = rows.filter(r => r.status === 'Valid').length;
    const invalid = rows.filter(r => r.status === 'Invalid').length;
    const pending = rows.filter(r => r.status === 'Pending').length;
    return { total, sent, valid, invalid, pending };
  }, [rows]);

  const filtered = useMemo(() => {
    let out = rows;
    const q = query.trim().toLowerCase();
    if (q) {
      out = out.filter(r => `${r.invoiceId} ${r.customer} ${r.status}`.toLowerCase().includes(q));
    }
    if (statusFilter !== 'All') {
      out = out.filter(r => r.status === statusFilter);
    }
    return out;
  }, [rows, query, statusFilter]);

  function exportCsv() {
    const csv = [
      'Date,Invoice ID,Customer,Amount,Status,FBR Reference',
      ...filtered.map(r => `${r.date},${r.invoiceId},${r.customer},${r.amount},${r.status},${r.fbrRef}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoice-history.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleView(invoice) {
    alert(`Viewing invoice: ${invoice.invoiceId}\nCustomer: ${invoice.customer}\nAmount: PKR ${invoice.amount.toLocaleString()}\nStatus: ${invoice.status}`);
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="pageTitle">Invoice History</div>
          <div className="pageSubtitle">View and manage all your submitted invoices</div>
        </div>
      </div>

      <div className="grid5">
        <StatCard title="Total" value={stats.total} color="neutral" />
        <StatCard title="Sent to FBR" value={stats.sent} color="neutral" />
        <StatCard title="Valid" value={stats.valid} color="good" />
        <StatCard title="Invalid" value={stats.invalid} color="bad" />
        <StatCard title="Pending" value={stats.pending} color="neutral" />
      </div>

      <div className="card">
        <div className="cardHeader">
          <div className="cardTitle">All Invoices</div>
          <div className="muted">Complete history of processed invoices</div>
        </div>

        <div className="historyControls">
          <button type="button" className="primaryBtn" onClick={exportCsv}>
            <span className="btnIcon">
              <DownloadIcon size={16} />
            </span>
            Export CSV
          </button>

          <div className="historySearchFilter">
            <input
              className="input search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search invoices..."
            />
            <select
              className="input"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Sent to FBR">Sent to FBR</option>
              <option value="Valid">Valid</option>
              <option value="Invalid">Invalid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="table historyTable">
          <div className="tr th">
            <div>Date</div>
            <div>Invoice ID</div>
            <div>Customer</div>
            <div className="right">Amount</div>
            <div>Status</div>
            <div>FBR Reference</div>
            <div className="center">Actions</div>
          </div>
          {filtered.map(r => (
            <div key={r.invoiceId} className="tr">
              <div>{r.date}</div>
              <div className="mono">{r.invoiceId}</div>
              <div>{r.customer}</div>
              <div className="right">PKR {r.amount.toLocaleString()}</div>
              <div>
                <span className={
                  r.status === 'Valid' ? 'pill pillOk' :
                  r.status === 'Invalid' ? 'pill pillBad' :
                  r.status === 'Sent to FBR' ? 'pill pillWarn' :
                  r.status === 'Pending' ? 'pill pillWarn' :
                  'pill'
                }>
                  {r.status}
                </span>
              </div>
              <div className="mono">{r.fbrRef}</div>
              <div className="center">
                <button type="button" className="iconBtn" title="View" onClick={() => handleView(r)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
