'use client';
// src/components/common/Footer.jsx
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) { toast.success('Subscribed! 🎉'); setEmail(''); }
  };

  return (
    <footer style={{ background: '#111827', color: '#d1d5db', paddingTop: '3rem', marginTop: '4rem' }}>
      <div className="container">
        <div className="row g-4 pb-4">
          {/* Brand */}
          <div className="col-lg-3 col-md-6">
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
              Classic<span style={{ color: '#3b82f6' }}>Mart</span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
              Your trusted online shopping destination. Quality products, best prices, fast delivery.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              {['📘', '🐦', '📸', '▶️'].map((icon, i) => (
                <a key={i} href="#" style={{ background: '#1f2937', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.target.style.background = '#3b82f6'}
                  onMouseLeave={e => e.target.style.background = '#1f2937'}
                >{icon}</a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem' }}>Quick Links</h6>
            {['/', '/shop', '/#about', '/#contact', '/shop?category=smartphones'].map((href, i) => (
              <div key={i} style={{ marginBottom: '0.5rem' }}>
                <Link href={href} style={{ color: '#9ca3af', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#3b82f6'}
                  onMouseLeave={e => e.target.style.color = '#9ca3af'}
                >
                  {['Home', 'Shop', 'About Us', 'Contact', 'Categories'][i]}
                </Link>
              </div>
            ))}
          </div>

          {/* Customer Service */}
          <div className="col-lg-2 col-md-6">
            <h6 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem' }}>Customer Service</h6>
            {['Returns Policy', 'Shipping Info', 'Privacy Policy', 'Terms of Use', 'FAQ'].map((label, i) => (
              <div key={i} style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: '#9ca3af', fontSize: '0.9rem', textDecoration: 'none' }}>{label}</a>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="col-lg-4 col-md-6">
            <h6 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem' }}>Newsletter</h6>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              Subscribe for exclusive deals and the latest arrivals.
            </p>
            <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
              />
              <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Subscribe
              </button>
            </form>
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ fontSize: '0.82rem', marginBottom: '0.5rem' }}>Accepted Payments</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['💳 Visa', '💳 Mastercard', '📱 UPI', '💰 Wallet'].map((p, i) => (
                  <span key={i} style={{ background: '#1f2937', border: '1px solid #374151', padding: '3px 10px', borderRadius: 4, fontSize: '0.75rem' }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1f2937', padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>© {new Date().getFullYear()} ClassicMart. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Use', 'Sitemap'].map((l, i) => (
              <a key={i} href="#" style={{ color: '#9ca3af', fontSize: '0.82rem', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
