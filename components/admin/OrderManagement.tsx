'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Search, Eye, Package, Truck, CheckCircle, XCircle, Calendar, User, CreditCard, MapPin } from 'lucide-react';
import { IOrder } from '@/models/Order';
import { Types } from 'mongoose';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  failed: 'bg-red-100 text-red-800',
  fulfilled: 'bg-green-100 text-green-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const statusIcons = {
  pending: Package,
  paid: Package,
  failed: XCircle,
  fulfilled: CheckCircle,
  refunded: XCircle,
};

export function OrderManagement() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const openOrderDetails = (order: IOrder) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const closeOrderDetails = () => {
    setIsDetailsOpen(false);
    setSelectedOrder(null);
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.items.some(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || (order._id as Types.ObjectId).toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>Manage customer orders and fulfillment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>Manage customer orders and fulfillment</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search orders by ID or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="fulfilled">Fulfilled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
              
              return (
                                 <div key={(order._id as Types.ObjectId).toString()} className="border rounded-lg p-4 space-y-4">
                  {/* Order Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="h-5 w-5 text-gray-500" />
                        <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                                             <span className="text-sm text-gray-500">
                         Order #{(order._id as Types.ObjectId).toString().slice(-8)}
                       </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatPrice(order.total)}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(order.createdAt.toString())}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-gray-500">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-sm text-gray-600">
                      <span>Customer ID: {order.userId.slice(-8)}</span>
                      {order.trackingNumber && (
                        <span className="ml-4">
                          Tracking: {order.trackingNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openOrderDetails(order)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {order.status === 'paid' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateOrderStatus((order._id as Types.ObjectId).toString(), 'fulfilled')}
                        >
                          <Truck className="h-4 w-4 mr-2" />
                          Mark Fulfilled
                        </Button>
                      )}
                      {order.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateOrderStatus((order._id as Types.ObjectId).toString(), 'paid')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Details - #{(selectedOrder._id as Types.ObjectId).toString().slice(-8)}
                </DialogTitle>
                <DialogDescription>
                  Complete order information and customer details
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Order Status and Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-600">Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className={statusColors[selectedOrder.status as keyof typeof statusColors]}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </Badge>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-600">Total Amount</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatPrice(selectedOrder.total)}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-600">Order Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDate(selectedOrder.createdAt.toString())}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Customer ID:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {selectedOrder.userId}
                        </code>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Tracking Number:</span>
                          <code className="bg-blue-100 px-2 py-1 rounded text-sm">
                            {selectedOrder.trackingNumber}
                          </code>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="font-medium text-lg">{item.name}</h4>
                              <p className="text-gray-600">Quantity: {item.quantity}</p>
                              <p className="text-gray-600">Price per item: {formatPrice(item.price)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>{formatPrice(selectedOrder.subtotal)}</span>
                      </div>
                      {selectedOrder.shipping > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping:</span>
                          <span>{formatPrice(selectedOrder.shipping)}</span>
                        </div>
                      )}
                      {selectedOrder.tax > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span>{formatPrice(selectedOrder.tax)}</span>
                        </div>
                      )}
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span>{formatPrice(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedOrder.stripeSessionId && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Stripe Session ID:</span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {selectedOrder.stripeSessionId}
                          </code>
                        </div>
                      )}
                      {selectedOrder.stripePaymentIntentId && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Payment Intent ID:</span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {selectedOrder.stripePaymentIntentId}
                          </code>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={closeOrderDetails}>
                    Close
                  </Button>
                  {selectedOrder.status === 'paid' && (
                    <Button
                      onClick={() => {
                        updateOrderStatus((selectedOrder._id as Types.ObjectId).toString(), 'fulfilled');
                        closeOrderDetails();
                      }}
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Mark Fulfilled
                    </Button>
                  )}
                  {selectedOrder.status === 'pending' && (
                    <Button
                      onClick={() => {
                        updateOrderStatus((selectedOrder._id as Types.ObjectId).toString(), 'paid');
                        closeOrderDetails();
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Paid
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}