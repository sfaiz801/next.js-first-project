'use client';
// src/components/shop/ShopClient.jsx
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/common/ProductCard';
import ProductListItem from '@/components/shop/ProductListItem';
import ShopFilters from '@/components/shop/ShopFilters';
import { fetchProducts } from '@/utils/api';

const LIMIT = 12;
const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'title-asc', label: 'Name: A–Z' },
];

export default function ShopClient({ categories }) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid'); // 'grid' | 'list'
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('default');
  const [filters, setFilters] = useState({ category: '', minPrice: 0, maxPrice: 2000, minRating: 0 });

  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  // Sync URL category param → filters
  useEffect(() => {
    if (categoryParam) setFilters(f => ({ ...f, category: categoryParam }));
  }, [categoryParam]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * LIMIT;
      const data = await fetchProducts({
        limit: 100, // fetch more for client-side sort/filter
        skip: 0,
        search: searchQuery,
        category: filters.category,
      });
      let items = data.products || [];

      // Filter by price
      items = items.filter(p => {
        const disc = p.price - (p.price * p.discountPercentage) / 100;
        return disc >= filters.minPrice && disc <= filters.maxPrice;
      });

      // Filter by rating
      if (filters.minRating > 0) items = items.filter(p => p.rating >= filters.minRating);

      // Sort
      switch (sort) {
        case 'price-asc': items.sort((a, b) => a.price - b.price); break;
        case 'price-desc': items.sort((a, b) => b.price - a.price); break;
        case 'rating-desc': items.sort((a, b) => b.rating - a.rating); break;
        case 'title-asc': items.sort((a, b) => a.title.localeCompare(b.title)); break;
      }

      setTotal(items.length);
      setProducts(items.slice((page - 1) * LIMIT, page * LIMIT));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, sort, page]);

  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => { setPage(1); }, [filters, sort, searchQuery]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>{searchQuery ? `Results for "${searchQuery}"` : filters.category ? filters.category.replace(/-/g, ' ') : 'All Products'}</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 mt-2">
              <li className="breadcrumb-item"><a href="/" style={{ color: 'rgba(255,255,255,0.7)' }}>Home</a></li>
              <li className="breadcrumb-item active">Shop</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        <div className="row g-4">
          {/* Sidebar Filters */}
          <div className="col-lg-3">
            <ShopFilters
              categories={categories}
              filters={filters}
              onChange={setFilters}
            />
          </div>

          {/* Products Area */}
          <div className="col-lg-9">
            {/* Toolbar */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem',
              padding: '0.75rem 1rem',
              background: 'var(--light-gray)',
              borderRadius: 'var(--radius)',
            }}>
              <span style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
                {loading ? 'Loading...' : `Showing ${products.length} of ${total} products`}
              </span>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {/* Sort */}
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="form-control"
                  style={{ fontSize: '0.88rem', padding: '0.45rem 0.75rem', width: 'auto' }}
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {/* View Toggle */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {['grid', 'list'].map(v => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      style={{
                        width: 36, height: 36, border: '1.5px solid',
                        borderColor: view === v ? 'var(--primary)' : 'var(--border)',
                        background: view === v ? 'var(--primary)' : 'white',
                        color: view === v ? 'white' : 'var(--gray)',
                        borderRadius: 6, cursor: 'pointer', fontSize: '1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                      title={v === 'grid' ? 'Grid View' : 'List View'}
                    >
                      {v === 'grid' ? '⊞' : '☰'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid / List */}
            {loading ? (
              <div className={`row g-3`}>
                {[...Array(LIMIT)].map((_, i) => (
                  <div key={i} className={view === 'grid' ? 'col-6 col-md-4' : 'col-12'}>
                    <SkeletonCard list={view === 'list'} />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--gray)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                <h4>No products found</h4>
                <p>Try adjusting your filters or search query.</p>
                <button
                  onClick={() => { setFilters({ category: '', minPrice: 0, maxPrice: 2000, minRating: 0 }); }}
                  style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
                >
                  Clear Filters
                </button>
              </div>
            ) : view === 'grid' ? (
              <div className="row g-3">
                {products.map(p => (
                  <div key={p.id} className="col-6 col-md-4">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {products.map(p => <ProductListItem key={p.id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                <PaginationBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</PaginationBtn>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationBtn key={i} onClick={() => setPage(i + 1)} active={page === i + 1}>
                    {i + 1}
                  </PaginationBtn>
                ))}
                <PaginationBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</PaginationBtn>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function PaginationBtn({ children, onClick, active, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '0.5rem 0.9rem',
        border: '1.5px solid',
        borderColor: active ? 'var(--primary)' : 'var(--border)',
        background: active ? 'var(--primary)' : 'white',
        color: active ? 'white' : disabled ? 'var(--gray)' : 'var(--dark)',
        borderRadius: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: active ? 700 : 500,
        fontSize: '0.88rem',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
      }}
    >
      {children}
    </button>
  );
}

function SkeletonCard({ list }) {
  const shimmer = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: 8,
  };
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ ...shimmer, height: list ? 120 : 200 }} />
      <div style={{ padding: '1rem' }}>
        <div style={{ ...shimmer, height: 14, marginBottom: 8, width: '60%' }} />
        <div style={{ ...shimmer, height: 18, marginBottom: 8 }} />
        <div style={{ ...shimmer, height: 16, width: '40%' }} />
      </div>
    </div>
  );
}
