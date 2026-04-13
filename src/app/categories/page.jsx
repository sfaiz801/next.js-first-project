// src/app/categories/page.jsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { fetchProductsByCategory } from '@/utils/api';

const CATEGORIES = [
    'smartphones', 'laptops', 'fragrances', 'skincare', 'groceries',
    'home-decoration', 'furniture', 'tops', 'mens-shoes', 'sunglasses',
    'watches', 'bags', 'womens-dresses', 'womens-shoes',
];

const categoryColors = {
    'smartphones': '#FF6B6B', 'laptops': '#4ECDC4', 'fragrances': '#FFE66D',
    'skincare': '#FF85B3', 'groceries': '#95E77D', 'home-decoration': '#C9ADA7',
    'furniture': '#9A8C98', 'tops': '#FB5607', 'mens-shoes': '#8ECAE6',
    'sunglasses': '#FB8500', 'watches': '#A0C4FF', 'bags': '#CAFFBF',
    'womens-dresses': '#FFB4A2', 'womens-shoes': '#E5989B',
};

const getCategoryEmoji = (cat) => {
    const emojis = {
        'smartphones': '📱', 'laptops': '💻', 'fragrances': '🌹', 'skincare': '💄',
        'groceries': '🛒', 'home-decoration': '🏠', 'furniture': '🛋️', 'tops': '👕',
        'mens-shoes': '👞', 'sunglasses': '😎', 'watches': '⌚', 'bags': '👜',
        'womens-dresses': '👗', 'womens-shoes': '👠',
    };
    return emojis[cat] || '📦';
};

export default function CategoriesPage() {
    const [hoveredCat, setHoveredCat] = useState(null);
    const [catProducts, setCatProducts] = useState({});

    const handleHover = async (cat) => {
        setHoveredCat(cat);
        if (!catProducts[cat]) {
            try {
                const products = await fetchProductsByCategory(cat, 4);
                setCatProducts(prev => ({ ...prev, [cat]: (products.products || []).slice(0, 4) }));
            } catch (err) {
                console.error('Error fetching products:', err);
                setCatProducts(prev => ({ ...prev, [cat]: [] }));
            }
        }
    };

    const navigateToShop = (cat) => {
        window.location.href = `/shop?category=${cat}`;
    };

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <div className="container">
                    <h1>Browse Categories</h1>
                    <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
                        Hover over a category to see products →
                    </p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="container" style={{ paddingBottom: '4rem', paddingTop: '3rem' }}>
                <div className="row g-4">
                    {CATEGORIES.map((cat) => {
                        const bgColor = categoryColors[cat] || '#2563EB';
                        const displayName = cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                        return (
                            <div key={cat} className="col-md-6 col-lg-4" style={{ position: 'relative' }}>
                                <div
                                    style={{
                                        backgroundColor: bgColor,
                                        borderRadius: '12px',
                                        padding: '2rem',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        minHeight: '180px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                    onClick={() => navigateToShop(cat)}
                                    onMouseEnter={() => handleHover(cat)}
                                    onMouseLeave={() => setHoveredCat(null)}
                                >
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                                        {getCategoryEmoji(cat)}
                                    </div>
                                    <h3 style={{ color: 'white', margin: '0', fontSize: '1.3rem', fontWeight: 600 }}>
                                        {displayName}
                                    </h3>
                                </div>

                                    {/* Products Dropdown on Hover */}
                                    {hoveredCat === cat && catProducts[cat] && catProducts[cat].length > 0 && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '-10px',
                                                right: '-320px',
                                                width: '300px',
                                                backgroundColor: 'white',
                                                borderRadius: '12px',
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                                zIndex: 1000,
                                                padding: '1rem',
                                                animation: 'slideIn 0.3s ease',
                                            }}
                                        >
                                            {/* Arrow */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    left: '-12px',
                                                    top: '30px',
                                                    width: '0',
                                                    height: '0',
                                                    borderTop: '8px solid transparent',
                                                    borderBottom: '8px solid transparent',
                                                    borderRight: '12px solid white',
                                                }}
                                            />

                                            <h4 style={{ margin: '0 0 1rem 0', color: '#333', fontSize: '0.95rem', fontWeight: 600 }}>
                                                Top Items
                                            </h4>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                {catProducts[cat].slice(0, 4).map((prod) => (
                                                    <div 
                                                        key={prod.id} 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.location.href = `/product/${prod.id}`;
                                                        }}
                                                        style={{
                                                            paddingBottom: '0.5rem',
                                                            marginBottom: '0.5rem',
                                                            borderBottom: '1px solid #eee',
                                                            fontSize: '0.85rem',
                                                            color: '#666',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            padding: '0.5rem',
                                                            borderRadius: '4px',
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                        }}
                                                    >
                                                        <div style={{ fontWeight: 500, color: '#333' }}>{prod.title.substring(0, 25)}...</div>
                                                        <div style={{ color: '#2563EB', fontWeight: 600 }}>₹{Math.round(prod.price)}</div>
                                                    </div>
                                                ))}
                                            </ul>
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigateToShop(cat);
                                                }}
                                                style={{
                                                    display: 'block',
                                                    marginTop: '1rem',
                                                    padding: '0.6rem',
                                                    backgroundColor: bgColor,
                                                    color: 'white',
                                                    textAlign: 'center',
                                                    borderRadius: '6px',
                                                    textDecoration: 'none',
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                View All
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div>
            </div>

            <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
        </>
    );
}
