'use client';
// src/components/home/DiscountBanner.jsx
import Link from 'next/link';

export default function DiscountBanner() {
  return (
    <section style={{ padding: '3rem 0' }}>
      <div className="container">
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #7c3aed 100%)',
          borderRadius: 20,
          padding: '3.5rem 2.5rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 220, height: 220, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }} />
          <div style={{
            position: 'absolute', bottom: -40, left: -40,
            width: 160, height: 160, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }} />

          <div className="row align-items-center position-relative">
            <div className="col-lg-7">
              <span style={{
                background: 'rgba(251,191,36,0.2)',
                border: '1px solid rgba(251,191,36,0.5)',
                color: '#fbbf24',
                padding: '4px 14px',
                borderRadius: 50,
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'inline-block',
                marginBottom: '1rem',
              }}>
                ⚡ Limited Time Offer
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
                Get Up to <span style={{ color: '#fbbf24' }}>50% Off</span> on<br />
                Top Electronics & Fashion
              </h2>
              <p style={{ opacity: 0.85, fontSize: '1rem', marginBottom: '1.75rem', maxWidth: 480 }}>
                Use code <strong style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 10px', borderRadius: 6 }}>SAVE20</strong> at checkout for an extra 20% discount on your first order.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/shop" style={{
                  background: '#fbbf24', color: '#111827',
                  padding: '0.8rem 2rem', borderRadius: 50,
                  fontWeight: 700, textDecoration: 'none',
                  transition: 'all 0.25s',
                  display: 'inline-block',
                }}>
                  Shop the Sale
                </Link>
                <Link href="/shop?category=smartphones" style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1.5px solid rgba(255,255,255,0.4)',
                  color: 'white',
                  padding: '0.8rem 2rem', borderRadius: 50,
                  fontWeight: 600, textDecoration: 'none',
                  transition: 'all 0.25s',
                  display: 'inline-block',
                }}>
                  Browse Electronics
                </Link>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-flex justify-content-end align-items-center">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '7rem' }}>🎁</div>
                <div style={{
                  background: 'rgba(255,255,255,0.12)',
                  borderRadius: 12, padding: '0.75rem 1.5rem',
                  marginTop: '1rem',
                }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>50%</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Max Discount</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
