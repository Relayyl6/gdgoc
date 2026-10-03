/**
 * app/api/admin/logout/route.ts
 * POST /api/admin/logout
 * Clears the admin session cookie.
 */

import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Expire the cookie immediately
  response.cookies.set('gdgoc_admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
