import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

export async function POST(_req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    if (!user?.isAdmin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

    const products = await Product.find({}).limit(20);
    if (products.length === 0) {
      return NextResponse.json({ error: 'No products found. Seed products first.' }, { status: 400 });
    }

    // Create 25 paid orders across the last 30 days
    const ordersToCreate: any[] = [];
    const now = new Date();
    for (let i = 0; i < 25; i++) {
      const itemsCount = Math.max(1, Math.floor(Math.random() * 4));
      const selected: any[] = [];
      for (let j = 0; j < itemsCount; j++) {
        const p = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.max(1, Math.floor(Math.random() * 3));
        selected.push({
          productId: p._id,
          name: p.name,
          price: p.price,
          quantity,
          image: p.images?.[0] || '',
        });
      }
      const subtotal = selected.reduce((sum, it) => sum + it.price * it.quantity, 0);
      const shipping = 0;
      const tax = Math.round(subtotal * 0.08);
      const total = subtotal + shipping + tax;
      const createdAt = new Date(now);
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 28));

      ordersToCreate.push({
        userId: user.clerkId,
        items: selected,
        subtotal,
        shipping,
        tax,
        total,
        currency: 'usd',
        status: 'paid',
        createdAt,
        updatedAt: createdAt,
      });
    }

    await Order.insertMany(ordersToCreate);

    return NextResponse.json({ success: true, created: ordersToCreate.length });
  } catch (err) {
    console.error('Seed orders failed', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


