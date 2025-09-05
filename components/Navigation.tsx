'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
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
            {isLoaded && user && (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCartOpen(true)}
                  className="relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                </Button>
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
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-sm">
                <SheetTitle className="sr-only">Main menu</SheetTitle>
                <div className="space-y-4 mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search products..." className="pl-10" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Link href="/products">
                      <Button variant="outline" className="w-full">Products</Button>
                    </Link>
                    {isLoaded && user && (
                      <>
                        <Link href="/dashboard">
                          <Button variant="ghost" className="w-full">
                            <User className="h-4 w-4 mr-2" />
                            Dashboard
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={() => setCartOpen(true)}
                          className="w-full justify-start relative"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Cart
                          <span className="absolute right-4 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {itemCount}
                          </span>
                        </Button>
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
                      <>
                        <Link href="/sign-in">
                          <Button variant="ghost" className="w-full">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/sign-up">
                          <Button className="w-full">
                            Sign Up
                          </Button>
                        </Link>
                      </>
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