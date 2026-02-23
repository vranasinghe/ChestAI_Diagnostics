import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { Eye } from 'lucide-react';

const Register = () => {
    return (
        <AuthLayout
            headerRightText="Already have an account? "
            headerRightLink="/login"
            headerRightLinkText="Sign In"
        >
            <div className="auth-form-wrapper">
                <h2 className="auth-title">Sign up</h2>

                <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <input
                            type="email"
                            className="auth-input"
                            placeholder="Email address"
                            required
                        />
                    </div>

                    <div className="name-grid">
                        <div className="form-group">
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="First name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Last name"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <input
                            type="tel"
                            className="auth-input"
                            placeholder="Phone number"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <select
                            className="auth-input"
                            required
                            defaultValue=""
                        >
                            <option value="" disabled>Select Qualification</option>
                            <option value="MBBS/MBChB">MBBS/ MBChB(Bachelor of Medicine, Bachelor of Surgery)</option>
                            <option value="MD">MD (Doctor of Medicine)</option>
                            <option value="BMBS/BMed">BMBS / BMed(Bachelor of Medicine, Bachelor of Surgery)</option>
                            <option value="MRCP">MRCP(Member of the Royal College of Physicians)</option>
                        </select>
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

                    <button type="submit" className="auth-submit-btn mb-4 mt-2">
                        Sign Up
                    </button>

                    <div className="auth-divider mb-4">
                        <span>or</span>
                    </div>

                    <div className="social-login-grid mb-6">
                        <button type="button" className="social-btn">
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="social-icon" />
                            Google
                        </button>
                        <button type="button" className="social-btn">
                            <span className="social-icon facebook-icon">f</span>
                            Facebook
                        </button>
                    </div>

                    <div className="terms-checkbox-container">
                        <input type="checkbox" id="terms" className="auth-checkbox" required />
                        <label htmlFor="terms" className="auth-checkbox-label">
                            By clicking Create account, I agree that I have read and accepted the Terms of Use and Privacy Policy.
                        </label>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};

export default Register;
