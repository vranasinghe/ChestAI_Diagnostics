import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, ClipboardCheck, FileText, Settings, CreditCard,
    UserCircle, HelpCircle, Search, Bell, LogOut, Star, Send, Trash2, CheckCircle, Edit2, X, Save
} from 'lucide-react';
import './Dashboard.css';

const REVIEW_TARGETS = ['Binary Model', 'Multiclass Model', 'General System'];

export default function ReviewManagement() {
    const navigate = useNavigate();
    const doctor = JSON.parse(localStorage.getItem('doctor') || '{}');

    // ── Form state ──
    const [target, setTarget] = useState('General System');
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submitted, setSubmitted]   = useState(false);
    const [updated, setUpdated]       = useState(false);
    const [reviews, setReviews]       = useState([
        { id: 1, target: 'General System', rating: 5, text: 'Excellent workflow and clean UI.', date: '2026-04-20', author: 'Dr. Smith' },
        { id: 2, target: 'Binary Model',   rating: 4, text: 'Very accurate predictions overall.', date: '2026-04-19', author: 'Dr. Perera' },
    ]);

    // ── Edit state ──
    const [editingId,   setEditingId]   = useState(null);
    const [editText,    setEditText]    = useState('');
    const [editRating,  setEditRating]  = useState(5);
    const [editHover,   setEditHover]   = useState(0);
    const [editTarget,  setEditTarget]  = useState('General System');

    const handleLogout = async () => {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        try {
            await fetch(`${API_BASE}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (e) {
            console.error('Error logging out:', e);
        }
        localStorage.removeItem('doctor');
        navigate('/login');
    };

    const handleSubmit = () => {
        if (!reviewText.trim()) return;
        const newReview = {
            id: Date.now(),
            target,
            rating,
            text: reviewText.trim(),
            date: new Date().toISOString().split('T')[0],
            author: `Dr. ${doctor.first_name || 'Unknown'}`,
        };
        setReviews(prev => [newReview, ...prev]);
        setReviewText('');
        setRating(5);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    const handleDelete = (id) => {
        setReviews(prev => prev.filter(r => r.id !== id));
    };

    const startEdit = (r) => {
        setEditingId(r.id);
        setEditText(r.text);
        setEditRating(r.rating);
        setEditTarget(r.target);
        setEditHover(0);
    };

    const cancelEdit = () => setEditingId(null);

    const saveEdit = (id) => {
        if (!editText.trim()) return;
        setReviews(prev => prev.map(r =>
            r.id === id
                ? { ...r, text: editText.trim(), rating: editRating, target: editTarget, date: new Date().toISOString().split('T')[0] }
                : r
        ));
        setEditingId(null);
        setUpdated(true);
        setTimeout(() => setUpdated(false), 3000);
    };

    const starLabel = rating === 1 ? '1 / 5 Stars' : `${rating} / 5 Stars`;

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-logo">
                    <div className="logo-container">
                        <div className="logo-text">Wedakam</div>
                        <div className="logo-icon"></div>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <p className="sidebar-section-label">MENU</p>
                    <a href="/dashboard" className="sidebar-link" onClick={e => { e.preventDefault(); navigate('/dashboard'); }}>
                        <span className="sidebar-icon"><LayoutDashboard size={18} /></span> Dashboard
                    </a>
                    <a href="/patients" className="sidebar-link" onClick={e => { e.preventDefault(); navigate('/patients'); }}>
                        <span className="sidebar-icon"><Users size={18} /></span> Manage Patients
                    </a>
                    <a href="/reports" className="sidebar-link" onClick={e => { e.preventDefault(); navigate('/reports'); }}>
                        <span className="sidebar-icon"><FileText size={18} /></span> Manage Reports
                    </a>
                    <a href="/review" className="sidebar-link active">
                        <span className="sidebar-icon"><ClipboardCheck size={18} /></span> Review
                    </a>
                    <p className="sidebar-section-label">OTHERS</p>
                    <a href="/account-settings" className="sidebar-link" onClick={e => { e.preventDefault(); navigate('/account-settings'); }}>
                        <span className="sidebar-icon"><Settings size={18} /></span> Settings
                    </a>
                    <a href="#" className="sidebar-link">
                        <span className="sidebar-icon"><CreditCard size={18} /></span> Payment
                    </a>
                    <a href="#" className="sidebar-link">
                        <span className="sidebar-icon"><UserCircle size={18} /></span> Accounts
                    </a>
                    <a href="#" className="sidebar-link">
                        <span className="sidebar-icon"><HelpCircle size={18} /></span> Help
                    </a>
                </nav>
            </aside>

            {/* Main */}
            <div className="dashboard-main">
                {/* Topbar */}
                <header className="dashboard-topbar">
                    <div className="dashboard-search-container">
                        <Search className="search-icon-placeholder" size={18} />
                        <input type="text" className="dashboard-search" placeholder="Search reviews..." readOnly />
                    </div>
                    <div className="dashboard-user-info">
                        <button className="notification-btn"><Bell size={20} /></button>
                        <div className="dashboard-avatar-container">
                            <span className="dashboard-greeting">Hello, Dr. {doctor.first_name}</span>
                            <div className="dashboard-avatar">{(doctor.first_name || 'D').charAt(0)}</div>
                        </div>
                        <button className="dashboard-logout-btn" onClick={handleLogout}><LogOut size={16} /></button>
                    </div>
                </header>

                <main className="dashboard-content" style={{ padding: '0 40px 40px' }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '32px' }}>
                        Review Management
                    </h1>

                    {/* Updated toast */}
                    {updated && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: 12, color: '#0f766e', fontWeight: 600, marginBottom: 24 }}>
                            <CheckCircle size={18} /> Review updated successfully!
                        </div>
                    )}

                    {/* ── Review Form Card ── */}
                    <div style={{ background: '#fff', borderRadius: 20, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', marginBottom: 40 }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 24 }}>
                            Share Your Experience
                        </h2>

                        {/* Target selector */}
                        <div style={{ marginBottom: 28 }}>
                            <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>What are you reviewing?</p>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                {REVIEW_TARGETS.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTarget(t)}
                                        style={{
                                            padding: '10px 22px',
                                            borderRadius: 30,
                                            border: target === t ? 'none' : '1px solid #e2e8f0',
                                            background: target === t ? '#14b8a6' : '#fff',
                                            color: target === t ? '#fff' : '#475569',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Star Rating */}
                        <div style={{ marginBottom: 28 }}>
                            <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>Rating</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        size={36}
                                        fill={(hoverRating || rating) >= star ? '#14b8a6' : 'none'}
                                        color={(hoverRating || rating) >= star ? '#14b8a6' : '#cbd5e1'}
                                        style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    />
                                ))}
                                <span style={{ marginLeft: 12, fontWeight: 600, color: '#475569', fontSize: '1rem' }}>{starLabel}</span>
                            </div>
                        </div>

                        {/* Review Text */}
                        <div style={{ marginBottom: 32 }}>
                            <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>Review Details</p>
                            <textarea
                                value={reviewText}
                                onChange={e => setReviewText(e.target.value)}
                                placeholder="Tell us what you think about this feature..."
                                rows={5}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: 12,
                                    fontSize: '0.95rem',
                                    color: '#334155',
                                    outline: 'none',
                                    resize: 'vertical',
                                    background: '#fafafa',
                                    boxSizing: 'border-box',
                                    lineHeight: 1.6,
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#14b8a6'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={!reviewText.trim()}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '12px 28px',
                                borderRadius: 30,
                                border: '1.5px solid #14b8a6',
                                background: 'transparent',
                                color: '#14b8a6',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                cursor: reviewText.trim() ? 'pointer' : 'not-allowed',
                                opacity: reviewText.trim() ? 1 : 0.5,
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { if(reviewText.trim()) { e.currentTarget.style.background = '#14b8a6'; e.currentTarget.style.color = '#fff'; }}}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#14b8a6'; }}
                        >
                            <Send size={16} /> Submit Review
                        </button>
                    </div>

                    {/* ── Past Reviews ── */}
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>
                        Submitted Reviews
                    </h2>

                    {reviews.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: '1rem' }}>
                            No reviews submitted yet.
                        </div>
                    )}

                    <div style={{ display: 'grid', gap: 20 }}>
                        {reviews.map(r => (
                            <div key={r.id} style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: `1px solid ${editingId === r.id ? '#14b8a6' : '#f1f5f9'}`, transition: 'border 0.2s' }}>

                                {editingId === r.id ? (
                                    /* ── Inline Edit Mode ── */
                                    <div>
                                        <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>Reviewing:</p>
                                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
                                            {REVIEW_TARGETS.map(t => (
                                                <button key={t} onClick={() => setEditTarget(t)} style={{ padding: '8px 18px', borderRadius: 30, border: editTarget === t ? 'none' : '1px solid #e2e8f0', background: editTarget === t ? '#14b8a6' : '#fff', color: editTarget === t ? '#fff' : '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>
                                                    {t}
                                                </button>
                                            ))}
                                        </div>

                                        <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>Rating:</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                                            {[1,2,3,4,5].map(s => (
                                                <Star key={s} size={28}
                                                    fill={(editHover || editRating) >= s ? '#14b8a6' : 'none'}
                                                    color={(editHover || editRating) >= s ? '#14b8a6' : '#cbd5e1'}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setEditRating(s)}
                                                    onMouseEnter={() => setEditHover(s)}
                                                    onMouseLeave={() => setEditHover(0)}
                                                />
                                            ))}
                                            <span style={{ marginLeft: 8, fontWeight: 600, color: '#64748b', fontSize: '0.9rem' }}>{editRating} / 5 Stars</span>
                                        </div>

                                        <textarea
                                            value={editText}
                                            onChange={e => setEditText(e.target.value)}
                                            rows={4}
                                            style={{ width: '100%', padding: '14px', border: '1px solid #14b8a6', borderRadius: 10, fontSize: '0.95rem', color: '#334155', outline: 'none', resize: 'vertical', background: '#fafafa', boxSizing: 'border-box', lineHeight: 1.6, marginBottom: 20 }}
                                        />

                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <button
                                                onClick={() => saveEdit(r.id)}
                                                disabled={!editText.trim()}
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 24px', borderRadius: 30, border: 'none', background: '#14b8a6', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: editText.trim() ? 'pointer' : 'not-allowed', opacity: editText.trim() ? 1 : 0.5 }}
                                            >
                                                <Save size={15} /> Save Changes
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 24px', borderRadius: 30, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
                                            >
                                                <X size={15} /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* ── View Mode ── */
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                                                <span style={{ background: '#f0fdfa', color: '#14b8a6', padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>{r.target}</span>
                                                <div style={{ display: 'flex', gap: 3 }}>
                                                    {[1,2,3,4,5].map(s => (
                                                        <Star key={s} size={14} fill={r.rating >= s ? '#14b8a6' : 'none'} color={r.rating >= s ? '#14b8a6' : '#cbd5e1'} />
                                                    ))}
                                                </div>
                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{r.date}</span>
                                            </div>
                                            <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{r.text}</p>
                                            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: 8 }}>{r.author}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button
                                                onClick={() => startEdit(r)}
                                                style={{ background: 'none', border: '1px solid #14b8a6', cursor: 'pointer', color: '#14b8a6', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}
                                                title="Edit review"
                                                onMouseEnter={e => { e.currentTarget.style.background = '#14b8a6'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#14b8a6'; }}
                                            >
                                                <Edit2 size={14} /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(r.id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '6px', display: 'flex', alignItems: 'center', borderRadius: 8, transition: 'background 0.2s' }}
                                                title="Delete review"
                                                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
