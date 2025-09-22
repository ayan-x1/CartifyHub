import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { items } = await request.json();
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    await connectDB();

    // Determine base URL dynamically to avoid localhost leaks in production
    const originHeader = request.headers.get('origin');
    const forwardedProto = request.headers.get('x-forwarded-proto');
    const forwardedHost = request.headers.get('x-forwarded-host');
    const derivedOrigin = (forwardedProto && forwardedHost)
      ? `${forwardedProto}://${forwardedHost}`
      : originHeader || new URL(request.url).origin;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || derivedOrigin || 'https://cartifyhub.onrender.com';

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 5000 ? 0 : 500; // Free shipping over $50
    const tax = Math.round(subtotal * 0.08); // 8% tax
    const total = subtotal + shipping + tax;

    // Create order in database
    const order = await Order.create({
      userId,
      items,
      subtotal,
      shipping,
      tax,
      total,
      status: 'pending'
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        ...items.map((item: any) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: item.price,
          },
          quantity: item.quantity,
        })),
        ...(shipping > 0 ? [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Shipping',
            },
            unit_amount: shipping,
          },
          quantity: 1,
        }] : []),
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Tax',
            },
            unit_amount: tax,
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    // Update order with session ID
    await Order.findByIdAndUpdate(order._id, {
      stripeSessionId: session.id
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}