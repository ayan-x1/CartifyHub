'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Hero3D } from './Hero3D';
import Link from 'next/link';
import { useState } from 'react';

export function Hero() {
  const [show3D, setShow3D] = useState(true);

  const handle3DError = () => {
    setShow3D(false);
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Next-Gen
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  E-commerce
                </span>
                Experience
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Discover products like never before with our immersive 3D preview technology. 
                Shop with confidence and style.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="group">
                  Explore Products
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
            <div className="flex items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>3D Preview</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Fast Shipping</span>
              </div>
            </div>
          </div>
          <div className="relative">
            {show3D ? (
              <Hero3D onError={handle3DError} />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl mb-4">🚀</div>
                  <div className="text-xl font-semibold text-gray-700 mb-2">Interactive Experience</div>
                  <div className="text-gray-600">Explore our products with immersive 3D previews</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}