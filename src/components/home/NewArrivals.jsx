// src/components/home/NewArrivals.jsx
// Server component - no event handlers directly here
import ProductCard from '@/components/common/ProductCard';
import Link from 'next/link';

export default function NewArrivals({ products }) {
  return (
    <section style={{ padding: '4rem 0', background: 'var(--white)' }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
          <div>
            <h2 className="section-title mb-1">New Arrivals</h2>
            <p className="section-subtitle mb-0">Fresh products just landed in our store</p>
          </div>
          <Link href="/shop" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>
            View All →
          </Link>
        </div>
        <div className="row g-3">
          {products.map(product => (
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
