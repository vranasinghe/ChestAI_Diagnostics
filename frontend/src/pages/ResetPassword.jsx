import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const ResetPassword = () => {
    return (
        <AuthLayout>
            <div className="auth-form-wrapper">
                <h2 className="auth-title mb-2">New Password</h2>
                <p className="auth-subtitle mb-6">
                    Please create a new password that you don't use<br />
                    on any other site.
                </p>

                <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group mb-4">
                        <input
                            type="password"
                            className="auth-input"
                            placeholder="Create new password"
                            required
                        />
                    </div>

                    <div className="form-group mb-6">
                        <input
                            type="password"
                            className="auth-input"
                            placeholder="Confirm new password"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn mb-6">
                        Send Recovery Email
                    </button>

                    <div className="text-center auth-footer-text">
                        Just remember? <Link to="/login" className="auth-link">Sign Up</Link>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};

export default ResetPassword;
