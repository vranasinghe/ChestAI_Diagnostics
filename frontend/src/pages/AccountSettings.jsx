import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ChevronDown,
    Bell,
    AlertCircle,
    LogOut,
    User,
    Lock,
    Settings,
    Info,
    CreditCard,
    Users,
    UserMinus,
    CheckCircle2,
    Save,
    ArrowLeft,
    Phone,
    Mail,
    BadgeCheck,
    Copy,
    Check
} from 'lucide-react';
import './AccountSettings.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const AccountSettings = () => {
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [activeTab, setActiveTab] = useState('basic'); // default active tab
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isSettingsExpanded, setIsSettingsExpanded] = useState(true);

    // Form states
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_no: '',
        qualification: ''
    });

    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    // Notification states
    const [notifications, setNotifications] = useState({
        emailScans: true,
        weeklyDigest: false,
        systemAlerts: true
    });

    // Referral Copy State
    const [copied, setCopied] = useState(false);

    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const doctorData = localStorage.getItem('doctor');
        if (!doctorData) {
            navigate('/login');
            return;
        }
        const parsedDoctor = JSON.parse(doctorData);
        setDoctor(parsedDoctor);
        setFormData({
            first_name: parsedDoctor.first_name || '',
            last_name: parsedDoctor.last_name || '',
            phone_no: parsedDoctor.phone_no || '',
            qualification: parsedDoctor.qualification || ''
        });
    }, [navigate]);

    const clearMessage = () => setTimeout(() => setMessage({ text: '', type: '' }), 4000);

    const handleLogout = async () => {
        try {
            await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
        } catch (e) {
            console.error('Error logging out:', e);
        }
        localStorage.removeItem('doctor');
        navigate('/login');
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePasswordChange = (e) => {
        setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleToggleChange = (field) => {
        setNotifications(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleCopyReferral = () => {
        navigator.clipboard.writeText('WEDAKAM-DR-9021');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage({ text: '', type: '' });
        try {
            const res = await fetch(`${API_BASE}/auth/update-profile`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone_no: formData.phone_no,
                    qualification: formData.qualification
                })
            });
            if (res.ok) {
                const updated = await res.json();
                setDoctor(updated);
                localStorage.setItem('doctor', JSON.stringify(updated));
                setMessage({ text: 'Profile updated successfully!', type: 'success' });
            } else {
                const err = await res.json();
                setMessage({ text: err.detail || 'Failed to update profile.', type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
        } finally {
            setIsUpdating(false);
            clearMessage();
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword.length < 8) {
            setMessage({ text: 'Password must be at least 8 characters.', type: 'error' });
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ text: 'Passwords do not match.', type: 'error' });
            return;
        }
        setIsUpdating(true);
        setMessage({ text: '', type: '' });
        try {
            const res = await fetch(`${API_BASE}/auth/update-profile`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ password: passwordData.newPassword })
            });
            if (res.ok) {
                setMessage({ text: 'Password updated successfully!', type: 'success' });
                setPasswordData({ newPassword: '', confirmPassword: '' });
            } else {
                const err = await res.json();
                setMessage({ text: err.detail || 'Failed to update password.', type: 'error' });
            }
        } catch {
            setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
        } finally {
            setIsUpdating(false);
            clearMessage();
        }
    };

    const confirmDeleteAccount = async () => {
        try {
            const res = await fetch(`${API_BASE}/auth/delete_account`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            if (res.ok) {
                localStorage.removeItem('doctor');
                navigate('/login');
            } else {
                const data = await res.json();
                setMessage({ text: data.detail || 'Failed to delete account.', type: 'error' });
            }
        } catch {
            setMessage({ text: 'An error occurred while deleting your account.', type: 'error' });
        }
        setShowDeleteModal(false);
    };

    if (!doctor) return null;

    const initials = `${doctor.first_name?.charAt(0) || ''}${doctor.last_name?.charAt(0) || ''}`.toUpperCase();

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <>
                        <div className="as-panel-header">
                            <h1>Doctor Profile Overview</h1>
                            <p>Overview of your metrics and credentials on the Wedakam platform.</p>
                        </div>
                        <div className="as-profile-hero">
                            <div className="as-profile-avatar">{initials}</div>
                            <div className="as-profile-info">
                                <h2>Dr. {doctor.first_name} {doctor.last_name}</h2>
                                <p className="as-profile-email">
                                    <Mail size={14} /> {doctor.email}
                                </p>
                                <span className="as-qual-badge">
                                    <BadgeCheck size={13} style={{ marginRight: 4 }} /> {doctor.qualification || 'General Practitioner'}
                                </span>
                            </div>
                        </div>
                        <div className="as-form-body">
                            <div className="as-stat-grid">
                                <div className="as-stat-card">
                                    <div className="stat-value">256</div>
                                    <div className="stat-label">Scans Analyzed</div>
                                </div>
                                <div className="as-stat-card">
                                    <div className="stat-value">12</div>
                                    <div className="stat-label">Pending Reviews</div>
                                </div>
                                <div className="as-stat-card">
                                    <div className="stat-value">99.2%</div>
                                    <div className="stat-label">System Uptime</div>
                                </div>
                            </div>
                            <div className="as-info-block">
                                <div className="as-info-icon"><Info size={16} /></div>
                                <div className="as-info-content">
                                    <h4>Profile Credentials</h4>
                                    <p>Your qualifications have been verified. You hold full diagnostic review and reports signature permissions on Wedakam Chest AI.</p>
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 'overview':
                return (
                    <>
                        <div className="as-panel-header">
                            <h1>Account Overview</h1>
                            <p>Current system configuration status and active session metadata.</p>
                        </div>
                        <div className="as-form-body">
                            <div className="as-overview-grid">
                                <div className="as-overview-card">
                                    <div className="as-overview-card-title">Registration Date</div>
                                    <div className="as-overview-card-value">June 2026</div>
                                </div>
                                <div className="as-overview-card">
                                    <div className="as-overview-card-title">Status</div>
                                    <div className="as-overview-card-value teal">Active</div>
                                </div>
                                <div className="as-overview-card">
                                    <div className="as-overview-card-title">Role</div>
                                    <div className="as-overview-card-value">Radiologist / Clinician</div>
                                </div>
                                <div className="as-overview-card">
                                    <div className="as-overview-card-title">Audit Logging</div>
                                    <div className="as-overview-card-value teal">Active</div>
                                </div>
                            </div>
                            <div className="as-info-block">
                                <div className="as-info-icon"><CheckCircle2 size={16} /></div>
                                <div className="as-info-content">
                                    <h4>System Diagnostics Status</h4>
                                    <p>Your backend database connection is synced and audit logger is actively monitoring modifications.</p>
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 'signin':
                return (
                    <>
                        <div className="as-panel-header">
                            <h1>Sign in method</h1>
                            <p>Update your password to secure your Wedakam clinical dashboard.</p>
                        </div>
                        <form onSubmit={handleUpdatePassword}>
                            <div className="as-form-body">
                                {message.text && (
                                    <div className={`as-banner ${message.type}`}>
                                        {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                        {message.text}
                                    </div>
                                )}
                                <div className="as-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                                    <div className="as-field" style={{ maxWidth: '420px' }}>
                                        <label className="as-label">New Password</label>
                                        <input className="as-input" type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="Enter at least 8 characters" required minLength={8} />
                                    </div>
                                    <div className="as-field" style={{ maxWidth: '420px', marginTop: 10 }}>
                                        <label className="as-label">Confirm New Password</label>
                                        <input className="as-input" type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="Re-enter new password" required />
                                    </div>
                                </div>
                            </div>
                            <div className="as-footer">
                                <button type="submit" className="as-btn-primary" disabled={isUpdating}>
                                    <Lock size={14} /> {isUpdating ? 'Saving...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </>
                );

            case 'basic':
                return (
                    <>
                        <div className="as-panel-header">
                            <h1>Basic Information</h1>
                            <p>Manage your personal details and professional information.</p>
                        </div>
                        <div className="as-profile-hero">
                            <div className="as-profile-avatar">{initials}</div>
                            <div className="as-profile-info">
                                <h2>Dr. {doctor.first_name} {doctor.last_name}</h2>
                                <p className="as-profile-email">
                                    <Mail size={14} /> {doctor.email}
                                </p>
                                <span className="as-qual-badge">
                                    <BadgeCheck size={13} style={{ marginRight: 4 }} /> {doctor.qualification || 'MBBS / MBChB'}
                                </span>
                            </div>
                        </div>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="as-form-body">
                                {message.text && (
                                    <div className={`as-banner ${message.type}`}>
                                        {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                        {message.text}
                                    </div>
                                )}
                                <div className="as-form-grid">
                                    <div className="as-field">
                                        <label className="as-label">First Name</label>
                                        <input className="as-input" type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="First name" required />
                                    </div>
                                    <div className="as-field">
                                        <label className="as-label">Last Name</label>
                                        <input className="as-input" type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Last name" required />
                                    </div>
                                    <div className="as-field">
                                        <label className="as-label">Username <span className="as-readonly-badge">Read-only</span></label>
                                        <input className="as-input readonly" type="text" value={doctor.username} readOnly />
                                    </div>
                                    <div className="as-field">
                                        <label className="as-label">Email Address <span className="as-readonly-badge">Read-only</span></label>
                                        <input className="as-input readonly" type="text" value={doctor.email} readOnly />
                                    </div>
                                    <div className="as-field">
                                        <label className="as-label">Phone Number</label>
                                        <input className="as-input" type="text" name="phone_no" value={formData.phone_no} onChange={handleInputChange} placeholder="Enter phone number" />
                                    </div>
                                    <div className="as-field">
                                        <label className="as-label">Qualification</label>
                                        <select className="as-input" name="qualification" value={formData.qualification} onChange={handleInputChange}>
                                            <option value="" disabled>Select Qualification</option>
                                            <option value="MBBS/MBChB">MBBS / MBChB (Bachelor of Medicine)</option>
                                            <option value="MD">MD (Doctor of Medicine)</option>
                                            <option value="MD, Radiologist">MD, Radiologist</option>
                                            <option value="BMBS/BMed">BMBS / BMed</option>
                                            <option value="MRCP">MRCP (Member of Royal College of Physicians)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="as-footer">
                                <button type="button" className="as-btn-secondary" onClick={() => navigate('/dashboard')}>
                                    <ArrowLeft size={14} /> Dashboard
                                </button>
                                <button type="submit" className="as-btn-primary" disabled={isUpdating}>
                                    <Save size={14} /> {isUpdating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </>
                );

            case 'notifications':
                return (
                    <>
                        <div className="as-panel-header">
                            <h1>Notifications Settings</h1>
                            <p>Configure how and when you receive scan updates and reports alerts.</p>
                        </div>
                        <div className="as-form-body">
                            <div className="as-notif-row">
                                <div>
                                    <div className="as-notif-label">Email alerts on new scans</div>
                                    <div className="as-notif-desc">Receive immediate notifications when new chest X-rays are uploaded.</div>
                                </div>
                                <label className="as-toggle">
                                    <input type="checkbox" checked={notifications.emailScans} onChange={() => handleToggleChange('emailScans')} />
                                    <span className="as-toggle-slider"></span>
                                </label>
                            </div>
                            <div className="as-notif-row">
                                <div>
                                    <div className="as-notif-label">Weekly diagnostics digest</div>
                                    <div className="as-notif-desc">Weekly summary email featuring statistics, accuracy ratings, and reviews.</div>
                                </div>
                                <label className="as-toggle">
                                    <input type="checkbox" checked={notifications.weeklyDigest} onChange={() => handleToggleChange('weeklyDigest')} />
                                    <span className="as-toggle-slider"></span>
                                </label>
                            </div>
                            <div className="as-notif-row">
                                <div>
                                    <div className="as-notif-label">System maintenance alerts</div>
                                    <div className="as-notif-desc">Get notified about scheduled maintenance, server updates, or new ML models release.</div>
                                </div>
                                <label className="as-toggle">
                                    <input type="checkbox" checked={notifications.systemAlerts} onChange={() => handleToggleChange('systemAlerts')} />
                                    <span className="as-toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </>
                );

            case 'deactivate':
                return (
                    <>
                        <div className="as-panel-header">
                            <h1>Deactivate Account</h1>
                            <p>Initiate account deactivation or statutory data removal.</p>
                        </div>
                        <div className="as-form-body">
                            <div className="as-info-block">
                                <div className="as-info-icon"><Info size={16} /></div>
                                <div className="as-info-content">
                                    <h4>Important Reminder</h4>
                                    <p>By deactivating this account, you will permanently lose access to verification portfolios and generated health records.</p>
                                </div>
                            </div>
                            <div className="as-info-block danger">
                                <div className="as-info-icon"><AlertCircle size={16} /></div>
                                <div className="as-info-content">
                                    <h4>GDPR / CCPA Erasure Request</h4>
                                    <p>Under GDPR "Right to Erasure" policies, deactivating this account will wipe all patient details from logs and records database.</p>
                                    <ul style={{ marginTop: 10 }}>
                                        <li>Associated Email: {doctor.email}</li>
                                        <li>Associated Username: {doctor.username}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="as-footer">
                            <button type="button" className="as-btn-danger" onClick={() => setShowDeleteModal(true)}>
                                <UserMinus size={14} /> Delete Account Permanently
                            </button>
                        </div>
                    </>
                );

            case 'billing':
                return (
                    <>
                        <div className="as-panel-header">
                            <h1>Billing & Plan</h1>
                            <p>Overview of your current subscription tier and transaction features.</p>
                        </div>
                        <div className="as-form-body">
                            <div className="as-billing-plan">
                                <div className="as-billing-plan-name">Premium Clinician Tier</div>
                                <div className="as-billing-plan-desc">Full diagnostics suite & unlimited PyTorch predictions</div>
                                <div className="as-billing-plan-price">$49.00<span className="as-billing-plan-period"> / month</span></div>
                            </div>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '20px 0 10px', color: '#0f172a' }}>Plan Features Included:</h3>
                            <div className="as-billing-feature">
                                <CheckCircle2 size={16} className="as-billing-check" />
                                <span>Unlimited chest scans upload and real-time Grad-CAM heatmap visualization</span>
                            </div>
                            <div className="as-billing-feature">
                                <CheckCircle2 size={16} className="as-billing-check" />
                                <span>Automated clinician reports generation in standard PDF formats</span>
                            </div>
                        </div>
                    </>
                );

            case 'referrals':
                return (
                    <>
                        <div className="as-panel-header">
                            <h1>Refer a Colleague</h1>
                            <p>Invite other healthcare providers to Wedakam and expand the network.</p>
                        </div>
                        <div className="as-form-body">
                            <div className="as-referral-box">
                                <h3>Share Your Referral Code</h3>
                                <p>Invite colleagues to register. Both of you receive one month of free access to premium diagnostics model suites.</p>
                                <div className="as-referral-code-row">
                                    <div className="as-referral-code">WEDAKAM-DR-9021</div>
                                    <button className="as-copy-btn" onClick={handleCopyReferral}>
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                    </button>
                                </div>
                                {copied && <span style={{ fontSize: '0.75rem', color: '#14b8a6', fontWeight: 600 }}>Copied to clipboard!</span>}
                            </div>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '20px 0 10px', color: '#0f172a' }}>Referred Colleagues</h3>
                            <div className="as-referred-row">
                                <div>
                                    <div className="as-referred-name">Dr. Sarah Alwis</div>
                                    <div className="as-referred-date">Invited June 12, 2026</div>
                                </div>
                                <span className="as-referred-status">Registered</span>
                            </div>
                            <div className="as-referred-row">
                                <div>
                                    <div className="as-referred-name">Dr. K. Perera</div>
                                    <div className="as-referred-date">Invited June 20, 2026</div>
                                </div>
                                <span className="as-referred-status">Registered</span>
                            </div>
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="settings-page">
            {/* Header */}
            <header className="settings-header">
                <div className="sh-logo">
                    Wedakam <span className="sh-logo-dot"></span>
                </div>
                <div className="sh-right">
                    <button className="sh-icon-btn">
                        <Bell size={18} />
                    </button>
                    <Link to="/dashboard" className="sh-avatar">{doctor.first_name?.charAt(0)}</Link>
                    <button className="sh-logout-btn" onClick={handleLogout}>
                        <LogOut size={16} />
                    </button>
                </div>
            </header>

            {/* Layout Grid */}
            <div className="settings-layout">
                {/* Sidebar matches exact Image 3 specifications */}
                <aside className="as-sidebar">
                    <div className="as-sidebar-label">Account Settings</div>

                    {/* Profile Link */}
                    <div 
                        className={`as-nav-row ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <div className="as-nav-icon">
                            <User size={16} />
                        </div>
                        <span className="as-nav-text">Profile</span>
                    </div>

                    {/* Settings Group */}
                    <div 
                        className={`as-nav-row ${['overview', 'signin', 'basic', 'notifications', 'deactivate'].includes(activeTab) ? 'active' : ''}`}
                        onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
                    >
                        <div className="as-nav-icon">
                            <Settings size={16} />
                        </div>
                        <span className="as-nav-text">Settings</span>
                        <ChevronDown size={14} className={`as-nav-chevron ${isSettingsExpanded ? 'open' : ''}`} />
                    </div>

                    {/* Expandable Submenu */}
                    {isSettingsExpanded && (
                        <div className="as-submenu">
                            <div 
                                className={`as-sub-item ${activeTab === 'overview' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </div>
                            <div 
                                className={`as-sub-item ${activeTab === 'signin' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('signin')}
                            >
                                Sign In Method
                            </div>
                            <div 
                                className={`as-sub-item ${activeTab === 'basic' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('basic')}
                            >
                                Basic Information
                            </div>
                            <div 
                                className={`as-sub-item ${activeTab === 'notifications' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('notifications')}
                            >
                                Notifications
                            </div>
                            <div 
                                className={`as-sub-item ${activeTab === 'deactivate' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('deactivate')}
                            >
                                Deactivate Account
                            </div>
                        </div>
                    )}

                    {/* Billing */}
                    <div 
                        className={`as-nav-row ${activeTab === 'billing' ? 'active' : ''}`}
                        onClick={() => setActiveTab('billing')}
                    >
                        <div className="as-nav-icon">
                            <CreditCard size={16} />
                        </div>
                        <span className="as-nav-text">Billing</span>
                    </div>

                    {/* Referrals */}
                    <div 
                        className={`as-nav-row ${activeTab === 'referrals' ? 'active' : ''}`}
                        onClick={() => setActiveTab('referrals')}
                    >
                        <div className="as-nav-icon">
                            <Users size={16} />
                        </div>
                        <span className="as-nav-text">Referrals</span>
                    </div>
                </aside>

                {/* Main Content card */}
                <main className="as-panel">
                    {renderContent()}
                </main>
            </div>

            {/* Confirmation Modal */}
            {showDeleteModal && (
                <div className="as-modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="as-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="as-modal-icon">
                            <AlertCircle size={28} />
                        </div>
                        <h3>Confirm Account Deletion</h3>
                        <p>Are you sure you want to permanently erase your profile and records from Wedakam databases? <strong>This action is irreversible.</strong></p>
                        <div className="as-modal-btns">
                            <button className="as-btn-secondary" style={{ flex: 1 }} onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="as-btn-danger" style={{ flex: 1 }} onClick={confirmDeleteAccount}>Confirm Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountSettings;
