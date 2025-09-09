'use client';

import Link from 'next/link';
import { User, Search, Menu, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useUser, UserButton } from '@clerk/nextjs';
import { CartSidebar } from './CartSidebar';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';

export function Navigation() {
  const { user, isLoaded } = useUser();
  const [cartOpen, setCartOpen] = useState(false);
  const itemCount = useCart((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <>
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            CartifyHub
          </Link>
          
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search products..." 
                className="pl-10"
              />
            </div>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/products">
              <Button variant="ghost" size="sm">
                Products
              </Button>
            </Link>
            
            {/* Cart button for desktop view */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCartOpen(true)}
              className="relative"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
            
            {isLoaded && user && (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>

                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
              </>
            )}
            {isLoaded && !user && (
              <div className="flex items-center space-x-2">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
          {/* Mobile menu */}
          <div className="md:hidden flex items-center space-x-2">
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-sm overflow-y-auto p-4 sm:p-6">
                <SheetTitle className="sr-only">Main menu</SheetTitle>
                <div className="space-y-4 mt-4">
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search products..." className="pl-10" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Link href="/products">
                      <Button variant="outline" className="w-full justify-start rounded-lg py-6">
                        <span className="font-medium">Products</span>
                      </Button>
                    </Link>
                    
                    {/* Cart button for mobile view */}
                    <Button 
                      variant="outline" 
                      className="w-full justify-start rounded-lg py-6 relative"
                      onClick={() => setCartOpen(true)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-3" />
                      <span className="font-medium">Cart</span>
                      {itemCount > 0 && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {itemCount}
                        </span>
                      )}
                    </Button>
                    
                    {isLoaded && user && (
                      <>
                        <Link href="/dashboard">
                          <Button variant="ghost" className="w-full justify-start rounded-lg py-6">
                            <User className="h-4 w-4 mr-3" />
                            <span className="font-medium">Dashboard</span>
                          </Button>
                        </Link>
                        <div className="flex flex-col space-y-4">

                          
                          <div className="mt-6 border-t pt-4">
                            <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-gray-50 shadow-sm">
                              <UserButton 
                                appearance={{
                                  elements: {
                                    avatarBox: "h-8 w-8"
                                  }
                                }}
                              />
                              <div className="flex-1">
                                <h3 className="text-sm font-medium">My Account</h3>
                                <p className="text-xs text-gray-500">Manage your profile</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {isLoaded && !user && (
                      <div className="mt-6 border-t pt-4 space-y-3">
                        <div className="px-2 py-3 rounded-lg bg-gray-50 shadow-sm">
                          <h3 className="text-sm font-medium mb-2">Account Access</h3>
                          <div className="flex gap-2">
                            <Link href="/sign-in">
                              <Button className="flex-1" variant="default">
                                Sign In
                              </Button>
                            </Link>
                            <Link href="/sign-up">
                              <Button className="flex-1" variant="outline">
                                Sign Up
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}