'use client';
// src/app/checkout/page.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { selectCartItems, selectCartSubtotal, selectDiscount, clearCart } from '@/store/slices/cartSlice';
import { selectUser } from '@/store/slices/authSlice';
import { createOrder } from '@/utils/api';
import { formatUSD } from '@/utils/helpers';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STEPS = ['Shipping', 'Billing', 'Shipping Method', 'Payment', 'Review'];
const TAX_RATE = 0.08;

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const discount = useSelector(selectDiscount);
  const user = useSelector(selectUser);

  const [step, setStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [placing, setPlacing] = useState(false);
  const [orderDone, setOrderDone] = useState(null);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'India',
    }
  });

  const discountAmt = (subtotal * discount) / 100;
  const afterDiscount = subtotal - discountAmt;
  const shippingCost = shippingMethod === 'express' ? 14.99 : shippingMethod === 'overnight' ? 29.99 : afterDiscount >= 50 ? 0 : 4.99;
  const tax = afterDiscount * TAX_RATE;
  const total = afterDiscount + shippingCost + tax;

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const formData = getValues();
      const order = {
        userId: user?.id || 'guest',
        items: items.map(i => ({ id: i.id, title: i.title, price: i.price, quantity: i.quantity })),
        shipping: formData,
        shippingMethod,
        paymentMethod,
        subtotal,
        discount: discountAmt,
        shippingCost,
        tax,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      const result = await createOrder(order);
      dispatch(clearCart());
      setOrderDone(result);
      toast.success('Order placed successfully! 🎉');
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0 && !orderDone) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--gray)' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h3>Your cart is empty</h3>
        <Link href="/shop" style={{ display: 'inline-block', marginTop: '1rem', background: 'var(--primary)', color: 'white', padding: '0.7rem 2rem', borderRadius: 50, fontWeight: 700, textDecoration: 'none' }}>
          Shop Now
        </Link>
      </div>
    );
  }

  if (orderDone) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>✅</div>
        <h2 style={{ fontWeight: 800, color: 'var(--dark)', marginBottom: '0.75rem' }}>Order Placed Successfully!</h2>
        <p style={{ color: 'var(--gray)', marginBottom: '0.5rem' }}>Thank you for your order.</p>
        <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>
          Order ID: <strong style={{ color: 'var(--primary)' }}>#{orderDone.id}</strong>
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/account/orders" style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 2rem', borderRadius: 50, fontWeight: 700, textDecoration: 'none' }}>
            View Orders
          </Link>
          <Link href="/shop" style={{ background: 'var(--light-gray)', color: 'var(--dark)', padding: '0.75rem 2rem', borderRadius: 50, fontWeight: 700, textDecoration: 'none', border: '1.5px solid var(--border)' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Checkout</h1>
          <ol className="breadcrumb mb-0 mt-2">
            <li className="breadcrumb-item"><Link href="/" style={{ color: 'rgba(255,255,255,0.7)' }}>Home</Link></li>
            <li className="breadcrumb-item"><Link href="/cart" style={{ color: 'rgba(255,255,255,0.7)' }}>Cart</Link></li>
            <li className="breadcrumb-item active">Checkout</li>
          </ol>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Steps */}
        <div className="checkout-steps mb-4 d-none d-md-flex">
          {STEPS.map((s, i) => (
            <>
              <div key={s} className={`step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                <div className="step-num">{i < step ? '✓' : i + 1}</div>
                <span>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div key={`div-${i}`} className={`step-divider ${i < step ? 'done' : ''}`} />}
            </>
          ))}
        </div>
        <div className="d-md-none mb-3" style={{ fontWeight: 600, color: 'var(--primary)' }}>
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </div>

        <div className="row g-4">
          {/* Form Area */}
          <div className="col-lg-7">
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.75rem' }}>

              {/* Step 0: Shipping */}
              {step === 0 && (
                <div>
                  <h5 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>📦 Shipping Information</h5>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="form-label">First Name *</label>
                      <input {...register('firstName', { required: 'Required' })} className="form-control" placeholder="John" />
                      {errors.firstName && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 4 }}>{errors.firstName.message}</div>}
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Last Name *</label>
                      <input {...register('lastName', { required: 'Required' })} className="form-control" placeholder="Doe" />
                      {errors.lastName && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 4 }}>{errors.lastName.message}</div>}
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Email *</label>
                      <input {...register('email', { required: 'Required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} className="form-control" placeholder="john@example.com" />
                      {errors.email && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 4 }}>{errors.email.message}</div>}
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Phone *</label>
                      <input {...register('phone', { required: 'Required' })} className="form-control" placeholder="+91 9876543210" />
                      {errors.phone && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 4 }}>{errors.phone.message}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label">Address *</label>
                      <input {...register('address', { required: 'Required' })} className="form-control" placeholder="123 Street Name, Area" />
                      {errors.address && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 4 }}>{errors.address.message}</div>}
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">City *</label>
                      <input {...register('city', { required: 'Required' })} className="form-control" placeholder="Mumbai" />
                      {errors.city && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 4 }}>{errors.city.message}</div>}
                    </div>
                    <div className="col-sm-3">
                      <label className="form-label">State *</label>
                      <input {...register('state', { required: 'Required' })} className="form-control" placeholder="MH" />
                    </div>
                    <div className="col-sm-3">
                      <label className="form-label">PIN Code *</label>
                      <input {...register('zip', { required: 'Required' })} className="form-control" placeholder="400001" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Country</label>
                      <select {...register('country')} className="form-control">
                        <option>India</option><option>USA</option><option>UK</option><option>UAE</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Billing */}
              {step === 1 && (
                <div>
                  <h5 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>💳 Billing Information</h5>
                  <div style={{ background: 'var(--light-gray)', borderRadius: 8, padding: '1rem', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--gray)' }}>
                    ✓ Same as shipping address
                  </div>
                  <p style={{ color: 'var(--gray)' }}>Your billing address matches your shipping address. If different, please contact support.</p>
                </div>
              )}

              {/* Step 2: Shipping Method */}
              {step === 2 && (
                <div>
                  <h5 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>🚚 Shipping Method</h5>
                  {[
                    { value: 'standard', label: 'Standard Shipping', time: '5–7 business days', price: afterDiscount >= 50 ? 'Free' : '$4.99' },
                    { value: 'express', label: 'Express Shipping', time: '2–3 business days', price: '$14.99' },
                    { value: 'overnight', label: 'Overnight Delivery', time: 'Next business day', price: '$29.99' },
                  ].map(opt => (
                    <label key={opt.value} style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      border: `2px solid ${shippingMethod === opt.value ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 10, padding: '1rem', marginBottom: '0.75rem',
                      cursor: 'pointer', transition: 'border-color 0.2s',
                      background: shippingMethod === opt.value ? '#eff6ff' : 'white',
                    }}>
                      <input type="radio" name="shippingMethod" value={opt.value} checked={shippingMethod === opt.value} onChange={e => setShippingMethod(e.target.value)} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{opt.label}</div>
                        <div style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>{opt.time}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: opt.price === 'Free' ? '#15803d' : 'var(--dark)' }}>{opt.price}</div>
                    </label>
                  ))}
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div>
                  <h5 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>💰 Payment Method</h5>
                  {[
                    { value: 'card', label: 'Credit / Debit Card', icon: '💳' },
                    { value: 'upi', label: 'UPI Payment', icon: '📱' },
                    { value: 'netbanking', label: 'Net Banking', icon: '🏦' },
                    { value: 'wallet', label: 'Digital Wallet', icon: '👜' },
                    { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
                  ].map(opt => (
                    <label key={opt.value} style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      border: `2px solid ${paymentMethod === opt.value ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 10, padding: '1rem', marginBottom: '0.75rem',
                      cursor: 'pointer', transition: 'border-color 0.2s',
                      background: paymentMethod === opt.value ? '#eff6ff' : 'white',
                    }}>
                      <input type="radio" name="paymentMethod" value={opt.value} checked={paymentMethod === opt.value} onChange={e => setPaymentMethod(e.target.value)} />
                      <span style={{ fontSize: '1.4rem' }}>{opt.icon}</span>
                      <span style={{ fontWeight: 600 }}>{opt.label}</span>
                      {opt.value !== 'cod' && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--gray)', background: 'var(--light-gray)', padding: '2px 8px', borderRadius: 4 }}>UI Only</span>}
                    </label>
                  ))}
                  <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#92400e', marginTop: '0.5rem' }}>
                    🔒 Payment is UI-only for demo. No real transaction will be processed.
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <div>
                  <h5 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>📋 Order Review</h5>
                  <div style={{ marginBottom: '1.5rem' }}>
                    {items.map(item => (
                      <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                        <img src={item.thumbnail} alt={item.title} style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</div>
                          <div style={{ color: 'var(--gray)', fontSize: '0.82rem' }}>Qty: {item.quantity}</div>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatUSD(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'var(--light-gray)', borderRadius: 10, padding: '1rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span>Shipping Method</span>
                      <strong style={{ textTransform: 'capitalize' }}>{shippingMethod}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Payment</span>
                      <strong style={{ textTransform: 'capitalize' }}>{paymentMethod}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '1rem' }}>
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)} style={{ background: 'var(--light-gray)', border: '1.5px solid var(--border)', padding: '0.7rem 1.5rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                    ← Back
                  </button>
                )}
                {step < STEPS.length - 1 ? (
                  <button
                    onClick={step === 0 ? handleSubmit(() => setStep(s => s + 1)) : () => setStep(s => s + 1)}
                    style={{ marginLeft: 'auto', background: 'var(--primary)', color: 'white', border: 'none', padding: '0.7rem 2rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={placeOrder}
                    disabled={placing}
                    style={{ marginLeft: 'auto', background: '#15803d', color: 'white', border: 'none', padding: '0.7rem 2rem', borderRadius: 8, fontWeight: 700, cursor: placing ? 'not-allowed' : 'pointer', opacity: placing ? 0.7 : 1 }}
                  >
                    {placing ? 'Placing Order...' : '✓ Place Order'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="col-lg-5">
            <div className="order-summary-box">
              <h6 style={{ fontWeight: 700, marginBottom: '1rem' }}>Order Summary ({items.length} items)</h6>
              <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: '1rem' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                    <img src={item.thumbnail} alt={item.title} style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }} />
                    <div style={{ flex: 1, fontSize: '0.82rem' }}>
                      <div style={{ fontWeight: 600 }}>{item.title}</div>
                      <div style={{ color: 'var(--gray)' }}>×{item.quantity}</div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary)' }}>{formatUSD(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-row"><span>Subtotal</span><span>{formatUSD(subtotal)}</span></div>
              {discount > 0 && <div className="summary-row" style={{ color: '#15803d' }}><span>Discount</span><span>−{formatUSD((subtotal * discount) / 100)}</span></div>}
              <div className="summary-row"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : formatUSD(shippingCost)}</span></div>
              <div className="summary-row"><span>Tax</span><span>{formatUSD(tax)}</span></div>
              <div className="summary-row total"><span>Total</span><span>{formatUSD(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
