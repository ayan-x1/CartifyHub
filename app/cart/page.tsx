'use client';

 import { Navigation } from '@/components/Navigation';
 import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { ArrowLeft, ShoppingCart, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  // This is a Client Component wrapper so we can use the cart store
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <CartContent />
      </main>
    </div>
  );
}


function CartContent() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  const subtotal = getTotal();
  const shipping = subtotal > 5000 ? 0 : 500;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;
  const hasItems = items.length > 0;

  return (
    <div className={hasItems ? "grid grid-cols-1 lg:grid-cols-3 gap-6" : "grid grid-cols-1 gap-6"}>
      <section className={hasItems ? "lg:col-span-2 space-y-3" : "col-span-1 space-y-3"}>
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Cart</h1>
              <p className="text-gray-600">Review items and proceed to checkout</p>
            </div>
          </div>
        </div>
        {!hasItems ? (
          <div className="border rounded-xl p-8 sm:p-16 min-h-[370px] flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
            <p className="text-gray-600 mb-6">Start shopping to see your items here</p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="rounded-md object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{item.name}</h4>
                <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8"
                  onClick={() => updateQuantity(item.productId, Math.max(0, item.quantity - 1))}>-</Button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <Button variant="outline" size="icon" className="h-8 w-8"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</Button>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8"
                onClick={() => removeItem(item.productId)}>×</Button>
            </div>
          ))
        )}
      </section>
      {hasItems && (
        <aside className="lg:col-span-1 h-fit border rounded-lg p-4 sm:p-5 space-y-3">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatPrice(tax)}</span></div>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold"><span>Total</span><span>{formatPrice(total)}</span></div>
          <Link href="/checkout" className="block"><Button className="w-full py-6">Checkout</Button></Link>
          <Button variant="outline" className="w-full" onClick={clearCart}>Clear Cart</Button>
        </aside>
      )}
    </div>
  );
}


