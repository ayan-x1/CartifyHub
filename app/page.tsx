import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-16">
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Our Trending Products</h2>
          <ProductGrid page={1} limit={8} />
        </section>
      </main>
      <Footer />
    </div>
  );
}