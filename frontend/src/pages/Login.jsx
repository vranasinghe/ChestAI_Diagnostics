import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { Eye, EyeOff } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Show a success banner if user just registered
    const justRegistered = location.state?.registered;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.detail || 'Invalid email or password.');
                return;
            }

            // Persist doctor info in localStorage
            localStorage.setItem('doctor', JSON.stringify(data.doctor));

            // Redirect to the Doctor Dashboard
            navigate('/dashboard');
        } catch (err) {
            setError('Could not connect to the server. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            headerRightText="Don't have an account? "
            headerRightLink="/register"
            headerRightLinkText="Sign Up"
        >
            <div className="auth-form-wrapper">
                <h2 className="auth-title">Sign in</h2>

                {justRegistered && (
                    <div className="auth-success-banner">
                        Account created successfully! Please sign in.
                    </div>
                )}

                {error && (
                    <div className="auth-error-banner">
                        {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            className="auth-input"
                            placeholder="Email address"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group position-relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            className="auth-input pr-10"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowPassword((v) => !v)}
                        >
                            {showPassword ? <EyeOff size={20} color="#718096" /> : <Eye size={20} color="#718096" />}
                        </button>
                    </div>

                    <div className="form-options">
                        <Link to="/forgot-password" className="forgot-password-link">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setForm({ email: 'demo@wedakam.com', password: 'password123' });
                        }}
                        style={{
                            marginTop: 12,
                            width: '100%',
                            padding: '12px',
                            borderRadius: 8,
                            border: '1px dashed #14b8a6',
                            background: '#f0fdfa',
                            color: '#0d9488',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#e6fffa'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#f0fdfa'}
                    >
                        Use Demo Doctor Account
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
