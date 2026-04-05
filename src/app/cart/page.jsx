'use client';
// src/app/cart/page.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems, selectCartSubtotal, selectDiscount, selectCoupon,
  removeFromCart, updateQuantity, applyCoupon, clearCart
} from '@/store/slices/cartSlice';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatUSD } from '@/utils/helpers';

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
  const shipping = afterDiscount >= 50 ? 0 : afterDiscount === 0 ? 0 : 4.99;
  const tax = afterDiscount * 0.08;
  const total = afterDiscount + shipping + tax;

  const handleCoupon = () => {
    if (!couponInput.trim()) return;
    dispatch(applyCoupon(couponInput));
    const valid = ['SAVE10', 'SAVE20', 'FLAT50'];
    if (valid.includes(couponInput.toUpperCase())) {
      toast.success(`✅ Coupon "${couponInput.toUpperCase()}" applied!`);
    } else {
      toast.error('❌ Invalid coupon code');
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

      <div className="container pb-5">
        {items.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '5rem' }}>🛒</div>
            <h3 className="fw-bold mt-3 mb-2">Your cart is empty</h3>
            <p className="text-muted mb-4">Add some products and come back!</p>
            <Link href="/shop" className="btn btn-primary px-4 py-2 rounded-pill fw-bold">Continue Shopping</Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* Cart Items */}
            <div className="col-lg-8">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">{items.length} item{items.length > 1 ? 's' : ''}</h5>
                <button onClick={() => { dispatch(clearCart()); toast.info('Cart cleared'); }}
                  className="btn btn-sm btn-outline-danger">🗑️ Clear All</button>
              </div>

              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="d-flex gap-3 align-items-start">
                    <Link href={`/product/${item.id}`} style={{ flexShrink: 0 }}>
                      <Image src={item.thumbnail} alt={item.title} width={90} height={90}
                        style={{ borderRadius: 8, objectFit: 'cover' }} />
                    </Link>
                    <div className="flex-fill">
                      <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'capitalize' }}>{item.category}</div>
                      <Link href={`/product/${item.id}`}>
                        <h6 className="fw-bold mb-1 mt-1" style={{ color: 'var(--dark)', fontSize: '0.95rem' }}>{item.title}</h6>
                      </Link>
                      <div className="fw-bold mb-2" style={{ color: 'var(--primary)' }}>{formatUSD(item.price)}</div>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <div className="qty-control">
                          <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>+</button>
                        </div>
                        <span className="text-muted" style={{ fontSize: '0.88rem' }}>
                          Total: <strong style={{ color: 'var(--dark)' }}>{formatUSD(item.price * item.quantity)}</strong>
                        </span>
                      </div>
                    </div>
                    <button onClick={() => { dispatch(removeFromCart(item.id)); toast.info('Item removed'); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', fontSize: '1.1rem' }}>🗑️</button>
                  </div>
                </div>
              ))}

              {/* Coupon */}
              <div className="border rounded-3 p-3 mt-3">
                <h6 className="fw-bold mb-1">🏷️ Coupon Code</h6>
                <p className="text-muted mb-2" style={{ fontSize: '0.82rem' }}>Try: <strong>SAVE10</strong>, <strong>SAVE20</strong>, <strong>FLAT50</strong></p>
                {coupon && (
                  <div className="alert alert-success py-2 mb-2" style={{ fontSize: '0.88rem' }}>
                    ✓ Coupon "{coupon}" applied — {discount}% off!
                  </div>
                )}
                <div className="d-flex gap-2">
                  <input type="text" value={couponInput} onChange={e => setCouponInput(e.target.value)}
                    placeholder="Enter coupon code" className="form-control"
                    onKeyDown={e => e.key === 'Enter' && handleCoupon()} />
                  <button onClick={handleCoupon} className="btn btn-primary fw-bold px-3">Apply</button>
                </div>
              </div>

              <div className="mt-3">
                <Link href="/shop" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="order-summary-box">
                <h5 className="fw-bold mb-3">Order Summary</h5>
                <div className="summary-row"><span>Subtotal</span><span>{formatUSD(subtotal)}</span></div>
                {discount > 0 && (
                  <div className="summary-row" style={{ color: '#15803d' }}>
                    <span>Discount ({discount}%)</span><span>−{formatUSD(discountAmt)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span style={{ color: '#15803d' }}>Free</span> : formatUSD(shipping)}</span>
                </div>
                {shipping > 0 && <small className="text-muted d-block mb-1">Add {formatUSD(50 - afterDiscount)} more for free shipping</small>}
                <div className="summary-row"><span>Tax (8%)</span><span>{formatUSD(tax)}</span></div>
                <div className="summary-row total"><span>Total</span><span>{formatUSD(total)}</span></div>
                <button onClick={() => router.push('/checkout')}
                  className="btn btn-primary w-100 fw-bold py-2 mt-3 rounded-3"
                  style={{ fontSize: '1rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
                  Proceed to Checkout →
                </button>
                <div className="text-center mt-2" style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>
                  🔒 Secure SSL checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
