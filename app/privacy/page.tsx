import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 py-16 space-y-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-700">This policy explains how CartifyHub collects, uses, and safeguards your personal information.</p>
        </div>

        <section className="max-w-3xl space-y-4 text-gray-700">
          <h2 className="text-2xl font-semibold">Information we collect</h2>
          <p>Account data (name, email), order details, payment tokens (from Stripe), and usage analytics. We do not store raw card numbers.</p>

          <h2 className="text-2xl font-semibold mt-6">How we use your information</h2>
          <p>To fulfill orders, enable account features, prevent fraud, and improve the product. We never sell your data.</p>

          <h2 className="text-2xl font-semibold mt-6">Data retention</h2>
          <p>We retain order records for tax/audit requirements and delete or anonymize data when no longer needed.</p>

          <h2 className="text-2xl font-semibold mt-6">Your rights</h2>
          <p>You can access, correct, or delete your data by contacting support. Certain legal exceptions may apply.</p>

          <h2 className="text-2xl font-semibold mt-6">Security</h2>
          <p>We use industry‑standard encryption in transit and at rest, follow least‑privilege access, and audit systems regularly.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}


