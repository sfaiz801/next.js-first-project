'use client';
// src/app/auth/sign-in/page.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { loginUser } from '@/store/slices/authSlice';
import { loginUserApi } from '@/utils/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await loginUserApi(data);
      dispatch(loginUser(user));
      toast.success(`Welcome back, ${user.firstName || 'User'}! 👋`);
      router.push('/account/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">ClassicMart</div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="you@example.com"
              {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} />
            {errors.email && <div className="text-danger mt-1" style={{ fontSize: '0.78rem' }}>{errors.email.message}</div>}
          </div>

          <div className="mb-2">
            <label className="form-label">Password</label>
            <div className="position-relative">
              <input type={showPw ? 'text' : 'password'} className="form-control pe-5" placeholder="Your password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
              <button type="button" onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <div className="text-danger mt-1" style={{ fontSize: '0.78rem' }}>{errors.password.message}</div>}
          </div>

          <div className="text-end mb-4">
            <Link href="/auth/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-100 fw-bold py-2"
            style={{ borderRadius: 10, fontSize: '1rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-3 mb-0" style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>
          Don't have an account?{' '}
          <Link href="/auth/sign-up" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
