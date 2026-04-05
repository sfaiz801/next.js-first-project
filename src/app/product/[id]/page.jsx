// src/app/product/[id]/page.jsx
import ProductDetailClient from '@/components/product/ProductDetailClient';
import { fetchProductById } from '@/utils/api';

export async function generateMetadata({ params }) {
  const product = await fetchProductById(params.id);
  return {
    title: `${product.title} – ShopNest`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await fetchProductById(params.id);
  return <ProductDetailClient product={product} />;
}
