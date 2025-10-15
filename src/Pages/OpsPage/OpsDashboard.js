// src/pages/HomePage/Ops/OpsDashboard.js
import React from 'react';
import { LogOut, Database, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

const OpsDashboard = ({ navigate }) => {
    // Mock user data
    const user = { name: 'Ramesh', role: 'operations' };
    const logout = () => {
        navigate('landing'); // Redirect to landing page
    };

    // Mock data for sync operations
    const syncJobs = [
        { id: 1, source: 'AWS S3 - Finance', status: 'completed', progress: 100, files: 12, time: '2 mins ago' },
        { id: 2, source: 'Google Cloud - Reports', status: 'in-progress', progress: 67, files: 8, time: 'Running' },
        { id: 3, source: 'Azure Blob - Analytics', status: 'pending', progress: 0, files: 15, time: 'Scheduled' },
        { id: 4, source: 'Local Storage - Archive', status: 'failed', progress: 45, files: 5, time: '10 mins ago' },
    ];

    const getStatusIcon = (status) => {
        const base = { width: 20, height: 20 };
        switch (status) {
            case 'completed':
                return <CheckCircle style={{ ...base, color: '#38D200' }} />;
            case 'in-progress':
                return <RefreshCw style={{ ...base, color: '#0473EA' }} className="spin" />;
            case 'failed':
                return <XCircle style={{ ...base, color: '#dc2626' }} />;
            default:
                return <Clock style={{ ...base, color: '#6b7280' }} />;
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            base: {
                padding: '3px 10px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'capitalize',
            },
            completed: { background: '#38D200', color: '#fff' }, // green background, white text
            'in-progress': { background: '#0473EA', color: '#fff' }, // blue
            failed: { background: '#dc2626', color: '#fff' }, // red with white text
            pending: { background: '#9ca3af', color: '#fff' }, // gray
        };
        return <span style={{ ...styles.base, ...(styles[status] || styles.pending) }}>{status}</span>;
    };


    const button = {
        base: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
        },
        primary: {
            border: 'none',
            background: '#0473EA',
            color: '#fff',
        },
    };

    const card = {
        container: {
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            background: '#fff',
        },
        header: { padding: 16, borderBottom: '1px solid #f3f4f6' },
        title: { margin: 0, fontSize: 18 },
        desc: { margin: '4px 0 0', color: '#6b7280', fontSize: 14 },
        content: { padding: 16 },
    };

    const progressBar = (value, status) => {
        const green = '#38D200'; // success part
        const blue = '#0473EA';  // remaining part

        return (
            <div style={{
                width: '100%',
                height: 8,
                borderRadius: 999,
                display: 'flex',
                overflow: 'hidden',
                background: blue, // fallback base color
            }}>
                {/* Green completed section */}
                <div
                    style={{
                        width: `${value}%`,
                        background: green,
                        transition: 'width 0.3s ease',
                    }}
                />
                {/* Blue remaining section automatically fills the rest */}
            </div>
        );
    };



    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
            {/* Header */}
            <header style={{ borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ margin: 0, color: '#0473EA' }}>RW Tool</h1>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Operations Panel</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{user?.name}</p>
                            <p style={{ margin: 0, fontSize: 12, color: '#6b7280', textTransform: 'capitalize' }}>{user?.role}</p>
                        </div>
                        <button style={button.base} onClick={logout}>
                            <LogOut style={{ width: 16, height: 16 }} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
                <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ margin: '0 0 4px', fontSize: 24 }}>Operations Dashboard</h2>
                        <p style={{ margin: 0, color: '#6b7280' }}>Monitor and manage data synchronization</p>
                    </div>
                    <button style={{ ...button.base, ...button.primary }}>
                        <RefreshCw style={{ width: 16, height: 16 }} />
                        Sync All
                    </button>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', marginBottom: 24 }}>
                    {[['Total Syncs Today', '48'], ['Active Jobs', '3'], ['Files Processed', '1,234'], ['Storage Used', '42 GB']].map(([label, value]) => (
                        <div key={label} style={card.container}>
                            <div style={card.header}>
                                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>{label}</p>
                                <h3 style={{ margin: '6px 0 0', fontSize: 28, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {value}
                                    {label === 'Active Jobs' ? <RefreshCw style={{ width: 18, height: 18, color: '#0473EA' }} /> : null}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Storage Connections */}
                <div style={{ ...card.container, marginBottom: 24 }}>
                    <div style={card.header}>
                        <h3 style={card.title}>Storage Connections</h3>
                        <p style={card.desc}>Connected remote storage sources</p>
                    </div>
                    <div style={card.content}>
                        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
                            {['AWS S3', 'Google Cloud Storage', 'Azure Blob Storage'].map((storage) => (
                                <div key={storage} style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <Database style={{ width: 28, height: 28, color: '#0473EA' }} />
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 600 }}>{storage}</p>
                                            <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Connected</p>
                                        </div>
                                    </div>
                                    <span style={{ padding: '3px 10px', borderRadius: 999, background: '#38D200', color: '#fff', fontSize: 12, fontWeight: 600 }}>Active</span>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sync Jobs */}
                <div style={card.container}>
                    <div style={card.header}>
                        <h3 style={card.title}>Recent Sync Operations</h3>
                        <p style={card.desc}>Monitor data transfer and synchronization status</p>
                    </div>
                    <div style={{ ...card.content, paddingTop: 8 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {syncJobs.map((job) => (
                                <div key={job.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            {getStatusIcon(job.status)}
                                            <div>
                                                <h4 style={{ margin: 0 }}>{job.source}</h4>
                                                <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>
                                                    {job.files} files • {job.time}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {job.status !== 'pending' && getStatusBadge(job.status)}
                                            {job.status === 'in-progress' && (
                                                <button style={button.base}>Cancel</button>
                                            )}
                                            {job.status === 'failed' && (
                                                <button style={button.base}>Retry</button>
                                            )}
                                            {job.status === 'pending' && (
                                                <button style={button.base}>Pending</button>
                                            )}
                                        </div>
                                    </div>
                                    {progressBar(job.progress, job.status)}

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <footer
                style={{
                    background: '#f9fafb',
                    textAlign: 'center',
                    padding: '12px 0',
                    borderTop: '1px solid #e5e7eb',
                    fontSize: 14,
                    color: '#6b7280',
                    position: 'relative',
                    bottom: 0,
                    width: '100%',
                }}> © 2025 RW Tool — All Rights Reserved. </footer>

            {/* css for spin animation  */}
            <style>
                {`.spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
            </style>
        </div>
    );
};

export default OpsDashboard;