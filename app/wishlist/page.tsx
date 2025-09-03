'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart, Package, Star, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

export default function WishlistPage() {
  const router = useRouter();
  const { user } = useUser();
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/wishlist');
      if (res.ok) {
        const data = await res.json();
        setWishlistProducts(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await fetch('/api/user/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      setWishlistProducts((prev) => prev.filter((product) => String(product._id) !== String(productId)));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const goBack = () => {
    router.push('/dashboard');
  };

  const goToShop = () => {
    router.push('/products');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={goBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-gray-600">Your favorite products</p>
              </div>
            </div>
            <Button onClick={goToShop}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding products to your wishlist to see them here. You can like products by clicking the heart icon on any product page.
            </p>
            <div className="space-x-4">
              <Button size="lg" onClick={goToShop}>
                <ShoppingBag className="h-5 w-5 mr-2" />
                Browse Products
              </Button>
              <Button variant="outline" size="lg" onClick={goBack}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Wishlist Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Wishlist Summary
                </CardTitle>
                <CardDescription>
                  You have {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} in your wishlist
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{wishlistProducts.length}</div>
                    <div className="text-sm text-gray-600">Total Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(wishlistProducts.reduce((sum, product) => sum + (product.discountPrice || product.price), 0))}
                    </div>
                    <div className="text-sm text-gray-600">Total Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {wishlistProducts.filter(product => product.discountPrice).length}
                    </div>
                    <div className="text-sm text-gray-600">On Sale</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wishlist Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((product) => (
                <Card key={String(product._id)} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Discount Badge */}
                      {product.discountPrice && (
                        <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </Badge>
                      )}
                      
                      {/* Remove Button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFromWishlist(String(product._id))}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                      
                      {/* Rating */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {product.rating || 0} ({product.reviewsCount || 0})
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
                      <div className="text-sm">
                        {product.stock > 0 ? (
                          <span className="text-green-600 font-medium">
                            ✓ In Stock ({product.stock} available)
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">✗ Out of Stock</span>
                        )}
                      </div>

                      {/* Categories */}
                      {product.categories && product.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {product.categories.slice(0, 2).map((category: string) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          className="flex-1" 
                          onClick={() => router.push(`/products/${product.slug}`)}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => removeFromWishlist(String(product._id))}
                        >
                          <Heart className="h-4 w-4 text-red-500 fill-current" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
