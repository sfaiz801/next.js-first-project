// src/components/home/FeaturedProducts.jsx
import ProductCard from '@/components/common/ProductCard';

export default function FeaturedProducts({ products }) {
  return (
    <section style={{ padding: '4rem 0', background: 'var(--light-gray)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Handpicked just for you — trending right now</p>
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
