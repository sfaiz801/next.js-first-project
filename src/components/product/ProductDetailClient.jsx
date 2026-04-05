'use client';
// src/components/product/ProductDetailClient.jsx
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { toast } from 'react-toastify';
import { formatUSD } from '@/utils/helpers';
import { fetchProductsByCategory } from '@/utils/api';
import ProductCard from '@/components/common/ProductCard';

export default function ProductDetailClient({ product }) {
  const dispatch = useDispatch();
  const [mainImg, setMainImg] = useState(product.images?.[0] || product.thumbnail);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState([]);
  const [activeTab, setActiveTab] = useState('description');

  const discountedPrice = product.price - (product.price * product.discountPercentage) / 100;

  useEffect(() => {
    fetchProductsByCategory(product.category, 8)
      .then(data => setRelated((data.products || []).filter(p => p.id !== product.id).slice(0, 4)));
  }, [product.category, product.id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) dispatch(addToCart({ ...product, price: discountedPrice }));
    toast.success(`${qty}x ${product.title} added to cart!`);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--light-gray)', padding: '0.75rem 0' }}>
        <div className="container">
          <nav>
            <ol className="breadcrumb mb-0" style={{ fontSize: '0.88rem' }}>
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item"><Link href="/shop">Shop</Link></li>
              <li className="breadcrumb-item">
                <Link href={`/shop?category=${product.category}`} style={{ textTransform: 'capitalize' }}>
                  {product.category.replace(/-/g, ' ')}
                </Link>
              </li>
              <li className="breadcrumb-item active" style={{ maxWidth: 200, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {product.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container" style={{ padding: '2.5rem 0' }}>
        <div className="row g-5">
          {/* Image Gallery */}
          <div className="col-lg-5">
            {/* Main Image */}
            <div style={{
              position: 'relative', aspectRatio: '1', borderRadius: 16,
              overflow: 'hidden', background: 'var(--light-gray)',
              border: '1px solid var(--border)', marginBottom: '1rem',
            }}>
              <Image src={mainImg} alt={product.title} fill style={{ objectFit: 'contain' }} sizes="500px" />
              {product.discountPercentage > 5 && (
                <span style={{
                  position: 'absolute', top: 16, left: 16,
                  background: 'var(--danger)', color: 'white',
                  padding: '4px 12px', borderRadius: 6,
                  fontWeight: 700, fontSize: '0.85rem',
                }}>
                  -{Math.round(product.discountPercentage)}% OFF
                </span>
              )}
            </div>
            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {product.images?.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setMainImg(img)}
                  style={{
                    width: 72, height: 72, borderRadius: 8, overflow: 'hidden',
                    border: `2px solid ${mainImg === img ? 'var(--primary)' : 'var(--border)'}`,
                    cursor: 'pointer', background: 'var(--light-gray)',
                    position: 'relative', transition: 'border-color 0.2s',
                  }}
                >
                  <Image src={img} alt={`img-${i}`} fill style={{ objectFit: 'cover' }} sizes="72px" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="col-lg-7">
            <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              {product.brand} · {product.category.replace(/-/g, ' ')}
            </div>
            <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
              {product.title}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ color: '#fbbf24', fontSize: '1.1rem' }}>
                {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
              </div>
              <span style={{ color: 'var(--gray)', fontSize: '0.88rem' }}>
                {product.rating} ({product.reviews?.length || 0} reviews)
              </span>
              <span style={{ color: product.stock > 0 ? 'var(--accent)' : 'var(--danger)', fontWeight: 600, fontSize: '0.85rem' }}>
                {product.stock > 0 ? `✓ In Stock (${product.stock})` : '✗ Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                {formatUSD(discountedPrice)}
              </span>
              {product.discountPercentage > 1 && (
                <span style={{ color: 'var(--gray)', textDecoration: 'line-through', marginLeft: '0.75rem', fontSize: '1.2rem' }}>
                  {formatUSD(product.price)}
                </span>
              )}
              {product.discountPercentage > 1 && (
                <span style={{
                  background: '#dcfce7', color: '#15803d',
                  padding: '3px 10px', borderRadius: 6,
                  fontWeight: 700, fontSize: '0.85rem', marginLeft: '0.75rem',
                }}>
                  You save {formatUSD(product.price - discountedPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{ color: 'var(--gray)', lineHeight: 1.8, marginBottom: '1.75rem', fontSize: '0.95rem' }}>
              {product.description}
            </p>

            {/* Quantity & Actions */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}>+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                style={{
                  background: 'var(--primary)', color: 'white', border: 'none',
                  padding: '0.75rem 2rem', borderRadius: 50, fontWeight: 700,
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  opacity: product.stock === 0 ? 0.6 : 1,
                  fontSize: '1rem', transition: 'all 0.25s',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                }}
                onMouseEnter={e => { if (product.stock > 0) e.target.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={() => { dispatch(toggleWishlist(product)); toast.info('Wishlist updated!'); }}
                style={{
                  background: 'var(--light-gray)', border: '1.5px solid var(--border)',
                  padding: '0.75rem 1.5rem', borderRadius: 50, fontWeight: 600,
                  cursor: 'pointer', fontSize: '1rem', transition: 'all 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--danger)'; e.currentTarget.style.color = 'var(--danger)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'inherit'; }}
              >
                ♡ Wishlist
              </button>
            </div>

            {/* Product Meta */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                ['SKU', product.sku],
                ['Brand', product.brand],
                ['Category', product.category?.replace(/-/g, ' ')],
                ['Availability', product.availabilityStatus],
                ['Warranty', product.warrantyInformation],
                ['Shipping', product.shippingInformation],
                ['Return Policy', product.returnPolicy],
              ].map(([label, value]) => value && (
                <div key={label} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--gray)', minWidth: 110 }}>{label}:</span>
                  <span style={{ fontWeight: 500, textTransform: label === 'Category' ? 'capitalize' : 'none' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Description / Reviews */}
        <div style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', gap: '2rem', marginBottom: '2rem' }}>
            {['description', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '0.75rem 0', fontWeight: 700,
                  fontSize: '0.95rem', textTransform: 'capitalize',
                  borderBottom: `3px solid ${activeTab === tab ? 'var(--primary)' : 'transparent'}`,
                  color: activeTab === tab ? 'var(--primary)' : 'var(--gray)',
                  marginBottom: -2, transition: 'all 0.2s',
                }}
              >
                {tab === 'reviews' ? `Reviews (${product.reviews?.length || 0})` : 'Description'}
              </button>
            ))}
          </div>

          {activeTab === 'description' ? (
            <div style={{ maxWidth: 700 }}>
              <p style={{ color: 'var(--gray)', lineHeight: 1.9, fontSize: '0.95rem' }}>{product.description}</p>
              {product.dimensions && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h6 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Dimensions</h6>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {Object.entries(product.dimensions).map(([k, v]) => (
                      <div key={k} style={{ background: 'var(--light-gray)', padding: '0.6rem 1rem', borderRadius: 8 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)', textTransform: 'capitalize' }}>{k}</div>
                        <div style={{ fontWeight: 700 }}>{v} cm</div>
                      </div>
                    ))}
                    {product.weight && (
                      <div style={{ background: 'var(--light-gray)', padding: '0.6rem 1rem', borderRadius: 8 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>Weight</div>
                        <div style={{ fontWeight: 700 }}>{product.weight} kg</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {product.tags?.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h6 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Tags</h6>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {product.tags.map(tag => (
                      <span key={tag} style={{ background: '#eff6ff', color: 'var(--primary)', padding: '3px 12px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 600 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 700 }}>
              {product.reviews?.length > 0 ? product.reviews.map((r, i) => (
                <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.reviewerName}</div>
                      <div style={{ color: '#fbbf24', fontSize: '0.88rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    </div>
                    <div style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>
                      {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <p style={{ color: 'var(--gray)', fontSize: '0.9rem', margin: 0, lineHeight: 1.7 }}>{r.comment}</p>
                </div>
              )) : (
                <p style={{ color: 'var(--gray)' }}>No reviews yet for this product.</p>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Related Products</h2>
            <p className="section-subtitle">More from {product.category.replace(/-/g, ' ')}</p>
            <div className="row g-3">
              {related.map(p => (
                <div key={p.id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
