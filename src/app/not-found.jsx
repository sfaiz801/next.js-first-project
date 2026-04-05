// src/app/not-found.jsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', padding: '2rem',
    }}>
      <div>
        <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🔍</div>
        <h1 style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0' }}>404</h1>
        <h2 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--gray)', marginBottom: '2rem', maxWidth: 400, margin: '0 auto 2rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{
            background: 'var(--primary)', color: 'white',
            padding: '0.8rem 2rem', borderRadius: 50,
            fontWeight: 700, textDecoration: 'none',
          }}>Go Home</Link>
          <Link href="/shop" style={{
            background: 'var(--light-gray)', color: 'var(--dark)',
            border: '1.5px solid var(--border)',
            padding: '0.8rem 2rem', borderRadius: 50,
            fontWeight: 700, textDecoration: 'none',
          }}>Browse Shop</Link>
        </div>
      </div>
    </div>
  );
}
