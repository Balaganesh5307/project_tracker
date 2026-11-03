import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { signJwtToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials.' },
        { status: 400 }
      );
    }

    const token = signJwtToken({
      id: user._id.toString(),
      username: user.username,
    });

    return NextResponse.json({
      token,
      username: user.username,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error during login.' },
      { status: 500 }
    );
  }
}

