

import React, { useState, Fragment } from 'react';
import {
    LogOut,
    RefreshCw,
    Database,
    AlertCircle,
    FileText,
    Shield,
    Calendar,
} from 'lucide-react';
import './OpsDashboard.css';

/**
 * OpsDashboard (refactored)
 * - Same functionality & data
 * - Much smaller via small reusable UI primitives and shared style map
 */

const S = {
    card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 },
    pad: { padding: 20 },
    row: (jc = 'space-between', ai = 'center', gap = 12) => ({ display: 'flex', justifyContent: jc, alignItems: ai, gap }),
    btn: ({ primary } = {}) => ({
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8,
        border: primary ? 'none' : '1px solid #e5e7eb', background: primary ? '#0473EA' : '#fff',
        color: primary ? '#fff' : '#333', cursor: 'pointer', fontWeight: 600, fontSize: 14,
    }),
    tinyBtn: (danger = false) => ({
        padding: '6px 14px', borderRadius: 6, border: danger ? '1px solid #dc2626' : '1px solid #e5e7eb',
        background: '#fff', color: danger ? '#dc2626' : '#333', cursor: 'pointer', fontSize: 13, fontWeight: 600,
    }),
    badge: {
        base: { padding: '6px 14px', borderRadius: 16, fontSize: 12, fontWeight: 500, border: '1px solid' },
        completed: { background: '#d1fae5', color: '#065f46', borderColor: '#a7f3d0' },
        'in-progress': { background: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' },
        failed: { background: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' },
        pending: { background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' },
        validating: { background: '#e0e7ff', color: '#3730a3', borderColor: '#c7d2fe' },
    },
};

const Badge = ({ status }) => (
    <span style={{ ...S.badge.base, ...(S.badge[status] || S.badge.pending) }}>{status}</span>
);

const Pill = ({ ok, children }) => (
    <span
        style={{
            padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
            background: ok ? '#d1fae5' : '#fef3c7', color: ok ? '#065f46' : '#92400e',
        }}
    >{children}</span>
);

const ProgressBar = ({ value, status }) => (
    <div className="progress-bar-bg">
        <div
            className="progress-bar-fill"
            style={{
                width: `${value}%`,
                background: status === 'failed' ? '#dc2626' : status === 'in-progress' ? '#0473EA' : '#10b981',
            }}
        />
    </div>
);

const Head = ({ title, subtitle }) => (
    <div style={{ ...S.pad, borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>{title}</h3>
        {subtitle && <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>{subtitle}</p>}
    </div>
);

const StatCard = ({ label, value, icon }) => (
    <div style={{ ...S.card, padding: 20 }}>
        <div style={S.row('space-between', 'flex-start')}>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 13, fontWeight: 500 }}>{label}</p>
            {icon}
        </div>
        <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#111' }}>{value}</h3>
    </div>
);

const Tabs = ({ tabs, active, onChange }) => (
    <div style={{ marginBottom: 24, borderBottom: '2px solid #e5e7eb' }}>
        <div style={S.row('flex-start', 'center', 8)}>
            {tabs.map((t) => (
                <button
                    key={t.id}
                    onClick={() => onChange(t.id)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', border: 'none', background: 'transparent',
                        color: active === t.id ? '#0473EA' : '#6b7280', cursor: 'pointer', fontWeight: active === t.id ? 600 : 500, fontSize: 14,
                        borderBottom: active === t.id ? '3px solid #0473EA' : '3px solid transparent', marginBottom: '-2px', transition: 'all 0.2s',
                    }}
                >
                    {t.icon}
                    {t.label}
                </button>
            ))}
        </div>
    </div>
);

const OpsDashboard = ({ navigate }) => {
    const user = { name: 'Ramesh', role: 'operations' };
    const logout = () => navigate('landing');

    const [activeFilter, setActiveFilter] = useState('Today');
    const [selectedOrganization, setSelectedOrganization] = useState('All Organizations');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('monitoring');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const storageConnections = [
        { id: 1, name: 'AWS S3', organization: 'Finance Dept', status: 'active', lastSync: '2 mins ago', reports: 12 },
        { id: 2, name: 'Azure Blob', organization: 'Risk Management', status: 'active', lastSync: '5 mins ago', reports: 8 },
        { id: 3, name: 'Google Cloud', organization: 'Operations', status: 'syncing', lastSync: 'Running', reports: 15 },
    ];

    const pendingValidation = [
        { id: 1, name: 'Q4_Financial_Report.pdf', organization: 'Finance', source: 'AWS S3', size: '2.4 MB', uploaded: '10 Oct, 11:32', status: 'validating', format: 'PDF', integrity: 'Pass' },
        { id: 2, name: 'Risk_Assessment_2024.xlsx', organization: 'Risk', source: 'Azure Blob', size: '856 KB', uploaded: '10 Oct, 10:21', status: 'pending', format: 'Excel', integrity: 'Checking' },
        { id: 3, name: 'Operations_Summary.pdf', organization: 'Operations', source: 'Google Cloud', size: '1.8 MB', uploaded: '10 Oct, 10:02', status: 'validating', format: 'PDF', integrity: 'Pass' },
    ];

    const syncJobs = [
        { id: 1, source: 'AWS S3', organization: 'Finance', status: 'completed', progress: 100, files: 12, time: '2 mins ago' },
        { id: 2, source: 'Google Cloud', organization: 'Operations', status: 'in-progress', progress: 67, files: 8, time: 'Running' },
        { id: 3, source: 'Azure Blob', organization: 'Risk', status: 'pending', progress: 0, files: 15, time: 'Scheduled' },
        { id: 4, source: 'Local Storage', organization: 'Archive', status: 'failed', progress: 45, files: 5, time: '10 mins ago' },
    ];

    const publishedReports = [
        { id: 1, name: 'Q4_Financial_Report.pdf', organization: 'Finance', publishedAt: '10 Oct, 11:32', subscribers: 45, notifications: 'Sent', downloads: 38 },
        { id: 2, name: 'Risk_Assessment_2024.xlsx', organization: 'Risk', publishedAt: '10 Oct, 10:21', subscribers: 32, notifications: 'Sent', downloads: 28 },
        { id: 3, name: 'Operations_Summary.pdf', organization: 'Operations', publishedAt: '10 Oct, 10:02', subscribers: 28, notifications: 'Pending', downloads: 0 },
    ];

    const failedOperations = syncJobs.filter((j) => j.status === 'failed');

    const tabs = [
        { id: 'monitoring', label: 'Remote Monitoring', icon: <Database style={{ width: 16, height: 16 }} /> },
        { id: 'sync', label: 'Sync Operations', icon: <RefreshCw style={{ width: 16, height: 16 }} /> },
        { id: 'validation', label: 'Validation Queue', icon: <Shield style={{ width: 16, height: 16 }} /> },
        { id: 'published', label: 'Published Reports', icon: <FileText style={{ width: 16, height: 16 }} /> },
    ];

    return (
        <div className="dash">
            {/* Sidebar */}
            <div className={`side ${sidebarOpen ? 'open' : ''}`}>
                <div className="side-head">
                    <span className="logo-icon"></span>
                    <div>
                        <h2>RW Tool</h2>
                        <p>Operations Panel</p>
                    </div>
                </div>
                <div className="side-nav">
                    <p className="nav-label">Operations</p>
                    {tabs.map((t) => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)} className={`nav-btn ${activeTab === t.id ? 'active' : ''}`}>
                            <span>{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main */}
            <div className="main">
                <div className="top">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="menu">☰</button>
                    <div className="actions">
                        <button onClick={() => navigate('landing')} className="logout-btn">
                            <LogOut style={{ width: 16, height: 16 }} /> Logout
                        </button>
                    </div>
                </div>

                <div className="content">
                    {/* Header */}
                    <div style={{ marginBottom: 24, ...S.row('space-between', 'flex-start') }}>
                        <div>
                            <h2 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, color: '#111' }}>Operations Dashboard</h2>
                            <p style={{ margin: 0, color: '#6b7280', fontSize: 15 }}>Data bridge between remote storage and RW Tool system</p>
                        </div>
                        <div style={S.row('flex-start')}>
                            <button style={S.btn()}> <Calendar style={{ width: 16, height: 16 }} /> Schedule Sync</button>
                            <button style={S.btn({ primary: true })}> <RefreshCw style={{ width: 16, height: 16 }} /> Sync All</button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 24 }}>
                        {[
                            { label: 'Active Connections', value: storageConnections.filter((s) => s.status === 'active').length, icon: <Database style={{ width: 20, height: 20, color: '#0473EA' }} /> },
                            { label: 'Pending Validation', value: pendingValidation.length, icon: <Shield style={{ width: 20, height: 20, color: '#f59e0b' }} /> },
                            { label: 'Sync Jobs Today', value: '48', icon: <RefreshCw style={{ width: 20, height: 20, color: '#10b981' }} /> },
                            { label: 'Published Reports', value: publishedReports.length, icon: <FileText style={{ width: 20, height: 20, color: '#8b5cf6' }} /> },
                            { label: 'Failed Operations', value: failedOperations.length, icon: <AlertCircle style={{ width: 20, height: 20, color: '#dc2626' }} /> },
                        ].map((s) => (<StatCard key={s.label} {...s} />))}
                    </div>

                    {/* Tabs */}
                    <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

                    {/* Filters */}
                    <div style={{ marginBottom: 24, ...S.row('flex-start'), flexWrap: 'wrap' }}>
                        {['Today', 'Last 7 days', 'Last 30 days'].map((f) => (
                            <button key={f} onClick={() => setActiveFilter(f)}
                                style={{
                                    padding: '8px 16px', borderRadius: 8, border: activeFilter === f ? '2px solid #0473EA' : '1px solid #e5e7eb',
                                    background: activeFilter === f ? '#eff6ff' : '#fff', color: activeFilter === f ? '#0473EA' : '#6b7280', cursor: 'pointer', fontWeight: activeFilter === f ? 600 : 500, fontSize: 14
                                }}>
                                {f}
                            </button>
                        ))}
                        <select value={selectedOrganization} onChange={(e) => setSelectedOrganization(e.target.value)}
                            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#333', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                            <option>All Organizations</option>
                            <option>Finance</option>
                            <option>Risk Management</option>
                            <option>Operations</option>
                        </select>
                        <input type="text" placeholder="Search reports or sources..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', fontSize: 14, flex: 1, minWidth: 200 }} />
                    </div>

                    {/* Monitoring */}
                    {activeTab === 'monitoring' && (
                        <div style={S.card}>
                            <Head title="Remote Storage Connections" subtitle="Monitor connected storage sources and detect new reports" />
                            <div style={S.pad}>
                                {storageConnections.map((c) => (
                                    <div key={c.id} style={{ ...S.card, borderColor: '#e5e7eb', borderRadius: 10, padding: 16, marginBottom: 16, ...S.row() }}>
                                        <div style={S.row('flex-start')}>
                                            <div style={{ width: 48, height: 48, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Database style={{ width: 24, height: 24, color: '#0473EA' }} />
                                            </div>
                                            <div>
                                                <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600, color: '#111' }}>{c.name}</p>
                                                <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{c.organization} • {c.reports} reports • Last sync: {c.lastSync}</p>
                                            </div>
                                        </div>
                                        <div style={S.row()}>
                                            <Pill ok={c.status === 'active'}>{c.status === 'active' ? 'Active' : 'Syncing'}</Pill>
                                            <button style={S.tinyBtn()}>Check for Updates</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sync */}
                    {activeTab === 'sync' && (
                        <div>
                            {failedOperations.length > 0 && (
                                <div style={{ ...S.card, background: '#fef2f2', borderColor: '#fecaca', marginBottom: 24, ...S.pad }}>
                                    <div style={{ ...S.row(), marginBottom: 16 }}>
                                        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#991b1b' }}>{failedOperations.length} failed operation</p>
                                        <button style={S.tinyBtn(true)}>Retry all failed</button>
                                    </div>
                                    {failedOperations.map((op) => (
                                        <div key={op.id} style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: 8, padding: 16, ...S.row() }}>
                                            <div>
                                                <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#111' }}>{op.source} – {op.organization}</p>
                                                <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{op.files} files · {op.time}</p>
                                            </div>
                                            <div style={S.row()}>
                                                <Badge status="failed" />
                                                <button style={S.tinyBtn()}>Retry</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={S.card}>
                                <Head title="Sync Operations" subtitle="Fetch and transfer reports from remote storage" />
                                <div style={S.pad}>
                                    {syncJobs.map((j) => (
                                        <div key={j.id} style={{ marginBottom: 20 }}>
                                            <div style={{ ...S.row(), marginBottom: 8 }}>
                                                <div>
                                                    <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#111' }}>{j.source} – {j.organization}</p>
                                                    <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{j.files} files · {j.time}</p>
                                                </div>
                                                <div style={S.row()}>
                                                    <Badge status={j.status} />
                                                    {j.status === 'in-progress' && <button style={S.tinyBtn()}>Cancel</button>}
                                                    {j.status === 'failed' && <button style={S.tinyBtn()}>Retry</button>}
                                                </div>
                                            </div>
                                            {j.status !== 'pending' && <ProgressBar value={j.progress} status={j.status} />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Validation */}
                    {activeTab === 'validation' && (
                        <div style={S.card}>
                            <Head title="Validation Queue" subtitle="Validate file integrity, format, and metadata before publishing" />
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            {['Report Name', 'Organization', 'Source', 'Format', 'Integrity', 'Status', 'Actions'].map((h) => (
                                                <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingValidation.map((r) => (
                                            <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#111', fontWeight: 500 }}>{r.name}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{r.organization}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{r.source}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{r.format}</td>
                                                <td style={{ padding: '16px 20px' }}><Pill ok={r.integrity === 'Pass'}>{r.integrity}</Pill></td>
                                                <td style={{ padding: '16px 20px' }}><Badge status={r.status} /></td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={S.row('flex-start')}>
                                                        <button style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: '#0473EA', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Approve & Publish</button>
                                                        <button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Reject</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Published */}
                    {activeTab === 'published' && (
                        <div style={S.card}>
                            <Head title="Published Reports" subtitle="Reports available to subscribers with notification status" />
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            {['Report Name', 'Organization', 'Published At', 'Subscribers', 'Downloads', 'Notifications', 'Actions'].map((h) => (
                                                <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {publishedReports.map((r) => (
                                            <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#111', fontWeight: 500 }}>{r.name}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{r.organization}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{r.publishedAt}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{r.subscribers}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{r.downloads}</td>
                                                <td style={{ padding: '16px 20px' }}><Pill ok={r.notifications === 'Sent'}>{r.notifications}</Pill></td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <button style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: 'transparent', color: '#0473EA', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                                                        {r.notifications === 'Pending' ? 'Send Notifications' : 'View Details'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OpsDashboard;
