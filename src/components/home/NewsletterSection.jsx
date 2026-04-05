'use client';
// src/components/home/NewsletterSection.jsx
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success('🎉 You are subscribed! Check your email for a welcome offer.');
    setEmail('');
    setLoading(false);
  };

  return (
    <section id="contact" style={{ padding: '5rem 0', background: 'var(--white)' }}>
      <div className="container">
        <div style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '1px solid #bae6fd',
          borderRadius: 20,
          padding: '3.5rem 2rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📧</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--dark)' }}>
            Stay in the Loop
          </h2>
          <p style={{ color: 'var(--gray)', fontSize: '1rem', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
            Subscribe to our newsletter and get exclusive deals, early access to sales, and new arrival updates.
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', maxWidth: 480, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              style={{
                flex: 1, minWidth: 240,
                padding: '0.8rem 1.2rem',
                border: '1.5px solid var(--border)',
                borderRadius: 50,
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.25s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                padding: '0.8rem 2rem',
                borderRadius: 50,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.25s',
                whiteSpace: 'nowrap',
              }}
            >
              {loading ? 'Subscribing...' : 'Subscribe Now'}
            </button>
          </form>
          <p style={{ fontSize: '0.8rem', color: 'var(--gray)', marginTop: '1rem' }}>
            🔒 No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}
