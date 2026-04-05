'use client';
// src/app/wishlist/page.jsx
import { useSelector, useDispatch } from 'react-redux';
import { selectWishlistItems, removeFromWishlist } from '@/store/slices/wishlistSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import { formatUSD } from '@/utils/helpers';

export const metadata = undefined; // client page

export default function WishlistPage() {
  const items = useSelector(selectWishlistItems);
  const dispatch = useDispatch();

  const moveToCart = (item) => {
    const price = item.price - (item.price * (item.discountPercentage || 0)) / 100;
    dispatch(addToCart({ ...item, price }));
    dispatch(removeFromWishlist(item.id));
    toast.success('Moved to cart! 🛒');
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

      <div className="container pb-5">
        {items.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '5rem' }}>♡</div>
            <h3 className="fw-bold mt-3 mb-2">Your wishlist is empty</h3>
            <p className="text-muted mb-4">Save your favourite products and shop later!</p>
            <Link href="/shop" className="btn btn-primary px-4 py-2 rounded-pill fw-bold">
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <p className="text-muted mb-4 fw-semibold">{items.length} item{items.length > 1 ? 's' : ''} saved</p>
            <div className="row g-3">
              {items.map(item => {
                const price = item.price - (item.price * (item.discountPercentage || 0)) / 100;
                return (
                  <div key={item.id} className="col-sm-6 col-md-4 col-lg-3">
                    <div className="card h-100 border" style={{ borderRadius: 12, overflow: 'hidden', transition: 'all 0.25s' }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.14)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <Link href={`/product/${item.id}`}>
                        <div style={{ position: 'relative', height: 200, background: '#f3f4f6' }}>
                          <Image src={item.thumbnail} alt={item.title} fill style={{ objectFit: 'cover' }} sizes="300px" />
                        </div>
                      </Link>
                      <div className="card-body d-flex flex-column">
                        <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'capitalize', marginBottom: 4 }}>
                          {item.category}
                        </div>
                        <Link href={`/product/${item.id}`}>
                          <h6 className="fw-bold mb-2" style={{ fontSize: '0.9rem', color: 'var(--dark)' }}>
                            {item.title}
                          </h6>
                        </Link>
                        <div className="mb-3">
                          <span className="fw-bold" style={{ color: 'var(--primary)' }}>{formatUSD(price)}</span>
                          {item.discountPercentage > 1 && (
                            <span className="text-muted text-decoration-line-through ms-2" style={{ fontSize: '0.82rem' }}>
                              {formatUSD(item.price)}
                            </span>
                          )}
                        </div>
                        <div className="d-flex gap-2 mt-auto">
                          <button onClick={() => moveToCart(item)} className="btn btn-primary btn-sm flex-fill fw-bold">
                            Move to Cart
                          </button>
                          <button
                            onClick={() => { dispatch(removeFromWishlist(item.id)); toast.info('Removed'); }}
                            className="btn btn-outline-danger btn-sm"
                          >🗑️</button>
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
