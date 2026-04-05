'use client';
// src/app/account/change-password/page.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { selectUser, selectIsLoggedIn } from '@/store/slices/authSlice';
import { updateUserApi } from '@/utils/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AccountSidebar } from '../profile/page';

export default function ChangePasswordPage() {
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState({ old: false, new: false, confirm: false });

  useEffect(() => {
    if (!isLoggedIn) router.push('/auth/sign-in');
  }, [isLoggedIn, router]);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const newPw = watch('newPassword');

  const onSubmit = async (data) => {
    // Validate old password
    if (data.oldPassword !== user?.password) {
      toast.error('Current password is incorrect.');
      return;
    }
    setLoading(true);
    try {
      await updateUserApi(user.id, { password: data.newPassword });
      toast.success('Password changed successfully! 🔒');
      reset();
    } catch {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  const eyeBtn = (field) => (
    <button
      type="button"
      onClick={() => setShow(s => ({ ...s, [field]: !s[field] }))}
      style={{
        position: 'absolute', right: '0.75rem', top: '50%',
        transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem',
      }}
    >
      {show[field] ? '🙈' : '👁️'}
    </button>
  );

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Change Password</h1>
          <ol className="breadcrumb mb-0 mt-2">
            <li className="breadcrumb-item"><Link href="/" style={{ color: 'rgba(255,255,255,0.7)' }}>Home</Link></li>
            <li className="breadcrumb-item"><Link href="/account/dashboard" style={{ color: 'rgba(255,255,255,0.7)' }}>Account</Link></li>
            <li className="breadcrumb-item active">Change Password</li>
          </ol>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <AccountSidebar active="change-password" />
          </div>

          {/* Form */}
          <div className="col-lg-9">
            <div style={{
              background: 'white', border: '1px solid var(--border)',
              borderRadius: 16, padding: '2rem',
              maxWidth: 560,
            }}>
              <div style={{ marginBottom: '2rem' }}>
                <h5 style={{ fontWeight: 700, marginBottom: '0.4rem' }}>🔒 Update Your Password</h5>
                <p style={{ color: 'var(--gray)', fontSize: '0.9rem', margin: 0 }}>
                  Choose a strong password with at least 8 characters.
                </p>
              </div>

              {/* Security Tips */}
              <div style={{
                background: '#fffbeb', border: '1px solid #fcd34d',
                borderRadius: 10, padding: '1rem', marginBottom: '1.75rem',
                fontSize: '0.85rem', color: '#92400e',
              }}>
                <strong>💡 Tips for a strong password:</strong>
                <ul style={{ margin: '0.5rem 0 0 1rem', paddingLeft: '0.5rem' }}>
                  <li>Use at least 8 characters</li>
                  <li>Mix uppercase, lowercase, numbers & symbols</li>
                  <li>Avoid using your name or email</li>
                </ul>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Current Password */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={show.old ? 'text' : 'password'}
                      placeholder="Enter your current password"
                      className="form-control"
                      style={{ paddingRight: '2.5rem' }}
                      {...register('oldPassword', { required: 'Current password is required' })}
                    />
                    {eyeBtn('old')}
                  </div>
                  {errors.oldPassword && <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}>{errors.oldPassword.message}</div>}
                </div>

                {/* New Password */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={show.new ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className="form-control"
                      style={{ paddingRight: '2.5rem' }}
                      {...register('newPassword', {
                        required: 'New password is required',
                        minLength: { value: 8, message: 'Must be at least 8 characters' },
                        validate: val => val !== watch('oldPassword') || 'New password must differ from current',
                      })}
                    />
                    {eyeBtn('new')}
                  </div>
                  {errors.newPassword && <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}>{errors.newPassword.message}</div>}

                  {/* Strength Indicator */}
                  {newPw && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <PasswordStrength password={newPw} />
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div style={{ marginBottom: '2rem' }}>
                  <label className="form-label">Confirm New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={show.confirm ? 'text' : 'password'}
                      placeholder="Repeat your new password"
                      className="form-control"
                      style={{ paddingRight: '2.5rem' }}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: val => val === newPw || 'Passwords do not match',
                      })}
                    />
                    {eyeBtn('confirm')}
                  </div>
                  {errors.confirmPassword && <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}>{errors.confirmPassword.message}</div>}
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: 'var(--primary)', color: 'white',
                      border: 'none', padding: '0.75rem 2rem',
                      borderRadius: 10, fontWeight: 700, fontSize: '0.95rem',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                      boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                      transition: 'all 0.25s',
                    }}
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => reset()}
                    style={{
                      background: 'var(--light-gray)',
                      border: '1.5px solid var(--border)',
                      color: 'var(--dark)',
                      padding: '0.75rem 1.5rem',
                      borderRadius: 10, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i < score ? colors[score - 1] : 'var(--border)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <div style={{ fontSize: '0.78rem', color: score > 0 ? colors[score - 1] : 'var(--gray)', fontWeight: 600 }}>
        {score > 0 ? labels[score - 1] : 'Enter password'}
      </div>
    </div>
  );
}
