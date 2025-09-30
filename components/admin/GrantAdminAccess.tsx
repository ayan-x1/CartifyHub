'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, UserCheck, AlertCircle } from 'lucide-react';

interface GrantAdminAccessProps {
  clerkId: string;
  existingUser?: any;
}

export function GrantAdminAccess({ clerkId, existingUser }: GrantAdminAccessProps) {
  const [isGranting, setIsGranting] = useState(false);
  const [isGranted, setIsGranted] = useState(false);
  const [error, setError] = useState('');

  const grantAdminAccess = async () => {
    setIsGranting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clerkId }),
      });

      if (response.ok) {
        setIsGranted(true);
        // Verify that the role endpoint now returns isAdmin: true, then redirect
        try {
          const check = await fetch('/api/user/role', { cache: 'no-store' });
          if (check.ok) {
            const data = await check.json();
            if (data?.isAdmin) {
              window.location.href = '/admin';
              return;
            }
          }
        } catch {}
        // Fallback: reload to pick up new role if immediate check failed
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to grant admin access');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsGranting(false);
    }
  };

  if (isGranted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Admin Access Granted!</CardTitle>
            <CardDescription>
              Redirecting to admin dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle>Admin Access Required</CardTitle>
          <CardDescription>
            {existingUser 
              ? 'Your account exists but needs admin privileges to access this page.'
              : 'Your account needs to be set up with admin privileges.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}
          
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>User ID:</strong> {clerkId}</p>
            {existingUser && (
              <p><strong>Email:</strong> {existingUser.email}</p>
            )}
          </div>

          <Button 
            onClick={grantAdminAccess} 
            disabled={isGranting}
            className="w-full"
          >
            {isGranting ? 'Granting Access...' : 'Grant Admin Access'}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            This will create or update your user account with admin privileges.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
