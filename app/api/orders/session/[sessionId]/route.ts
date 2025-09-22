import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Try to get user, but don't require it. In production (especially with dev Clerk keys),
    // strict auth here can fail and block users from seeing their success page.
    let userId: string | null = null;
    try {
      const res = await auth();
      userId = res?.userId || null;
    } catch {
      userId = null;
    }

    await connectDB();
    const { sessionId } = params;
    
    // Prefer matching by session only; if userId is present, include it to narrow results
    const query: any = { stripeSessionId: sessionId };
    if (userId) query.userId = userId;
    const order = await Order.findOne(query).lean();
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order by session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}