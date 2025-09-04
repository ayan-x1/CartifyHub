"use client";
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  
  
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
    } else {
      // eslint-disable-next-line no-console
      console.warn('EmailJS public key is missing. Set NEXT_PUBLIC_EMAILJS_PUBLIC_KEY');
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return;
    setSending(true);
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS environment variables are not configured.');
      }

      await emailjs.send(serviceId, templateId, {
        from_name: form.name,
        from_email: form.email,
        subject: form.subject,
        message: form.message,
      });
      toast.success('Thanks! Your message has been sent.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Email send failed:', err);
      // eslint-disable-next-line no-console
      if (err && typeof err === 'object') {
        console.error('EmailJS error details:', {
          status: (err as any)?.status,
          text: (err as any)?.text,
          body: (err as any)?.body,
        });
      }
      try {
        // eslint-disable-next-line no-console
        console.error('Serialized error:', JSON.stringify(err));
      } catch {}
      toast.error(
        (err && err.message) || (err && err.text) || 'Failed to send message. Please try again later.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-gray-700 max-w-3xl mb-8">Have questions about pricing, enterprise, partnerships, or support? Send us a message and we’ll get back within 1 business day.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <Input placeholder="Your email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
              <Textarea placeholder="Message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              <Button type="submit" disabled={sending}>
                {sending ? 'Sending...' : 'Send message'}
              </Button>
            </form>
          </div>
          <div className="space-y-2">
            <div>
              <p className="font-medium">Sales</p>
              <p className="text-gray-600 text-sm">For enterprise and partnerships</p>
            </div>
            <div>
              <p className="font-medium">Support</p>
              <p className="text-gray-600 text-sm">help@cartifyhub.com</p>
            </div>
            <div>
              <p className="font-medium">Address</p>
              <p className="text-gray-600 text-sm">Remote-first</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

