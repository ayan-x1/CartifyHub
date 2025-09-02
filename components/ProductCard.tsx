'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { IProduct } from '@/models/Product';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

interface ProductCardProps {
  product: IProduct;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const inCartQuantity = useCart((state) => state.items.find((i) => i.productId === String(product._id))?.quantity || 0);
  const stockLeft = Math.max(0, product.stock - inCartQuantity);
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { isSignedIn } = useUser();

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      addItem({
        productId: String(product._id),
        name: product.name,
        price: product.price,
        image: product.images[0] || '/placeholder.jpg',
        quantity: 1,
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/user/wishlist');
        if (res.ok) {
          const data = await res.json();
          const id = String((product as any)._id);
          setIsWishlisted((data.wishlist || []).some((w: string) => String(w) === id));
        }
      } catch {}
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product && (product as any)._id]);

  const toggleWishlist = async () => {
    if (!isSignedIn) {
      toast.info('Please sign in to manage wishlist');
      return;
    }
    const id = String((product as any)._id);
    try {
      if (isWishlisted) {
        await fetch('/api/user/wishlist', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: id }) });
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await fetch('/api/user/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: id }) });
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/products/${product.slug}`} className="relative block h-full w-full">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={priority}
          />
        </Link>
        
        {/* Discount Badge */}
        {product.discountPrice && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
          </Badge>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 p-2 rounded-md bg-white/80 hover:bg-white transition-opacity opacity-0 group-hover:opacity-100"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-700'}`} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {product.categories.slice(0, 2).map((category) => (
            <Badge key={category} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-1">
            ({product.reviewsCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          {product.discountPrice ? (
            <>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.discountPrice)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="text-sm text-gray-500">
          {stockLeft > 0 ? (
            <span className="text-green-600">In Stock ({stockLeft})</span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isLoading || stockLeft === 0}
          className="w-full group-hover:bg-blue-600 transition-colors"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isLoading ? 'Adding...' : stockLeft > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
}