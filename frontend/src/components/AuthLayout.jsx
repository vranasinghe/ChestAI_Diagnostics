import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, headerRightText, headerRightLink, headerRightLinkText }) => {
    return (
        <div className="auth-layout">
            {/* Left Side: Branding */}
            <div className="auth-sidebar">
                <Link to="/" className="logo-container" style={{ textDecoration: 'none', color: 'white' }}>
                    <div className="logo-icon" style={{ backgroundColor: 'white' }}>
                        <span style={{ color: 'var(--brand-cyan)', fontWeight: 'bold', fontSize: '14px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>+</span>
                    </div>
                    <div className="logo-text" style={{ color: 'white' }}>Wedakam</div>
                </Link>
                <div className="auth-sidebar-content">
                    <h1 className="auth-sidebar-title">
                        Let the Wedakam<br />
                        scan the XRAY<br />
                        of your patient
                    </h1>
                </div>
            </div>

            {/* Right Side: Form Content */}
            <div className="auth-content">
                <div className="auth-header-right">
                    {headerRightText && <span>{headerRightText}</span>}
                    {headerRightLink && (
                        <Link to={headerRightLink} className="auth-header-link">
                            {headerRightLinkText}
                        </Link>
                    )}
                </div>

                <div className="auth-form-container">
                    {children}
                </div>

                <div className="auth-footer">
                    Protected by reCAPTCHA and subject to the Wedakam{' '}
                    <Link to="/privacy">Privacy Policy</Link> and <Link to="/terms">Terms of Service</Link>.
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
