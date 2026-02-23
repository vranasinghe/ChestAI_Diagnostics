import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountOwnership.css';

const AccountOwnership = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
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
        // Clear local storage and redirect to login
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

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (!doctor) return null;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">WEDAKAM</div>

        <nav className="sidebar-nav">
          <p className="sidebar-section-label">MENU</p>
          <a href="/dashboard" className="sidebar-link">
            <span className="sidebar-icon">▪</span> Dashboard
          </a>
          <a href="#" className="sidebar-link">
            <span className="sidebar-icon">▪</span> Manage Patients
          </a>
          <a href="#" className="sidebar-link">
            <span className="sidebar-icon">▪</span> Review
          </a>

          <p className="sidebar-section-label">OTHERS</p>
          <a href="/account-settings" className="sidebar-link">
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
          <h1 className="dashboard-title">Account Ownership</h1>

          <div className="ownership-container">
            <div className="ownership-card">
              <h3>Account Details</h3>
              <div className="account-details">
                <p><strong>Account Owner:</strong> {doctor.first_name} {doctor.last_name}</p>
                <p><strong>Email:</strong> {doctor.email}</p>
                <p><strong>Account Created:</strong> {doctor.created_at ? new Date(doctor.created_at).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Account Status:</strong> Active</p>
              </div>
            </div>

            <div className="ownership-card">
              <h3>Account Security</h3>
              <div className="security-actions">
                <button className="security-btn">Change Password</button>
                <button className="security-btn">Two-Factor Authentication</button>
              </div>
            </div>

            <div className="ownership-card danger-card">
              <h3>Danger Zone</h3>
              <div className="danger-actions">
                <p className="warning-text">
                  Warning: Deleting your account will permanently remove all your data and cannot be undone.
                </p>
                <button 
                  className="delete-account-btn" 
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Account Deletion</h3>
            <p>Are you sure you want to delete your account?</p>
            <p className="modal-warning">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={cancelDelete}>Cancel</button>
              <button className="btn-delete-confirm" onClick={confirmDeleteAccount}>Delete Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountOwnership;