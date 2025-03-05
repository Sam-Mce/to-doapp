import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    resendKey: !!process.env.RESEND_API_KEY,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  });
} 