'use client';
// src/components/home/HeroBanner.jsx
import Link from 'next/link';
import styles from './HeroBanner.module.scss';

export default function HeroBanner() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className="row align-items-center" style={{ minHeight: '80vh' }}>
          <div className="col-lg-6">
            <div className={styles.badge}>🔥 New Season Sale — Up to 50% Off</div>
            <h1 className={styles.title}>
              Discover <span>Premium</span> Products For Your Lifestyle
            </h1>
            <p className={styles.subtitle}>
              Shop thousands of curated products across electronics, fashion, home, and more. 
              Fast delivery. Easy returns. Best prices guaranteed.
            </p>
            <div className={styles.actions}>
              <Link href="/shop" className={styles.btnPrimary}>Shop Now →</Link>
              <Link href="/shop?category=smartphones" className={styles.btnOutline}>View Categories</Link>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}><strong>50K+</strong><span>Products</span></div>
              <div className={styles.divider} />
              <div className={styles.stat}><strong>1M+</strong><span>Customers</span></div>
              <div className={styles.divider} />
              <div className={styles.stat}><strong>4.9★</strong><span>Rating</span></div>
            </div>
          </div>
          <div className="col-lg-6 d-none d-lg-block">
            <div className={styles.heroVisual}>
              <div className={styles.circle1} />
              <div className={styles.circle2} />
              <div className={styles.floatCard}>
                <span>🛍️</span>
                <div>
                  <strong>Free Shipping</strong>
                  <p>On orders above $50</p>
                </div>
              </div>
              <div className={`${styles.floatCard} ${styles.floatCard2}`}>
                <span>⚡</span>
                <div>
                  <strong>Flash Sale</strong>
                  <p>Every weekend</p>
                </div>
              </div>
              <div className={styles.heroEmoji}>🛒</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
