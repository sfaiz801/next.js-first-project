'use client';
// src/app/auth/forgot-password/page.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
    toast.success('Reset link sent to your email!');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">ShopNest</div>
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-subtitle">Enter your email and we'll send you a reset link</p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📧</div>
            <h5 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Check Your Email</h5>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              We've sent a password reset link to your email address.
            </p>
            <Link href="/auth/sign-in" style={{
              background: 'var(--primary)', color: 'white',
              padding: '0.7rem 2rem', borderRadius: 10, fontWeight: 700,
              textDecoration: 'none', display: 'inline-block',
            }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="form-control"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                })}
              />
              {errors.email && <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}>{errors.email.message}</div>}
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', background: 'var(--primary)', color: 'white',
                border: 'none', padding: '0.85rem', borderRadius: 10,
                fontWeight: 700, fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--gray)' }}>
              Remembered your password?{' '}
              <Link href="/auth/sign-in" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign In</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
