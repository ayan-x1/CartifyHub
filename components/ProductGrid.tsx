'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { IProduct } from '@/models/Product';

interface ProductGridProps {
  category?: string;
  search?: string;
}

export function ProductGrid({ category, search }: ProductGridProps) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, search]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      const query = params.toString();
      const response = await fetch(`/api/products${query ? `?${query}` : ''}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard key={String(product._id)} product={product} priority={index === 0} />
      ))}
    </div>
  );
}