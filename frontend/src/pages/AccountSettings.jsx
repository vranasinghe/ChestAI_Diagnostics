import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ClipboardCheck,
    Settings,
    CreditCard,
    UserCircle,
    HelpCircle,
    Search,
    Bell,
    LogOut
} from 'lucide-react';
import './Dashboard.css'; // Use dashboard styles for sidebar/topbar
import './AccountSettings.css';

const AccountSettings = () => {
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);

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

    const handleSettingsClick = () => {
        navigate('/account-settings');
    };

    const handleAccountOwnershipClick = () => {
        navigate('/account-ownership');
    };

    if (!doctor) return null;

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-logo">
                    <div className="logo-container">
                        <div className="logo-text">Wedakam</div>
                        <div className="logo-icon"></div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <p className="sidebar-section-label">MENU</p>
                    <a href="/dashboard" className="sidebar-link">
                        <span className="sidebar-icon"><LayoutDashboard size={18} /></span> Dashboard
                    </a>
                    <a href="#" className="sidebar-link">
                        <span className="sidebar-icon"><Users size={18} /></span> Manage Patients
                    </a>
                    <a href="#" className="sidebar-link">
                        <span className="sidebar-icon"><ClipboardCheck size={18} /></span> Review
                    </a>

                    <p className="sidebar-section-label">OTHERS</p>
                    <a href="/account-settings" className="sidebar-link active">
                        <span className="sidebar-icon"><Settings size={18} /></span> Settings
                    </a>
                    <a href="#" className="sidebar-link">
                        <span className="sidebar-icon"><CreditCard size={18} /></span> Payment
                    </a>
                    <a href="#" className="sidebar-link">
                        <span className="sidebar-icon"><UserCircle size={18} /></span> Accounts
                    </a>
                    <a href="#" className="sidebar-link">
                        <span className="sidebar-icon"><HelpCircle size={18} /></span> Help
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="dashboard-main">
                {/* Topbar */}
                <header className="dashboard-topbar">
                    <div className="dashboard-search-container">
                        <Search className="search-icon-placeholder" size={18} />
                        <input type="text" className="dashboard-search" placeholder="Search" />
                    </div>

                    <div className="dashboard-user-info">
                        <button className="notification-btn">
                            <Bell size={20} />
                        </button>
                        <div className="dashboard-avatar-container">
                            <span className="dashboard-greeting">Hello, Dr. {doctor.first_name}</span>
                            <div className="dashboard-avatar">{doctor.first_name.charAt(0)}</div>
                        </div>
                        <button className="dashboard-logout-btn" onClick={handleLogout}>
                            <LogOut size={16} />
                        </button>
                    </div>
                </header>

                {/* Page body */}
                <main className="dashboard-content">
                    <h1 className="dashboard-title">Account Settings</h1>

                    <div className="settings-container">
                        <div className="settings-card">
                            <h3>Profile Information</h3>
                            <div className="profile-info">
                                <p><strong>Name:</strong> {doctor.first_name} {doctor.last_name}</p>
                                <p><strong>Username:</strong> {doctor.username}</p>
                                <p><strong>Email:</strong> {doctor.email}</p>
                                <p><strong>Phone:</strong> {doctor.phone_no}</p>
                                <p><strong>Qualification:</strong> {doctor.qualification}</p>
                            </div>
                        </div>

                        <div className="settings-card">
                            <h3>Account Management</h3>
                            <div className="account-actions">
                                <button
                                    className="account-ownership-btn"
                                    onClick={handleAccountOwnershipClick}
                                >
                                    Account Ownership
                                </button>

                                <div className="danger-zone">
                                    <h4>Danger Zone</h4>
                                    <button
                                        className="delete-account-btn"
                                        onClick={() => navigate('/account-ownership')} // Navigate to account ownership where delete option will be
                                    >
                                        Delete Account
                                    </button>
                                    <p className="warning-text">
                                        Warning: This action cannot be undone. Your account and all associated data will be permanently deleted.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AccountSettings;
