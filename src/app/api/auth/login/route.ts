import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.isBlocked) {
      return NextResponse.json(
        { error: 'Your student account has been temporarily restricted by the board administrator.' },
        { status: 403 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Update streak if active on a new day
    const now = new Date();
    let newStreak = user.streak;
    if (user.lastActiveDate) {
      const last = new Date(user.lastActiveDate);
      const diffHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
      if (diffHours >= 20 && diffHours <= 48) {
        newStreak += 1;
      } else if (diffHours > 48) {
        newStreak = 1;
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastActiveDate: now,
        streak: newStreak,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      className: user.className,
    });

    const userSafe = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      className: user.className,
      phone: user.phone,
      streak: newStreak,
    };

    const response = NextResponse.json({ success: true, user: userSafe });

    response.cookies.set('fbise_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error during sign in' }, { status: 500 });
  }
}
