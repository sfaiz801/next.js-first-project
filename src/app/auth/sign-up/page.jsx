'use client';
// src/app/auth/sign-up/page.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerUser } from '@/utils/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser({ firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.password, phone: data.phone || '', createdAt: new Date().toISOString() });
      toast.success('Account created! Please sign in. 🎉');
      router.push('/auth/sign-in');
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-logo">ShopNest</div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join thousands of happy shoppers today</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label">First Name</label>
              <input className="form-control" placeholder="John" {...register('firstName', { required: 'Required' })} />
              {errors.firstName && <div className="text-danger mt-1" style={{ fontSize: '0.78rem' }}>{errors.firstName.message}</div>}
            </div>
            <div className="col-6">
              <label className="form-label">Last Name</label>
              <input className="form-control" placeholder="Doe" {...register('lastName', { required: 'Required' })} />
              {errors.lastName && <div className="text-danger mt-1" style={{ fontSize: '0.78rem' }}>{errors.lastName.message}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="you@example.com"
              {...register('email', { required: 'Required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} />
            {errors.email && <div className="text-danger mt-1" style={{ fontSize: '0.78rem' }}>{errors.email.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Phone (optional)</label>
            <input type="tel" className="form-control" placeholder="+91 9876543210" {...register('phone')} />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="position-relative">
              <input type={showPw ? 'text' : 'password'} className="form-control pe-5" placeholder="Min 8 characters"
                {...register('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })} />
              <button type="button" onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <div className="text-danger mt-1" style={{ fontSize: '0.78rem' }}>{errors.password.message}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-control" placeholder="Repeat password"
              {...register('confirmPassword', { required: 'Required', validate: v => v === password || 'Passwords do not match' })} />
            {errors.confirmPassword && <div className="text-danger mt-1" style={{ fontSize: '0.78rem' }}>{errors.confirmPassword.message}</div>}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-100 fw-bold py-2"
            style={{ borderRadius: 10, fontSize: '1rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-3 mb-0" style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>
          Already have an account?{' '}
          <Link href="/auth/sign-in" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
