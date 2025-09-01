import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <main className="container mx-auto px-4 py-16">
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <ProductGrid />
        </section>
      </main>
      <Footer />
    </div>
  );
}