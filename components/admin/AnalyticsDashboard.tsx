'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package } from 'lucide-react';

// Recharts is client-safe; this component is client-only ('use client')

interface AnalyticsData {
  revenue: number;
  orders: number;
  customers: number;
  products: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  productsChange: number;
  revenueData: Array<{ date: string; revenue: number }>;
  topProducts: Array<{ name: string; sold: number }>;
  categoryDistribution: Array<{ category: string; count: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Measure parent width to avoid zero-width Recharts containers
type SizeRender = (dims: { width: number; height: number }) => React.ReactNode;
function AutoSize({ height, children }: { height: number; children: SizeRender }) {
  const [width, setWidth] = useState(0);
  const containerRef = useState<HTMLDivElement | null>(null)[0] as any;
  const setRef = (node: HTMLDivElement | null) => {
    (AutoSize as any)._node = node;
    if (!node) return;
    const resize = () => setWidth(node.clientWidth || 0);
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(node);
    (AutoSize as any)._ro = ro;
  };
  return (
    <div ref={setRef} className="w-full min-w-0" style={{ height }}>
      {width > 0 ? children({ width, height }) : null}
    </div>
  );
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) {
        console.error('Analytics API error:', data?.error || 'Unknown error');
        setAnalytics(null);
      } else {
        const safeData: AnalyticsData = {
          revenue: Number(data?.revenue) || 0,
          orders: Number(data?.orders) || 0,
          customers: Number(data?.customers) || 0,
          products: Number(data?.products) || 0,
          revenueChange: Number(data?.revenueChange) || 0,
          ordersChange: Number(data?.ordersChange) || 0,
          customersChange: Number(data?.customersChange) || 0,
          productsChange: Number(data?.productsChange) || 0,
          revenueData: Array.isArray(data?.revenueData) ? data.revenueData : [],
          topProducts: Array.isArray(data?.topProducts) ? data.topProducts : [],
          categoryDistribution: Array.isArray(data?.categoryDistribution) ? data.categoryDistribution : [],
        };
        setAnalytics(safeData);
        // Nudge Recharts to recalc sizes after data arrives
        requestAnimationFrame(() => {
          try { window.dispatchEvent(new Event('resize')); } catch {}
          setTimeout(() => { try { window.dispatchEvent(new Event('resize')); } catch {} }, 50);
        });
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format((amount || 0) / 100);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 animate-pulse rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Show helpful message when unauthorized or analytics missing
  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Access Required</CardTitle>
          <CardDescription>
            You do not have permission to view analytics. Grant yourself admin access to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/admin/setup"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Go to Admin Setup
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-gray-50"
            >
              Return Home
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Analytics Overview</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.revenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.revenueChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {Math.abs(analytics.revenueChange)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.orders)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.ordersChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {Math.abs(analytics.ordersChange)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.customers)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.customersChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {Math.abs(analytics.customersChange)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.products)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.productsChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {Math.abs(analytics.productsChange)}% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.revenueData && analytics.revenueData.length > 0 ? (
              <AutoSize height={300}>
                {({ width, height }) => (
                  <ResponsiveContainer width={width} height={height}>
                    <LineChart data={analytics.revenueData} margin={{ top: 8, right: 12, bottom: 8, left: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis width={60} />
                      <Tooltip 
                        formatter={(value: unknown) => [formatCurrency(Number(value)), 'Revenue']}
                        labelFormatter={(label: unknown) => `Date: ${String(label)}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </AutoSize>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>No revenue data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Products with highest sales volume</CardDescription>
          </CardHeader>
          <CardContent>
          {analytics.topProducts && analytics.topProducts.length > 0 ? (
              <AutoSize height={300}>
                {({ width, height }) => (
                  <ResponsiveContainer width={width} height={height}>
                    <BarChart data={analytics.topProducts} margin={{ top: 8, right: 12, bottom: 8, left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: unknown) => [value as string | number, 'Units Sold']} />
                      <Bar dataKey="sold" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </AutoSize>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <p>No product data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
          <CardDescription>Product distribution across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AutoSize height={360}>
              {({ width, height }) => (
                <ResponsiveContainer width={width} height={height}>
                  <PieChart>
                    <Pie
                      data={analytics.categoryDistribution || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => `${entry.category} ${(entry.percent * 100).toFixed(0)}%`}
                      outerRadius={Math.max(110, Math.min(170, Math.floor(Math.min(width, height) / 2 - 12)))}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {(analytics.categoryDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: unknown) => [value as string | number, 'Products']} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </AutoSize>
            
            <div className="space-y-3">
              {(analytics.categoryDistribution || []).map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{category.category}</span>
                  </div>
                  <Badge variant="secondary">{category.count} products</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}