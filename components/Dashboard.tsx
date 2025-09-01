'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { AdminDashboard } from './admin/AdminDashboard';
import { UserDashboard } from './UserDashboard';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Crown, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from './ui/badge';

export function Dashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      checkUserRole();
    }
  }, [isLoaded, user]);

  const checkUserRole = async () => {
    try {
      // Check if user exists in your database and get their role
      const response = await fetch('/api/user/role', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserRole(data.isAdmin ? 'admin' : 'user');
      } else {
        // If no role found, default to user
        setUserRole('user');
      }
    } catch (error) {
      console.error('Failed to check user role:', error);
      // Default to user role on error
      setUserRole('user');
    } finally {
      setLoading(false);
    }
  };

  const switchToUserDashboard = () => {
    setUserRole('user');
  };

  const switchToAdminDashboard = () => {
    setUserRole('admin');
  };

  const goToShop = () => {
    router.push('/products');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => router.push('/sign-in')} className="w-full">
              Sign In
            </Button>
            <Button variant="outline" onClick={() => router.push('/')} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is admin, show role switcher
  if (userRole === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Role Switcher Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-gray-900">Admin Mode</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Administrator
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={switchToUserDashboard}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Switch to User View</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToShop}>
                Go to Shop
              </Button>
            </div>
          </div>
        </div>
        
        {/* Admin Dashboard Content */}
        <AdminDashboard />
      </div>
    );
  }

  // If user is regular user, show user dashboard with admin access option
  if (userRole === 'user') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Role Switcher Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">User Mode</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Customer
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={switchToAdminDashboard}
                className="flex items-center space-x-2"
              >
                <Crown className="h-4 w-4" />
                <span>Switch to Admin View</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToShop}>
                Go to Shop
              </Button>
            </div>
          </div>
        </div>
        
        {/* User Dashboard Content */}
        <UserDashboard />
      </div>
    );
  }

  // Fallback - should not reach here
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Error</CardTitle>
          <CardDescription>Unable to determine user role</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()} className="w-full">
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
