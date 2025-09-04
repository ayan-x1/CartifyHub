import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 py-16 space-y-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-700">These terms govern your access to and use of CartifyHub.</p>
        </div>

        <section className="max-w-3xl space-y-4 text-gray-700">
          <h2 className="text-2xl font-semibold">Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</p>

          <h2 className="text-2xl font-semibold mt-6">Purchases</h2>
          <p>By placing an order, you represent that you have the legal right to use the payment method provided. All orders are subject to availability and confirmation of the order price.</p>

          <h2 className="text-2xl font-semibold mt-6">Prohibited use</h2>
          <p>You may not misuse the site, attempt unauthorized access, or infringe intellectual property rights.</p>

          <h2 className="text-2xl font-semibold mt-6">Limitation of liability</h2>
          <p>To the maximum extent permitted by law, CartifyHub is not liable for indirect, incidental, or consequential damages.</p>

          <h2 className="text-2xl font-semibold mt-6">Changes</h2>
          <p>We may update these terms from time to time. Continued use constitutes acceptance of the revised terms.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}


