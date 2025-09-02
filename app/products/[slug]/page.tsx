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

  const serializedProduct = {
    ...product,
    _id: String((product as any)._id),
    createdAt: (product as any).createdAt instanceof Date
      ? (product as any).createdAt.toISOString()
      : (product as any).createdAt,
    updatedAt: (product as any).updatedAt instanceof Date
      ? (product as any).updatedAt.toISOString()
      : (product as any).updatedAt,
  } as any;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <ProductDetailView product={serializedProduct} />
    </div>
  );
}