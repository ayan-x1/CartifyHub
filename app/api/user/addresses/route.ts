import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const user: any = await User.findOne({ clerkId: userId }).select('addresses').lean();
  return NextResponse.json({ addresses: user?.addresses || [] });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const address = await request.json();
  await connectDB();
  const user: any = await User.findOneAndUpdate(
    { clerkId: userId },
    { $push: { addresses: address } },
    { new: true, upsert: true }
  );
  return NextResponse.json({ addresses: user.addresses });
}

export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { addressId, update, setDefault } = await request.json();
  await connectDB();
  if (setDefault && addressId) {
    await User.updateOne({ clerkId: userId }, { $set: { 'addresses.$[].isDefault': false } });
    await User.updateOne({ clerkId: userId, 'addresses._id': addressId }, { $set: { 'addresses.$.isDefault': true } });
    return NextResponse.json({ ok: true });
  }
  if (addressId && update) {
    await User.updateOne({ clerkId: userId, 'addresses._id': addressId }, { $set: Object.fromEntries(Object.entries(update).map(([k, v]) => [`addresses.$.${k}`, v])) });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
}

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { addressId } = await request.json();
  await connectDB();
  await User.updateOne({ clerkId: userId }, { $pull: { addresses: { _id: addressId } } });
  return NextResponse.json({ ok: true });
}


