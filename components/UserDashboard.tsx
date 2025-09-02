'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Package, ShoppingBag, User, Heart, Settings, LogOut } from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface Order {
  _id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    product: {
      name: string;
      images: string[];
      price: number;
    };
    quantity: number;
  }>;
  createdAt: string;
}

interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  joinDate: string;
}

export function UserDashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [wishlist, setWishlist] = useState<string[]>([]);
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

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchProfile();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // In a real app, fetch user orders and profile from your API
      // For now, using mock data
      const mockOrders: Order[] = [
        {
          _id: '1',
          orderNumber: 'ORD-001',
          status: 'delivered',
          total: 29999,
          items: [
            {
              product: {
                name: 'Wireless Headphones',
                images: ['/placeholder.jpg'],
                price: 29999
              },
              quantity: 1
            }
          ],
          createdAt: '2024-01-15'
        },
        {
          _id: '2',
          orderNumber: 'ORD-002',
          status: 'shipped',
          total: 8999,
          items: [
            {
              product: {
                name: 'Smart Watch',
                images: ['/placeholder.jpg'],
                price: 8999
              },
              quantity: 1
            }
          ],
          createdAt: '2024-01-20'
        }
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
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
        setWishlist(data.wishlist || []);
        setAddresses(data.addresses || []);
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const saveProfile = async () => {
    const res = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, avatarUrl }),
    });
    if (!res.ok) console.error('Failed to update profile');
  };

  const removeFromWishlist = async (productId: string) => {
    await fetch('/api/user/wishlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    setWishlist((prev) => prev.filter((id) => id !== productId));
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
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                <AvatarFallback className="text-lg">
                  {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.firstName || 'User'}!
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
                {orders.filter(order => ['pending', 'processing', 'shipped'].includes(order.status)).length}
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
                  {orders.slice(0, 3).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={order.items[0].product.images[0] || '/placeholder.jpg'}
                          alt={order.items[0].product.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div>
                          <h4 className="font-medium">{order.items[0].product.name}</h4>
                          <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatPrice(order.total)}</div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
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
                  {orders.map((order) => (
                    <div key={order._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">Order #{order.orderNumber}</h4>
                          <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatPrice(order.total)}</div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{item.product.name} x{item.quantity}</span>
                            <span>{formatPrice(item.product.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                      <AvatarFallback className="text-2xl">
                        {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{user?.fullName || 'User'}</h3>
                      <p className="text-gray-600">{user?.emailAddresses[0]?.emailAddress}</p>
                      <p className="text-sm text-gray-500">Member since {formatDate(new Date(user?.createdAt ?? Date.now()).toISOString())}</p>
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
                    <div className="border rounded-lg p-4 space-y-4">
                      {profileLoading ? (
                        <p className="text-sm text-gray-500">Loading...</p>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">Name</Label>
                              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div>
                              <Label htmlFor="avatar">Avatar URL</Label>
                              <Input id="avatar" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
                            </div>
                          </div>
                          <Button onClick={saveProfile}>Save Changes</Button>
                        </>
                      )}
                    </div>
                  )}
                  <Button variant="outline" className="w-full justify-start" onClick={() => setShowWishlist((s) => !s)}>
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Button>
                  {showWishlist && (
                    <div className="border rounded-lg p-4 space-y-3">
                      {wishlist.length === 0 && <p className="text-sm text-gray-500">No items yet.</p>}
                      {wishlist.map((id) => (
                        <div key={id} className="flex items-center justify-between text-sm">
                          <span>Product ID: {id}</span>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm" onClick={() => router.push(`/products/${id}`)}>View</Button>
                            <Button variant="destructive" size="sm" onClick={() => removeFromWishlist(id)}>Remove</Button>
                          </div>
                        </div>
                      ))}
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
      </div>
    </div>
  );
}
