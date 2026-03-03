import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ChevronDown,
    Bell,
    CheckCircle2,
    AlertCircle,
    LogOut
} from 'lucide-react';
import './AccountSettings.css';

const AccountSettings = () => {
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'deactivate', etc.
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const doctorData = localStorage.getItem('doctor');

        if (!token || !doctorData) {
            navigate('/login');
            return;
        }
        setDoctor(JSON.parse(doctorData));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('doctor');
        navigate('/login');
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const confirmDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('access_token');

            const response = await fetch('http://localhost:8000/auth/delete_account', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('doctor');
                alert('Your account has been successfully deleted.');
                navigate('/login');
            } else {
                const data = await response.json();
                alert(data.detail || 'Failed to delete account. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('An error occurred while deleting your account. Please try again.');
        }
        setShowDeleteModal(false);
    };

    if (!doctor) return null;

    return (
        <div className="settings-page">
            {/* Header */}
            <header className="settings-header">
                <div className="logo-container">
                    <div className="logo-text">Wedakam</div>
                    <div className="logo-icon"></div>
                </div>

                <div className="header-user-actions">
                    <button className="notification-btn" style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                        <Bell size={20} />
                    </button>
                    <div className="settings-avatar">
                        {doctor.first_name.charAt(0)}
                    </div>
                    <button className="settings-logout-btn-header" onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            <div className="settings-layout">
                {/* Sidebar matching mockup */}
                <aside className="settings-sidebar">
                    <h2 className="settings-sidebar-title">Account Settings</h2>

                    <nav>
                        <div className={`sidebar-menu-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')} style={{ cursor: 'pointer' }}>Profile</div>

                        <div className="sidebar-menu-item active">
                            Settings <ChevronDown size={16} />
                        </div>
                        <div className="sidebar-submenu">
                            <div className={`submenu-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')} style={{ cursor: 'pointer' }}>Overview</div>
                            <div className={`submenu-item ${activeTab === 'signin' ? 'active' : ''}`} onClick={() => setActiveTab('signin')} style={{ cursor: 'pointer' }}>Sign in method</div>
                            <div className={`submenu-item ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')} style={{ cursor: 'pointer' }}>Basic Information</div>
                            <div className={`submenu-item ${activeTab === 'connected' ? 'active' : ''}`} onClick={() => setActiveTab('connected')} style={{ cursor: 'pointer' }}>Connected account</div>
                            <div className={`submenu-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')} style={{ cursor: 'pointer' }}>Notifications</div>
                            <div className={`submenu-item ${activeTab === 'deactivate' ? 'active' : ''}`} onClick={() => setActiveTab('deactivate')} style={{ cursor: 'pointer' }}>Deactivate account</div>
                        </div>

                        <div className={`sidebar-menu-item ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')} style={{ cursor: 'pointer' }}>Billing</div>
                        <div className={`sidebar-menu-item ${activeTab === 'referrals' ? 'active' : ''}`} onClick={() => setActiveTab('referrals')} style={{ cursor: 'pointer' }}>Referrals</div>
                        <div className={`sidebar-menu-item ${activeTab === 'invite' ? 'active' : ''}`} onClick={() => setActiveTab('invite')} style={{ cursor: 'pointer' }}>Invite a Friend</div>
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="settings-content-card">
                    {activeTab === 'basic' && (
                        <>
                            <h1 className="settings-content-title">Profile Information</h1>
                            <div className="profile-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                <div className="detail-field">
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>First Name</label>
                                    <div style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8f9fb' }}>{doctor.first_name}</div>
                                </div>
                                <div className="detail-field">
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Last Name</label>
                                    <div style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8f9fb' }}>{doctor.last_name}</div>
                                </div>
                                <div className="detail-field">
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Username</label>
                                    <div style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8f9fb' }}>{doctor.username}</div>
                                </div>
                                <div className="detail-field">
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Email Address</label>
                                    <div style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8f9fb' }}>{doctor.email}</div>
                                </div>
                                <div className="detail-field">
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Phone Number</label>
                                    <div style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8f9fb' }}>{doctor.phone_no}</div>
                                </div>
                                <div className="detail-field">
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Qualification</label>
                                    <div style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8f9fb' }}>{doctor.qualification}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                                <button style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                                <button style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#7c3aed', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Update Profile</button>
                            </div>
                        </>
                    )}

                    {activeTab === 'deactivate' && (
                        <>
                            <h1 className="settings-content-title">Account Ownership</h1>

                            <div className="warning-block">
                                <div className="warning-icon">
                                    <CheckCircle2 size={14} />
                                </div>
                                <div className="warning-content">
                                    <h4>Important</h4>
                                    <p>By deleting this account, you'll lost the personal data and access to the MI systems</p>
                                </div>
                            </div>

                            <div className="warning-block">
                                <div className="warning-icon">
                                    <CheckCircle2 size={14} />
                                </div>
                                <div className="warning-content">
                                    <h4>Important</h4>
                                    <p>
                                        Under the terms of the [General Data Protection Regulation (GDPR) / California Consumer Privacy Act (CCPA)],
                                        you are exercising my "Right to Erasure" (Right to be Forgotten).
                                        You are requesting that we permanently delete your account and erase all personal data associated with me from our systems, databases, and any third-party processors we use.
                                    </p>
                                    <p style={{ marginTop: '12px' }}>Here is the information to identify your account:</p>
                                    <ul className="settings-info-list" style={{ listStyle: 'none', paddingLeft: '0' }}>
                                        <li>• Email: {doctor.email}</li>
                                        <li>• Username: {doctor.username}</li>
                                    </ul>
                                    <p style={{ marginTop: '16px' }}>
                                        By clicking Delete Account, you are confirming within the statutory time limit of 30 days that my account and all associated data have been completely removed.
                                    </p>
                                </div>
                            </div>

                            <div className="settings-action-bar" style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '32px', borderTop: '1px solid #f1f5f9', marginTop: '32px' }}>
                                <button className="btn-delete-premium" onClick={handleDeleteAccount} style={{ backgroundColor: '#be0000', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' }}>
                                    Delete Account
                                </button>
                            </div>
                        </>
                    )}

                    {(activeTab !== 'basic' && activeTab !== 'deactivate') && (
                        <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b' }}>
                            <h1 className="settings-content-title" style={{ marginBottom: '16px' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                            <p>This section is under development.</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="modal-content" style={{ background: 'white', padding: '32px', borderRadius: '16px', maxWidth: '440px', width: '90%', textAlign: 'center' }}>
                        <div style={{ color: '#be0000', marginBottom: '24px' }}>
                            <AlertCircle size={48} style={{ margin: '0 auto' }} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>Confirm Account Deletion</h3>
                        <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.6', marginBottom: '8px' }}>Are you sure you want to delete your account?</p>
                        <p style={{ color: '#be0000', fontWeight: '600', fontSize: '0.95rem' }}>
                            This action cannot be undone. All your data will be permanently deleted.
                        </p>
                        <div className="modal-buttons" style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '700', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteAccount}
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#be0000', color: 'white', fontWeight: '700', cursor: 'pointer' }}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountSettings;
