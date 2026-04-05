// src/app/page.jsx
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import NewArrivals from '@/components/home/NewArrivals';
import DiscountBanner from '@/components/home/DiscountBanner';
import Testimonials from '@/components/home/Testimonials';
import NewsletterSection from '@/components/home/NewsletterSection';
import { fetchProducts, fetchCategories } from '@/utils/api';

export const metadata = {
  title: 'ShopNest – Your Online Store | Best Deals & Products',
  description: 'Shop the best products online at ShopNest. Explore trending products, new arrivals, and exclusive deals.',
};

export default async function HomePage() {
  const [featured, newArrivals, categories] = await Promise.all([
    fetchProducts({ limit: 8, skip: 0 }),
    fetchProducts({ limit: 8, skip: 20 }),
    fetchCategories(),
  ]);

  return (
    <>
      <HeroBanner />
      <FeaturedCategories categories={categories.slice(0, 8)} />
      <FeaturedProducts products={featured.products} />
      <DiscountBanner />
      <NewArrivals products={newArrivals.products} />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
