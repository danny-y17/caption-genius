import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If the user is not authenticated, redirect to login
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

// Specify which routes to protect
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/captions/:path*',
    '/caption/:path*',
    '/generate/:path*',
    '/history/:path*',
    '/analytics/:path*',
    '/settings/:path*',
  ],
}; 