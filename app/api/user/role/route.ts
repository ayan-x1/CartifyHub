import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Find user in database
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      // If user doesn't exist in database, create them with default user role
      const newUser = new User({
        clerkId: userId,
        email: '', // Will be updated when user signs in
        isAdmin: false, // Default to regular user
      });
      
      await newUser.save();
      
      return NextResponse.json({ isAdmin: false });
    }
    
    return NextResponse.json({ isAdmin: user.isAdmin });
  } catch (error) {
    console.error('Error checking user role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
