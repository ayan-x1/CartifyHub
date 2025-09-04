import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 py-16 space-y-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-gray-700">Welcome to CartifyHub Support. Below you’ll find guidance on orders, payments, shipping, returns, and accounts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">
              <p><strong>Order status:</strong> Track your order from the Dashboard → Orders.</p>
              <p><strong>Editing/canceling:</strong> You can cancel or modify an order until it ships.</p>
              <p><strong>Invoices:</strong> A tax invoice is emailed on payment and available in Orders.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">
              <p><strong>Methods:</strong> We accept major cards and wallets via Stripe.</p>
              <p><strong>Security:</strong> All transactions are PCI-DSS compliant with TLS 1.2+ encryption.</p>
              <p><strong>Refunds:</strong> Approved refunds are returned to the original method.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">
              <p><strong>Processing:</strong> 1–2 business days. Peak season may vary.</p>
              <p><strong>Tracking:</strong> Live tracking number is emailed when dispatched.</p>
              <p><strong>International:</strong> Duties/taxes may apply depending on destination.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">
              <p><strong>Window:</strong> 30-day returns on most items in original condition.</p>
              <p><strong>Process:</strong> Request a return from Dashboard → Orders → Return.</p>
              <p><strong>Exclusions:</strong> Final-sale items and used consumables are not returnable.</p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold mb-3">Frequently asked questions</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <p className="font-medium">When will my order ship?</p>
              <p>Within 1–2 business days. You’ll receive an email with tracking once shipped.</p>
            </div>
            <div>
              <p className="font-medium">Can I change my shipping address?</p>
              <p>Yes, before dispatch. Contact support with your order number as soon as possible.</p>
            </div>
            <div>
              <p className="font-medium">How do warranties work?</p>
              <p>Most electronics include a 12‑month limited warranty against manufacturing defects.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


