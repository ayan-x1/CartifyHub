'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Package, ShoppingBag, User, Heart, Settings, LogOut, Trash2, Upload, Camera, Star } from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Order {
  _id: string;
  items: Array<{
    productId: string;
    name: string;
    price: number; // in cents
    quantity: number;
    image: string;
  }>;
  subtotal: number; // in cents
  shipping: number; // in cents
  tax: number; // in cents
  total: number; // in cents
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'fulfilled' | 'refunded';
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  dateOfBirth?: string;
  basicAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  joinDate: string;
}

export function UserDashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [basicAddress, setBasicAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchProfile();
      fetchWishlist();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      console.log('Fetched orders:', data.orders);
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
      setOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setName(data.name || '');
        setAvatarUrl(data.avatarUrl || '');
        setPhone(data.phone || '');
        setDateOfBirth(data.dateOfBirth || '');
        setBasicAddress(data.basicAddress || {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        });
        setWishlist(data.wishlist || []);
        setAddresses(data.addresses || []);
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/user/wishlist');
      if (res.ok) {
        const data = await res.json();
        setWishlist(data.wishlist || []);
        setWishlistProducts(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/user/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAvatarUrl(data.avatarUrl);
        toast.success('Profile image uploaded successfully!');
      } else {
        const errorData = await response.json();
        toast.error(`Failed to upload image: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          avatarUrl, 
          phone, 
          dateOfBirth,
          basicAddress: Object.values(basicAddress).some(val => val) ? basicAddress : null
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        // Update local state with the response data
        setName(data.name || '');
        setAvatarUrl(data.avatarUrl || '');
        setPhone(data.phone || '');
        setDateOfBirth(data.dateOfBirth || '');
        setBasicAddress(data.basicAddress || {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        });
        
        // Show success toast
        toast.success('Profile updated successfully!');
        
        // Close the edit profile section
        setShowEditProfile(false);
      } else {
        const errorData = await res.json();
        toast.error(`Failed to update profile: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  // Helper function to get the display name
  const getDisplayName = () => {
    return name || user?.fullName || user?.firstName || 'User';
  };

  // Helper function to get the display avatar
  const getDisplayAvatar = () => {
    return avatarUrl || user?.imageUrl || '';
  };

  // Helper function to get the avatar fallback
  const getAvatarFallback = () => {
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    return user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress.charAt(0) || 'U';
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await fetch('/api/user/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      setWishlist((prev) => prev.filter((id) => id !== productId));
      setWishlistProducts((prev) => prev.filter((product) => String(product._id) !== String(productId)));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const addAddress = async () => {
    const res = await fetch('/api/user/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAddress),
    });
    if (res.ok) {
      const data = await res.json();
      setAddresses(data.addresses || []);
      setNewAddress({ fullName: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: '' });
    }
  };

  const deleteAddress = async (addressId: string) => {
    await fetch('/api/user/addresses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addressId }),
    });
    setAddresses((prev) => prev.filter((a) => String(a._id) !== String(addressId)));
  };

  const setDefaultAddress = async (addressId: string) => {
    await fetch('/api/user/addresses', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addressId, setDefault: true }),
    });
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: String(a._id) === String(addressId) })));
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      fulfilled: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getImageUrl = (imageUrl: string) => {
    // Handle different image URL formats
    if (!imageUrl) return null;
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      console.log('Using external image URL:', imageUrl);
      return imageUrl;
    }
    
    // If it's a relative path, make it absolute
    if (imageUrl.startsWith('/')) {
      const fullUrl = `${window.location.origin}${imageUrl}`;
      console.log('Converting relative path to absolute:', fullUrl);
      return fullUrl;
    }
    
    // If it's just a filename, assume it's in the public folder
    const publicUrl = `${window.location.origin}/${imageUrl}`;
    console.log('Converting filename to public URL:', publicUrl);
    return publicUrl;
  };

  const deleteOrder = async (orderId: string) => {
    const orderToDelete = orders.find(order => order._id === orderId);
    const orderNumber = orderToDelete?._id.slice(-8) || 'Unknown';
    
    if (!confirm(`Are you sure you want to delete Order #${orderNumber}?\n\nThis action cannot be undone and will permanently remove this order from your history.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/orders?orderId=${orderId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Remove the order from the local state
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
        console.log('Order deleted successfully');
        
        // Show success toast notification
        toast.success(`Order #${orderNumber} has been deleted successfully! 🗑️`);
      } else {
        const errorData = await response.json();
        console.error('Failed to delete order:', errorData);
        
        // Show error toast notification
        toast.error(`Failed to delete order: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      
      // Show error toast notification
      toast.error('Error deleting order. Please try again.');
    }
  };

  const confirmDeleteOrder = (orderId: string) => {
    setOrderToDelete(orderId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    const orderToDeleteData = orders.find(order => order._id === orderToDelete);
    const orderNumber = orderToDeleteData?._id.slice(-8) || 'Unknown';

    try {
      const response = await fetch(`/api/orders?orderId=${orderToDelete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Remove the order from the local state
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderToDelete));
        console.log('Order deleted successfully');
        
        // Show success toast notification
        toast.success(`Order #${orderNumber} has been deleted successfully! 🗑️`);
      } else {
        const errorData = await response.json();
        console.error('Failed to delete order:', errorData);
        
        // Show error toast notification
        toast.error(`Failed to delete order: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      
      // Show error toast notification
      toast.error('Error deleting order. Please try again.');
    } finally {
      setShowDeleteConfirm(false);
      setOrderToDelete(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Profile */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={getDisplayAvatar()} alt={getDisplayName()} />
                <AvatarFallback className="text-lg">
                  {getAvatarFallback()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {getDisplayName()}!
                </h1>
                <p className="text-gray-600">Manage your account and view your orders</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => router.push('/products')}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Shop Now
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">Your order history</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(order => ['pending', 'paid'].includes(order.status)).length}
              </div>
              <p className="text-xs text-muted-foreground">Currently processing</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}
              </div>
              <p className="text-xs text-muted-foreground">Lifetime spending</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest purchases and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-4">Start shopping to see your order history here</p>
                      <Button onClick={() => router.push('/products')}>
                        Browse Products
                      </Button>
                    </div>
                  ) : (
                    orders.slice(0, 3).map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {order.items[0]?.image ? (
                            <img
                              src={getImageUrl(order.items[0].image) || ''}
                              alt={order.items[0].name}
                              className="w-16 h-16 object-contain rounded-md border border-gray-200"
                              onError={(e) => {
                                console.warn('Image failed to load, showing fallback:', order.items[0].image);
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                                
                                // Try to identify the issue
                                if (order.items[0].image.includes('pexels.com')) {
                                  console.warn('Pexels image failed - this might be a CORS or URL expiration issue');
                                }
                              }}
                              onLoad={() => {
                                console.log('Image loaded successfully:', order.items[0].image);
                              }}
                              crossOrigin="anonymous"
                            />
                          ) : null}
                          <div className={`w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center ${order.items[0]?.image ? 'hidden' : ''}`}>
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                          <div>
                            <h4 className="font-medium">{order.items[0]?.name || 'Product'}</h4>
                            <p className="text-sm text-gray-600">Order #{order._id.slice(-8)}</p>
                            <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatPrice(order.total)}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => confirmDeleteOrder(order._id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                              title="Delete this order"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>All your past and current orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-4">Start shopping to see your order history here</p>
                      <Button onClick={() => router.push('/products')}>
                        Browse Products
                      </Button>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order._id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium">Order #{order._id.slice(-8)}</h4>
                            <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatPrice(order.total)}</div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmDeleteOrder(order._id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                                title="Delete this order"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-3">
                                {item.image ? (
                                  <img
                                    src={getImageUrl(item.image) || ''}
                                    alt={item.name}
                                    className="w-10 h-10 object-contain rounded border border-gray-200"
                                    onError={(e) => {
                                      console.warn('Image failed to load, showing fallback:', item.image);
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                    crossOrigin="anonymous"
                                  />
                                ) : null}
                                <div className={`w-10 h-10 bg-gray-200 rounded flex items-center justify-center ${item.image ? 'hidden' : ''}`}>
                                  <Package className="h-5 w-5 text-gray-400" />
                                </div>
                                <span>{item.name} x{item.quantity}</span>
                              </div>
                              <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your complete account details and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Profile Image and Basic Info */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={getDisplayAvatar()} alt={getDisplayName()} />
                      <AvatarFallback className="text-2xl">
                        {getAvatarFallback()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{getDisplayName()}</h3>
                      <p className="text-gray-600">{user?.emailAddresses[0]?.emailAddress}</p>
                      <p className="text-sm text-gray-500">Member since {formatDate(new Date(user?.createdAt ?? Date.now()).toISOString())}</p>
                    </div>
                  </div>

                  {/* Personal Information Section */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 text-gray-900">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                        <p className="text-sm text-gray-600 mt-1">
                          {name || user?.fullName || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                        <p className="text-sm text-gray-600 mt-1">
                          {user?.emailAddresses[0]?.emailAddress || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                        <p className="text-sm text-gray-600 mt-1">
                          {phone || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Date of Birth</Label>
                        <p className="text-sm text-gray-600 mt-1">
                          {dateOfBirth ? formatDate(dateOfBirth) : 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Address Section */}
                  {basicAddress && Object.values(basicAddress).some(val => val) && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3 text-gray-900">Basic Address</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Street Address</Label>
                          <p className="text-sm text-gray-600 mt-1">
                            {basicAddress.street || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">City</Label>
                          <p className="text-sm text-gray-600 mt-1">
                            {basicAddress.city || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">State/Province</Label>
                          <p className="text-sm text-gray-600 mt-1">
                            {basicAddress.state || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Postal Code</Label>
                          <p className="text-sm text-gray-600 mt-1">
                            {basicAddress.postalCode || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Country</Label>
                          <p className="text-sm text-gray-600 mt-1">
                            {basicAddress.country || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Account Statistics Section */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 text-gray-900">Account Statistics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <Label className="text-sm font-medium text-gray-700">Total Orders</Label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{orders.length}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <Label className="text-sm font-medium text-gray-700">Total Spent</Label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <Label className="text-sm font-medium text-gray-700">Wishlist Items</Label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{wishlist.length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Addresses Section */}
                  {addresses.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3 text-gray-900">Shipping Addresses ({addresses.length})</h4>
                      <div className="space-y-3">
                        {addresses.map((addr, index) => (
                          <div key={String(addr._id)} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900">
                                Address {index + 1}
                                {addr.isDefault && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    Default
                                  </Badge>
                                )}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p className="font-medium">{addr.fullName}</p>
                              <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                              <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                              <p>{addr.country}</p>
                              <p className="mt-1">{addr.phone}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Account Details Section */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 text-gray-900">Account Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Account Created</Label>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(new Date(user?.createdAt ?? Date.now()).toISOString())}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Last Updated</Label>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(new Date(user?.updatedAt ?? Date.now()).toISOString())}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">User ID</Label>
                        <p className="text-sm text-gray-600 mt-1 font-mono">
                          {user?.id || 'Not available'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Account Status</Label>
                        <div className="text-sm text-gray-600 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            Active
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 text-gray-900">Quick Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab('orders')}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        View Orders
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push('/wishlist')}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        View Wishlist
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push('/products')}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Browse Products
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setShowEditProfile((s) => !s)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  {showEditProfile && (
                    <div className="border rounded-lg p-4 space-y-6">
                      {profileLoading ? (
                        <p className="text-sm text-gray-500">Loading...</p>
                      ) : (
                        <>
                          {/* Profile Image Upload */}
                          <div className="space-y-4">
                            <Label>Profile Image</Label>
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={getDisplayAvatar()} alt={getDisplayName()} />
                                <AvatarFallback className="text-lg">
                                  {getAvatarFallback()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-2">
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                                <Button
                                  variant="outline"
                                  onClick={() => fileInputRef.current?.click()}
                                  disabled={imageUploading}
                                  className="flex items-center space-x-2"
                                >
                                  {imageUploading ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                      <span>Uploading...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Camera className="h-4 w-4" />
                                      <span>Upload Photo</span>
                                    </>
                                  )}
                                </Button>
                                <p className="text-xs text-gray-500">Max file size: 5MB. Supported formats: JPG, PNG, GIF</p>
                              </div>
                            </div>
                          </div>

                          {/* Basic Information */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">Full Name</Label>
                              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" />
                            </div>
                            <div>
                              <Label htmlFor="dateOfBirth">Date of Birth</Label>
                              <Input 
                                id="dateOfBirth" 
                                type="date" 
                                value={dateOfBirth} 
                                onChange={(e) => setDateOfBirth(e.target.value)} 
                              />
                            </div>
                          </div>

                          {/* Basic Address */}
                          <div className="space-y-4">
                            <Label>Basic Address</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="street">Street Address</Label>
                                <Input 
                                  id="street" 
                                  value={basicAddress.street} 
                                  onChange={(e) => setBasicAddress({...basicAddress, street: e.target.value})} 
                                  placeholder="Enter street address"
                                />
                              </div>
                              <div>
                                <Label htmlFor="city">City</Label>
                                <Input 
                                  id="city" 
                                  value={basicAddress.city} 
                                  onChange={(e) => setBasicAddress({...basicAddress, city: e.target.value})} 
                                  placeholder="Enter city"
                                />
                              </div>
                              <div>
                                <Label htmlFor="state">State/Province</Label>
                                <Input 
                                  id="state" 
                                  value={basicAddress.state} 
                                  onChange={(e) => setBasicAddress({...basicAddress, state: e.target.value})} 
                                  placeholder="Enter state or province"
                                />
                              </div>
                              <div>
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input 
                                  id="postalCode" 
                                  value={basicAddress.postalCode} 
                                  onChange={(e) => setBasicAddress({...basicAddress, postalCode: e.target.value})} 
                                  placeholder="Enter postal code"
                                />
                              </div>
                              <div>
                                <Label htmlFor="country">Country</Label>
                                <Input 
                                  id="country" 
                                  value={basicAddress.country} 
                                  onChange={(e) => setBasicAddress({...basicAddress, country: e.target.value})} 
                                  placeholder="Enter country"
                                />
                              </div>
                            </div>
                          </div>

                          <Button onClick={saveProfile} className="w-full">Save Changes</Button>
                        </>
                      )}
                    </div>
                  )}
                  <Button variant="outline" className="w-full justify-start" onClick={() => setShowWishlist((s) => !s)}>
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Button>
                  {showWishlist && (
                    <div className="border rounded-lg p-4 space-y-4">
                      {wishlistProducts.length === 0 ? (
                        <div className="text-center py-8">
                          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                          <p className="text-gray-600 mb-4">Start adding products to your wishlist to see them here</p>
                          <Button onClick={() => router.push('/products')}>
                            Browse Products
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {wishlistProducts.map((product) => (
                            <div key={String(product._id)} className="flex items-center space-x-4 p-3 border rounded-lg">
                              <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                                {product.images && product.images[0] ? (
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  {product.discountPrice ? (
                                    <>
                                      <span className="text-sm font-medium text-gray-900">
                                        {formatPrice(product.discountPrice)}
                                      </span>
                                      <span className="text-sm text-gray-500 line-through">
                                        {formatPrice(product.price)}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-sm font-medium text-gray-900">
                                      {formatPrice(product.price)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
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
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => router.push(`/products/${product.slug}`)}
                                >
                                  View
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  onClick={() => removeFromWishlist(String(product._id))}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <Button variant="outline" className="w-full justify-start" onClick={() => setShowAddresses((s) => !s)}>
                    <Package className="h-4 w-4 mr-2" />
                    Shipping Addresses
                  </Button>
                  {showAddresses && (
                    <div className="border rounded-lg p-4 space-y-6">
                      <div className="space-y-3">
                        {addresses.length === 0 && <p className="text-sm text-gray-500">No addresses yet.</p>}
                        {addresses.map((addr) => (
                          <div key={String(addr._id)} className="border rounded-md p-3 text-sm">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{addr.fullName} {addr.isDefault && <span className="ml-2 text-xs text-green-600">Default</span>}</div>
                                <div className="text-gray-600">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</div>
                                <div className="text-gray-600">{addr.city}, {addr.state} {addr.postalCode}, {addr.country}</div>
                                <div className="text-gray-600">{addr.phone}</div>
                              </div>
                              <div className="space-x-2">
                                {!addr.isDefault && (
                                  <Button variant="outline" size="sm" onClick={() => setDefaultAddress(String(addr._id))}>Set Default</Button>
                                )}
                                <Button variant="destructive" size="sm" onClick={() => deleteAddress(String(addr._id))}>Delete</Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium">Add New Address</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input placeholder="Full Name" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} />
                          <Input placeholder="Phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
                          <Input placeholder="Address Line 1" value={newAddress.line1} onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })} />
                          <Input placeholder="Address Line 2 (optional)" value={newAddress.line2} onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })} />
                          <Input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                          <Input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                          <Input placeholder="Postal Code" value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} />
                          <Input placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
                        </div>
                        <Button onClick={addAddress}>Add Address</Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                Delete Order
              </DialogTitle>
              <DialogDescription>
                {orderToDelete && (
                  <>
                    Are you sure you want to delete <strong>Order #{orders.find(o => o._id === orderToDelete)?._id.slice(-8)}</strong>?
                    <br /><br />
                    This action cannot be undone and will permanently remove this order from your history.
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setOrderToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteOrder}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
