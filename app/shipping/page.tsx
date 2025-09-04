import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 py-16 space-y-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
          <p className="text-gray-700">Shipping timelines, costs, and service levels for domestic and international orders.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle>Processing</CardTitle></CardHeader>
            <CardContent className="text-gray-700 space-y-2">
              <p>Orders are processed within 1–2 business days (Mon–Fri, excluding holidays).</p>
              <p>Peak seasons may extend processing by 1–2 days.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Delivery Speeds</CardTitle></CardHeader>
            <CardContent className="text-gray-700 space-y-2">
              <p>Standard: 3–7 business days.</p>
              <p>Express: 1–3 business days.</p>
              <p>Overnight: next business day in eligible areas.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Tracking</CardTitle></CardHeader>
            <CardContent className="text-gray-700 space-y-2">
              <p>Tracking is provided by email once your order ships.</p>
              <p>All shipments are insured against loss or damage.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>International</CardTitle></CardHeader>
            <CardContent className="text-gray-700 space-y-2">
              <p>Transit times vary by destination and customs processing.</p>
              <p>Import duties and taxes are the recipient’s responsibility unless specified.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Failed Delivery</CardTitle></CardHeader>
            <CardContent className="text-gray-700 space-y-2">
              <p>If a delivery is returned to sender, we’ll contact you to reship or refund the order.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}


