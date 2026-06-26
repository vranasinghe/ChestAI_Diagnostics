import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard, Users, ClipboardCheck, FileText, Settings, CreditCard, UserCircle, HelpCircle, Search, Bell, LogOut, Star, Trash2, Eye, Edit2, Activity, X
} from 'lucide-react';
import { listReports, deleteReport } from '../api/reports';
import CreateReport from '../components/CreateReport';
import ReportDistribution from '../components/ReportDistribution';
import { getDraftImages } from '../utils/draftStorage';
import './Dashboard.css';

export default function MedicalReports() {
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState('list');
    const [selectedReport, setSelectedReport] = useState(null);
    const [distributionImages, setDistributionImages] = useState({ normalImage: null, heatmapImage: null });
    const [viewingFinalizedReport, setViewingFinalizedReport] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const doctorData = localStorage.getItem('doctor');
        if (!token || !doctorData) { navigate('/login'); return; }
        setDoctor(JSON.parse(doctorData));
        loadReports();
    }, [navigate]);

    const loadReports = async () => {
        setLoading(true);
        try {
            const data = await listReports();
            setReports(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reportId) => {
        if (!window.confirm('Delete this report? This cannot be undone.')) return;
        try {
            await deleteReport(reportId);
            setReports(prev => prev.filter(r => r.report_id !== reportId));
        } catch (err) {
            alert('Failed to delete report.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('doctor');
        navigate('/login');
    };

    // ── Finalized report action handlers ──
    const openDistribution = (report) => {
        // Set view immediately so the user isn't stuck waiting for IndexedDB
        setSelectedReport(report);
        setView('report-distribution');
        
        // Fetch images in background
        getDraftImages(report.report_id)
            .then(images => {
                setDistributionImages({
                    normalImage: images?.normalImage || images?.normal_image || null,
                    heatmapImage: images?.heatmapImage || images?.heatmap_base64 || null,
                });
            })
            .catch(err => {
                console.error("Failed to load images from draft storage:", err);
            });
    };

    const closeDistribution = () => {
        setView('list');
        setSelectedReport(null);
        setDistributionImages({ normalImage: null, heatmapImage: null });
    };

    const filtered = reports.filter(r => {
        if (!searchQuery) return true;
        return r.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const drafts = filtered.filter(r => r.status === 'Draft');
    const finalized = filtered.filter(r => r.status === 'Finalized');

    if (!doctor) return null;

    const cardStyle = {
        background: '#fff',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        position: 'relative',
        overflow: 'hidden'
    };

    const btnStyle = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#475569',
        fontSize: '0.85rem',
        fontWeight: 500,
        padding: '4px 0'
    };

    const renderDraftCard = (report) => (
        <div key={report.report_id} style={cardStyle}>
            <div style={{ position: 'absolute', right: 8, bottom: 8, opacity: 0.06 }}>
                <Activity size={80} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f0fdfa', border: '1px solid #99f6e4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={18} color="#14b8a6" />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>Report #{report.report_id}</span>
                        <Star size={14} color="#f59e0b" fill="#f59e0b" />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>{report.created_date}</div>
                </div>
            </div>
            <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Patient</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>{report.patient_name}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Diagnosis</div>
                <div style={{ fontSize: '0.85rem', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{report.diagnosis || 'Not specified'}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <button style={btnStyle} onClick={() => { setSelectedReport(report); setView('review-report'); }}>
                    <Eye size={14} color="#14b8a6" /> Review Report
                </button>
                <button style={btnStyle} onClick={() => { setSelectedReport(report); setView('edit-report'); }}>
                    <Edit2 size={14} color="#3b82f6" /> Edit Draft Details
                </button>
                <button style={{ ...btnStyle, color: '#ef4444' }} onClick={() => handleDelete(report.report_id)}>
                    <Trash2 size={14} /> Delete Report
                </button>
            </div>
        </div>
    );

    const renderFinalizedCard = (report) => (
        <div key={report.report_id} style={cardStyle}>
            <div style={{ position: 'absolute', right: 8, bottom: 8, opacity: 0.06 }}>
                <Activity size={80} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f0fdfa', border: '1px solid #99f6e4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={18} color="#14b8a6" />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>Report #{report.report_id}</span>
                        <Star size={14} color="#f59e0b" fill="#f59e0b" />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>{report.created_date}</div>
                </div>
            </div>
            <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Patient</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>{report.patient_name}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>Diagnosis</div>
                <div style={{ fontSize: '0.85rem', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{report.diagnosis || 'Not specified'}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                {/* Review Report: shows read-only modal */}
                <button style={btnStyle} onClick={() => setViewingFinalizedReport(report)}>
                    <Eye size={14} color="#14b8a6" /> Review Report
                </button>

                <button style={{ ...btnStyle, color: '#ef4444' }} onClick={() => handleDelete(report.report_id)}>
                    <Trash2 size={14} /> Delete Report
                </button>
            </div>
        </div>
    );

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-logo">
                    <div className="logo-container">
                        <div className="logo-text">Wedakam</div>
                        <div className="logo-icon"></div>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <p className="sidebar-section-label">MENU</p>
                    <a href="/dashboard" className="sidebar-link" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
                        <span className="sidebar-icon"><LayoutDashboard size={18} /></span> Dashboard
                    </a>
                    <a href="/patients" className="sidebar-link" onClick={(e) => { e.preventDefault(); navigate('/patients'); }}>
                        <span className="sidebar-icon"><Users size={18} /></span> Manage Patients
                    </a>
                    <a href="/reports" className="sidebar-link active">
                        <span className="sidebar-icon"><FileText size={18} /></span> Manage Reports
                    </a>
                    <a href="/review" className="sidebar-link" onClick={(e) => { e.preventDefault(); navigate('/review'); }}>
                        <span className="sidebar-icon"><ClipboardCheck size={18} /></span> Review
                    </a>
                    <p className="sidebar-section-label">OTHERS</p>
                    <a href="/account-settings" className="sidebar-link" onClick={(e) => { e.preventDefault(); navigate('/account-settings'); }}>
                        <span className="sidebar-icon"><Settings size={18} /></span> Settings
                    </a>
                    <a href="#" className="sidebar-link"><span className="sidebar-icon"><CreditCard size={18} /></span> Payment</a>
                    <a href="#" className="sidebar-link"><span className="sidebar-icon"><UserCircle size={18} /></span> Accounts</a>
                    <a href="#" className="sidebar-link"><span className="sidebar-icon"><HelpCircle size={18} /></span> Help</a>
                </nav>
            </aside>

            <div className="dashboard-main">
                <header className="dashboard-topbar">
                    <div className="dashboard-search-container">
                        <Search className="search-icon-placeholder" size={18} />
                        <input type="text" className="dashboard-search" placeholder="Search reports or patients..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="dashboard-user-info">
                        <button className="notification-btn"><Bell size={20} /></button>
                        <div className="dashboard-avatar-container">
                            <span className="dashboard-greeting">Logged in as Attending Physician</span>
                            <Link to="/dashboard" className="dashboard-avatar" style={{ textDecoration: 'none' }}>{doctor.first_name.charAt(0)}{doctor.last_name?.charAt(0)}</Link>
                        </div>
                        <button className="dashboard-logout-btn" onClick={handleLogout}><LogOut size={16} /></button>
                    </div>
                </header>

                <main className="dashboard-content" style={{ padding: '24px 40px 40px' }}>
                    {/* Page header — always visible */}
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '0 0 6px' }}>Medical Reports</h1>
                        <p style={{ color: '#64748b', margin: 0 }}>Manage, draft, and share clinical patient reports.</p>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading reports...</div>
                    ) : (
                        <>
                            {/* ── LIST VIEW ── */}
                            {view === 'list' && (
                                <>
                                    {drafts.length > 0 && (
                                        <div style={{ marginBottom: '40px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Active Drafts</h2>
                                                <Star size={16} color="#f59e0b" fill="#f59e0b" />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                                                {drafts.map(r => renderDraftCard(r))}
                                            </div>
                                        </div>
                                    )}

                                    {finalized.length > 0 && (
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Finalized Reports</h2>
                                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#14b8a6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>{finalized.length}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                                                {finalized.map(r => renderFinalizedCard(r))}
                                            </div>
                                        </div>
                                    )}

                                    {reports.length === 0 && (
                                        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
                                            <FileText size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
                                            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No reports yet.</p>
                                            <p style={{ fontSize: '0.9rem' }}>Create a report from a patient's X-ray analysis.</p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* ── DRAFT REVIEW (read-only) / EDIT VIEW ── */}
                            {(view === 'edit-report' || view === 'review-report') && selectedReport && (
                                <CreateReport
                                    initialReport={selectedReport}
                                    doctor={doctor}
                                    readOnly={view === 'review-report'}
                                    onBack={() => { setView('list'); setSelectedReport(null); }}
                                    onSaveDraft={() => { setView('list'); setSelectedReport(null); loadReports(); }}
                                    onFinalize={() => { setView('list'); setSelectedReport(null); loadReports(); }}
                                />
                            )}

                            {/* ── FINALIZED: DISTRIBUTION VIEW ── */}
                            {view === 'report-distribution' && selectedReport && (
                                <ReportDistribution
                                    report={selectedReport}
                                    patient={{ email: '' }}
                                    heatmapImage={distributionImages.heatmapImage}
                                    normalImage={distributionImages.normalImage}
                                    onBack={closeDistribution}
                                />
                            )}
                            
                            {/* ── FINALIZED: REVIEW MODAL ── */}
                            {viewingFinalizedReport && (
                                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
                                    <div style={{ background: '#fff', width: '100%', maxWidth: '700px', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                                        {/* Modal Header */}
                                        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                                            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Finalized Report Details</h2>
                                            <button onClick={() => setViewingFinalizedReport(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                                <X size={24} />
                                            </button>
                                        </div>
                                        
                                        {/* Printable Area */}
                                        <div id="print-area" style={{ padding: '32px', overflowY: 'auto' }}>
                                            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#14b8a6', margin: '0 0 8px 0' }}>Wedakam Health AI</h1>
                                                <p style={{ fontSize: '1rem', color: '#64748b', margin: 0 }}>Clinical X-Ray Medical Report</p>
                                            </div>
                                            
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px', background: '#f1f5f9', padding: '20px', borderRadius: '12px' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>Patient Name</div>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{viewingFinalizedReport.patient_name}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>Date Generated</div>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{viewingFinalizedReport.created_date}</div>
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '32px' }}>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>Diagnostic Breakdown</h3>
                                                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Primary AI Findings:</div>
                                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#14b8a6', marginBottom: '16px' }}>
                                                    {viewingFinalizedReport.diagnosis || 'Not specified'}
                                                </div>
                                                
                                                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Treatment Plan:</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 500, color: '#334155' }}>
                                                    {viewingFinalizedReport.treatment_plan || 'N/A'}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>Clinical Observations (Doctor's Note)</h3>
                                                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '16px', borderRadius: '8px', fontSize: '1rem', color: '#334155', minHeight: '100px', whiteSpace: 'pre-wrap' }}>
                                                    {viewingFinalizedReport.clinical_observations || 'No additional notes provided by the reviewing physician.'}
                                                </div>
                                                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <div style={{ borderBottom: '1px solid #1e293b', width: '200px', marginBottom: '8px' }}></div>
                                                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Physician Signature</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Modal Footer Actions */}
                                        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'flex-end', gap: '16px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                                            <button onClick={() => setViewingFinalizedReport(null)} style={{ padding: '10px 24px', background: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}>
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
