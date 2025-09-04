import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 py-16 space-y-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Careers at CartifyHub</h1>
          <p className="text-gray-700">Join a small, fast-moving team building the future of e‑commerce.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Why work with us</CardTitle></CardHeader>
            <CardContent className="text-gray-700 space-y-2">
              <p>Remote‑first culture with flexible hours.</p>
              <p>Meaningful ownership and impact on product direction.</p>
              <p>Competitive compensation and learning budget.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Open roles</CardTitle></CardHeader>
            <CardContent className="text-gray-700">
              We are not hiring right now. Introduce yourself at careers@cartifyhub.com.
            </CardContent>
          </Card>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle>Benefits</CardTitle></CardHeader>
            <CardContent className="text-gray-700 space-y-2">
              <p>Health stipend • Paid time off • Home office budget</p>
              <p>Learning allowance • Quarterly offsites</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Interview Process</CardTitle></CardHeader>
            <CardContent className="text-gray-700 space-y-2">
              <p>1) Intro call 2) Technical/portfolio 3) Collaboration exercise 4) Team chat</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Diversity</CardTitle></CardHeader>
            <CardContent className="text-gray-700">We’re an equal opportunity employer and welcome applicants from all backgrounds.</CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}


