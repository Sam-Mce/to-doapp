import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      email?: string;
      trialEnds?: string | Date;
      isSubscribed?: boolean;
    }
  }
}

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/auth/signin'
    }
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - auth (auth pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|auth|_next/static|_next/image|favicon.ico).*)',
  ],
}; 