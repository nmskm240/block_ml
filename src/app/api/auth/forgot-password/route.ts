
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { randomBytes } from 'crypto';
import { promisify } from 'util';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal that the user doesn't exist.
      // Just send a success response.
      return NextResponse.json({ message: 'If an account with this email exists, a password reset link has been sent.' });
    }

    // Generate a password reset token
    const randomBytesAsync = promisify(randomBytes);
    const token = (await randomBytesAsync(32)).toString('hex');
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now

    // Store the token in the database
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // In a real application, you would send an email here.
    // For this example, we'll just log it to the console.
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    console.log(`Password reset link: ${resetLink}`);

    return NextResponse.json({ message: 'If an account with this email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
