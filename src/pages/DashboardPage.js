import React, { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  const stats = useMemo(
    () => ({
      totalInvoices: 1248,
      validInvoices: 1183,
      invalidInvoices: 65,
      apiStatus: 'Connected',
      lastSync: '2 minutes ago',
    }),
    []
  );

  const dailyBars = useMemo(
    () => [
      { label: 'Mar 26', valid: 45, invalid: 0 },
      { label: 'Mar 27', valid: 52, invalid: 0 },
      { label: 'Mar 28', valid: 0, invalid: 48 },
      { label: 'Mar 29', valid: 61, invalid: 0 },
      { label: 'Mar 30', valid: 0, invalid: 55 },
      { label: 'Mar 31', valid: 68, invalid: 0 },
      { label: 'Apr 01', valid: 75, invalid: 0 },
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
          subText="5.2% require attention"
          variant="bad"
        />
        <div className="card statCard">
          <div className="statTop">
            <div className="statTitle">FBR API Status</div>
            <div className="statBadge good">⟐</div>
          </div>
          <div className="apiStatus">
            <span className="pill pillOk">{stats.apiStatus}</span>
          </div>
          <div className="statSub">
            <span className="muted">Last sync: {stats.lastSync}</span>
          </div>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="cardHeader">
            <div className="cardTitle">Daily Invoice Processing</div>
          </div>
          <RealBarChart bars={dailyBars} />
        </div>
        <div className="card">
          <div className="cardHeader">
            <div className="cardTitle">Weekly Trend</div>
          </div>
          <RealLineChart points={weekly} />
        </div>
      </div>

      <div className="grid1">
        <RecentInvoices rows={recent} />
      </div>
    </div>
  );
}
