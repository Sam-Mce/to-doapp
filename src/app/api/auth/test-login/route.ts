import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Find or create test user
    let user = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          trialEnds: addDays(new Date(), 2),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Test login error:', error);
    return NextResponse.json({ error: 'Failed to create test user' }, { status: 500 });
  }
} 