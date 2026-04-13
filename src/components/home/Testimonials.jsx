'use client';
// src/components/home/Testimonials.jsx
const reviews = [
  { name: 'Aarav Sharma', role: 'Verified Buyer', rating: 5, text: 'Amazing quality products and super fast delivery! I ordered a smartphone and it arrived in just 2 days. Will definitely shop again.', avatar: '👨‍💼' },
  { name: 'Priya Mehta', role: 'Regular Customer', rating: 5, text: 'ClassicMart has the best collection of skincare products. The prices are unbeatable and customer support is very responsive.', avatar: '👩‍🦰' },
  { name: 'Rohan Verma', role: 'Verified Buyer', rating: 4, text: 'Great experience overall. The product exactly matched the description. Packaging was also very secure. Highly recommended!', avatar: '🧑‍💻' },
  { name: 'Anjali Singh', role: 'Loyal Shopper', rating: 5, text: 'I have been shopping here for 2 years now. Never had a bad experience. The return policy is also very hassle-free.', avatar: '👩‍🎓' },
];

function TestimonialCard({ r }) {
  return (
    <div
      style={{
        background: 'var(--white)',
        borderRadius: 12,
        padding: '1.75rem',
        height: '100%',
        border: '1px solid var(--border)',
        transition: 'all 0.25s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.14)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ color: '#fbbf24', marginBottom: '0.75rem', fontSize: '1rem' }}>
        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
      </div>
      <p style={{ color: 'var(--gray)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
        "{r.text}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'var(--light-gray)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem',
        }}>{r.avatar}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark)' }}>{r.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>{r.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section style={{ padding: '4rem 0', background: 'var(--light-gray)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Trusted by over 1 million happy shoppers</p>
        </div>
        <div className="row g-4">
          {reviews.map((r, i) => (
            <div key={i} className="col-md-6 col-lg-3">
              <TestimonialCard r={r} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
