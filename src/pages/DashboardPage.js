import React, { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { isAdmin } from '../utils/auth';

function StatCard({ title, value, subText, rightText, variant = 'neutral' }) {
  return (
    <div className="card statCard">
      <div className="statTitle">{title}</div>
      <div className="statValue">{value}</div>
      <div className="statSub">
        <span className={variant === 'good' ? 'statChange good' : variant === 'bad' ? 'statChange bad' : 'statChange'}>
          {subText}
        </span>
        {rightText ? <span className="statRight">{rightText}</span> : null}
      </div>
    </div>
  );
}

function RealBarChart({ bars }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={bars} margin={{ top: 12, right: 14, left: 14, bottom: 44 }}>
        <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="valid" fill="#16a34a" name="Valid" radius={[4, 4, 0, 0]} />
        <Bar dataKey="invalid" fill="#ef4444" name="Invalid" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function RealLineChart({ points }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={points} margin={{ top: 12, right: 14, left: 14, bottom: 44 }}>
        <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} name="Weekly Trend" />
      </LineChart>
    </ResponsiveContainer>
  );
}

function RecentInvoices({ rows }) {
  return (
    <div className="card">
      <div className="cardHeader">
        <div className="cardTitle">Recent Invoices</div>
      </div>
      <div className="list">
        {rows.map(r => (
          <div key={r.id} className="listRow">
            <div className={r.status === 'Valid' ? 'statusIcon ok' : 'statusIcon bad'}>
              {r.status === 'Valid' ? '✓' : '×'}
            </div>
            <div className="listMain">
              <div className="listTitle">{r.id}</div>
              <div className="listSub">{r.customer}</div>
            </div>
            <div className="listEnd">
              <div className="amount">PKR {r.amount.toLocaleString()}</div>
              <div className={r.status === 'Valid' ? 'pill pillOk' : 'pill pillBad'}>{r.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // Get user role from JWT token
  const userIsAdmin = isAdmin();

  const stats = useMemo(
    () => ({
      totalInvoices: 1847,
      validInvoices: 1751,
      invalidInvoices: 96,
      totalTax: 1250000,
    }),
    []
  );

  const monthly = useMemo(
    () => [
      { label: 'Jan', valid: 145, invalid: 8 },
      { label: 'Feb', valid: 162, invalid: 12 },
      { label: 'Mar', valid: 189, invalid: 15 },
      { label: 'Apr', valid: 178, invalid: 9 },
      { label: 'May', valid: 195, invalid: 11 },
      { label: 'Jun', valid: 210, invalid: 7 },
    ],
    []
  );

  const weekly = useMemo(
    () => [
      { label: 'Mar 26', value: 46 },
      { label: 'Mar 27', value: 52 },
      { label: 'Mar 28', value: 49 },
      { label: 'Mar 29', value: 61 },
      { label: 'Mar 30', value: 56 },
      { label: 'Mar 31', value: 69 },
      { label: 'Apr 01', value: 74 },
    ],
    []
  );

  const recent = useMemo(
    () => [
      { id: 'INV-2024-001', customer: 'ABC Traders', amount: 125000, status: 'Valid' },
      { id: 'INV-2024-002', customer: 'XYZ Corporation', amount: 89500, status: 'Valid' },
      { id: 'INV-2024-003', customer: 'DEF Industries', amount: 245000, status: 'Invalid' },
      { id: 'INV-2024-004', customer: 'GHI Enterprises', amount: 156000, status: 'Valid' },
      { id: 'INV-2024-005', customer: 'JKL Suppliers', amount: 92300, status: 'Valid' },
    ],
    []
  );

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <div className="pageTitle">Dashboard</div>
          <div className="pageSubtitle">Overview of your FBR e-invoicing activities</div>
        </div>
      </div>

      <div className="grid4">
        <StatCard
          title="Total Invoices"
          value={stats.totalInvoices.toLocaleString()}
          subText="+12.5% from last month"
          variant="neutral"
        />
        <StatCard
          title="Valid Invoices"
          value={stats.validInvoices.toLocaleString()}
          subText="94.8% validation rate"
          variant="good"
        />
        <StatCard
          title="Invalid Invoices"
          value={stats.invalidInvoices.toLocaleString()}
          subText="5.2% rejection rate"
          variant="bad"
        />
        <StatCard
          title="Total Tax Collected"
          value={`PKR ${(stats.totalTax / 1000).toFixed(1)}K`}
          subText="This month"
          variant="neutral"
        />
      </div>

      <div className="grid2">
        <div className="card">
          <div className="cardHeader">
            <div className="cardTitle">Monthly Validation Status</div>
          </div>
          <RealBarChart bars={monthly} />
        </div>
        <div className="card">
          <div className="cardHeader">
            <div className="cardTitle">Weekly Invoice Trend</div>
          </div>
          <RealLineChart points={weekly} />
        </div>
      </div>

      {/* Admin-only section */}
      {userIsAdmin && (
        <div className="card">
          <div className="cardHeader">
            <div className="cardTitle">Admin Management</div>
          </div>
          <div className="form">
            <div className="formRow">
              <div className="field">
                <div className="label">Admin Actions</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button type="button" className="primaryBtn">
                    Create Company
                  </button>
                  <button type="button" className="primaryBtn">
                    Manage Users
                  </button>
                  <button type="button" className="ghostBtn">
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client-only message */}
      {!userIsAdmin && (
        <div className="card">
          <div className="cardHeader">
            <div className="cardTitle">User Access</div>
          </div>
          <div className="emptyState">
            <div className="emptyTitle">Limited Access</div>
            <div className="muted">You do not have access to admin management features.</div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="cardHeader">
          <div className="cardTitle">Recent Invoices</div>
        </div>
        <RecentInvoices rows={recent} />
      </div>
    </div>
  );
}
