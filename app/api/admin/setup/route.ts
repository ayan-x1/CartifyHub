import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    // For development purposes, we'll get the clerkId from the request body
    // In production, you should use proper authentication
    const { clerkId } = await request.json();
    
    if (!clerkId) {
      return NextResponse.json({ error: 'clerkId is required' }, { status: 400 });
    }

    await connectDB();
    
    // Check if user already exists
    let user = await User.findOne({ clerkId });
    
    if (!user) {
      // Create new user as admin
      user = await User.create({
        clerkId,
        email: 'admin@cartifyhub.com', // You can update this later
        name: 'Admin User',
        isAdmin: true,
      });
    } else {
      // Update existing user to be admin
      user.isAdmin = true;
      await user.save();
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Admin access granted',
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
