import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { Eye } from 'lucide-react';

const Login = () => {
    return (
        <AuthLayout
            headerRightText="Don't have an account? "
            headerRightLink="/register"
            headerRightLinkText="Sign Up"
        >
            <div className="auth-form-wrapper">
                <h2 className="auth-title">Sign in</h2>

                <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <input
                            type="email"
                            className="auth-input"
                            placeholder="Email address"
                            required
                        />
                    </div>

                    <div className="form-group position-relative">
                        <input
                            type="password"
                            className="auth-input pr-10"
                            placeholder="Password"
                            required
                        />
                        <button type="button" className="password-toggle-btn">
                            <Eye size={20} color="#718096" />
                        </button>
                    </div>

                    <div className="form-options">
                        <Link to="/forgot-password" className="forgot-password-link">
                            Forgot password?
                        </Link>
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        Sign In
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or</span>
                </div>

                <div className="social-login-grid">
                    <button type="button" className="social-btn">
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="social-icon" />
                        Google
                    </button>
                    <button type="button" className="social-btn">
                        <span className="social-icon facebook-icon">f</span>
                        Facebook
                    </button>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Login;
