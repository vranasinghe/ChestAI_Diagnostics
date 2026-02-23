import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const ForgotPassword = () => {
    return (
        <AuthLayout>
            <div className="auth-form-wrapper">
                <h2 className="auth-title mb-2">Forgot password?</h2>
                <p className="auth-subtitle mb-6">
                    No worries! Just enter your email and we'll send<br />
                    you a reset password link.
                </p>

                <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group mb-6">
                        <input
                            type="email"
                            className="auth-input"
                            placeholder="hello@designspace.io"
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

export default ForgotPassword;
