'use client';
// src/app/wishlist/page.jsx
import { useSelector, useDispatch } from 'react-redux';
import { selectWishlistItems, removeFromWishlist } from '@/store/slices/wishlistSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import { formatUSD } from '@/utils/helpers';

export default function WishlistPage() {
  const items = useSelector(selectWishlistItems);
  const dispatch = useDispatch();

  const moveToCart = (item) => {
    const discountedPrice = item.price - (item.price * item.discountPercentage) / 100;
    dispatch(addToCart({ ...item, price: discountedPrice }));
    dispatch(removeFromWishlist(item.id));
    toast.success('Moved to cart!');
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>My Wishlist</h1>
          <ol className="breadcrumb mb-0 mt-2">
            <li className="breadcrumb-item"><Link href="/" style={{ color: 'rgba(255,255,255,0.7)' }}>Home</Link></li>
            <li className="breadcrumb-item active">Wishlist</li>
          </ol>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--gray)' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>♡</div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Your wishlist is empty</h3>
            <p style={{ marginBottom: '2rem' }}>Save your favourite products here and shop later!</p>
            <Link href="/shop" style={{
              background: 'var(--primary)', color: 'white',
              padding: '0.8rem 2.5rem', borderRadius: 50,
              fontWeight: 700, textDecoration: 'none',
            }}>Browse Products</Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h5 style={{ margin: 0, fontWeight: 700 }}>{items.length} item{items.length > 1 ? 's' : ''} in your wishlist</h5>
            </div>
            <div className="row g-3">
              {items.map(item => {
                const discountedPrice = item.price - (item.price * item.discountPercentage) / 100;
                return (
                  <div key={item.id} className="col-md-6 col-lg-4">
                    <div style={{
                      border: '1px solid var(--border)', borderRadius: 12,
                      overflow: 'hidden', background: 'var(--white)',
                      transition: 'all 0.25s', height: '100%',
                    }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-hover)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <Link href={`/product/${item.id}`}>
                        <div style={{ position: 'relative', height: 220, background: 'var(--light-gray)' }}>
                          <Image src={item.thumbnail} alt={item.title} fill style={{ objectFit: 'cover' }} sizes="400px" />
                        </div>
                      </Link>
                      <div style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'capitalize', marginBottom: 4 }}>
                          {item.category}
                        </div>
                        <Link href={`/product/${item.id}`} style={{ textDecoration: 'none' }}>
                          <h6 style={{ fontWeight: 700, color: 'var(--dark)', marginBottom: '0.6rem' }}>{item.title}</h6>
                        </Link>
                        <div style={{ marginBottom: '1rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>{formatUSD(discountedPrice)}</span>
                          {item.discountPercentage > 1 && (
                            <span style={{ color: 'var(--gray)', textDecoration: 'line-through', marginLeft: 8, fontSize: '0.85rem' }}>{formatUSD(item.price)}</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => moveToCart(item)}
                            style={{
                              flex: 1, background: 'var(--primary)', color: 'white', border: 'none',
                              padding: '0.55rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
                            }}
                          >
                            Move to Cart
                          </button>
                          <button
                            onClick={() => { dispatch(removeFromWishlist(item.id)); toast.info('Removed from wishlist'); }}
                            style={{
                              background: 'var(--light-gray)', border: '1px solid var(--border)',
                              padding: '0.55rem 0.75rem', borderRadius: 8, cursor: 'pointer', fontSize: '1rem',
                            }}
                            title="Remove"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
