'use client';
// src/app/account/dashboard/page.jsx
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectIsLoggedIn } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const router = useRouter();

  useEffect(() => { if (!isLoggedIn) router.push('/auth/sign-in'); }, [isLoggedIn, router]);
  if (!isLoggedIn) return null;

  const stats = [
    { label: 'Total Orders', value: '12', icon: '📦', bg: '#eff6ff', border: '#bfdbfe' },
    { label: 'Wishlist Items', value: '5', icon: '♡', bg: '#fef3c7', border: '#fcd34d' },
    { label: 'Reviews Given', value: '8', icon: '⭐', bg: '#f0fdf4', border: '#bbf7d0' },
    { label: 'Points Earned', value: '1,240', icon: '🎁', bg: '#fdf4ff', border: '#e9d5ff' },
  ];

  const quickLinks = [
    { href: '/account/orders', icon: '📦', label: 'Order History', desc: 'View and track your orders' },
    { href: '/account/profile', icon: '👤', label: 'Edit Profile', desc: 'Update your personal info' },
    { href: '/account/change-password', icon: '🔒', label: 'Change Password', desc: 'Update your password' },
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
      <div className="container pb-5">
        {/* Welcome */}
        <div className="d-flex align-items-center gap-3 p-4 rounded-4 mb-4 flex-wrap"
          style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1px solid #bfdbfe' }}>
          <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, flexShrink: 0 }}>
            {user?.firstName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h4 className="fw-bold mb-0">Welcome back, {user?.firstName || 'User'}! 👋</h4>
            <p className="text-muted mb-0">{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          {stats.map(s => (
            <div key={s.label} className="col-6 col-md-3">
              <div className="text-center p-3 rounded-3 h-100" style={{ background: s.bg, border: `1.5px solid ${s.border}` }}>
                <div style={{ fontSize: '2rem' }}>{s.icon}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{s.value}</div>
                <div className="text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <h5 className="fw-bold mb-3">Quick Access</h5>
        <div className="row g-3">
          {quickLinks.map(l => (
            <div key={l.href} className="col-sm-6 col-lg-3">
              <Link href={l.href} className="text-decoration-none">
                <div className="border rounded-3 p-3 text-center h-100 bg-white"
                  style={{ transition: 'all 0.25s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{l.icon}</div>
                  <div className="fw-bold mb-1" style={{ color: 'var(--dark)' }}>{l.label}</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>{l.desc}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
