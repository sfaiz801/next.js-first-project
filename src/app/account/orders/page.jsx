'use client';
// src/app/account/orders/page.jsx
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectIsLoggedIn } from '@/store/slices/authSlice';
import { fetchOrdersByUser } from '@/utils/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatUSD, getOrderStatusColor } from '@/utils/helpers';

export default function OrderHistoryPage() {
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) { router.push('/auth/sign-in'); return; }
    fetchOrdersByUser(user?.id)
      .then(data => setOrders(data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isLoggedIn, user?.id, router]);

  if (!isLoggedIn) return null;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Order History</h1>
          <ol className="breadcrumb mb-0 mt-2">
            <li className="breadcrumb-item"><Link href="/" style={{ color: 'rgba(255,255,255,0.7)' }}>Home</Link></li>
            <li className="breadcrumb-item"><Link href="/account/dashboard" style={{ color: 'rgba(255,255,255,0.7)' }}>Account</Link></li>
            <li className="breadcrumb-item active">Orders</li>
          </ol>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--gray)' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--gray)' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>📦</div>
            <h4 style={{ fontWeight: 700 }}>No orders yet</h4>
            <p style={{ marginBottom: '1.5rem' }}>Start shopping to see your orders here!</p>
            <Link href="/shop" style={{ background: 'var(--primary)', color: 'white', padding: '0.8rem 2rem', borderRadius: 50, fontWeight: 700, textDecoration: 'none' }}>
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* Orders List */}
            <div className={selected ? 'col-lg-6' : 'col-12'}>
              <h5 style={{ fontWeight: 700, marginBottom: '1rem' }}>{orders.length} Order{orders.length > 1 ? 's' : ''}</h5>
              {orders.map(order => (
                <div
                  key={order.id}
                  onClick={() => setSelected(order.id === selected ? null : order)}
                  style={{
                    border: `2px solid ${selected?.id === order.id ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 12, padding: '1.25rem', marginBottom: '1rem',
                    cursor: 'pointer', background: selected?.id === order.id ? '#eff6ff' : 'white',
                    transition: 'all 0.25s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>Order #{order.id}</div>
                      <div style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-block',
                        background: `var(--bs-${getOrderStatusColor(order.status)}-bg, #f3f4f6)`,
                        color: order.status === 'delivered' ? '#15803d' : order.status === 'cancelled' ? '#dc2626' : order.status === 'shipped' ? '#1d4ed8' : '#92400e',
                        padding: '3px 12px', borderRadius: 50, fontWeight: 700,
                        fontSize: '0.78rem', textTransform: 'capitalize',
                        border: '1px solid currentColor',
                      }}>
                        {order.status || 'pending'}
                      </span>
                      <div style={{ fontWeight: 700, color: 'var(--primary)', marginTop: 4 }}>{formatUSD(order.total)}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {(order.items || []).slice(0, 3).map((item, i) => (
                      <img key={i} src={item.thumbnail || 'https://via.placeholder.com/40'} alt={item.title}
                        style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--border)' }} />
                    ))}
                    {order.items?.length > 3 && (
                      <div style={{ width: 40, height: 40, borderRadius: 6, background: 'var(--light-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray)' }}>
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Detail */}
            {selected && (
              <div className="col-lg-6">
                <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '1.5rem', position: 'sticky', top: 90 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h6 style={{ fontWeight: 700, margin: 0 }}>Order #{selected.id}</h6>
                    <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
                  </div>
                  {(selected.items || []).map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                      <img src={item.thumbnail || 'https://via.placeholder.com/48'} alt={item.title} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.title}</div>
                        <div style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>×{item.quantity}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>{formatUSD(item.price * item.quantity)}</div>
                    </div>
                  ))}
                  <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                    {[
                      ['Subtotal', formatUSD(selected.subtotal)],
                      ['Shipping', selected.shippingCost === 0 ? 'Free' : formatUSD(selected.shippingCost)],
                      ['Tax', formatUSD(selected.tax)],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--gray)' }}>{k}</span><span>{v}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', fontWeight: 800, color: 'var(--primary)' }}>
                      <span>Total</span><span>{formatUSD(selected.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
