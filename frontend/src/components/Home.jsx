import React from 'react';
import '../App.css';

const Home = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        We Are Ready to <br />
                        <span className="text-cyan">Scan the XRAYs</span> <br />
                        for you
                    </h1>
                    <p className="hero-subtitle">
                        In times like today, precision in diagnosis is very important, especially since the volume of imaging data is increasing day by day, so we are ready to help you with our advanced machine learning medical consultation.
                    </p>
                    <button className="pill-btn btn-cyan">Try Free Consultation</button>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <h3>200<span className="stat-plus">+</span></h3>
                            <p>Active<br />Models</p>
                        </div>
                        <div className="stat-item">
                            <h3>15K<span className="stat-plus">+</span></h3>
                            <p>Active<br />Scans</p>
                        </div>
                        <div className="stat-item">
                            <h3>50<span className="stat-plus">+</span></h3>
                            <p>Medical<br />Partners</p>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-bg-arch"></div>
                    {/* Using a placeholder visual that resembles the shape */}
                    <div className="hero-arch-image arch-shape" style={{ background: 'url(https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80) no-repeat center bottom', backgroundSize: 'cover' }}>
                        {/* The image is loaded from unspash as a placeholder for doctors */}
                    </div>
                </div>
            </section>

            {/* Services Categories */}
            <section className="services-section container">
                <div className="section-header">
                    <h2>Our <span className="text-cyan">Main Services</span><br />Categories</h2>
                </div>

                <div className="categories-grid">
                    <div className="category-card">
                        <div className="category-icon-wrapper">
                            <span className="category-icon">💬</span>
                        </div>
                        <h3>Chat with AI</h3>
                        <p>You can connect directly, quickly and easily, and there is no need to doubt the quality of the consultation and AI feedback offered.</p>
                    </div>

                    <div className="category-card cyan-card">
                        <div className="category-icon-wrapper" style={{ background: 'rgba(255,255,255,0.2)' }}>
                            <span className="category-icon" style={{ filter: 'contrast(0)' }}>🧬</span>
                        </div>
                        <h3>X-Ray Analysis</h3>
                        <p>Upload the imaging data you are investigating and don't hesitate to ask about the proper diagnostic probability.</p>
                    </div>

                    <div className="category-card">
                        <div className="category-icon-wrapper">
                            <span className="category-icon">🏥</span>
                        </div>
                        <h3>Clinical Integration</h3>
                        <p>Get priority APIs in hospitals with Wedakam. Which allows you to integrate your local hospital's PACS practically and save time.</p>
                    </div>
                </div>
            </section>

            {/* Special Services */}
            <section className="special-section container">
                <div className="special-visual">
                    <div className="special-arch arch-shape" style={{ background: 'url(https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80) no-repeat center bottom' }}>
                        {/* Placeholder doctor research image */}
                    </div>
                </div>

                <div className="special-content">
                    <h2>Our <span className="text-cyan">Special Services</span></h2>
                    <p>
                        In times like today, diagnostic accuracy is very important, especially since the number of challenging cases is increasing day by day, so we are ready to help you with our advanced models.
                    </p>

                    <div className="special-grid">
                        <div className="special-item">
                            <div className="special-item-icon">🧠</div>
                            <h4>Brain MRI Analysis</h4>
                            <p>Detect subtle anomalies in brain tissue with robust volumetric scanning AI models.</p>
                        </div>
                        <div className="special-item">
                            <div className="special-item-icon">🫁</div>
                            <h4>Chest X-Ray</h4>
                            <p>Automated detection of pneumonia, pneumothorax, and cardiomegaly on standard PA films.</p>
                        </div>
                        <div className="special-item">
                            <div className="special-item-icon">🦴</div>
                            <h4>Fracture Detection</h4>
                            <p>Pinpoint hairline fractures and skeletal abnormalities with high precision algorithms.</p>
                        </div>
                        <div className="special-item">
                            <div className="special-item-icon">📊</div>
                            <h4>DICOM Viewer</h4>
                            <p>Integrated Web viewer for immediate manipulation and assessment of medical imaging data.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Doctors Section */}
            <section className="doctors-section container">
                <div className="doctors-header">
                    <p className="pre-title">User Reviews</p>
                    <h2><span className="text-cyan">What doctors</span> Say about us</h2>
                    <p className="subtitle">Handled directly by general engineers and professional and experienced machine learning specialists.</p>
                </div>

                <div className="doctors-layout">
                    <div className="doctor-info-card">
                        <h4>Chief Data Scientist</h4>
                        <h3>Dr. James<br />Wellington</h3>
                        <a href="#readmore">Read More &rarr;</a>
                    </div>

                    <div className="doctor-image-container arch-shape" style={{ position: 'relative' }}>
                        <div className="carousel-nav">&lt;</div>
                        <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80" alt="Doctor" style={{ filter: 'none' }} />
                    </div>
                </div>

                <div className="doctors-footer-action">
                    <button className="pill-btn btn-cyan" style={{ marginLeft: '0' }}>View All Experts</button>
                    <div className="carousel-dots" style={{ display: 'inline-flex', float: 'right', marginTop: '1rem' }}>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot active"></span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
