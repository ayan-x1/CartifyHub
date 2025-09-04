import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 py-16 space-y-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">About CartifyHub</h1>
          <p className="text-gray-700">We’re building a next-generation commerce platform with rich media product experiences, real‑time analytics, and a developer‑first stack.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle>Our Mission</CardTitle></CardHeader>
            <CardContent className="text-gray-700">Make online shopping delightful, trustworthy, and immersive for shoppers and merchants worldwide.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Our Stack</CardTitle></CardHeader>
            <CardContent className="text-gray-700">Next.js, TypeScript, MongoDB, Stripe, Clerk, and Three.js power a secure, scalable platform.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Our Values</CardTitle></CardHeader>
            <CardContent className="text-gray-700">Customer Obsession • Quality • Security • Accessibility • Sustainability</CardContent>
          </Card>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Milestones</CardTitle></CardHeader>
            <CardContent className="text-gray-700 space-y-2">
              <p>2024: Project inception and prototype launch.</p>
              <p>2025: Public beta with 3D viewer and secure checkout.</p>
              <p>Roadmap: Marketplace features and merchant tools.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Team</CardTitle></CardHeader>
            <CardContent className="text-gray-700">We are a remote, multidisciplinary team of engineers and designers obsessed with customer experience.</CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}


