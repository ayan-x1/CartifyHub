import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Fetch the latest profile data from Clerk
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    const primaryEmail = clerkUser.emailAddresses?.find((e: any) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress
      || clerkUser.emailAddresses?.[0]?.emailAddress
      || '';
    const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || clerkUser.username || '';
    const imageUrl = clerkUser.imageUrl || '';
    const phoneNumber = clerkUser.phoneNumbers?.[0]?.phoneNumber || '';

    // Upsert user in our database with Clerk data
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $set: {
          email: primaryEmail,
          name: fullName,
          avatarUrl: imageUrl,
          phone: phoneNumber,
        },
        $setOnInsert: {
          isAdmin: false,
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ isAdmin: updatedUser.isAdmin });
  } catch (error) {
    console.error('Error checking user role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
