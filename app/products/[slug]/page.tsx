import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { ProductDetailView } from '@/components/ProductDetailView';
import { Navigation } from '@/components/Navigation';

interface ProductPageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  await connectDB();
  
  const product = await Product.findOne({ slug: params.slug }).lean();
  
  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <ProductDetailView product={product} />
    </div>
  );
}