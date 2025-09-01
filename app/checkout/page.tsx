import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { CheckoutForm } from '@/components/CheckoutForm';
import { Navigation } from '@/components/Navigation';

export default async function CheckoutPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <CheckoutForm />
      </main>
    </div>
  );
}