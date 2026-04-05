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
    toast.success('Reset link sent!');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">ShopNest</div>
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-subtitle">Enter your email to receive a reset link</p>

        {submitted ? (
          <div className="text-center py-2">
            <div style={{ fontSize: '3.5rem' }}>📧</div>
            <h5 className="fw-bold mt-3 mb-2">Check Your Email</h5>
            <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>We sent a password reset link to your email address.</p>
            <Link href="/auth/sign-in" className="btn btn-primary px-4 fw-bold rounded-3">Back to Sign In</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="you@example.com"
                {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} />
              {errors.email && <div className="text-danger mt-1" style={{ fontSize: '0.78rem' }}>{errors.email.message}</div>}
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-100 fw-bold py-2"
              style={{ borderRadius: 10, fontSize: '1rem' }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <p className="text-center mt-3 mb-0" style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>
              <Link href="/auth/sign-in" style={{ color: 'var(--primary)', fontWeight: 700 }}>← Back to Sign In</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
