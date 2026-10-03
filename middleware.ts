/**
 * middleware.ts  (project root)
 * Protects all /admin/* routes except /admin/login.
 * Reads the gdgoc_admin_token cookie and redirects unauthenticated
 * visitors to /admin/login.
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin and /events/create routes
  if (!pathname.startsWith('/admin') && pathname !== '/events/create') {
    return NextResponse.next();
  }

  // Allow the login page through unconditionally
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    return NextResponse.next();
  }

  // Verify the session cookie
  if (!isAdminRequest(request)) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/events/create'],
};
