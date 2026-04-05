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
      toast.success(`Welcome back, ${user.firstName || user.name || 'User'}! 👋`);
      router.push('/account/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">ShopNest</div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account to continue shopping</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '1.1rem' }}>
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

          <div style={{ marginBottom: '0.5rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
                className="form-control"
                style={{ paddingRight: '2.5rem' }}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}>{errors.password.message}</div>}
          </div>

          <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
            <Link href="/auth/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: 'var(--primary)', color: 'white',
              border: 'none', padding: '0.85rem', borderRadius: 10,
              fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'all 0.25s',
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--gray)' }}>
          Don't have an account?{' '}
          <Link href="/auth/sign-up" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
