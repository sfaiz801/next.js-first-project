'use client';
// src/app/error.jsx
export default function Error({ error, reset }) {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', padding: '2rem',
    }}>
      <div>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Something went wrong</h2>
        <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={reset}
          style={{
            background: 'var(--primary)', color: 'white',
            border: 'none', padding: '0.75rem 2rem',
            borderRadius: 50, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
