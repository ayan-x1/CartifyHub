import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const user = await User.findOne({ clerkId: userId }).select('wishlist').lean();
  return NextResponse.json({ wishlist: (user as any)?.wishlist || [] });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { productId } = await request.json();
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });
  await connectDB();
  await User.updateOne({ clerkId: userId }, { $addToSet: { wishlist: productId } }, { upsert: true });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { productId } = await request.json();
  await connectDB();
  await User.updateOne({ clerkId: userId }, { $pull: { wishlist: productId } });
  return NextResponse.json({ ok: true });
}


