'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductManagement } from './ProductManagement';
import { OrderManagement } from './OrderManagement';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AdminDashboard() {
  const [stats, setStats] = useState<{ revenue: number; orders: number; products: number; customers: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        const res = await fetch('/api/admin/analytics?range=30d', { cache: 'no-store' });
        const data = await res.json();
        if (!isMounted) return;
        setStats({
          revenue: data.revenue || 0,
          orders: data.orders || 0,
          products: data.products || 0,
          customers: data.customers || 0,
        });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Initial load
    load();

    // Poll every 15 seconds for near real-time updates
    const intervalId = setInterval(load, 15000);

    // Listen for manual refresh events triggered by child components
    const onRefresh = () => load();
    window.addEventListener('admin:stats:refresh', onRefresh);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      window.removeEventListener('admin:stats:refresh', onRefresh);
    };
  }, []);

  // API returns cents; convert to dollars for display
  const formatCurrency = (amountInCents: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amountInCents / 100);
  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Mobile-First Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your e-commerce platform</p>
        </div>

        {/* Mobile-Responsive Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {loading || !stats ? '—' : formatCurrency(stats.revenue)}
              </div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {loading || !stats ? '—' : formatNumber(stats.orders)}
              </div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {loading || !stats ? '—' : formatNumber(stats.products)}
              </div>
              <p className="text-xs text-muted-foreground">Catalog size</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {loading || !stats ? '—' : formatNumber(stats.customers)}
              </div>
              <p className="text-xs text-muted-foreground">All customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Mobile-Responsive Tabs */}
        <Tabs defaultValue="analytics" className="space-y-4 sm:space-y-6">
          {/* Horizontal Scrolling Tabs on Mobile */}
          <div className="w-full overflow-x-auto">
            <TabsList className="grid grid-cols-3 w-full min-w-max sm:min-w-0 h-auto p-1">
              <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="products" className="text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
                Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
                Orders
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
            <div className="w-full overflow-hidden">
              <AnalyticsDashboard />
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4 sm:space-y-6">
            <div className="w-full overflow-hidden">
              <ProductManagement />
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4 sm:space-y-6">
            <div className="w-full overflow-hidden">
              <OrderManagement />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}