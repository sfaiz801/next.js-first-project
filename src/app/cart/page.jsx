'use client';
// src/app/cart/page.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartSubtotal, selectDiscount, selectCoupon, removeFromCart, updateQuantity, applyCoupon, clearCart } from '@/store/slices/cartSlice';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import { formatUSD } from '@/utils/helpers';
import { useRouter } from 'next/navigation';

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 4.99;
const TAX_RATE = 0.08;

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const discount = useSelector(selectDiscount);
  const coupon = useSelector(selectCoupon);
  const [couponInput, setCouponInput] = useState('');

  const discountAmt = (subtotal * discount) / 100;
  const afterDiscount = subtotal - discountAmt;
  const shipping = afterDiscount >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = afterDiscount * TAX_RATE;
  const total = afterDiscount + shipping + tax;

  const handleCoupon = () => {
    if (!couponInput.trim()) return;
    dispatch(applyCoupon(couponInput));
    const codes = ['SAVE10', 'SAVE20', 'FLAT50'];
    if (codes.includes(couponInput.toUpperCase())) {
      toast.success(`Coupon "${couponInput.toUpperCase()}" applied!`);
    } else {
      toast.error('Invalid coupon code.');
    }
    setCouponInput('');
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Shopping Cart</h1>
          <ol className="breadcrumb mb-0 mt-2">
            <li className="breadcrumb-item"><Link href="/" style={{ color: 'rgba(255,255,255,0.7)' }}>Home</Link></li>
            <li className="breadcrumb-item active">Cart</li>
          </ol>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--gray)' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🛒</div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Your cart is empty</h3>
            <p style={{ marginBottom: '2rem' }}>Add some products and come back here!</p>
            <Link href="/shop" style={{ background: 'var(--primary)', color: 'white', padding: '0.8rem 2.5rem', borderRadius: 50, fontWeight: 700, textDecoration: 'none' }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* Cart Items */}
            <div className="col-lg-8">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h5 style={{ margin: 0, fontWeight: 700 }}>{items.length} item{items.length > 1 ? 's' : ''}</h5>
                <button
                  onClick={() => { dispatch(clearCart()); toast.info('Cart cleared'); }}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem' }}
                >
                  🗑️ Clear All
                </button>
              </div>

              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link href={`/product/${item.id}`} style={{ flexShrink: 0 }}>
                      <Image src={item.thumbnail} alt={item.title} width={90} height={90} style={{ borderRadius: 8, objectFit: 'cover' }} />
                    </Link>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'capitalize', marginBottom: 2 }}>{item.category}</div>
                      <Link href={`/product/${item.id}`} style={{ textDecoration: 'none' }}>
                        <h6 style={{ fontWeight: 700, color: 'var(--dark)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>{item.title}</h6>
                      </Link>
                      <div style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '0.5rem' }}>{formatUSD(item.price)}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div className="qty-control">
                          <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>+</button>
                        </div>
                        <span style={{ color: 'var(--gray)', fontSize: '0.88rem' }}>
                          Subtotal: <strong style={{ color: 'var(--dark)' }}>{formatUSD(item.price * item.quantity)}</strong>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => { dispatch(removeFromCart(item.id)); toast.info('Item removed'); }}
                      style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: '1.1rem', flexShrink: 0 }}
                      title="Remove"
                    >🗑️</button>
                  </div>
                </div>
              ))}

              {/* Coupon */}
              <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', marginTop: '1.5rem' }}>
                <h6 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>🏷️ Apply Coupon Code</h6>
                <p style={{ fontSize: '0.82rem', color: 'var(--gray)', marginBottom: '0.75rem' }}>
                  Try: <strong>SAVE10</strong>, <strong>SAVE20</strong>, or <strong>FLAT50</strong>
                </p>
                {coupon && (
                  <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.5rem 1rem', borderRadius: 8, marginBottom: '0.75rem', fontSize: '0.88rem', fontWeight: 600 }}>
                    ✓ Coupon "{coupon}" applied — {discount}% off!
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    placeholder="Enter coupon code"
                    className="form-control"
                    onKeyDown={e => e.key === 'Enter' && handleCoupon()}
                  />
                  <button onClick={handleCoupon} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Apply
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <Link href="/shop" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="order-summary-box">
                <h5 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Order Summary</h5>
                <div className="summary-row"><span>Subtotal</span><span>{formatUSD(subtotal)}</span></div>
                {discount > 0 && <div className="summary-row" style={{ color: '#15803d' }}><span>Discount ({discount}%)</span><span>−{formatUSD(discountAmt)}</span></div>}
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span style={{ color: '#15803d' }}>Free</span> : formatUSD(shipping)}</span>
                </div>
                {shipping > 0 && <div style={{ fontSize: '0.78rem', color: 'var(--gray)', marginBottom: '0.5rem' }}>Add {formatUSD(SHIPPING_THRESHOLD - afterDiscount)} more for free shipping</div>}
                <div className="summary-row"><span>Tax (8%)</span><span>{formatUSD(tax)}</span></div>
                <div className="summary-row total"><span>Total</span><span>{formatUSD(total)}</span></div>
                <button
                  onClick={() => router.push('/checkout')}
                  style={{
                    width: '100%', background: 'var(--primary)', color: 'white',
                    border: 'none', padding: '0.9rem', borderRadius: 12,
                    fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                    marginTop: '1rem', transition: 'all 0.25s',
                    boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                  }}
                  onMouseEnter={e => e.target.style.background = 'var(--primary-dark)'}
                  onMouseLeave={e => e.target.style.background = 'var(--primary)'}
                >
                  Proceed to Checkout →
                </button>
                <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--gray)' }}>
                  🔒 Secure checkout · SSL encrypted
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
