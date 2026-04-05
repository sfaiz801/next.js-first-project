'use client';
// src/components/home/FeaturedCategories.jsx
import Link from 'next/link';

const categoryIcons = {
  smartphones: '📱', laptops: '💻', fragrances: '🌸', skincare: '🧴',
  groceries: '🛒', 'home-decoration': '🏠', furniture: '🛋️', tops: '👕',
  'womens-dresses': '👗', 'womens-shoes': '👠', 'mens-shirts': '👔',
  'mens-shoes': '👟', 'mens-watches': '⌚', 'womens-watches': '💎',
  'womens-bags': '👜', 'womens-jewellery': '💍', sunglasses: '🕶️',
  automotive: '🚗', motorcycle: '🏍️', lighting: '💡',
};

function CategoryCard({ icon, name, slug }) {
  return (
    <Link href={`/shop?category=${slug}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          border: '1.5px solid var(--border)',
          borderRadius: 12,
          padding: '1.5rem 1rem',
          textAlign: 'center',
          transition: 'all 0.25s',
          background: 'var(--white)',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.background = '#eff6ff';
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.14)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.background = 'var(--white)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{ fontSize: '2.2rem', marginBottom: '0.6rem' }}>{icon}</div>
        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--dark)', textTransform: 'capitalize' }}>
          {name.replace(/-/g, ' ')}
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedCategories({ categories }) {
  return (
    <section style={{ padding: '4rem 0', background: 'var(--white)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Find exactly what you're looking for</p>
        </div>
        <div className="row g-3">
          {categories.map((cat) => {
            const slug = typeof cat === 'string' ? cat : cat.slug;
            const name = typeof cat === 'string' ? cat : cat.name;
            const icon = categoryIcons[slug] || '📦';
            return (
              <div key={slug} className="col-6 col-sm-4 col-md-3 col-lg-3">
                <CategoryCard icon={icon} name={name} slug={slug} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
