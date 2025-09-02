import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const user: any = await User.findOne({ clerkId: userId }).lean();
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({
    name: user.name || '',
    avatarUrl: user.avatarUrl || '',
    wishlist: user.wishlist || [],
    addresses: user.addresses || [],
  });
}

export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  await connectDB();
  const update: any = {};
  if (typeof body.name === 'string') update.name = body.name;
  if (typeof body.avatarUrl === 'string') update.avatarUrl = body.avatarUrl;
  const user: any = await User.findOneAndUpdate({ clerkId: userId }, update, { new: true, upsert: true });
  return NextResponse.json({ name: user.name || '', avatarUrl: user.avatarUrl || '' });
}


