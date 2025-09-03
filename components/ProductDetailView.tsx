'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { IProduct } from '@/models/Product';
import { Types } from 'mongoose';
import { toast } from 'sonner';
import { Product3DViewer } from './Product3DViewer';
import { useUser } from '@clerk/nextjs';

interface ProductDetailViewProps {
  product: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'> & {
    _id: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addItem } = useCart();
  const { isSignedIn } = useUser();
  const inCartQuantity = useCart((state) => state.items.find((i) => i.productId === String(product._id))?.quantity || 0);
  const stockLeft = Math.max(0, product.stock - inCartQuantity);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const handleAddToCart = async () => {
    if (quantity <= 0) {
      toast.error('Please select a valid quantity');
      return;
    }

    setIsLoading(true);
    try {
      addItem({
        productId: String(product._id),
        name: product.name,
        price: product.price,
        image: product.images[0] || '/placeholder.jpg',
        quantity,
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isSignedIn) return;
      
      try {
        const res = await fetch('/api/user/wishlist');
        if (res.ok) {
          const data = await res.json();
          const id = String(product._id);
          setIsWishlisted((data.wishlist || []).some((w: string) => String(w) === id));
        }
      } catch (error) {
        console.error('Failed to check wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [isSignedIn, product._id]);

  const toggleWishlist = async () => {
    if (!isSignedIn) {
      toast.info('Please sign in to manage wishlist');
      return;
    }

    const id = String(product._id);
    try {
      if (isWishlisted) {
        await fetch('/api/user/wishlist', { 
          method: 'DELETE', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ productId: id }) 
        });
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await fetch('/api/user/wishlist', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ productId: id }) 
        });
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage] || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          
          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {product.categories.map((category) => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviewsCount} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            {product.discountPrice ? (
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
                <Badge className="bg-red-500 text-white">
                  {discountPercentage}% OFF
                </Badge>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="text-sm">
            {stockLeft > 0 ? (
              <span className="text-green-600 font-medium">
                ✓ In Stock ({stockLeft} available)
              </span>
            ) : (
              <span className="text-red-600 font-medium">✗ Out of Stock</span>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="px-4 py-2 text-center min-w-[60px]">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= stockLeft}
                >
                  +
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleAddToCart}
                disabled={isLoading || stockLeft === 0}
                size="lg"
                className="flex-1"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isLoading ? 'Adding...' : stockLeft === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={toggleWishlist}
                className={isWishlisted ? 'text-red-500 border-red-500 hover:bg-red-50' : ''}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'text-red-500 fill-current' : ''}`} />
              </Button>
              
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Truck className="h-5 w-5" />
              <span>Free shipping over $50</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="h-5 w-5" />
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <RotateCcw className="h-5 w-5" />
              <span>30-day returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Viewer */}
      {product.model3d && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">3D Product Preview</h2>
          <div className="bg-gray-100 rounded-lg p-4">
            <Product3DViewer modelUrl={product.model3d} />
          </div>
        </div>
      )}

      {/* Product Details Tabs */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'reviews', label: 'Reviews' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="space-y-4">
              {Object.entries(product.attributes || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-gray-600">{String(value)}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-8 text-gray-500">
              <p>Reviews feature coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}