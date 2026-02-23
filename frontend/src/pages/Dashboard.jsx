import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
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

    if (!doctor) return null;

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-logo">WEDAKAM</div>

                <nav className="sidebar-nav">
                    <p className="sidebar-section-label">MENU</p>
                    <a href="/dashboard" className="sidebar-link active">
                        <span className="sidebar-icon">▪</span> Dashboard
                    </a>
                    <a href="#" className="sidebar-link">
                        <span className="sidebar-icon">▪</span> Manage Patients
                    </a>
                    <a href="#" className="sidebar-link">
                        <span className="sidebar-icon">▪</span> Review
                    </a>

                    <p className="sidebar-section-label">OTHERS</p>
                    <a href="#" className="sidebar-link" onClick={(e) => {
                        e.preventDefault();
                        handleSettingsClick();
                    }}>
                        <span className="sidebar-icon">⚙</span> Settings
                    </a>
                    <a href="#" className="sidebar-link">
                        <span className="sidebar-icon">💳</span> Payment
                    </a>
                    <a href="#" className="sidebar-link">
                        <span className="sidebar-icon">👤</span> Accounts
                    </a>
                    <a href="#" className="sidebar-link">
                        <span className="sidebar-icon">❓</span> Help
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="dashboard-main">
                {/* Top bar */}
                <header className="dashboard-topbar">
                    <input
                        type="text"
                        className="dashboard-search"
                        placeholder="Search"
                    />
                    <div className="dashboard-user-info">
                        <div className="dashboard-avatar">
                            {doctor.first_name.charAt(0)}
                        </div>
                        <span className="dashboard-greeting">
                            Hello, Dr. {doctor.first_name} {doctor.last_name}
                        </span>
                        <button className="dashboard-logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </header>

                {/* Page body */}
                <main className="dashboard-content">
                    <h1 className="dashboard-title">Dashboard</h1>

                    {/* Doctor info card */}
                    <div className="dashboard-welcome-card">
                        <h3>Welcome back, Dr. {doctor.first_name} {doctor.last_name}!</h3>
                        <p><span>Username:</span> {doctor.username}</p>
                        <p><span>Email:</span> {doctor.email}</p>
                        <p><span>Phone:</span> {doctor.phone_no}</p>
                        <p><span>Qualification:</span> {doctor.qualification}</p>
                    </div>

                    {/* Stats row */}
                    <div className="dashboard-stats-row">
                        <div className="stat-card">
                            <div className="stat-label">RECORDS</div>
                            <div className="stat-value">—</div>
                            <div className="stat-sub">Reports from today</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">INFERENCE ENGINE</div>
                            <div className="stat-value">—</div>
                            <div className="stat-sub">Scans processed</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">RECENT SCANS</div>
                            <div className="stat-value">0</div>
                            <div className="stat-sub">Scans this week</div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;