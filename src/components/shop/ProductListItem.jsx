'use client';
// src/components/shop/ProductListItem.jsx
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { toast } from 'react-toastify';
import { formatUSD, truncate } from '@/utils/helpers';

export default function ProductListItem({ product }) {
  const dispatch = useDispatch();
  const discountedPrice = product.price - (product.price * product.discountPercentage) / 100;

  return (
    <div style={{
      display: 'flex', gap: '1.25rem',
      border: '1px solid var(--border)',
      borderRadius: 12, padding: '1rem',
      background: 'var(--white)',
      transition: 'all 0.25s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-hover)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <Link href={`/product/${product.id}`} style={{ flexShrink: 0 }}>
        <div style={{ width: 130, height: 110, position: 'relative', borderRadius: 8, overflow: 'hidden', background: 'var(--light-gray)' }}>
          <Image src={product.thumbnail} alt={product.title} fill style={{ objectFit: 'cover' }} sizes="130px" />
        </div>
      </Link>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'capitalize', marginBottom: 4 }}>
          {product.category}
        </div>
        <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h6 style={{ fontWeight: 700, color: 'var(--dark)', marginBottom: '0.4rem', fontSize: '1rem' }}>
            {product.title}
          </h6>
        </Link>
        <p style={{ color: 'var(--gray)', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
          {truncate(product.description, 120)}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>{formatUSD(discountedPrice)}</span>
            {product.discountPercentage > 1 && (
              <span style={{ color: 'var(--gray)', textDecoration: 'line-through', marginLeft: 8, fontSize: '0.85rem' }}>{formatUSD(product.price)}</span>
            )}
          </div>
          <div style={{ color: '#fbbf24', fontSize: '0.85rem' }}>
            {'★'.repeat(Math.round(product.rating))} <span style={{ color: 'var(--gray)' }}>{product.rating}</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center', flexShrink: 0 }}>
        <button
          onClick={() => { dispatch(addToCart({ ...product, price: discountedPrice })); toast.success('Added to cart!'); }}
          style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.5rem 1.1rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
        >
          🛒 Add to Cart
        </button>
        <button
          onClick={() => { dispatch(toggleWishlist(product)); toast.info('Wishlist updated!'); }}
          style={{ background: 'var(--light-gray)', color: 'var(--dark)', border: '1px solid var(--border)', padding: '0.5rem 1.1rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
        >
          ♡ Wishlist
        </button>
      </div>
    </div>
  );
}
