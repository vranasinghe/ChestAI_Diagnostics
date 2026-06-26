import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import './Home.css';

const Home = () => {
    return (
        <div className="home-wrapper">

            {/* ============ HERO ============ */}
            <section className="lp-hero">
                <div className="lp-container">
                    <div className="lp-hero-grid">
                        <div className="lp-hero-left">
                            <div className="lp-badge">🩺 AI-Powered Medical Imaging</div>
                            <h1 className="lp-hero-title">
                                Advanced X-Ray<br />
                                <span className="lp-gradient-text">AI Diagnostics</span><br />
                                for Clinicians
                            </h1>
                            <p className="lp-hero-subtitle">
                                Upload a chest X-ray and instantly detect 6 diseases with
                                state-of-the-art DenseNet &amp; EfficientNet models — complete
                                with Grad-CAM visual explanations.
                            </p>
                            <div className="lp-hero-cta-row">
                                <Link to="/register" className="lp-btn lp-btn-primary">Get Started Free</Link>
                                <Link to="/login" className="lp-btn lp-btn-ghost">Sign In →</Link>
                            </div>
                            <div className="lp-hero-stats">
                                <div className="lp-stat">
                                    <span className="lp-stat-num">6</span>
                                    <span className="lp-stat-label">Disease Classes</span>
                                </div>
                                <div className="lp-stat-divider" />
                                <div className="lp-stat">
                                    <span className="lp-stat-num">2</span>
                                    <span className="lp-stat-label">AI Models</span>
                                </div>
                                <div className="lp-stat-divider" />
                                <div className="lp-stat">
                                    <span className="lp-stat-num">Grad-CAM</span>
                                    <span className="lp-stat-label">Visual Heatmaps</span>
                                </div>
                            </div>
                        </div>
                        <div className="lp-hero-right">
                            <div className="lp-hero-card-bg" />
                            <div className="lp-hero-image-arch">
                                <img
                                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80"
                                    alt="Medical professional"
                                />
                            </div>
                            <div className="lp-hero-float-card">
                                <div className="lp-float-dot" />
                                <div>
                                    <div className="lp-float-label">AI Analysis Complete</div>
                                    <div className="lp-float-value">Pneumonia detected — 91% confidence</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ HOW IT WORKS ============ */}
            <section className="lp-steps-section">
                <div className="lp-container">
                    <div className="lp-section-header">
                        <h2>How <span className="lp-text-cyan">Wedakam</span> Works</h2>
                        <p>Three simple steps to AI-powered X-ray diagnostics</p>
                    </div>
                    <div className="lp-steps-grid">
                        {[
                            { step: '01', icon: '📤', title: 'Upload X-Ray', desc: 'Upload your patient\'s chest X-ray image in JPEG or PNG format through our secure portal.' },
                            { step: '02', icon: '🧠', title: 'AI Analysis', desc: 'Our DenseNet121 binary classifier and EfficientNet multi-class ensemble analyse the image.' },
                            { step: '03', icon: '📋', title: 'Get Report', desc: 'Receive a detailed Grad-CAM heatmap report with disease probabilities and visual explanations.' },
                        ].map((s) => (
                            <div key={s.step} className="lp-step-card">
                                <div className="lp-step-number">{s.step}</div>
                                <div className="lp-step-icon">{s.icon}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ SERVICES ============ */}
            <section className="lp-services-section" id="services">
                <div className="lp-container">
                    <div className="lp-services-layout">
                        <div className="lp-services-left">
                            <div className="lp-overline">Our Capabilities</div>
                            <h2>Our <span className="lp-text-cyan">Special</span> Services</h2>
                            <p className="lp-services-desc">
                                State-of-the-art diagnostic tools built for modern healthcare providers.
                                Fast, accurate, and explainable AI at every step.
                            </p>
                            <div className="lp-services-grid">
                                {[
                                    { icon: '⚡', title: 'Binary Classification', desc: 'Instantly detect Normal vs. Abnormal X-rays with DenseNet121.' },
                                    { icon: '🧬', title: 'Multi-class Detection', desc: 'Identify 6 diseases: Atelectasis, Cardiomegaly, Emphysema and more.' },
                                    { icon: '🔥', title: 'Grad-CAM Heatmaps', desc: 'Visual explanations overlaid on the X-ray to show what the AI sees.' },
                                    { icon: '📋', title: 'Report Generation', desc: 'Auto-generate and email PDF medical reports directly to patients.' },
                                ].map((s) => (
                                    <div key={s.title} className="lp-service-item">
                                        <div className="lp-service-icon">{s.icon}</div>
                                        <div>
                                            <h4>{s.title}</h4>
                                            <p>{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lp-services-right">
                            <div className="lp-services-image-wrap">
                                <img
                                    src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80"
                                    alt="Medical imaging equipment"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ DISEASE CLASSES ============ */}
            <section className="lp-diseases-section" id="product">
                <div className="lp-container">
                    <div className="lp-section-header">
                        <h2>Detectable <span className="lp-text-cyan">Disease Classes</span></h2>
                        <p>Our multi-class model can identify 6 critical thoracic conditions</p>
                    </div>
                    <div className="lp-diseases-grid">
                        {[
                            { name: 'Atelectasis', color: '#eab308', icon: '🫁' },
                            { name: 'Cardiomegaly', color: '#ef4444', icon: '❤️' },
                            { name: 'Emphysema', color: '#6366f1', icon: '💨' },
                            { name: 'Pneumonia', color: '#f97316', icon: '🦠' },
                            { name: 'Mass', color: '#8b5cf6', icon: '⚠️' },
                            { name: 'Pneumothorax', color: '#22d3ee', icon: '🫧' },
                        ].map((d) => (
                            <div key={d.name} className="lp-disease-card" style={{ '--accent': d.color }}>
                                <div className="lp-disease-icon">{d.icon}</div>
                                <div className="lp-disease-name">{d.name}</div>
                                <div className="lp-disease-bar" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ TESTIMONIAL ============ */}
            <section className="lp-testimonial-section" id="about">
                <div className="lp-container">
                    <div className="lp-testimonial-layout">
                        <div className="lp-testimonial-image-col">
                            <div className="lp-testimonial-arch">
                                <img
                                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80"
                                    alt="Dr. James Wellington"
                                />
                            </div>
                        </div>
                        <div className="lp-testimonial-content">
                            <div className="lp-overline">Testimonial</div>
                            <blockquote className="lp-quote">
                                "Wedakam has transformed how I interpret chest X-rays.
                                The Grad-CAM heatmaps give me immediate visual insight
                                into the model's reasoning and my diagnostic confidence
                                has never been higher."
                            </blockquote>
                            <div className="lp-quote-author">
                                <div className="lp-author-dot" />
                                <div>
                                    <div className="lp-author-name">Dr. James Wellington</div>
                                    <div className="lp-author-role">Senior Cardiologist, City General Hospital</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ CTA ============ */}
            <section className="lp-cta-section">
                <div className="lp-container">
                    <div className="lp-cta-card">
                        <h2>Ready to elevate your diagnostic accuracy?</h2>
                        <p>Join clinicians who trust Wedakam for AI-powered X-ray analysis. Get started for free today.</p>
                        <div className="lp-cta-btns">
                            <Link to="/register" className="lp-btn lp-btn-white">Create Free Account</Link>
                            <Link to="/login" className="lp-btn lp-btn-ghost-white">Already have an account →</Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
