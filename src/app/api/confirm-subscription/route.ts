import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify the checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (checkoutSession.payment_status === 'paid') {
      // Update user subscription status
      await prisma.user.update({
        where: { email: session.user.email },
        data: { isSubscribed: true },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Payment not confirmed' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 