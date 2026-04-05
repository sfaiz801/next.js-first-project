'use client';
// src/app/account/dashboard/page.jsx
import { useSelector } from 'react-redux';
import { selectUser, selectIsLoggedIn } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.push('/auth/sign-in');
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const stats = [
    { label: 'Total Orders', value: '12', icon: '📦', color: '#eff6ff', border: '#bfdbfe' },
    { label: 'Wishlist Items', value: '5', icon: '♡', color: '#fef3c7', border: '#fcd34d' },
    { label: 'Reviews Given', value: '8', icon: '⭐', color: '#f0fdf4', border: '#bbf7d0' },
    { label: 'Points Earned', value: '1,240', icon: '🎁', color: '#fdf4ff', border: '#e9d5ff' },
  ];

  const quickLinks = [
    { href: '/account/orders', icon: '📦', label: 'Order History', desc: 'View and track your orders' },
    { href: '/account/profile', icon: '👤', label: 'Edit Profile', desc: 'Update your personal information' },
    { href: '/account/change-password', icon: '🔒', label: 'Change Password', desc: 'Update your account password' },
    { href: '/wishlist', icon: '♡', label: 'My Wishlist', desc: 'Products you have saved' },
  ];

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>My Account</h1>
          <ol className="breadcrumb mb-0 mt-2">
            <li className="breadcrumb-item"><Link href="/" style={{ color: 'rgba(255,255,255,0.7)' }}>Home</Link></li>
            <li className="breadcrumb-item active">Dashboard</li>
          </ol>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Welcome */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
          borderRadius: 16, padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid #bfdbfe',
          display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 800, flexShrink: 0,
          }}>
            {user?.firstName?.[0] || user?.name?.[0] || '?'}
          </div>
          <div>
            <h4 style={{ fontWeight: 800, margin: 0 }}>
              Welcome back, {user?.firstName || user?.name || 'User'}! 👋
            </h4>
            <p style={{ color: 'var(--gray)', margin: 0, fontSize: '0.9rem' }}>{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          {stats.map(s => (
            <div key={s.label} className="col-6 col-md-3">
              <div style={{
                background: s.color, border: `1.5px solid ${s.border}`,
                borderRadius: 12, padding: '1.5rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{s.value}</div>
                <div style={{ color: 'var(--gray)', fontSize: '0.82rem', fontWeight: 600 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <h5 style={{ fontWeight: 700, marginBottom: '1rem' }}>Quick Access</h5>
        <div className="row g-3">
          {quickLinks.map(l => (
            <div key={l.href} className="col-sm-6 col-lg-3">
              <Link href={l.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  border: '1.5px solid var(--border)', borderRadius: 12,
                  padding: '1.5rem', background: 'var(--white)',
                  transition: 'all 0.25s', height: '100%', textAlign: 'center',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>{l.icon}</div>
                  <div style={{ fontWeight: 700, marginBottom: '0.3rem', color: 'var(--dark)' }}>{l.label}</div>
                  <div style={{ color: 'var(--gray)', fontSize: '0.82rem' }}>{l.desc}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
