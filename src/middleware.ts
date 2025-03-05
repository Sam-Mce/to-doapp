import { withAuth } from "next-auth/middleware";

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
  function middleware() {
    // Your middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: ["/api/todos/:path*", "/api/tips/:path*"]
}; 