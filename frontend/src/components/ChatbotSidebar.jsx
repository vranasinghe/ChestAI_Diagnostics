import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';

export default function ChatbotSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! I am your Wedakam Clinical Assistant. How can I help you today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim() || loading) return;

        const userQuery = inputValue.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userQuery }]);
        setInputValue('');
        setLoading(true);

        // Add a placeholder message for the bot response
        setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

        // Establish Server-Sent Events (SSE) connection
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const url = `${apiBaseUrl}/chatbot/stream?query=${encodeURIComponent(userQuery)}`;
        const eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
            // Server sends 'data: [DONE]' as the termination sentinel
            if (event.data === '[DONE]') {
                eventSource.close();
                setLoading(false);
                return;
            }
            const chunk = event.data;
            setMessages(prev =>
                prev.map((msg, index) => {
                    if (index === prev.length - 1 && msg.sender === 'bot') {
                        return { ...msg, text: msg.text + chunk };
                    }
                    return msg;
                })
            );
        };

        // 'done' event fires when server closes the SSE stream cleanly
        eventSource.addEventListener('done', () => {
            eventSource.close();
            setLoading(false);
        });

        eventSource.onerror = () => {
            eventSource.close();
            setLoading(false);
        };
    };

    return (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, fontFamily: 'sans-serif' }}>
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: '30px',
                        background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                        color: '#fff',
                        border: 'none',
                        boxShadow: '0 10px 25px -5px rgba(20, 184, 166, 0.4), 0 8px 10px -6px rgba(20, 184, 166, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <MessageSquare size={28} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div
                    style={{
                        width: 380,
                        height: 520,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 20,
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        animation: 'fadeIn 0.2s ease-out'
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            padding: '16px 20px',
                            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Wedakam Clinical AI</h3>
                            <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>WHO/NIH Guidelines RAG Engine</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8 }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                style={{
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    padding: '12px 16px',
                                    borderRadius: 16,
                                    fontSize: '0.9rem',
                                    lineHeight: '1.4',
                                    whiteSpace: 'pre-wrap',
                                    background: msg.sender === 'user' ? '#14b8a6' : '#f1f5f9',
                                    color: msg.sender === 'user' ? '#fff' : '#1e293b',
                                    boxShadow: msg.sender === 'user' ? 'none' : '0 2px 4px rgba(0,0,0,0.02)'
                                }}
                            >
                                {msg.text === '' && loading && idx === messages.length - 1 ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Typing...</span>
                                    </div>
                                ) : (
                                    msg.text
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Footer */}
                    <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', background: '#fff', display: 'flex', gap: 12 }}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask guidelines, e.g. pneumonia protocol..."
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                borderRadius: 10,
                                border: '1px solid #cbd5e1',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !inputValue.trim()}
                            style={{
                                padding: '12px',
                                borderRadius: 10,
                                border: 'none',
                                background: '#14b8a6',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                opacity: (loading || !inputValue.trim()) ? 0.6 : 1
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
