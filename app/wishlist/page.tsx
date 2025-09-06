'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart, Package, Star, ShoppingBag, User, Crown } from 'lucide-react';
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
      {/* Role Switcher Header - Same as Dashboard */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
              <span className="font-medium text-gray-900 text-sm sm:text-base">User Mode</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                Customer
              </Badge>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={goBack}
                className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Back to Dashboard</span>
                <span className="xs:hidden">Back</span>
              </Button>
              <Button variant="outline" size="sm" onClick={goToShop} className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
                Go to Shop
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header with Profile - Same as Dashboard */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg sm:text-xl font-bold">
                  {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress.charAt(0) || 'U'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  My Wishlist
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Your favorite products and saved items</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button variant="outline" onClick={goToShop} className="w-full sm:w-auto">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Shop Now
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats - Same style as Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wishlistProducts.length}</div>
              <p className="text-xs text-muted-foreground">Your wishlist items</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(wishlistProducts.reduce((sum, product) => sum + (product.discountPrice || product.price), 0))}
              </div>
              <p className="text-xs text-muted-foreground">Wishlist value</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Sale</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {wishlistProducts.filter(product => product.discountPrice).length}
              </div>
              <p className="text-xs text-muted-foreground">Discounted items</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {wishlistProducts.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Wishlist</CardTitle>
              <CardDescription>Your favorite products and saved items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-4">Start adding products to your wishlist to see them here</p>
                <Button onClick={goToShop}>
                  Browse Products
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your Wishlist</CardTitle>
              <CardDescription>Your favorite products and saved items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wishlistProducts.map((product) => (
                  <div key={String(product._id)} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-4 w-4 sm:h-6 sm:w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base">{product.name}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                          {product.discountPrice ? (
                            <>
                              <span className="text-xs sm:text-sm font-medium text-gray-900">
                                {formatPrice(product.discountPrice)}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-500 line-through">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-2 w-2 sm:h-3 sm:w-3 ${
                                  i < Math.floor(product.rating || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {product.rating || 0} ({product.reviewsCount || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 self-end sm:self-auto">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => router.push(`/products/${product.slug}`)}
                        className="text-xs px-3 py-1"
                      >
                        View
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => removeFromWishlist(String(product._id))}
                        className="text-xs px-3 py-1"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
