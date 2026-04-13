'use client';
// src/components/common/Header.jsx
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartCount } from '@/store/slices/cartSlice';
import { selectWishlistCount } from '@/store/slices/wishlistSlice';
import { selectIsLoggedIn, selectUser, logoutUser } from '@/store/slices/authSlice';
import { fetchProducts } from '@/utils/api';
import styles from './Header.module.scss';

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (search.trim().length > 1) {
        const data = await fetchProducts({ search, limit: 5 });
        setSuggestions(data.products || []);
        setShowSug(true);
      } else {
        setSuggestions([]);
        setShowSug(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
      setShowSug(false);
      setSearch('');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/');
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <nav className={styles.nav}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            Classic<span>Mart</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className={styles.navLinks}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/categories">Categories</Link></li>
            <li><Link href="/#about">About</Link></li>
            <li><Link href="/#contact">Contact</Link></li>
          </ul>

          {/* Search */}
          <div className={styles.searchWrap} ref={searchRef}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onBlur={() => setTimeout(() => setShowSug(false), 200)}
                onFocus={() => suggestions.length > 0 && setShowSug(true)}
              />
              <button type="submit" aria-label="Search">🔍</button>
            </form>
            {showSug && suggestions.length > 0 && (
              <ul className={styles.suggestions}>
                {suggestions.map(p => (
                  <li key={p.id} onMouseDown={() => { router.push(`/product/${p.id}`); setShowSug(false); setSearch(''); }}>
                    <img src={p.thumbnail} alt={p.title} width={36} height={36} />
                    <span>{p.title}</span>
                    <strong>${p.price}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Icons */}
          <div className={styles.icons}>
            <Link href="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
              ♡ {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
            </Link>
            <Link href="/cart" className={styles.iconBtn} aria-label="Cart">
              🛒 {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
            </Link>

            {isLoggedIn ? (
              <div className={styles.userMenu}>
                <button className={styles.iconBtn}>👤 {user?.firstName || 'Account'}</button>
                <div className={styles.dropdown}>
                  <Link href="/account/dashboard">Dashboard</Link>
                  <Link href="/account/orders">Orders</Link>
                  <Link href="/account/profile">Profile</Link>
                  <hr />
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            ) : (
              <Link href="/auth/sign-in" className={styles.loginBtn}>Login</Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? '✕' : '☰'}
          </button>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className={styles.mobileMenu}>
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link href="/categories" onClick={() => setMenuOpen(false)}>Categories</Link>
            <Link href="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist ({wishlistCount})</Link>
            <Link href="/cart" onClick={() => setMenuOpen(false)}>Cart ({cartCount})</Link>
            {isLoggedIn ? (
              <>
                <Link href="/account/dashboard" onClick={() => setMenuOpen(false)}>Account</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link href="/auth/sign-in" onClick={() => setMenuOpen(false)}>Login / Register</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
