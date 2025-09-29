'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { IProduct } from '@/models/Product';

interface ProductGridProps {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  enablePagination?: boolean;
}

export function ProductGrid({ category, search, page = 1, limit = 12, enablePagination = false }: ProductGridProps) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, search, currentPage, limit]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      params.set('page', String(enablePagination ? currentPage : page));
      params.set('limit', String(limit));
      const query = params.toString();
      const response = await fetch(`/api/products${query ? `?${query}` : ''}`);
      const data = await response.json();
      setProducts(data.products || []);
      if (data.pagination) {
        setTotalPages(data.pagination.pages || 1);
      } else {
        setTotalPages(null);
      }
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard key={String(product._id)} product={product} priority={index === 0} />
        ))}
      </div>
      {enablePagination && totalPages && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            className="px-4 py-2 rounded border disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <button
            className="px-4 py-2 rounded border disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}