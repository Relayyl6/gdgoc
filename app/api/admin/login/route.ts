/**
 * app/api/admin/login/route.ts
 * POST /api/admin/login
 * Authenticates admin credentials and sets an httpOnly session cookie.
 */

import { NextRequest, NextResponse } from 'next/server';
import { signAdminIn } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 },
      );
    }

    const result = signAdminIn(email, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials.' },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true });

    // httpOnly cookie — not accessible from JavaScript
    response.cookies.set('gdgoc_admin_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (e) {
    console.error('Action failed:', e);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 },
    );
  }
}
