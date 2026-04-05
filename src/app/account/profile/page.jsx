'use client';
// src/app/account/profile/page.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectIsLoggedIn, updateUser } from '@/store/slices/authSlice';
import { updateUserApi } from '@/utils/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) router.push('/auth/sign-in');
  }, [isLoggedIn, router]);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      zip: user?.zip || '',
      country: user?.country || 'India',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const updated = await updateUserApi(user.id, data);
      dispatch(updateUser(updated));
      toast.success('Profile updated successfully! ✅');
    } catch {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Edit Profile</h1>
          <ol className="breadcrumb mb-0 mt-2">
            <li className="breadcrumb-item"><Link href="/" style={{ color: 'rgba(255,255,255,0.7)' }}>Home</Link></li>
            <li className="breadcrumb-item"><Link href="/account/dashboard" style={{ color: 'rgba(255,255,255,0.7)' }}>Account</Link></li>
            <li className="breadcrumb-item active">Profile</li>
          </ol>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <AccountSidebar active="profile" />
          </div>

          {/* Main Form */}
          <div className="col-lg-9">
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
              {/* Avatar Section */}
              <div style={{
                background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                padding: '2rem',
                display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap',
                borderBottom: '1px solid var(--border)',
              }}>
                <div style={{
                  width: 88, height: 88, borderRadius: '50%',
                  background: 'var(--primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.5rem', fontWeight: 800,
                  boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                  flexShrink: 0,
                }}>
                  {user?.firstName?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <h5 style={{ fontWeight: 800, margin: 0 }}>
                    {user?.firstName} {user?.lastName}
                  </h5>
                  <p style={{ color: 'var(--gray)', margin: '0.25rem 0 0.75rem', fontSize: '0.9rem' }}>{user?.email}</p>
                  <span style={{
                    background: '#dcfce7', color: '#15803d',
                    padding: '3px 12px', borderRadius: 50,
                    fontWeight: 700, fontSize: '0.78rem',
                    border: '1px solid #bbf7d0',
                  }}>✓ Verified Account</span>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '2rem' }}>
                {/* Personal Info */}
                <h6 style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--dark)', fontSize: '1rem' }}>
                  👤 Personal Information
                </h6>
                <div className="row g-3 mb-4">
                  <div className="col-sm-6">
                    <label className="form-label">First Name</label>
                    <input className="form-control" placeholder="John" {...register('firstName', { required: 'Required' })} />
                    {errors.firstName && <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}>{errors.firstName.message}</div>}
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Last Name</label>
                    <input className="form-control" placeholder="Doe" {...register('lastName', { required: 'Required' })} />
                    {errors.lastName && <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}>{errors.lastName.message}</div>}
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email" className="form-control" placeholder="you@example.com"
                      {...register('email', {
                        required: 'Required',
                        pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
                      })}
                    />
                    {errors.email && <div style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}>{errors.email.message}</div>}
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-control" placeholder="+91 9876543210" {...register('phone')} />
                  </div>
                </div>

                {/* Address */}
                <h6 style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--dark)', fontSize: '1rem' }}>
                  📍 Address
                </h6>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Street Address</label>
                    <input className="form-control" placeholder="123 Street Name, Area" {...register('address')} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">City</label>
                    <input className="form-control" placeholder="Mumbai" {...register('city')} />
                  </div>
                  <div className="col-sm-3">
                    <label className="form-label">State</label>
                    <input className="form-control" placeholder="MH" {...register('state')} />
                  </div>
                  <div className="col-sm-3">
                    <label className="form-label">PIN Code</label>
                    <input className="form-control" placeholder="400001" {...register('zip')} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Country</label>
                    <select className="form-control" {...register('country')}>
                      <option>India</option>
                      <option>USA</option>
                      <option>UK</option>
                      <option>UAE</option>
                      <option>Canada</option>
                    </select>
                  </div>
                </div>

                {/* Submit */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    disabled={loading || !isDirty}
                    style={{
                      background: 'var(--primary)', color: 'white',
                      border: 'none', padding: '0.75rem 2rem',
                      borderRadius: 10, fontWeight: 700, fontSize: '0.95rem',
                      cursor: loading || !isDirty ? 'not-allowed' : 'pointer',
                      opacity: loading || !isDirty ? 0.6 : 1,
                      transition: 'all 0.25s',
                      boxShadow: loading || !isDirty ? 'none' : '0 4px 14px rgba(37,99,235,0.3)',
                    }}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <Link href="/account/dashboard" style={{
                    background: 'var(--light-gray)',
                    border: '1.5px solid var(--border)',
                    color: 'var(--dark)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: 10, fontWeight: 600,
                    textDecoration: 'none', fontSize: '0.95rem',
                    display: 'inline-flex', alignItems: 'center',
                  }}>
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Reusable Account Sidebar
export function AccountSidebar({ active }) {
  const links = [
    { href: '/account/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/account/orders', icon: '📦', label: 'Order History' },
    { href: '/account/profile', icon: '👤', label: 'Edit Profile' },
    { href: '/account/change-password', icon: '🔒', label: 'Change Password' },
    { href: '/wishlist', icon: '♡', label: 'Wishlist' },
    { href: '/cart', icon: '🛒', label: 'Cart' },
  ];

  return (
    <div style={{
      background: 'white', border: '1px solid var(--border)',
      borderRadius: 12, overflow: 'hidden',
      position: 'sticky', top: 90,
    }}>
      {links.map(l => {
        const isActive = active && l.href.includes(active);
        return (
          <Link key={l.href} href={l.href} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.9rem 1.25rem',
            borderLeft: `3px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
            background: isActive ? '#eff6ff' : 'transparent',
            color: isActive ? 'var(--primary)' : 'var(--dark)',
            fontWeight: isActive ? 700 : 500,
            fontSize: '0.9rem',
            textDecoration: 'none',
            borderBottom: '1px solid var(--border)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--light-gray)'; } }}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; } }}
          >
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
