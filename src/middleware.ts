import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth';

// Routes that don't require authentication
const publicRoutes = ['/admin/login'];

// Routes that require authentication
const protectedRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for non-admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow public routes
  if (publicRoutes.some((route) => pathname === route)) {
    // If already logged in, redirect to dashboard
    const session = await withAuth(request);
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const session = await withAuth(request);

    if (!session) {
      // Redirect to login page
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
