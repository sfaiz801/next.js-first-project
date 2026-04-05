'use client';
// src/components/shop/ShopFilters.jsx
import { useState } from 'react';

export default function ShopFilters({ categories, filters, onChange }) {
  const [open, setOpen] = useState(true); // mobile collapsible

  const update = (key, value) => onChange(prev => ({ ...prev, [key]: value }));

  const reset = () => onChange({ category: '', minPrice: 0, maxPrice: 2000, minRating: 0 });

  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      overflow: 'hidden',
      position: 'sticky',
      top: 90,
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h6 style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>🔧 Filters</h6>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={reset} style={{
            background: 'none', border: 'none', color: 'var(--primary)',
            fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600,
          }}>Reset</button>
          <button
            onClick={() => setOpen(o => !o)}
            className="d-lg-none"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            {open ? '▲' : '▼'}
          </button>
        </div>
      </div>

      <div style={{ display: open ? 'block' : 'none' }} className="d-lg-block">
        {/* Category */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
          <h6 style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray)' }}>
            Category
          </h6>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: 200, overflowY: 'auto' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input type="radio" name="category" checked={filters.category === ''} onChange={() => update('category', '')} />
              <span>All Categories</span>
            </label>
            {categories.map(cat => {
              const slug = typeof cat === 'string' ? cat : cat.slug;
              const name = typeof cat === 'string' ? cat : cat.name;
              return (
                <label key={slug} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === slug}
                    onChange={() => update('category', slug)}
                  />
                  <span style={{ textTransform: 'capitalize' }}>{name.replace(/-/g, ' ')}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
          <h6 style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray)' }}>
            Price Range
          </h6>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            <input
              type="number"
              value={filters.minPrice}
              onChange={e => update('minPrice', Number(e.target.value))}
              placeholder="Min"
              min={0}
              className="form-control"
              style={{ fontSize: '0.85rem', padding: '0.4rem 0.6rem' }}
            />
            <span style={{ color: 'var(--gray)' }}>—</span>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={e => update('maxPrice', Number(e.target.value))}
              placeholder="Max"
              max={2000}
              className="form-control"
              style={{ fontSize: '0.85rem', padding: '0.4rem 0.6rem' }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={2000}
            step={10}
            value={filters.maxPrice}
            onChange={e => update('maxPrice', Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--gray)' }}>
            <span>$0</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>${filters.maxPrice}</span>
            <span>$2000</span>
          </div>
        </div>

        {/* Rating */}
        <div style={{ padding: '1.25rem' }}>
          <h6 style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray)' }}>
            Min Rating
          </h6>
          {[0, 3, 3.5, 4, 4.5].map(r => (
            <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === r}
                onChange={() => update('minRating', r)}
              />
              {r === 0 ? 'All Ratings' : (
                <span style={{ color: '#fbbf24' }}>{'★'.repeat(Math.floor(r))} <span style={{ color: 'var(--gray)', fontSize: '0.82rem' }}>& above</span></span>
              )}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
