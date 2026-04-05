// src/app/shop/page.jsx
import ShopClient from '@/components/shop/ShopClient';
import { fetchCategories } from '@/utils/api';

export const metadata = {
  title: 'Shop – Browse All Products',
  description: 'Browse our full collection of products. Filter by category, price, and rating.',
};

export default async function ShopPage() {
  const categories = await fetchCategories();
  return <ShopClient categories={categories} />;
}
