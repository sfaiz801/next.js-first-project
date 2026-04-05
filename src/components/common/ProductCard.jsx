'use client';
// src/components/common/ProductCard.jsx
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { selectWishlistItems } from '@/store/slices/wishlistSlice';
import { toast } from 'react-toastify';
import { formatUSD, truncate } from '@/utils/helpers';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const isWishlisted = wishlistItems.some(i => i.id === product.id);

  const discountedPrice = product.price - (product.price * product.discountPercentage) / 100;

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ ...product, price: discountedPrice }));
    toast.success(`${product.title} added to cart!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    toast.info(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ♡');
  };

  return (
    <div className="product-card h-100">
      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div className="product-img-wrap">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{ objectFit: 'cover' }}
          />
          {product.discountPercentage > 5 && (
            <span className="product-badge">-{Math.round(product.discountPercentage)}%</span>
          )}
          <div className="product-actions">
            <button onClick={handleAddToCart}>🛒 Add to Cart</button>
            <button className="wishlist-btn" onClick={handleWishlist}>
              {isWishlisted ? '❤️' : '♡'} Wishlist
            </button>
          </div>
        </div>
        <div className="product-body">
          <div className="product-category">{product.category}</div>
          <h6 className="product-name">{truncate(product.title, 50)}</h6>
          <div className="star-rating mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < Math.round(product.rating) ? '' : 'empty'}`}>★</span>
            ))}
            <small style={{ color: 'var(--gray)', marginLeft: 4 }}>({product.reviews?.length || 0})</small>
          </div>
          <div className="product-price">
            {formatUSD(discountedPrice)}
            {product.discountPercentage > 1 && (
              <span className="original-price">{formatUSD(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
