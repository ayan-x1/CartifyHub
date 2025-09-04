import { ProductGrid } from '@/components/ProductGrid';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_TITLES: Record<string, string> = {
  electronics: 'Electronics',
  fashion: 'Fashion',
  home: 'Home & Garden',
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Await the params Promise
  const { category } = await params;
  const title = CATEGORY_TITLES[category] || category.replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <section>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600">Browse the latest in {title.toLowerCase()}.</p>
          </div>
          <ProductGrid category={category} />
        </section>
      </main>
      <Footer />
    </div>
  );
}