import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 py-16 space-y-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Returns & Refunds</h1>
          <p className="text-gray-700">We want you to love your purchase. If not, our return policy is straightforward.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle>Eligibility</CardTitle></CardHeader>
            <CardContent className="text-gray-700 space-y-2">
              <p>30 days from delivery for most items.</p>
              <p>Items must be unused and in original packaging.</p>
              <p>Proof of purchase is required.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Process</CardTitle></CardHeader>
            <CardContent className="text-gray-700 space-y-2">
              <p>Start from Dashboard → Orders → Select order → Request return.</p>
              <p>We’ll email a prepaid label for eligible returns.</p>
              <p>Refunds are issued within 5–7 business days after inspection.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Exceptions</CardTitle></CardHeader>
            <CardContent className="text-gray-700 space-y-2">
              <p>Final-sale items, digital goods, and used consumables are non-returnable.</p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl space-y-4 text-gray-700">
          <h2 className="text-2xl font-semibold">Return FAQs</h2>
          <div className="space-y-3">
            <div>
              <p className="font-medium">How long do refunds take?</p>
              <p>After we receive and inspect your item, refunds post in 5–7 business days depending on your bank.</p>
            </div>
            <div>
              <p className="font-medium">Can I exchange for a different item?</p>
              <p>Yes—request an exchange during the return flow and we’ll ship the replacement once the return is in transit.</p>
            </div>
            <div>
              <p className="font-medium">Who pays return shipping?</p>
              <p>We provide a prepaid label for eligible returns due to defects or errors; otherwise a small restocking fee may apply.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Need help with a return?</h3>
          <p className="text-gray-700">Contact Support from the Contact page or email help@cartifyhub.com with your order number. We’re here to help.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}


