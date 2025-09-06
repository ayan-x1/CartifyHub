import { ProductGrid } from '@/components/ProductGrid';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-16">
        <section>
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our amazing collection of products with immersive 3D previews and detailed information.
            </p>
          </div>
          <ProductGrid />
        </section>
      </main>
      <Footer />
    </div>
  );
}
